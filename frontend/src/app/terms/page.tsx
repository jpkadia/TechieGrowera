import { Breadcrumbs } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'Terms & Conditions',
  'Draft website terms for Techie Growera, covering enquiries, proposals, content ownership, illustrative work and service expectations.',
  '/terms',
);
export default function Terms() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Terms', href: '/terms' }]} />
          <h1>Terms & conditions</h1>
          <p>Draft for business review · Updated 7 September 2026</p>
        </div>
      </section>
      <article className="section container legal prose">
        <p className="demo-notice">
          Pre-launch draft: the legal operator, business address and governing jurisdiction need to
          be supplied and the final terms reviewed before publication.
        </p>
        <h2>Using this website</h2>
        <p>
          This website introduces Techie Growera’s services and provides general information. Please
          use it lawfully and do not attempt to interfere with the website, access non-public
          systems or submit harmful or misleading material.
        </p>
        <h2>Enquiries and project agreements</h2>
        <p>
          Submitting an enquiry does not create a service agreement. Deliverables, fees, timelines,
          payment terms, revisions, ownership and support responsibilities are defined in a separate
          written proposal or agreement accepted by the parties.
        </p>
        <h2>Content and intellectual property</h2>
        <p>
          Website brand assets and original content may not be reused commercially without
          permission from the relevant rights holder. Client-supplied materials and third-party
          assets remain subject to their respective rights and licenses. Project handover rights are
          addressed in the project agreement.
        </p>
        <h2>Concept work</h2>
        <p>
          Portfolio items labelled as demos or concepts are illustrative. They do not represent
          commissioned work, endorsements, measured results or business relationships with real
          clients.
        </p>
        <h2>Marketing outcomes</h2>
        <p>
          Search rankings, advertising costs, leads and business results depend on many factors. No
          specific ranking or commercial result is guaranteed by this website. Agreed professional
          deliverables are described in the relevant project proposal.
        </p>
        <h2>External services and availability</h2>
        <p>
          Third-party platforms have their own terms and policies. Website content can change, and
          service availability may be interrupted for maintenance or technical reasons.
        </p>
        <h2>Project-specific terms</h2>
        <p>
          Any cancellation, liability, dispute resolution or jurisdiction provisions must be set out
          in the reviewed agreement appropriate to the business and the project. Nothing in this
          draft is intended to remove rights that cannot lawfully be excluded.
        </p>
      </article>
    </>
  );
}
