'use client';

import {
  BODIES,
  color,
  DEFAULT_GENOME,
  EYE_COUNTS,
  type EyeSet,
  type Genome,
  genomeCode,
  germ2,
  hash,
  letter,
  type LetterMode,
  MOODS,
  parseGenome,
  PATTERNS,
  rollGenome,
  SURFACES,
  vinyl,
  WORDMARK_MODES,
} from '@fvc/engine';
import { type BaseName, type PalName, VINYL_BASES, VINYL_PALETTES, VinylRecord, vinylColours } from '@/components/fvc/Vinyl';
import { useMemo, useRef, useState } from 'react';
import { COLONY_PAL_NAMES, COLONY_PALETTES, ColonyG, type ColonyPal } from '@/components/fvc/Colony';
import { germPaths } from '@/components/fvc/Germ';
import { Letter } from '@/components/fvc/Letter';
import { useGlyphs, useTick } from '@/lib/hooks';
import { randomSeed, useUrlState } from '@/lib/useUrlState';
import { Options, ToolCard } from './ToolCard';

export type ToolId = 'germinator' | 'pressing-plant' | 'colony' | 'mutator';

interface ToolProps {
  /** Mirror state into the URL (tool pages). Off on the hub and the home page. */
  sync?: boolean;
  /** Hub: link the card to its own page. */
  href?: string;
  headingLevel?: 1 | 2;
}

const pick = <T extends string | number>(v: T, allowed: readonly T[], fallback: T): T => (allowed.includes(v) ? v : fallback);
const posInt = (n: number, fallback: number) => (Number.isInteger(n) && n > 0 && n < 1e6 ? n : fallback);

/* ============ 01 GERMINATOR (engine v2: germ genome) ============ */

export const SPOTS = { coral: color.spot, cobalt: color.cobalt, acid: color.acid, magenta: color.magenta } as const;
type SpotName = keyof typeof SPOTS;
const SPOT_NAMES = Object.keys(SPOTS) as SpotName[];
const V1_EYES: EyeSet[] = ['two', 'cyclops', 'three', 'none'];
const GRIDS = [44, 80, 110, 140, 200] as const;
const EYE_LABELS = ['0', '1', '2', '3', '5', 'Many'];

type Row = 'body' | 'surface' | 'eyes' | 'pattern' | 'ink';

/** A different random index in 0..n-1. */
const other = (cur: number, n: number) => {
  const v = Math.floor(Math.random() * (n - 1));
  return v >= cur ? v + 1 : v;
};

/** Lock + "roll only this gene" buttons at the end of a gene row. */
function GeneActions({ row, locked, onLock, onRoll }: { row: string; locked: boolean; onLock: () => void; onRoll: () => void }) {
  return (
    <span className="lab-gene-actions">
      <button type="button" className={`fvc-b ${locked ? 'on' : ''}`} aria-pressed={locked} aria-label={`Lock ${row}`} onClick={onLock}>
        {locked ? 'Locked' : 'Lock'}
      </button>
      <button type="button" className="fvc-b" aria-label={`Roll ${row} only`} onClick={onRoll}>
        ↻
      </button>
    </span>
  );
}

