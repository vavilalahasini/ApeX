"use client";

import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import { usePortfolio } from "@/hooks/useContent";
import type { PortfolioProject } from "@/types";

function ProjectCard({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  const spans =
    index === 0
      ? "md:col-span-7 md:row-span-2 min-h-[320px] md:min-h-[480px]"
      : index === 1
        ? "md:col-span-5 min-h-[240px]"
        : "md:col-span-12 min-h-[280px] md:min-h-[320px]";

  return (
    <RevealItem
      as="article"
      index={index}
      className={`group relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-bg-elevated hover:border-[rgba(255,255,255,0.18)] transition-colors duration-200 ${spans}`}
    >
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`View case study: ${project.title}`}
      >
        <span className="sr-only">View {project.title}</span>
      </a>

      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80`}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-60 portfolio-shimmer"
        style={
          {
            "--accent": project.accent,
          } as CSSProperties
        }
        aria-hidden
      />

      <div className="absolute inset-0 bg-bg-deep/40 group-hover:bg-bg-deep/20 transition-colors duration-200" aria-hidden />

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 z-10 pointer-events-none">
        <span
          className="portfolio-cta-yg inline-flex items-center gap-2 text-sm mb-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-[opacity,transform] duration-200"
        >
          View Case Study
          <span aria-hidden>→</span>
        </span>
        <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2">
          {project.category}
        </p>
        <h3 className="font-[family-name:var(--font-syne)] text-2xl md:text-4xl font-bold tracking-tight text-text-primary">
          {project.title}
        </h3>
      </div>

      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out group-hover:scale-105"
        style={{
          background: `radial-gradient(circle at 30% 70%, color-mix(in srgb, ${project.accent} 13%, transparent) 0%, transparent 50%)`,
        }}
        aria-hidden
      />
    </RevealItem>
  );
}

export function Portfolio({ className }: { className?: string }) {
  const { data: portfolioData, loading } = usePortfolio();

  if (loading) {
    return (
      <section id="work" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="work-heading">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/4" />
          <div className="h-12 bg-gray-800 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!portfolioData) return null;

  return (
    <section id="work" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="work-heading">
      <SectionHeading
        label={portfolioData.section.label}
        title={portfolioData.section.title}
        subtitle={portfolioData.section.subtitle}
      />

      <RevealGroup className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 auto-rows-min">
        {portfolioData.projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </RevealGroup>
    </section>
  );
}
