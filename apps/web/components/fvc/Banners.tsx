'use client';

import { BANNER_CHARS, type BannerSet, banners, color, type PlacedLetter } from '@fvc/engine';
import { type ReactNode, useRef, useState } from 'react';
import { useGlyphs, useTick } from '@/lib/hooks';
import { germPaths } from './Germ';
import { Letter } from './Letter';

export type BannerId = 'b1' | 'b2' | 'b3' | 'b4' | 'b5' | 'b6';

const INFO = 'Inter Tight, sans-serif';
const DISPLAY = 'Archivo, sans-serif';

const LABEL: Record<BannerId, string> = {
  b1: 'Banner: FAT sound spreads, on red',
  b2: 'Banner: Noise is the new carrier, on white',
  b3: 'Banner: catch it, highly contagious, on magenta',
  b4: 'Banner: spread, pixel letters on grey',
  b5: 'Banner: infected, melted yellow letters on grey stripes',
  b6: 'Banner: carrier no.7, on acid green',
};

function bgGerms() {
  return {
    m1: germPaths(41, { N: 60, two: false, dust: 0, eyes: 'cyclops' }),
    m2: germPaths(131, { N: 60, two: false, dust: 0 }),
    t1: germPaths(23, { N: 90, dust: 0.002 }),
  };
}

