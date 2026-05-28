import type { PortfolioProject } from "@/lib/types";
import type { Testimonial } from "@/types";

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SECTION_IDS = ["services", "work", "about", "testimonials", "contact"] as const;

export const SERVICES = [
  {
    number: "01",
    title: "3D Web Experiences",
    description:
      "Immersive WebGL worlds that captivate audiences and elevate your brand into cinematic digital space.",
    icon: "cube",
  },
  {
    number: "02",
    title: "AI Product Posters",
    description:
      "Futuristic visual campaigns that make AI products feel premium, intelligent, and unmistakably modern.",
    icon: "spark",
  },
  {
    number: "03",
    title: "Brand Identity Systems",
    description:
      "Cohesive visual languages—from typography to motion—that position your brand as industry-leading.",
    icon: "layers",
  },
  {
    number: "04",
    title: "Performance-First Development",
    description:
      "Lightning-fast, accessible experiences engineered for 60fps and measurable business outcomes.",
    icon: "bolt",
  },
] as const;

export const MARQUEE_ITEMS = [
  "Web Design",
  "AI Posters",
  "Branding",
  "Motion Design",
  "UI/UX",
  "3D Visuals",
  "Cinematic Web",
  "Digital Strategy",
] as const;

export const PORTFOLIO: readonly PortfolioProject[] = [];

export const STATS: readonly { value: string; label: string }[] = [];

export const TESTIMONIALS: readonly Testimonial[] = [];

export const CONTACT_SERVICES = [
  "3D Web Experience",
  "AI Product Poster",
  "Brand Identity",
  "Full Website",
  "Other",
] as const;

export const SOCIAL_LINKS: readonly { label: string; href: string }[] = [];

export const EASE = [0.22, 1, 0.36, 1] as const;
