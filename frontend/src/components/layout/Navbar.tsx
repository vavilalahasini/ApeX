"use client";

import { m, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_LINKS, SECTION_IDS } from "@/lib/constants";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 40);
  });

  const linkHrefToId = (href: string) => href.replace("#", "");

  return (
    <m.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-200 ${
        scrolled
          ? "bg-[rgba(8,8,8,0.88)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="flex items-center justify-between px-5 md:px-10 lg:px-16 xl:px-24 h-20"
        aria-label="Main navigation"
      >
        <a
          href="#main-content"
          className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold tracking-tight gradient-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ApeX
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const id = linkHrefToId(link.href);
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <UnderlineLink
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                    isActive
                      ? "nav-active-yg"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </UnderlineLink>
              </li>
            );
          })}
        </ul>

        <Button href="#contact" size="sm" className="hidden md:inline-flex btn-navbar-cta">
          Hire Us
        </Button>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex flex-col gap-1.5 p-3 min-w-[44px] min-h-[44px] items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`block w-6 h-px bg-text-primary transition-transform ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-text-primary transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-px bg-text-primary transition-transform ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {mobileOpen && (
        <m.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-[rgba(255,255,255,0.08)] bg-[rgba(8,8,8,0.97)] backdrop-blur-xl"
        >
          <ul className="flex flex-col gap-6 p-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm uppercase tracking-[0.2em] text-text-primary min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Button
                href="#contact"
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="btn-navbar-cta"
              >
                Hire Us
              </Button>
            </li>
          </ul>
        </m.div>
      )}
    </m.header>
  );
}
