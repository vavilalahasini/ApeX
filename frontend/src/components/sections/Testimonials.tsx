import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import type { Testimonials as TestimonialsType } from "@/lib/types";

export function Testimonials({ testimonialsData, className }: { testimonialsData: TestimonialsType; className?: string }) {
  return (
    <section className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="testimonials-heading">
      <SectionHeading
        label={testimonialsData.section.label}
        title={testimonialsData.section.title}
        subtitle={testimonialsData.section.subtitle}
      />

      <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonialsData.testimonials.map((testimonial, index) => (
          <RevealItem key={index} index={index}>
            <GlassPanel className="rounded-2xl p-8 md:p-10 h-full flex flex-col justify-between hover:border-[#AAFF00]/10 transition-colors duration-300">
              <div>
                {/* Quote Icon */}
                <span className="text-4xl text-[#AAFF00]/20 font-serif leading-none block mb-4" aria-hidden>
                  “
                </span>
                <p className="text-sm md:text-base text-text-primary leading-relaxed italic mb-8">
                  {testimonial.quote}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold testimonial-author-yg">
                  {testimonial.author}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </GlassPanel>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
