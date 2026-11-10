/* Plenix __PLENIX_VERSION__ · plenix-loader.js: load Plenix per screen, for a page without a bundler (ADR 0052, issue 1208).
   Load the version's React first, then this script, both as classic <script src> tags in <head>:
     <script src="https://design-system.lighthouseway.org/cdn/<v>/vendor/react.production.min.js"></script>
     <script src="https://design-system.lighthouseway.org/cdn/<v>/vendor/react-dom.production.min.js"></script>
     <script src="https://design-system.lighthouseway.org/cdn/<v>/plenix-loader.js"></script>
   Then, before a screen renders:  await Plenix.load(['DataGrid', 'Dialog', 'Button']);  and use window.Plenix.<Name> as with
   plenix.js. Each name loads esm/<Name>.js and the shared code it needs, once per page, however often it is asked for.
   An unknown name rejects with its name. The loader writes the import map that resolves React for the modules, so it must
   run before any module script; a page with its own import map adds the four React names to it instead.
   Generated into /cdn/<v>/ by build-packages.js (tools/publish/esm-parts.js); this file is its source. */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script || !script.src) throw new Error('Plenix: load plenix-loader.js with a <script src> tag');
  var base = new URL('./', script.src).href;
  var esm = base + 'esm/';
  if (!document.querySelector('script[type="importmap"][data-plenix]')) {
    var map = document.createElement('script');
    map.type = 'importmap';
    map.setAttribute('data-plenix', '__PLENIX_VERSION__');
    map.textContent = JSON.stringify({ imports: {
      'react': base + 'vendor/react.esm.js',
      'react-dom': base + 'vendor/react-dom.esm.js',
      'react-dom/client': base + 'vendor/react-dom-client.esm.js',
      'react/jsx-runtime': base + 'vendor/react-jsx-runtime.esm.js'
    } });
    (document.head || document.documentElement).appendChild(map);
  }
  var Plenix = window.Plenix = window.Plenix || {};
  var entries = null;
  var loading = {};
  function manifest() {
    if (!entries) {
      entries = fetch(esm + 'manifest.json').then(function (r) {
        if (!r.ok) throw new Error('Plenix.load: ' + esm + 'manifest.json answered ' + r.status);
        return r.json();
      }).then(function (m) { return m.entries; });
    }
    return entries;
  }
  // the shared code an entry needs, fetched in parallel with it
  function preload(files) {
    for (var i = 0; i < files.length; i++) {
      var href = esm + files[i];
      if (document.querySelector('link[rel="modulepreload"][href="' + href + '"]')) continue;
      var link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = href;
      document.head.appendChild(link);
    }
  }
  function one(name, all) {
    if (!loading[name]) {
      var entry = Object.prototype.hasOwnProperty.call(all, name) ? all[name] : null;
      loading[name] = !entry ? Promise.reject(new Error('Plenix.load: no part named ' + name))
        : (preload(entry.imports), import(esm + entry.file).then(function (m) { Plenix[name] = m[name]; }));
    }
    return loading[name];
  }
  Plenix.load = function (names) {
    var list = [].concat(names || []);
    return manifest().then(function (all) {
      return Promise.all(list.map(function (n) { return one(String(n), all); }));
    }).then(function () {});
  };
  Plenix.loaderVersion = '__PLENIX_VERSION__';
})();
