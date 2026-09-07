'use client';
export function AdminHeading({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="admin-heading">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {children}
    </div>
  );
}
export function Notice({ text, error = false }: { text: string; error?: boolean }) {
  return text ? (
    <p role={error ? 'alert' : 'status'} className={`admin-notice ${error ? 'is-error' : ''}`}>
      {text}
    </p>
  ) : null;
}
export function Pager({
  page,
  total,
  size,
  onChange,
}: {
  page: number;
  total: number;
  size: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="admin-pager">
      <span>
        {total} records · Page {page} of {Math.max(1, Math.ceil(total / size))}
      </span>
      <div>
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </button>
        <button disabled={page * size >= total} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
