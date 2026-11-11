/* ABSTRUCT — projects page: filter, blueprint hover, dossier overlay */
(function () {
  'use strict';
  var ABS = window.ABS;
  var $ = function (s) { return document.querySelector(s); };
  var P = ABS.projects;
  var fmt = function (n) { return n.toLocaleString('en-GB'); };

  /* ---------- grid ---------- */
  var grid = $('#pgrid');
  grid.innerHTML = P.map(function (p, i) {
    var L = ABS.art.layout(p.seed);
    return '<a class="pcard" data-in href="#' + p.slug + '" data-slug="' + p.slug + '" data-type="' + p.type + '" data-cursor="Open" style="--d:' + ((i % 2) * 0.1) + 's">' +
      '<div class="pcard__art"><span class="pcard__no">0' + (i + 1) + '</span>' +
        '<div class="pcard__render">' + ABS.art.render(L, { label: p.name + ' elevation' }) + '</div>' +
        '<div class="pcard__bp">' + ABS.art.blueprint(L, { label: p.name + ' blueprint' }) + '</div></div>' +
      '<div class="pcard__meta"><h3>' + p.name + '</h3><span>' + p.typeLabel + ' · ' + p.year + '</span></div>' +
      '<p class="pcard__sub">' + p.scale + ' · ' + fmt(p.area) + ' m²</p></a>';
  }).join('');
  var cards = [].slice.call(grid.children);

  cards.forEach(function (c) {
    var bp = c.querySelector('.pcard__bp'), t;
    var on = function () { clearTimeout(t); bp.classList.add('is-draw'); };
    var off = function () { clearTimeout(t); t = setTimeout(function () { bp.classList.remove('is-draw'); }, 1000); };
    c.addEventListener('mouseenter', on); c.addEventListener('focus', on);
    c.addEventListener('mouseleave', off); c.addEventListener('blur', off);
  });

  /* ---------- filter ---------- */
  var filters = [['all', 'All'], ['residential', 'Residential'], ['commercial', 'Commercial'], ['management', 'Project Management']];
  var chips = $('#pChips');
  chips.innerHTML = filters.map(function (f, i) {
    var n = f[0] === 'all' ? P.length : P.filter(function (p) { return p.type === f[0]; }).length;
    return '<button type="button" class="chip" data-f="' + f[0] + '" aria-pressed="' + (i === 0) + '">' + f[1] + '<sup>' + n + '</sup></button>';
  }).join('');

  function layoutOffsets() {
    var k = 0;
    cards.forEach(function (c) { if (!c.hidden) { c.classList.toggle('is-off', k % 2 === 1); k++; } });
    $('#pCount').textContent = 'Showing ' + k + ' of ' + P.length;
  }
  function filter(f) {
    chips.querySelectorAll('.chip').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.f === f)); });
    cards.forEach(function (c) {
      var show = f === 'all' || c.dataset.type === f;
      if (show) { c.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.remove('is-out'); }); }); }
      else { c.classList.add('is-out'); setTimeout(function () { if (c.classList.contains('is-out')) { c.hidden = true; layoutOffsets(); } }, 340); }
    });
    layoutOffsets();
  }
  chips.addEventListener('click', function (e) { var b = e.target.closest('.chip'); if (b) filter(b.dataset.f); });
  layoutOffsets();

  /* ---------- dossier ---------- */
  var dos = $('#dossier'), stage = $('#stage'), stR = $('#stR'), stB = $('#stB');
  var cur = -1, lastFocus = null;

  function setMode(m) {
    stage.dataset.mode = m;
    dos.querySelectorAll('.mode button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === m)); });
    stB.classList.toggle('is-draw', m === 'blueprint');
  }
  function fill(i) {
    var p = P[i], L = ABS.art.layout(p.seed);
    cur = i;
    stR.innerHTML = ABS.art.render(L, { label: p.name + ' elevation' });
    stB.innerHTML = ABS.art.blueprint(L, { label: p.name + ' blueprint' });
    $('#dCount').textContent = (i < 9 ? '0' : '') + (i + 1) + ' / ' + (P.length < 10 ? '0' : '') + P.length;
    $('#dType').textContent = p.typeLabel + ' · ' + p.year;
    $('#dName').textContent = p.name;
    $('#dSum').textContent = p.summary;
    $('#dTrio').innerHTML = p.stats.map(function (s) { return '<div><b>' + s[0] + '</b><span>' + s[1] + '</span></div>'; }).join('');
    $('#dFacts').innerHTML = [['Role', p.role], ['Scale', p.scale], ['Area', fmt(p.area) + ' m²'], ['Programme', p.months + ' months'], ['Completed', p.year]]
      .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
    $('#dQuote').href = 'contact.html?type=' + p.type;
  }
  function setHash(slug) {
    try { history.replaceState(null, '', slug ? '#' + slug : location.pathname + location.search); } catch (e) { location.hash = slug || ''; }
  }
  function open(i, fromHash) {
    if (cur === -1 || !dos.classList.contains('is-open')) lastFocus = document.activeElement;
    setMode('render'); fill(i); ABS.cursorReset();
    dos.classList.add('is-open'); dos.setAttribute('aria-hidden', 'false'); document.body.classList.add('is-locked');
    dos.scrollTop = 0;
    if (!fromHash) setHash(P[i].slug);
    setTimeout(function () { $('#dClose').focus({ preventScroll: true }); }, 450);
  }
  function close(fromHash) {
    dos.classList.remove('is-open'); dos.setAttribute('aria-hidden', 'true'); document.body.classList.remove('is-locked');
    if (!fromHash) setHash('');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function step(d) { open((cur + d + P.length) % P.length); }

  grid.addEventListener('click', function (e) {
    var a = e.target.closest('.pcard'); if (!a) return;
    e.preventDefault();
    open(P.findIndex(function (p) { return p.slug === a.dataset.slug; }));
  });
  $('#dClose').addEventListener('click', function () { close(); });
  $('#dPrev').addEventListener('click', function () { step(-1); });
  $('#dNext').addEventListener('click', function () { step(1); });
  dos.querySelector('.mode').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setMode(b.dataset.m); });

  document.addEventListener('keydown', function (e) {
    if (!dos.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Tab') {
      var f = [].slice.call(dos.querySelectorAll('button, a[href]')).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function fromHash() {
    var slug = location.hash.slice(1), i = P.findIndex(function (p) { return p.slug === slug; });
    if (i > -1) { if (!dos.classList.contains('is-open') || cur !== i) open(i, true); }
    else if (dos.classList.contains('is-open')) close(true);
  }
  window.addEventListener('hashchange', fromHash);
  ABS.onReady(function () { setTimeout(fromHash, 300); });
})();
