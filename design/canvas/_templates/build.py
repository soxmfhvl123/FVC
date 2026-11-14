"""Rebuild the canvas artboards from templates.
Usage (from this folder):  python3 build.py Main.dc.html Lab.dc.html ...
Writes to ../<name>. The canvas runtime (support.js) only exists inside the Claude Design canvas,
so these files are REFERENCE PROTOTYPES, not deployable pages."""
import sys, pathlib, re
root = pathlib.Path(__file__).resolve().parent
engine = (root / 'engine.js').read_text()
head = (root / 'head.html').read_text()
defs = (root / 'defs.html').read_text()
for name in sys.argv[1:]:
    src = (root / name).read_text()
    src = re.sub(r'<!--INC:(\w+)-->', lambda m: (root / 'inc' / (m.group(1) + '.html')).read_text(), src)
    out = src.replace('/*ENGINE*/', engine).replace('<!--HEAD-->', head).replace('<!--DEFS-->', defs)
    (root.parent / name).write_text(out)
    print('built', name, len(out))
