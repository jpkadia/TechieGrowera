import Image from 'next/image';
import { LoginForm } from '@/components/admin/login';
export const metadata = { title: 'Sign in' };
export default function Login() {
  return (
    <main className="admin-login">
      <div className="admin-login-brand">
        <Image
          src="/brand/mark.svg"
          width={44}
          height={40}
          alt="Techie Growera"
          style={{ width: 'auto', height: 'auto', flexShrink: 0 }}
        />
        <div className="brand-info">
          <span className="brand-name">
            Techie <strong>Growera</strong>
          </span>
          <span className="brand-sub">ADMIN WORKSPACE</span>
        </div>
      </div>
      <LoginForm />
      <p className="admin-login-foot">Private access for the Techie Growera team.</p>
    </main>
  );
}
