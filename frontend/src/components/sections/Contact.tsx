import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import type { Contact as ContactType } from "@/lib/types";

export function Contact({ contactData, className }: { contactData: ContactType; className?: string }) {
  return (
    <section id="contact" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="contact-heading">
      <SectionHeading
        label={contactData.section.label}
        title={contactData.section.title}
        subtitle={contactData.section.subtitle}
        align="center"
      />

      <ContactForm contactData={contactData} />
    </section>
  );
}