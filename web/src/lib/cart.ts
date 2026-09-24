import { prisma } from "@/lib/prisma";

// A hydrated cart line — same shape the client CartProvider uses, so the DB is
// a drop-in source of truth for logged-in customers.
export type ServerCartLine = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  color: string;
  size: string;
  price: number;
  image?: string;
  maxStock: number;
  quantity: number;
};

export async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });
}

/** All lines for a user's cart, hydrated + stock-clamped. */
export async function getCartLines(userId: string): Promise<ServerCartLine[]> {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: { include: { variant: { include: { product: true } } } },
    },
  });
  if (!cart) return [];

  return cart.items
    .filter((it) => it.variant && it.variant.product)
    .map((it) => ({
      variantId: it.variantId,
      productId: it.variant.productId,
      slug: it.variant.product.slug,
      name: it.variant.product.name,
      color: it.variant.color,
      size: it.variant.size,
      price: it.variant.product.price,
      image: it.variant.images[0],
      maxStock: it.variant.stock,
      quantity: Math.min(it.quantity, it.variant.stock),
    }))
    .filter((l) => l.quantity > 0);
}

/** Add to cart (increment), clamped to available stock. */
export async function addToCart(
  userId: string,
  variantId: string,
  quantity: number,
) {
  const variant = await prisma.variant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error("Variant not found");
  const cart = await getOrCreateCart(userId);

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
  });
  const nextQty = Math.min(
    (existing?.quantity ?? 0) + quantity,
    variant.stock,
  );

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: Math.max(1, nextQty) },
    create: { cartId: cart.id, variantId, quantity: Math.max(1, nextQty) },
  });
}

/** Set an exact quantity (0 removes the line). */
export async function setCartQty(
  userId: string,
  variantId: string,
  quantity: number,
) {
  const cart = await getOrCreateCart(userId);
  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
    return;
  }
  const variant = await prisma.variant.findUnique({ where: { id: variantId } });
  if (!variant) throw new Error("Variant not found");
  const qty = Math.min(quantity, variant.stock);
  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId } },
    update: { quantity: qty },
    create: { cartId: cart.id, variantId, quantity: qty },
  });
}

export async function removeFromCart(userId: string, variantId: string) {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id, variantId } });
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

/** Merge guest (localStorage) lines into the DB cart on login. */
export async function mergeGuestCart(
  userId: string,
  lines: { variantId: string; quantity: number }[],
) {
  for (const l of lines) {
    if (l.variantId && l.quantity > 0) {
      try {
        await addToCart(userId, l.variantId, l.quantity);
      } catch {
        /* skip invalid/deleted variants */
      }
    }
  }
}
