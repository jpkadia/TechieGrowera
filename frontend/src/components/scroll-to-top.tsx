'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      const scrollY = Math.max(
        window.scrollY || 0,
        window.pageYOffset || 0,
        document.documentElement?.scrollTop || 0,
        document.body?.scrollTop || 0
      );
      setVisible(scrollY > 60);
    }

    updateVisibility();

    window.addEventListener('scroll', updateVisibility, { passive: true, capture: true });
    document.addEventListener('scroll', updateVisibility, { passive: true, capture: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
    window.addEventListener('orientationchange', updateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateVisibility, { capture: true });
      document.removeEventListener('scroll', updateVisibility, { capture: true });
      window.removeEventListener('resize', updateVisibility);
      window.removeEventListener('orientationchange', updateVisibility);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    if (document.documentElement) {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    if (document.body) {
      document.body.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <button
      type="button"
      className={`scroll-to-top${visible ? ' is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      title="Back to top"
    >
      <ArrowUp size={20} aria-hidden="true" className="scroll-to-top-icon" />
    </button>
  );
}
