import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteTheme, themeCssVars } from "@/lib/site-settings";
import { googleFontsHref } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEXORA — Premium Streetwear",
    template: "%s — NEXORA",
  },
  description:
    "NEXORA — premium streetwear and fashion. Men, Women and Kids. Free doorstep delivery in India.",
  keywords: ["streetwear", "fashion", "men", "women", "kids", "India", "NEXORA"],
  openGraph: {
    siteName: "NEXORA",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin-configured theme → CSS custom properties applied site-wide. Read on
  // every request so changes take effect on the next refresh.
  const theme = await getSiteTheme();

  return (
    <html lang="en">
      <head>
        {/* Admin-chosen fonts, loaded at runtime so changes need no rebuild. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsHref(theme.displayFont, theme.bodyFont)} />
        {/* Premium serif used for editorial headings (e.g. the account hero). */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        />
        {/* Theme colours + fonts + scale as CSS custom properties. */}
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: `:root{${themeCssVars(theme)}}` }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
