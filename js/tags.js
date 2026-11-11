/* ABSTRUCT — track-record tags: paperboard tags hung on a rope.
   One template, mounted into every [data-tags] host (home hero, about). */
(function () {
  'use strict';
  var ABS = window.ABS = window.ABS || {};

  var TAGS = [
    { k: 'Experience', no: '01', n: 15, suf: '+', unit: 'years on site', viz: ['rule', 15], cap: '1 tick = 1 year', r: '.9deg' },
    { k: 'Delivered', no: '02', n: 250, suf: '+', unit: 'projects completed', viz: ['holes', 25], cap: '1 punched hole = 10 projects', r: '-.7deg' },
    { k: 'Satisfied', no: '03', n: 98, suf: '%', unit: 'client satisfaction', viz: ['bars', 50], cap: '1 tick = 2%', r: '1.2deg', red: true }
  ];

  function template() {
    var o = '<ul class="boards rv" style="--d:.6s" aria-label="ABSTRUCT track record">' +
      '<li class="tag tag--ink" style="--r:-1.1deg;--i:0"><div class="tag__shape"><div class="tag__liner"></div><i class="tag__hole"></i><div class="tag__in">' +
        '<span class="tag__k">Track record</span><span class="tag__mark light-wide">Abstruct</span><span class="tag__cap">Rev. 2026</span></div></div></li>';
    TAGS.forEach(function (t, i) {
      o += '<li class="tag" style="--r:' + t.r + ';--i:' + (i + 1) + '"><div class="tag__shape"><div class="tag__liner"></div><i class="tag__hole"></i><div class="tag__in">' +
        '<span class="tag__k">' + t.k + ' <b>No. ' + t.no + '</b></span>' +
        '<b class="tag__n' + (t.red ? ' tag__n--red' : '') + '"><span data-count="' + t.n + '" data-suffix="' + t.suf + '">' + t.n + t.suf + '</span></b>' +
        '<span class="tag__u">' + t.unit + '</span>' +
        '<span class="tag__viz" data-kind="' + t.viz[0] + '" data-n="' + t.viz[1] + '" aria-hidden="true"></span>' +
        '<span class="tag__cap">' + t.cap + '</span></div></div></li>';
    });
    return o + '</ul>' +
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="ink" x="-6%" y="-6%" width="112%" height="112%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" result="n"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.7" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="9" result="n2"/>' +
      '<feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 6.3" result="speck"/>' +
      '<feComposite in="d" in2="speck" operator="in"/></filter></svg>';
  }

  function mount(host) {
    host.innerHTML = template();
    host.querySelectorAll('.tag__viz').forEach(function (v) {
      var n = +v.dataset.n, kind = v.dataset.kind, html = '';
      for (var i = 0; i < n; i++) {
        var cls = kind === 'rule' && (i + 1) % 5 === 0 ? ' class="is-major"' : kind === 'bars' && i === n - 1 ? ' class="is-open"' : '';
        html += '<i' + cls + ' style="--i:' + i + '"></i>';
      }
      v.innerHTML = html;
    });
    host.querySelectorAll('.tag').forEach(function (tag, k) {
      tag.addEventListener('animationend', function (e) { if (e.animationName === 'swing') tag.classList.add('is-settled'); });
      if (tag.classList.contains('tag--ink')) return;
      /* torn top liner: a jagged edge that exposes the corrugated board underneath */
      var seed = (k + 3) * 9301 % 233, rand = function () { seed = (seed * 131 + 17) % 509; return seed / 509; };
      var y = function () { return (88 + rand() * 5).toFixed(1) + '%'; };
      var pts = ['10% 0', '90% 0', '100% 12%', '100% ' + y()];
      for (var x = 96; x >= 4; x -= 4) pts.push(x + '% ' + y());
      pts.push('0 ' + y(), '0 12%');
      tag.querySelector('.tag__liner').style.clipPath = 'polygon(' + pts.join(',') + ')';
    });
  }
  ABS.mountTags = mount;
  document.querySelectorAll('[data-tags]').forEach(mount);
})();
