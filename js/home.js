/* ABSTRUCT — home behaviour */
(function () {
  'use strict';
  var ABS = window.ABS, reduce = ABS.reduce;
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- hero: concrete assembles, red plane wipes, pointer parallax ---------- */
  var hero = $('#hero'), art = $('#heroArt');
  art.insertAdjacentHTML('beforeend', ABS.art.render(ABS.art.hero(), { label: 'Concrete volumes assembling in front of a red plane' }));
  ABS.onReady(function () { setTimeout(function () { hero.classList.add('is-built'); }, 120); });

  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    var tx = 0, ty = 0, mx = 0, my = 0, running = false;
    var loop = function () {
      mx += (tx - mx) * 0.07; my += (ty - my) * 0.07;
      art.style.setProperty('--mx', mx.toFixed(3));
      art.style.setProperty('--my', my.toFixed(3));
      if (Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) requestAnimationFrame(loop); else running = false;
    };
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
  }

  /* ---------- track-record sheet: ticks, squares and bars ---------- */
  document.querySelectorAll('.sheet__viz').forEach(function (v) {
    var n = +v.dataset.n, kind = v.dataset.kind, html = '';
    for (var i = 0; i < n; i++) {
      var cls = kind === 'rule' && (i + 1) % 5 === 0 ? ' class="is-major"' : kind === 'bars' && i === n - 1 ? ' class="is-open"' : '';
      html += '<i' + cls + ' style="--i:' + i + '"></i>';
    }
    v.innerHTML = html;
  });

  /* ---------- beam: scroll-pinned crane sequence ---------- */
  (function () {
    var sec = $('#beam'), fig = $('#beamFig'), bar = $('#beamBar');
    var L = {}; fig.querySelectorAll('[data-l]').forEach(function (el) { L[el.dataset.l] = el; });
    [-155, -130, -105, -80, -55, -30, -10].forEach(function (a) {
      ['spark--l', 'spark--r'].forEach(function (c) {
        var i = document.createElement('i'); i.style.setProperty('--a', a + 'deg'); fig.querySelector('.' + c).appendChild(i);
      });
    });
    var clamp = ABS.clamp, easeOut = ABS.easeOut, smooth = ABS.smooth, hit = false;

    function paint(p) {
      var t = easeOut(clamp((p - 0.02) / 0.3));
      L.left.style.transform = 'translateX(' + ((-1 + t) * 60) + '%)'; L.left.style.opacity = clamp(t * 2);
      L.right.style.transform = 'translateX(' + ((1 - t) * 60) + '%)'; L.right.style.opacity = clamp(t * 2);
      var o = smooth(clamp((p - 0.18) / 0.42));
      var bounce = p > 0.6 ? -1.1 * Math.sin(clamp((p - 0.6) / 0.12) * Math.PI) : 0;
      var y = -16.9 + o * (5.4 + 16.9) + bounce;
      var vis = clamp((p - 0.14) * 12);
      L.asm.style.transform = 'translateY(' + y + '%)'; L.asm.style.opacity = vis;
      L.rope.style.transform = 'scaleY(' + Math.max(0.05, (188 + y * 8.9) / 188) + ')'; L.rope.style.opacity = vis;
      if (p >= 0.6 && !hit) { hit = true; fig.classList.remove('hit'); void fig.offsetWidth; fig.classList.add('hit'); }
      if (p < 0.56 && hit) { hit = false; fig.classList.remove('hit'); }
      ['we', 'build', 'trust'].forEach(function (k, n) {
        var r = easeOut(clamp((p - 0.66 - n * 0.07) / 0.1));
        L[k].style.opacity = r; L[k].style.transform = 'translateY(' + ((1 - r) * 220) + '%)';
      });
      bar.style.setProperty('--p', p.toFixed(3));
    }
    if (reduce) { paint(1); return; }
    var target = 0, cur = 0, raf = 0;
    /* starts as the stage enters the bottom of the screen, finishes exactly when the pin releases */
    function read() { var r = sec.getBoundingClientRect(), vh = window.innerHeight; return clamp((vh * 0.85 - r.top) / Math.max(1, r.height - vh * 0.15)); }
    function frame() {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      paint(cur);
      raf = cur === target ? 0 : requestAnimationFrame(frame);
    }
    function kick() { target = read(); if (!raf) raf = requestAnimationFrame(frame); }
    target = cur = read(); paint(cur);
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
  })();

  /* ---------- services: expanding panels ---------- */
  (function () {
    var ul = $('#svc');
    ul.innerHTML = ABS.services.map(function (s, i) {
      return '<li class="svc__p' + (i === 0 ? ' is-active' : '') + '" style="--i:' + i + '">' +
        '<img src="assets/img/web/' + s.photo + '" alt="" loading="lazy" style="object-position:' + s.pos + '">' +
        '<div class="svc__top"><span class="svc__no">/ ' + s.no + '</span><span class="circle circle--line" aria-hidden="true">→</span></div>' +
        '<div><h3>' + s.name + '</h3><p>' + s.short + '</p></div>' +
        '<a class="svc__link" href="services.html#' + s.slug + '" aria-label="' + s.name + '" data-cursor="Open"></a>' +
        '</li>';
    }).join('');
    var items = [].slice.call(ul.children), active = 0, paused = false, started = false;
    function set(n) { active = n; items.forEach(function (li, i) { li.classList.toggle('is-active', i === n); }); }
    items.forEach(function (li, i) {
      li.addEventListener('mouseenter', function () { paused = true; set(i); });
      li.addEventListener('mouseleave', function () { paused = false; });
      li.querySelector('a').addEventListener('focus', function () { paused = true; set(i); });
      li.querySelector('a').addEventListener('blur', function () { paused = false; });
    });
    ul.addEventListener('abs:in', function () {
      if (started || reduce) return; started = true;
      setInterval(function () { if (!paused && !document.hidden) set((active + 1) % items.length); }, 3400);
    });
  })();

  /* ---------- featured projects: rows + cursor-following peek ---------- */
  (function () {
    var list = ABS.projects.slice(0, 5);
    var ul = $('#plist'), peek = $('#peek');
    ul.innerHTML = list.map(function (p, i) {
      return '<li><a href="projects.html#' + p.slug + '" data-cursor="View" data-i="' + i + '"><span class="idx">0' + (i + 1) + '</span><h3>' + p.name + '</h3>' +
        '<span class="plist__t">' + p.typeLabel + '</span><span class="plist__y">' + p.year + '</span><i class="arr" aria-hidden="true">→</i></a></li>';
    }).join('');
    peek.innerHTML = list.map(function (p) {
      return '<div class="peek__i">' + ABS.art.render(ABS.art.layout(p.seed), { label: p.name }) + '</div>';
    }).join('');
    var imgs = [].slice.call(peek.children);
    if (reduce || !window.matchMedia('(hover: hover)').matches) return;
    var tx = 0, ty = 0, x = 0, y = 0, tilt = 0, on = false, raf = 0;
    function loop() {
      var nx = x + (tx - x) * 0.16, ny = y + (ty - y) * 0.16;
      tilt += (ABS.clamp((tx - x) * 0.04, -8, 8) - tilt) * 0.2;
      x = nx; y = ny;
      peek.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + tilt.toFixed(2) + 'deg)';
      raf = on || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(loop) : 0;
    }
    ul.addEventListener('pointermove', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      tx = e.clientX + 36; ty = e.clientY - peek.offsetHeight / 2;
      if (!on) { x = tx; y = ty; }
      on = true; peek.classList.add('is-on');
      imgs.forEach(function (el, i) { el.classList.toggle('is-on', String(i) === a.dataset.i); });
      if (!raf) raf = requestAnimationFrame(loop);
    });
    ul.addEventListener('pointerleave', function () { on = false; peek.classList.remove('is-on'); });
  })();

  /* ---------- values ---------- */
  $('#vals').innerHTML = ABS.values.map(function (v, i) {
    return '<li class="rv" style="--d:' + (0.1 + i * 0.1) + 's"><span class="idx">0' + (i + 1) + '</span><div><h3>' + v[0] + '</h3><p>' + v[1] + '</p></div></li>';
  }).join('');
})();
