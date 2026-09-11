import crypto from "crypto";

export function isRazorpayConfigured() {
  return !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
}

export function razorpayKeyId() {
  // The key id is publishable (used by the browser checkout widget).
  return process.env.RAZORPAY_KEY_ID ?? "";
}

/** Create a Razorpay order via the REST API (no SDK dependency). */
export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });

  if (!res.ok) {
    throw new Error(`Razorpay order creation failed: ${await res.text()}`);
  }
  return (await res.json()) as { id: string; amount: number; currency: string };
}

/** Verify the payment signature returned by Razorpay Checkout. */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}
