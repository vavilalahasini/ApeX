"use client";

import { lazy, Suspense } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { Footer } from "@/components/layout/Footer";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Marquee } from "@/components/sections/Marquee";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { JsonLd } from "@/components/SEO/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo";

// Lazy load sections below hero for TBT reduction
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
      <CustomCursor />
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <Hero />
          <Services />
          <Marquee />
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
