import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";
import { POLICIES } from "@/data/legal";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "How returns, refunds, exchanges and shipping work at NEXORA.",
};

export default function RefundPolicy() {
  return <PolicyPage policy={POLICIES.refund} />;
}
