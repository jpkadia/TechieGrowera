import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui';
import { pageMetadata, site } from '@/lib/site';
export const metadata = pageMetadata(
  'Privacy Policy',
  'How Techie Growera handles project enquiry information and optional website analytics, including purposes, storage and contact preferences.',
  '/privacy-policy',
);
export default function Privacy() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Privacy policy', href: '/privacy-policy' }]} />
          <h1>Privacy policy</h1>
          <p>Draft for business review · Updated 7 September 2026</p>
        </div>
      </section>
      <article className="section container legal prose">
        <p className="demo-notice">
          Pre-launch draft: the business operator’s legal identity, privacy contact, retention
          schedule and applicable jurisdiction must be confirmed before collecting live enquiries.
        </p>
        <h2>Information you choose to provide</h2>
        <p>
          The project enquiry form requests your name, business name, email, optional phone number,
          interested service, budget range and project description. We also record your consent and
          the time of submission.
        </p>
        <h2>Why information is used</h2>
        <p>
          Enquiry information is intended to help us respond to your request, discuss your project
          and prepare a proposal. The form does not enroll you in a marketing mailing list.
        </p>
        <h2>Storage and service providers</h2>
        <p>
          When configured for launch, enquiry records are stored in MongoDB Atlas and the website
          and API are hosted on Vercel. These providers process information as part of operating the
          service. Hosting and database regions should be selected and recorded by the business
          before launch.
        </p>
        <h2>Security and abuse prevention</h2>
        <p>
          The form uses validation and request limits. A keyed hash of the visitor’s IP address is
          used in short-lived rate-limit records; raw IP addresses are not stored with contact leads
          by this application. Infrastructure providers may maintain their own security logs.
        </p>
        <h2>Optional analytics</h2>
        <p>
          If Google Analytics is configured, it loads only after you select “Allow analytics.” You
          can change your preference through “Cookie settings.” Declining prevents future analytics
          loading after the page reloads. Previously collected data and existing browser cookies may
          need to be managed through your browser or a request to the business.
        </p>
        <h2>Retention and your requests</h2>
        <p>
          The business must adopt a documented retention and deletion schedule before launch. You
          can ask about access, correction or deletion of enquiry information using the published
          contact details. The handling of a request depends on applicable requirements and any
          records the business needs to retain.
        </p>
        <h2>Contact and updates</h2>
        <p>
          {site.email ? (
            <>
              For privacy enquiries, email <a href={`mailto:${site.email}`}>{site.email}</a>.
            </>
          ) : (
            <>
              A dedicated privacy contact is awaiting business confirmation. Please use the{' '}
              <Link href="/contact">contact page</Link> once live enquiry handling is available.
            </>
          )}{' '}
          This policy should be reviewed whenever the site’s data practices change.
        </p>
      </article>
    </>
  );
}
