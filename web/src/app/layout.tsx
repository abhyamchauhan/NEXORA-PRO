import type { Metadata } from "next";
import { Instrument_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteTheme, themeCssVars } from "@/lib/site-settings";

const display = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
});

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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <head>
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
