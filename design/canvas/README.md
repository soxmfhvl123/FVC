# design/canvas — prototype boards

Exact copies of the files on the live Claude Design canvas
(https://claude.ai/artifact/VSeNBTjWV9ZWdP49LsNvUs) as of 2026-11-15.

- `*.dc.html` — one file per board. They depend on the canvas runtime (`./support.js`) and **do not run on their own**.
  Read them for sizes, colours, copy, structure and interactions.
- `canvas.json` — board positions/sizes on the canvas.
- `_templates/` — how the boards are built: `engine.js` (the original generator, same code as `packages/fvc-engine`),
  `head.html` (fonts), `defs.html` (grain/bitnoise filters), `inc/b1..b6.html` (banner backgrounds), and `build.py`
  which stitches them into `../*.dc.html`.
