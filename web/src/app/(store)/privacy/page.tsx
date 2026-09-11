import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";
import { POLICIES } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NEXORA collects, uses and protects your personal information.",
};

export default function Privacy() {
  return <PolicyPage policy={POLICIES.privacy} />;
}
