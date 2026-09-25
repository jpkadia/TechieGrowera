'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const VISITOR_ID_KEY = 'tg_visitor_id';
const CHAT_SESSION_KEY = 'tg_chat_session_id';

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track if pathname actually changed
    if (pathname === lastTrackedPath.current) return;
    lastTrackedPath.current = pathname;

    // Run non-blocking tracking after idle/render
    const track = () => {
      try {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY) || '';
        if (!visitorId) {
          visitorId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        const sessionId = localStorage.getItem(CHAT_SESSION_KEY) || '';
        const referrer = typeof document !== 'undefined' ? document.referrer : '';

        const payload = JSON.stringify({
          visitorId,
          sessionId: sessionId || undefined,
          path: pathname,
          referrer,
        });

        // Use sendBeacon if available, otherwise fire-and-forget fetch
        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/visit', blob);
        } else {
          fetch('/api/analytics/visit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } catch {
        // Suppress any tracking exceptions so visitor experience is never interrupted
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(track, { timeout: 2000 });
    } else {
      setTimeout(track, 300);
    }
  }, [pathname]);

  return null;
}
