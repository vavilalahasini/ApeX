"use client";

import { lazy, Suspense } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { Footer } from "@/components/layout/Footer";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Hero } from "@/components/sections/Hero";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { JsonLd } from "@/components/SEO/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo";

// Lazy load non-critical components for better initial load performance
const CustomCursor = lazy(() => import("@/components/cursor/CustomCursor").then(m => ({ default: m.CustomCursor })));
const Services = lazy(() => import("@/components/sections/Services").then(m => ({ default: m.Services })));
const Marquee = lazy(() => import("@/components/sections/Marquee").then(m => ({ default: m.Marquee })));
const Portfolio = lazy(() => import("@/components/sections/Portfolio").then(m => ({ default: m.Portfolio })));
const Testimonials = lazy(() => import("@/components/sections/Testimonials").then(m => ({ default: m.Testimonials })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));

function SectionFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-4xl">
        <div className="h-8 bg-gray-800 rounded w-1/3" />
        <div className="h-32 bg-gray-800 rounded" />
      </div>
    </div>
  );
}

function CursorFallback() {
  return null; // Custom cursor is non-critical, no fallback needed
}

export function PageShell() {
  const breadcrumbData = [
    { name: "Home", item: "https://apex-studio-mu.vercel.app/" },
  ];

  return (
    <AppProviders>
      <JsonLd data={serviceSchema("Cinematic Web Development", "Premium 3D web experiences with immersive animations and cutting-edge technology")} />
      <JsonLd data={serviceSchema("AI Product Posters", "AI-generated product visuals and marketing materials")} />
      <JsonLd data={serviceSchema("Brand Identity Design", "Complete brand strategy and visual identity systems")} />
      <JsonLd data={serviceSchema("UI/UX Design", "User-centered interface design with focus on conversion")} />
      <JsonLd data={breadcrumbSchema(breadcrumbData)} />
      <Suspense fallback={<CursorFallback />}>
        <CustomCursor />
      </Suspense>
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <Hero />
          <Suspense fallback={<SectionFallback />}>
            <Services />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Marquee />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Portfolio />
          </Suspense>
          <ErrorBoundary>
            <Suspense fallback={<SectionFallback />}>
              <Testimonials />
            </Suspense>
          </ErrorBoundary>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
