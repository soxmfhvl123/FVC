import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { colony, germ } from '../src/index.ts';

/**
 * Engine v1 is frozen. Hashes were taken from git HEAD 964d606 (before the freeze) for seeds
 * 1–50 + 417, 2203, 88, 1113, 3009 in nine grid/eye settings, plus colony(seed).
 * Seed 2 is FVC-002 #0002 SPECIMEN — the germ hidden in the sound. Not one cell may move.
 */
const snap = JSON.parse(readFileSync(new URL('./fixtures/germ-v1.snapshot.json', import.meta.url), 'utf8'));
const sha = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 24);

test('v1 germs are identical to the frozen snapshot', () => {
  let n = 0;
  for (const s of snap.seeds as number[])
    for (const [k, o] of Object.entries(snap.configs)) {
      const g = germ(s, o as object);
      assert.equal(sha(g.ink + '|' + g.spot), snap.hashes[`germ:${s}:${k}`], `germ seed ${s} ${k}`);
      n++;
    }
  assert.equal(n, 495);
});

test('#0002 SPECIMEN (seed 2) is unchanged in every setting', () => {
  for (const k of Object.keys(snap.configs)) {
    const g = germ(2, snap.configs[k]);
    assert.equal(sha(g.ink + '|' + g.spot), snap.hashes[`germ:2:${k}`], k);
  }
});

test('v1 colonies are identical to the frozen snapshot', () => {
  for (const s of snap.seeds as number[]) assert.equal(sha(JSON.stringify(colony(s))), snap.hashes[`colony:${s}`], `colony ${s}`);
});
