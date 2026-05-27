import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import type { Hero as HeroType, Contact as ContactType, Portfolio as PortfolioType } from "@/lib/types";

export function Hero({ 
  heroData, 
  contactData,
  portfolioData,
  className 
}: { 
  heroData: HeroType; 
  contactData: ContactType;
  portfolioData: PortfolioType;
  className?: string;
}) {
  const projects = portfolioData.projects.slice(0, 3);

  return (
    <section
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden section-padding pb-8 lg:pb-0 ${className || ''}`}
      aria-labelledby="hero-heading"
    >
      <FloatingOrbs />
      <div className="absolute inset-0 perspective-grid opacity-40 pointer-events-none" aria-hidden />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto">
        {/* Left Column: Headline and CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <p className="mt-[2vh] text-xs md:text-sm uppercase tracking-[0.4em] text-text-muted mb-4 md:mb-6 animate-fade-up">
            {heroData.tagline}
          </p>

          <h1
            id="hero-heading"
            className="font-[family-name:var(--font-syne)] text-[clamp(2rem,5.5vw,4rem)] sm:text-[clamp(2.5rem,6vw,4.5rem)] md:text-[clamp(2.5rem,6.5vw,5rem)] font-bold leading-[1.1] sm:leading-[1.05] tracking-[-0.03em] mb-6 text-text-primary animate-fade-up animate-delay-1"
          >
            {heroData.headline.split('\n').map((line, i) => (
              <span key={i} className="block leading-[1.1] sm:leading-[1.05] m-0 p-0">
                {line.includes('Online Presence') || line.includes('Presence') ? (
                  <GradientText as="span">{line}</GradientText>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>

          <p className="text-base md:text-lg text-text-muted max-w-2xl leading-relaxed mb-8 md:mb-10 animate-fade-up animate-delay-2">
            {heroData.description}
          </p>

          {/* Critical Conversion CTAs */}
          <div className="flex flex-wrap gap-4 md:gap-5 animate-fade-up animate-delay-3">
            <Button
              href={contactData.whatsapp || "https://wa.me/919876543210"}
              variant="gradient"
              className="inline-flex items-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.388 2.08 13.98 1.08 11.39 1.081 5.952 1.082 1.529 5.45 1.526 10.884c-.001 1.81.474 3.581 1.38 5.161L1.87 21.03l5.093-1.336-.316-.18z" />
              </svg>
              WhatsApp Us
            </Button>
            <Button
              href={`mailto:${contactData.email}`}
              variant="glass"
            >
              Email Us
            </Button>
            <Button
              href="#contact"
              variant="glass"
              className="text-text-muted hover:text-text-primary"
            >
              Send Message
            </Button>
          </div>
        </div>

        {/* Right Column: 3 Featured Projects (visible above fold!) */}
        <div className="lg:col-span-5 flex flex-col gap-5 w-full animate-fade-up animate-delay-2">
          <p className="text-xs uppercase tracking-[0.25em] text-text-muted font-semibold mb-1">
            Featured Work
          </p>
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group relative rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-bg-elevated/40 hover:bg-bg-elevated/80 hover:border-[rgba(255,255,255,0.18)] transition-all duration-300 p-5 flex items-center justify-between gap-4"
              >
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={`View case study: ${project.title}`}
                >
                  <span className="sr-only">View {project.title}</span>
                </a>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#AAFF00] font-medium">
                    {project.category}
                  </span>
                  <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-text-primary">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-text-muted max-w-[280px] line-clamp-1">
                      {project.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white/50 group-hover:text-[#AAFF00] transition-colors">
                    View
                  </span>
                  <span className="text-[#AAFF00] transform group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                <div
                  className="absolute right-0 bottom-0 top-0 w-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(to bottom, ${project.accent}, transparent)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
