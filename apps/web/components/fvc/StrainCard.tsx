import Link from 'next/link';
import type { Strain } from '@/lib/content';
import { formatLabel, isPlaceholder, ph, spreadBlocks, strainSummary, totalIncubation } from '@/lib/format';
import { Cover } from './Cover';
import { CtaButton } from './Ui';

/** Title row → cover → blurb → rule → meta + `Catch it ↗`. Two per row on the home page. */
export function StrainCard({ strain: s, className, headingLevel = 3 }: { strain: Strain; className?: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const film = s.formats.includes('film');
  const meta = film
    ? `${ph(s.strainType, 'Genre').toUpperCase()} ▮ FILM ▮ SPREAD ${spreadBlocks(s.spreadLevel)}`
    : `INCUBATION ${totalIncubation(s)} ▮ SPREAD ${spreadBlocks(s.spreadLevel)}`;
  const blurb = isPlaceholder(s.blurb) ? strainSummary(s) : s.blurb;
  const href = `/strains/${s.id}`;
  return (
    <article className={`fvc-card ${className ?? ''}`}>
      <div className="fvc-card-head">
        <H className="fvc-card-title">
          <Link href={href}>{s.id}</Link>
        </H>
        <span className="fvc-mono" style={{ fontSize: 12 }}>
          {ph(s.strainType, 'Genre').toUpperCase()} ▮ {s.formats.map((f) => formatLabel(f).toUpperCase()).join(' + ')}
        </span>
      </div>
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <Cover strain={s} />
      </Link>
      <p className="fvc-card-blurb">{blurb}</p>
      <div className="fvc-card-foot">
        <span className="fvc-mono" style={{ fontSize: 11 }}>
          {meta}
        </span>
        <CtaButton href={href}>{film ? 'Watch ↗' : 'Catch it ↗'}</CtaButton>
      </div>
    </article>
  );
}