export function Germinator({ sync = false, href, headingLevel }: ToolProps) {
  const [st, set, has] = useUrlState({ seed: 7, g: '', n: 110, inks: 2, spot: 'coral', inv: 0, v: 2, eyes: 'two' }, sync);
  const [locks, setLocks] = useState<Record<Row, boolean>>({ body: false, surface: false, eyes: false, pattern: false, ink: false });
  const seed = posInt(st.seed, 7);
  const n = pick(st.n, GRIDS, 110);
  const two = st.inks !== 1;
  const inverse = st.inv === 1;
  const spotName = pick(st.spot as SpotName, SPOT_NAMES, 'coral');
  const spot = SPOTS[spotName];
  // v=1, or an old link that still carries ?eyes= without a genome, draws with the frozen v1 engine
  const v1 = st.v === 1 || (has('eyes') && !has('g'));
  const genome = parseGenome(st.g) ?? (has('seed') ? rollGenome(seed) : DEFAULT_GENOME);
  const v1Eyes = pick(st.eyes as EyeSet, V1_EYES, 'two');

  const gcode = genomeCode(genome, '');
  const G = useMemo(() => {
    if (v1) {
      const p = germPaths(seed, { N: n, eyes: v1Eyes, two });
      return { ink: p.ink, spot: p.spot, name: 'Ttung-gyun (engine v1)', code: `v1 · eyes ${v1Eyes}` };
    }
    return germ2(seed, parseGenome(gcode) ?? DEFAULT_GENOME, { N: n, two });
  }, [v1, seed, n, two, v1Eyes, gcode]);

  const setGenome = (patch: Partial<Genome>, extra: Record<string, string | number> = {}) => set({ g: genomeCode({ ...genome, ...patch }, ''), v: 2, ...extra });
  const newGerm = () => {
    const ns = randomSeed();
    const rolled = rollGenome(ns);
    const next: Genome = {
      body: locks.body ? genome.body : rolled.body,
      surface: locks.surface ? genome.surface : rolled.surface,
      eyes: locks.eyes ? genome.eyes : rolled.eyes,
      mood: locks.eyes ? genome.mood : rolled.mood,
      pattern: locks.pattern ? genome.pattern : rolled.pattern,
      render: 0,
    };
    const ink = locks.ink ? spotName : SPOT_NAMES[Math.floor(hash(ns, 3, 17) * SPOT_NAMES.length)];
    set({ seed: ns, g: genomeCode(next, ''), spot: ink, v: 2 });
  };
  const roll: Record<Row, () => void> = {
    body: () => setGenome({ body: other(genome.body, BODIES.length) }),
    surface: () => setGenome({ surface: other(genome.surface, SURFACES.length) }),
    eyes: () => setGenome({ eyes: other(genome.eyes, EYE_COUNTS.length), mood: other(genome.mood, MOODS.length) }),
    pattern: () => setGenome({ pattern: other(genome.pattern, PATTERNS.length) }),
    ink: () => setGenome({}, { spot: SPOT_NAMES[other(SPOT_NAMES.indexOf(spotName), SPOT_NAMES.length)] }),
  };
  const actions = (row: Row, label = row) => (
    <GeneActions row={label} locked={locks[row]} onLock={() => setLocks((l) => ({ ...l, [row]: !l[row] }))} onRoll={roll[row]} />
  );

  const inkFill = inverse ? color.white : color.ink;
  const body = (fill: string, bg?: string) => (
    <>
      {bg && <rect width="300" height="300" fill={bg} />}
      {G.spot && <path d={G.spot} fill={spot} />}
      <path d={G.ink} fill={fill} />
    </>
  );
  const specimen = `Specimen #${String(seed).padStart(4, '0')}`;
  const codeSeed = [...G.code].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 99991, seed);

  return (
    <ToolCard
      name="Germinator"
      href={href}
      headingLevel={headingLevel}
      sidebarBg={color.white}
      iconBg={color.ink}
      labFg={color.white}
      bg={color.grey}
      icon={
        <svg viewBox="0 0 300 300" width="140" height="140" aria-hidden="true">
          {body(color.white)}
        </svg>
      }
      detailBg={inverse ? color.ink : color.grey}
      detail={
        <svg viewBox="95 85 110 110" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {body(inkFill, inverse ? color.ink : undefined)}
        </svg>
      }
      extra={
        <div className="lab-species">
          <div className="lab-species-name">{G.name}</div>
          <div className="fvc-mono lab-species-code">{G.code}</div>
        </div>
      }
      description="Grows a new Ttung-gyun from a single number, split into genes: body, surface, eyes, pattern, render and ink. Lock the genes you like and roll the rest. Same seed and genome, same germ."
      codeSeed={codeSeed}
      codeLines={['Specimen code', G.code, `Seed ${seed}`]}
      headLeft={<span className="lab-head-species">{G.name}</span>}
      headRight={specimen}
      output={
        <svg viewBox="0 0 300 300" role="img" aria-label={`Generated germ ${G.name}, genome ${G.code}, seed ${seed}`} className="lab-art">
          {body(inkFill, inverse ? color.ink : undefined)}
        </svg>
      }
      controls={
        <>
          <div className="lab-row wrap">
            <button type="button" className="fvc-b" style={{ background: spot, padding: '0 16px' }} onClick={newGerm}>
              ↻ New germ
            </button>
            <button type="button" className="fvc-b sq" aria-label="Previous seed" onClick={() => set({ seed: Math.max(1, seed - 1), g: genomeCode(genome, '') })}>
              −
            </button>
            <button type="button" className="fvc-b sq" aria-label="Next seed" onClick={() => set({ seed: seed + 1, g: genomeCode(genome, '') })}>
              +
            </button>
            <span className="lab-opt-label fvc-mono" style={{ marginLeft: 6 }}>
              Seed {seed}
            </span>
            {v1 && (
              <button type="button" className="fvc-b light" style={{ marginLeft: 'auto' }} onClick={() => setGenome({})}>
                Engine v1 · switch to v2
              </button>
            )}
          </div>
          <div className="lab-gene">
            <Options label="Body" value={genome.body} options={BODIES.map((b, i) => ({ v: i, label: b }))} onPick={(v) => setGenome({ body: v })} />
            {actions('body')}
          </div>
          <div className="lab-gene">
            <Options label="Surface" value={genome.surface} options={SURFACES.map((b, i) => ({ v: i, label: b }))} onPick={(v) => setGenome({ surface: v })} />
            {actions('surface')}
          </div>
          <div className="lab-gene">
            <span className="lab-gene-pair">
              <Options label="Eyes" value={genome.eyes} options={EYE_LABELS.map((b, i) => ({ v: i, label: b }))} onPick={(v) => setGenome({ eyes: v })} />
              <Options label="Mood" value={genome.mood} options={MOODS.map((b, i) => ({ v: i, label: b }))} onPick={(v) => setGenome({ mood: v })} />
            </span>
            {actions('eyes')}
          </div>
          <div className="lab-gene">
            <Options label="Pattern" value={genome.pattern} options={PATTERNS.map((b, i) => ({ v: i, label: b }))} onPick={(v) => setGenome({ pattern: v })} />
            {actions('pattern')}
          </div>
          <div className="lab-gene">
            <span className="lab-gene-pair">
              <Options label="Render" value={0} options={[{ v: 0, label: 'Bitmap' }]} onPick={() => setGenome({ render: 0 })} />
              <Options label="Grid" value={n} options={[{ v: 44, label: 'Coarse' }, { v: 80, label: 'Mid' }, { v: 140, label: 'Fine' }, { v: 200, label: 'Micro' }]} onPick={(v) => set({ n: v })} />
            </span>
          </div>
          <div className="lab-gene">
            <span className="lab-opts" role="group" aria-label="Ink">
              <span className="lab-opt-label">Ink</span>
              {SPOT_NAMES.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="fvc-b sq"
                  aria-label={k[0].toUpperCase() + k.slice(1)}
                  aria-pressed={k === spotName}
                  onClick={() => set({ spot: k })}
                  style={{ background: SPOTS[k], outline: k === spotName ? `2px solid ${color.white}` : 'none', outlineOffset: 2 }}
                />
              ))}
              <button type="button" className={`fvc-b ${two ? '' : 'on'}`} aria-pressed={!two} onClick={() => set({ inks: two ? 1 : 2 })}>
                One ink
              </button>
              <button type="button" className={`fvc-b ${inverse ? 'on' : ''}`} aria-pressed={inverse} onClick={() => set({ inv: inverse ? 0 : 1 })}>
                Inverse
              </button>
            </span>
            {actions('ink')}
          </div>
        </>
      }
    />
  );
}

