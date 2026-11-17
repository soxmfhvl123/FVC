/**
 * @fvc/engine — the generative core of Fat Virus Carrier Records.
 *
 *   germ(seed)          → Ttung-gyun bitmap (ink + spot paths, 300×300)
 *   vinyl(seed)         → splatter record (Pressing Plant)
 *   colony(seed)        → packed-circle germ (Colony)
 *   GlyphCache + letter → mutating "infected" letters (browser: needs canvas + fonts)
 *   banners(seed, tick) → six banner layouts
 *
 * Rule: everything is deterministic from its seed. Store seeds, never store generated SVG.
 */
export * from './core.ts';
export * from './germ.ts';
export * from './v2/index.ts';
export * from './glyph.ts';
export * from './press.ts';
export * from './banners.ts';
export * from './tokens.ts';
