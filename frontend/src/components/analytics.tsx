'use client';
import { useState, useSyncExternalStore } from 'react';
import Script from 'next/script';
const key = 'tg-analytics-consent';
let memoryChoice: string | null = null;
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener);
  window.addEventListener('tg-consent', listener);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener('tg-consent', listener);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(key);
  } catch {
    return memoryChoice;
  }
}
function serverSnapshot() {
  return 'loading';
}
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const valid = !!id && /^G-[A-Z0-9]+$/.test(id);
  const choice = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [editing, setEditing] = useState(false);
  function choose(value: string) {
    memoryChoice = value;
    try {
      localStorage.setItem(key, value);
    } catch {}
    window.dispatchEvent(new Event('tg-consent'));
    setEditing(false);
    if (value === 'declined' && choice === 'accepted') window.location.reload();
  }
  if (!valid) return null;
  return (
    <>
      {choice === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
          >{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}</Script>
        </>
      )}
      {choice === null || editing ? (
        <aside className="consent" aria-label="Analytics preferences">
          <p>May we use optional analytics to understand how this website is used?</p>
          <div>
            <button className="button" onClick={() => choose('accepted')}>
              Allow analytics
            </button>
            <button className="button button-secondary" onClick={() => choose('declined')}>
              Decline
            </button>
          </div>
        </aside>
      ) : (
        choice !== 'loading' && (
          <button className="privacy-control" onClick={() => setEditing(true)}>
            Cookie settings
          </button>
        )
      )}
    </>
  );
}
