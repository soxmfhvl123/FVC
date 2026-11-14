import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { germ, vinyl, colony, specimenCodePath, glyphTexture, meltTexture, layoutWord, mutateModes, wordmarkModes, banners, rng } from '../src/index.ts';

// Legacy engine = the exact code running in the design canvas. The port must match it byte for byte.
const legacySrc = readFileSync(new URL('./fixtures/legacy-engine.methods.js', import.meta.url), 'utf8');
const Legacy = new Function(`return class { constructor(){ this.state = {}; } setState(s){ Object.assign(this.state, s); }\n${legacySrc}\n}`)();
const L = new Legacy();

test('rng is deterministic', () => {
  const a = rng(42), b = rng(42);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
});

test('germ matches the canvas prototype', () => {
  const cases: [number, any][] = [[7, { N: 140, lumps: 5, hair: 60 }], [23, { N: 96, lumps: 6 }], [41, { N: 104, two: false, eyes: 'cyclops', hair: 70 }], [112, { N: 90, eyes: 'three', lumps: 3 }], [131, { N: 40, two: false, eyes: 'none', lumps: 7, dust: 0.01 }]];
  for (const [seed, o] of cases) {
    const port = germ(seed, o);
    const old = L.germBits(seed, o);
    assert.equal(port.ink, old.ink, `ink seed ${seed}`);
    assert.equal(port.spot, old.spot, `spot seed ${seed}`);
  }
});

test('vinyl and colony match the canvas prototype', () => {
  for (const s of [12, 445]) assert.deepEqual(vinyl(s), L.vinylBits(s));
  for (const s of [7, 999]) assert.deepEqual(colony(s), L.colony(s));
});

test('specimen code matches', () => {
  assert.equal(specimenCodePath(9), L.codeBlock(9));
});

test('glyph textures match on a synthetic mask', () => {
  const C = 40, R = 52, m = new Uint8Array(C * R);
  for (let j = 6; j < 48; j++) for (let i = 10; i < 30; i++) if (i < 16 || j < 12 || (j > 24 && j < 30)) m[j * C + i] = 1; // an "F"
  for (const mode of ['pixel', 'dots', 'outline', 'noise', 'warp'] as const) assert.equal(glyphTexture(m, C, R, 5, mode, 70), L.glyphTex(m, C, R, 5, mode, 70), mode);
  assert.deepEqual(meltTexture(m, C, R, 5, 75), L.meltTex(m, C, R, 5, 75));
});

test('word layout + banners fall back to text before glyphs exist', () => {
  const w = layoutWord('FVC', 0, 0, 100, ['pixel']);
  assert.equal(w.length, 3);
  assert.equal(w[0].mode, 'wide'); // no cache yet → text fallback, never blank
  const b = banners(7, 0);
  assert.equal(b.b1.length, 15);
  assert.equal(b.b5.length, 8);
});

test('mutator never repeats a strain next to itself', () => {
  for (const seed of [1, 2, 3, 50]) {
    const m = mutateModes('FAT VIRUS CARRIER', seed);
    for (let i = 1; i < m.length; i++) assert.notEqual(m[i], m[i - 1]);
  }
  assert.deepEqual(wordmarkModes(0), ['pixel', 'outline', 'goth']);
});
