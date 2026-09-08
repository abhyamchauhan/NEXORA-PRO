import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  renderOrderEmailHTML,
  sampleOrderEmailData,
  type OrderEmailData,
} from "@/lib/email-template";

export { renderOrderEmailHTML, sampleOrderEmailData };
export type { OrderEmailData };

const FROM = process.env.EMAIL_FROM ?? "NEXORA <onboarding@resend.dev>";

export function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY;
}

// Load everything the email needs from the DB. Resolves the recipient from the
// guest email or the linked user's email.
export async function buildOrderEmailData(orderId: string): Promise<OrderEmailData | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: { select: { email: true, name: true } } },
  });
  if (!order) return null;

  return {
    id: order.id,
    code: order.id.slice(-8).toUpperCase(),
    to: order.guestEmail ?? order.user?.email ?? "",
    customerName: order.shippingName || order.user?.name || "there",
    createdAt: order.createdAt,
    items: order.items.map((i) => ({
      productName: i.productName,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      price: i.price,
    })),
    subtotal: order.total + order.discount,
    discount: order.discount,
    couponCode: order.couponCode,
    total: order.total,
    shipping: {
      name: order.shippingName,
      phone: order.shippingPhone,
      address: order.shippingAddress,
      city: order.shippingCity,
      state: order.shippingState,
      pincode: order.shippingPincode,
    },
  };
}

// Send the confirmation. Never throws — logs and returns a result so the order
// is never rolled back because of an email failure.
export async function sendOrderConfirmation(
  orderId: string,
): Promise<{ sent: boolean; reason?: string }> {
  try {
    if (!isEmailConfigured()) return { sent: false, reason: "RESEND_API_KEY not set" };
    const data = await buildOrderEmailData(orderId);
    if (!data) return { sent: false, reason: "order not found" };
    if (!data.to) return { sent: false, reason: "no recipient email" };

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: data.to,
      subject: `Order Confirmed — #${data.code} | NEXORA`,
      html: renderOrderEmailHTML(data),
    });
    if (error) {
      console.error("[email] order confirmation failed:", error);
      return { sent: false, reason: String(error) };
    }
    return { sent: true };
  } catch (e) {
    console.error("[email] order confirmation threw:", e);
    return { sent: false, reason: e instanceof Error ? e.message : "unknown" };
  }
}
