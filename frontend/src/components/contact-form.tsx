'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/services';
import { getClientDeviceInfo } from '@/lib/device-detect';

type Status = { kind: 'success' | 'error'; text: string } | null;
type ColdPhase = 'idle' | 'sending' | 'waking' | 'connecting';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s().-]*$/;

function validateClientForm(formData: FormData): Record<string, string[]> {
  const errs: Record<string, string[]> = {};

  const name = String(formData.get('name') || '').trim();
  if (!name) {
    errs.name = ['Please enter your name.'];
  } else if (name.length < 2) {
    errs.name = ['Name must be at least 2 characters.'];
  } else if (name.length > 100) {
    errs.name = ['Name cannot exceed 100 characters.'];
  }

  const businessName = String(formData.get('businessName') || '').trim();
  if (businessName.length > 150) {
    errs.businessName = ['Business name cannot exceed 150 characters.'];
  }

  const email = String(formData.get('email') || '').trim();
  if (!email) {
    errs.email = ['Please enter your email address.'];
  } else if (!EMAIL_REGEX.test(email) || email.length > 254) {
    errs.email = ['Please enter a valid email address (e.g. name@company.com).'];
  }

  const phone = String(formData.get('phone') || '').trim();
  if (!phone) {
    errs.phone = ['Please enter your phone number.'];
  } else if (phone.length > 25) {
    errs.phone = ['Phone number cannot exceed 25 characters.'];
  } else if (!PHONE_REGEX.test(phone) || !/\d/.test(phone)) {
    errs.phone = ['Please enter a valid phone number.'];
  }

  const service = String(formData.get('service') || '').trim();
  if (!service) {
    errs.service = ['Please select a service or request guidance.'];
  }

  const description = String(formData.get('description') || '').trim();
  if (!description) {
    errs.description = ['Please tell us about your project requirements.'];
  } else if (description.length < 20) {
    errs.description = [
      `Project details must be at least 20 characters (currently ${description.length}).`,
    ];
  } else if (description.length > 5000) {
    errs.description = ['Project details cannot exceed 5000 characters.'];
  }

  const consent = formData.get('consent');
  if (consent !== 'on') {
    errs.consent = ['Please agree to the privacy policy to proceed.'];
  }

  return errs;
}

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [coldPhase, setColdPhase] = useState<ColdPhase>('idle');
  const [status, setStatus] = useState<Status>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const started = useRef(0);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    started.current = Date.now();
    const requested = new URLSearchParams(window.location.search).get('service');
    if (requested && services.some((s) => s.slug === requested) && serviceRef.current) {
      serviceRef.current.value = requested;
    }
  }, []);

  function handleFieldChange(event: React.FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLElement & { name?: string };
    const fieldName = target.name;
    if (fieldName && errors[fieldName]) {
      setErrors((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Client-side JavaScript validation
    const clientErrors = validateClientForm(formData);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      setStatus({
        kind: 'error',
        text: 'Please correct the highlighted fields before submitting.',
      });

      const firstFieldKey = Object.keys(clientErrors)[0];
      const el = form.elements.namedItem(firstFieldKey) as HTMLElement | null;
      if (el && typeof el.focus === 'function') {
        el.focus();
      }
      return;
    }

    const values = Object.fromEntries(formData);
    setBusy(true);
    setColdPhase('sending');
    setStatus(null);
    setErrors({});

    const wakingTimer = setTimeout(() => {
      setColdPhase('waking');
    }, 3500);

    const connectingTimer = setTimeout(() => {
      setColdPhase('connecting');
    }, 16000);

    try {
      const deviceInfo = await getClientDeviceInfo();
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-os': deviceInfo.os,
          'x-client-browser': deviceInfo.browser,
          'x-client-device': deviceInfo.device,
        },
        body: JSON.stringify({
          ...values,
          consent: values.consent === 'on',
          startedAt: started.current,
        }),
        signal: AbortSignal.timeout(60000), // Patient 60s timeout for Render cold start
      });
      clearTimeout(wakingTimer);
      clearTimeout(connectingTimer);
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        setErrors(data.errors || {});
        setStatus({
          kind: 'error',
          text: data.message || 'Your enquiry could not be sent. Please tap Send enquiry again.',
        });
      } else {
        setStatus({ kind: 'success', text: data.message });
        form.reset();
        started.current = Date.now();
      }
    } catch {
      clearTimeout(wakingTimer);
      clearTimeout(connectingTimer);
      setStatus({
        kind: 'error',
        text: 'The server is taking a little longer to wake up. Your message is safely kept in the form — please tap Send project enquiry again.',
      });
    } finally {
      clearTimeout(wakingTimer);
      clearTimeout(connectingTimer);
      setBusy(false);
      setColdPhase('idle');
      requestAnimationFrame(() => resultRef.current?.focus());
    }
  }

  function fieldError(name: string) {
    return errors[name] ? (
      <span id={`${name}-error`} className="field-error" role="alert">
        {errors[name].join(' ')}
      </span>
    ) : null;
  }

  return (
    <form
      className="contact-form"
      onSubmit={submit}
      onChange={handleFieldChange}
      aria-label="Project enquiry"
      noValidate
    >
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Your name *</label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            maxLength={100}
            aria-required="true"
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
            aria-invalid={!!errors.businessName}
            aria-describedby={errors.businessName ? 'businessName-error' : undefined}
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
            maxLength={254}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {fieldError('email')}
        </div>
        <div className="field">
          <label htmlFor="phone">Phone number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Include your country code"
            maxLength={25}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {fieldError('phone')}
        </div>
        <div className="field full">
          <label htmlFor="service">Interested service *</label>
          <select
            ref={serviceRef}
            id="service"
            name="service"
            defaultValue=""
            aria-required="true"
            aria-invalid={!!errors.service}
            aria-describedby={errors.service ? 'service-error' : undefined}
          >
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
        <div className="field full">
          <label htmlFor="description">Tell us about your project *</label>
          <textarea
            id="description"
            name="description"
            placeholder="What do you want to build or improve? Share your goals, timeline and any useful context."
            maxLength={5000}
            rows={5}
            aria-required="true"
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
      <label className={`consent-check ${errors.consent ? 'has-error' : ''}`}>
        <input
          id="consent"
          type="checkbox"
          name="consent"
          aria-required="true"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
        />
        <span>
          I agree to be contacted about this enquiry and have read the{' '}
          <Link href="/privacy-policy">privacy policy</Link>. *
        </span>
      </label>
      {fieldError('consent')}
      <button className="button" type="submit" disabled={busy} aria-busy={busy}>
        {busy
          ? coldPhase === 'waking'
            ? 'Waking up secure server…'
            : coldPhase === 'connecting'
              ? 'Connecting to server…'
              : 'Sending your enquiry…'
          : 'Send project enquiry'}
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>

      {busy && (coldPhase === 'waking' || coldPhase === 'connecting') && (
        <div className="cold-start-notice" role="status" aria-live="polite">
          <span className="pulse-dot" aria-hidden="true" />
          <span>
            {coldPhase === 'waking'
              ? 'Our secure server is waking up after inactivity. Your enquiry is safely queued and will send momentarily…'
              : 'Almost there! Establishing encrypted connection to deliver your enquiry…'}
          </span>
        </div>
      )}

      <p className="form-note">
        * Required fields. We review your requirements and discuss tailored options after consultation.
      </p>
      <div ref={resultRef} tabIndex={-1} role="status" aria-live="polite">
        {status && (
          <p className={`form-message ${status.kind === 'error' ? 'error' : ''}`}>{status.text}</p>
        )}
      </div>
    </form>
  );
}
