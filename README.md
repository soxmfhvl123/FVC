# FVC RECORDS — Fat Virus Carrier Records

Brand + website handoff package for **fvc.ai.kr**. Ready to hand to Claude Code.

**Fat Virus Carrier** — a Seoul label that carries *fat sound*. Every record is a carrier; every listener catches it.
Identity: bitmap germs generated from seeds · a wordmark that mutates · photocopy bars and grain · infected type banners · brand-only generator tools (FVC Lab).

## Start here

| If you are… | Open |
|---|---|
| Choi / anyone reading the plan | `docs/00_기획서.md` |
| Claude Code | `CLAUDE.md` (then follow its reading order) |
| A designer checking visuals | the live canvas → https://claude.ai/artifact/VSeNBTjWV9ZWdP49LsNvUs |
| A developer touching generators | `packages/fvc-engine/README.md` |

## What's in the box

```
docs/
  00_기획서.md            master plan (Korean): concept, IA, features, roadmap, risks
  01_reference-notes.md   what each reference contributes (and what not to copy)
  02_design-system.md     colour, type, rules, components, motion, a11y
  03_site-spec.md         every page and section, behaviour, data
  04_engine-spec.md       how each generator works
  05_build-plan.md        milestones M0–M8 with "Done when" checks
  06_open-questions.md    decisions still needed (+ safe defaults)
design/
  canvas/                 8 prototype boards (*.dc.html) + canvas.json + _templates/
  references/             5 moodboard files
  tokens/                 tokens.json, tokens.css
content/                  strains / outbreaks / goods / site JSON (placeholders marked)
packages/fvc-engine/      TypeScript generator library — 7 parity tests passing
apps/web/                 the Next.js website (npm run dev from the repo root)
```

## Canvas boards (design/canvas)

| File | Board |
|---|---|
| `Main.dc.html` | Homepage (interactive) |
| `Logo.dc.html` | 01 Logo — live mutating mark, dish seal, lockups, icons |
| `Mascot.dc.html` | 02 Ttung-gyun specimen sheet |
| `Kit.dc.html` | 03 Graphic kit — 12 graphics |
| `Poster.dc.html` | 04 Posters — Golova / Creatura / Into the Noise |
| `System.dc.html` | 05 Colour · type · rules |
| `Lab.dc.html` | 06 FVC Lab — 4 working tools |
| `Banners.dc.html` | 07 Banner series — infected type |

These are reference prototypes (they need the Claude Design runtime). The website is to be rebuilt in Next.js using `@fvc/engine`, which produces identical graphics.

## Status
- Brand concept, visual system, prototypes: **done**
- Generator engine (TS) with tests: **done**
- Website: **built** in `apps/web` (M0–M7 done, M8 launch steps pending) → `docs/07_build-notes.md`
- Real content (artists, releases): **waiting** → `docs/06_open-questions.md` Q1
