'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/services';
type Status = { kind: 'success' | 'error'; text: string } | null;
export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const started = useRef(0);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    started.current = Date.now();
    const requested = new URLSearchParams(window.location.search).get('service');
    if (requested && services.some((s) => s.slug === requested) && serviceRef.current)
      serviceRef.current.value = requested;
  }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true);
    setStatus(null);
    setErrors({});
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          consent: values.consent === 'on',
          startedAt: started.current,
        }),
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setErrors(data.errors || {});
        setStatus({
          kind: 'error',
          text: data.message || 'Your enquiry could not be sent. Please try again.',
        });
      } else {
        setStatus({ kind: 'success', text: data.message });
        form.reset();
        started.current = Date.now();
      }
    } catch {
      setStatus({
        kind: 'error',
        text: 'We could not confirm delivery. Please check your connection and try again later.',
      });
    } finally {
      setBusy(false);
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }
  function fieldError(name: string) {
    return errors[name] ? (
      <span id={`${name}-error`} className="field-error">
        {errors[name].join(' ')}
      </span>
    ) : null;
  }
  return (
    <form className="contact-form" onSubmit={submit} aria-label="Project enquiry">
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Your name *</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            required
            minLength={2}
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {fieldError('name')}
        </div>
        <div className="field">
          <label htmlFor="businessName">Business name</label>
          <input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            placeholder="Your business or brand"
            maxLength={150}
          />
          {fieldError('businessName')}
        </div>
        <div className="field">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            maxLength={254}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {fieldError('email')}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Include your country code"
            maxLength={25}
          />
          {fieldError('phone')}
        </div>
        <div className="field">
          <label htmlFor="service">Interested service *</label>
          <select ref={serviceRef} id="service" name="service" required defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
            <option value="not-sure">I’d like some guidance</option>
          </select>
          {fieldError('service')}
        </div>
        <div className="field">
          <label htmlFor="budget">Budget range (INR) *</label>
          <select id="budget" name="budget" required defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            <option value="under-25k">Under ₹25,000</option>
            <option value="25k-50k">₹25,000 – ₹50,000</option>
            <option value="50k-100k">₹50,000 – ₹1,00,000</option>
            <option value="100k-plus">₹1,00,000+</option>
            <option value="discuss">Let’s discuss</option>
          </select>
          {fieldError('budget')}
        </div>
        <div className="field full">
          <label htmlFor="description">Tell us about your project *</label>
          <textarea
            id="description"
            name="description"
            placeholder="What do you want to build or improve? Share your goals, timeline and any useful context."
            required
            minLength={20}
            maxLength={5000}
            rows={5}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {fieldError('description')}
        </div>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="consent-check">
        <input type="checkbox" name="consent" required />
        <span>
          I agree to be contacted about this enquiry and have read the{' '}
          <Link href="/privacy-policy">privacy policy</Link>. *
        </span>
      </label>
      {fieldError('consent')}
      <button className="button" type="submit" disabled={busy} aria-busy={busy}>
        {busy ? 'Sending your enquiry…' : 'Send project enquiry'}
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>
      <p className="form-note">
        * Required fields. Budget ranges help us understand your brief; they are not service prices.
      </p>
      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite">
        {status && (
          <p className={`form-message ${status.kind === 'error' ? 'error' : ''}`}>{status.text}</p>
        )}
      </div>
    </form>
  );
}
