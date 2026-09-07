import { ButtonLink } from '@/components/ui';
export default function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">404 · A DIFFERENT DIRECTION</span>
      <h1>
        This page took
        <br />a wrong turn.
      </h1>
      <p>
        The page may have moved or the address may be incomplete. Let’s get you back to a useful
        starting point.
      </p>
      <div className="button-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/services" secondary>
          Explore services
        </ButtonLink>
      </div>
    </section>
  );
}
