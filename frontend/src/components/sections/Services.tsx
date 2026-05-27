import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Services as ServicesType } from "@/lib/types";

export function Services({ servicesData, className }: { servicesData: ServicesType; className?: string }) {
  return (
    <section id="services" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="services-heading">
      <SectionHeading
        label={servicesData.section.label}
        title={servicesData.section.title}
        subtitle={servicesData.section.subtitle}
      />

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servicesData.services.map((service, index) => (
          <RevealItem key={service.title} index={index}>
            <GlassPanel className="rounded-2xl p-8 md:p-10 h-full flex flex-col justify-between group hover:border-[#AAFF00]/20 transition-all duration-300">
              <div>
                <span className="text-sm font-semibold text-white/30 group-hover:text-[#AAFF00] transition-colors duration-300">
                  {service.number}
                </span>
                <h3 className="font-[family-name:var(--font-syne)] text-2xl font-bold text-text-primary mt-6 mb-4">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Service Icon indicator */}
              <div className="mt-8 flex justify-end">
                <span className="text-text-muted group-hover:text-[#AAFF00] transform group-hover:translate-x-1 transition-all duration-300" aria-hidden>
                  →
                </span>
              </div>
            </GlassPanel>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
