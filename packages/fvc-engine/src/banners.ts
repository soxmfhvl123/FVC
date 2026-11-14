/**
 * Infected-type banner series — six 1400×420 layouts.
 * Letters come back as PlacedLetter[] (percent positions); backgrounds are static SVG
 * (see design/canvas/Banners.dc.html for the exact background artwork of each banner).
 */
import { scribblePath, starRow } from './core.ts';
import { layoutWord, type GlyphTextures, type LetterMode, type PlacedLetter } from './glyph.ts';

type Cache = { get(ch: string): GlyphTextures | undefined };

export interface BannerSet {
  b1: PlacedLetter[]; // red — FAT · sound · spreads
  b2: PlacedLetter[]; // white — Noise IS the new carrier
  b3: PlacedLetter[]; // magenta — catch it! / HIGHLY CONTAGIOUS
  b4: PlacedLetter[]; // grey — spread
  b5: PlacedLetter[]; // grey stripes — INFECTED (melted)
  b6: PlacedLetter[]; // acid — carrier no.7
  stars: string;
  scr1: string;
  scr2: string;
}

/** Every character the banners need — pass to GlyphCache.ensure() once fonts are ready. */
export const BANNER_CHARS = 'FATsoundpreadsNoiseIStheewcarriercatchit!spreadINFECTEDno.7';

const ALT: LetterMode[] = ['pixel', 'noise', 'warp', 'dots', 'outline', 'serif', 'goth', 'wide'];

/**
 * @param seed  changes jitter/placement ("Shuffle")
 * @param tick  increments once a second; one letter per word swaps strain each tick ("live")
 */
export function banners(seed: number, tick: number, cache?: Cache): BannerSet {
  const mut = (base: LetterMode[], alts: LetterMode[], idx: number, len: number) => (i: number) =>
    (tick + idx * 3) % len === i ? alts[(tick + i) % alts.length] : base[i % base.length];
  const W = (s: string, x: number, y: number, w: number, m: Parameters<typeof layoutWord>[4], o = {}, sd = 1, j = {}) =>
    layoutWord(s, x, y, w, m, cache, o, seed + sd, j);
  const green = { color: '#A6FF00' };
  return {
    b1: [
      ...W('F', 20, 34, 214, ['goth'], {}, 1),
      ...W('A', 150, 34, 214, mut(['contour'], ALT, 0, 1), { color: '#FF2A1A' }, 2),
      ...W('T', 272, 30, 220, mut(['pixel'], ALT, 1, 1), {}, 3),
      ...W('sound', 478, 112, 110, mut(['noise', 'warp', 'outline', 'pixel', 'dots'], ALT, 2, 5), {}, 4, { y: 26, r: 8 }),
      ...W('spreads', 966, 76, 96, mut(['warp', 'goth', 'warp', 'serif', 'warp', 'pixel', 'warp'], ALT, 3, 7), {}, 5, { y: 18, r: 4 }),
    ],
    b2: [
      ...W('Noise', 22, 128, 196, mut(['contour', 'contour', 'gothc', 'contour', 'contour'], ['pixel', 'warp', 'noise'], 0, 5), green, 6, { y: 34, r: 10, s: 0.18 }),
      ...W('IS', 560, 214, 92, ['contour'], green, 7, { y: 10, r: 6 }),
      ...W('the', 660, 254, 72, ['serif'], {}, 8, { y: 20, r: 18 }),
      ...W('new', 760, 30, 120, mut(['contour', 'gothc', 'contour'], ['warp', 'pixel'], 1, 3), green, 9, { y: 14, r: 8 }),
      ...W('carrier', 950, 34, 90, mut(['contour', 'goth', 'contour', 'warp', 'contour', 'serifc', 'contour'], ['pixel', 'noise'], 2, 7), green, 10, { y: 26, r: 10 }),
    ],
    b3: W('catch it!', 110, 40, 120, mut(['wide', 'serifc', 'contour', 'goth', 'pixel', 'wide', 'dots', 'contour'], ALT, 0, 9), { color: '#F7F7F5' }, 11, { y: 150, r: 26, s: 0.3 }),
    b4: [
      ...W('s', 150, 96, 156, mut(['pixel'], ALT, 0, 1), { rasterColor: '#FF2DB4' }, 12),
      ...W('p', 256, 96, 156, mut(['outline'], ALT, 1, 1), { rasterColor: '#FF2DB4' }, 13),
      ...W('r', 352, 70, 156, ['serifc'], { color: '#FF2DB4' }, 14),
      ...W('e', 446, 96, 156, mut(['dots'], ALT, 2, 1), {}, 15),
      ...W('a', 560, 60, 150, ['block'], { color: '#2B44FF' }, 16),
      ...W('d', 700, 96, 156, mut(['contour'], ALT, 3, 1), { color: '#FF2DB4' }, 17),
    ],
    b5: W('INFECTED', 96, 96, 158, mut(['melt'], ['melt', 'noise', 'warp'], 0, 8), { color: '#FFE800' }, 18, { y: 22, r: 7, s: 0.12 }),
    b6: [
      ...W('c', 10, 18, 318, mut(['noise'], ['pixel', 'warp', 'dots'], 0, 1), {}, 19),
      ...W('arrier', 236, 118, 172, mut(['warp', 'warp', 'pixel', 'warp', 'warp', 'warp'], ['noise', 'goth', 'serif'], 1, 6), {}, 20, { y: 18, r: 5 }),
      ...W('no.7', 1080, 184, 118, mut(['warp', 'warp', 'pixel', 'contour'], ['noise'], 2, 4), { rasterColor: '#A6FF00', color: '#A6FF00' }, 21, { y: 14, r: 10 }),
    ],
    stars: starRow(30, 1370, 18, 30, 11, 5),
    scr1: scribblePath(250, 60, 300, 70, 26, seed + 30),
    scr2: scribblePath(300, 110, 230, 50, 20, seed + 31),
  };
}
