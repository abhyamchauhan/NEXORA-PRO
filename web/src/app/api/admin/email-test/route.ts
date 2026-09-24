import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getAdminSession, forbidden } from "@/lib/auth-guard";
import {
  buildOrderEmailData,
  renderOrderEmailHTML,
  sampleOrderEmailData,
  isEmailConfigured,
} from "@/lib/email";

const FROM = process.env.EMAIL_FROM ?? "NEXORA <onboarding@resend.dev>";

// Admin-only test send: emails the latest order's confirmation (or a sample) to
// the given address so the admin can see the real rendering.
export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return forbidden();
  if (!isEmailConfigured())
    return Response.json({ sent: false, reason: "RESEND_API_KEY not set." });

  const { to } = await req.json().catch(() => ({}));
  if (typeof to !== "string" || !to.includes("@"))
    return Response.json({ sent: false, reason: "Enter a valid email." });

  const latest = await prisma.order.findFirst({ orderBy: { createdAt: "desc" } });
  const data =
    (latest && (await buildOrderEmailData(latest.id))) || sampleOrderEmailData(to);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      subject: `Order Confirmed — #${data.code} | NEXORA (test)`,
      html: renderOrderEmailHTML(data),
    });
    if (error) return Response.json({ sent: false, reason: String(error) });
    return Response.json({ sent: true });
  } catch (e) {
    return Response.json({
      sent: false,
      reason: e instanceof Error ? e.message : "unknown",
    });
  }
}
