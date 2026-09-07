'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="not-found">
      <h1>Something interrupted this page.</h1>
      <p>Please try loading it again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
