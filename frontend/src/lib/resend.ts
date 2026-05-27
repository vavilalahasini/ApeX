import { Resend } from 'resend';
import type { ContactFormPayload } from '@/types';

function getResendConfig() {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;
  const contactToEmail = process.env.CONTACT_TO_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAILS;

  if (!resendApiKey) {
    throw new Error('Missing RESEND_API_KEY. Add it to your frontend/.env.local or production environment.');
  }

  if (!resendFromEmail) {
    throw new Error('Missing RESEND_FROM_EMAIL. Add it to your frontend/.env.local or production environment.');
  }

  if (!contactToEmail) {
    throw new Error('Missing CONTACT_TO_EMAIL or NEXT_PUBLIC_ADMIN_EMAILS. Add an admin recipient to your env.');
  }

  return {
    resendApiKey,
    resendFromEmail,
    contactToEmail,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function escapePayload(payload: ContactFormPayload): ContactFormPayload {
  return {
    firstName: escapeHtml(payload.firstName),
    lastName: escapeHtml(payload.lastName),
    email: escapeHtml(payload.email),
    phone: payload.phone ? escapeHtml(payload.phone) : undefined,
    company: payload.company ? escapeHtml(payload.company) : undefined,
    service: escapeHtml(payload.service),
    message: escapeHtml(payload.message),
    website: payload.website ? escapeHtml(payload.website) : undefined,
  };
}

function formatAdminHtml(payload: ContactFormPayload) {
  return `
    <div style="font-family:system-ui, sans-serif; line-height:1.6; color:#111;">
      <h1>New contact request received</h1>
      <p>A new contact form submission has been saved to Supabase.</p>
      <h2>Submission details</h2>
      <ul>
        <li><strong>Name:</strong> ${payload.firstName.trim()} ${payload.lastName.trim()}</li>
        <li><strong>Email:</strong> ${payload.email.trim()}</li>
        ${payload.phone ? `<li><strong>Phone:</strong> ${payload.phone.trim()}</li>` : ''}
        ${payload.company ? `<li><strong>Company:</strong> ${payload.company.trim()}</li>` : ''}
        <li><strong>Service:</strong> ${payload.service.trim()}</li>
        <li><strong>Message:</strong> ${payload.message.trim()}</li>
        ${payload.website ? `<li><strong>Website:</strong> ${payload.website.trim()}</li>` : ''}
      </ul>
      <p style="margin-top:1rem;">View submissions in the admin dashboard to follow up.</p>
    </div>
  `;
}

function formatUserHtml(payload: ContactFormPayload) {
  return `
    <div style="font-family:system-ui, sans-serif; line-height:1.6; color:#111;">
      <h1>Thanks for reaching out, ${payload.firstName.trim()}!</h1>
      <p>We received your message and will review it shortly.</p>
      <p><strong>Your request:</strong></p>
      <ul>
        <li><strong>Service:</strong> ${payload.service.trim()}</li>
        ${payload.company ? `<li><strong>Company:</strong> ${payload.company.trim()}</li>` : ''}
      </ul>
      <p>One of our team members will contact you soon at <strong>${payload.email.trim()}</strong>.</p>
      <p>Have a great day!</p>
    </div>
  `;
}

export async function sendContactNotificationEmails(rawPayload: ContactFormPayload) {
  const payload = escapePayload(rawPayload);
  const config = getResendConfig();
  const resend = new Resend(config.resendApiKey);
  const adminRecipients = config.contactToEmail.split(',').map((email) => email.trim()).filter(Boolean);

  if (adminRecipients.length === 0) {
    throw new Error('No valid admin email recipients configured for CONTACT_TO_EMAIL.');
  }

  const sendRequests = [
    resend.emails.send({
      from: config.resendFromEmail,
      to: adminRecipients,
      subject: `New contact request from ${payload.firstName.trim()} ${payload.lastName.trim()}`,
      html: formatAdminHtml(payload),
    }),
    resend.emails.send({
      from: config.resendFromEmail,
      to: payload.email.trim(),
      subject: `Thanks for contacting ApeX Studio`,
      html: formatUserHtml(payload),
    }),
  ];

  const responses = await Promise.all(sendRequests);
  return responses;
}
