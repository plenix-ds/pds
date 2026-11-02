/* Plenix · page loader (platform/loader/loader.js, issue 842): every Plenix file of an application page from one place.
   Summary: An application page (the 10 suite applications and the Asset Manager's pages) loads only this script, first in
     its <head>, after loader.css. It picks where Plenix comes from, once, then loads every Plenix file of the page from
     there, in this order: the favicon, theme-boot.js, the font preload, fonts.css, the stylesheet (a release's
     plenix.min.css, the same rules without comments or spaces, issue 882; this checkout's platform.css), React and ReactDOM,
     plenix.js, the application's icon file, plenix-engines.js; then, once the stylesheet has loaded and the page is read,
     the suite's data file (suite applications) and the application's own script.
   Usage: <link rel="stylesheet" href="../platform/loader/loader.css">
     <script src="../platform/loader/loader.js" data-plenix-app="dashboard"></script>
   Where Plenix comes from (the first that applies):
     ?plenix=local                    this checkout's own files (the source copy), as below
     ?plenix=0.80.0                   that release, from the CDN (to try a release on any page)
     data-plenix-version="0.80.0"     that release, always (a page pinned in its own markup)
     data-plenix-cdn="https://…/cdn/" the published apps (deploy.sh writes it): the application's pin in <cdn>latest.json,
                                      else its "latest" ({ "latest": "0.80.0", "pins": { "tasks": "0.79.0" } }); read once
                                      per page. If it cannot be read: data-plenix-fallback (the release deploy.sh published),
                                      with one warning
     nothing                          this checkout's own files: a page opened from file:// or a local server, the tests.
                                      React's development build on request (?react=dev, or localStorage plenix.react=dev,
                                      as platform/vendor/react-loader.js), and the development audits (platform/dev/)
   A release holds every file the page needs: <cdn><version>/plenix.css, plenix.js, … and apps/<app>/ (app.js and
   plenix-icons-<app>.js; apps/suite/plenix-app-data.js; apps/dam/assets.js), written by build-packages.js. So a pinned
   application runs its own script of that release, never a newer one.
   Arabic (issue 882): on the CDN, plenix.js leaves Plenix's built-in Arabic words out; on an Arabic page (<html lang="ar…">,
   or data-plenix-languages="ar" on the loader tag for a page that may switch to Arabic) the loader adds plenix-ar.js right
   after plenix.js. This checkout's platform.js keeps them built in.
   Until plenix.css has loaded, the page is hidden (data-plx-page-loading on <html>, loader.css), at most 3 seconds; then
   it shows anyway, with a warning. Every script is added with async = false, so they run in the order above.
   After plenix.js runs, Plenix.version must be the release picked; a difference is one console warning (plenix.js itself
   compares its stylesheet's --plx-version). window.PlenixLoader: { mode: 'cdn' | 'local', version, base, app, ready, done,
   loadLanguage(code) }: loadLanguage('ar') adds plenix-ar.js later, once (LocaleProvider asks when a page turns Arabic).
   The ready signal: window.PlenixLoader.ready is a promise, there as soon as the loader has run, that resolves once the
     application's own script has run (and the page is shown), with window.PlenixLoader; then PlenixLoader.done is true and
     document fires the event plenix:ready. It rejects when the application's script cannot load, or when no release can
     be read and there is no fallback. Wait for it, not for a fixed time: the application's script runs only after the
     stylesheet has loaded (the tests wait for it in tests/lib.js).
   Notes: Plain script, no build: it is the one Plenix file a published page loads from the site itself, because it is
     what picks the release. Never an inline style or a style block: loader.css holds its one rule. */
