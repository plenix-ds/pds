/* global DS, loadSheets */
/* Plenix master spec · Motion section, shown live (after Fluent 2's motion page): every duration racing side by side,
   the easing curve drawn with a dot traveling along it, every keyframe playing as the products use it, and the common
   transitions in practice. Values come from platform/system/tokens/reference.css and platform/system/motion.css; "Used by"
   lists are read from platform/platform.css and every stylesheet it imports. People who ask their system for less motion see nothing play until they press Play. */
window.DSMotionLab = function (section, data) {
  var values = {}, fullOf = {}; data.groups.forEach(function (g) { g.tokens.forEach(function (t) { values[t.name] = t.value; fullOf[t.name] = t.full; }); });
  var durations = Object.keys(values).filter(function (n) { return /^motion-duration-/.test(n); });
  var eases = Object.keys(values).filter(function (n) { return /^motion-ease-/.test(n); });
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seconds = function (v) { v = String(v).trim(); return /ms$/.test(v) ? parseFloat(v) / 1000 : parseFloat(v); };

  function block(title, lead) {
    var b = DS.el('div', 'ds-motion-block'); b.appendChild(DS.el('h3', 'ds-table-title', title));
    if (lead) b.appendChild(DS.el('p', 'ds-motion-lead', lead));
    section.appendChild(b); return b;
  }
  function playButton(label, onPlay) {
    var b = DS.el('button', 'ds-motion-play', label || 'Play'); b.type = 'button';
    b.addEventListener('click', onPlay); return b;
  }

  // ---- 1. durations: the same move at each duration, side by side
  var dur = block('Duration', 'How long a change takes. The same move at each duration; press Play to compare them. Small changes (hover colors) use fast; panels and menus use base; toasts and larger moves use slow.');
  var durBar = DS.el('div', 'ds-motion-bar'); dur.appendChild(durBar);
  var lanes = DS.el('div', 'ds-motion-lanes'); dur.appendChild(lanes);
  var dots = [];
  durations.forEach(function (n) {
    var lane = DS.el('div', 'ds-motion-lane');
    var head = DS.el('div', 'ds-motion-lane-head'); head.appendChild(DS.el('code', 'ds-motion-name', '--' + fullOf[n])); head.appendChild(DS.el('span', 'ds-motion-value', values[n] + ' · ' + Math.round(seconds(values[n]) * 1000) + 'ms'));
    lane.appendChild(head);
    var track = DS.el('div', 'ds-motion-track'), dot = DS.el('span', 'ds-motion-dot'); DS.sample(dot, 'transition-duration', 'var(--' + fullOf[n] + ')'); DS.sample(dot, 'transition-timing-function', 'var(--plx-sys-motion-ease-standard)');
    track.appendChild(dot); lane.appendChild(track);
    lane.appendChild(DS.el('div', 'ds-motion-used', 'Used by: …')).dataset.token = n;
    lanes.appendChild(lane); dots.push(dot);
  });
  var durOn = false;
  function playDurations() { durOn = !durOn; dots.forEach(function (d) { d.classList.toggle('ds-motion-at-end', durOn); }); }
  durBar.appendChild(playButton('Play', playDurations));
  if (!calm) { var loop = setInterval(function () { if (!document.body.contains(lanes)) { clearInterval(loop); return; } if (lanes.offsetParent) playDurations(); }, 1400); }

  // ---- 2. easing: the curve, a dot following it, and the same move without easing for comparison
  var easeB = block('Easing', 'How speed changes during a move. Plenix has one easing token; the common curves are shown beside it for comparison only. Slowed to 1.2s here so the shape can be seen; in the product it runs at the durations above.');
  var BEZ = { linear: [0, 0, 1, 1], ease: [0.25, 0.1, 0.25, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1] };
  var bez = function (v) { v = String(v).trim(); if (BEZ[v]) return BEZ[v]; var m = /cubic-bezier\(([^)]+)\)/.exec(v); return m ? m[1].split(',').map(parseFloat) : BEZ.ease; };
  // progress at time t (0..1) for a cubic-bezier: solve x(s) = t, return y(s)
  function curveAt(p, t) {
    var cx = 3 * p[0], bx = 3 * (p[2] - p[0]) - cx, ax = 1 - cx - bx, cy = 3 * p[1], by = 3 * (p[3] - p[1]) - cy, ay = 1 - cy - by;
    var x = function (s) { return ((ax * s + bx) * s + cx) * s; }, y = function (s) { return ((ay * s + by) * s + cy) * s; };
    var lo = 0, hi = 1, s = t; for (var i = 0; i < 30; i++) { s = (lo + hi) / 2; if (x(s) < t) lo = s; else hi = s; }
    return y(s);
  }
  var easeGrid = DS.el('div', 'ds-motion-grid'); easeB.appendChild(easeGrid);
  var curves = [];
  eases.map(function (n) { return { name: '--' + fullOf[n], value: values[n], token: n }; })
    .concat(['linear', 'ease-in', 'ease-out', 'ease-in-out'].filter(function (k) { return eases.every(function (n) { return values[n] !== k; }); }).map(function (k) { return { name: k, value: k, ref: true }; }))
    .forEach(function (c) {
      var card = DS.el('div', 'ds-motion-card' + (c.ref ? ' ds-motion-ref' : ''));
      var head = DS.el('div', 'ds-motion-lane-head'); head.appendChild(DS.el('code', 'ds-motion-name', c.name)); head.appendChild(DS.el('span', 'ds-motion-value', c.ref ? 'reference, not a token' : c.value));
      card.appendChild(head);
      var cv = document.createElement('canvas'); cv.className = 'ds-motion-curve'; cv.width = 360; cv.height = 220; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Easing curve ' + c.value);
      card.appendChild(cv);
      var track = DS.el('div', 'ds-motion-track'), dot = DS.el('span', 'ds-motion-dot ds-motion-dot-raf'); track.appendChild(dot); card.appendChild(track);
      easeGrid.appendChild(card); curves.push({ cv: cv, p: bez(c.value), dot: dot, track: track });
    });
  function drawCurve(o, t) {
    var g = o.cv.getContext('2d'), W = o.cv.width, H = o.cv.height, pad = 22, cs = getComputedStyle(section);
    var tok = function (n) { return cs.getPropertyValue(n).trim(); };   // a canvas cannot read var(): the token values, read from the page
    var line = tok('--plx-ref-color-gray-300'), ink = tok('--plx-ref-color-blue-400'), mark = tok('--plx-ref-color-brown-500');
    g.clearRect(0, 0, W, H);
    var X = function (v) { return pad + v * (W - 2 * pad); }, Y = function (v) { return H - pad - v * (H - 2 * pad); };
    g.strokeStyle = line; g.lineWidth = 1; g.strokeRect(X(0), Y(1), X(1) - X(0), Y(0) - Y(1));
    g.setLineDash([4, 4]); g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(1), Y(1)); g.stroke(); g.setLineDash([]);
    g.strokeStyle = ink; g.lineWidth = 3; g.beginPath();
    for (var i = 0; i <= 60; i++) { var tt = i / 60, v = curveAt(o.p, tt); if (i) g.lineTo(X(tt), Y(v)); else g.moveTo(X(tt), Y(v)); }
    g.stroke();
    if (t != null) { var y = curveAt(o.p, t); g.fillStyle = mark; g.beginPath(); g.arc(X(t), Y(y), 6, 0, 7); g.fill(); DS.sample(o.dot, 'left', 'calc((100% - var(--plx-ref-size-4u)) * ' + y + ')'); }
    g.fillStyle = tok('--plx-ref-color-gray-600'); g.font = tok('--plx-ref-font-size-11') + ' ' + (tok('--plx-sys-typeface-sans') || 'sans-serif');
    g.fillText('time →', W - pad - 40, H - 6); g.save(); g.translate(10, pad + 60); g.rotate(-Math.PI / 2); g.fillText('progress →', 0, 0); g.restore();
  }
  var easeStart = null, EASE_MS = 1200, HOLD = 700;
  function easeFrame(now) {
    if (!document.body.contains(easeGrid)) return;
    if (easeGrid.offsetParent) {
      if (easeStart == null) easeStart = now;
      var e = (now - easeStart) % (EASE_MS + HOLD), t = Math.min(1, e / EASE_MS);
      curves.forEach(function (o) { drawCurve(o, t); });
    }
    requestAnimationFrame(easeFrame);
  }
  curves.forEach(function (o) { drawCurve(o, 0); });
  if (calm) {
    var eb = DS.el('div', 'ds-motion-bar'); eb.appendChild(playButton('Play', function () { easeStart = null; var go = function (now) { if (easeStart == null) easeStart = now; var t = Math.min(1, (now - easeStart) / EASE_MS); curves.forEach(function (o) { drawCurve(o, t); }); if (t < 1) requestAnimationFrame(go); }; requestAnimationFrame(go); }));
    easeB.insertBefore(eb, easeGrid);
  } else requestAnimationFrame(easeFrame);

  // ---- 3. keyframes, each playing on what uses it, at the product's own timing
  var KEYS = {
    'motion-fade-up': { use: 'Content appearing (.plx-motion-enter)', anim: 'var(--plx-sys-motion-duration-fast) var(--plx-sys-motion-ease-standard) both', demo: '<div class="ds-mk-card">New item</div>', replay: true },
    'motion-spin': { use: 'Loading spinner (.plx-spinner)', anim: 'var(--plx-sys-motion-duration-loop-fast) linear infinite', demo: '<div class="ds-mk-spin"></div>' },
    'motion-pulse': { use: 'Typing dots (.plx-chat__typing)', anim: 'var(--plx-sys-motion-duration-loop-base) ease-in-out infinite', demo: '<div class="ds-mk-dots"><span></span><span></span><span></span></div>', each: 'span' },
    'motion-shimmer-forward': { use: 'Loading placeholder (.plx-skeleton)', anim: 'var(--plx-sys-motion-duration-loop-slow) var(--plx-sys-motion-ease-standard) infinite', demo: '<div class="ds-mk-skel"></div>' },
    'motion-shimmer-reverse': { use: 'Loading placeholder, reversed (no Platform rule uses it)', anim: 'var(--plx-sys-motion-duration-loop-slow) var(--plx-sys-motion-ease-standard) infinite', demo: '<div class="ds-mk-skel"></div>' },
    'motion-toast-in': { use: 'Toast arriving (.plx-toast)', anim: 'var(--plx-sys-motion-duration-slow) var(--plx-sys-motion-ease-standard) both', demo: '<div class="ds-mk-clip"><div class="ds-mk-toast">Saved</div></div>', replay: true, target: '.ds-mk-toast' },
    'motion-toast-out': { use: 'Toast leaving (.plx-toast.is-leaving)', anim: 'var(--plx-sys-motion-duration-slow) var(--plx-sys-motion-ease-standard) both', demo: '<div class="ds-mk-clip"><div class="ds-mk-toast">Saved</div></div>', replay: true, target: '.ds-mk-toast' }
  };
  var keyB = block('Keyframes', 'Defined in platform/system/motion.css. Each plays on the element that uses it, with that element\'s timing.');
  var keyGrid = DS.el('div', 'ds-motion-grid ds-motion-grid-keys'); keyB.appendChild(keyGrid);
  fetch(PlenixSource.at('system/motion.css'), { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (css) {
    // only the keyframes: the system's reduced-motion rule would also stop the demos people start on purpose
    var kf = css.match(/@keyframes [\w-]+\s*\{(?:[^{}]|\{[^{}]*\})*\}/g) || [], st = new CSSStyleSheet(); st.replaceSync(kf.join(' ')); document.adoptedStyleSheets = document.adoptedStyleSheets.concat([st]);   // a constructed sheet, never a style element
    var kre = /@keyframes ([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g, k;
    while ((k = kre.exec(css))) {
      var name = k[1], info = KEYS[name] || { use: '', anim: '1s var(--plx-sys-motion-ease-standard) infinite', demo: '<div class="ds-mk-card">Sample</div>' };
      var card = DS.el('div', 'ds-motion-card');
      var head = DS.el('div', 'ds-motion-lane-head'); head.appendChild(DS.el('code', 'ds-motion-name', name)); head.appendChild(DS.el('span', 'ds-motion-value', info.use)); card.appendChild(head);
      var stage = DS.el('div', 'ds-mk-stage'); stage.innerHTML = info.demo; card.appendChild(stage);
      var target = info.each ? stage.querySelectorAll(info.each) : [stage.querySelector(info.target || ':scope > *')];
      var run = (function (target, info, name) { return function () {
        Array.prototype.forEach.call(target, function (el) { DS.sample(el, 'animation', 'none'); void el.offsetWidth; DS.sample(el, 'animation', name + ' ' + info.anim); });
      }; })(target, info, name);
      if (!calm || info.replay) run();
      var bar = DS.el('div', 'ds-motion-bar'); bar.appendChild(DS.el('span', 'ds-motion-anim', 'animation: ' + name + ' ' + info.anim.replace(/var\(--([a-z0-9-]+)\)/g, '--$1')));
      bar.appendChild(playButton(info.replay ? 'Replay' : 'Play', run)); card.appendChild(bar);
      card.appendChild(DS.el('pre', 'ds-motion-def', k[2].replace(/\s+/g, ' ').trim()));
      keyGrid.appendChild(card);
      if (info.replay && !calm) setInterval((function (run, card) { return function () { if (card.offsetParent) run(); }; })(run, card), 2200);
    }
  });

  // ---- 4. transitions in practice
  var tr = block('Transitions in practice', 'How the tokens combine in the interface. Hover or press the examples.');
  var trGrid = DS.el('div', 'ds-motion-grid'); tr.appendChild(trGrid);
  function practice(title, note, html, wire) {
    var card = DS.el('div', 'ds-motion-card'); var head = DS.el('div', 'ds-motion-lane-head'); head.appendChild(DS.el('strong', 'ds-motion-name', title)); card.appendChild(head);
    var stage = DS.el('div', 'ds-mk-stage'); stage.innerHTML = html; card.appendChild(stage); card.appendChild(DS.el('p', 'ds-motion-note', note));
    if (wire) wire(stage, card); trGrid.appendChild(card);
  }
  practice('State change', 'Hover: colors change over --plx-sys-motion-duration-fast with --plx-sys-motion-ease-standard (buttons, rows, links).', '<button type="button" class="ds-mk-state">Hover me</button>');
  practice('Elevation', 'Hover: the shadow rises over --plx-sys-motion-duration-base (cards, draggable items).', '<div class="ds-mk-lift" tabindex="0">Hover me</div>');
  practice('Enter and exit', 'A menu opens and closes over --plx-sys-motion-duration-base: it fades in and moves 4px.', '<div class="ds-mk-menuwrap"><button type="button" class="ds-mk-state ds-mk-toggle" aria-expanded="false">Open menu</button><div class="ds-mk-menu"><div>Rename</div><div>Move</div><div>Delete</div></div></div>', function (stage) {
    var b = stage.querySelector('.ds-mk-toggle'), m = stage.querySelector('.ds-mk-menu');
    b.addEventListener('click', function () { var open = !m.classList.contains('open'); m.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Close menu' : 'Open menu'; });
  });
  practice('Staggered list', 'Items appear one after another with motion-fade-up, 40ms apart, so the eye follows the order.', '<div class="ds-mk-list"><div>First</div><div>Second</div><div>Third</div><div>Fourth</div></div>', function (stage, card) {
    var run = function () { stage.querySelectorAll('.ds-mk-list > div').forEach(function (el, i) { DS.sample(el, 'animation', 'none'); void el.offsetWidth; DS.sample(el, 'animation', 'motion-fade-up var(--plx-sys-motion-duration-base) var(--plx-sys-motion-ease-standard) ' + (i * 0.04) + 's both'); }); };
    var bar = DS.el('div', 'ds-motion-bar'); bar.appendChild(playButton('Replay', run)); card.appendChild(bar); run();
    if (!calm) setInterval(function () { if (card.offsetParent) run(); }, 2400);
  });

  // ---- "Used by": the rules that use each duration
  if (typeof loadSheets === 'function') loadSheets(PlenixSource.at('platform.css')).then(function (sheets) {
    var used = {}, seen = {};
    sheets.filter(function (x) { if (seen[x.file]) return false; seen[x.file] = 1; return true; }).forEach(function (sheet) {   // every stylesheet in use, each file once
      if (/\/(tokens|themes)\/[a-z-]+\.css$/.test(sheet.file)) return;   // where the tokens are defined, not used
      var re = /([^{}]+)\{([^{}]*)\}/g, m, text = sheet.text.replace(/\/\*[\s\S]*?\*\//g, '');
      while ((m = re.exec(text))) durations.forEach(function (n) {
        if (m[2].indexOf('var(--' + fullOf[n] + ')') < 0) return;
        var sel = m[1].trim().split(',')[0].trim().replace(/:where\(:root\[data-plx-mode="dark"\]\)\s*/, '');
        (used[n] = used[n] || []).push(sel);
      });
    });
    lanes.querySelectorAll('.ds-motion-used').forEach(function (el) {
      var list = (used[el.dataset.token] || []).filter(function (x, i, a) { return a.indexOf(x) === i; });
      el.textContent = 'Used by: ' + (list.length ? list.slice(0, 8).join(', ') + (list.length > 8 ? ' and ' + (list.length - 8) + ' more' : '') : 'nothing');
    });
  });
};
