/* ABSTRUCT — blueprint renderer.
   Turns traced linework (js/blueprints.js) into a drawing sheet: frame, grid bubbles, chain + overall dimensions,
   level markers, callouts and a title block. Dimensions, levels and notes below are PLACEHOLDER values. */
(function () {
  'use strict';
  var ABS = window.ABS = window.ABS || {};
  var uid = 0;

  /* box = building bounds in the 1280x1024 photo space. w/h in mm. levels: [fraction of height, label].
     calls: leader target (x,y), label top-left (lx,ly), text lines, red = marks the red element. */
  var CONF = {
    'halden-exchange': { box: [420, 10, 905, 940], w: 38400, h: 46800, bays: 4, scale: '1:200', view: 'East elevation',
      levels: [[0, '+0.00'], [0.5, '+23.40'], [1, '+46.80']],
      calls: [{ x: 700, y: 250, lx: 950, ly: 160, t: ['Board-formed concrete', 'frame, 19 mm boards'] }, { x: 492, y: 735, lx: 950, ly: 700, t: ['Signal red panel', 'RAL 3020'], red: 1 }] },
    'tallis-house': { box: [10, 100, 1270, 920], w: 31000, h: 22500, bays: 5, scale: '1:200', view: 'West elevation',
      levels: [[0, '+0.00'], [0.62, '+14.00'], [1, '+22.50']],
      calls: [{ x: 870, y: 325, lx: 640, ly: 22, t: ['Signal red panel', 'RAL 3020'], red: 1 }, { x: 320, y: 600, lx: 70, ly: 22, t: ['Retained 1930s', 'brick facade'] }] },
    'corvin-yard': { box: [60, 170, 1280, 700], w: 64000, h: 17400, bays: 5, scale: '1:400', view: 'South elevation',
      levels: [[0, '+0.00'], [0.55, '+9.60'], [1, '+17.40']],
      calls: [{ x: 1070, y: 330, lx: 800, ly: 40, t: ['Signal red panel', 'RAL 3020'], red: 1 }, { x: 420, y: 520, lx: 100, ly: 40, t: ['Retail arcade', 'over rail cutting'] }] },
    'ashgrove-residences': { box: [250, 146, 1280, 830], w: 11800, h: 9600, bays: 4, scale: '1:100', view: 'Front elevation',
      levels: [[0, '+0.00'], [0.5, '+4.80'], [1, '+9.60']],
      calls: [{ x: 1112, y: 300, lx: 760, ly: 30, t: ['Signal red reveal', 'RAL 3020'], red: 1 }, { x: 640, y: 300, lx: 300, ly: 30, t: ['Board-formed concrete', 'party wall rated'] }] },
    'the-ledger-building': { box: [100, 120, 1230, 930], w: 36000, h: 19500, bays: 4, scale: '1:200', view: 'South-west elevation',
      levels: [[0, '+0.00'], [0.5, '+9.75'], [1, '+19.50']],
      calls: [{ x: 864, y: 372, lx: 860, ly: 28, t: ['Signal red panel', 'RAL 3020'], red: 1 }, { x: 340, y: 330, lx: 130, ly: 28, t: ['Exposed RC frame,', '250 mm slabs'] }] },
    'brannock-works': { box: [0, 10, 1260, 670], w: 152400, h: 14200, bays: 6, scale: '1:1000', view: 'Entrance elevation',
      levels: [[0, '+0.00'], [1, '+14.20']],
      calls: [{ x: 250, y: 350, lx: 560, ly: 230, t: ['Signal red canopy', 'RAL 3020'], red: 1 }, { x: 1000, y: 520, lx: 930, ly: 110, t: ['Loading docks x 14'] }] },
    'pell-street-lofts': { box: [50, 20, 1250, 880], w: 27500, h: 21000, bays: 5, scale: '1:200', view: 'East elevation',
      levels: [[0, '+0.00'], [0.62, '+13.00'], [1, '+21.00']],
      calls: [{ x: 790, y: 790, lx: 870, ly: 640, t: ['Signal red door', 'RAL 3020'], red: 1 }, { x: 700, y: 70, lx: 930, ly: 30, t: ['Saw-tooth glazed', 'roof extension'] }] },
    'north-quay-library': { box: [10, 160, 1250, 640], w: 58000, h: 14800, bays: 5, scale: '1:200', view: 'River elevation',
      levels: [[0, '+0.00'], [0.28, '+3.20'], [1, '+14.80']],
      calls: [{ x: 306, y: 370, lx: 90, ly: 40, t: ['Signal red panel', 'RAL 3020'], red: 1 }, { x: 940, y: 560, lx: 700, ly: 800, t: ['Concrete piers,', 'floor above flood level'] }] }
  };

  var f = function (n) { return (Math.round(n * 10) / 10).toString(); };
  var mm = function (n) { return String(Math.round(n / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };

  function tick(x, y, vertical) { /* architectural slash tick */
    return vertical ? 'M' + f(x - 7) + ' ' + f(y + 7) + 'L' + f(x + 7) + ' ' + f(y - 7) : 'M' + f(x - 7) + ' ' + f(y + 7) + 'L' + f(x + 7) + ' ' + f(y - 7);
  }

  ABS.blueprint = function (p) {
    var c = CONF[p.slug], d = ABS.bpData && ABS.bpData[p.slug];
    if (!c || !d) return '';
    var id = 'bp' + (++uid), x0 = c.box[0], y0 = c.box[1], x1 = c.box[2], y1 = c.box[3], bw = x1 - x0, bh = y1 - y0;
    var j = 0, o = '<svg class="bp" viewBox="-130 -110 1540 1334" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Technical blueprint elevation of ' + esc(p.name) + ' with dimensions">';
    o += '<defs><pattern id="' + id + 'h" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#C31C18" stroke-width="2"/></pattern></defs>';

    /* sheet frame */
    o += '<rect class="fr" x="-120" y="-100" width="1520" height="1314"/><rect class="fr2" x="-110" y="-90" width="1500" height="1294"/>';

    /* grid bubbles + centre lines */
    var gl = '', gb = '';
    for (var i = 0; i <= c.bays; i++) {
      var gx = x0 + (bw * i) / c.bays;
      gl += '<path class="gl" style="--j:' + (j++) + '" d="M' + f(gx) + ' -34V' + f(y1 + 14) + '"/>';
      gb += '<g class="fd" style="--j:' + (j++) + '"><circle class="bub" cx="' + f(gx) + '" cy="-54" r="21"/><text class="tx c" x="' + f(gx) + '" y="-47" text-anchor="middle">' + (i + 1) + '</text></g>';
    }
    o += gl + gb;

    /* traced linework */
    var k = 0;
    d.light.forEach(function (dd) { o += '<path class="ln l" pathLength="1" style="--i:' + (k++ % 14) + '" d="' + dd + '"/>'; });
    d.heavy.forEach(function (dd, n) { o += '<path class="ln h" pathLength="1" style="--i:' + n + '" d="' + dd + '"/>'; });
    d.red.forEach(function (poly) { o += '<polygon class="rd fd" style="--j:' + (j++) + '" fill="url(#' + id + 'h)" points="' + poly.map(function (q) { return q[0] + ',' + q[1]; }).join(' ') + '"/>'; });

    /* dimensions: chain (per bay) + overall below, height at left */
    var dy1 = y1 + 58, dy2 = y1 + 112, dx = x0 - 62, dm = '';
    dm += '<path class="dr" pathLength="1" style="--j:' + (j++) + '" d="M' + f(x0) + ' ' + f(dy1) + 'H' + f(x1);
    for (i = 0; i <= c.bays; i++) dm += tick(x0 + (bw * i) / c.bays, dy1);
    dm += '"/><path class="dr" pathLength="1" style="--j:' + (j++) + '" d="M' + f(x0) + ' ' + f(dy2) + 'H' + f(x1) + tick(x0, dy2) + tick(x1, dy2) + '"/>';
    dm += '<path class="dr ex" pathLength="1" style="--j:' + (j++) + '" d="M' + f(x0) + ' ' + f(y1 + 10) + 'V' + f(dy2 + 12) + 'M' + f(x1) + ' ' + f(y1 + 10) + 'V' + f(dy2 + 12) + '"/>';
    dm += '<path class="dr" pathLength="1" style="--j:' + (j++) + '" d="M' + f(dx) + ' ' + f(y0) + 'V' + f(y1) + tick(dx, y0) + tick(dx, y1) + '"/>';
    dm += '<path class="dr ex" pathLength="1" style="--j:' + (j++) + '" d="M' + f(x0 - 10) + ' ' + f(y0) + 'H' + f(dx - 12) + 'M' + f(x0 - 10) + ' ' + f(y1) + 'H' + f(dx - 12) + '"/>';
    o += dm;
    var dt = '';
    for (i = 0; i < c.bays; i++) dt += '<text class="tx sm" x="' + f(x0 + (bw * (i + 0.5)) / c.bays) + '" y="' + f(dy1 - 9) + '" text-anchor="middle">' + mm(c.w / c.bays) + '</text>';
    dt += '<text class="tx" x="' + f((x0 + x1) / 2) + '" y="' + f(dy2 - 10) + '" text-anchor="middle">' + mm(c.w) + '</text>';
    dt += '<text class="tx" transform="translate(' + f(dx - 12) + ' ' + f((y0 + y1) / 2) + ') rotate(-90)" text-anchor="middle">' + mm(c.h) + '</text>';
    o += '<g class="fd" style="--j:' + (j++) + '">' + dt + '</g>';

    /* level markers */
    var lx = Math.min(x1 + 46, 1318), lv = '';
    c.levels.forEach(function (L) {
      var ly = y1 - L[0] * bh;
      lv += '<path class="gl2" d="M' + f(x1) + ' ' + f(ly) + 'H' + f(lx + 12) + '"/><path class="lvl" d="M' + f(lx) + ' ' + f(ly) + 'l-11 -16h22z"/><text class="tx sm" x="' + f(lx + 18) + '" y="' + f(ly - 5) + '">' + L[1] + '</text>';
    });
    o += '<g class="fd" style="--j:' + (j++) + '">' + lv + '</g>';

    /* callouts */
    c.calls.forEach(function (cl) {
      var w = Math.max.apply(null, cl.t.map(function (s) { return s.length; })) * 9.6 + 24, h = cl.t.length * 24 + 14;
      var ex = cl.lx + w / 2, ey = cl.ly + h / 2 < cl.y ? cl.ly + h : cl.ly;
      o += '<path class="dr" pathLength="1" style="--j:' + (j++) + '" d="M' + f(cl.x) + ' ' + f(cl.y) + 'L' + f(ex) + ' ' + f(ey) + '"/>';
      o += '<g class="fd" style="--j:' + (j++) + '"><circle class="dot' + (cl.red ? ' r' : '') + '" cx="' + f(cl.x) + '" cy="' + f(cl.y) + '" r="5.5"/><rect class="box" x="' + f(cl.lx) + '" y="' + f(cl.ly) + '" width="' + f(w) + '" height="' + f(h) + '"/>';
      o += cl.t.map(function (s, n) { return '<text class="tx sm" x="' + f(cl.lx + 12) + '" y="' + f(cl.ly + 26 + n * 24) + '">' + esc(s) + '</text>'; }).join('') + '</g>';
    });

    /* notes + title block */
    var tb = { x: 760, y: 1066, w: 620, h: 130 };
    o += '<g class="fd" style="--j:' + (j++) + '"><text class="tx sm" x="-100" y="1096" font-weight="700" letter-spacing="2">NOTES</text>' +
      '<text class="tx sm" x="-100" y="1122">1. Dimensions in millimetres; levels in metres to site datum.</text>' +
      '<text class="tx sm" x="-100" y="1146">2. Linework traced from site photography.</text>' +
      '<text class="tx sm" x="-100" y="1170" font-weight="700">ISSUED FOR INFORMATION. NOT FOR CONSTRUCTION.</text></g>';
    var sheet = 'A-0' + (ABS.projects.indexOf(p) + 1);
    o += '<g class="tb"><rect class="fr2" x="' + tb.x + '" y="' + tb.y + '" width="' + tb.w + '" height="' + tb.h + '"/>' +
      '<path class="fr2" d="M' + tb.x + ' ' + (tb.y + 78) + 'H' + (tb.x + tb.w) + 'M' + (tb.x + 110) + ' ' + (tb.y + 78) + 'V' + (tb.y + tb.h) + 'M' + (tb.x + 230) + ' ' + (tb.y + 78) + 'V' + (tb.y + tb.h) + 'M' + (tb.x + 340) + ' ' + (tb.y + 78) + 'V' + (tb.y + tb.h) + '"/>' +
      '<text class="tx sm" x="' + (tb.x + 16) + '" y="' + (tb.y + 26) + '" letter-spacing="4">ABSTRUCT CONSTRUCTION</text>' +
      '<text class="tx big" x="' + (tb.x + 16) + '" y="' + (tb.y + 62) + '">' + esc(p.name.toUpperCase()) + '</text>' +
      [['SCALE', c.scale, 0], ['SHEET', sheet, 110], ['DATE', p.year, 230], ['DRAWING', c.view.toUpperCase(), 340]].map(function (r) {
        return '<text class="tx xs" x="' + (tb.x + r[2] + 14) + '" y="' + (tb.y + 98) + '" opacity=".65">' + r[0] + '</text><text class="tx sm" x="' + (tb.x + r[2] + 14) + '" y="' + (tb.y + 119) + '" font-weight="700">' + r[1] + '</text>';
      }).join('') + '</g>';
    return o + '</svg>';
  };
})();
