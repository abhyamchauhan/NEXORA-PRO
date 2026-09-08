import type { Metadata } from "next";
import { PolicyPage } from "@/components/store/PolicyPage";
import { POLICIES } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use NEXORA and place an order.",
};

export default function Terms() {
  return <PolicyPage policy={POLICIES.terms} />;
}
