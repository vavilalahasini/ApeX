export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  twitter: string;
  email: string;
  keywords: string[];
}

export interface Navigation {
  links: Array<{ label: string; href: string }>;
}

export interface Hero {
  tagline: string;
  headline: string;
  description: string;
  ctaButtons: Array<{ text: string; href: string; variant: string }>;
}

export interface Services {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  services: Array<{
    number: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface Marquee {
  items: string[];
}

export interface About {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  content: {
    headline: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
  };
}

export interface Portfolio {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  projects: Array<{
    title: string;
    category: string;
    gradient: string;
    accent: string;
    href: string;
    slug: string;
    description?: string;
  }>;
}

export interface Testimonials {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
}

export interface Contact {
  section: {
    label: string;
    title: string;
    subtitle: string;
  };
  email: string;
  whatsapp?: string;
  services: string[];
  socialLinks: Array<{ label: string; href: string }>;
}
