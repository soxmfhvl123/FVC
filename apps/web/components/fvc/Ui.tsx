import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

/** Ink bar with white letter-spaced text (Connwax label). */
export function Bar({ children, spaced = false, size = 13, bg = 'var(--fvc-ink)', fg = 'var(--fvc-white)', style, as: Tag = 'span' }: { children: ReactNode; spaced?: boolean; size?: number; bg?: string; fg?: string; style?: CSSProperties; as?: 'span' | 'div' | 'p' }) {
  return (
    <Tag className="fvc-bar-ui" style={{ background: bg, color: fg, fontSize: size, letterSpacing: spaced ? '0.38em' : undefined, ...style }}>
      {children}
    </Tag>
  );
}

export function Pill({ children, fill = 'transparent', style, as: Tag = 'span' }: { children: ReactNode; fill?: string; style?: CSSProperties; as?: 'span' | 'li' }) {
  return (
    <Tag className="fvc-pill" style={{ background: fill, ...style }}>
      {children}
    </Tag>
  );
}

/** Underlined text link used for calls to action. External links open in a new tab. */
export function CtaButton({ href, children, style }: { href: string; children: ReactNode; style?: CSSProperties }) {
  const external = /^https?:/.test(href);
  if (external)
    return (
      <a href={href} className="fvc-cta" style={style} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  return (
    <Link href={href} className="fvc-cta" style={style}>
      {children}
    </Link>
  );
}

/** Mono section label row: left / right. */
export function SectionLabel({ left, right, style }: { left: ReactNode; right?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="fvc-section-label" style={style}>
      <span>{left}</span>
      {right && <span>{right}</span>}
    </div>
  );
}
