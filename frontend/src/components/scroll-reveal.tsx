'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Target selectors for scroll reveal.
 * Covers section headings, cards, feature blocks, and standalone content panels
 * across all public pages while explicitly excluding above-the-fold heroes.
 */
const TARGET_SELECTORS = [
  '.reveal-on-scroll',
  '.heading-row',
  '.section-heading',
  '.service-card',
  '.growth-grid > article',
  '.process-grid > div',
  '.principles > div',
  '.about-values > article',
  '.founder-card',
  '.work-card',
  '.blog-card',
  '.feature-main',
  '.feature-side',
  '.faq-list > details',
  '.content-panel',
  '.value-strip',
  '.cta-section',
  '.growth-fullwidth-banner',
  '.about-studio-fullwidth',
  '.contact-layout > aside',
  '.contact-layout > form',
  '.article-layout > article > section',
  '.article-layout > aside',
];

/**
 * ScrollReveal: Native IntersectionObserver + GPU CSS transitions.
 * - Progressive enhancement: Crawlers and SSR receive 100% visible static HTML.
 * - Hardware accelerated: Transitions only `transform: translate3d()` and `opacity`.
 * - Zero layout shift (CLS = 0).
 * - Above-the-fold / Hero sections are strictly exempt to protect Core Web Vitals (LCP).
 * - Admin panel is strictly exempt.
 */
export function ScrollReveal() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 1. Strictly exempt Admin panel
    if (pathname.startsWith('/admin')) {
      document.documentElement.classList.remove('has-scroll-reveal');
      return;
    }

    // 2. Safety check: IntersectionObserver support
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    // 3. Skip bots/crawlers and users with prefers-reduced-motion
    const isBot =
      /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headless/i.test(navigator.userAgent);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isBot || prefersReducedMotion) {
      document.documentElement.classList.remove('has-scroll-reveal');
      return;
    }

    const main = document.getElementById('main');
    if (!main) return;

    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Create single observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.08,
      }
    );
    observerRef.current = observer;

    const scanAndObserve = () => {
      if (!main) return;

      const targetSet = new Set<HTMLElement>();

      // Collect target elements from defined selectors
      for (const sel of TARGET_SELECTORS) {
        const matches = main.querySelectorAll<HTMLElement>(sel);
        for (let i = 0; i < matches.length; i++) {
          const el = matches[i];
          // Skip if inside hero or page-hero (preserves LCP / above-the-fold)
          if (el.closest('.hero, .page-hero')) continue;
          targetSet.add(el);
        }
      }

      // Fallback: any section that does not contain granular targets
      const sections = main.querySelectorAll<HTMLElement>('section:not(.hero):not(.page-hero)');
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (targetSet.has(sec)) continue;
        const hasChildTarget = Array.from(targetSet).some((t) => sec.contains(t));
        if (!hasChildTarget) {
          targetSet.add(sec);
        }
      }

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const parentGroups = new Map<HTMLElement, HTMLElement[]>();

      targetSet.forEach((el) => {
        // Prevent double nesting: skip if an ancestor is also in targetSet
        let ancestor = el.parentElement;
        let hasTargetAncestor = false;
        while (ancestor && ancestor !== main && ancestor !== document.body) {
          if (targetSet.has(ancestor)) {
            hasTargetAncestor = true;
            break;
          }
          ancestor = ancestor.parentElement;
        }
        if (hasTargetAncestor) return;

        el.classList.add('reveal-on-scroll');

        const parent = el.parentElement;
        if (parent) {
          const group = parentGroups.get(parent) || [];
          group.push(el);
          parentGroups.set(parent, group);
        }

        // If element is already in or above the viewport on initial load/navigation,
        // reveal it immediately to avoid any visual flicker or load delay.
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight * 0.88) {
          el.classList.add('is-revealed');
        } else if (!el.classList.contains('is-revealed')) {
          observer.observe(el);
        }
      });

      // Apply subtle stagger delay indices for multi-item sibling groups
      parentGroups.forEach((children) => {
        if (children.length > 1) {
          children.forEach((child, idx) => {
            child.dataset.revealIndex = String(idx % 4);
          });
        }
      });

      // Activate CSS transitions on html once elements are initialized
      document.documentElement.classList.add('has-scroll-reveal');
    };

    // Run initial scan on next animation frame
    const frameId = requestAnimationFrame(() => {
      scanAndObserve();
    });

    // Re-scan if dynamic content is rendered (e.g. client highlights)
    let mutationTimer: NodeJS.Timeout | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationTimer = setTimeout(() => {
        scanAndObserve();
      }, 120);
    });

    mutationObserver.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frameId);
      if (mutationTimer) clearTimeout(mutationTimer);
      mutationObserver.disconnect();
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [pathname]);

  return null;
}
