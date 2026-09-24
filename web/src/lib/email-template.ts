// Pure order-email rendering — NO database/SDK imports, so it can be rendered
// anywhere (server send, admin preview, offline preview script).
import { SUPPORT } from "../data/support";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const BRAND = "NEXORA";

const inr = (v: number) => "Rs. " + Math.round(v).toLocaleString("en-IN");
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type OrderEmailData = {
  id: string;
  code: string;
  to: string;
  customerName: string;
  createdAt: Date;
  items: { productName: string; color: string; size: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  total: number;
  shipping: {
    name: string; phone: string; address: string; city: string; state: string; pincode: string;
  };
};

export function sampleOrderEmailData(to = "preview@example.com"): OrderEmailData {
  return {
    id: "clsampleorder0001",
    code: "R0001".padStart(8, "0"),
    to,
    customerName: "Aarav Sharma",
    createdAt: new Date(),
    items: [
      { productName: "Orbital Hoodie", color: "Black", size: "M", quantity: 1, price: 1899 },
      { productName: "Nimbus Boxy Tee", color: "Chalk", size: "L", quantity: 2, price: 899 },
    ],
    subtotal: 3697,
    discount: 370,
    couponCode: "WELCOME10",
    total: 3327,
    shipping: {
      name: "Aarav Sharma",
      phone: "9876543210",
      address: "12 MG Road, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
  };
}

// Table-based HTML for broad email-client compatibility (Gmail/Outlook/mobile).
export function renderOrderEmailHTML(d: OrderEmailData): string {
  const dateStr = d.createdAt.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const trackUrl = `${SITE_URL}/order/${d.id}`;
  const waLink = `https://wa.me/${SUPPORT.whatsappNumber}`;

  const itemsRows = d.items
    .map(
      (it) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ededed;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;">
          <strong>${esc(it.productName)}</strong><br/>
          <span style="color:#6b6b6b;">${esc(it.color)}, Size ${esc(it.size)} &middot; Qty ${it.quantity}</span>
        </td>
        <td align="right" style="padding:10px 0;border-bottom:1px solid #ededed;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;white-space:nowrap;">
          ${inr(it.price * it.quantity)}
        </td>
      </tr>`,
    )
    .join("");

  const discountRow =
    d.discount > 0
      ? `<tr><td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#47a730;">Discount${d.couponCode ? ` (${esc(d.couponCode)})` : ""}</td>
         <td align="right" style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#47a730;">&minus; ${inr(d.discount)}</td></tr>`
      : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Order Confirmed</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:92%;background:#ffffff;border:1px solid #dddddd;">
        <tr><td style="background:#000000;padding:22px 32px;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:24px;font-weight:bold;letter-spacing:2px;color:#ffffff;">${BRAND}</span>
        </td></tr>

        <tr><td style="padding:32px 32px 8px;">
          <h1 style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:22px;color:#1c1c1c;">Thank you for your order!</h1>
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b6b6b;line-height:1.6;">
            Hi ${esc(d.customerName)},<br/>
            We've received your order and it's being processed. Here are your order details:
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;">
            <strong>Order ID:</strong> #${d.code}<br/>
            <strong>Order Date:</strong> ${dateStr}
          </p>
        </td></tr>

        <tr><td style="padding:20px 32px 0;">
          <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#6b6b6b;text-transform:uppercase;">Items ordered</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsRows}</table>
        </td></tr>

        <tr><td style="padding:18px 32px 0;">
          <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#6b6b6b;text-transform:uppercase;">Order summary</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;">Subtotal</td>
                <td align="right" style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;">${inr(d.subtotal)}</td></tr>
            ${discountRow}
            <tr><td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;">Shipping</td>
                <td align="right" style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;">Free</td></tr>
            <tr><td style="padding:10px 0 0;border-top:1px solid #dddddd;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#1c1c1c;">Total Paid</td>
                <td align="right" style="padding:10px 0 0;border-top:1px solid #dddddd;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#1c1c1c;">${inr(d.total)}</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 32px 0;">
          <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;color:#6b6b6b;text-transform:uppercase;">Shipping to</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1c1c1c;line-height:1.6;">
            ${esc(d.shipping.name)}<br/>
            ${esc(d.shipping.address)}<br/>
            ${esc(d.shipping.city)}, ${esc(d.shipping.state)} &mdash; ${esc(d.shipping.pincode)}<br/>
            Phone: ${esc(d.shipping.phone)}
          </p>
        </td></tr>

        <tr><td style="padding:26px 32px;">
          <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b6b6b;">We'll send you another email once your order ships.</p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="background:#1c1c1c;">
              <a href="${trackUrl}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:1px;color:#ffffff;text-decoration:none;text-transform:uppercase;">Track your order</a>
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:22px 32px;background:#f5f5f5;border-top:1px solid #dddddd;">
          <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b6b6b;line-height:1.6;">
            Questions? Chat with us on the website or reach us on
            <a href="${waLink}" style="color:#1c1c1c;">WhatsApp</a>.
          </p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b6b6b;">Thanks for shopping with ${BRAND}!</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
