import { color } from '@fvc/engine';
import type { CSSProperties } from 'react';
import type { Outbreak, Strain } from '@/lib/content';
import { catalogNo, isolatedLabel, isPlaceholder, ph, shortDate } from '@/lib/format';
import { Germ } from './Germ';
import { Grain } from './Marks';
import { PosterLetters } from './PosterLetters';

/** Poster px (760 wide) → container-relative units, so the poster scales as one piece. */
const u = (px: number) => `${(px / 7.6).toFixed(3)}cqw`;
const abs = (o: Record<string, number>): CSSProperties => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, u(v)]));

const POSTER_NAME = { golova: 'Golova', creatura: 'Creatura', noise: 'Into the Noise' } as const;

/**
 * Outbreak Night poster, 760×1075, filled from outbreaks.json.
 * Styles from design/canvas/Poster.dc.html: golova | creatura | noise.
 */
export function Poster({ outbreak: o, strain, spot = color.spot }: { outbreak: Outbreak; strain?: Strain; spot?: string }) {
  const seed = strain?.seed ?? 7;
  const no = strain ? catalogNo(strain.id) : '007';
  const date = o.date ? isolatedLabel(o.date) : '[Date]';
  const md = o.date ? shortDate(o.date) : '[0/00]';
  const lineup = o.lineup.map((a) => ph(a, 'Artist'));
  const venue = ph(o.venue, 'Venue');
  const label = `Poster for ${o.title}, ${date}, doors ${o.doors}, ${venue}, ${o.city}. Lineup: ${lineup.join(', ')}. ${POSTER_NAME[o.posterStyle]} style.`;
  const box: CSSProperties = { containerType: 'inline-size', position: 'relative', width: '100%', aspectRatio: '760 / 1075', overflow: 'hidden', color: color.ink };

  if (o.posterStyle === 'creatura')
    return (
      <div role="img" aria-label={label} style={{ ...box, background: '#EDEDEB' }}>
        <div aria-hidden="true">
          <div style={{ position: 'absolute', ...abs({ left: 26, top: 26 }), fontSize: u(26), lineHeight: 1.12, textTransform: 'uppercase' }}>
            (A) Main floor:
            <br />
            {lineup[0]}
            <br />
            {lineup[1] ?? lineup[0]}
          </div>
          <div style={{ position: 'absolute', ...abs({ right: 26, top: 26 }), fontSize: u(26), lineHeight: 1.12, textTransform: 'uppercase', textAlign: 'right' }}>
            (B) Basement:
            <br />
            {lineup[2] ?? lineup[0]}
            <br />
            {lineup[3] ?? lineup[1] ?? lineup[0]}
          </div>
          <div style={{ position: 'absolute', ...abs({ left: 430, top: 170 }), fontSize: u(26), lineHeight: 1.12, textTransform: 'uppercase', textAlign: 'right' }}>
            {isPlaceholder(o.venue) ? 'Location' : venue}
            <br />
            {isPlaceholder(o.venue) ? 'undisclosed' : o.city}
          </div>
          <div style={{ position: 'absolute', ...abs({ left: 260, top: 250 }), fontSize: u(26), lineHeight: 1.12, textTransform: 'uppercase', textAlign: 'right' }}>
            {date}
            <br />
            {o.doors}
          </div>
          <Germ seed={seed} N={46} two={false} eyes="cyclops" lumps={6} dust={0.012} style={{ position: 'absolute', ...abs({ left: 20, top: 300, width: 720, height: 720 }) }} />
          <div style={{ position: 'absolute', ...abs({ left: 20, right: 20, bottom: 96 }), display: 'flex', alignItems: 'flex-end', lineHeight: 0.8 }}>
            <span style={{ fontFamily: 'var(--fvc-font-goth)', fontWeight: 900, fontSize: u(200) }}>F</span>
            <span style={{ fontFamily: 'var(--fvc-font-serif)', fontStyle: 'italic', fontSize: u(170), letterSpacing: '-0.03em' }}>at</span>
            <span style={{ width: u(34), height: u(34), border: `${u(2.5)} solid ${color.ink}`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: u(17), fontWeight: 600, margin: `0 ${u(4)} ${u(120)}` }}>R</span>
            <span style={{ fontFamily: 'var(--fvc-font-display)', fontWeight: 900, fontStretch: '125%', fontSize: u(150), letterSpacing: '-0.05em' }}>Vi</span>
            <span style={{ fontFamily: 'var(--fvc-font-goth)', fontWeight: 900, fontSize: u(180) }}>rus</span>
          </div>
          <div style={{ position: 'absolute', ...abs({ right: 26, bottom: 62 }), fontSize: u(24), textTransform: 'uppercase' }}>Strain {no}</div>
          <div style={{ position: 'absolute', ...abs({ left: 26, right: 26, bottom: 20 }), display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: u(24), lineHeight: 1.1, textTransform: 'uppercase' }}>
            <span>
              FVC Records presents
              <br />
              Entry by word of mouth
            </span>
            <span>©2026</span>
          </div>
        </div>
      </div>
    );

  if (o.posterStyle === 'noise')
    return (
      <div role="img" aria-label={label} style={{ ...box, background: color.white }}>
        <div aria-hidden="true">
          <div style={{ position: 'absolute', ...abs({ left: 10, right: 10, top: -14 }), fontFamily: 'var(--fvc-font-serif)', fontSize: u(118), lineHeight: 1, letterSpacing: '-0.02em', color: 'transparent', WebkitTextStroke: `1.5px ${color.ink}`, whiteSpace: 'nowrap', textAlign: 'center' }}>INTO THE FAT</div>
          <PosterLetters
            boxes={[
              { left: u(30), top: u(100), width: u(330) },
              { left: u(390), top: u(160), width: u(340) },
              { left: u(70), top: u(520), width: u(360) },
            ]}
          />
          <Germ seed={seed} N={70} dust={0.003} spot={spot} style={{ position: 'absolute', ...abs({ left: 440, top: 610, width: 280, height: 280 }) }} />
          <div style={{ position: 'absolute', ...abs({ left: 22, bottom: 18 }), fontSize: u(11), lineHeight: 1.3 }}>
            <div style={{ textAlign: 'right', width: u(330) }}>A Fat Virus Carrier release | Strain {no}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: u(6) }}>
              <span>{o.title.toUpperCase()}</span>
              <span style={{ fontSize: u(17), fontWeight: 800 }}>Into the Fat</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: u(6) }}>
              <span style={{ fontSize: u(22) }}>{venue}</span>
              <span>
                {date} ({o.doors}–late)
              </span>
            </div>
          </div>
          <div style={{ position: 'absolute', ...abs({ right: 22, bottom: 18 }), fontSize: u(11), textAlign: 'right' }}>
            fvc.ai.kr
            <br />
            {o.city}
          </div>
        </div>
      </div>
    );

  // golova
  return (
    <div role="img" aria-label={label} style={{ ...box, background: '#CBCAC6' }}>
      <div aria-hidden="true">
        <Germ seed={seed} N={130} lumps={5} hair={62} spot={spot} style={{ position: 'absolute', ...abs({ left: -120, top: 150, width: 1000, height: 1000 }), transform: 'rotate(-14deg)' }} />
        <div style={{ position: 'absolute', ...abs({ left: 26, right: 26, top: 22 }), display: 'flex', justifyContent: 'space-between', fontSize: u(44), fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1 }}>
          <span>
            {md} Outbreak·Night
          </span>
          <span>{o.doors}</span>
        </div>
        <div className="fvc-dish" style={{ position: 'absolute', ...abs({ left: 26, top: 86, width: 74, height: 46 }), fontSize: u(17), borderWidth: u(3) }}>
          FVC
        </div>
        <div style={{ position: 'absolute', ...abs({ right: 26, top: 500 }), writingMode: 'vertical-rl', fontSize: u(44), fontWeight: 500, letterSpacing: '-0.03em' }}>
          {md} {lineup[0]} Live
        </div>
        <div style={{ position: 'absolute', ...abs({ left: 10, bottom: 30 }), writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: u(11), whiteSpace: 'pre' }}>
          {`FVC Records   ${venue}, ${o.city}   Doors ${o.doors}`}
        </div>
        <div style={{ position: 'absolute', ...abs({ right: 26, bottom: 22 }), fontSize: u(46), fontWeight: 600, letterSpacing: '-0.03em' }}>Fat Virus Carrier</div>
        <Grain opacity={0.22} />
      </div>
    </div>
  );
}
