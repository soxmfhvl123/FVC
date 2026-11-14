import type { Format, Strain, Track } from './content';

/** A string is a placeholder when it still holds `[PLACEHOLDER]` (or is empty). */
export const isPlaceholder = (v: string | null | undefined) => !v || /^\[.*\]$/.test(v.trim());

/** Shows real values as-is and placeholders as a readable bracket label: `[Artist]`. */
export function ph(v: string | null | undefined, label: string): string {
  return isPlaceholder(v) ? `[${label}]` : (v as string);
}

export const catalogNo = (id: string) => id.replace(/^FVC-/, '');

/** ■■■■□ */
export function spreadBlocks(level: number | null): string {
  if (level == null) return '—';
  return '■'.repeat(level) + '□'.repeat(5 - level);
}

const FORMAT_LABEL: Record<Format, string> = {
  '12in-vinyl': '12" Vinyl',
  '7in-vinyl': '7" Vinyl',
  cassette: 'Cassette',
  digital: 'Digital',
  film: 'Film',
  goods: 'Goods',
  editorial: 'Editorial',
};
export const formatLabel = (f: Format) => FORMAT_LABEL[f] ?? f;

/** yyyy-mm-dd → MM.DD.YY ; null → [Date] */
export function isolatedLabel(iso: string | null): string {
  if (!iso) return '[Date]';
  const [y, m, d] = iso.split('-');
  return `${m}.${d}.${y.slice(2)}`;
}

/** yyyy-mm-dd → M/D ; null → [0/00] */
export function shortDate(iso: string | null): string {
  if (!iso) return '[0/00]';
  const [, m, d] = iso.split('-');
  return `${Number(m)}/${Number(d)}`;
}

/** Sum of track incubations (m:ss). Any placeholder → [0:00]. */
export function totalIncubation(s: Strain): string {
  const tracks: Track[] = [...s.sideA, ...s.sideB];
  let secs = 0;
  for (const t of tracks) {
    const [m, ss] = t.incubation.split(':').map(Number);
    secs += (m || 0) * 60 + (ss || 0);
  }
  if (!secs) return '[0:00]';
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}

export const trackTime = (t: Track) => (t.incubation === '0:00' ? '[0:00]' : t.incubation);

export const SPREAD_NAMES = [
  'Level 1 — Mild',
  'Level 2 — Hummable',
  'Level 3 — Catchy',
  'Level 4 — Stuck in your head',
  'Level 5 — Fully infected',
];

/** Only the facts we have: "HUGO CHO — 3 tracks, 9:20." (used while blurb is a placeholder). */
export function strainSummary(s: Strain): string {
  const n = s.sideA.length + s.sideB.length;
  const who = isPlaceholder(s.carrier) ? s.id : s.carrier;
  const title = isPlaceholder(s.title) ? '' : ` — ${s.title}`;
  const len = totalIncubation(s);
  return `${who}${title}. ${n} track${n === 1 ? '' : 's'}${len.startsWith('[') ? '' : `, ${len}`}.`;
}

/** Release title, or the artist while the title is still unknown. */
export const displayTitle = (s: Strain) => (isPlaceholder(s.title) ? ph(s.carrier, 'Artist') : s.title);
