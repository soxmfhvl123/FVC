import Link from 'next/link';
import { Clock } from './Clock';

const LINKS = [
  ['Strains', '/strains'],
  ['Lab', '/lab'],
  ['Outbreaks', '/outbreaks'],
  ['Goods', '/goods'],
  ['About', '/about'],
] as const;

/** Compact header for inner pages (the home hero has its own corners). */
export function TopBar({ current }: { current?: string }) {
  return (
    <header className="fvc-topbar">
      <Link href="/" className="fvc-dish fvc-topbar-logo" aria-label="FVC Records — home">
        FVC
      </Link>
      <nav aria-label="Main" className="fvc-topbar-nav">
        {LINKS.map(([t, href]) => (
          <Link key={href} href={href} aria-current={current === href ? 'page' : undefined}>
            {t}
          </Link>
        ))}
      </nav>
      <span className="fvc-topbar-clock">
        <Clock format="short" />
      </span>
    </header>
  );
}
