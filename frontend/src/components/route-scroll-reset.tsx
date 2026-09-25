'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * RouteScrollReset ensures every page navigation strictly starts at the top (0, 0).
 * Prevents Next.js / browser scroll-restoration bugs where detail pages open
 * in the middle or visibly scroll from the middle.
 */
export function RouteScrollReset() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Disable automatic browser scroll restoration so browser does not fight Next.js
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      const resetScroll = () => {
        // Temporarily ensure html has no smooth scroll interference
        if (document.documentElement) {
          document.documentElement.style.scrollBehavior = 'auto';
          document.documentElement.scrollTop = 0;
        }
        if (document.body) {
          document.body.style.scrollBehavior = 'auto';
          document.body.scrollTop = 0;
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      };

      // 1. Reset synchronously before paint
      resetScroll();

      // 2. Backup on next animation frame
      const rafId = requestAnimationFrame(() => {
        resetScroll();
      });

      // 3. Backup after DOM settles
      const timerId = setTimeout(() => {
        resetScroll();
      }, 50);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
      };
    }
  }, [pathname]);

  return null;
}
