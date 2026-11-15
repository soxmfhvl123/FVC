/**
 * Typed loaders for content/*.json (repo root). Seeds are the source of truth —
 * nothing generated is stored here; components regenerate art from `seed`.
 */
import strainsJson from '@content/strains.json';
import outbreaksJson from '@content/outbreaks.json';
import goodsJson from '@content/goods.json';
import siteJson from '@content/site.json';
import type { EyeSet } from '@fvc/engine';

export type CoverStyle = 'golova' | 'creatura' | 'glitch' | 'connwax';
export type Status = 'draft' | 'scheduled' | 'live' | 'dormant';
export type Format = '12in-vinyl' | '7in-vinyl' | 'cassette' | 'digital' | 'film' | 'goods' | 'editorial';

export interface Track {
  no: number;
  title: string;
  incubation: string;
  /** 1–5 catchiness for this track, null until rated. */
  spread?: number | null;
  /** Path under public/ (e.g. /audio/fvc-001/01.mp3), null when there is no audio yet. */
  audio?: string | null;
  side?: 'A' | 'B';
  /** Source track this one mutates, e.g. "A1" for a Side B version of A1. */
  mutationOf?: string | null;
  /** Germ drawn in place of a title (FVC-002: "the germ is the title"). */
  seed?: number;
  phase?: 'FEVER' | 'DORMANT';
  /** Shown as #???? until it has been played. */
  hidden?: boolean;
  /** Name revealed together with a hidden track, e.g. SPECIMEN. */
  label?: string;
}

/** A playable track for the global player. */
export interface QueueTrack {
  src: string;
  title: string;
  no: number;
  side: 'A' | 'B';
  strainId: string;
  carrier: string;
  incubation: string;
  seed?: number;
  phase?: 'FEVER' | 'DORMANT';
  hidden?: boolean;
  label?: string;
}

export interface Strain {
  id: string;
  seed: number;
  title: string;
  carrier: string;
  strainType: string;
  formats: Format[];
  isolated: string | null;
  spreadLevel: number | null;
  coverStyle: CoverStyle;
  eyes: EyeSet;
  spot: string;
  /** Optional side names, e.g. { A: 'STRAIN', B: 'MUTATION' }. */
  sides?: { A?: string; B?: string };
  sideA: Track[];
  sideB: Track[];
  blurb: string;
  links: { listen: string | null; buy: string | null; bandcamp: string | null };
  vinyl: { seed: number; base: VinylBase; palette: VinylPalette } | null;
  status: Status;
}

export type VinylBase = 'smoke' | 'clear' | 'black' | 'white';
export type VinylPalette = 'outbreak' | 'photocopy' | 'riso';

export interface Outbreak {
  id: string;
  title: string;
  date: string | null;
  doors: string;
  venue: string;
  city: string;
  lineup: string[];
  strain: string;
  posterStyle: 'golova' | 'creatura' | 'noise';
  ticketUrl: string | null;
  status: Status;
}

export interface Good {
  id: string;
  name: string;
  graphic: string;
  price: string | null;
  url: string | null;
}

export interface Site {
  name: string;
  short: string;
  domain: string;
  city: string;
  timezone: string;
  tagline: { main: string; alt: string[] };
  about: string;
  vocabulary: Record<string, string>;
  nav: { left: string[]; right: string[] };
  social: { instagram: string | null };
}

/**
 * Draft visibility (docs/06 Q1): entries with status "draft" are placeholders and stay hidden.
 * Set FVC_SHOW_DRAFTS=true to preview them locally.
 */
const SHOW_DRAFTS = process.env.FVC_SHOW_DRAFTS === 'true';
const visible = (s: { status: Status }) => SHOW_DRAFTS || s.status !== 'draft';

const allStrains = strainsJson.strains as Strain[];

/** Newest `isolated` first; undated strains fall back to catalog number, newest first. */
function byNewest(a: Strain, b: Strain) {
  if (a.isolated && b.isolated) return b.isolated.localeCompare(a.isolated);
  if (a.isolated) return -1;
  if (b.isolated) return 1;
  return b.id.localeCompare(a.id);
}

/** Catalog order (FVC-001 first) — used by the home page cards. */
export function getStrains(): Strain[] {
  return allStrains.filter(visible);
}

export function getStrainsNewest(): Strain[] {
  return [...getStrains()].sort(byNewest);
}

export function getStrain(id: string): Strain | undefined {
  return getStrains().find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export function getLatestStrain(): Strain {
  return getStrainsNewest()[0] ?? allStrains[allStrains.length - 1];
}

/** Every track of a strain that has audio, in Side A → Side B order. */
export function strainQueue(s: Strain): QueueTrack[] {
  const side = (name: 'A' | 'B', tracks: Track[]) =>
    tracks
      .filter((t) => t.audio)
      .map((t) => ({ src: t.audio!, title: t.title, no: t.no, side: name, strainId: s.id, carrier: s.carrier, incubation: t.incubation, seed: t.seed, phase: t.phase, hidden: t.hidden, label: t.label }));
  return [...side('A', s.sideA), ...side('B', s.sideB)];
}

/** One playlist for the whole site: every released track, in catalog order (FVC-001 A1 … FVC-002 #0002). */
export function allQueue(): QueueTrack[] {
  return getStrains().flatMap(strainQueue);
}

/** Where the player starts (nothing plays until pressed): the newest strain's first track. */
export function startIndex(queue: QueueTrack[]): number {
  for (const s of getStrainsNewest()) {
    const i = queue.findIndex((t) => t.strainId === s.id);
    if (i >= 0) return i;
  }
  return 0;
}

export function getOutbreaks(): Outbreak[] {
  return (outbreaksJson.outbreaks as Outbreak[]).filter(visible);
}

export function getOutbreak(id: string): Outbreak | undefined {
  return getOutbreaks().find((o) => o.id.toLowerCase() === id.toLowerCase());
}

export function getGoods(): Good[] {
  return goodsJson.goods as Good[];
}

export const site = siteJson as Site;
