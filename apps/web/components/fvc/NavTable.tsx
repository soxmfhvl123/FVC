import Link from 'next/link';
import { site } from '@/lib/content';
import { Clock } from './Clock';

const HREF: Record<string, string | null> = {
  Home: '/',
  Strains: '/strains',
  'Quarantine Goods': '/goods',
  'Outbreak Nights': '/outbreaks',
  'About FVC': '/about',
  Instagram: site.social.instagram,
  'Sample Submission': '/submit',
};

export const NAV_HREF = HREF;

/** Two-column rule table of links; last cell = Seoul clock. Links without a URL (Instagram, Q6) are hidden. */
export function NavTable() {
  const col = (items: string[]) => items.map((t) => ({ t, href: HREF[t] ?? null })).filter((x) => x.href);
  const left = [...col(site.nav.left), { t: 'FVC Lab', href: '/lab' }];
  const right = [...col(site.nav.right), { t: 'Spread Report', href: '/spread-report' }];
  const link = (x: { t: string; href: string | null }) =>
    x.href!.startsWith('http') ? (
      <a key={x.t} href={x.href!} className="fvc-navcell fvc-inv" target="_blank" rel="noopener noreferrer">
        {x.t}
      </a>
    ) : (
      <Link key={x.t} href={x.href!} className="fvc-navcell fvc-inv">
        {x.t}
      </Link>
    );
  return (
    <nav aria-label="Footer" className="fvc-grid2 fvc-navtable">
      <div className="fvc-col-l">{left.map(link)}</div>
      <div>
        {right.map(link)}
        <div className="fvc-navcell fvc-mono" style={{ fontSize: 13 }}>
          <Clock format="full" prefix="Seoul " />
        </div>
      </div>
    </nav>
  );
}
