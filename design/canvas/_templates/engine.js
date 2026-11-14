  rng(seed) { var s = seed % 2147483647; if (s <= 0) s += 2147483646; return function () { s = s * 16807 % 2147483647; return (s - 1) / 2147483646; }; }
  hash(ix, iy, s) { var h = (ix * 374761393 + iy * 668265263 + s * 982451653) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h = h ^ (h >>> 16); return (h >>> 0) / 4294967296; }
  noise(x, y, s) {
    var x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    var a = this.hash(x0, y0, s), b = this.hash(x0 + 1, y0, s), c = this.hash(x0, y0 + 1, s), d = this.hash(x0 + 1, y0 + 1, s);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }
  fbm(x, y, s) { return this.noise(x, y, s) * 0.55 + this.noise(x * 2.1, y * 2.1, s + 7) * 0.3 + this.noise(x * 4.3, y * 4.3, s + 13) * 0.15; }
  runs(g, N, M, cell, val) {
    var d = '', i, j, r = function (n) { return Math.round(n * 100) / 100; };
    for (j = 0; j < M; j++) { i = 0; while (i < N) { if (g[j * N + i] === val) { var s = i; while (i < N && g[j * N + i] === val) i++; var w = (i - s) * cell; d += 'M' + r(s * cell) + ' ' + r(j * cell) + 'h' + r(w) + 'v' + r(cell) + 'h' + r(-w) + 'z'; } else i++; } }
    return d;
  }
  germBits(seed, o) {
    o = o || {};
    var N = o.N || 110, S = 300, cell = S / N, r = this.rng(seed), span = 1.45;
    var k1 = o.lumps || (4 + Math.floor(r() * 3)), k2 = k1 + 2, p1 = r() * 6.283, p2 = r() * 6.283, a1 = 0.07 + r() * 0.04, a2 = 0.03 + r() * 0.03;
    var H = o.hair || 54, two = o.two !== false, dust = o.dust == null ? 0.006 : o.dust;
    var eyes = o.eyes === 'none' ? [] : o.eyes === 'cyclops' ? [[0, -0.08, 0.34, 0.1, 0.02, 0.15]] : o.eyes === 'three' ? [[-0.36, -0.12, 0.15, -0.36, -0.04, 0.07], [0, -0.32, 0.13, 0.02, -0.25, 0.06], [0.34, -0.1, 0.17, 0.34, -0.01, 0.08]] : [[-0.3, -0.14, 0.22, -0.2, -0.12, 0.1], [0.28, -0.24, 0.16, 0.36, -0.22, 0.075]];
    var g = new Uint8Array(N * N), i, j, e;
    for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
      var x = ((i + 0.5) / N * 2 - 1) * span, y = ((j + 0.5) / N * 2 - 1) * span;
      var dist = Math.sqrt(x * x + y * y), th = Math.atan2(y, x);
      var R = 1 + a1 * Math.sin(k1 * th + p1) + a2 * Math.sin(k2 * th + p2) + (this.noise(x * 6, y * 6, seed + 3) - 0.5) * 0.08;
      var v = 0;
      if (dist < R) {
        var t = this.fbm(x * 2.2 + 5, y * 2.2 + 5, seed), fine = this.hash(i, j, seed + 11);
        if (dist > R - 0.07) v = fine > 0.12 ? 1 : 0;
        else if (two && t > 0.57) v = 2;
        else if (t < 0.42) v = fine > 0.04 ? 1 : 0;
        else if (t < 0.49) v = fine > 0.5 ? 1 : 0;
        else v = fine > 0.9 ? 1 : 0;
        for (e = 0; e < eyes.length; e++) { var E = eyes[e], de = Math.hypot(x - E[0], y - E[1]), dp = Math.hypot(x - E[3], y - E[4]); if (dp < E[5]) v = 1; else if (de < E[2]) v = 0; else if (de < E[2] + 0.055) v = 1; }
      } else if (dist < R + 0.45) {
        var out = dist - R, best = 9, kk, k0 = Math.round(th / 6.2832 * H);
        for (kk = k0 - 2; kk <= k0 + 2; kk++) {
          var Lk = 0.1 + this.hash(kk, 0, seed + 5) * 0.3, wob = (this.hash(kk, 1, seed + 5) - 0.5) * 3.2;
          if (out > Lk) continue;
          var ang = kk / H * 6.2832 + wob * out * out * 2.2, dth = Math.abs(Math.atan2(Math.sin(th - ang), Math.cos(th - ang))) * dist;
          if (dth < 0.026 * (1 - 0.55 * out / Lk)) best = 0;
        }
        if (best === 0) v = 1;
      }
      if (v === 0 && dist >= R) { var hd = this.hash(i, j, seed + 29); if (hd < dust) v = 1; else if (two && hd > 1 - dust * 0.7) v = 2; }
      g[j * N + i] = v;
    }
    return { ink: this.runs(g, N, N, cell, 1), spot: this.runs(g, N, N, cell, 2) };
  }
  circ(cx, cy, R) { var r = function (n) { return Math.round(n * 100) / 100; }; return 'M' + r(cx - R) + ' ' + r(cy) + 'a' + r(R) + ' ' + r(R) + ' 0 1 0 ' + r(2 * R) + ' 0a' + r(R) + ' ' + r(R) + ' 0 1 0 ' + r(-2 * R) + ' 0'; }
  glyphTex(m, C, Rr, cell, mode, seed) {
    var at = function (i, j) { return i >= 0 && j >= 0 && i < C && j < Rr ? m[j * C + i] : 0; };
    var g = new Uint8Array(C * Rr), i, j, d = '';
    if (mode === 'dots') {
      for (j = 0; j < Rr; j += 2) for (i = 0; i < C; i += 2) if (at(i, j) || at(i + 1, j + 1)) d += this.circ((i + 1) * cell, (j + 1) * cell, cell * 1.18) + this.circ((i + 1) * cell, (j + 1) * cell, cell * 0.5);
      return d;
    }
    for (j = 0; j < Rr; j++) for (i = 0; i < C; i++) {
      var v = 0;
      if (mode === 'pixel') v = at(i, j) && this.hash(i, j, seed) > 0.05 ? 1 : 0;
      else if (mode === 'outline') {
        var edge = at(i, j) && (!at(i - 1, j) || !at(i + 1, j) || !at(i, j - 1) || !at(i, j + 1));
        var er = function (a, b) { return at(a, b) && at(a - 3, b) && at(a + 3, b) && at(a, b - 3) && at(a, b + 3); };
        var edge2 = er(i, j) && (!er(i - 1, j) || !er(i + 1, j) || !er(i, j - 1) || !er(i, j + 1));
        v = edge || edge2 ? 1 : 0;
      } else if (mode === 'warp') {
        v = at(i + Math.round(Math.sin(j * 0.31 + seed) * 3.4 + Math.sin(j * 0.09 + seed * 2) * 2), j) && this.hash(i, j, seed) > 0.03 ? 1 : 0;
      } else if (mode === 'noise') {
        var sh = this.hash(0, j, seed) < 0.16 ? Math.round((this.hash(1, j, seed) - 0.5) * 10) : 0;
        if (at(i - sh, j)) v = this.fbm(i * 0.2, j * 0.2, seed) > 0.4 ? 1 : 0;
        else if ((at(i + 2, j) || at(i - 2, j) || at(i, j + 2) || at(i, j - 2)) && this.hash(i, j, seed + 3) < 0.16) v = 1;
      }
      g[j * C + i] = v;
    }
    return this.runs(g, C, Rr, cell, 1);
  }
  buildGlyphs(chars) {
    var self = this, W = 200, Hh = 260, cell = 5, C = W / cell, Rr = Hh / cell, out = {};
    try {
      var cv = document.createElement('canvas'); cv.width = W; cv.height = Hh; var ctx = cv.getContext('2d');
      chars.forEach(function (ch, ci) {
        ctx.clearRect(0, 0, W, Hh); ctx.fillStyle = '#000'; try { ctx.fontStretch = 'extra-condensed'; } catch (e) {}
        ctx.font = '900 300px Archivo, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(ch, W / 2, 248);
        var data = ctx.getImageData(0, 0, W, Hh).data, m = new Uint8Array(C * Rr);
        for (var j = 0; j < Rr; j++) for (var i = 0; i < C; i++) { var px = Math.floor((i + 0.5) * cell), py = Math.floor((j + 0.5) * cell); m[j * C + i] = data[(py * W + px) * 4 + 3] > 120 ? 1 : 0; }
        out[ch] = { pixel: self.glyphTex(m, C, Rr, cell, 'pixel', 3 + ci), dots: self.glyphTex(m, C, Rr, cell, 'dots', 5 + ci), outline: self.glyphTex(m, C, Rr, cell, 'outline', 7 + ci), noise: self.glyphTex(m, C, Rr, cell, 'noise', 9 + ci) };
      });
      this.setState({ glyphs: out });
    } catch (e) {}
  }
  loadGlyphs(chars) {
    var self = this, go = function () { self.buildGlyphs(chars); };
    try { if (document.fonts && document.fonts.load) { Promise.all([document.fonts.load('900 300px Archivo'), document.fonts.load('800 200px "Grenze Gotisch"'), document.fonts.load('italic 200px "Instrument Serif"')]).then(go, go); } else go(); } catch (e) { go(); }
  }
  letter(ch, mode, glyphs, ink) {
    ink = ink || '#0B0B0B';
    if (!glyphs && (mode === 'pixel' || mode === 'dots' || mode === 'outline' || mode === 'noise')) mode = 'wide';
    var L = { ch: ch, d: '', tfill: 'none', font: 'Archivo, sans-serif', fstyle: 'normal', weight: '900', stretch: '62%', size: '300', mode: mode };
    if (mode === 'goth') { L.tfill = ink; L.font = 'Grenze Gotisch, serif'; L.weight = '800'; L.stretch = 'normal'; L.size = '290'; }
    else if (mode === 'serif') { L.tfill = ink; L.font = 'Instrument Serif, serif'; L.fstyle = 'italic'; L.weight = '400'; L.stretch = 'normal'; L.size = '330'; }
    else if (mode === 'wide') { L.tfill = ink; L.stretch = '125%'; L.size = '220'; }
    else if (mode === 'solid') { L.tfill = ink; }
    else { L.d = glyphs[ch][mode]; }
    return L;
  }
  fmt() {
    try {
      var p = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date());
      var g = function (t) { var x = p.find(function (y) { return y.type === t; }); return x ? x.value : ''; };
      return { full: g('month') + '.' + g('day') + '.' + g('year') + ' ' + g('hour') + ':' + g('minute') + ':' + g('second'), short: g('hour') + ':' + g('minute') };
    } catch (e) { return { full: '', short: '' }; }
  }
  bars(seed, w, h) {
    var r = this.rng(seed), x = 0, d = '';
    while (x < w) { var bw = 1 + Math.floor(r() * 4); if (x + bw > w) break; d += 'M' + x + ' 0h' + bw + 'v' + h + 'h-' + bw + 'Z'; x += bw + 1 + Math.floor(r() * 3); }
    return d;
  }
  germR(seed, o) {
    o = o || {};
    var r = this.rng(seed), k1 = o.lumps || (4 + Math.floor(r() * 3)), k2 = k1 + 2, p1 = r() * 6.283, p2 = r() * 6.283, a1 = 0.07 + r() * 0.04, a2 = 0.03 + r() * 0.03;
    return function (th) { return 1 + a1 * Math.sin(k1 * th + p1) + a2 * Math.sin(k2 * th + p2); };
  }
  vinylBits(seed, o) {
    o = o || {};
    var N = o.N || 150, cell = 300 / N, r = this.rng(seed * 7 + 1), i, j, s, splats = [], nS = o.splats || 40;
    for (s = 0; s < nS; s++) splats.push({ rc: 0.42 + r() * 0.56, tc: r() * 6.2832, sz: 0.018 + r() * 0.07, col: 1 + Math.floor(r() * 4), el: 3 + r() * 4 });
    var g = new Uint8Array(N * N);
    for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
      var x = ((i + 0.5) / N) * 2 - 1, y = ((j + 0.5) / N) * 2 - 1, rr = Math.sqrt(x * x + y * y), th = Math.atan2(y, x), v = 0;
      if (rr > 0.985 || rr < 0.36) { g[j * N + i] = 0; continue; }
      for (s = 0; s < nS; s++) {
        var S = splats[s], dt = Math.atan2(Math.sin(th - S.tc), Math.cos(th - S.tc)) * rr, dr = rr - S.rc;
        var f = (dt / S.sz) * (dt / S.sz) + (dr / (S.sz * S.el)) * (dr / (S.sz * S.el));
        if (f < 1 + (this.noise(x * 9, y * 9, seed + s) - 0.5) * 1.4) v = S.col;
      }
      if (!v && this.hash(i, j, seed + 41) < 0.012) v = 1 + Math.floor(this.hash(j, i, seed) * 4);
      if (!v && (rr * 52) % 1 < 0.12) v = 5;
      g[j * N + i] = v;
    }
    return { c1: this.runs(g, N, N, cell, 1), c2: this.runs(g, N, N, cell, 2), c3: this.runs(g, N, N, cell, 3), c4: this.runs(g, N, N, cell, 4), groove: this.runs(g, N, N, cell, 5) };
  }
  colony(seed, o) {
    o = o || {};
    var R = this.germR(seed, o), G = 60, cell = 300 / G, occ = new Uint8Array(G * G), out = { a: '', b: '', c: '', d: '', ink: '', white: '' }, self = this, sizes = [7, 5, 4, 3, 2, 1], keys = ['a', 'b', 'c', 'd', 'ink'];
    var inside = function (cx, cy, rad) { var x = (cx / 300 * 2 - 1) * 1.45, y = (cy / 300 * 2 - 1) * 1.45, d = Math.sqrt(x * x + y * y), th = Math.atan2(y, x); return d + rad / 300 * 2 * 1.45 < R(th); };
    var place = function (gi, gj, k) {
      for (var b = gj; b < gj + k; b++) for (var a = gi; a < gi + k; a++) { if (a >= G || b >= G || occ[b * G + a]) return false; }
      for (b = gj; b < gj + k; b++) for (a = gi; a < gi + k; a++) occ[b * G + a] = 1; return true;
    };
    var eyes = [[110, 128, 20], [178, 118, 15]];
    eyes.forEach(function (E) { var k = Math.ceil(E[2] * 2 / cell) + 1, gi = Math.floor((E[0] - E[2]) / cell), gj = Math.floor((E[1] - E[2]) / cell); for (var b = gj; b < gj + k; b++) for (var a = gi; a < gi + k; a++) if (a >= 0 && b >= 0 && a < G && b < G) occ[b * G + a] = 1; out.white += self.circ(E[0], E[1], E[2]); out.ink += self.circ(E[0] + E[2] * 0.35, E[1] + E[2] * 0.15, E[2] * 0.48); });
    sizes.forEach(function (k, si) {
      for (var gj = 0; gj < G; gj++) for (var gi = 0; gi < G; gi++) {
        var cx = (gi + k / 2) * cell, cy = (gj + k / 2) * cell, rad = k * cell / 2;
        if (!inside(cx, cy, rad * 0.6)) continue;
        var pr = k >= 5 ? 0.06 : k >= 3 ? 0.2 : 1;
        if (self.hash(gi, gj, seed + k * 13) > pr) continue;
        if (!place(gi, gj, k)) continue;
        var ci = Math.floor(self.hash(gi, gj, seed + 99) * (k === 1 ? 5 : 4));
        out[keys[ci]] += self.circ(cx, cy, rad * 0.9);
      }
    });
    return out;
  }
  codeBlock(seed, n) {
    n = n || 21; var g = new Uint8Array(n * n), i, j, c = 6;
    var finder = function (ox, oy) { for (var b = 0; b < 7; b++) for (var a = 0; a < 7; a++) { var e = a === 0 || b === 0 || a === 6 || b === 6 || (a >= 2 && a <= 4 && b >= 2 && b <= 4); g[(oy + b) * n + ox + a] = e ? 1 : 2; } };
    for (j = 0; j < n; j++) for (i = 0; i < n; i++) g[j * n + i] = this.hash(i, j, seed) > 0.52 ? 1 : 0;
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
    return this.runs(g, n, n, c, 1);
  }
  zig(w, amp, step) { var d = 'M0 ' + amp, x = 0, up = true; while (x < w) { x += step; d += 'L' + x + ' ' + (up ? 0 : amp); up = !up; } return d; }
  ensureGlyphs(chars) {
    var self = this, W = 200, Hh = 260, cell = 5, C = W / cell, Rr = Hh / cell;
    this._gl = this._gl || {};
    var need = chars.filter(function (c) { return !self._gl[c]; });
    if (!need.length) return;
    try {
      var cv = this._cv || (this._cv = document.createElement('canvas')); cv.width = W; cv.height = Hh; var ctx = cv.getContext('2d');
      need.forEach(function (ch, ci) {
        ctx.clearRect(0, 0, W, Hh); ctx.fillStyle = '#000'; try { ctx.fontStretch = 'extra-condensed'; } catch (e) {}
        ctx.font = '900 300px Archivo, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(ch, W / 2, 248);
        var data = ctx.getImageData(0, 0, W, Hh).data, m = new Uint8Array(C * Rr);
        for (var j = 0; j < Rr; j++) for (var i = 0; i < C; i++) { var px = Math.floor((i + 0.5) * cell), py = Math.floor((j + 0.5) * cell); m[j * C + i] = data[(py * W + px) * 4 + 3] > 120 ? 1 : 0; }
        var sd = ch.charCodeAt(0);
        self._gl[ch] = { pixel: self.glyphTex(m, C, Rr, cell, 'pixel', sd), dots: self.glyphTex(m, C, Rr, cell, 'dots', sd + 1), outline: self.glyphTex(m, C, Rr, cell, 'outline', sd + 2), noise: self.glyphTex(m, C, Rr, cell, 'noise', sd + 3), warp: self.glyphTex(m, C, Rr, cell, 'warp', sd + 4), melt: self.meltTex(m, C, Rr, cell, sd + 5) };
      });
    } catch (e) {}
  }
  meltTex(m, C, Rr, cell, seed) {
    var at = function (i, j) { return i >= 0 && j >= 0 && i < C && j < Rr ? m[j * C + i] : 0; }, g = new Uint8Array(C * Rr), i, j, a, b, self = this;
    var drip = []; for (i = 0; i < C; i++) drip.push(this.hash(i, 0, seed) < 0.18 ? 2 + Math.floor(this.hash(i, 1, seed) * 6) : 0);
    for (j = 0; j < Rr; j++) for (i = 0; i < C; i++) {
      var on = at(i, j), rad = 1 + Math.round(this.noise(i * 0.25, j * 0.25, seed) * 2);
      if (!on) for (b = -rad; b <= rad && !on; b++) for (a = -rad; a <= rad && !on; a++) if (a * a + b * b <= rad * rad && at(i + a, j + b)) on = 1;
      if (!on && drip[i]) for (b = 1; b <= drip[i]; b++) if (at(i, j - b) && !at(i, j - b + 1)) on = 1;
      g[j * C + i] = on ? 1 : 0;
    }
    var edge = '', r = cell * 0.62;
    for (j = 0; j < Rr; j++) for (i = 0; i < C; i++) { if (!g[j * C + i]) continue; var e = (i === 0 || !g[j * C + i - 1]) || (i === C - 1 || !g[j * C + i + 1]) || (j === 0 || !g[(j - 1) * C + i]) || (j === Rr - 1 || !g[(j + 1) * C + i]); if (e) edge += this.circ((i + 0.5) * cell, (j + 0.5) * cell, r); }
    return { fill: this.runs(g, C, Rr, cell, 1), edge: edge };
  }
  glyph(ch, mode, o) {
    o = o || {}; var gl = this._gl || {}, ink = o.ink || '#0B0B0B', col = o.color || '#A6FF00';
    var raster = { pixel: 1, dots: 1, outline: 1, noise: 1, warp: 1, melt: 1, block: 1 };
    if (raster[mode] && !gl[ch]) mode = mode === 'melt' ? 'contour' : 'wide';
    var L = { ch: ch, d: '', d2: '', c1: ink, c2: 'none', tfill: 'none', tstroke: 'none', tsw: '0', font: 'Archivo, sans-serif', fstyle: 'normal', weight: '900', stretch: '62%', size: '300' };
    if (mode === 'melt') { L.d2 = gl[ch].melt.fill; L.c2 = col; L.d = gl[ch].melt.edge; }
    else if (mode === 'block') { L.d2 = 'M14 26h172v228h-172z'; L.c2 = col; L.d = gl[ch].pixel; L.c1 = o.blockInk || '#F7F7F5'; }
    else if (raster[mode]) { L.d = gl[ch][mode]; if (o.rasterColor) L.c1 = o.rasterColor; }
    else if (mode === 'contour') { L.tfill = col; L.tstroke = ink; L.tsw = '16'; }
    else if (mode === 'outlined') { L.tstroke = ink; L.tsw = '5'; }
    else if (mode === 'goth') { L.tfill = o.textColor || ink; L.font = 'Grenze Gotisch, serif'; L.weight = '800'; L.stretch = 'normal'; L.size = '290'; }
    else if (mode === 'gothc') { L.tfill = col; L.tstroke = ink; L.tsw = '12'; L.font = 'Grenze Gotisch, serif'; L.weight = '900'; L.stretch = 'normal'; L.size = '290'; }
    else if (mode === 'serif') { L.tfill = o.textColor || ink; L.font = 'Instrument Serif, serif'; L.fstyle = 'italic'; L.weight = '400'; L.stretch = 'normal'; L.size = '330'; }
    else if (mode === 'serifc') { L.tfill = col; L.tstroke = ink; L.tsw = '10'; L.font = 'Instrument Serif, serif'; L.fstyle = 'italic'; L.weight = '400'; L.stretch = 'normal'; L.size = '330'; }
    else { L.tfill = o.textColor || ink; L.stretch = '125%'; L.size = '220'; }
    return L;
  }
  word(str, x, y, w, modes, o, seed, jit) {
    o = o || {}; jit = jit || {}; var self = this, out = [], cx = x, r = this.rng(seed || 1), adv = { wide: 0.88, serif: 0.5, serifc: 0.52, goth: 0.6, gothc: 0.62, block: 0.86 };
    str.split('').forEach(function (ch, i) {
      var j1 = r(), j2 = r(), j3 = r();
      if (ch === ' ') { cx += w * 0.32; return; }
      var mode = typeof modes === 'function' ? modes(i, ch) : modes[i % modes.length];
      var L = self.glyph(ch, mode, o), sc = 1 + (j3 - 0.5) * (jit.s || 0), lw = w * sc;
      var dy = (j1 - 0.5) * (jit.y || 0), rot = (j2 - 0.5) * (jit.r || 0);
      var f = adv[mode] || 0.62; if ('iljI1!.,:;t'.indexOf(ch) >= 0) f *= 0.62; if ('mwMW'.indexOf(ch) >= 0) f *= 1.3;
      L.lx = Math.round(cx / 14 * 100) / 100; L.ly = Math.round((y + dy) / 4.2 * 100) / 100; L.lw = Math.round(lw / 14 * 100) / 100; L.rot = Math.round(rot * 10) / 10;
      out.push(L); cx += lw * f;
    });
    return out;
  }
  starRow(x0, x1, y, step, ro, ri) { var d = '', x, i; for (x = x0; x <= x1; x += step) { for (i = 0; i < 16; i++) { var rr = i % 2 ? ri : ro, t = i / 16 * 6.2832; d += (i ? 'L' : 'M') + (Math.round((x + rr * Math.cos(t)) * 10) / 10) + ' ' + (Math.round((y + rr * Math.sin(t)) * 10) / 10); } d += 'Z'; } return d; }
  scribble(x, y, w, h, n, seed) { var r = this.rng(seed), d = 'M' + x + ' ' + (y + h / 2), i; for (i = 0; i < n; i++) { d += ' L' + Math.round(x + (i + 1) / n * w) + ' ' + Math.round(y + r() * h); } return d; }
  banners(seed, tick, accent) {
    var self = this, mut = function (base, alts, idx, len) { return function (i, ch) { return ((tick + idx * 3) % len) === i ? alts[(tick + i) % alts.length] : base[i % base.length]; }; };
    var A = ['pixel', 'noise', 'warp', 'dots', 'outline', 'serif', 'goth', 'wide'];
    return {
      b1: [].concat(
        this.word('F', 20, 34, 214, ['goth'], {}, seed + 1),
        this.word('A', 150, 34, 214, mut(['contour'], A, 0, 1), { color: '#FF2A1A' }, seed + 2),
        this.word('T', 272, 30, 220, mut(['pixel'], A, 1, 1), {}, seed + 3),
        this.word('sound', 478, 112, 110, mut(['noise', 'warp', 'outline', 'pixel', 'dots'], A, 2, 5), {}, seed + 4, { y: 26, r: 8 }),
        this.word('spreads', 966, 76, 96, mut(['warp', 'goth', 'warp', 'serif', 'warp', 'pixel', 'warp'], A, 3, 7), {}, seed + 5, { y: 18, r: 4 })),
      b2: [].concat(
        this.word('Noise', 22, 128, 196, mut(['contour', 'contour', 'gothc', 'contour', 'contour'], ['pixel', 'warp', 'noise'], 0, 5), { color: '#A6FF00' }, seed + 6, { y: 34, r: 10, s: 0.18 }),
        this.word('IS', 560, 214, 92, ['contour'], { color: '#A6FF00' }, seed + 7, { y: 10, r: 6 }),
        this.word('the', 660, 254, 72, ['serif'], {}, seed + 8, { y: 20, r: 18 }),
        this.word('new', 760, 30, 120, mut(['contour', 'gothc', 'contour'], ['warp', 'pixel'], 1, 3), { color: '#A6FF00' }, seed + 9, { y: 14, r: 8 }),
        this.word('carrier', 950, 34, 90, mut(['contour', 'goth', 'contour', 'warp', 'contour', 'serifc', 'contour'], ['pixel', 'noise'], 2, 7), { color: '#A6FF00' }, seed + 10, { y: 26, r: 10 })),
      b3: this.word('catch it!', 110, 40, 120, mut(['wide', 'serifc', 'contour', 'goth', 'pixel', 'wide', 'dots', 'contour'], A, 0, 9), { color: '#F7F7F5' }, seed + 11, { y: 150, r: 26, s: 0.3 }),
      b4: [].concat(
        this.word('s', 150, 96, 156, mut(['pixel'], A, 0, 1), { rasterColor: '#FF2DB4' }, seed + 12),
        this.word('p', 256, 96, 156, mut(['outline'], A, 1, 1), { rasterColor: '#FF2DB4' }, seed + 13),
        this.word('r', 352, 70, 156, ['serifc'], { color: '#FF2DB4' }, seed + 14),
        this.word('e', 446, 96, 156, mut(['dots'], A, 2, 1), { rasterColor: '#0B0B0B' }, seed + 15),
        this.word('a', 560, 60, 150, ['block'], { color: '#2B44FF' }, seed + 16),
        this.word('d', 700, 96, 156, mut(['contour'], A, 3, 1), { color: '#FF2DB4' }, seed + 17)),
      b5: this.word('INFECTED', 96, 96, 158, mut(['melt'], ['melt', 'noise', 'warp'], 0, 8), { color: '#FFE800' }, seed + 18, { y: 22, r: 7, s: 0.12 }),
      b6: [].concat(
        this.word('c', 10, 18, 318, mut(['noise'], ['pixel', 'warp', 'dots'], 0, 1), {}, seed + 19),
        this.word('arrier', 236, 118, 172, mut(['warp', 'warp', 'pixel', 'warp', 'warp', 'warp'], ['noise', 'goth', 'serif'], 1, 6), {}, seed + 20, { y: 18, r: 5 }),
        this.word('no.7', 1080, 184, 118, mut(['warp', 'warp', 'pixel', 'contour'], ['noise'], 2, 4), { rasterColor: '#A6FF00', color: '#A6FF00', ink: '#0B0B0B' }, seed + 21, { y: 14, r: 10 })),
      stars: this.starRow(30, 1370, 18, 30, 11, 5), scr1: this.scribble(250, 60, 300, 70, 26, seed + 30), scr2: this.scribble(300, 110, 230, 50, 20, seed + 31)
    };
  }
