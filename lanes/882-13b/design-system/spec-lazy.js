/* Plenix design system · lazy part loading (spec-lazy.js; issue 882, item 13).
   The library records' examples, labs and written sections live in one chunk per part (spec-chunks/<part>.js, written by
   build-spec-parts.js). What the navigation, the counts and the tables read of every record is in the index
   (spec-index.js: window.DSIndex), so the page can list everything at once and load a part when its page opens.
   DSLazy.stubs()        one record per index entry, in the bundle's order (inventory.js adds them to its list)
   DSLazy.start(H, fill, list)   inventory.js hands over its helpers, its default-filler and its record list
   DSLazy.load(id)       a promise: the chunks the record needs (its part's group and the parts that add to it) are
                         loaded and merged into the record, in the bundle's order; resolves with the record
   DSLazy.ready(id)      true when the record is whole
   DSLazy.onLoaded(fn)   fn(ids) runs after chunks merge (spec.js applies the written sections there)
   Loaded without DSIndex (the eager page, spec-parts.js), none of this runs. */
(function () {
  var I = window.DSIndex;
  if (!I) return;
  var H = null, fill = null, list = null, stubs = null, whole = {}, got = {}, waits = {}, listeners = [];
  var byId = function (id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; };
  var DIR = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^/]*$/, '') : ''; })();
  window.DSChunkLoaded = function (name) { got[name] = true; var w = waits[name]; delete waits[name]; (w || []).forEach(function (f) { f(); }); };
  window.DSLazy = {
    index: I,
    stubs: function () {
      stubs = I.records.map(function (m) { var r = {}; for (var k in m) if (k !== 'part') r[k] = m[k]; r.part = m.part; return r; });
      return stubs;
    },
    start: function (helpers, fillDefaults, records) {
      H = helpers; fill = fillDefaults; list = records;
      Object.keys(I.touch).forEach(function (id) { var r = byId(id); if (!r || r.part) return; pristine[id] = {}; Object.keys(r).forEach(function (k) { pristine[id][k] = copy(r[k]); }); });
      overlay();
      window.DSLazy.started = true;
    },
    ready: function (id) { return window.DSLazy.partsFor(id).every(function (n) { return whole[n]; }); },
    isWhole: function (part) { return !!whole[part]; },
    onLoaded: function (fn) { listeners.push(fn); },
    // the parts to load for a record: its own part's group, and the groups of the parts that add to it
    partsFor: function (id) {
      var r = byId(id), names = {};
      var add = function (p) { (I.parts[p] || [p]).forEach(function (q) { names[q] = 1; }); };
      if (r && r.part) add(r.part);
      // the records it takes its states and written sections from
      if (r) { (r.statesFrom || []).concat(r.docsFrom ? [r.docsFrom] : []).forEach(function (x) { var o = byId(x); if (o && o.part) add(o.part); }); }
      (I.touch[id] || []).forEach(add);
      return Object.keys(names).sort();
    },
    load: function (id) {
      var r = byId(id), names = window.DSLazy.partsFor(id);
      var need = names.filter(function (n) { return !got[n]; });
      var done = new Promise(function (resolve) {
        if (!need.length) return resolve();
        var left = need.length;
        need.forEach(function (n) {
          (waits[n] = waits[n] || []).push(function () { if (--left === 0) resolve(); });
          if (waits[n].length > 1) return;   // already asked for
          var s = document.createElement('script'); s.src = DIR + 'spec-chunks/' + n + '.js'; s.async = false;
          s.onerror = function () { console.error('spec-lazy: could not load ' + s.src); if (--left === 0) resolve(); };
          document.head.appendChild(s);
        });
      });
      return done.then(function () { window.DSLazy.merge(); return r; });
    },
    // Runs the record functions and the written sections of the loaded parts, in the bundle's order. A part sees a record of
    // inventory.js's own as the parts before it left it, so when a part that sorts before one already loaded arrives, the
    // records those parts change go back to how inventory.js made them and every loaded part runs again, in order.
    merge: function () {
      var P = window.DSParts, names = {}, touched = {};
      if (!docsTaken) { docsTaken = true; baseDocs = Object.assign({}, window.DSDocs); }
      P.records.forEach(function (fn) { if (fn.part) names[fn.part] = 1; });
      Object.keys(got).forEach(function (n) { names[n] = 1; });
      var all = Object.keys(names).sort();
      var newest = all.filter(function (n) { return !whole[n]; });
      if (!newest.length) return;
      var late = newest.every(function (n) { return all.filter(function (m) { return whole[m]; }).every(function (m) { return m < n; }); });
      var fns = P.records.map(function (fn, i) { return { fn: fn, i: i }; }).filter(function (x) { return x.fn.part; });
      var docs = P.docs.map(function (d, i) { return { d: d, part: (P.docsPart || [])[i] || '', i: i }; });
      if (!late) {   // start again from how inventory.js made the records
        Object.keys(pristine).forEach(function (id) { var r = byId(id); if (!r) return; Object.keys(r).forEach(function (k) { if (!(k in pristine[id])) delete r[k]; }); Object.keys(pristine[id]).forEach(function (k) { r[k] = copy(pristine[id][k]); }); });
        Object.keys(window.DSDocs).forEach(function (k) { if (!(k in baseDocs)) delete window.DSDocs[k]; else window.DSDocs[k] = baseDocs[k]; });
        Object.keys(pristine).forEach(function (id) { touched[id] = 1; });
      } else {
        fns = fns.filter(function (x) { return !whole[x.fn.part]; });
        docs = docs.filter(function (x) { return !whole[x.part]; });
      }
      var order = function (a, b) { return a.part === b.part ? a.i - b.i : a.part < b.part ? -1 : 1; };
      fns.sort(function (a, b) { return order({ part: a.fn.part, i: a.i }, { part: b.fn.part, i: b.i }); });
      docs.sort(order);
      fns.forEach(function (x) {
        x.fn(view(x.fn.part)).forEach(function (rec) {
          var stub = byId(rec.id); fill(rec);
          if (stub) { Object.keys(rec).forEach(function (k) { stub[k] = rec[k]; }); } else list.push(rec);
          touched[rec.id] = 1;
        });
      });
      docs.forEach(function (x) { Object.assign(window.DSDocs, x.d); Object.keys(x.d).forEach(function (id) { touched[id] = 1; }); });
      list.forEach(function (r) { if (r.docsFrom && !window.DSDocs[r.id] && window.DSDocs[r.docsFrom]) window.DSDocs[r.id] = window.DSDocs[r.docsFrom]; });
      all.forEach(function (n) { whole[n] = true; });
      overlay();
      var ids = Object.keys(touched);
      listeners.forEach(function (f) { f(ids); });
    }
  };
    // what a part sees of the others: in the bundle a part runs before the parts after it, so their records do not exist yet
  // (record() gives nothing, iconOf falls back to the icon table); here every record is listed from the start
  function view(part) {
    var v = Object.create(H);
    v.record = function (id) { var r = H.record(id); return r && r.part && r.part > part ? null : r; };
    v.iconOf = function (id) { var r = v.record(id); return (r && r.icon) || H.ICON[id] || 'doc-text'; };
    return v;
  }
  // until the parts that change one of inventory.js's own records have loaded, the record reads as the bundle leaves it in what
  // the lists use (the index's base: its level, source and plenix names), so the home reads the same either way
  function overlay() {
    var B = I.base || {};
    Object.keys(B).forEach(function (id) {
      var r = byId(id); if (!r) return;
      if ((I.touch[id] || []).every(function (n) { return whole[n]; })) return;
      Object.keys(B[id]).forEach(function (k) { if (B[id][k] === null) delete r[k]; else r[k] = copy(B[id][k]); });
    });
  }
  // inventory.js's own records the parts change, as inventory.js made them
  var pristine = {}, baseDocs = {}, docsTaken = false;
  function copy(v) {   // arrays and plain objects all the way down (parts change nested lists in place); functions stay as they are
    if (Array.isArray(v)) return v.map(copy);
    if (v && typeof v === 'object' && Object.getPrototypeOf(v) === Object.prototype) { var o = {}; Object.keys(v).forEach(function (k) { o[k] = copy(v[k]); }); return o; }
    return v;
  }
})();
