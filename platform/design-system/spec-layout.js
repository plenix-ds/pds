/* Plenix master spec · moves each table's title into its card, so every block carries its title inside (see
   spec-layout.css). The page builds its sections after loading files, so this runs as they appear. */
(function () {
  var main = document.getElementById('dsRoot'); if (!main) return;
  var queued = false;
  function apply() {
    queued = false;
    main.querySelectorAll('h3.ds-table-title').forEach(function (h) {
      var next = h.nextElementSibling;
      if (next && next.classList.contains('ds-table-card')) next.insertBefore(h, next.firstChild);
    });
  }
  new MutationObserver(function () { if (!queued) { queued = true; requestAnimationFrame(apply); } }).observe(main, { childList: true, subtree: true });
  apply();
})();
