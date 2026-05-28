import { headers } from "next/headers";
import { DM_Sans, Syne, Instrument_Serif } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { SkipToContent } from "@/components/layout/SkipToContent";
import {
  organizationJsonLd,
  websiteJsonLd,
  portfolioJsonLd,
} from "@/lib/seo";
import portfolioData from "@/data/portfolio.json";
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

export const metadata = {
  title: "ApeX - Innovative Digital Solutions",
  description: "Transform your business with cutting-edge digital solutions. We deliver exceptional web development, design, and technology services to help you succeed in the digital age.",
  openGraph: {
    title: "ApeX - Innovative Digital Solutions",
    description: "Transform your business with cutting-edge digital solutions. We deliver exceptional web development, design, and technology services to help you succeed in the digital age.",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "ApeX - Innovative Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApeX - Innovative Digital Solutions",
    description: "Transform your business with cutting-edge digital solutions. We deliver exceptional web development, design, and technology services to help you succeed in the digital age.",
    images: ["/og-image.svg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const nonce = headersList.get('x-nonce') || '';
  const orgLd = organizationJsonLd();
  const siteLd = websiteJsonLd();

  // Transform portfolio data for schema
  const portfolioItems = portfolioData.projects.map((project: any) => ({
    name: project.title,
    description: `${project.category} project - ${project.href}`,
    url: project.href,
    category: project.category,
  }));
  const portfolioLd = portfolioJsonLd(portfolioItems);

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
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(portfolioLd),
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