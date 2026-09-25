import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/services';
import { site } from '@/lib/site';
import { socialProfiles } from '@/components/social-links';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <Image style={{ width: 'auto', height: 'auto' }} src="/brand/mark.svg" width={42} height={38} alt="" />
            <span className="brand-info">
              <span className="brand-name">
                Techie <strong>Growera</strong>
              </span>
            </span>
          </Link>
          <p>Scaling digital presence with intent. Web development, creative and measurable growth.</p>
          <span className="eyebrow">SCALING DIGITAL PRESENCE WITH INTENT</span>
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          {site.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
              {phone}
            </a>
          ))}
          {site.address && <p>{site.address}</p>}
          {site.serviceArea && <p>Serving {site.serviceArea}</p>}
        </div>
        <div>
          <h2>Our services</h2>
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`}>
              {s.name}
            </Link>
          ))}
        </div>
        <div>
          <h2>Explore</h2>
          {[
            ['About us', '/about'],
            ['Portfolio', '/portfolio'],
            ['Blog', '/blog'],
            ['Contact', '/contact'],
          ].map(([title, href]) => (
            <Link key={href} href={href}>
              {title}
            </Link>
          ))}
        </div>
        <div>
          <h2>Let’s connect</h2>
          <p>
            Have something in mind?
            <br />
            We’d love to hear it.
          </p>
          <Link className="text-link" href="/contact">
            Discuss your project ↗
          </Link>
          <div className="footer-social-list">
            {socialProfiles.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  href={s.url}
                  key={s.name}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="footer-social-link"
                  aria-label={`${s.label} (opens in a new tab)`}
                >
                  <Icon size={15} aria-hidden="true" className="social-icon" />
                  <span>{s.label}</span>
                  <ArrowUpRight size={13} aria-hidden="true" className="social-arrow" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Techie Growera.</span>
        <div>
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms">Terms & conditions</Link>
        </div>
        <span>Built with purpose.</span>
      </div>
    </footer>
  );
}
