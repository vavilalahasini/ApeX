import type { Marquee as MarqueeType } from "@/lib/types";

export function Marquee({ marqueeData, className }: { marqueeData: MarqueeType; className?: string }) {
  // Duplicate items to ensure smooth infinite loop
  const repeatedItems = [...marqueeData.items, ...marqueeData.items, ...marqueeData.items, ...marqueeData.items];

  return (
    <section className={`marquee-section bg-bg-deep border-y border-white/5 overflow-hidden select-none z-10 ${className || ''}`} aria-hidden="true">
      <div className="marquee-track animate-marquee whitespace-nowrap">
        {repeatedItems.map((item, i) => (
          <div key={i} className="marquee-item inline-flex items-center">
            <span className="font-[family-name:var(--font-syne)] text-[clamp(1.5rem,4vw,3.5rem)] font-bold uppercase tracking-wider text-white/20 mx-8">
              {item}
            </span>
            <span className="marquee-separator text-white/5 text-xl font-bold">•</span>
          </div>
        ))}
      </div>
    </section>
  );
}
