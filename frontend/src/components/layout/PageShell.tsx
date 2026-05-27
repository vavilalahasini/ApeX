"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { Footer } from "@/components/layout/Footer";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function PageShell() {
  return (
    <AppProviders>
      <CustomCursor />
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <Hero />
          <Services />
          <Marquee />
          <Portfolio />
          <ErrorBoundary>
            <Testimonials />
          </ErrorBoundary>
          <Contact />
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
