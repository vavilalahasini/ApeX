"use client";

import { FormEvent, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Contact as ContactType } from "@/lib/types";
import type { ContactFormState } from "@/types";

const inputClass =
  "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 min-h-[44px] text-text-primary placeholder:text-[#555555] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AAFF00]/40 focus:border-[#AAFF00]/40 transition-colors";

export function ContactForm({ contactData }: { contactData: ContactType }) {
  const [formState, setFormState] = useState<ContactFormState>({ status: "idle" });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ status: "loading" });

    const form = e.currentTarget;
    const data = new FormData(form);

    const firstName = data.get("firstName") as string;
    const lastName = data.get("lastName") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    const company = data.get("company") as string;
    const service = data.get("service") as string;
    const message = data.get("message") as string;
    const website = data.get("website") as string;

    if (website?.trim()) {
      setFormState({ status: "success" });
      form.reset();
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          service,
          message,
          website,
        }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        const errorMessage = json?.error || "Failed to submit your request. Please try again later.";
        setFormState({ status: "error", message: errorMessage });
        return;
      }

      setFormState({ status: "success" });
      form.reset();
    } catch {
      setFormState({ status: "error", message: "Unable to connect to the backend. Please try again." });
    }
  };

  const isSubmitting = formState.status === "loading";
  const sent = formState.status === "success";
  const error = formState.status === "error" ? formState.message : null;

  return (
    <>
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
          onSubmit={handleSubmit}
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
                  name="firstName"
                  required
                  autoComplete="given-name"
                  disabled={isSubmitting || sent}
                  className={inputClass}
                  placeholder="Alex"
                />
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
                  name="lastName"
                  required
                  autoComplete="family-name"
                  disabled={isSubmitting || sent}
                  className={inputClass}
                  placeholder="Rivera"
                />
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
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  disabled={isSubmitting || sent}
                  className={inputClass}
                  placeholder="hello@yourcompany.com"
                />
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
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  disabled={isSubmitting || sent}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
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
                  name="company"
                  required
                  autoComplete="organization"
                  disabled={isSubmitting || sent}
                  className={inputClass}
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block text-xs uppercase tracking-[0.15em] text-text-muted mb-2"
                >
                  Service Required
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  disabled={isSubmitting || sent}
                  className={`${inputClass} appearance-none`}
                  defaultValue=""
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
              </div>
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
                name="message"
                required
                rows={5}
                disabled={isSubmitting || sent}
                className={`${inputClass} min-h-[120px] resize-none`}
                placeholder="Tell us about your project..."
              />
            </div>

            <Button
              type="submit"
              size="md"
              className="w-full"
              disabled={isSubmitting || sent}
            >
              {isSubmitting ? "Sending..." : sent ? "Message Sent" : "Send Message →"}
            </Button>
          </GlassPanel>
        </form>
      </Reveal>
    </>
  );
}
