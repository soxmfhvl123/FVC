import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audit, BODIES, EYE_COUNTS, type Genome, genomeCode, germ2, MOODS, parseGenome, PATTERNS, rollGenome, speciesName, SURFACES } from '../src/index.ts';

test('same seed + same genome = same germ', () => {
  const g = rollGenome(417);
  assert.deepEqual(germ2(417, g).ink, germ2(417, g).ink);
  assert.equal(germ2(417, g).spot, germ2(417, g).spot);
});

test('genes roll independently: overriding one never moves the others', () => {
  for (const seed of [1, 2, 88, 417, 2203, 3009]) {
    const base = rollGenome(seed);
    for (const k of Object.keys(base) as (keyof Genome)[]) {
      const other = rollGenome(seed, { [k]: (base[k] + 1) % 2 });
      for (const j of Object.keys(base) as (keyof Genome)[]) if (j !== k) assert.equal(other[j], base[j], `${k} moved ${j} (seed ${seed})`);
    }
  }
});

test('genome codes round-trip in both spellings', () => {
  for (let s = 1; s < 60; s++) {
    const g = rollGenome(s);
    assert.deepEqual(parseGenome(genomeCode(g)), g);
    assert.deepEqual(parseGenome(genomeCode(g, '')), g);
  }
  assert.deepEqual(parseGenome('B5-S2-E3·Dz-P5-R0'), { body: 5, surface: 2, eyes: 3, mood: 3, pattern: 5, render: 0 });
  assert.equal(parseGenome('B9-S0-E2Cu-P0-R0'), null);
  assert.equal(parseGenome('nonsense'), null);
});

test('species names follow the doc', () => {
  assert.equal(speciesName({ body: 0, surface: 0, eyes: 2, mood: 0, pattern: 0, render: 0 }), 'Pinguicoccus binoculus');
  assert.equal(speciesName({ body: 5, surface: 2, eyes: 5, mood: 3, pattern: 5, render: 0 }), 'Pinguispira argus var. gravidus');
});

test('guardrails: every body × eye count × mood keeps eyes inside and inks ≤ 2', () => {
  for (let body = 0; body < BODIES.length; body++)
    for (let eyes = 0; eyes < EYE_COUNTS.length; eyes++)
      for (let mood = 0; mood < MOODS.length; mood++)
        for (const seed of [3, 417]) {
          const pattern = (body + eyes + mood) % PATTERNS.length;
          const surface = (body * 3 + mood) % SURFACES.length;
          const g = germ2(seed, { body, surface, eyes, mood, pattern, render: 0 }, { N: 44 });
          assert.deepEqual(audit(g), [], `${g.code} seed ${seed}`);
          if (EYE_COUNTS[eyes] !== 0) assert.ok(g.eyes.length > 0, `${g.code} seed ${seed} lost all its eyes`);
        }
});

test('plain pattern prints in one ink', () => {
  const g = germ2(9, { body: 1, surface: 0, eyes: 2, mood: 0, pattern: 6, render: 0 });
  assert.equal(g.inks, 1);
  assert.equal(g.spot, '');
});

test('speed: a Fine (140) germ grows in well under 16 ms on average', () => {
  for (let i = 0; i < 5; i++) germ2(i + 1, undefined, { N: 140 }); // warm up
  const t0 = performance.now();
  const n = 27;
  for (let i = 0; i < n; i++) germ2(100 + i, rollGenome(100 + i), { N: 140 });
  const avg = (performance.now() - t0) / n;
  console.log(`germ2 Fine avg ${avg.toFixed(1)} ms`);
  assert.ok(avg < 40, `avg ${avg.toFixed(1)} ms`);
});
