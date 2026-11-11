/* ABSTRUCT — about page */
(function () {
  'use strict';
  var ABS = window.ABS, reduce = ABS.reduce;
  var $ = function (s) { return document.querySelector(s); };

  /* palette strip: expands on hover, cycles on its own until touched (from the case study) */
  var ul = $('#pal');
  ul.innerHTML = ABS.palette.map(function (c, i) {
    return '<li class="' + (i === 2 ? 'is-active' : '') + '" tabindex="0" style="--sw:' + c.hex + ';--pi:' + (c.dark ? '#111111' : '#EBE5DC') + ';--i:' + i + '">' +
      '<span class="pal__no">0' + (i + 1) + '</span><b>' + c.name + '</b><span class="pal__hex">' + c.hex + '</span><em>' + c.role + '</em></li>';
  }).join('');
  var items = [].slice.call(ul.children), active = 2, hold = false, started = false;
  function set(n) {
    active = n;
    items.forEach(function (li, i) {
      li.classList.toggle('is-active', i === n);
      if (i === n) { var h = li.querySelector('.pal__hex'); h.style.animation = 'none'; void h.offsetWidth; h.style.animation = ''; }
    });
  }
  items.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { hold = true; set(i); });
    li.addEventListener('focus', function () { hold = true; set(i); });
    li.addEventListener('mouseleave', function () { hold = false; });
    li.addEventListener('blur', function () { hold = false; });
  });
  ul.addEventListener('abs:in', function () {
    if (started || reduce) return; started = true;
    setInterval(function () { if (!hold && !document.hidden) set((active + 1) % items.length); }, 2600);
  });

  /* taglines */
  $('#lines').innerHTML = ABS.taglines.map(function (t, i) { return '<li class="rv" style="--d:' + (i * 0.06) + 's">' + t + '</li>'; }).join('');

  ABS.refreshSections();
})();
