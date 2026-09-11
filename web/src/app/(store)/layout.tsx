import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SupportWidget } from "@/components/store/SupportWidget";
import { Toaster } from "@/components/store/Toaster";
import { CursorGlow } from "@/components/store/CursorGlow";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <SupportWidget />
      <Toaster />
      <CursorGlow />
    </div>
  );
}
