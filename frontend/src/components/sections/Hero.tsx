"use client";

import { motion } from "framer-motion";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { Button } from "@/components/ui/Button";
import { GradientText } from "@/components/ui/GradientText";
import { useEffectCapabilities } from "@/hooks/useEffectCapabilities";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { pickFadeVariant } from "@/lib/motion";
import { useHero } from "@/hooks/useContent";
import { useState, useEffect } from "react";

export function Hero({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const { lowPower } = useEffectCapabilities();
  const fadeUp = pickFadeVariant(reducedMotion);
  const [showOrbs, setShowOrbs] = useState(false);
  const { data: heroData, loading } = useHero();

  // Delay decorative orbs to reduce initial LCP blocking
  useEffect(() => {
    if (!reducedMotion && !lowPower) {
      const timer = setTimeout(() => setShowOrbs(true), 300);
      return () => clearTimeout(timer);
    }
  }, [reducedMotion, lowPower]);

  if (loading) {
    return (
      <section
        className={`relative min-h-screen flex flex-col justify-center overflow-hidden section-padding pb-0 ${className || ''}`}
        aria-labelledby="hero-heading"
      >
        <div className="relative z-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="h-20 bg-gray-800 rounded w-3/4" />
            <div className="h-6 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) return null;

  return (
    <section
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden section-padding pb-0 ${className || ''}`}
      aria-labelledby="hero-heading"
    >
      {showOrbs && <FloatingOrbs />}
      <div className="absolute inset-0 perspective-grid opacity-40 pointer-events-none" aria-hidden />

      <div className="relative z-10">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          transition={{ duration: 0.5, delay: 0 }}
          className="mt-[2vh] text-xs md:text-sm uppercase tracking-[0.4em] text-text-muted mb-6 md:mb-8 break-words whitespace-normal"
        >
          {heroData.tagline}
        </motion.p>

        <motion.h1
          id="hero-heading"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-[family-name:var(--font-syne)] text-[clamp(2rem,6vw,5rem)] sm:text-[clamp(2.5rem,7vw,5.5rem)] md:text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[1.1] sm:leading-[1.05] tracking-[-0.03em] mb-6 md:mb-8 text-text-primary break-words whitespace-normal overflow-hidden"
        >
          {heroData.headline.split('\n').map((line, i) => (
            <span key={i} className="block leading-[1.1] sm:leading-[1.05] m-0 p-0">
              {line === 'Online Presence' ? (
                <GradientText as="span">{line}</GradientText>
              ) : (
                line
              )}
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-xl text-text-muted max-w-2xl leading-relaxed mb-10 md:mb-12 break-words whitespace-normal"
        >
          {heroData.description}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-4 md:gap-5"
        >
          {heroData.ctaButtons.map((button, index) => (
            <Button
              key={index}
              href={button.href}
              variant={button.variant as "gradient" | "glass"}
            >
              {button.text}
            </Button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
