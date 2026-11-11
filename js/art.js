/* ABSTRUCT — art: seeded concrete-building generator.
   Same layout can be drawn as a "render" (concrete volumes + red plane) or a "blueprint" (line-draw + dimensions). */
(function () {
  'use strict';
  var ABS = window.ABS = window.ABS || {};

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var C = { front: '#B9B6AE', side: '#76746E', top: '#D9D5CC', dark: '#1B1B1A', hi: 'rgba(255,255,255,.38)', joint: 'rgba(17,17,17,.14)', hole: 'rgba(17,17,17,.34)', red: '#C31C18', ivory: '#EBE5DC' };
  var STYLES = ['slits', 'grid', 'fins', 'solid', 'solid', 'grid'];
  var M = 0.11; // metres per drawing unit, for dimension labels

  function bounds(vols) {
    var b = { x0: 1e9, x1: -1e9, y0: 1e9 };
    vols.forEach(function (v) {
      b.x0 = Math.min(b.x0, v.x); b.x1 = Math.max(b.x1, v.x + v.w + v.dx); b.y0 = Math.min(b.y0, v.y + v.dy);
    });
    return b;
  }

  /* Seeded composition: a base volume, then volumes beside it or cantilevered on top. */
  function layout(seed) {
    var r = rng(seed), W = 640, H = 560, G = 500, vols = [], prev = null;
    var n = 3 + Math.floor(r() * 2);
    for (var i = 0; i < n; i++) {
      var w = Math.round(110 + r() * 140), h = Math.round(120 + r() * 200), v;
      if (!prev) v = { x: 60, y: G - h, w: w, h: h };
      else if (r() < 0.5) {
        w = Math.round(prev.w * (0.85 + r() * 0.6)); h = Math.round(70 + r() * 90);
        v = { x: prev.x + Math.round(prev.w * (0.2 + r() * 0.45)), y: prev.y - h, w: w, h: h };
      } else v = { x: prev.x + prev.w + 10 + Math.round(r() * 26), y: G - h, w: w, h: h };
      v.s = STYLES[Math.floor(r() * STYLES.length)];
      v.dx = Math.round(26 + r() * 24); v.dy = -Math.round(v.dx * 0.6);
      vols.push(v); prev = v;
    }
    var b = bounds(vols);
    var s = Math.min((W - 110) / (b.x1 - b.x0), (G - 70) / (G - b.y0), 1.4);
    var tf = { s: s, tx: (W - (b.x1 - b.x0) * s) / 2 - b.x0 * s, ty: G * (1 - s) };
    return { seed: seed, W: W, H: H, G: G, vols: vols, tf: tf, variant: r() < 0.5 ? 0 : 1 };
  }

  /* Hand-composed hero: tall slit tower, cantilevered box, low plinth and a gridded wing. */
  function hero() {
    var vols = [
      { x: 470, y: 450, w: 130, h: 190, s: 'grid', dx: 36, dy: -22 },
      { x: 30, y: 500, w: 200, h: 140, s: 'solid', dx: 40, dy: -24 },
      { x: 210, y: 330, w: 250, h: 310, s: 'slits', dx: 44, dy: -26 },
      { x: 140, y: 214, w: 410, h: 116, s: 'solid', dx: 44, dy: -26 }
    ];
    return { seed: 0, W: 640, H: 700, G: 640, vols: vols, tf: { s: 1, tx: 0, ty: 0 }, variant: 0, hero: true };
  }

  function pts(a) { return a.join(' '); }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }

  function frontDetail(v) {
    var x = v.x, y = v.y, w = v.w, h = v.h, o = '', i, j;
    if (v.s === 'slits') {
      var rows = Math.max(2, Math.floor((h - 26) / 26));
      var gap = (h - 20) / rows;
      for (i = 0; i < rows; i++) {
        o += '<rect x="' + (x + 12) + '" y="' + f1(y + 14 + i * gap) + '" width="' + (w - 24) + '" height="6" fill="' + C.dark + '"/>';
        o += '<rect x="' + (x + 12) + '" y="' + f1(y + 20 + i * gap) + '" width="' + (w - 24) + '" height="1.6" fill="' + C.hi + '"/>';
      }
    } else if (v.s === 'grid') {
      var cols = Math.max(2, Math.floor((w - 16) / 38)), rws = Math.max(1, Math.floor((h - 20) / 50));
      var gx = (w - cols * 20) / (cols + 1), gy = (h - rws * 32) / (rws + 1);
      for (i = 0; i < cols; i++) for (j = 0; j < rws; j++) {
        var px = x + gx + i * (20 + gx), py = y + gy + j * (32 + gy);
        o += '<rect x="' + f1(px) + '" y="' + f1(py) + '" width="20" height="32" fill="' + C.dark + '"/>';
        o += '<rect x="' + f1(px) + '" y="' + f1(py + 32) + '" width="20" height="1.8" fill="' + C.hi + '"/>';
      }
    } else if (v.s === 'fins') {
      for (i = 0; x + 8 + i * 13 < x + w - 6; i++) o += '<rect x="' + (x + 8 + i * 13) + '" y="' + y + '" width="4.5" height="' + h + '" fill="rgba(17,17,17,.2)"/>';
      o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="10" fill="rgba(17,17,17,.28)"/>';
    } else {
      for (i = 1; i * 64 < w; i++) o += '<rect x="' + (x + i * 64) + '" y="' + y + '" width="1.2" height="' + h + '" fill="' + C.joint + '"/>';
      for (j = 1; j * 48 < h; j++) o += '<rect x="' + x + '" y="' + (y + j * 48) + '" width="' + w + '" height="1.2" fill="' + C.joint + '"/>';
      for (i = 0; i * 64 + 64 <= w + 32; i++) for (j = 0; j * 48 + 48 <= h + 24; j++) {
        var hx = x + i * 64 + 14, hy = y + j * 48 + 12;
        if (hx < x + w - 8 && hy < y + h - 8) o += '<circle cx="' + hx + '" cy="' + hy + '" r="1.8" fill="' + C.hole + '"/>';
      }
    }
    return o;
  }

  function renderVol(v, i, G) {
    var x = v.x, y = v.y, w = v.w, h = v.h, dx = v.dx, dy = v.dy;
    var o = '<g class="blk" style="--i:' + i + ';--dep:' + (6 + i * 5) + '">';
    o += '<polygon points="' + pts([x + w, y, x + w + dx, y + dy, x + w + dx, y + h + dy, x + w, y + h]) + '" fill="' + C.side + '"/>';
    o += '<polygon points="' + pts([x, y, x + dx, y + dy, x + w + dx, y + dy, x + w, y]) + '" fill="' + C.top + '"/>';
    o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + C.front + '"/>';
    o += frontDetail(v);
    if (y + h >= G - 1) o += '<rect x="' + f1(x + w * 0.18) + '" y="' + (y + h - 46) + '" width="28" height="46" fill="' + C.dark + '"/>';
    return o + '</g>';
  }

  function plane(L) {
    var W = L.W, H = L.H;
    var p = L.hero ? [W * 0.28, 0, W, 0, W, H * 0.62] : L.variant ? [W * 0.34, 0, W, 0, W, H * 0.72] : [0, 0, W, 0, W, H * 0.3, 0, H * 0.62];
    return p;
  }

  /* concrete render */
  function render(L, opt) {
    opt = opt || {};
    var o = '<svg class="art art--render" viewBox="0 0 ' + L.W + ' ' + L.H + '" role="img" aria-label="' + (opt.label || 'Concrete building elevation with a red plane behind') + '" preserveAspectRatio="xMidYMax meet">';
    if (opt.plane !== false && !L.hero) o += '<polygon class="plane" points="' + pts(plane(L)) + '" fill="' + C.red + '"/>';
    o += '<g transform="translate(' + f1(L.tf.tx) + ' ' + f1(L.tf.ty) + ') scale(' + L.tf.s.toFixed(3) + ')">';
    L.vols.forEach(function (v, i) { o += renderVol(v, i, L.G); });
    o += '</g>';
    o += '<rect class="ground" x="-40" y="' + L.G + '" width="' + (L.W + 80) + '" height="' + (L.H - L.G + 40) + '" fill="rgba(17,17,17,.10)"/>';
    o += '<rect x="-40" y="' + L.G + '" width="' + (L.W + 80) + '" height="2" fill="' + C.dark + '"/>';
    return o + '</svg>';
  }

  /* line-draw blueprint with dimensions */
  function blueprint(L, opt) {
    opt = opt || {};
    var s = L.tf.s, sw = (1.4 / s).toFixed(2), n = 0, b = bounds(L.vols);
    function sx(x) { return L.tf.tx + x * s; }
    function sy(y) { return L.tf.ty + y * s; }
    function p(d, extra) { return '<path d="' + d + '" pathLength="1" style="--i:' + (n++) + '"' + (extra || '') + '/>'; }
    var o = '<svg class="art art--blue" viewBox="0 0 ' + L.W + ' ' + L.H + '" role="img" aria-label="' + (opt.label || 'Blueprint elevation with dimensions') + '" preserveAspectRatio="xMidYMax meet">';
    if (opt.plane !== false && !L.hero) {
      var pp = plane(L), d = 'M' + pp[0] + ',' + pp[1];
      for (var k = 2; k < pp.length; k += 2) d += 'L' + pp[k] + ',' + pp[k + 1];
      o += '<path class="bp-plane" d="' + d + 'Z" pathLength="1" style="--i:0"/>';
    }
    o += '<g transform="translate(' + f1(L.tf.tx) + ' ' + f1(L.tf.ty) + ') scale(' + s.toFixed(3) + ')" fill="none" stroke="' + C.ivory + '" stroke-width="' + sw + '" stroke-linejoin="round">';
    L.vols.forEach(function (v) {
      var x = v.x, y = v.y, w = v.w, h = v.h, dx = v.dx, dy = v.dy, i, j;
      o += p('M' + x + ',' + y + 'h' + w + 'v' + h + 'h' + (-w) + 'Z');
      o += p('M' + x + ',' + y + 'l' + dx + ',' + dy + 'h' + w + 'l' + (-dx) + ',' + (-dy));
      o += p('M' + (x + w) + ',' + (y + h) + 'l' + dx + ',' + dy + 'v' + (-h));
      var det = '';
      if (v.s === 'slits') { for (i = 0; i < Math.floor((h - 26) / 26); i++) det += 'M' + (x + 12) + ',' + (y + 17 + i * 26) + 'h' + (w - 24); }
      else if (v.s === 'grid') {
        var cols = Math.max(2, Math.floor((w - 16) / 38)), rws = Math.max(1, Math.floor((h - 20) / 50));
        var gx = (w - cols * 20) / (cols + 1), gy = (h - rws * 32) / (rws + 1);
        for (i = 0; i < cols; i++) for (j = 0; j < rws; j++) det += 'M' + f1(x + gx + i * (20 + gx)) + ',' + f1(y + gy + j * (32 + gy)) + 'h20v32h-20Z';
      } else if (v.s === 'fins') { for (i = 0; x + 8 + i * 13 < x + w - 6; i++) det += 'M' + (x + 8 + i * 13) + ',' + y + 'v' + h; }
      else { for (i = 1; i * 64 < w; i++) det += 'M' + (x + i * 64) + ',' + y + 'v' + h; for (j = 1; j * 48 < h; j++) det += 'M' + x + ',' + (y + j * 48) + 'h' + w; }
      if (det) o += p(det, ' stroke-opacity=".55"');
    });
    o += '</g>';
    o += p('M-40,' + L.G + 'H' + (L.W + 40), ' stroke="' + C.ivory + '" stroke-width="1.6" fill="none"');
    /* dimensions in screen space */
    var left = sx(b.x0), right = sx(b.x1), top = sy(b.y0), dimY = L.G + 34, dimX = Math.min(L.W - 26, right + 34);
    var g = '<g class="dims" fill="none" stroke="' + C.ivory + '" stroke-width="1" stroke-opacity=".8">';
    g += '<path d="M' + f1(left) + ',' + dimY + 'H' + f1(right) + 'M' + f1(left) + ',' + (dimY - 6) + 'v12M' + f1(right) + ',' + (dimY - 6) + 'v12" pathLength="1" style="--i:' + (n++) + '"/>';
    g += '<path d="M' + f1(dimX) + ',' + f1(top) + 'V' + L.G + 'M' + (dimX - 6) + ',' + f1(top) + 'h12M' + (dimX - 6) + ',' + L.G + 'h12" pathLength="1" style="--i:' + (n++) + '"/>';
    g += '</g>';
    g += '<text class="dim-t" x="' + f1((left + right) / 2) + '" y="' + (dimY + 20) + '" text-anchor="middle">' + f1((b.x1 - b.x0) * M) + ' m</text>';
    g += '<text class="dim-t" transform="translate(' + (dimX + 16) + ' ' + f1((top + L.G) / 2) + ') rotate(90)" text-anchor="middle">' + f1((L.G - b.y0) * M) + ' m</text>';
    return o + g + '</svg>';
  }

  ABS.art = { layout: layout, hero: hero, render: render, blueprint: blueprint };
})();