/* ============ 02 PRESSING PLANT ============ */

export function PressingPlant({ sync = false, href, headingLevel }: ToolProps) {
  const [st, set] = useUrlState({ seed: 12, base: 'smoke', pal: 'outbreak' }, sync);
  const seed = posInt(st.seed, 12);
  const base = pick(st.base as BaseName, Object.keys(VINYL_BASES) as BaseName[], 'smoke');
  const pal = pick(st.pal as PalName, Object.keys(VINYL_PALETTES) as PalName[], 'outbreak');
  const V = useMemo(() => vinyl(seed), [seed]);
  const { c, l, n } = vinylColours(base, pal);
  const baseHex = VINYL_BASES[base];
  return (
    <ToolCard
      name="Pressing Plant"
      href={href}
      headingLevel={headingLevel}
      sidebarBg={color.ink}
      sidebarFg={color.white}
      iconBg={color.paper}
      labFg={color.ink}
      bg={color.paper}
      icon={
        <svg viewBox="0 0 300 300" width="140" height="140" aria-hidden="true">
          <circle cx="150" cy="150" r="148" fill={baseHex} />
          {[V.c1, V.c2, V.c3, V.c4].map((d, i) => (
            <path key={i} d={d} fill={c[i]} />
          ))}
          <circle cx="150" cy="150" r="54" fill={l} />
        </svg>
      }
      detailBg={baseHex}
      detail={
        <svg viewBox="200 40 90 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d={V.groove} fill="#000000" opacity="0.35" />
          {[V.c1, V.c2, V.c3, V.c4].map((d, i) => (
            <path key={i} d={d} fill={c[i]} />
          ))}
        </svg>
      }
      description="A splatter-vinyl generator for every strain. Picks splat sizes, angles and colours from the FVC palette, then presses a centre label with the strain’s own germ. Press again until it feels right."
      codeSeed={seed + 5}
      codeBg={color.white}
      codeLines={[`Pressing Nº ${seed}`, '12" · 33⅓ RPM', 'Tool by FVC Lab']}
      headLeft={`Pressing Nº ${seed}`}
      headRight={n}
      output={<VinylRecord seed={seed} base={base} pal={pal} />}
      controls={
        <>
          <div className="lab-row wrap">
            <button type="button" className="fvc-b" style={{ background: color.acid, padding: '0 16px' }} onClick={() => set({ seed: randomSeed(999) })}>
              ↻ Press again
            </button>
            <Options label="Base" value={base} options={(Object.keys(VINYL_BASES) as BaseName[]).map((k) => ({ v: k, label: k[0].toUpperCase() + k.slice(1) }))} onPick={(v) => set({ base: v })} />
          </div>
          <div className="lab-row wrap">
            <Options label="Splat" value={pal} options={(Object.keys(VINYL_PALETTES) as PalName[]).map((k) => ({ v: k, label: VINYL_PALETTES[k].n }))} onPick={(v) => set({ pal: v })} />
          </div>
        </>
      }
    />
  );
}

