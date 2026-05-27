"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchContent, type Contact, type SiteConfig } from "@/lib/client-data";

import contactDataJson from "../../../data/contact.json";
import siteConfigDataJson from "../../../data/site-config.json";

export function Footer() {
  const [contactData, setContactData] = useState<Contact | null>(contactDataJson as unknown as Contact);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigDataJson as unknown as SiteConfig);
  const year = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      fetchContent<Contact>("contact"),
      fetchContent<SiteConfig>("site-config"),
    ]).then(([contact, config]) => {
      setContactData(contact);
      setSiteConfig(config);
    });
  }, []);

  if (!contactData || !siteConfig) {
    return null;
  }

  return (
    <footer className="relative border-t border-[rgba(255,255,255,0.08)] bg-[#04050d] text-white z-10">
      <div className="px-[clamp(1.25rem,4vw,6rem)] py-16">
        <div className="grid gap-12 xl:grid-cols-[1.7fr_1fr] xl:items-start">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/8 border border-white/10 text-xl font-bold text-white shadow-[0_12px_40px_rgba(255,255,255,0.04)]">
                A
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">ApeX</p>
                <p className="mt-1 text-sm text-white/70">Premium digital experiences</p>
              </div>
            </div>

            <div className="space-y-4 max-w-xl">
              <p className="text-sm leading-7 text-white/70">
                Building futuristic websites, AI-powered visuals, and high-performance digital experiences for modern brands.
              </p>
              <p className="text-sm text-white/70">
                <span className="font-medium text-white">Get in Touch:</span>{' '}
                <a
                  href="mailto:teamapex.contact@gmail.com"
                  className="inline-flex rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/70 transition duration-300 hover:bg-white/10 hover:text-white hover:border-[#AAFF00]/30 hover:shadow-[0_0_24px_rgba(170,255,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 active:scale-95"
                >
                  teamapex.contact@gmail.com
                </a>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/apex"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition duration-300 hover:bg-white/10 hover:border-[#AAFF00]/30 hover:shadow-[0_0_24px_rgba(170,255,0,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 active:scale-95"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M16 11.99a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white transition duration-300 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4.98 3.5a1.48 1.48 0 1 1-2.96 0 1.48 1.48 0 0 1 2.96 0ZM0 8.5h5V24H0V8.5Zm7.5 0h4.75v2.4h.07c.66-1.26 2.28-2.6 4.69-2.6 5.01 0 5.93 3.3 5.93 7.6V24h-5V16.9c0-1.9-.04-4.35-2.65-4.35-2.65 0-3.05 2.07-3.05 4.2V24h-5V8.5Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-white/80 mb-5">Services</p>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    AI Product Poster
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    Branding & Identity
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    UI/UX Designs
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    Performance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-white/80 mb-5">Sections</p>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-white/80 mb-5">Pages</p>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <a href="#contact" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    Hire Us
                  </a>
                </li>
                <li>
                  <Link href="/404" className="text-sm text-white/70 transition-colors duration-300 hover:text-white">
                    404
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(255,255,255,0.08)] pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted/70">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          {contactData.socialLinks.length > 0 && (
            <ul className="flex flex-wrap items-center gap-4">
              {contactData.socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link-yg group relative text-xs uppercase tracking-[0.2em] text-text-muted transition-colors duration-300 min-h-[44px] inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AAFF00]"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#AAFF00] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
