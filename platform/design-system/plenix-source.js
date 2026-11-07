/* Plenix design spec · where the spec loads Plenix from (owner, 2026-10-25: "make the design spec a consumer of the cdn").
   The spec runs on a published release, like any other application: the stylesheet, the JavaScript bundle, React, the
   fonts, the theme script and the icons come from https://design-system.lighthouseway.org/cdn/<VERSION>/. The files the
   pages read as text (each component's JSX and CSS, the token files, the standards) come from the same release's
   source/ folder, laid out like the repository (source/platform/components/…).

   VERSION is the one setting. It is the release the spec documents, and it is pinned: it moves only at a release, when
   package.json's version moves (VERSIONING.md, Releasing, step 2). check-spec.js fails when the two differ.

   Preview unreleased Platform work: add ?plenix=local to the spec's address (for example
   http://localhost:8767/Plenix/platform/design-system/?plenix=local#/…). The spec then loads this checkout's own files
   (../platform.css, ../dist/platform.js and the rest), as it did before. ?plenix=0.70.1 loads another published release.
   To keep a choice without the flag, run localStorage.setItem('plenix.source', 'local') once in the page's console
   (localStorage.removeItem('plenix.source') goes back to the pinned release); the flag in the address wins.

   window.PlenixSource:
     mode      'cdn' or 'local'
     version   the release in use ('local' for this checkout)
     base      the runtime folder, ending in "/": the CDN release, or this checkout's platform/ folder; icons/<name>.svg,
               fonts/, tokens/platform-ios.tokens.json and mobile/ sit at the same place in both
     src       the platform source folder, ending in "/": <release>/source/platform/, or this checkout's platform/
     css, js, themeBoot, fonts, react   the runtime files (react: [react, react-dom])
     icons     the compatibility icon file (every Plenix icon, registered after the bundle), or null for a release
               without one (up to 0.73.0)
     at(path)  a source file's address (path under platform/, e.g. 'components/Button/Button.tsx')
   The page's own head is written here, in order: the theme script, the font preload, fonts.css, the Platform stylesheet,
   React and the Platform bundle; then the style audit (platform/dev/style-audit.js, which reports only on localhost). */
(function () {
  var VERSION = '0.93.1';
  var CDN = 'https://design-system.lighthouseway.org/cdn/';

  var pick = (/[?&]plenix=([\w.-]+)/.exec(location.search) || [])[1];
  if (!pick) { try { pick = localStorage.getItem('plenix.source') || ''; } catch (e) { pick = ''; } }
  var local = pick === 'local';
  var version = local ? 'local' : /^\d+\.\d+\.\d+$/.test(pick) ? pick : VERSION;

  // a > b for two versions written x.y.z
  function after(a, b) { var x = a.split('.').map(Number), y = b.split('.').map(Number); for (var i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return false; }
  var here = document.currentScript ? document.currentScript.src : location.href;
  var checkout = new URL('../', here).href;   // this checkout's platform/ folder
  var release = CDN + version + '/';
  var base = local ? checkout : release;
  var src = local ? checkout : release + 'source/platform/';

  var S = window.PlenixSource = {
    mode: local ? 'local' : 'cdn',
    version: version,
    pinned: VERSION,
    base: base,
    src: src,
    css: local ? checkout + 'platform.css' : release + 'plenix.css',
    js: local ? checkout + 'dist/platform.js' : release + 'plenix.js',
    engines: local ? checkout + 'engines/plenix-engines.js' : release + 'plenix-engines.js',   // rich text, charts and PDF load through it (#456 to #458)
    icons: local ? checkout + 'dist/plenix-icons-plenix.js' : after(version, '0.73.0') ? release + 'plenix-icons-plenix.js' : null,   // the compatibility icon file (#553, #557)
    themeBoot: local ? checkout + 'providers/theme-boot.js' : release + 'theme-boot.js',
    fonts: local ? checkout + 'system/fonts.css' : release + 'fonts.css',
    react: [base + 'vendor/react.production.min.js', base + 'vendor/react-dom.production.min.js'],
    at: function (path) { return new URL(path, src).href; }
  };
  document.documentElement.setAttribute('data-plenix-source', S.mode === 'local' ? 'local' : S.version);

  var tags = [
    '<link rel="icon" type="image/svg+xml" href="' + S.at('brand/favicon.svg') + '">',
    '<script src="' + S.themeBoot + '"><\/script>',
    '<link rel="preload" href="' + base + 'fonts/dm-sans-variable-latin.woff2" as="font" type="font/woff2" crossorigin>',
    '<link rel="stylesheet" href="' + S.fonts + '">',
    '<link rel="stylesheet" href="' + S.css + '">',
    // locally the React loader keeps its ?react=dev switch; a release ships the production build only
    local ? '<script src="' + checkout + 'vendor/react-loader.js"><\/script>'
      : '<script src="' + S.react[0] + '"><\/script><script src="' + S.react[1] + '"><\/script>',
    '<script src="' + S.js + '"><\/script>',
    // every Plenix icon, registered (#557: icons draw from modules, not from the stylesheet); the spec shows them all.
    // A release up to 0.73.0 has no such file (its icons still come from plenix.css)
    S.icons ? '<script src="' + S.icons + '"><\/script>' : '',
    '<script src="' + S.engines + '"><\/script>',
    '<script src="' + S.at('dev/style-audit.js') + '"><\/script>'
  ];
  document.write(tags.join(''));
})();
