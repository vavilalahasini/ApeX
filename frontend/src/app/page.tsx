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

// Load configuration data on the server
import heroData from '../../data/hero.json';
import servicesData from '../../data/services.json';
import marqueeData from '../../data/marquee.json';
import portfolioData from '../../data/portfolio.json';
import testimonialsData from '../../data/testimonials.json';
import contactData from '../../data/contact.json';
import navigationData from '../../data/navigation.json';
import siteConfig from '../../data/site-config.json';
import type { Hero as HeroType, Services as ServicesType, Marquee as MarqueeType, Portfolio as PortfolioType, Testimonials as TestimonialsType, Contact as ContactType, Navigation as NavigationType, SiteConfig as SiteConfigType } from '@/lib/types';

export const dynamic = "force-static";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  
  const siteConfigWithUrl: SiteConfigType = {
    ...siteConfig,
    url: siteUrl,
    ogImage: `${siteUrl}/og-image.png`,
  } as unknown as SiteConfigType;

  return (
    <AppProviders>
      <CustomCursor />
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar navData={navigationData as unknown as NavigationType} />
        <main id="main-content">
          <Hero 
            heroData={heroData as unknown as HeroType} 
            contactData={contactData as unknown as ContactType}
            portfolioData={portfolioData as unknown as PortfolioType}
          />
          <Services servicesData={servicesData as unknown as ServicesType} />
          <Marquee marqueeData={marqueeData as unknown as MarqueeType} />
          <Portfolio portfolioData={portfolioData as unknown as PortfolioType} />
          <ErrorBoundary>
            <Testimonials testimonialsData={testimonialsData as unknown as TestimonialsType} />
          </ErrorBoundary>
          <Contact contactData={contactData as unknown as ContactType} />
        </main>
        <Footer 
          contactData={contactData as unknown as ContactType} 
          siteConfig={siteConfigWithUrl} 
        />
      </div>
    </AppProviders>
  );
}
