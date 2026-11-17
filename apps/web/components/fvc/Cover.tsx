import { color } from '@fvc/engine';
import type { CSSProperties } from 'react';
import type { CoverStyle, Strain } from '@/lib/content';
import { catalogNo, displayTitle, formatLabel, isPlaceholder, ph, shortDate } from '@/lib/format';
import { COLONY_PALETTES, ColonyG } from './Colony';
import { GermG } from './Germ';

const INFO = 'Instrument Sans, sans-serif';
const DISPLAY = 'Archivo, sans-serif';
const GOTH = 'Grenze Gotisch, serif';
const SERIF = 'Instrument Serif, serif';
const MONO = 'DM Mono, monospace';

/** Germ settings per cover template (from the Main board covers c1–c4). */
export const COVER_GERM: Record<CoverStyle, { N: number; two: boolean; lumps?: number; hair?: number }> = {
  golova: { N: 96, two: true, lumps: 6 },
  creatura: { N: 104, two: false, hair: 70 },
  glitch: { N: 84, two: true, lumps: 4 },
  connwax: { N: 70, two: false, lumps: 3 },
  /** unused: the colony cover draws packed circles, not a bitmap germ */
  colony: { N: 96, two: true },
};

const ALT: Record<CoverStyle, (s: Strain) => string> = {
  golova: (s) => `Cover of ${s.id}: a bitmap germ in two inks on grey`,
  creatura: (s) => `Cover of ${s.id}: a one-colour bitmap germ with blackletter title`,
  glitch: (s) => `Cover of ${s.id}: glitch type on acid green with a bitmap germ`,
  connwax: (s) => `Cover of ${s.id}: photocopied black bars, a grain oval and a giant ${catalogNo(s.id).slice(-2)}`,
  colony: (s) => `Cover of ${s.id}: a germ made of packed coloured circles, grown with the FVC Lab Colony tool from culture ${s.seed}`,
};

