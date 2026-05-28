import { headers } from "next/headers";
import { DM_Sans, Syne, Instrument_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SkipToContent } from "@/components/layout/SkipToContent";
import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';
  const orgLd = organizationJsonLd();
  const siteLd = websiteJsonLd();

  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${instrumentSerif.variable}`}>
      <head>
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgLd),
          }}
        />
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteLd),
          }}
        />
      </head>
      <body className="antialiased">
        <SkipToContent />
        {children}
        <Analytics nonce={nonce} />
      </body>
    </html>
  );
}