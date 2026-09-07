'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Portfolio', '/portfolio'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
];
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label="Techie Growera home"
          onClick={() => setOpen(false)}
        >
          <Image
            style={{ height: 'auto' }}
            src="/brand/mark.svg"
            width={43}
            height={39}
            alt=""
            priority
          />
          <span>
            Techie <strong>Growera</strong>
            <small>WEB · CREATIVE · GROWTH</small>
          </span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="primary-nav"
          className={open ? 'main-nav is-open' : 'main-nav'}
          aria-label="Main navigation"
        >
          {links.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={
                pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
                  ? 'page'
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {name}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className="header-cta">
          Start a project
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
