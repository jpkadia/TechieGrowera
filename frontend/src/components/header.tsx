'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowUpRight,
  House,
  Users,
  Layers,
  Briefcase,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

const links = [
  { name: 'Home', href: '/', icon: House },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Services', href: '/services', icon: Layers },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Contact', href: '/contact', icon: MessageSquare },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setHidden(false);
    setScrolled(false);
  }

  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', close);
    return () => {
      window.removeEventListener('keydown', close);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    let stopTimer: ReturnType<typeof setTimeout> | null = null;

    function getScrollY() {
      return Math.max(
        window.scrollY || 0,
        window.pageYOffset || 0,
        document.documentElement?.scrollTop || 0,
        document.body?.scrollTop || 0
      );
    }

    let lastScrollY = getScrollY();

    function revealHeader() {
      setHidden(false);
      lastScrollY = getScrollY();
    }

    function scheduleStopReveal() {
      if (stopTimer) clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        revealHeader();
      }, 800);
    }

    function handleScroll() {
      const currentScrollY = getScrollY();

      setScrolled(currentScrollY > 20);

      if (open) {
        setHidden(false);
        lastScrollY = currentScrollY;
        return;
      }

      // If at or near top (<= 25px), always show header
      if (currentScrollY <= 25) {
        setHidden(false);
        if (stopTimer) clearTimeout(stopTimer);
        lastScrollY = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollY;

      // Scrolling down starts (diff > 1): IMMEDIATELY hide header
      if (diff > 1) {
        setHidden(true);
        lastScrollY = currentScrollY;
      }
      // Scrolling up (diff < -2): immediately reveal header
      else if (diff < -2) {
        setHidden(false);
        lastScrollY = currentScrollY;
      }

      // Exactly 0.8s (800ms) after scrolling stops, reveal header
      scheduleStopReveal();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scrollend', scheduleStopReveal, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scrollend', scheduleStopReveal);
      if (stopTimer) clearTimeout(stopTimer);
    };
  }, [open]);

  return (
    <>
      <header
        className={`site-header${open ? ' menu-is-open' : ''}${hidden ? ' is-hidden' : ''}${scrolled ? ' is-scrolled' : ''}`}
        style={
          open
            ? undefined
            : {
                WebkitBackdropFilter: scrolled
                  ? 'blur(24px) saturate(190%)'
                  : 'blur(20px) saturate(180%)',
                backdropFilter: scrolled
                  ? 'blur(24px) saturate(190%)'
                  : 'blur(20px) saturate(180%)',
              }
        }
      >
        {open && (
          <div
            className="nav-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
        <div className="container header-inner">
          <Link
            href="/"
            className="brand header-brand"
            aria-label="Techie Growera home"
            onClick={() => setOpen(false)}
          >
            <Image
              style={{ width: '43px', height: 'auto' }}
              src="/brand/mark.svg"
              width={43}
              height={39}
              alt=""
            />
            <span className="brand-info">
              <span className="brand-name">
                Techie <strong>Growera</strong>
              </span>
              <small>WEB · CREATIVE · GROWTH</small>
            </span>
          </Link>

          <nav
            id="primary-nav"
            className={open ? 'main-nav is-open' : 'main-nav'}
            aria-label="Main navigation"
          >
            <div className="drawer-header">
              <Link
                href="/"
                className="drawer-brand"
                aria-label="Techie Growera home"
                onClick={() => setOpen(false)}
              >
                <Image
                  style={{ width: '40px', height: 'auto', flexShrink: 0 }}
                  src="/brand/mark.svg"
                  width={40}
                  height={36}
                  alt=""
                />
                <span className="drawer-brand-info">
                  <span className="drawer-brand-title">
                    Techie <strong>Growera</strong>
                  </span>
                  <small className="drawer-brand-tagline">WEB · CREATIVE · GROWTH</small>
                </span>
              </Link>
              <button
                type="button"
                className="drawer-close"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X size={18} strokeWidth={2.2} />
              </button>
            </div>

            <div className="drawer-nav-links">
              {links.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    pathname === href ||
                    (href !== '/' && pathname.startsWith(href + '/'))
                      ? 'page'
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                >
                  <Icon size={16} className="nav-icon" aria-hidden="true" />
                  <span>{name}</span>
                </Link>
              ))}
            </div>

            <div className="drawer-footer">
              <Link href="/contact" className="button drawer-cta-button" onClick={() => setOpen(false)}>
                <span>Start a project</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </nav>

          <div className="header-actions">
            <Link href="/contact" className="header-cta">
              <span>Start a project</span>
              <ArrowUpRight size={15} aria-hidden="true" className="header-cta-icon" />
            </Link>
            <button
              ref={toggle}
              className="menu-toggle"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              aria-controls="primary-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