/* ============ 03 COLONY ============ */



export function Colony({ sync = false, href, headingLevel }: ToolProps) {
  const [st, set] = useUrlState({ seed: 7, pal: 'robotron' }, sync);
  const seed = posInt(st.seed, 7);
  const pal = pick(st.pal as ColonyPal, COLONY_PAL_NAMES, 'robotron');
  const P = COLONY_PALETTES[pal];
  const cells = (eyes: boolean) => <ColonyG seed={seed} pal={pal} eyes={eyes} />;
  return (
    <ToolCard
      name="Colony"
      href={href}
      headingLevel={headingLevel}
      sidebarBg={color.acid}
      iconBg={P.bg}
      labFg={color.acid}
      bg={P.bg}
      fg={P.fg}
      icon={
        <svg viewBox="0 0 300 300" width="140" height="140" aria-hidden="true">
          {cells(true)}
        </svg>
      }
      detailBg={P.bg}
      detail={
        <svg viewBox="150 160 90 90" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {cells(false)}
        </svg>
      }
      description="Fills a germ’s silhouette with packed circles, like a culture plate seen from above. Big cells first, then smaller ones fill every gap. Built for covers, stickers and big prints."
      codeSeed={seed + 9}
      codeLines={[`Culture Nº ${seed}`, 'Cells packed: 6 sizes', 'Tool by FVC Lab']}
      headLeft={`Culture Nº ${seed}`}
      headRight={P.n}
      output={
        <svg viewBox="0 0 300 300" role="img" aria-label={`Generated colony of packed circles in a germ shape, culture ${seed}`} className="lab-art" style={{ width: 540 }}>
          {cells(true)}
        </svg>
      }
      controls={
        <div className="lab-row wrap">
          <button type="button" className="fvc-b" style={{ background: color.acid, padding: '0 16px' }} onClick={() => set({ seed: randomSeed() })}>
            ↻ Regrow
          </button>
          <Options label="Palette" value={pal} options={COLONY_PAL_NAMES.map((k) => ({ v: k, label: COLONY_PALETTES[k].n }))} onPick={(v) => set({ pal: v })} />
        </div>
      }
    />
  );
}

/* ============ 04 MUTATOR ============ */

const MODES = WORDMARK_MODES;

/** Mutator rule: each letter a random strain, never the same as its neighbour. */
export function mutateLetters(text: string, seed: number, cache: ReturnType<typeof useGlyphs>, w: number) {
  let prev = -1;
  return text.split('').map((ch, i) => {
    if (ch === ' ') return { ch, L: null, w: Math.round(w * 0.5) };
    let mi = Math.floor(hash(i, seed, 77) * 7);
    if (mi === prev) mi = (mi + 1) % 7;
    prev = mi;
    const mode: LetterMode = /[A-Z0-9]/.test(ch) ? MODES[mi] : 'wide';
    return { ch, L: letter(ch, mode, cache), w };
  });
}

