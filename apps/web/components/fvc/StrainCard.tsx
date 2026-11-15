import Link from 'next/link';
import { PlayStrainButton } from '@/components/player/PlayStrainButton';
import { type Strain, strainQueue } from '@/lib/content';
import { formatLabel, isPlaceholder, ph, spreadBlocks, totalIncubation } from '@/lib/format';
import { Cover } from './Cover';
import { CtaButton } from './Ui';

/** Title row, cover, blurb, rule, then meta and Play (or Open). Two per row on the home page. */
export function StrainCard({ strain: s, className, headingLevel = 3 }: { strain: Strain; className?: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  const film = s.formats.includes('film');
  const tracks = s.sideA.length + s.sideB.length;
  const meta = `${tracks} track${tracks === 1 ? '' : 's'}, ${totalIncubation(s)}`;
  // Until there is a blurb, the track titles say more than a template sentence would.
  const blurb = isPlaceholder(s.blurb) ? [...s.sideA, ...s.sideB].map((t) => ph(t.title, 'Track')).join(' / ') : s.blurb;
  const queue = strainQueue(s);
  const href = `/strains/${s.id}`;
  return (
    <article className={`fvc-card ${className ?? ''}`}>
      <div className="fvc-card-head">
        <H className="fvc-card-title">
          <Link href={href}>{s.id}</Link>
        </H>
        <span className="fvc-note">
          {ph(s.strainType, 'Genre')}, {s.formats.map(formatLabel).join(' + ')}
        </span>
      </div>
      <Link href={href} tabIndex={-1} aria-hidden="true">
        <Cover strain={s} />
      </Link>
      <p className="fvc-card-blurb">{blurb}</p>
      <div className="fvc-card-foot">
        <span className="fvc-note">
          {meta}
          {s.spreadLevel != null && (
            <span aria-label={`Spread ${s.spreadLevel} of 5`} style={{ marginLeft: 14 }}>
              Spread <span className="fvc-mono">{spreadBlocks(s.spreadLevel)}</span>
            </span>
          )}
        </span>
        {queue.length ? <PlayStrainButton queue={queue} label={s.id} /> : <CtaButton href={href}>{film ? 'Watch' : 'Open'}</CtaButton>}
      </div>
    </article>
  );
}
