import { SiteHeader } from "@/components/store/SiteHeader";
import { SiteFooter } from "@/components/store/SiteFooter";
import { SupportWidget } from "@/components/store/SupportWidget";
import { Toaster } from "@/components/store/Toaster";
import { CursorGlow } from "@/components/store/CursorGlow";
import { PromoBar } from "@/components/store/PromoBar";
import { getActiveSitePromo } from "@/lib/promo";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const promo = await getActiveSitePromo();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {promo && <PromoBar promo={promo} />}
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <SupportWidget />
      <Toaster />
      <CursorGlow />
    </div>
  );
}