/** A word rendered as mutated letters (shared by the Mutator and the home mini-lab). */
export function MutatedWord({ text, seed, width, maxLetter = 150 }: { text: string; seed: number; width: number; maxLetter?: number }) {
  const cache = useGlyphs(text.replace(/[^A-Z0-9]/g, ''));
  const longest = Math.max(1, ...text.split(' ').map((w) => w.length));
  const w = Math.max(40, Math.min(maxLetter, Math.floor(width / Math.min(longest + 0.5, 10))));
  const letters = mutateLetters(text, seed, cache, w);
  return (
    <div role="img" aria-label={`${text || 'Nothing'}, mutated`} className="lab-word">
      {letters.map((x, i) =>
        x.L ? <Letter key={i} L={x.L} style={{ display: 'block', width: x.w, height: Math.round(x.w * 1.3), maxWidth: '18vw' }} /> : <span key={i} style={{ width: x.w }} />,
      )}
    </div>
  );
}

const clean = (t: string, max: number) => t.toUpperCase().replace(/[^A-Z0-9 .!?&-]/g, '').slice(0, max);

export function Mutator({ sync = false, href, headingLevel }: ToolProps) {
  const [st, set, has] = useUrlState({ t: 'FAT VIRUS CARRIER', seed: 1 }, sync);
  const text = clean(String(st.t), 20);
  const base = posInt(st.seed, 1);
  // A shared URL with ?seed= reproduces that exact mutation, so it starts frozen.
  const [live, setLive] = useState(!has('seed'));
  const ref = useRef<HTMLDivElement>(null);
  const tick = useTick(1100, ref, live);
  // `anchor` = tick at the moment the base seed was last set, so live mode counts on from it.
  const [anchor, setAnchor] = useState(0);
  const seed = base + Math.max(0, tick - anchor);
  const reseed = (next: number) => {
    setAnchor(tick);
    set({ seed: next });
  };
  const iconCache = useGlyphs('FVC');
  const count = text.replace(/ /g, '').length || 1;
  return (
    <div ref={ref}>
      <ToolCard
        name="Mutator"
        href={href}
        headingLevel={headingLevel}
        sidebarBg={color.magenta}
        iconBg={color.white}
        labFg={color.magenta}
        bg={color.white}
        icon={
          <div style={{ display: 'flex' }}>
            {['F', 'V', 'C'].map((ch, i) => (
              <Letter key={ch} L={letter(ch, MODES[(seed + i * 2) % 7], iconCache)} style={{ width: 62, height: 81 }} />
            ))}
          </div>
        }
        detailBg={color.ink}
        detail={
          <div className="lab-strains">
            <span>Pixel</span>
            <span>Beads</span>
            <span>Outline</span>
            <span>Noise</span>
            <span className="fvc-goth" style={{ fontSize: 14, textTransform: 'none' }}>
              Blackletter
            </span>
            <span className="fvc-serif" style={{ fontSize: 14, textTransform: 'none' }}>
              Serif
            </span>
            <span className="fvc-wide">Wide</span>
            <span>7 strains</span>
          </div>
        }
        description="Type anything. Each letter catches a different strain: pixel, beads, outline, noise, blackletter, serif or wide. One rule only: no two neighbours look alike."
        codeSeed={seed + 13}
        codeBg={color.white}
        codeLines={[`Mutation Nº ${seed}`, `${count} letters`, 'Tool by FVC Lab']}
        headLeft={`Mutation Nº ${seed}`}
        headRight={live ? 'Live mutating' : 'Frozen'}
        output={<MutatedWord text={text} seed={seed} width={500} />}
        controls={
          <>
            <div className="lab-row">
              <label htmlFor={`mut-in${sync ? '-p' : ''}`} className="lab-opt-label">
                Type
              </label>
              <input id={`mut-in${sync ? '-p' : ''}`} className="fvc-in" type="text" maxLength={20} value={text} autoComplete="off" spellCheck={false} onChange={(e) => set({ t: clean(e.target.value, 20) })} />
            </div>
            <div className="lab-row">
              <button type="button" className="fvc-b" style={{ background: color.magenta, padding: '0 16px' }} onClick={() => reseed(randomSeed())}>
                ↻ Mutate
              </button>
              <button
                type="button"
                className="fvc-b light"
                aria-pressed={!live}
                onClick={() => {
                  if (live) reseed(seed);
                  setLive(!live);
                }}
              >
                {live ? 'Freeze' : 'Go live'}
              </button>
            </div>
          </>
        }
      />
    </div>
  );
}
