"use client";

import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { useTestimonials } from "@/hooks/useContent";

export function Testimonials({ className }: { className?: string }) {
  const { data: testimonialsData, loading } = useTestimonials();

  if (loading) {
    return (
      <section
        id="testimonials"
        className={`relative section-padding z-10 ${className || ''}`}
        aria-labelledby="testimonials-heading"
      >
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-8 bg-gray-800 rounded w-1/4 mx-auto" />
          <div className="h-12 bg-gray-800 rounded w-1/2 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonialsData || testimonialsData.testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className={`relative section-padding z-10 ${className || ''}`}
      aria-labelledby="testimonials-heading"
    >
      <SectionHeading
        label={testimonialsData.section.label}
        title={testimonialsData.section.title}
        subtitle={testimonialsData.section.subtitle}
        align="center"
      />

      <RevealGroup className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-6xl mx-auto">
        {testimonialsData.testimonials.map((item, i) => (
          <RevealItem key={item.author} index={i}>
            <Card as="article" className="p-8 h-full flex flex-col">
              <blockquote className="text-base text-text-muted leading-relaxed mb-6 flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <footer>
                <p className="testimonial-author-yg font-[family-name:var(--font-syne)] font-semibold">
                  {item.author}
                </p>
                <p className="text-sm text-text-muted">
                  {item.role}, {item.company}
                </p>
              </footer>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