/** Static background artwork per banner (ported from design/canvas/_templates/inc/b1..b6). */
function Background({ id, BN }: { id: BannerId; BN: BannerSet }): ReactNode {
  const G = bgGerms();
  const ink = color.ink;
  switch (id) {
    case 'b1':
      return (
        <>
          <rect width="1400" height="420" fill={color.red} />
          <path d={BN.stars} fill="none" stroke={ink} strokeWidth="1.5" />
          <line x1="20" y1="36" x2="1380" y2="36" stroke={ink} strokeWidth="1.5" />
          <ellipse cx="702" cy="192" rx="248" ry="100" fill="none" stroke={ink} strokeWidth="7" />
          <path d="M702 50 V346" stroke={ink} strokeWidth="4" />
          <path d="M702 42 l11 15 l-11 15 l-11 -15z" fill={ink} />
          <circle cx="702" cy="354" r="9" fill="none" stroke={ink} strokeWidth="3" />
          <g fontFamily={INFO} fontSize="13" fill={ink}>
            <rect x="40" y="340" width="236" height="26" fill="none" stroke={ink} strokeWidth="1.5" />
            <text x="52" y="358">[ under the needle ]</text>
            <rect x="40" y="372" width="318" height="26" fill="none" stroke={ink} strokeWidth="1.5" />
            <text x="52" y="390">[ spreading since the very first play ]</text>
            <rect x="566" y="372" width="160" height="26" fill="none" stroke={ink} strokeWidth="1.5" />
            <text x="578" y="390">[ side A · 33⅓ ]</text>
          </g>
          <g fontFamily={INFO} fontWeight="800" fontSize="18" fill={ink} textAnchor="end">
            <text x="1380" y="364">A fat germ once called a meeting with every</text>
            <text x="1380" y="388">speaker in Seoul to discuss world peace.</text>
          </g>
          <g stroke={ink} strokeWidth="1.5" fill="none">
            <circle cx="930" cy="92" r="16" />
            <path d="M930 66 V118 M904 92 H956" />
          </g>
        </>
      );
    case 'b2':
      return (
        <>
          <rect width="1400" height="420" fill={color.white} />
          <g fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="34" fill="none" stroke={ink} strokeWidth="1.3" textAnchor="middle">
            {['DISTORTION', 'FEEDBACK', 'LOW END', 'STATIC'].map((t, i) => (
              <text key={t} x="640" y={48 + i * 36}>
                {t}
              </text>
            ))}
            {['INCUBATION', 'MUTATION', 'ANOMALY', 'FAT DECAY'].map((t, i) => (
              <text key={t} x="1196" y={300 + i * 36}>
                {t}
              </text>
            ))}
          </g>
          <text transform="matrix(1 0 0 -1 0 404)" x="30" y="0" fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="40" fill="none" stroke={ink} strokeWidth="1.2" opacity="0.6">
            CARRIER
          </text>
          <path d={BN.scr1} fill="none" stroke={ink} strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
          <path d={BN.scr2} fill="none" stroke={ink} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <svg x="1000" y="236" width="96" height="96" viewBox="0 0 300 300">
            <path d={G.m1.ink} fill={ink} />
          </svg>
          <svg x="1290" y="226" width="96" height="96" viewBox="0 0 300 300">
            <path d={G.m2.ink} fill={ink} />
          </svg>
        </>
      );
    case 'b3': {
      const lines = [
        ['Seethe-thump, seethe-thump. The colony wakes under a sodium light.', 'Somebody presses play and nobody presses stop.', 'In the queue, in the cab, in the shower: the carrier hums,', 'and the hum carries. A fat germ has no legs, but it travels.'],
        ['The low end leaks through the wall. Next door starts nodding.', 'By the second chorus the whole floor has caught it.', 'Symptoms: humming, tapping, sudden playlist edits.', 'Known cure: none. Recommended dose: one more listen.'],
        ['Incubation is about three minutes and forty seconds.', 'After that it lives in you, rent free, on repeat.', 'Pass it on. Every carrier makes two more.', 'flicker-light, pixel-flake, fat-sound, spread.'],
      ];
      return (
        <>
          <rect width="1400" height="420" fill={color.magenta} />
          <g fontFamily={INFO} fontSize="11" fill={ink}>
            {lines.map((col, c) =>
              col.map((t, i) => (
                <text key={`${c}-${i}`} x={[20, 490, 960][c]} y={24 + i * 14}>
                  {t}
                </text>
              )),
            )}
          </g>
          <text x="700" y="404" textAnchor="middle" fontFamily={DISPLAY} fontWeight="900" fontStretch="62%" fontSize="150" fill={color.white} stroke={ink} strokeWidth="8" paintOrder="stroke" strokeLinejoin="round" textLength="1350" lengthAdjust="spacingAndGlyphs">
            HIGHLY CONTAGIOUS
          </text>
        </>
      );
    }
    case 'b4':
      return (
        <>
          <rect width="1400" height="420" fill={color.grey} />
          <g fontFamily={INFO} fontSize="11.5" fill={ink}>
            <text x="20" y="24">In grey rooms with loud floors. It’s a chaotic mood, a saccharine outbreak. It’s sweet, but unhinged. We love that.</text>
            <text x="20" y="38">You believe in the power of fat sound to cure almost anything, and your playlist is probably 90% bass and 10% feelings.</text>
            <text x="1380" y="24" textAnchor="end">
              Honestly, FVC-007
            </text>
            <text x="1380" y="38" textAnchor="end">
              could be a password
            </text>
          </g>
          <g fill="none" stroke={color.magenta} strokeWidth="2.5" strokeDasharray="6 7">
            <path d="M120 300 C300 160, 500 380, 760 230 S1100 120, 1300 260" />
            <path d="M200 120 C420 40, 640 200, 880 90" />
            <path d="M820 330 C980 260, 1120 380, 1340 300" />
          </g>
          <svg x="70" y="56" width="90" height="90" viewBox="0 0 300 300">
            <path d={G.m1.ink} fill={ink} />
          </svg>
          <svg x="920" y="110" width="190" height="190" viewBox="0 0 300 300">
            <path d={G.t1.spot} fill={color.cobalt} />
            <path d={G.t1.ink} fill={ink} />
          </svg>
          <svg x="1240" y="150" width="90" height="90" viewBox="0 0 300 300">
            <path d={G.m2.ink} fill={ink} />
          </svg>
          <text x="20" y="400" fontFamily={DISPLAY} fontWeight="900" fontStretch="62%" fontSize="56" fill={ink}>
            BASS BOUNCING
          </text>
          <text x="1380" y="400" textAnchor="end" fontFamily={INFO} fontWeight="600" fontSize="28" fill={ink}>
            @ FVC-007 0423 1113
          </text>
        </>
      );
    case 'b5':
      return (
        <>
          <defs>
            <pattern id="bn-lines" width="18" height="420" patternUnits="userSpaceOnUse">
              <line x1="9" y1="0" x2="9" y2="420" stroke={ink} strokeWidth="1.6" strokeDasharray="34 5 3 5" />
            </pattern>
            <clipPath id="bn-ov">
              <ellipse cx="96" cy="118" rx="70" ry="24" />
            </clipPath>
          </defs>
          <rect width="1400" height="420" fill="#CFCFCA" />
          <rect x="0" y="80" width="1400" height="290" fill="url(#bn-lines)" opacity="0.8" />
          <text x="700" y="58" textAnchor="middle" fontFamily={DISPLAY} fontWeight="900" fontStretch="125%" fontSize="44" letterSpacing="8" fill={color.yellow} stroke={ink} strokeWidth="2.4" paintOrder="stroke">
            ONCE UPON A STRAIN
          </text>
          <rect x="20" y="88" width="152" height="60" fill={ink} />
          <rect x="26" y="94" width="140" height="48" filter="url(#fvc-bitnoise)" clipPath="url(#bn-ov)" />
          <svg x="1080" y="96" width="290" height="290" viewBox="0 0 300 300">
            <path d={G.t1.spot} fill={color.yellow} />
            <path d={G.t1.ink} fill={ink} />
          </svg>
          <g fontFamily={INFO} fontWeight="500" fontSize="13" fill={ink} textAnchor="middle">
            <text x="700" y="394">Nobody remembers who played it first. Everybody remembers the bass.</text>
            <text x="700" y="410">Patient zero hummed it once. By sunrise the whole block knew the chorus.</text>
          </g>
        </>
      );
    case 'b6':
      return (
        <>
          <rect width="1400" height="420" fill={color.acid} />
          <g transform="rotate(-6 1205 280)">
            <rect x="1040" y="150" width="330" height="250" fill={ink} />
          </g>
          <rect x="860" y="26" width="196" height="46" rx="6" fill="none" stroke={ink} strokeWidth="3" />
          <text x="958" y="58" textAnchor="middle" fontFamily={INFO} fontWeight="600" fontSize="24" fill={ink}>
            23:00–late
          </text>
          <text x="1072" y="60" fontFamily={INFO} fontWeight="500" fontSize="30" fill={ink}>
            Outbreak Time
          </text>
          <g fontFamily={INFO} fontWeight="500" fontSize="21" fill={ink}>
            <text x="20" y="344">The system has run out of immunity. Remove unused</text>
            <text x="20" y="370">antibodies and try again.</text>
            <text x="20" y="404">Memory dump:</text>
            <text x="520" y="404">100%</text>
          </g>
        </>
      );
  }
}

