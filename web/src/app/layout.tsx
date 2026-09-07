import type { Metadata } from "next";
import { Instrument_Sans, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
