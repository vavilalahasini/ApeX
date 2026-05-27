import type { Metadata } from "next";
import { DM_Sans, Syne, Instrument_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SkipToContent } from "@/components/layout/SkipToContent";
import {
  baseMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = baseMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgLd = organizationJsonLd();
  const siteLd = websiteJsonLd();

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js-enabled');`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteLd),
          }}
        />
      </head>
      <body className="antialiased">
        <SkipToContent />
        {children}
        <Analytics />
      </body>
    </html>
  );
}