/** 400×300 cover template, chosen by `strain.coverStyle`. Everything is regenerated from the seed. */
export function Cover({ strain, style, className }: { strain: Strain; style?: CSSProperties; className?: string }) {
  const s = strain;
  const g = { ...COVER_GERM[s.coverStyle], eyes: s.eyes };
  const no = catalogNo(s.id);
  const title = displayTitle(s);
  const artist = ph(s.carrier, 'Artist').toUpperCase();
  const vinyl = s.formats.some((f) => f.endsWith('vinyl'));
  const clip = `cv-${s.id}`;
  const P = COLONY_PALETTES[s.palette ?? 'robotron'];

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={ALT[s.coverStyle](s)} className={className} style={{ display: 'block', width: '100%', height: 'auto', ...style }}>
      {s.coverStyle === 'golova' && (
        <>
          <rect width="400" height="300" fill={color.greyDark} />
          <g transform="translate(150 20) rotate(12 140 140)">
            <GermG seed={s.seed} spot={s.spot} size={290} {...g} />
          </g>
          <text x="14" y="34" fontFamily={INFO} fontWeight="500" fontSize="24" letterSpacing="-0.5" fill={color.ink}>
            {s.isolated ? `${shortDate(s.isolated)} ` : ''}{ph(s.strainType, 'Genre')}
          </text>
          <text x="386" y="34" textAnchor="end" fontFamily={INFO} fontWeight="500" fontSize="24" fill={color.ink}>
            {vinyl ? '33⅓' : formatLabel(s.formats[0])}
          </text>
          <text x="386" y="286" textAnchor="end" fontFamily={INFO} fontWeight="600" fontSize="22" fill={color.ink}>
            {title}
          </text>
          <text transform="translate(18 286) rotate(-90)" fontFamily={INFO} fontSize="10" fill={color.ink} xmlSpace="preserve">
            FVC Records   Strain {no}   Seoul
          </text>
        </>
      )}

      {s.coverStyle === 'creatura' && (
        <>
          <rect width="400" height="300" fill="#EEEEEC" />
          <g fontFamily={INFO} fontSize="12" fill={color.ink}>
            <text x="14" y="24">(A) SIDE A:</text>
            <text x="14" y="38">{ph(s.sideA[0]?.title, 'TRACK TITLE').toUpperCase()}</text>
            <text x="386" y="24" textAnchor="end">
              (B) SIDE B:
            </text>
            <text x="386" y="38" textAnchor="end">
              {ph(s.sideB[0]?.title ?? s.sideA.filter((t) => !t.hidden).at(-1)?.title, 'TRACK TITLE').toUpperCase()}
            </text>
            <text x="236" y="70" textAnchor="end">
              PLAY LOUD
            </text>
            <text x="236" y="84" textAnchor="end">
              23:00
            </text>
          </g>
          <g transform="translate(70 40)">
            <GermG seed={s.seed} size={260} {...g} />
          </g>
          <text x="14" y="270" fontFamily={GOTH} fontWeight="800" fontSize="88" fill={color.ink}>
            Stra
          </text>
          <text x="182" y="270" fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="66" fill={color.ink}>
            in{no}
          </text>
          <g fontFamily={INFO} fontSize="11" fill={color.ink}>
            <text x="14" y="292">FVC RECORDS PRESENTS / ENTRY BY WORD OF MOUTH</text>
            <text x="386" y="292" textAnchor="end">
              ©2026
            </text>
          </g>
        </>
      )}

      {s.coverStyle === 'glitch' && (
        <>
          <rect width="400" height="300" fill={color.acid} />
          <g fontFamily={INFO} fontSize="8.5" fill={color.ink}>
            <text x="12" y="18">The colony woke under a sodium light. Somebody pressed play and nobody pressed stop.</text>
            <text x="12" y="29">Every speaker in the room became a carrier. The bass kept multiplying.</text>
          </g>
          <g transform="translate(206 26)">
            <GermG seed={s.seed} spot={s.spot} size={200} {...g} />
          </g>
          <text x="10" y="150" fontFamily={GOTH} fontWeight="900" fontSize="120" fill={color.ink} stroke={color.acid} strokeWidth="2">
            C
          </text>
          <text x="70" y="140" fontFamily={DISPLAY} fontWeight="900" fontStretch="62%" fontSize="96" fill={color.acid} stroke={color.ink} strokeWidth="3">
            o
          </text>
          <text x="112" y="160" fontFamily={SERIF} fontStyle="italic" fontSize="110" fill={color.ink}>
            l
          </text>
          <text x="132" y="132" fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="80" fill={s.spot} stroke={color.ink} strokeWidth="2">
            o
          </text>
          <text x="194" y="158" fontFamily={GOTH} fontWeight="900" fontSize="108" fill={color.ink}>
            n
          </text>
          <text x="252" y="146" fontFamily={DISPLAY} fontWeight="900" fontStretch="62%" fontSize="100" fill="none" stroke={color.ink} strokeWidth="3">
            Y
          </text>
          <rect x="10" y="236" width="380" height="2" fill={color.ink} />
          <text x="10" y="270" fontFamily={DISPLAY} fontWeight="900" fontStretch="100%" fontSize="30" fill={color.ink}>
            BASS BOUNCING
          </text>
          <text x="390" y="270" textAnchor="end" fontFamily={MONO} fontSize="13" fill={color.ink}>
            @ {s.id} {String(s.seed).padStart(4, '0')} 1113
          </text>
          <rect x="290" y="168" width="96" height="22" rx="11" fill="none" stroke={color.ink} strokeWidth="2" />
          <text x="338" y="184" textAnchor="middle" fontFamily={MONO} fontSize="11" fill={color.ink}>
            9:00–18:00
          </text>
        </>
      )}

      {s.coverStyle === 'connwax' && (
        <>
          <defs>
            <clipPath id={clip}>
              <ellipse cx="96" cy="196" rx="84" ry="34" />
            </clipPath>
          </defs>
          <rect width="400" height="300" fill={color.white} />
          <rect x="14" y="12" width="372" height="16" fill={color.ink} />
          <text x="200" y="24.5" textAnchor="middle" fontFamily={INFO} fontWeight="800" fontSize="11" letterSpacing="7" fill={color.white}>
            OUTBREAK NIGHT ▮ SEOUL
          </text>
          <text x="14" y="70" fontFamily={DISPLAY} fontWeight="900" fontStretch="100%" fontSize="44" letterSpacing="-1" fill={color.ink}>
            fvc·live
          </text>
          <ellipse cx="292" cy="56" rx="90" ry="24" fill="none" stroke={color.ink} strokeWidth="3" />
          <text x="292" y="68" textAnchor="middle" fontFamily={DISPLAY} fontWeight="900" fontStretch="62%" fontSize="38" fill={color.ink}>
            OUTBREAK
          </text>
          <rect x="14" y="86" width="372" height="96" fill={color.ink} />
          <text x="200" y="176" textAnchor="middle" fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="118" letterSpacing="-6" fill={color.white}>
            {no.slice(-2).split('').join(' ')}
          </text>
          <rect x="12" y="160" width="168" height="72" filter="url(#fvc-bitnoise)" clipPath={`url(#${clip})`} />
          <ellipse cx="96" cy="196" rx="84" ry="34" fill="none" stroke={color.ink} strokeWidth="2" />
          <g transform="translate(212 182)">
            <GermG seed={s.seed} size={110} {...g} />
          </g>
          <g fontFamily={INFO} fontWeight="800" fontSize="13" fill={color.ink}>
            <text x="326" y="210">{artist}</text>
            <text x="326" y="226">{artist}</text>
            <text x="326" y="242">{artist}</text>
          </g>
          <rect x="14" y="252" width="372" height="14" fill={color.ink} />
          <text x="20" y="263" fontFamily={INFO} fontWeight="800" fontSize="10" fill={color.white} xmlSpace="preserve">
            {`${artist}  ${artist}  ${artist}  LOW-END SOUNDSYSTEM  ${artist}  ${artist}`}
          </text>
          <path d="M380 200 V240 M360 220 H400 M24 270 V296 M11 283 H37" stroke={color.ink} strokeWidth="1.5" />
          <rect width="400" height="300" filter="url(#fvc-grain)" opacity="0.2" style={{ mixBlendMode: 'multiply' }} />
        </>
      )}
      {s.coverStyle === 'colony' && (
        <>
          <rect width="400" height="300" fill={P.bg} />
          <g transform="translate(104 -2) scale(0.99)">
            <ColonyG seed={s.seed} pal={s.palette ?? 'robotron'} />
          </g>
          <g fill={P.fg}>
            <text x="14" y="28" fontFamily={MONO} fontSize="11">
              Culture Nº {s.seed}
            </text>
            <text x="14" y="86" fontFamily={SERIF} fontStyle="italic" fontSize="50">
              Colony
            </text>
            <text x="12" y="150" fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="58" letterSpacing="-2">
              {no}
            </text>
            <text x="14" y="262" fontFamily={INFO} fontWeight="600" fontSize="16">
              {title}
            </text>
            {!isPlaceholder(s.carrier) && (
              <text x="14" y="280" fontFamily={INFO} fontSize="11">
                {artist}
              </text>
            )}
            <text x="386" y="290" textAnchor="end" fontFamily={MONO} fontSize="9">
              Grown in FVC Lab
            </text>
          </g>
        </>
      )}
    </svg>
  );
}
