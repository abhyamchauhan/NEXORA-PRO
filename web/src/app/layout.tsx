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

export const metadata: Metadata = {
  title: "NEXORA — Premium Streetwear",
  description:
    "NEXORA — premium streetwear and fashion. Men, Women and Kids. Free doorstep delivery in India.",
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
