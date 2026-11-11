/* ABSTRUCT — contact: quote builder with a live scope sheet.
   There is no backend: submit validates, then opens a pre-filled mailto: link. Swap send() for a fetch() when one exists. */
(function () {
  'use strict';
  var ABS = window.ABS;
  var $ = function (s) { return document.querySelector(s); };
  var TO = 'hello@abstruct.example';

  var TYPES = [['residential', 'Residential Construction', 'Homes · Conversions'], ['commercial', 'Commercial Construction', 'Offices · Retail · Industrial'], ['management', 'Project Management', 'Client-side delivery']];
  var TIMES = ['As soon as possible', 'In 3–6 months', 'In 6–12 months', 'Still planning'];
  var STAGES = ['Just an idea', 'Drawings in progress', 'Drawings ready', 'Site already started'];
  var FACTOR = { residential: 1, commercial: 1.25, management: 0.85 };

  var st = { type: 'residential', slider: 650, time: TIMES[1], stage: STAGES[0], ref: 'ABS-26-' + String(Math.floor(1000 + Math.random() * 9000)) };
  var qs = new URLSearchParams(location.search), qt = qs.get('type');
  if (TYPES.some(function (t) { return t[0] === qt; })) st.type = qt;

  function size() {
    var raw = 100 * Math.pow(200, st.slider / 1000);
    var step = raw < 1000 ? 50 : raw < 5000 ? 100 : 500;
    return Math.max(100, Math.round(raw / step) * step);
  }
  var fmt = function (n) { return n.toLocaleString('en-GB'); };
  function months() {
    var m = FACTOR[st.type] * (4 + 1.9 * Math.log(size() / 100));
    return [Math.max(2, Math.round(m * 0.88)), Math.max(3, Math.round(m * 1.12))];
  }
  var typeLabel = function () { return TYPES.filter(function (t) { return t[0] === st.type; })[0][1]; };

  /* ---------- controls ---------- */
  $('#types').innerHTML = TYPES.map(function (t, i) {
    return '<label class="type"><input type="radio" name="type" value="' + t[0] + '"' + (t[0] === st.type ? ' checked' : '') + '><span><small>0' + (i + 1) + '</small>' + t[1] + '<small>' + t[2] + '</small></span></label>';
  }).join('');
  function seg(id, name, list, current) {
    $(id).innerHTML = list.map(function (v) { return '<label><input type="radio" name="' + name + '" value="' + v + '"' + (v === current ? ' checked' : '') + '><span>' + v + '</span></label>'; }).join('');
  }
  seg('#timeline', 'time', TIMES, st.time);
  seg('#stage', 'stage', STAGES, st.stage);

  var slider = $('#size');
  slider.value = st.slider;

  /* ---------- scope sheet ---------- */
  var artHost = $('#tArt'), artSeed = null;
  function setArt() {
    var bucket = Math.min(6, Math.floor(st.slider / 150));
    var seed = TYPES.map(function (t) { return t[0]; }).indexOf(st.type) * 131 + bucket * 7 + 5;
    if (seed === artSeed) return;
    var first = artSeed === null; artSeed = seed;
    var old = artHost.querySelector('svg');
    artHost.insertAdjacentHTML('beforeend', ABS.art.render(ABS.art.layout(seed), { label: 'Illustrative building for your scope' }));
    var fresh = artHost.lastElementChild;
    if (old && !first) {
      fresh.classList.add('is-old');
      requestAnimationFrame(function () { requestAnimationFrame(function () { fresh.classList.remove('is-old'); old.classList.add('is-old'); }); });
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 450);
    }
  }
  function paint() {
    var s = size(), m = months();
    $('#sizeOut').textContent = fmt(s);
    slider.setAttribute('aria-valuetext', fmt(s) + ' square metres');
    slider.style.setProperty('--fill', (st.slider / 10) + '%');
    $('#tRef').textContent = st.ref;
    $('#tType').textContent = typeLabel();
    $('#tSize').textContent = fmt(s) + ' m²';
    $('#tTime').textContent = st.time;
    $('#tStage').textContent = st.stage;
    $('#tEst').textContent = m[0] + '–' + m[1] + ' mo';
    setArt();
  }
  paint();

  $('#types').addEventListener('change', function (e) { st.type = e.target.value; paint(); });
  $('#timeline').addEventListener('change', function (e) { st.time = e.target.value; paint(); });
  $('#stage').addEventListener('change', function (e) { st.stage = e.target.value; paint(); });
  slider.addEventListener('input', function () { st.slider = +slider.value; paint(); });

  /* ---------- validation + send ---------- */
  var form = $('#quote');
  var fields = { name: $('#f-name'), email: $('#f-email') };
  function setErr(key, msg) {
    var f = fields[key], box = f.closest('.field');
    box.classList.toggle('is-bad', !!msg);
    f.setAttribute('aria-invalid', msg ? 'true' : 'false');
    $('#e-' + key).textContent = msg;
  }
  function validate() {
    var ok = true, first = null;
    var name = fields.name.value.trim(), email = fields.email.value.trim();
    var nameErr = name.length < 2 ? 'Please tell us your name.' : '';
    var emailErr = !email ? 'We need an email to reply to.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? 'That email does not look right.' : '';
    setErr('name', nameErr); setErr('email', emailErr);
    if (nameErr) { ok = false; first = fields.name; }
    if (emailErr) { ok = false; first = first || fields.email; }
    if (first) first.focus();
    return ok;
  }
  Object.keys(fields).forEach(function (k) { fields[k].addEventListener('input', function () { if (fields[k].closest('.field').classList.contains('is-bad')) validate(); }); });

  function summary() {
    var v = function (id) { return $(id).value.trim(); };
    return ['New quote request: ABSTRUCT Construction', 'Ref: ' + st.ref, '',
      'Type: ' + typeLabel(), 'Area: ' + fmt(size()) + ' m²', 'Start: ' + st.time, 'Stage: ' + st.stage,
      'Illustrative programme: ' + months().join('–') + ' months', '',
      'Name: ' + v('#f-name'), 'Email: ' + v('#f-email'), 'Phone: ' + (v('#f-phone') || 'n/a'), 'Site: ' + (v('#f-site') || 'n/a'), '', 'Notes:', v('#f-msg') || 'n/a'].join('\n');
  }
  function mailto() { return 'mailto:' + TO + '?subject=' + encodeURIComponent('Quote request ' + st.ref + ': ' + typeLabel()) + '&body=' + encodeURIComponent(summary()); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    $('#ticket').classList.add('is-sent');
    $('#sent').classList.add('is-on');
    $('#sentMail').href = mailto();
    $('#sent').scrollIntoView({ behavior: ABS.reduce ? 'auto' : 'smooth', block: 'center' });
    setTimeout(function () { window.location.href = mailto(); }, 900);
  });
  $('#sentCopy').addEventListener('click', function () {
    var btn = $('#sentCopy'), text = summary();
    function done(msg) { btn.textContent = msg; setTimeout(function () { btn.textContent = 'Copy summary'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { done('Copy failed: select the text in your email instead'); });
    } else {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done('Copied'); } catch (err) { done('Copy failed'); }
      document.body.removeChild(ta);
    }
  });
  $('#sentMail').addEventListener('click', function (e) { e.preventDefault(); window.location.href = mailto(); });
})();
