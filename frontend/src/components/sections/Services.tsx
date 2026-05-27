"use client";

import { FeatureCard } from "@/components/ui/TiltCard";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FuturisticGridBackground } from "@/components/effects/FuturisticGridBackground";
import { useEffectCapabilities } from "@/hooks/useEffectCapabilities";
import { useServices } from "@/hooks/useContent";

function ServiceIcon({ type, animate }: { type: string; animate: boolean }) {
  const paths: Record<string, React.ReactNode> = {
    cube: (
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    ),
    spark: (
      <path
        d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    ),
    layers: (
      <>
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
    bolt: (
      <path
        d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    ),
  };

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      className={animate ? "tilt-card-icon icon-ro" : "icon-ro"}
      aria-hidden
    >
      {paths[type] ?? paths.cube}
    </svg>
  );
}

export function Services({ className }: { className?: string }) {
  const { reducedMotion } = useEffectCapabilities();
  const { data: servicesData, loading } = useServices();

  if (loading) {
    return (
      <section id="services" className={`relative section-padding overflow-hidden z-10 ${className || ''}`} aria-labelledby="services-heading">
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 bg-gray-800 rounded w-1/4" />
          <div className="h-12 bg-gray-800 rounded w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!servicesData) return null;

  return (
    <section id="services" className={`relative section-padding overflow-hidden z-10 ${className || ''}`} aria-labelledby="services-heading">
      <FuturisticGridBackground />
      <div className="relative z-10">
        <SectionHeading

          label={servicesData.section.label}
          title={servicesData.section.title}
          subtitle={servicesData.section.subtitle}
        />
        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {servicesData.services.map((service, i) => (
            <RevealItem key={service.number} index={i} className="min-w-0 w-full overflow-hidden">
              <FeatureCard
                as="article"
                badge={service.number}
                icon={<ServiceIcon type={service.icon} animate={!reducedMotion} />}
                title={service.title}
                description={service.description}
                scanDelay={i * 0.5}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