function PlacedLetters({ letters }: { letters: PlacedLetter[] }) {
  return letters.map((l, i) => (
    <Letter
      key={i}
      L={l}
      style={{ position: 'absolute', left: `${l.lx}%`, top: `${l.ly}%`, width: `${l.lw}%`, aspectRatio: '200 / 260', height: 'auto', transform: `rotate(${l.rot}deg)`, overflow: 'visible' }}
    />
  ));
}

/** One 1400×420 banner frame. Letters are positioned in % so the frame scales. */
export function Banner({ id, BN }: { id: BannerId; BN: BannerSet }) {
  return (
    <div role="img" aria-label={LABEL[id]} className="fvc-banner">
      <svg viewBox="0 0 1400 420" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Background id={id} BN={BN} />
      </svg>
      <PlacedLetters letters={BN[id]} />
    </div>
  );
}

/**
 * A stack of banners that mutate once a second (one letter per word), with Shuffle (new seed)
 * and optionally Freeze / Go live. Paused off-screen, static with reduced motion.
 */
export function BannerSeries({ ids, title = 'Infected type ▮ banner series', freeze = false, initialSeed = 7 }: { ids: BannerId[]; title?: string; freeze?: boolean; initialSeed?: number }) {
  const ref = useRef<HTMLElement>(null);
  const [seed, setSeed] = useState(initialSeed);
  const [live, setLive] = useState(true);
  const tick = useTick(1000, ref, live);
  const cache = useGlyphs(BANNER_CHARS);
  const BN = banners(seed, tick, cache);
  return (
    <section ref={ref} aria-label="Slogans" className="fvc-banners">
      <div className="fvc-banners-head">
        <span className="fvc-mono fvc-upper" style={{ fontSize: 12 }}>
          {title}
          {freeze && <span style={{ marginLeft: 12 }}>Seed {seed}</span>}
        </span>
        <span style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="fvc-btn" style={{ background: color.acid }} onClick={() => setSeed(1 + Math.floor(Math.random() * 999))}>
            ↻ Shuffle
          </button>
          {freeze && (
            <button type="button" className="fvc-btn" style={{ background: color.white }} aria-pressed={!live} onClick={() => setLive((v) => !v)}>
              {live ? 'Freeze' : 'Go live'}
            </button>
          )}
        </span>
      </div>
      {ids.map((id) => (
        <Banner key={id} id={id} BN={BN} />
      ))}
    </section>
  );
}
