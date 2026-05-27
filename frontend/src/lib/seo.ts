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
    ogImage: `${siteUrl}/og-image.png`,
    twitter: "",
    email: "",
    keywords: [
      "digital studio",
      "web design",
      "3D web",
      "AI posters",
      "brand identity",
      "agency",
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
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
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