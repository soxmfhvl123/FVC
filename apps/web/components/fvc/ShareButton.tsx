'use client';

import { useState } from 'react';

/** Native share sheet where available, otherwise copies the link. */
export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [msg, setMsg] = useState('');
  async function share() {
    const url = location.href;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setMsg('Link copied. Pass it on.');
      }
    } catch {
      /* dismissed */
    }
  }
  return (
    <>
      <button type="button" className={className} onClick={share}>
        Share ↗
      </button>
      <span role="status" className="fvc-mono" style={{ fontSize: 12 }}>
        {msg}
      </span>
    </>
  );
}
