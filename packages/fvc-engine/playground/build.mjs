// Renders a static gallery of engine outputs → playground/index.html
// Run: node playground/build.mjs   (Node 22+, strips TS types natively)
import { writeFileSync } from 'node:fs';
import { germ, vinyl, colony, color } from '../src/index.ts';

const seeds = [7, 23, 41, 88, 112, 131, 150, 2026];
const eyes = ['two', 'cyclops', 'three', 'none'];
const cellG = (s, i) => {
  const g = germ(s, { N: 100, eyes: eyes[i % 4] });
  return `<figure><svg viewBox="0 0 300 300"><rect width="300" height="300" fill="${color.grey}"/><path d="${g.spot}" fill="${color.spot}"/><path d="${g.ink}" fill="${color.ink}"/></svg><figcaption>germ seed ${s} · eyes ${eyes[i % 4]}</figcaption></figure>`;
};
const cellV = (s) => {
  const v = vinyl(s), l = germ(s + 3, { N: 64, two: false, dust: 0, eyes: 'cyclops' });
  return `<figure><svg viewBox="0 0 300 300"><rect width="300" height="300" fill="${color.paper}"/><circle cx="150" cy="150" r="148" fill="#2A2A2A"/><path d="${v.groove}" fill="#000" opacity=".3"/><path d="${v.c1}" fill="${color.ink}"/><path d="${v.c2}" fill="${color.spot}"/><path d="${v.c3}" fill="${color.acid}"/><path d="${v.c4}" fill="${color.white}"/><circle cx="150" cy="150" r="54" fill="${color.spot}"/><svg x="112" y="104" width="76" height="76" viewBox="0 0 300 300"><path d="${l.ink}" fill="${color.ink}"/></svg><circle cx="150" cy="150" r="3.5" fill="${color.paper}"/></svg><figcaption>vinyl seed ${s}</figcaption></figure>`;
};
const cellC = (s) => {
  const c = colony(s);
  return `<figure><svg viewBox="0 0 300 300"><rect width="300" height="300" fill="${color.white}"/><path d="${c.a}" fill="${color.spot}"/><path d="${c.b}" fill="${color.cobalt}"/><path d="${c.c}" fill="${color.acid}"/><path d="${c.d}" fill="${color.magenta}"/><path d="${c.white}" fill="#fff" stroke="${color.ink}" stroke-width="3"/><path d="${c.ink}" fill="${color.ink}"/></svg><figcaption>colony seed ${s}</figcaption></figure>`;
};
const html = `<!doctype html><meta charset="utf-8"><title>@fvc/engine playground</title>
<style>body{margin:0;background:${color.paper};font:13px/1.3 system-ui;color:${color.ink}}h1{font:500 28px system-ui;margin:20px}h2{margin:20px 20px 0;font:600 14px system-ui;text-transform:uppercase}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:10px 20px}figure{margin:0;background:#fff}svg{display:block;width:100%;height:auto}figcaption{padding:6px 8px;font-family:monospace}</style>
<h1>@fvc/engine — playground</h1>
<h2>Germ (Germinator)</h2><div class="g">${seeds.map(cellG).join('')}</div>
<h2>Splatter vinyl (Pressing Plant)</h2><div class="g">${seeds.slice(0, 4).map(cellV).join('')}</div>
<h2>Colony</h2><div class="g">${seeds.slice(0, 4).map(cellC).join('')}</div>
<p style="margin:20px">Letters (GlyphCache) need a browser canvas + Archivo — see packages/fvc-engine/README.md.</p>`;
writeFileSync(new URL('./index.html', import.meta.url), html);
console.log('wrote playground/index.html', Math.round(html.length / 1024) + 'KB');
