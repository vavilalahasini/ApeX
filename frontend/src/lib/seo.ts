import type { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://apex-studio-mu.vercel.app";

export function getSiteConfigData() {
  // Static fallback config for static site generation
  return {
    name: "ApeX",
    title: "ApeX — Immersive Digital Experiences",
    description:
      "Build a stronger online presence with ApeX. Premium websites, AI product posters, and cinematic 3D web experiences for modern brands.",
    url: siteUrl,
    ogImage: `${siteUrl}/og-image.svg`,
    twitter: "",
    email: "",
    keywords: [
      "digital studio",
      "web design",
      "3D web",
      "AI posters",
      "brand identity",
      "agency",
      "cinematic web design",
      "AI product posters",
      "3D web experiences",
      "premium website development",
      "Hyderabad digital agency",
    ],
  };
}

export function baseMetadata(): Metadata {
  const siteConfig = getSiteConfigData();
  
  return {
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: siteConfig.url,
    },
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    verification: {
      google: 'HPp8jhSlmoD8_5r2AbVNPwZLWJIABkiPfRUGJTpgsms',
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: 'https://apex-studio-mu.vercel.app/og-image.svg',
          width: 1200,
          height: 630,
          alt: 'ApeX Studio — Premium Digital Experiences',
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: ['https://apex-studio-mu.vercel.app/og-image.svg'],
      creator: siteConfig.twitter,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function organizationJsonLd() {
  const siteConfig = getSiteConfigData();
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [],
  };
}

export function websiteJsonLd() {
  const siteConfig = getSiteConfigData();
  
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/#contact`,
      "query-input": "required name=search_term_string",
    },
  };
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const siteConfig = getSiteConfigData();
  const path = options.path || "";
  const canonicalUrl = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const ogImageUrl = options.ogImage || siteConfig.ogImage;

  return {
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    title: {
      default: options.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: options.description,
    keywords: [...siteConfig.keywords, ...(options.keywords || [])],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    verification: {
      google: 'HPp8jhSlmoD8_5r2AbVNPwZLWJIABkiPfRUGJTpgsms',
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: siteConfig.name,
      title: options.title,
      description: options.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${options.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
      description: options.description,
      images: [ogImageUrl],
      creator: siteConfig.twitter,
    },
    robots: {
      index: !options.noIndex,
      follow: !options.noIndex,
    },
  };
}

export function serviceSchema(name: string, description: string) {
  const siteConfig = getSiteConfigData();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: siteConfig.name },
    url: siteConfig.url,
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export interface PortfolioItem {
  name: string;
  description: string;
  url?: string;
  image?: string;
  category?: string;
  datePublished?: string;
}

export function portfolioJsonLd(items: PortfolioItem[]) {
  const siteConfig = getSiteConfigData();
  
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} Portfolio`,
    description: "A collection of our featured projects and work",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.name,
        description: item.description,
        url: item.url ? `${siteConfig.url}${item.url}` : siteConfig.url,
        image: item.image ? `${siteConfig.url}${item.image}` : siteConfig.ogImage,
        genre: item.category,
        datePublished: item.datePublished,
        creator: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      },
    })),
  };
}