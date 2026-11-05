/* Plenix design system · platforms (batch 297): where each part of the Plenix Platforms Standard shows. The standard itself
   is platform/standards/platforms.md (the source of truth), read into window.DSStandard by build-platforms.js
   (platforms-standard.js); nothing here repeats its content. spec.js draws:
     the whole standard on 14 › Platforms › Platforms standard;
     the standard for one platform on 14 › Platforms › Web, Mobile web and Desktop: every section, each table keeping the
       columns and rows of that platform (and those of every platform, such as Narrow, Medium, Wide), headed by "How to
       build" for that platform (its implementations, controls, tokens and build outputs, from sections 1.4 and 7);
     the native platforms (level 0: iOS, Android; batch 324): the Web hierarchy's 14 sections for each, the leaves named as
       the platform names its controls; each leaf shows the parts native-parts.js names, for that platform;
     the parts a foundation, a pattern or a page structure follows on its own page (by its subsection numbers);
     a component's section 6 table and its functional equivalent (6.5) in its Platforms section. */
window.DSPlatforms = (function () {
  // the platform pages: which columns and rows a table keeps on each (a column or row naming another platform goes)
  var OTHER = {
    web: /\b(iOS|Android|SwiftUI|UIKit|Compose|Jetpack|Flutter|Cupertino|Kotlin|Swift|Dart)\b/,
    'mobile-web': /\b(iOS|Android|SwiftUI|UIKit|Compose|Jetpack|Flutter|Cupertino|Kotlin|Swift|Dart)\b|fine pointer/,
    desktop: /\b(iOS|Android|SwiftUI|UIKit|Compose|Jetpack|Flutter|Cupertino|Kotlin|Swift|Dart)\b|coarse pointer|Web Narrow/,
    ios: /\b(Web|Android|Compose|Jetpack|Kotlin)\b|`plx-|Material \(Android\)/,
    android: /\b(Web|iOS|SwiftUI|UIKit|Swift)\b|`plx-|Cupertino \(iOS\)/
  };
  var LEAVES = { 'Platforms standard': 'all', Web: 'web', 'Mobile web': 'mobile-web', Desktop: 'desktop' };
  // the native platforms' own sections (15, 16)
  // the native platforms' sections (level 0: iOS, Android): every section id starts with the platform
  var NAMES = { all: 'every platform', web: 'the web', 'mobile-web': 'the mobile web (touch and Narrow windows)', desktop: 'desktop browsers', ios: 'iOS', android: 'Android' };
  // the parts of the standard each foundation, pattern or page-structure page follows (subsection numbers)
  var PARTS = {
    'device-behavior': ['1.1', '1.2', '1.3', '3.1', '3.2'], 'control-heights': ['3.1', '3.2', '6.1'], breakpoints: ['3.3'],
    typography: ['3.4'], themes: ['1.5', '1.6'], motion: ['1.6'], 'focus-ring': ['6.2'], color: ['1.5', '1.6'],
    'implementation|Desktop': null,
    'navigation|Bottom navigation': ['4.1', '6.4'], 'navigation|Mobile tab bar': ['4.1', '6.4'],
    'application-shell': ['5.1', '4.1'], 'master-detail-workspace': ['5.2'], 'inspector-region': ['5.2'], 'listing-page': ['5.2'],
    'record-page': ['5.2', '5.4'], 'settings-page': ['5.3'], 'search-workspace': ['5.3'], 'dashboard-grid': ['5.2'],
    'landing-page': ['5.2'], 'layout-full-screen-workspace': ['5.1', '5.2'], 'bottom-sheet': ['4.2', '5.3']
  };
  // the components with their own section 6 table, and the functional equivalents (6.5) by record id
  var COMPONENT = { button: '6.1', 'text-field': '6.2', switch: '6.3', 'side-navigation': '6.4', 'navigation-rail': '6.4' };
  var EQUIV = { 'native-select': 'Select', checkbox: 'Checkbox', 'radio-group': 'Radio group', 'date-picker': 'Date and time', dialog: 'Dialog',
    'confirmation-dialog': 'Dialog', 'side-drawer': 'Sheet and inspector', 'inspector-region': 'Sheet and inspector', tooltip: 'Tooltip', toast: 'Feedback message',
    'data-grid': 'Data grid', table: 'Data grid', 'tree-view': 'Tree', 'drop-zone': 'File upload', 'progress-bar': 'Progress', spinner: 'Progress',
    'action-menu': 'Menu', 'search-input': 'Search and filters', 'filter-bar': 'Search and filters' };

  var S = function () { return window.DSStandard || { sections: [], lead: [] }; };
  var find = function (n) { var hit = null; S().sections.forEach(function (s) { (s.subs || []).forEach(function (x) { if (x.n === n) hit = x; }); }); return hit; };
  var keepCol = function (mode, head) { return mode === 'all' || !OTHER[mode].test(head); };
  // a table for one platform: its columns, then its rows (a row whose first cell names another platform goes)
  function filterTable(t, mode) {
    if (mode === 'all') return t;
    var keep = t.heads.map(function (hd, i) { return i === 0 || keepCol(mode, hd); });
    if (keep.filter(Boolean).length < 2) return null;
    var rows = t.rows.filter(function (r) { return keepCol(mode, r[0]); }).map(function (r) { return r.filter(function (c, i) { return keep[i]; }); });
    return rows.length ? { type: 'table', heads: t.heads.filter(function (c, i) { return keep[i]; }), rows: rows } : null;
  }
  function filterBlocks(blocks, mode) { return (blocks || []).map(function (b) { return b.type === 'table' ? filterTable(b, mode) : b; }).filter(Boolean); }
  function standardFor(mode) {
    return { mode: mode, name: NAMES[mode], title: S().title, lead: S().lead,
      sections: S().sections.map(function (s) { return { n: s.n, title: s.title, blocks: filterBlocks(s.blocks, mode), subs: (s.subs || []).map(function (x) { return { n: x.n, title: x.title, blocks: filterBlocks(x.blocks, mode) }; }) }; }) };
  }
  // "How to build" for a platform: the implementation tables (1.4) and the implementation section (7), for that platform
  function buildGuide(mode) {
    if (mode === 'all') return null;
    var parts = ['1.4', '1.5', '7.1', '7.2', '7.3'].map(find).filter(Boolean).map(function (x) { return { n: x.n, title: x.title, blocks: filterBlocks(x.blocks, mode) }; });
    return parts.length ? parts : null;
  }
  // the files a native app takes (build-mobile.js, 7.2; and the platform token sets, 7.1)
  var FILES = {
    ios: [['SwiftUI tokens', PlenixSource.base + 'mobile/ios/PlenixTokens.swift'], ['Flutter tokens (Cupertino on iOS)', PlenixSource.base + 'mobile/flutter/plenix_tokens.dart'], ['The iOS token set (with sources)', PlenixSource.base + 'tokens/platform-ios.tokens.json']],
    android: [['Jetpack Compose tokens', PlenixSource.base + 'mobile/android/PlenixTokens.kt'], ['Flutter tokens (Material on Android)', PlenixSource.base + 'mobile/flutter/plenix_tokens.dart'], ['The Android token set (with sources)', PlenixSource.base + 'tokens/platform-android.tokens.json']]
  };
  // the token mapping for one platform (7.1): each of its values under the web token name for the same role
  function tokensFor(mode) {
    if (mode !== 'ios' && mode !== 'android') return null;
    return (S().tokenMap || []).filter(function (r) { return r[mode]; }).map(function (r) { return [r.name, r.web || 'Platform only', r[mode], r[mode + 'Source']]; });
  }
  // a leaf of an iOS or Android section (batch 324): the parts of the standard native-parts.js names for it, for that
  // platform (each table with that platform's columns and rows); a leaf with no parts is a placeholder page
  var plain = function (c) { return String(c).replace(/\*\*|`/g, ''); };
  function nativePage(m, sec, leaf) {
    var list = (window.DSNativeParts || {})[sec + '|' + leaf] || [];
    // Apple's references for an iOS page (apple-refs.js): its HIG page, the SwiftUI topics and the frameworks (batch 326)
    var A = window.DSApple, ap = m === 'ios' && A && A.pages[sec + '|' + leaf];
    if (!list.length && !ap) return null;
    var st = standardFor(m), out = [], titles = [];
    var page = { mode: m, part: leaf, standard: { mode: m, name: st.name, title: st.title, lead: [], sections: out } };
    var sub = function (n) { var hit = null; st.sections.forEach(function (s) { (s.subs || []).forEach(function (x) { if (x.n === n) hit = x; }); }); return hit; };
    list.forEach(function (p) {
      var m2, x, s;
      if (p === 'lead') { page.standard.lead = st.lead; titles.push('the opening'); }
      else if (p === 'build') { page.guide = buildGuide(m); titles.push('how to build'); }
      else if (p === 'tokens') { page.tokens = tokensFor(m); titles.push('the token mapping'); }
      else if (p === 'files') { page.files = FILES[m]; titles.push('the generated files'); }
      else if (p === 'sources') { s = st.sections.filter(function (q) { return !q.n; })[0]; if (s) { out.push({ n: '', title: s.title, blocks: s.blocks, subs: s.subs }); titles.push(s.title.toLowerCase()); } }
      else if ((m2 = /^eq:(.+)$/.exec(p))) {
        x = sub('6.5'); var tab = x && (x.blocks || []).filter(function (b) { return b.type === 'table'; })[0];
        var rows = tab ? tab.rows.filter(function (r) { return plain(r[0]) === m2[1]; }) : [];
        if (rows.length) { out.push({ n: '', title: '6.5 Functional equivalent: ' + m2[1], blocks: [{ type: 'table', heads: tab.heads, rows: rows }] }); titles.push('6.5 ' + m2[1]); }
      } else if ((m2 = /^(\d+\.\d+):(.+)$/.exec(p))) {
        x = sub(m2[1]); if (!x) return;
        var blocks = (x.blocks || []).filter(function (b) { return b.type === 'table'; }).map(function (t) { var rs = t.rows.filter(function (r) { return plain(r[0]).indexOf(m2[2]) === 0; }); return rs.length ? { type: 'table', heads: t.heads, rows: rs } : null; }).filter(Boolean);
        if (blocks.length) { out.push({ n: '', title: x.n + ' ' + x.title + ': ' + m2[2], blocks: blocks }); titles.push(x.n + ' ' + m2[2]); }
      } else if (/^\d+$/.test(p)) { s = st.sections.filter(function (q) { return q.n === p; })[0]; if (s) { out.push({ n: '', title: s.n + '. ' + s.title, blocks: s.blocks, subs: [] }); titles.push(s.n + ' ' + s.title.toLowerCase()); } }
      else { x = sub(p); if (x) { out.push({ n: '', title: x.n + ' ' + x.title, blocks: x.blocks, subs: [] }); titles.push(x.n + ' ' + x.title.toLowerCase()); } }
    });
    page.summary = titles; page.key = sec + '|' + leaf;
    if (ap) page.apple = { hig: ap.hig || null, frameworks: ap.frameworks || [], topics: (ap.topics || []).map(function (k) { return A.topics[k]; }).filter(Boolean), read: A.read };
    return page;
  }
  function equivalent(r) {
    var name = EQUIV[r.id], t = find('6.5'); if (!name || !t) return null;
    var tab = (t.blocks || []).filter(function (b) { return b.type === 'table'; })[0]; if (!tab) return null;
    var row = tab.rows.filter(function (x) { return x[0] === name; })[0]; if (!row) return null;
    return { type: 'table', heads: tab.heads, rows: [row] };
  }

  return {
    // a page's platform specification: { standard } for a Platforms leaf, or { parts } for a foundation, pattern or structure
    pageOf: function (r) {
      if (r.sec === 'implementation' && LEAVES[r.leaf]) { var m = LEAVES[r.leaf]; return { mode: m, guide: buildGuide(m), files: FILES[m] || null, tokens: tokensFor(m), standard: standardFor(m) }; }
      var np = /^(ios|android)-/.exec(r.sec || ''); if (np) return nativePage(np[1], r.sec, r.leaf);
      var p = PARTS[r.id] || PARTS[r.sec + '|' + r.leaf];
      return p ? { parts: p.map(find).filter(Boolean) } : null;
    },
    // a component's Platforms section: its section 6 table and its functional equivalent
    of: function (r) {
      // a thin record (a leaf answered by another item's code: docsFrom) shows its main record's rows
      if (r.docsFrom && !COMPONENT[r.id] && !EQUIV[r.id]) r = { id: r.docsFrom };
      var parts = COMPONENT[r.id] ? [find(COMPONENT[r.id])].filter(Boolean) : [];
      var eq = equivalent(r);
      return parts.length || eq ? { parts: parts, equivalent: eq } : null;
    },
    find: find, standardFor: standardFor
  };
})();
