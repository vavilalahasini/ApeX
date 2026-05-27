"use client";

import { GlowText } from "@/components/ui/GlowText";
import { useMarquee } from "@/hooks/useContent";

export function Marquee({ className }: { className?: string }) {
  const { data: marqueeData, loading } = useMarquee();

  if (loading) {
    return (
      <section
        className={`relative marquee-section overflow-hidden border-y border-[rgba(0,245,255,0.08)] z-10 ${className || ''}`}
        aria-label="Capabilities"
      >
        <div className="animate-pulse space-x-8 flex whitespace-nowrap">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-gray-800 rounded w-32" />
          ))}
        </div>
      </section>
    );
  }

  if (!marqueeData) return null;

  const items = [...marqueeData.items, ...marqueeData.items];

  return (
    <section
      className={`relative marquee-section overflow-hidden border-y border-[rgba(0,245,255,0.08)] z-10 ${className || ''}`}
      aria-label="Capabilities"
    >
      <div className="flex animate-marquee marquee-track whitespace-nowrap hover:pause-animation">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="marquee-item mx-8 md:mx-12"
          >
            <GlowText className="text-2xl md:text-4xl font-[family-name:var(--font-syne)] font-bold tracking-tight">
              {item}
            </GlowText>
            <span className="marquee-separator mx-8 md:mx-12 text-accent/40 text-lg" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
