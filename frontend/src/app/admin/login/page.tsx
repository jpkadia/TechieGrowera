import { LoginForm } from '@/components/admin/login';
export const metadata = { title: 'Sign in' };
export default function Login() {
  return (
    <main className="admin-login">
      <div className="admin-login-brand">
        Techie <strong>Growera</strong>
        <span>WORKSPACE</span>
      </div>
      <LoginForm />
      <p className="admin-login-foot">Private access for the Techie Growera team.</p>
    </main>
  );
}
