import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/content/services';
import { site } from '@/lib/site';
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="brand">
            <Image style={{ height: 'auto' }} src="/brand/mark.svg" width={42} height={38} alt="" />
            <span>
              Techie <strong>Growera</strong>
            </span>
          </Link>
          <p>Technology, creativity and a clear direction for your digital growth.</p>
          <span className="eyebrow">WEB · CREATIVE · GROWTH</span>
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
            ['Our work', '/portfolio'],
            ['Case studies', '/case-studies'],
            ['Insights', '/blog'],
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
          {site.socials.map((url, i) => (
            <a href={url} key={url} rel="noopener noreferrer" target="_blank">
              {new URL(url).hostname.includes('instagram')
                ? 'Instagram · @techiegrowera'
                : new URL(url).hostname.replace('www.', '')}
              <span className="sr-only"> social profile {i + 1} (opens in a new tab)</span> ↗
            </a>
          ))}
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
