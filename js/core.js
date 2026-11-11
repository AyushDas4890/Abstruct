/* ABSTRUCT — core: chrome injection, page transitions, theme flip, reveals, counters, cursor, marquee */
(function () {
  'use strict';
  var ABS = window.ABS = window.ABS || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var body = document.body;
  var page = body.dataset.page || '';

  ABS.reduce = reduce;
  ABS.clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  ABS.easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  ABS.smooth = function (t) { return t * t * (3 - 2 * t); };

  /* ---------- ready queue (fires as the curtain lifts) ---------- */
  var isReady = false, readyQ = [];
  ABS.onReady = function (fn) { if (isReady) fn(); else readyQ.push(fn); };
  function fireReady() {
    if (isReady) return;
    isReady = true;
    document.documentElement.classList.add('is-ready');
    readyQ.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    readyQ = [];
  }

  /* ---------- chrome ---------- */
  var links = [['Home', 'index.html', 'home'], ['Services', 'services.html', 'services'], ['Projects', 'projects.html', 'projects'], ['About', 'about.html', 'about']];
  function cur(p) { return p === page ? ' aria-current="page"' : ''; }

  var chrome =
    '<a class="skip" href="#main">Skip to content</a>' +
    '<header class="nav" id="nav">' +
      '<a class="nav__brand" href="index.html" aria-label="ABSTRUCT Construction, home"><img src="assets/img/brand/logo-horizontal.png" alt="" width="146" height="46"></a>' +
      '<nav class="nav__links" aria-label="Primary">' +
        links.map(function (l) { return '<a href="' + l[1] + '"' + cur(l[2]) + '>' + l[0] + '</a>'; }).join('') +
      '</nav>' +
      '<a class="btn nav__cta" href="contact.html"' + (page === 'contact' ? ' aria-current="page"' : '') + '>Get a Quote <span class="arr" aria-hidden="true">→</span></a>' +
      '<button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false" aria-controls="menu"><i></i><i></i></button>' +
    '</header>' +
    '<div class="menu" id="menu" aria-hidden="true">' +
      links.map(function (l, i) { return '<a href="' + l[1] + '" style="--i:' + i + '"' + cur(l[2]) + ' tabindex="-1">' + l[0] + '</a>'; }).join('') +
      '<a href="contact.html" style="--i:4" tabindex="-1">Get a Quote</a>' +
      '<small>People · Spaces · Progress</small>' +
    '</div>' +
    '<div class="cursor" id="cursor" aria-hidden="true"><span></span></div>' +
    '<div class="curtain" id="curtain" aria-hidden="true"><img src="assets/img/brand/logo-white.png" alt=""></div>';

  body.insertAdjacentHTML('afterbegin', chrome);

  var letters = 'ABSTRUCT'.split('').map(function (c, i) { return '<span><b style="--i:' + i + '">' + c + '</b></span>'; }).join('');
  var footer =
    '<footer class="foot" data-theme="red">' +
      '<div class="wrap">' +
        '<div class="foot__top">' +
          '<img class="foot__mark" src="assets/img/brand/logo-white.png" alt="ABSTRUCT monogram" loading="lazy">' +
          '<nav class="foot__nav" aria-label="Footer">' +
            links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('') +
            '<a href="contact.html">Contact</a>' +
          '</nav>' +
          '<a class="foot__cta" href="contact.html" data-cursor="Quote"><span>Let’s build<br>a stronger<br>tomorrow.</span><i class="circle" aria-hidden="true">→</i></a>' +
        '</div>' +
        '<div class="foot__info">' +
          '<div><h3>Head office</h3><p>14 Foundry Row, Unit 3<br>Open Mon–Fri, 8:00–18:00</p></div>' +
          '<div><h3>Enquiries</h3><p><a href="mailto:hello@abstruct.example">hello@abstruct.example</a></p></div>' +
          '<div><h3>Disciplines</h3><p>Residential Construction<br>Commercial Construction<br>Project Management</p></div>' +
        '</div>' +
        '<div class="foot__word" aria-hidden="true">' + letters + '</div>' +
        '<div class="foot__bar"><span>© 2026 ABSTRUCT Construction. Building with purpose.</span><a href="https://www.flostudio.co/work/abstruct" target="_blank" rel="noopener">Identity by Flo Studios ↗</a></div>' +
      '</div>' +
    '</footer>';
  body.insertAdjacentHTML('beforeend', footer);

  var nav = document.getElementById('nav');
  var curtain = document.getElementById('curtain');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  /* ---------- menu ---------- */
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    body.classList.toggle('is-locked', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.querySelectorAll('a').forEach(function (a) { a.tabIndex = open ? 0 : -1; });
  }
  burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false); });

  /* ---------- curtain intro + page transitions ---------- */
  var seen = false;
  try { seen = sessionStorage.getItem('abs-seen') === '1'; } catch (e) { /* storage blocked: treat as first visit */ }
  var intro = !seen && !reduce;
  var t0 = performance.now();
  var loaded = document.readyState === 'complete';
  var minWait = intro ? 1500 : 220;

  if (reduce) {
    curtain.classList.add('is-gone');
    fireReady();
  } else {
    if (intro) curtain.classList.add('is-intro');
    var opened = false;
    var open = function () {
      if (opened) return; opened = true;
      try { sessionStorage.setItem('abs-seen', '1'); } catch (e) { /* ignore */ }
      curtain.classList.add('is-open');
      setTimeout(fireReady, 380);
      setTimeout(function () { curtain.classList.add('is-gone'); }, 1100);
    };
    var tryOpen = function () { if (loaded && performance.now() - t0 >= minWait) open(); else setTimeout(tryOpen, 60); };
    window.addEventListener('load', function () { loaded = true; });
    setTimeout(function () { loaded = true; }, 3500);
    tryOpen();
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { curtain.classList.remove('is-closing'); curtain.classList.add('is-gone'); setMenu(false); }
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || /^(#|mailto:|tel:|https?:|javascript:)/i.test(href)) return;
    var dest = href.split('#')[0];
    if (!dest || dest === location.pathname.split('/').pop()) return;
    if (reduce) return;
    e.preventDefault();
    curtain.classList.remove('is-gone', 'is-open', 'is-intro');
    curtain.classList.add('is-pre');
    void curtain.offsetWidth;
    curtain.classList.remove('is-pre');
    curtain.classList.add('is-closing');
    setTimeout(function () { location.href = href; }, 580);
  });

  /* ---------- reveal + counters ---------- */
  function countUp(el) {
    var to = parseFloat(el.dataset.count), suf = el.dataset.suffix || '', dec = parseInt(el.dataset.dec || '0', 10);
    if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    var s = null, dur = 1700;
    function step(ts) {
      if (s === null) s = ts;
      var p = ABS.clamp((ts - s) / dur);
      el.textContent = (to * ABS.easeOut(p)).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  ABS.countUp = countUp;

  ABS.observe = function (root) {
    var scope = root || document;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add('is-in');
        en.target.querySelectorAll('[data-count]').forEach(countUp);
        if (en.target.hasAttribute('data-count')) countUp(en.target);
        en.target.dispatchEvent(new CustomEvent('abs:in', { bubbles: false }));
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -4% 0px' });
    scope.querySelectorAll('.rv, [data-in], .img-rv, .foot__word, .label').forEach(function (el) { io.observe(el); });
  };
  ABS.onReady(function () { ABS.observe(document); });

  /* ---------- scroll: theme flip, nav state, velocity ---------- */
  var sections = [];
  function collectSections() { sections = [].slice.call(document.querySelectorAll('section[data-theme], footer[data-theme]')); }
  collectSections();
  ABS.refreshSections = collectSections;

  var lastY = window.scrollY, vel = 0, skew = 0, ticking = false;
  var marquees = [];
  function onScroll() {
    var y = window.scrollY;
    vel = y - lastY; lastY = y;
    nav.classList.toggle('is-scrolled', y > 24);
    if (y > 120 && vel > 3 && !body.classList.contains('menu-open')) nav.classList.add('is-hidden');
    else if (vel < -3 || y < 120) nav.classList.remove('is-hidden');
    var line = nav.offsetHeight * 0.5, theme = body.dataset.theme || 'light'; /* the section under the nav */
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= line) theme = sections[i].dataset.theme;
    }
    if (body.dataset.theme !== theme) body.dataset.theme = theme;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- marquee ---------- */
  document.querySelectorAll('.marquee').forEach(function (m) {
    var track = m.querySelector('.marquee__track');
    var copy = track.cloneNode(true);
    [].slice.call(copy.children).forEach(function (c) { c.setAttribute('aria-hidden', 'true'); });
    while (copy.firstChild) track.appendChild(copy.firstChild);
    marquees.push(m.querySelector('.marquee__skew'));
  });
  if (marquees.length && !reduce) {
    (function loop() {
      skew += (ABS.clamp(vel * 0.35, -9, 9) - skew) * 0.12;
      vel *= 0.9;
      marquees.forEach(function (el) { el.style.setProperty('--skew', skew.toFixed(2) + 'deg'); });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- cursor ---------- */
  ABS.cursorReset = function () {};
  if (fine && !reduce) {
    var cur2 = document.getElementById('cursor'), label = cur2.querySelector('span');
    ABS.cursorReset = function () { cur2.classList.remove('is-big'); };
    var cx = 0, cy = 0, tx = 0, ty = 0;
    var placed = false;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY; cur2.classList.add('is-on');
      if (!placed) { placed = true; cx = tx; cy = ty; }
      var t = e.target.closest && e.target.closest('[data-cursor]');
      if (t) { label.textContent = t.dataset.cursor; cur2.classList.add('is-big'); } else cur2.classList.remove('is-big');
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cur2.classList.remove('is-on'); });
    (function loop() {
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur2.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      requestAnimationFrame(loop);
    })();
  }
})();
