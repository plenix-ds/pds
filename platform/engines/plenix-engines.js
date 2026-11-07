/* Plenix · engines (platform/engines/plenix-engines.js)
   Summary: The page script that loads the optional engines for plenix.js: rich text (Tiptap), charts (Apache ECharts) and
     PDF (PDF.js). It holds the vendor folder's address and the three loaders; plenix.js holds neither (issues 456 and 457).
   Usage: <script src=".../plenix-engines.js"></script> after plenix.js (or before it: the order does not matter).
     window.PlenixEngines.tiptap(win), .echarts(win), .pdf() and .vendorBase(): plenix.js calls these when a rich-text editor,
     a chart or a PDF document appears. A page without one of those never loads its engine.
   Props: window.PlenixVendorBase (set before this script runs) overrides the vendor folder.
   Behavior: The vendor folder is found from this script's own address: ../vendor/ when the file is platform/engines/ in the
     repository; ./vendor/ beside it everywhere else (the CDN's plenix-engines.js, the npm package's dist/plenix-engines.js).
     Each engine loads once per window; later callers get the same promise. A failed load is forgotten, so the next caller tries again.
     tiptap(win) and echarts(win) add the engine's script to the given window (default this one) and resolve with
     its global (PlenixTiptap, PlenixECharts). pdf() resolves with { module, worker }: the PDF.js module and its worker address.
   Notes: Plain script, no build. A page that loads it as a module, injects it or bundles it (document.currentScript is null then)
     must set window.PlenixVendorBase to the vendor folder first. A page that shows a rich-text editor, a chart or a PDF without this script gets a plain
     message from plenix.js saying the engines script is missing. */
(function () {
  'use strict';
  var SCRIPT = document.currentScript && document.currentScript.src || '';
  function vendorBase() {
    if (window.PlenixVendorBase) return String(window.PlenixVendorBase).replace(/\/?$/, '/');
    if (!SCRIPT) return 'platform/vendor/';
    return new URL(/\/platform\/engines\/plenix-engines\.js(\?.*)?$/.test(SCRIPT) ? '../vendor/' : './vendor/', SCRIPT).href;
  }
  // Trusted Types (issue 940, ADR 0031): a page that requires them accepts a script address only from a policy. This file makes its own, "plenix-engines", kept in this closure (never on window),
  // and it names only a .js file under vendor/ on THE ORIGIN OF THIS FILE: another origin is refused. A page that restricts policy names allows "plenix" and "plenix-engines".
  var engineOrigin = (function () { try { return new URL(SCRIPT || location.href, location.href).origin; } catch (e) { return location.origin; } })();
  var scriptPolicy = null, scriptPolicyTried = false;
  function trustedUrl(url) {
    var api = window.trustedTypes;
    if (!api || typeof api.createPolicy !== 'function') return url;
    if (!scriptPolicyTried) {
      scriptPolicyTried = true;
      try {
        scriptPolicy = api.createPolicy('plenix-engines', {
          createScriptURL: function (u) {
            var parsed = new URL(u, document.baseURI);
            if (parsed.origin !== engineOrigin || !/\/vendor\/[\w./-]+\.js$/.test(parsed.pathname)) throw new TypeError('Plenix only loads its own vendor scripts, from the origin of plenix-engines.js');
            return u;
          }
        });
      } catch (e) { scriptPolicy = null; }
    }
    if (!scriptPolicy) throw new TypeError('This page enforces Trusted Types and does not allow the "plenix-engines" policy (trusted-types plenix plenix-engines)');
    return scriptPolicy.createScriptURL(url);
  }
  var loading = new WeakMap();
  function script(name, file, global) {
    return function (win) {
      var w = win || window;
      if (w[global]) return Promise.resolve(w[global]);
      var key = loading.get(w) || {}; loading.set(w, key);
      if (key[name]) return key[name];
      var doc = w.document;
      key[name] = new Promise(function (resolve, reject) {
        var s = doc.createElement('script'), href;
        try { href = trustedUrl(vendorBase() + file); } catch (e) { setTimeout(function () { delete key[name]; }, 0); reject(e); return; }
        s.src = href; s.async = true; s.setAttribute('data-plx-vendor', name);
        s.onload = function () { if (w[global]) resolve(w[global]); else { delete key[name]; s.remove(); reject(new Error(name + ' did not load from ' + vendorBase() + file)); } };
        s.onerror = function () { delete key[name]; s.remove(); reject(new Error(name + ' could not be loaded from ' + vendorBase() + file)); };
        doc.head.appendChild(s);
      });
      return key[name];
    };
  }
  var pdfLoad = null;
  function pdf() {
    if (pdfLoad) return pdfLoad;
    var url = vendorBase() + 'pdfjs/pdf.js';
    pdfLoad = import(url).then(function (m) { return { module: m, worker: new URL('pdf.worker.js', url).href }; });
    pdfLoad.catch(function () { pdfLoad = null; });
    return pdfLoad;
  }
  window.PlenixEngines = { vendorBase: vendorBase, tiptap: script('tiptap', 'tiptap/tiptap.min.js', 'PlenixTiptap'), echarts: script('echarts', 'echarts/echarts.min.js', 'PlenixECharts'), pdf: pdf };
})();
