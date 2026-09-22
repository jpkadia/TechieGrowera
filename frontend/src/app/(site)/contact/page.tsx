import { ArrowUpRight } from 'lucide-react';
import { Breadcrumbs, JsonLd } from '@/components/ui';
import { ContactForm } from '@/components/contact-form';
import { absolute, pageMetadata, site } from '@/lib/site';
import { socialProfiles } from '@/components/social-links';
export const metadata = pageMetadata(
  'Contact & Project Enquiries',
  'Tell Techie Growera about your website, creative, SEO or marketing project. Share your goals and discuss a focused scope for your business.',
  '/contact',
);
export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Contact', href: '/contact' }]} />
          <span className="eyebrow">LET’S BUILD WHAT’S NEXT</span>
          <h1>
            Contact
            <br />Techie Growera.
          </h1>
          <p className="intro">
            A new website, a clearer brand or a stronger digital presence. Tell us what you have in
            mind.
          </p>
        </div>
      </section>
      <section className="section container contact-layout">
        <aside>
          <h2>
            Your goals.
            <br />
            Our starting point.
          </h2>
          <p>
            You don’t need a perfect brief. Share where you are today and what you would like to
            improve.
          </p>
          {[
            ['Share your idea', 'Tell us a little about your business and the challenge.'],
            [
              'Find the right direction',
              'We’ll discuss priorities, scope and what a useful outcome looks like.',
            ],
            ['Agree the next steps', 'You receive a clear proposal before the work begins.'],
          ].map(([title, text], i) => (
            <div className="contact-step" key={title}>
              <span>0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
          {site.email && (
            <p>
              Prefer email?
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
          {site.phones.length > 0 && (
            <p>
              Call us
              <br />
              {site.phones.map((phone) => (
                <span key={phone} style={{ display: 'block' }}>
                  <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>
                </span>
              ))}
            </p>
          )}
          {site.serviceArea && <p>Service area: {site.serviceArea}</p>}
          {socialProfiles.length > 0 && (
            <div className="contact-social-block">
              <p className="contact-social-heading">Connect with us</p>
              <div className="contact-social-list">
                {socialProfiles.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="contact-social-link"
                      aria-label={`${s.name} (opens in a new tab)`}
                    >
                      <span className="contact-social-icon-wrapper" aria-hidden="true">
                        <Icon size={16} className="social-icon" />
                      </span>
                      <span className="contact-social-name">{s.name}</span>
                      <ArrowUpRight size={13} aria-hidden="true" className="social-arrow" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
        <ContactForm />
      </section>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            '@id': absolute('/contact#webpage'),
            url: absolute('/contact'),
            name: 'Contact Techie Growera | Digital Agency Consultations & Enquiries',
            description:
              'Get in touch with Parth Kadiya and Kush Kadia at Techie Growera for web development, SEO, creative design, and digital marketing enquiries.',
            isPartOf: { '@id': absolute('/#website') },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: absolute('/'),
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Contact',
                item: absolute('/contact'),
              },
            ],
          },
        ]}
      />
    </>
  );
}
