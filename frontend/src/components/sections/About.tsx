"use client";

import { AboutVisual } from "@/components/sections/AboutVisual";
import { Card } from "@/components/ui/Card";
import { GradientText } from "@/components/ui/GradientText";
import { Reveal } from "@/components/ui/Reveal";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import { useAbout } from "@/hooks/useContent";

export function About({ className }: { className?: string }) {
  const { data: aboutData, loading } = useAbout();

  if (loading) {
    return (
      <section id="about" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="about-heading">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-800 rounded w-1/4" />
            <div className="h-16 bg-gray-800 rounded w-3/4" />
            <div className="h-24 bg-gray-800 rounded w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (!aboutData) return null;

  return (
    <section id="about" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="about-heading">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <RevealGroup>
            <RevealItem
              as="p"
              index={0}
              className="text-xs uppercase tracking-[0.35em] text-text-muted mb-4"
            >
              {aboutData.section.label}
            </RevealItem>
            <RevealItem
              as="h2"
              index={1}
              id="about-heading"
              className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6"
            >
              <GradientText as="span" variant="subtle">
                {aboutData.section.title}
              </GradientText>
            </RevealItem>
            <RevealItem
              as="p"
              index={2}
              className="text-base md:text-lg text-text-muted leading-relaxed mb-6"
            >
              {aboutData.content.headline}
            </RevealItem>
            <RevealItem
              as="p"
              index={3}
              className="text-base text-text-muted/80 leading-relaxed mb-10"
            >
              {aboutData.content.description}
            </RevealItem>
          </RevealGroup>

          {aboutData.content.stats.length > 0 && (
            <RevealGroup className="grid grid-cols-2 gap-4">
              {aboutData.content.stats.map((stat, i) => (
                <RevealItem key={stat.label} index={i}>
                  <Card className="stat-card-ro rounded-xl p-5 md:p-6 transition-all duration-300">
                    <p className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-bold accent-ro-gradient mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-text-muted">
                      {stat.label}
                    </p>
                  </Card>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>

        <Reveal delay={2}>
          <AboutVisual />
        </Reveal>
      </div>
    </section>
  );
}
