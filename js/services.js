/* ABSTRUCT — services page */
(function () {
  'use strict';
  var ABS = window.ABS, reduce = ABS.reduce;
  var $ = function (s) { return document.querySelector(s); };

  /* stacked panels */
  $('#panels').innerHTML = ABS.services.map(function (s) {
    var cls = s.theme === 'dark' ? ' spanel--dark' : s.theme === 'red' ? ' spanel--red' : '';
    return '<section class="spanel' + cls + '" id="' + s.slug + '" data-theme="' + s.theme + '" aria-labelledby="h-' + s.slug + '">' +
      '<div class="wrap spanel__in"><div class="spanel__grid">' +
        '<div>' +
          '<p class="label rv">/ ' + s.no + '</p>' +
          '<h2 class="display" id="h-' + s.slug + '" data-in>' + s.name.split(' ').map(function (w, i) { return '<span class="ln"><span style="--i:' + i + '">' + w + '</span></span>'; }).join('') + '</h2>' +
          '<p class="spanel__long lede rv" style="--d:.1s">' + s.long + '</p>' +
          '<ul class="caps rv" style="--d:.2s">' + s.caps.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul>' +
          '<a class="btn rv" style="--d:.3s" href="contact.html?type=' + s.slug + '">Start a quote <span class="arr" aria-hidden="true">→</span></a>' +
        '</div>' +
        '<figure class="spanel__fig img-rv"><span class="spanel__no">' + s.no + '</span><img src="assets/img/web/' + s.photo + '" alt="" loading="lazy" style="object-position:' + s.pos + '"></figure>' +
      '</div></div></section>';
  }).join('');

  $('#svcChips').innerHTML = ABS.services.map(function (s) { return '<a class="chip" href="#' + s.slug + '">' + s.name.replace(' Construction', '') + '</a>'; }).join('');

  /* previous panel recedes as the next one slides over it */
  var panels = [].slice.call(document.querySelectorAll('.spanel'));
  if (!reduce && window.matchMedia('(min-width: 901px)').matches) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      panels.forEach(function (p, i) {
        var next = panels[i + 1], inner = p.firstElementChild;
        if (!next) return;
        var t = ABS.clamp(1 - next.getBoundingClientRect().top / vh);
        inner.style.transform = 'scale(' + (1 - t * 0.06).toFixed(4) + ')';
        inner.style.filter = 'brightness(' + (1 - t * 0.45).toFixed(3) + ')';
      });
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* process */
  $('#steps').innerHTML = ABS.steps.map(function (s, i) {
    return '<li class="step rv" style="--d:' + (0.15 + i * 0.12) + 's"><span class="idx">0' + (i + 1) + '</span><h3>' + s[0] + '</h3><p>' + s[1] + '</p></li>';
  }).join('');

  /* faq accordion */
  $('#faq').innerHTML = ABS.faq.map(function (f, i) {
    return '<div class="faq__item"><h3><button class="faq__q" id="fq' + i + '" aria-expanded="false" aria-controls="fa' + i + '">' + f[0] + '<i aria-hidden="true"></i></button></h3>' +
      '<div class="faq__a" id="fa' + i + '" role="region" aria-labelledby="fq' + i + '"><div><p>' + f[1] + '</p></div></div></div>';
  }).join('');
  $('#faq').addEventListener('click', function (e) {
    var b = e.target.closest('.faq__q'); if (!b) return;
    var item = b.closest('.faq__item'), open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
  });

  ABS.refreshSections();
})();
