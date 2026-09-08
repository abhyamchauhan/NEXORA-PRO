import { prisma } from "@/lib/prisma";
import {
  buildOrderEmailData,
  renderOrderEmailHTML,
  sampleOrderEmailData,
  isEmailConfigured,
} from "@/lib/email";
import { EmailTest } from "./EmailTest";

export const dynamic = "force-dynamic";

export default async function EmailPreview() {
  // Preview the most recent real order if there is one, else a sample.
  const latest = await prisma.order.findFirst({ orderBy: { createdAt: "desc" } });
  const data =
    (latest && (await buildOrderEmailData(latest.id))) || sampleOrderEmailData();
  const html = renderOrderEmailHTML(data);

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">Order email preview</h1>
      <p className="text-sm text-grey-500 mb-6">
        {latest
          ? `Showing the confirmation email for the latest order (#${data.code}).`
          : "No orders yet — showing a sample. Place an order to preview a real one."}
      </p>

      <EmailTest configured={isEmailConfigured()} />

      <div className="border border-grey-200 bg-grey-50 p-4">
        <iframe
          title="Email preview"
          srcDoc={html}
          className="w-full bg-white border border-grey-200"
          style={{ height: 900 }}
        />
      </div>
    </div>
  );
}
