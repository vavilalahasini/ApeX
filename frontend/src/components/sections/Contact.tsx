"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useContact } from "@/hooks/useContent";
import type { ContactFormState } from "@/types";

interface TurnstileWidget {
  render: (selector: string, options: TurnstileOptions) => number;
  reset: (widgetId: number) => void;
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileWidget;
  }
}

const inputClass =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 min-h-[44px] text-text-primary placeholder:text-[#555555] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAFF00]/40 focus:border-[#AAFF00]/40 transition-colors";

const errorClass =
  "text-xs text-[#ff9ed4] mt-1";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
  currentWebsite: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please describe your project (10+ characters)"),
  website: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function Contact({ className }: { className?: string }) {
  const [formState, setFormState] = useState<ContactFormState>({ status: "idle" });
  const { data: contactData, loading: isLoadingContactData } = useContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const captchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLED === "true";
  const captchaSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const isCaptchaReady = captchaEnabled && Boolean(captchaSiteKey);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaWidgetId = useRef<number | null>(null);

  if (isLoadingContactData) {
    return (
      <section id="contact" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="contact-heading">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-8 bg-gray-800 rounded w-1/4 mx-auto" />
          <div className="h-12 bg-gray-800 rounded w-1/2 mx-auto" />
          <div className="h-96 bg-gray-800 rounded" />
        </div>
      </section>
    );
  }

  if (!contactData) return null;

  const renderCaptcha = () => {
    const widget = window.turnstile;
    if (!widget || captchaWidgetId.current !== null || !isCaptchaReady) return;

    captchaWidgetId.current = widget.render("#turnstile-widget", {
      sitekey: captchaSiteKey,
      callback: (token: string) => setCaptchaToken(token),
      "error-callback": () => setCaptchaToken(null),
      "expired-callback": () => setCaptchaToken(null),
    });
  };

  const onSubmit = async (data: FormData) => {
    setFormState({ status: "loading" });

    if (captchaEnabled && !captchaToken) {
      setFormState({ status: "error", message: "Please complete the CAPTCHA challenge before submitting." });
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          captchaToken: captchaToken ?? undefined,
        }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        const errorMessage = json?.error || "Failed to submit your request. Please try again later.";
        setFormState({ status: "error", message: errorMessage });
        return;
      }

      if (captchaEnabled && window.turnstile && captchaWidgetId.current !== null) {
        window.turnstile.reset(captchaWidgetId.current);
        setCaptchaToken(null);
      }

      setFormState({ status: "success" });
      reset();
    } catch {
      setFormState({ status: "error", message: "Unable to connect to the backend. Please try again." });
    }
  };

  const sent = isSubmitSuccessful;
  const error = formState.status === "error" ? formState.message : null;

  return (
    <section id="contact" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="contact-heading">
      <SectionHeading
        label={contactData.section.label}
        title={contactData.section.title}
        subtitle={contactData.section.subtitle}
        align="center"
      />

      {sent && (
        <div
          role="status"
          className="max-w-2xl mx-auto mb-6 p-4 rounded-xl border border-[#AAFF00]/40 bg-[rgba(170,255,0,0.07)] text-center accent-yg"
        >
          Thank you — your request has been submitted successfully. We will follow up shortly.
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="max-w-2xl mx-auto mb-6 p-4 rounded-xl border border-[#ff2d9b]/40 bg-[rgba(255,45,155,0.08)] text-center text-[#ff9ed4]"
        >
          {error}
        </div>
      )}

      <Reveal className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          aria-busy={isSubmitting}
          noValidate
        >
        <GlassPanel className="rounded-2xl p-8 md:p-12">
          <div className="absolute w-px h-px overflow-hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="opacity-0 pointer-events-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                {...register("firstName")}
                required
                autoComplete="given-name"
                disabled={isSubmitting || sent}
                className={inputClass}
                placeholder="Alex"
                aria-invalid={errors.firstName ? "true" : "false"}
              />
              {errors.firstName && <p className={errorClass} role="alert">{errors.firstName.message}</p>}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                {...register("lastName")}
                required
                autoComplete="family-name"
                disabled={isSubmitting || sent}
                className={inputClass}
                placeholder="Rivera"
                aria-invalid={errors.lastName ? "true" : "false"}
              />
              {errors.lastName && <p className={errorClass} role="alert">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                required
                autoComplete="email"
                disabled={isSubmitting || sent}
                className={inputClass}
                placeholder="hello@yourcompany.com"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className={errorClass} role="alert">{errors.email.message}</p>}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
              >
                Phone / WhatsApp
              </label>
              <input
                id="phone"
                {...register("phone")}
                type="tel"
                required
                autoComplete="tel"
                disabled={isSubmitting || sent}
                className={inputClass}
                placeholder="+91 98765 43210"
                aria-invalid={errors.phone ? "true" : "false"}
              />
              {errors.phone && <p className={errorClass} role="alert">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label
                htmlFor="company"
                className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
              >
                Company / Brand Name
              </label>
              <input
                id="company"
                {...register("company")}
                required
                autoComplete="organization"
                disabled={isSubmitting || sent}
                className={inputClass}
                placeholder="Your Company"
                aria-invalid={errors.company ? "true" : "false"}
              />
              {errors.company && <p className={errorClass} role="alert">{errors.company.message}</p>}
            </div>
            <div>
              <label
                htmlFor="currentWebsite"
                className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
              >
                Current website URL <span className="text-text-muted/60">(optional)</span>
              </label>
              <input
                id="currentWebsite"
                {...register("currentWebsite")}
                type="url"
                autoComplete="url"
                disabled={isSubmitting || sent}
                className={inputClass}
                placeholder="https://yoursite.com"
                aria-invalid={errors.currentWebsite ? "true" : "false"}
              />
              {errors.currentWebsite && <p className={errorClass} role="alert">{errors.currentWebsite.message}</p>}
              <p className="text-xs text-text-muted/50 mt-1">Leave blank if you don&apos;t have one yet.</p>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="service"
              className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
            >
              Service Required
            </label>
            <select
              id="service"
              {...register("service")}
              required
              disabled={isSubmitting || sent}
              className={`${inputClass} appearance-none`}
              defaultValue=""
              aria-invalid={errors.service ? "true" : "false"}
            >
              <option value="" disabled className="bg-bg-elevated">
                Select a service
              </option>
              {contactData.services.map((s) => (
                <option key={s} value={s} className="bg-bg-elevated">
                  {s}
                </option>
              ))}
            </select>
            {errors.service && <p className={errorClass} role="alert">{errors.service.message}</p>}
          </div>

          <div className="mb-8">
            <label
              htmlFor="message"
              className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
            >
              Project Description
            </label>
            <textarea
              id="message"
              {...register("message")}
              required
              rows={5}
              disabled={isSubmitting || sent}
              className={`${inputClass} min-h-[120px] resize-none`}
              placeholder="Tell us about your project..."
              aria-invalid={errors.message ? "true" : "false"}
            />
            {errors.message && <p className={errorClass} role="alert">{errors.message.message}</p>}
          </div>

          {captchaEnabled && (
            <div className="mb-6">
              {isCaptchaReady ? (
                <>
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    strategy="afterInteractive"
                    onLoad={renderCaptcha}
                  />
                  <div id="turnstile-widget" className="mx-auto max-w-md" />
                </>
              ) : (
                <div className="rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
                  CAPTCHA is enabled but the site key is not configured. Please contact the site administrator.
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            size="md"
            className="w-full"
            disabled={isSubmitting || sent || (captchaEnabled && !isCaptchaReady)}
          >
            {isSubmitting ? "Sending…" : sent ? "Message Sent" : "Send Message →"}
          </Button>
        </GlassPanel>
      </form>
      </Reveal>
    </section>
  );
}