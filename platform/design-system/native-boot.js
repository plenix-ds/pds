/* Plenix design system · which native data this visit loads. The iOS and Android guidance (native-guidance-full.js, 1.7 MB)
   and Apple's references (apple-refs.js, 0.4 MB) load only when the page opens on iOS or Android: a hash of an iOS or
   Android section, or no section and iOS or Android as the remembered platform (spec.js PLATFORM_KEY). Web pages take
   the index (native-guidance.js): the cross-platform maps and what an "Across platforms" panel shows. spec.js reloads
   the page when the reader moves from Web to iOS or Android, so the native pages are always built from the full data.
   Runs after inventory-taxonomy.js (it reads each section's platform) and before spec.js. */
(function () {
  var sid = location.hash.replace(/^#\/?/, '').split('/')[0], sec = null, saved = null;
  (window.DSTaxonomy || []).forEach(function (s) { if (s.id === sid) sec = s; });
  try { saved = localStorage.getItem('plenix.ds.platform'); } catch (e) { /* not stored: Web */ }
  var platform = sec ? sec.platform || 'web' : saved;
  window.DSNativeFull = platform === 'ios' || platform === 'android';
  var v = (document.currentScript && /\?v=([^&]+)/.exec(document.currentScript.src) || [])[1] || '';
  var files = window.DSNativeFull ? ['native-guidance-full.js', 'apple-refs.js'] : ['native-guidance.js'];
  // parser-blocking on purpose: spec.js reads this data while it starts
  files.forEach(function (f) { document.write('<script src="' + f + (v ? '?v=' + v : '') + '"><\/script>'); });
})();
