'use client';
import { useState } from 'react';
import Link from 'next/link';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import { adminApi } from './api';
import { Notice } from './shared';
export function LoginForm() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const fields = new FormData(event.currentTarget);
    try {
      await adminApi('login', 'POST', {
        email: fields.get('email'),
        password: fields.get('password'),
      });
      // Discard any pre-login router cache after receiving the HttpOnly session cookie.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign('/admin');
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <form className="admin-login-card" onSubmit={submit}>
      <span className="admin-lock">
        <LockKeyhole size={25} />
      </span>
      <h1>Welcome back.</h1>
      <p>Sign in to manage your enquiries and content.</p>
      <label>
        Email address
        <input type="email" name="email" autoComplete="username" required maxLength={254} />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          maxLength={256}
        />
      </label>
      <Notice text={error} error />
      <button className="admin-primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in securely'}
        <ArrowRight size={18} />
      </button>
      <Link href="/">← Back to website</Link>
    </form>
  );
}