(function () {
  'use strict';
  var me = document.currentScript;
  if (!me) return;
  var DEFAULT_CDN = 'https://design-system.lighthouseway.org/cdn/';
  var WAIT = 3000;
  var root = document.documentElement;
  var app = me.getAttribute('data-plenix-app') || '';
  var cdn = me.getAttribute('data-plenix-cdn') || '';
  var pinned = me.getAttribute('data-plenix-version') || '';
  var fallback = me.getAttribute('data-plenix-fallback') || '';
  // an Arabic page: <html lang="ar…">, or a page that may switch to Arabic and says so (data-plenix-languages="ar")
  var html = document.documentElement, lang = (html && typeof html.getAttribute === 'function' ? html.getAttribute('lang') : html && html.lang) || '';
  var arabic = /^ar(-|$)/i.test(lang) || /(^|\s)ar(\s|$)/.test(me.getAttribute('data-plenix-languages') || '');
  var pick = (/[?&]plenix=([\w.-]+)/.exec(location.search) || [])[1] || '';
  var RELEASE = /^\d+\.\d+\.\d+$/;
  var checkout = new URL('../', me.src).href;   // this checkout's platform/ folder
  var page = new URL('./', location.href).href; // the page's own folder
  var warned = {};
  function warn(key, text) { if (warned[key]) return; warned[key] = true; console.warn('Plenix loader: ' + text); }

  // the ready signal (see the header): there from the start, so a page or a test can wait for it before a release is picked
  var settle = {};
  var state = window.PlenixLoader = { mode: null, version: null, base: null, app: app, done: false };
  state.ready = new Promise(function (resolve, reject) { settle.resolve = resolve; settle.reject = reject; });
  state.ready.catch(function () { /* the warning says why; a page that waits sees the rejection */ });
  function isReady() {
    state.done = true;
    settle.resolve(state);
    document.dispatchEvent(new CustomEvent('plenix:ready', { detail: state }));
  }
  function failed(text) { warn('failed', text); settle.reject(new Error('Plenix loader: ' + text)); }

  // the files of one place: a release folder on the CDN, or this checkout
  function filesOf(mode, version) {
    var dam = app === 'dam';
    if (mode === 'local') {
      var dev = /[?&]react=dev\b/.test(location.search);
      try { dev = dev || localStorage.getItem('plenix.react') === 'dev'; } catch (e) { /* storage unavailable: production */ }
      var build = dev ? 'development' : 'production.min';
      return {
        base: checkout,
        favicon: checkout + 'brand/favicon.svg',
        font: checkout + 'fonts/dm-sans-variable-latin.woff2',
        css: [checkout + 'system/fonts.css', checkout + 'platform.css'],
        scripts: [checkout + 'vendor/react.' + build + '.js', checkout + 'vendor/react-dom.' + build + '.js', checkout + 'dist/platform.js',
          page + 'plenix-icons-' + app + '.js', checkout + 'engines/plenix-engines.js'],
        themeBoot: checkout + 'providers/theme-boot.js',
        late: (dam ? [] : [checkout + '../suite/plenix-app-data.js']).concat(app === 'settings' ? [checkout + '../suite/settings-data.js'] : []).concat([page + (dam ? 'app/assets.js' : 'app.js')]),
        audits: [checkout + 'dev/radius-audit.js', checkout + 'dev/style-audit.js']
      };
    }
    var r = (cdn || DEFAULT_CDN) + version + '/', a = r + 'apps/' + app + '/';
    return {
      base: r,
      favicon: r + 'source/platform/brand/favicon.svg',
      font: r + 'fonts/dm-sans-variable-latin.woff2',
      css: [r + 'fonts.css', r + 'plenix.min.css'],   // the same rules as plenix.css, minified (issue 882)
      // an Arabic page also gets plenix-ar.js right after plenix.js: the CDN's plenix.js leaves Plenix's built-in Arabic
      // words out (issue 882); this checkout's platform.js keeps them, so local mode needs nothing
      scripts: [r + 'vendor/react.production.min.js', r + 'vendor/react-dom.production.min.js', r + 'plenix.js'].concat(arabic ? [r + 'plenix-ar.js'] : [], [a + 'plenix-icons-' + app + '.js', r + 'plenix-engines.js']),
      themeBoot: r + 'theme-boot.js',
      late: (dam ? [] : [r + 'apps/suite/plenix-app-data.js']).concat(app === 'settings' ? [r + 'apps/suite/settings-data.js'] : []).concat([a + (dam ? 'assets.js' : 'app.js')]),
      audits: []
    };
  }

  function add(tag, attrs) {
    var el = document.createElement(tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) el[k] = attrs[k];
    document.head.appendChild(el);
    return el;
  }
  function script(src, onload) {
    var el = add('script', { src: src, async: false });
    if (onload) el.addEventListener('load', onload);
    if (/plenix-[a-z]{2}\.js$/.test(src)) languageFailed(el, src);
    return el;
  }
  // a language's words that cannot load (issue 882): the page still works, in English, and the console says why, once
  function languageFailed(el, src) {
    el.addEventListener('error', function () { warn('language-' + src, 'could not load ' + src + ': Plenix\'s own words show in English on this page'); });
  }

  function load(mode, version) {
    var f = filesOf(mode, version);
    state.mode = mode; state.version = mode === 'local' ? 'local' : version; state.base = f.base;
    // a language's built-in words asked for after the start (LocaleProvider, issue 882: a switch to Arabic without a
    // reload): on the CDN, plenix-<code>.js of the same release, once; in local mode they are built in
    var languages = { ar: arabic };
    state.loadLanguage = function (code) {
      if (mode === 'local' || code !== 'ar' || languages[code]) return;
      languages[code] = true;
      languageFailed(add('script', { src: f.base + 'plenix-' + code + '.js' }), f.base + 'plenix-' + code + '.js');
    };
    root.setAttribute('data-plenix-source', mode === 'local' ? 'local' : version);
    add('link', { rel: 'icon', type: 'image/svg+xml', href: f.favicon });
    // the theme first, so the page never shows the other mode
    script(f.themeBoot);
    add('link', { rel: 'preload', href: f.font, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
    var styled = false, ready = document.readyState !== 'loading', lateAdded = false;
    function show() { root.removeAttribute('data-plx-page-loading'); }
    function late() {
      if (lateAdded || !styled || !ready) return;
      lateAdded = true;
      var appScript = f.late[f.late.length - 1];
      f.late.concat(f.audits).forEach(function (src) {
        var el = script(src, src === appScript ? isReady : null);
        if (src === appScript) el.addEventListener('error', function () { failed('could not load the application\'s script ' + src); });
      });
    }
    var sheets = f.css.length;
    f.css.forEach(function (href) {
      var link = add('link', { rel: 'stylesheet', href: href });
      function done(ok) {
        if (!ok) warn('css-' + href, 'could not load ' + href);
        if (--sheets > 0) return;
        styled = true; show(); late();
      }
      link.addEventListener('load', function () { done(true); });
      link.addEventListener('error', function () { done(false); });
    });
    setTimeout(function () {
      if (styled) return;
      warn('slow', 'the stylesheet did not load within ' + WAIT / 1000 + ' seconds: the page is shown without waiting for it');
      styled = true; show(); late();
    }, WAIT);
    f.scripts.forEach(function (src, i) {
      script(src, i !== 2 || mode === 'local' ? null : function () {
        var got = window.Plenix && window.Plenix.version;
        if (got !== version) warn('version', 'release ' + version + ' was picked, but plenix.js is release ' + got);
      });
    });
    if (!ready) document.addEventListener('DOMContentLoaded', function () { ready = true; late(); });
  }

  root.setAttribute('data-plx-page-loading', '');
  if (pick === 'local') return load('local');
  if (RELEASE.test(pick)) return load('cdn', pick);
  if (RELEASE.test(pinned)) return load('cdn', pinned);
  if (!cdn) return load('local');
  fetch(cdn + 'latest.json').then(function (res) {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }).then(function (data) {
    var v = (data.pins && data.pins[app]) || data.latest;
    if (!RELEASE.test(v || '')) throw new Error('no release named for ' + app);
    load('cdn', v);
  }).catch(function (e) {
    if (RELEASE.test(fallback)) { warn('latest', 'could not read ' + cdn + 'latest.json (' + e.message + '): release ' + fallback); load('cdn', fallback); }
    else { warn('latest', 'could not read ' + cdn + 'latest.json (' + e.message + ') and no fallback release: the page shows unstyled'); root.removeAttribute('data-plx-page-loading'); failed('no release could be read for ' + app); }
  });
})();
