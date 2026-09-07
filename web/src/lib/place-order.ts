import { prisma } from "@/lib/prisma";
import type { Shipping } from "@/lib/shipping";
import type { OrderStatus } from "@prisma/client";

type Payment = {
  status: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

export class OrderError extends Error {}

/**
 * Places an order from the user's DB cart in a single transaction:
 * re-validates stock, snapshots line items, decrements stock, clears the cart.
 * Totals are computed server-side from the DB — never trusted from the client.
 */
export async function placeOrderFromCart(
  userId: string,
  shipping: Shipping,
  payment: Payment,
) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    });

    if (!cart || cart.items.length === 0)
      throw new OrderError("Your bag is empty.");

    for (const it of cart.items) {
      if (!it.variant) throw new OrderError("An item is no longer available.");
      if (it.quantity > it.variant.stock)
        throw new OrderError(
          `Only ${it.variant.stock} left of ${it.variant.product.name} (${it.variant.color}/${it.variant.size}).`,
        );
    }

    const total = cart.items.reduce(
      (s, it) => s + it.variant.product.price * it.quantity,
      0,
    );

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: payment.status,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingState: shipping.state,
        shippingPincode: shipping.pincode,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        items: {
          create: cart.items.map((it) => ({
            variantId: it.variantId,
            productName: it.variant.product.name,
            color: it.variant.color,
            size: it.variant.size,
            price: it.variant.product.price,
            quantity: it.quantity,
            image: it.variant.images[0] ?? null,
          })),
        },
      },
    });

    for (const it of cart.items) {
      await tx.variant.update({
        where: { id: it.variantId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
}
