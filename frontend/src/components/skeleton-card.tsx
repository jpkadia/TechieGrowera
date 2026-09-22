'use client';

type Props = {
  type?: 'work' | 'blog';
};

/**
 * YouTube / Instagram style Shimmer Skeleton Wave component.
 * Mirrors the exact geometry of WorkCard and BlogCard with GPU-accelerated
 * horizontal gradient wave animation, replacing circular spinners.
 */
export function SkeletonCard({ type = 'work' }: Props) {
  return (
    <div className={`skeleton-card skeleton-${type}`} aria-hidden="true">
      <div className="skeleton-media skeleton-shimmer">
        <div className="skeleton-badge skeleton-shimmer" />
        <div className="skeleton-brand skeleton-shimmer" />
      </div>
      <div className="skeleton-caption">
        <div className="skeleton-line skeleton-line-title skeleton-shimmer" />
        <div className="skeleton-line skeleton-line-text skeleton-shimmer" />
        <div className="skeleton-line skeleton-line-short skeleton-shimmer" />
        <div className="skeleton-footer">
          <div className="skeleton-pill skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
