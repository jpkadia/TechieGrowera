'use client';

import { useEffect } from 'react';

/**
 * Non-blocking client-side warmup trigger.
 * Fires a low-priority background ping once per user session to wake up the
 * Render backend if it was sleeping, without blocking initial page load or LCP.
 */
export function Warmup() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    try {
      const alreadyWarmed = sessionStorage.getItem('tg_backend_warmed');
      if (alreadyWarmed === 'true') return;
    } catch {
      // Ignore sessionStorage access restrictions (e.g. private mode)
    }

    const triggerWarmup = () => {
      fetch('/api/warmup', {
        method: 'GET',
        cache: 'no-store',
        priority: 'low',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok || data.warmed) {
            try {
              sessionStorage.setItem('tg_backend_warmed', 'true');
            } catch {
              // Ignore
            }
          }
        })
        .catch(() => {
          // Non-critical background ping; silent error
        });
    };

    // Use requestIdleCallback if available, fallback to 1.2s timeout
    if ('requestIdleCallback' in window) {
      const idleId = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(triggerWarmup);
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
        }
      };
    } else {
      const timer = setTimeout(triggerWarmup, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
