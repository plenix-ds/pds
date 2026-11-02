/* global DS, React, ReactDOM, Plenix */
/* Plenix master design spec: the UI Inventory of the one Plenix system, built only from Plenix Platform components.
   - The sidebar is the inventory's 16 primary sections (inventory-taxonomy.js); under the open section, its items.
   - Every item has its own page (#/section/item): its canonical path, level, aliases, when to use and when not, live
     examples, anatomy, variants and states (read from its CSS classes), behavior and accessibility (read from its JSX),
     its implementation (JSX, CSS, classes, tokens), related items, source-system mappings and lifecycle.
   - A section's page (#/section) shows its whole taxonomy: what Plenix has (linked) and what it does not yet.
   - The home page (#/) lists every item with filters, the placement rules and an audit of unplaced Platform exports.
   Nothing about the code is copied here: it is read from the files when a page opens (records: inventory.js; helpers:
   spec-catalog.js; foundations: the token files and the labs). */

// every stylesheet a CSS file pulls in through @import, in order: [{ file, text }] (fetched once per URL)
var SHEETS = {};
function loadSheets(url) {
  var abs = new URL(url, location.href).href;
  if (!SHEETS[abs]) SHEETS[abs] = fetch(abs, { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (text) {
    var re = /@import\s+url\(\s*["']?([^"')]+)["']?\s*\)\s*;/g, m, list = [];
    while ((m = re.exec(text))) list.push(new URL(m[1], abs).href);
    return Promise.all(list.map(loadSheets)).then(function (parts) {
      return [].concat.apply([], parts).concat([{ file: decodeURI(abs.replace(PlenixSource.src, 'platform/').replace(location.origin + '/', '')), url: abs, text: text.replace(re, '') }]);
    });
  });
  return SHEETS[abs];
}
// a stylesheet and everything it imports, as one text with absolute url()s (the button lab's frames)
var SHEET_TEXT = {};
function sheetText(url) {
  var abs = new URL(url, location.href).href;
  if (!SHEET_TEXT[abs]) SHEET_TEXT[abs] = loadSheets(abs).then(function (parts) {
    return parts.map(function (part) {
      var base = part.url;
      return part.text.replace(/url\(\s*(["']?)(?!data:|https?:|\/|#)([^"')]+)\1\s*\)/g, function (m, q, u) { return 'url("' + new URL(u, base).href + '")'; });
    }).join('\n');
  });
  return SHEET_TEXT[abs];
}

(function () {
  var TAX = window.DSTaxonomy, REC = window.DSInventory, el = DS.el, R = window.DSRender;
  // level 0: the platform the navigation pane shows (a section without one is Web), chosen in the pane's top dropdown
  var PLATFORMS = [{ value: 'web', label: 'Web' }, { value: 'ios', label: 'iOS' }, { value: 'android', label: 'Android' }];
  var platformOf = function (s) { return (s && s.platform) || 'web'; };
  var PLATFORM_KEY = 'plenix.ds.platform';
  var savedPlatform = function () { try { var v = localStorage.getItem(PLATFORM_KEY); return PLATFORMS.some(function (x) { return x.value === v; }) ? v : 'web'; } catch (e) { return 'web'; } };
  var SEC = {}; TAX.forEach(function (s) { SEC[s.id] = s; s.subList = s.subs.map(function (x) { return { name: x[0], flat: !x[0], label: x[0] || s.title, leaves: x[1].split('|') }; }); });   // a subcategory with no name: its leaves sit directly under the section (batch 325)
  var BY = {}; REC.forEach(function (r) { BY[r.id] = r; });
  // the written sections of the built items (inventory-docs.js, batch 208); a record's own fields win
  REC.forEach(function (r) {
    var d = (window.DSDocs || {})[r.id]; if (!d) return;
    if (!r.purpose) r.purpose = d.purpose;
    if (!r.anatomy) r.anatomy = d.anatomy;
    r.behavior = Object.assign({}, d.behavior, r.behavior); r.a11y = Object.assign({}, d.a11y, r.a11y); r.content = Object.assign({}, d.content, r.content);
    if (!r.related.length && d.related) r.related = d.related;
    if (!r.use.length && d.use) r.use = d.use;
    if (!r.avoid.length && d.avoid) r.avoid = d.avoid;
    if (!r.states && d.states) r.states = d.states;
  });
  // Last reviewed: the day the item's content last changed (reviewed.js, from git; §7)
  REC.forEach(function (r) { var d = (window.DSReviewed || {})[r.id]; if (d) r.reviewed = d; });
  var LEAF_ORDER = {};
  TAX.forEach(function (s) { var i = 0; s.subList.forEach(function (sub) { sub.leaves.forEach(function (l) { LEAF_ORDER[s.id + '|' + l] = i++; }); }); });
  // which record answers each leaf: its home first, then the pages that cover it
  var ANSWER = {};
  REC.forEach(function (r) { ANSWER[r.sec + '|' + r.leaf] = { rec: r, home: true }; });
  REC.forEach(function (r) {
    r.covers.forEach(function (c) {
      var k = c.indexOf('/') > 0 && SEC[c.split('/')[0]] ? c.replace('/', '|') : r.sec + '|' + c;
      if (!ANSWER[k]) ANSWER[k] = { rec: r, home: false };
    });
  });
  // the one-line description of a page the Platforms Standard writes, for its header
  function standardLead(p, leaf) {
    var name = p.standard.name, sec = p.standard.sections[0];
    if (p.mode === 'all') return 'The whole Plenix Platforms Standard: how every Plenix app looks, sizes itself, lays out its screens and moves between them on the web, iOS and Android.';
    var apn = p.apple ? p.apple.topics.reduce(function (n, t) { return n + t.symbols.length; }, 0) : 0;
    var appleNote = p.apple ? ' With Apple\u2019s references: ' + [p.apple.hig ? 'the Human Interface Guidelines (' + p.apple.hig.sections.length + ' sections)' : null, apn ? apn + ' SwiftUI symbols' : null, p.apple.frameworks.length ? p.apple.frameworks.map(function (f) { return f[0]; }).join(', ') : null].filter(Boolean).join(', ') + '.' : '';
    if (p.summary && p.summary.length) return leaf + ' on ' + name + ', from the Plenix Platforms Standard: ' + p.summary.join(', ') + '.' + appleNote;
    if (p.apple) return leaf + ' on ' + name + ': not in the Plenix Platforms Standard yet.' + appleNote;
    if (p.part === 'How to build') return 'How to build a Plenix app for ' + name + ': its implementations and controls, themes and build outputs, from the Plenix Platforms Standard.';
    if (p.part === 'Token mapping') return 'The ' + name + ' values of the Plenix tokens, each under the web token name for the same role, with its source.';
    if (p.part === 'Generated files') return 'The files a ' + name + ' app takes, generated from the Plenix tokens: never edited by hand.';
    if (p.part === 'Overview') return 'The opening of the Plenix Platforms Standard; each of its sections, for ' + name + ', is a page of its own.';
    if (p.part && sec) return 'Section ' + sec.n + ' of the Plenix Platforms Standard, ' + sec.title.toLowerCase() + ', for ' + name + ': each table with the columns and rows that apply.';
    return 'The Plenix Platforms Standard for ' + name + ': how to build for it, then every section with the columns and rows that apply.';
  }
  // a page for every leaf with no Plenix item yet: the full template, every section "Not written yet" (Plenix decision 1)
  var PLACE = [];
  TAX.forEach(function (s) { s.subList.forEach(function (sub) { sub.leaves.forEach(function (l) {
    if (ANSWER[s.id + '|' + l]) return;
    var r = { id: 'leaf-' + s.id + '-' + DS.slug(l), sec: s.id, sub: sub.name, leaf: l, title: l, placeholder: true, icon: 'document', level: 'Not decided', interaction: 'Not decided', scope: 'Not decided',
      status: 'Not in Plenix yet', owner: 'Plenix Platform', reviewed: '—', covers: [], aliases: [], use: [], avoid: [], related: [], map: [] };
    // the common ground of the enterprise design systems, written for it (inventory-guidance.js, batch 205)
    var g = (window.DSGuidance || {})[s.id + '|' + l];
    if (g) {
      r.guidance = g; r.text = g.text; r.purpose = g.purpose; r.use = g.use || []; r.avoid = g.avoid || [];
      r.map = (g.map || []).map(function (x) { return [x[0], x[1], x[2] || 'Direct', 'Common ground']; });
      r.status = 'Guidance written, not built';
    }
    // a page the Plenix Platforms Standard writes (platforms.js): its own header, not a placeholder's
    var std = window.DSPlatforms && window.DSPlatforms.pageOf(r);
    if (std && std.standard) {
      r.standardPage = true; r.icon = 'phone'; r.level = s.title + (sub.name ? ' · ' + sub.name : ''); r.status = std.summary && !std.summary.length && std.apple ? 'Apple references' : 'Platforms Standard';
      r.text = standardLead(std, l);
    }
    PLACE.push(r); BY[r.id] = r; ANSWER[s.id + '|' + l] = { rec: r, home: true, placeholder: !r.standardPage };
  }); }); });
  // the sidebar row of a leaf, and the row that marks a page as current (its home leaf)
  var rowId = function (sid, sub, leaf) { return 'leaf:' + sid + '|' + sub + '|' + leaf; };
  // SIDEBAR_LISTS_EVERY_LEAF = true (read by check-spec.js: Plenix decision 1)
  // a component's variant pages (r.variantPages): find one by its item (leaf) or by its slug; its address
  var variantPageOf = function (r, leaf, slug) { return r && r.variantPages ? r.variantPages.filter(function (v) { return leaf ? v.leaf === leaf : DS.slug(v.leaf) === slug; })[0] || null : null; };
  var vhref = function (r, vp) { return '#/' + r.sec + '/' + r.id + '/v/' + DS.slug(vp.leaf); };
  var recordsOf = function (sid) { return REC.filter(function (r) { return r.sec === sid; }).sort(function (a, b) { return (LEAF_ORDER[sid + '|' + a.leaf] || 0) - (LEAF_ORDER[sid + '|' + b.leaf] || 0); }); };
  var href = function (r) { return '#/' + r.sec + '/' + r.id; };
  // an item's interaction types: one, or several by use (Dashboard: Selection, Drag and drop; owner 2026-10-21)
  var interOf = function (r) { return [].concat(r.interaction || []); };
  var interText = function (r) { return interOf(r).join(', '); };
  var LEVELS = ['Foundation', 'Token', 'Primitive', 'Component', 'Composite', 'Pattern', 'Page structure', 'Template', 'Utility'];

  /* ── what the code says: classes, states, tokens, accessibility ── */
  var IMPORTS = R.text('platform.css').then(function (t) { var re = /@import\s+url\("([^"]+)"\)/g, m, out = []; while ((m = re.exec(t))) out.push(m[1]); return out; });
  /* while the reader is idle, fetch every item page's source files once (the fetches are kept in memory), so opening any
     item shows its JSX, CSS and classes at once instead of waiting for the network */
  function warmSources() {
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 200); };
    var queue = REC.slice();
    var next = function () {
      var batch = queue.splice(0, 6); if (!batch.length) return;
      Promise.all(batch.map(function (r) {
        var files = r.src ? [r.src].concat(r.also || []) : [];
        return Promise.all(files.map(R.text).concat([cssFilesOf(r).then(function (cf) { return Promise.all(cf.map(R.text)); }), r.src ? R.header(r.src) : null]));
      })).then(function () { idle(next); }, function () { idle(next); });
    };
    idle(next);
  }
  function cssFilesOf(r) {
    // a page that documents several components (cssAlso) also reads the stylesheets of the others (its `also` files)
    var dirs = (r.src ? [r.src] : []).concat(r.cssAlso ? r.also || [] : []).map(function (f) { return f.replace(/[^/]+$/, ''); }).filter(function (d, i, a) { return d && a.indexOf(d) === i; });
    if (r.css && !r.cssAlso) return Promise.resolve(r.css);
    if (!dirs.length) return Promise.resolve(r.css || []);
    return IMPORTS.then(function (all) {
      var found = all.filter(function (f) { return dirs.slice(r.css ? 1 : 0).some(function (d) { return f.indexOf(d) === 0; }); });
      return (r.css || []).concat(found.filter(function (f) { return (r.css || []).indexOf(f) < 0; }));
    });
  }
  function classesOf(cssText) {
    var css = cssText.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\([^)]*\)/g, ''), found = {}, states = {}, re = /([^{}]+)\{/g, m;
    while ((m = re.exec(css))) {
      var sel = m[1].trim(); if (/^@/.test(sel)) continue;
      (sel.match(/\.(plx-[\w-]+|is-[\w-]+)/g) || []).forEach(function (c) { c = c.slice(1); found[c] = (found[c] || 0) + 1; });
      (sel.match(/:(hover|focus-visible|focus-within|focus|active|disabled|checked|indeterminate|placeholder-shown|first-child|last-child)|\[(aria-[\w-]+)[^\]]*\]|\[(data-[\w-]+)[^\]]*\]/g) || []).forEach(function (s) { states[s] = (states[s] || 0) + 1; });
    }
    var kinds = { block: [], element: [], modifier: [], state: [] };
    Object.keys(found).sort().forEach(function (c) { (/^is-/.test(c) ? kinds.state : /--/.test(c) ? kinds.modifier : /__/.test(c) ? kinds.element : kinds.block).push(c); });
    return { kinds: kinds, all: found, pseudo: Object.keys(states) };
  }
  function tokensOf(cssText) {
    var declared = {}, used = {}, m, re1 = /(--plx-comp-[\w-]+)\s*:/g, re2 = /var\(\s*(--plx-[\w-]+)/g;
    while ((m = re1.exec(cssText))) declared[m[1]] = 1;
    while ((m = re2.exec(cssText))) used[m[1]] = (used[m[1]] || 0) + 1;
    return { declared: Object.keys(declared).sort(), used: Object.keys(used).sort() };
  }
  function a11yOf(jsxText) {
    var roles = {}, aria = {}, keys = {}, m;
    var r1 = /role[=:]\s*\{?["']([\w-]+)["']/g, r2 = /['"]?(aria-[\w-]+)['"]?\s*[=:]/g, r3 = /(?:e|ev|event)\.key\s*===\s*['"]([\w ]+)['"]|['"](Arrow(?:Up|Down|Left|Right)|Home|End|Escape|Enter|Tab|PageUp|PageDown)['"]/g;
    while ((m = r1.exec(jsxText))) roles[m[1]] = 1;
    while ((m = r2.exec(jsxText))) aria[m[1]] = 1;
    while ((m = r3.exec(jsxText))) keys[(m[1] || m[2]).replace(' ', 'Space')] = 1;
    if (/focus-visible|\.focus\(\)/.test(jsxText)) keys.Focus = 1;
    return { roles: Object.keys(roles).sort(), aria: Object.keys(aria).sort(), keys: Object.keys(keys).filter(function (k) { return k !== 'Focus'; }).sort(), focus: !!keys.Focus };
  }

  /* ── foundations: token families (read from the token files) ── */
  var DATA = DS.loadTokens(PlenixSource.src).then(function (text) { return DS.parse(text); });
  var FAMILY_LEADS = { COLOR: 'One palette: --plx-ref-color-{family}-{shade}; each family runs darkest to lightest, a higher number is darker. Black and white belong to Gray. In light mode, text, the tooltip, the toast, the status bar, the data-grid text and the scrim use gray-900, never pure black. Black stays only where a role needs it: the dark canvas and its sunken surface, media surfaces, the text on the light category colors, inverse text in dark mode, and shadows (black at low opacity). Each sample is a 120px bar. Components never use these directly: the theme (platform/system/themes/default.css) maps them to roles.',
    TYPOGRAPHY: 'DM Sans for all interface text: body, headings, buttons, labels, menus, names, descriptions, statuses and what people type. Reddit Mono only where fixed width helps, by the kind of the value, not the element: code, token names, hex values and logs (--plx-sys-font-code), and technical values: IDs, file names and paths, versions, dates and times, sizes, counts, durations, measured percentages and coordinates (--plx-sys-font-data), in table cells and property-list values too. The data role is the only way to Reddit Mono outside code: a DataGrid or Table column of kind "data", a PropertyList item marked data, Text variant "data", an Input with data, and a Select or Combobox whose chosen value is wholly a number, a date, a time, a size, a version, a file name or an ID (its data prop forces the data font on or off). Reddit Mono takes the size and line height of the text beside it, so the two share a baseline (Platforms Standard 3.4).' };
  function familiesOf(data) {
    var fam = {};
    data.groups.forEach(function (g) { var f = g.title.split(':')[0].trim(); (fam[f] = fam[f] || []).push(g); });
    if (fam.COLOR) {
      // the palette's families (owner, 2026-10-15, the palette consolidation: docs/color-consolidation/): one reference
      // palette of conventional families and numeric shades; a token's family is its name. A retired token is a deprecated
      // alias of its canonical destination (a var() value) and is not listed. Each family runs darkest to lightest (OKLCH
      // lightness), the families in hue order
      var NAME = { red: 'Red', maroon: 'Red', pink: 'Pink', magenta: 'Magenta', purple: 'Purple', lavender: 'Purple', blue: 'Blue', navy: 'Blue', cyan: 'Cyan', teal: 'Teal',
        green: 'Green', lime: 'Green', mint: 'Green', olive: 'Yellow', yellow: 'Yellow', orange: 'Orange', apricot: 'Orange', brown: 'Brown', beige: 'Yellow', grey: 'Gray', gray: 'Gray', black: 'Gray', white: 'Gray', slate: 'Slate' };
      // Slate (owner, 2026-10-29, issue 637): the blue-gray family, beside Gray among the neutrals
      var ORDER = ['Gray', 'Slate', 'Red', 'Pink', 'Magenta', 'Orange', 'Brown', 'Yellow', 'Green', 'Teal', 'Cyan', 'Blue', 'Purple', 'Transparent'];
      var lin = function (c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      var oklch = function (hex) {
        var m6 = /^#([0-9a-f]{6})/i.exec(String(hex || '').trim()); if (!m6) return null;
        var r = lin(parseInt(m6[1].slice(0, 2), 16)), g = lin(parseInt(m6[1].slice(2, 4), 16)), b = lin(parseInt(m6[1].slice(4, 6), 16));
        var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), q = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
        var L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * q, A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * q, B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * q;
        var H = Math.atan2(B, A) * 180 / Math.PI; return { L: L, C: Math.sqrt(A * A + B * B), H: H < 0 ? H + 360 : H };
      };
      var groups = {}, all = [];
      fam.COLOR.forEach(function (g) { g.tokens.forEach(function (t) { all.push(t); }); });
      data.groups.forEach(function (g) { if (g.title.split(':')[0].trim() !== 'COLOR') g.tokens.forEach(function (t) { if (/^color-category-/.test(t.name) && !all.some(function (x) { return x.name === t.name; })) all.push(t); }); });
      all.forEach(function (t) {
        var nm = /^color-(?:category-)?([a-z]+)/.exec(t.name), o = oklch(t.value);
        var k = /alpha/.test(t.name) || !nm ? 'Transparent' : (NAME[nm[1]] || nm[1].charAt(0).toUpperCase() + nm[1].slice(1));
        if (String(t.value || '').trim().indexOf('var(') === 0) return;   // a deprecated alias of a canonical color
        (groups[k] = groups[k] || []).push({ name: t.name, full: t.full, value: t.value, shade: o ? -o.L : 0 });
      });
      var seen = ORDER.filter(function (k) { return groups[k]; }).concat(Object.keys(groups).filter(function (k) { return ORDER.indexOf(k) < 0; }));
      fam.COLOR = seen.map(function (k) { return { title: 'COLOR: ' + k + ' (' + groups[k].length + ')', tokens: groups[k].sort(function (x, y) { return y.shade - x.shade; }) }; });
    }
    return fam;
  }
  function renderFamily(name, groups, data, s) {
    if (FAMILY_LEADS[name]) s.appendChild(el('p', 'ds-lead', FAMILY_LEADS[name]));
    if (name === 'TYPOGRAPHY') {
      var tf = el('div', 'ds-group'); tf.appendChild(el('h3', '', 'Typefaces'));
      groups.forEach(function (g) { g.tokens.forEach(function (t) {
        if (!/^font-(sans|mono)$/.test(t.name)) return;
        var bx = el('div', 'ds-specimen'); DS.sample(bx, 'font-family', 'var(--' + t.full + ')');
        bx.appendChild(el('div', 'ds-specimen-name', t.value.split(',')[0].replace(/["']/g, ''))); bx.appendChild(el('div', 'ds-specimen-big', 'Aa'));
        ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '0123456789 !?&@#%()'].forEach(function (l) { bx.appendChild(el('div', 'ds-specimen-line', l)); });
        ['regular-400', 'medium-500', 'semibold-600', 'bold-700'].forEach(function (w) { var r = el('div', 'ds-specimen-weight', w.charAt(0).toUpperCase() + w.slice(1).replace('-', ' ') + ' — The quick brown fox jumps over the lazy dog'); DS.sample(r, 'font-weight', 'var(--plx-ref-font-weight-' + w + ')'); bx.appendChild(r); });
        bx.appendChild(el('div', 'ds-file', '--' + t.full)); tf.appendChild(bx);
      }); });
      s.appendChild(tf);
    }
    if (name === 'RADIUS' && window.DSRadiusLab) { window.DSRadiusLab(s, data); return; }
    if (name === 'MOTION' && window.DSMotionLab) { window.DSMotionLab(s, data); return; }
    groups.forEach(function (g) {
      var grp = el('div', 'ds-group'), sub = g.title.split(':')[1];
      grp.appendChild(el('h3', '', (name.charAt(0) + name.slice(1).toLowerCase()) + (sub ? ': ' + sub.trim() : '')));
      if (g.tokens.every(function (t) { return /^opacity-/.test(t.name); })) { grp.appendChild(DS.opacityTable(g.tokens, [['Platform', loadSheets(PlenixSource.at('platform.css'))]])); s.appendChild(grp); return; }
      // pictures for the layout families (batch 168): drawn like the spacing scale (bars) and the grid (column stripes)
      var px = function (t) { var m = /(-?\d+(?:\.\d+)?)px/.exec(t.value) || /-(\d+)px\)?$/.exec(t.value) || /-(\d+)(px)?$/.exec(t.name); return m ? parseFloat(m[1]) : NaN; };
      var every = function (re) { return g.tokens.every(function (t) { return re.test(t.name); }); };
      var measure = function (draw) {   // a table of token, value and its picture
        var mt = DS.grid(['Token', 'Value', 'Picture'], g.tokens.map(function (t) {
          var pc = el('span', 'ds-space-viz'); draw(t, pc);
          return ['--' + t.full, el('span', 'ds-space-val', isNaN(px(t)) ? t.value : px(t) + (/columns/.test(t.name) ? '' : 'px')), pc];
        }));
        grp.appendChild(mt); s.appendChild(grp);
      };
      var maxPx = Math.max.apply(null, g.tokens.map(px).filter(function (v) { return !isNaN(v); }));
      if (every(/^grid-columns-/)) { measure(function (t, c) { var cols = el('div', 'ds-lay-cols'); var n = parseInt(t.value, 10) || 0; DS.sample(cols, 'grid-template-columns', 'repeat(' + n + ', minmax(0, 1fr))'); for (var i = 0; i < n; i++) cols.appendChild(el('span')); c.appendChild(cols); }); return; }
      if (every(/^grid-(gutter|margin)-/)) { measure(function (t, c) { var b = el('span', 'ds-space-bar'); DS.sample(b, 'width', 'var(--' + t.full + ')'); c.appendChild(b); }); return; }
      if (every(/^content-max-|breakpoint|-below$/)) { measure(function (t, c) { var b = el('span', 'ds-space-bar'); DS.sample(b, 'width', (px(t) / maxPx * 100) + '%'); c.appendChild(b); }); return; }
      if (every(/^icon-size/)) { measure(function (t, c) { var w = document.createElement('span'); w.innerHTML = DS.icon('folder'); var i = w.firstChild; DS.setVar(i, '--plx-comp-icon-size', 'var(--' + t.full + ')'); c.appendChild(i); }); return; }
      if (every(/^shell-header-height$/)) { measure(function (t, c) { var f = el('div', 'ds-shell-mini'), hd = el('div', 'ds-shell-mini__head'); DS.sample(hd, 'block-size', 'var(--' + t.full + ')'); f.appendChild(hd); f.appendChild(el('div', 'ds-shell-mini__body')); c.appendChild(f); }); return; }
      if (g.tokens.every(function (t) { return /^(space|size)-/.test(t.name); })) {
        var st = DS.grid(['Token', 'Value', 'Size'], g.tokens.map(function (t) {
          var bc = el('span', 'ds-space-viz'), blk = el('span', 'ds-space-bar'); DS.sample(blk, 'width', 'var(--' + t.full + ')'); bc.appendChild(blk);
          return ['--' + t.full, el('span', 'ds-space-val', String(parseFloat(t.value) || t.value)), bc];
        }));
        grp.appendChild(st); s.appendChild(grp); return;
      }
      // one data grid per family (the owner, batch 188): the token and its value as text, then its rendering on its own
      var gridRows = [];
      g.tokens.forEach(function (t) {
        var card = el('span', 'ds-token-render'), v = 'var(--' + t.full + ')';
        gridRows.push(['--' + t.full, t.value, card]);
        if (DS.kind(t.name, t.value) === 'color') { var sw = el('div', 'ds-swatch'); DS.setVar(sw, '--ds-sample-background-color', v); card.appendChild(sw); }
        else if (/^font-size-/.test(t.name)) { var ty = el('div', 'ds-type', 'Aa Bb 123'); DS.sample(ty, 'font-size', v); card.appendChild(ty); }
        else if (/^font-(sans|mono|body|heading|label|code|data)$/.test(t.name)) { var t2 = el('div', 'ds-type', 'The quick brown fox'); DS.sample(t2, 'font-family', v); card.appendChild(t2); }
        else if (/^symbol-/.test(t.name)) { var sy = el('div', 'ds-type', '× ★ ⇪'); DS.sample(sy, 'font-size', v); card.appendChild(sy); }
        else if (/^line-height-/.test(t.name)) { var lh = el('div', 'ds-phrase', 'The quick brown fox jumps over the lazy dog, then turns around and jumps back again.'); DS.sample(lh, 'line-height', v); card.appendChild(lh); }
        else if (/^letter-spacing-/.test(t.name)) { var ls = el('div', 'ds-phrase ds-phrase-one', 'The quick brown fox jumps'); DS.sample(ls, 'letter-spacing', v); card.appendChild(ls); }
        else if (/^font-weight-/.test(t.name)) { var tw = el('div', 'ds-type', 'Weight ' + t.value); DS.sample(tw, 'font-weight', v); card.appendChild(tw); }
        else if (/^(space|size)-/.test(t.name)) { var bar = el('div', 'ds-bar'); DS.sample(bar, 'width', v); card.appendChild(bar); }
        else if (/^border-style-/.test(t.name)) { var bst = el('div', 'ds-box'); DS.sample(bst, 'border-style', v); DS.sample(bst, 'border-width', 'var(--plx-ref-border-width-2px)'); card.appendChild(bst); }
        else if (/^border-width-/.test(t.name)) { var bw = el('div', 'ds-box'); DS.sample(bw, 'border-width', v); DS.sample(bw, 'border-style', 'solid'); card.appendChild(bw); }
      });
      grp.appendChild(DS.grid(['Token', 'Value', 'Rendering'], gridRows, { labelled: true })); s.appendChild(grp);
    });
  }

  /* ── the layout lab's sections, built once and moved onto the page that shows them ── */
  var LAB = null;
  function labSection(id, data) {
    if (!LAB && window.DSLayoutLab) {
      LAB = {};
      window.DSLayoutLab({ data: data, section: function (sid, title, lead, file) {
        var s = el('div', 'ds-lab-part'); s.id = sid; s.appendChild(el('h3', 'ds-block-title', title));
        if (file) s.appendChild(el('div', 'ds-file', file)); if (lead) s.appendChild(el('p', 'ds-lead', lead));
        LAB[sid] = s; return s;
      } });
    }
    return LAB && LAB[id];
  }

  /* the token families and lab sections of a page, cut into parts: each inner card (.ds-group, .ds-table-card,
     .ds-motion-block) becomes its own card on the page, with its own row in "On this page"; the text before them (a
     section's file and lead, a family's lead) becomes an "Overview" part. [{ id, title, node }] */
  var CARD = /(^|\s)(ds-group|ds-table-card|ds-motion-block)(\s|$)/;
  function partsOf(container, prefix) {
    var parts = [], intro = null, n = 0;
    var titleOf = function (c) { var t = c.querySelector(':scope > h3, :scope > .ds-table-title'); var x = t ? t.textContent : 'Part'; if (t) t.remove(); return x; };
    // each table becomes a data grid named by its card's title (batch 226)
    var grids = function (node, title) { var ts = node.tagName === 'TABLE' ? [node] : [].slice.call(node.querySelectorAll ? node.querySelectorAll('table') : []); ts.forEach(function (x, i) { DS.table(x, { label: title + (ts.length > 1 ? ' ' + (i + 1) : '') }); });
      var gs = [].slice.call(node.querySelectorAll ? node.querySelectorAll('.ds-grid') : []).filter(function (x) { return x.dsPending; }); gs.forEach(function (x, i) { x.dsLabel = title + (gs.length > 1 ? ' ' + (i + 1) : ''); }); };
    var lift = function (c, title) { c.classList.add('ds-lifted'); var w = el('div', 'ds-specimens'); w.appendChild(c); grids(w, title); return w; };
    var addIntro = function (title, node) { if (!intro) { intro = { id: prefix + '-' + (n++), title: title, node: el('div', 'ds-specimens') }; parts.push(intro); } intro.node.appendChild(node); grids(node, title); };
    [].slice.call(container.children).forEach(function (c) {
      if (CARD.test(c.className)) { intro = null; var tc = titleOf(c); parts.push({ id: prefix + '-' + (n++), title: tc, node: lift(c, tc) }); return; }
      if (/ds-lab-part/.test(c.className)) {
        var head = c.querySelector(':scope > .ds-block-title'), title = head ? head.textContent : 'Overview'; if (head) head.remove();
        intro = null;
        [].slice.call(c.children).forEach(function (k) {
          if (CARD.test(k.className)) { intro = null; var tk = titleOf(k); parts.push({ id: prefix + '-' + (n++), title: tk, node: lift(k, tk) }); }
          else addIntro(title, k);
        });
        intro = null; return;
      }
      addIntro('Overview', c);
    });
    return parts;
  }
  // a DOM node (a lab's specimen) placed inside a React card
  function DomSlot(p) { var ref = useRef(null); useEffect(function () { var n = ref.current; if (n && p.node && p.node.parentNode !== n) { n.innerHTML = ''; n.appendChild(p.node); } }); return h('div', { ref: ref }); }
  var PARTS = {};
  function pagePartsOf(key, fill) { if (!PARTS[key]) PARTS[key] = DATA.then(function (d) { var c = el('div'); fill(c, d); return partsOf(c, 'p-' + key); }); return PARTS[key]; }
  var partCard = function (x) { return h(SPanel, { key: x.id, id: 'sec-' + x.id, title: x.title }, h(DomSlot, { node: x.node })); };

  /* ───────────────────────── the spec, built from the Platform ─────────────────────────
     Everything visible on this page is a Platform component: the AppShell with the universal header, the NavPane with
     the Tree, the StatusBar, RecordPage.Header, Breadcrumbs, Panel, PropertyList (every key and value), Table, List (when to
     use and not), Tag and Chip, Tabs, CodeBlock and Button. Only the token specimens and the labs (swatches, scales,
     motion lanes) draw their own pictures, inside a Panel. */
  var h = React.createElement, P = window.Plenix, useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  var go = function (to) { location.hash = to; };
  // every card of the spec opens and closes (the owner, 2026-10-06); Details and Lifecycle starts closed
  // a page's card; a card that has a row in "On this page" carries that row's icon before its title (owner, 2026-10-09), from
  // the same list the pane draws (TocIcons, given by OnThisPage)
  var TocIcons = React.createContext({});
  // a sub-section inside a card (Guidelines, Specification): a titled section without a frame, so the tables in it keep
  // their own border (two frames deep, never three; owner, 2026-10-09)
  function SSub(p) {
    return h(P.CollapsibleSection, { title: p.title, headingLevel: p.headingLevel === 2 ? 3 : (p.headingLevel || 3) },
      p.description ? h(P.Text, { as: 'p', variant: 'secondary' }, p.description) : null, p.children);
  }
  function SPanel(p) {
    var icons = React.useContext(TocIcons), key = String(p.id || '').replace(/^sec-/, '');
    return h(P.Panel, Object.assign({ collapsible: true, defaultExpanded: !/^Details/.test(p.title || ''), icon: icons[key] }, p));
  }
  var Stack = function (p) { return h('div', { className: 'ds-stack' }, p.children); };
  // a note of two or more sentences reads as points, one sentence each (owner, 2026-10-16); one sentence stays a line
  var Note = function (p) { var parts = typeof p.children === 'string' ? sentencesOf(p.children) : [];
    return parts.length > 1 ? h('div', { className: 'ds-note-text' }, bulletList(parts)) : h('p', { className: 'ds-note-text' }, p.children); };
  var Link = function (p) { return h(P.Link, { href: p.href }, p.children); };
  var Mono = function (p) { return h(P.Text, { variant: 'data' }, p.children); };
  // a list of names (tokens, classes, attributes, states) is always pills (owner, 2026-10-10: one look everywhere): a name
  // with a page (a token, a class whose component is known) is a Chip that opens it; any other name is a Tag. An empty
  // list shows "—". A class pill keeps its anchor (cls-<name>) for #…/cls/<name>.
  function lines(list, empty, kind, label) {
    if (!list.length) return empty === undefined || empty === null ? '—' : empty;
    return h(P.TagList, { label: label || undefined }, list.map(function (x) {
      var to = kind === 'token' ? tokenHref(x) : kind === 'class' ? classHref(x) : null, id = kind === 'class' ? 'cls-' + x : undefined;
      return to ? h(P.Chip, { key: x, id: id, onClick: function () { go(to); } }, x) : h(P.Tag, { key: x, id: id }, x);
    }));
  }
  // every token has a page (#/foundations/token/<name>), read from platform/tokens/tokens.index.json (build-tokens.js)
  var TOKENS = null;
  var tokenIndex = function () { if (!TOKENS) TOKENS = R.text('tokens/tokens.index.json').then(function (t) { var by = {}; JSON.parse(t).tokens.forEach(function (x) { by[x.name] = x; }); return by; }); return TOKENS; };
  // the index, kept once loaded, so a value can be resolved while drawing
  var TOKIDX = null; tokenIndex().then(function (by) { TOKIDX = by; });
  var resolvedOf = function (v) {   // a value as written -> its value in light at standard density (references resolved)
    var m = /^var\((--plx-[a-z0-9-]+)\)$/.exec(String(v).trim()); if (!m || !TOKIDX || !TOKIDX[m[1]]) return v;
    var r = TOKIDX[m[1]].resolved; return r.all != null ? r.all : (r['light/standard'] || v);
  };
  /* the value drawn (the owner: always the visual and its text): a color swatch, a size bar, a corner, a shadow, an
     opacity, a type sample or a duration bar, chosen from the value and, when given, the name or property it belongs to */
  function ValueVisual(p) {
    var v = String(resolvedOf(p.value) || '').trim(), n = p.name || '';
    if (!v || v === '—') return null;
    var box = function (kind, prop, value) { return h('span', { 'aria-hidden': 'true', className: 'ds-vis ds-vis--' + kind + ' ' + DS.sampleClass(prop, value) }); };
    var type = function (prop, value) { return h('span', { 'aria-hidden': 'true', className: 'ds-vis ' + DS.sampleClass(prop, value) + (prop === 'font-size' ? ' ds-vis--type-size' : '') }, 'Aa'); };
    var px = (function () { var m = /^(-?\d*\.?\d+)(px|rem)$/.exec(v); return m ? parseFloat(m[1]) * (m[2] === 'rem' ? 16 : 1) : NaN; })();
    if (/shadow/.test(n) || /\d+px[^,]*(rgba?\(|#)/.test(v)) return box('shadow', 'box-shadow', v);
    if (/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|transparent$)/i.test(v)) return box('color', 'background-color', v);
    if (/radius/.test(n) && !isNaN(px)) return box('radius', 'border-radius', v);
    if (/opacity/.test(n) && /^0?\.\d+$|^1$/.test(v)) return box('opacity', 'opacity', v);
    if (/font-weight/.test(n) || (/weight/.test(n) && /^\d{3}$/.test(v))) return type('font-weight', v);
    if (/font-(family|sans|mono|body|heading|label|code|data)/.test(n) || /,\s*(sans-serif|serif|monospace)/.test(v)) return type('font-family', v);
    if (/font-size/.test(n) && !isNaN(px)) return type('font-size', v);
    if (/^\d*\.?\d+m?s$/.test(v)) { var ms = parseFloat(v) * (/ms$/.test(v) ? 1 : 1000); return box('duration', 'inline-size', Math.min(240, Math.max(2, ms / 4)) + 'px'); }
    if (!isNaN(px) && px > 0) return box('length', 'inline-size', Math.min(240, px) + 'px');
    return null;
  }
  // a value with its picture after it, on the right as in every table (the text keeps its token links)
  function ValueCell(p) { return h('span', { className: 'ds-value-cell' }, h('span', { className: 'ds-value-cell__text' }, dataValue(p.value)), h(ValueVisual, { value: p.value, name: p.name })); }
  // a file shown by its name; the whole path is its tooltip
  function FileName(p) { return h(P.Text, { variant: 'data', title: p.path, className: 'plx-u-ws-nowrap' }, String(p.path).split('/').pop()); }
  var tokenHref = function (name) { return '#/foundations/token/' + name.replace(/^--/, ''); };
  function TokenLink(p) { return h(P.Link, { href: tokenHref(p.name), className: 'ds-code-link' }, p.name); }
  // the component a class belongs to: a record's own blocks first, then the folder its source lives in (FilterBar -> plx-filter-bar)
  var kebab = function (n) { return n.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(); };
  var CLASS_OWNER = {};
  REC.forEach(function (r) { (r.blocks || []).forEach(function (b) { if (!CLASS_OWNER[b]) CLASS_OWNER[b] = r; }); });
  REC.forEach(function (r) { if (r.src) { var b = 'plx-' + kebab(r.src.split('/').slice(-2)[0]); if (!CLASS_OWNER[b]) CLASS_OWNER[b] = r; } });
  var ownerOf = function (cls) { var b = cls.replace(/^\./, '').split(/__|--/)[0]; return CLASS_OWNER[b] || null; };
  var classHref = function (cls) { var o = ownerOf(cls); return o ? href(o) + '/cls/' + cls : null; };
  function ClassLink(p) { var to = classHref(p.cls); return to ? h(P.Link, { href: to, className: 'ds-code-link' }, p.cls) : p.cls; }
  // a text with token names in it: each name a link
  // a value as written (a var() or calc() of tokens) is technical data: all of it in the data font, its token names as links
  var dataValue = function (t) { return h(P.Text, { variant: 'data' }, linkify(t)); };
  var linkify = function (t) {
    if (typeof t !== 'string' || t.indexOf('--plx-') < 0) return t;
    return h('span', null, t.split(/(--plx-[a-z0-9-]*[a-z0-9])/).map(function (x, i) { return i % 2 ? h(TokenLink, { key: i, name: x }) : x; }));
  };
  // every key and value is the defined data grid (owner, 2026-10-09: "they should all be in" the DataGrid's look): rows
  // [name, value, technical?]; a header row (heads, default Name / Value), the names are the row header, values wrap and may
  // be React content
  function props(rows, label, heads) {
    var list = rows.filter(Boolean), hd = heads || ['Name', 'Value'];
    // consistency (owner, 2026-10-16): one value drawn as points makes every value of the table points
    var listy = list.some(function (r) { return !r[2] && (isList(r[1]) || (typeof r[1] === 'string' && sentencesOf(r[1]).length > 1)); });
    return h(P.Table, { label: label || (list[0] ? String(list[0][0]) + ' and more' : 'Details'), headerMenu: false,
      data: list.map(function (r, i) { return { id: i, name: String(r[0]), value: typeof r[1] === 'string' || typeof r[1] === 'number' ? String(r[1]) : '' }; }),
      columns: [{ title: hd[0], field: 'name', kind: 'wrap', rowLabel: true, width: '--plx-ref-size-240px', sortable: false },
        { title: hd[1], field: 'value', kind: 'wrap', sortable: false, render: function (d) { var r = list[d.id]; return r ? (r[2] ? h(P.Text, { variant: 'data' }, r[1]) : listy ? asPoints(r[1]) : points(r[1])) : null; } }] });
  }
  // a text of several sentences reads as points (owner, 2026-10-15: "split it into bullet points … everywhere in the
  // DS"; 2026-10-16: whatever its length): two or more sentences become a list, one sentence each.
  // Sentences end at . ! or ? followed by a space and a capital, a quote or a parenthesis, never inside parentheses, so
  // "e.g. a value" and "(owner, 2026-10-14, docs/pills-and-colors.md)" stay whole
  function sentencesOf(t) {
    var out = [], cur = '', depth = 0;
    for (var i = 0; i < t.length; i++) {
      var ch = t.charAt(i); cur += ch;
      if (ch === '(') depth++; else if (ch === ')') depth = Math.max(0, depth - 1);
      // a sentence may also start with a file or token name (build-tokens.js, platform/tokens/…, --plx-…)
      if (depth === 0 && /[.!?]/.test(ch) && t.charAt(i + 1) === ' ' && (/[A-Z"“(]/.test(t.charAt(i + 2)) || /^(--[a-z]|[a-z][\w-]*[./][\w*])/.test(t.slice(i + 2, i + 40))) &&!/(e.g|i.e|etc|vs).$/i.test(cur)) { out.push(cur.trim()); cur = ''; }
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
  }
  function bulletList(parts) { return h(P.List, { variant: 'bullets', items: parts.map(function (x) { return { children: linkify(x) }; }) }); }
  var isList = function (v) { return !!(v && v.type === P.List) || (Array.isArray(v) && v.length > 1 && v.every(function (x) { return typeof x === 'string'; })); };
  function points(t) {
    if (typeof t !== 'string') return t;
    var parts = sentencesOf(t);
    return parts.length < 2 ? linkify(t) : bulletList(parts);
  }
  // a value as points even when it is one sentence (a table whose other values are points)
  function asPoints(v) { if (typeof v === 'string' && v && v !== '—') return bulletList(sentencesOf(v)); if (isList(v) && Array.isArray(v)) return bulletList(v); return v; }
  function table(caption, heads, rows, list) {
    // a DataGrid: the first column names each row (the row header), unless the table is a plain list of records (list
    // true); cells may be React content (render) and wrap
    var cols = heads.map(function (x, i) { return { title: x, field: 'c' + i, kind: 'wrap', rowLabel: !list && i === 0, width: !list && i === 0 ? '--plx-ref-size-240px' : undefined, render: function (row) { return row['c' + i]; } }; });
    return h(P.Table, { label: caption, columns: cols, data: rows.map(function (r, i) { var o = { id: i }; r.forEach(function (v, j) { o['c' + j] = v; }); return o; }) });
  }
  /* the Platforms Standard (platform/standards/platforms.md, read by build-platforms.js into window.DSStandard; where each
     part shows: platforms.js, batch 297). Inline Markdown renders as written: code, bold, links. */
  function md(text) {
    if (typeof text !== 'string') return text;
    var out = [], re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g, last = 0, m, k = 0;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      if (m[1] != null) out.push(h(P.Text, { key: k++, as: 'code', variant: 'data' }, m[1]));
      else if (m[2] != null) out.push(h('strong', { key: k++ }, m[2]));
      else out.push(h(P.Link, { key: k++, href: m[4], external: m[4].charAt(0) !== '#' }, m[3]));
      last = re.lastIndex;
    }
    if (last < text.length) out.push(text.slice(last));
    return out.length === 1 ? out[0] : out;
  }
  var plSub = function (t, first) { return h(P.Text, { key: 'h' + t, as: 'h3', variant: 'label', className: first ? undefined : 'plx-u-mt-stack-md' }, t); };
  // one block of the standard: a paragraph, a list or a table (every table a Plenix table, its first column the row header)
  function stdBlock(b, i, caption) {
    if (b.type === 'p') return h(P.Text, { key: i, as: 'p' }, md(b.text));
    if (b.type === 'list') return h(P.List, { key: i, label: caption + ' rules', items: b.items.map(function (x) { return { children: md(x) }; }) });
    return h(React.Fragment, { key: i }, table(caption, b.heads.map(function (x) { return String(md(x) && x.replace(/\*\*|`/g, '')); }), b.rows.map(function (r) { return r.map(md); })));
  }
  /* the Plenix Styling Standard (platform/standards/styling.md, read by build-platforms.js into window.DSStyling): one
     panel on 14 › Engineering guidance › CSS architecture, its sections in order. Lists nest one level, keep their
     numbers, and code shows as code. */
  function stylingItems(items) { return items.map(function (x) { return { children: md(x.after ? x.text + ' ' + x.after : x.text), items: x.items && stylingItems(x.items), ordered: x.items ? false : undefined, variant: x.items ? 'bullets' : undefined }; }); }
  function stylingBlock(b, i, caption) {
    if (b.type === 'code') return h(P.CodeBlock, { key: i, language: b.lang || 'auto' }, b.text);
    if (b.type === 'list') return h(P.List, { key: i, label: caption, variant: b.ordered ? 'icons' : 'bullets', ordered: b.ordered || undefined, items: stylingItems(b.items) });
    if (b.type === 'p' && b.quote) return h(P.Notice, { key: i, tone: 'info' }, md(b.text));
    return stdBlock(b, i, caption);
  }
  function StylingView() {
    var st = window.DSStyling; if (!st) return null;
    var part = function (title, blocks, first, key) { return h(React.Fragment, { key: key }, plSub(title, first), (blocks || []).map(function (b, i) { return stylingBlock(b, key + i, title); })); };
    return h(SPanel, { key: 'styling', title: st.title, description: 'The whole standard (platform/standards/styling.md). The checks in its section 13 enforce it.' },
      h(Stack, null, st.lead.map(function (b, i) { return stylingBlock(b, 'lead' + i, st.title); }),
        st.sections.map(function (sc, i) { var t = (sc.n ? sc.n + '. ' : '') + sc.title; return h(React.Fragment, { key: 'sty' + i }, part(t, sc.blocks, false, 'sty' + i), (sc.subs || []).map(function (x, j) { return part((x.n ? x.n + ' ' : '') + x.title, x.blocks, false, 'sty' + i + '-' + j); })); })));
  }
  function stdPart(x, first) {
    var name = (x.n ? x.n + ' ' : '') + x.title;
    return [plSub(name, first), (x.blocks || []).map(function (b, i) { return stdBlock(b, name + i, name); })];
  }
  // the SwiftUI, UIKit and AppKit types and classes behind an iOS page, each with its attributes grouped by Apple's topics and
  // its availability (apple-api.json, generated; names and links only; read once, when a page needs it; batch 328)
  var API = null;
  function ApiDocs(p) {
    var data = useAsync(function () { return API || (API = fetch('apple-api.json').then(function (r) { return r.ok ? r.json() : { pages: {}, symbols: {} }; })); }, []);
    if (!data) return h(P.Text, { as: 'p', variant: 'secondary' }, 'Reading the developer documentation\u2026');
    var paths = (data.pages[p.title] || []).filter(function (x) { return data.symbols[x]; });
    if (!paths.length) return h(P.Text, { as: 'p', variant: 'secondary' }, 'No SwiftUI, UIKit or AppKit type is mapped to this page yet.');
    return h(Stack, null, paths.map(function (path) {
      var c = data.symbols[path], n = c.topics.reduce(function (m, t) { return m + t.members.length; }, 0);
      return h(React.Fragment, { key: path },
        props([[c.framework + ' ' + (c.kind || 'type'), p.link(c.title, c.url)], ['Available', c.platforms.join(', ') || '\u2014'], ['Attributes', String(n)]], c.title + ' in ' + c.framework),
        n ? table(c.title + ' attributes', ['Topic', 'Attribute', 'Kind'], [].concat.apply([], c.topics.map(function (t) { return t.members.map(function (m) { return [t.title, m[1] ? p.link(m[0], m[1]) : m[0], m[2] === 'article' ? 'Article' : m[2] === 'collectionGroup' ? 'Group' : /\(/.test(m[0]) ? 'Method' : /^[A-Z]/.test(m[0]) ? 'Type' : /^case /.test(m[0]) ? 'Case' : 'Property']; }); }))) : null);
    }));
  }
  // a Platforms page: How to build (for one platform), then the standard (for that platform, or whole)
  /* Plenix's guidance for the Apple HIG pages (native-guidance.js, generated from platform/standards/native-guidance.json;
     batch 330): our rules, each linked to the HIG section it follows, mapped to the Web and Android pages */
  var NG = function () { return window.DSNativeGuidance || { pages: {}, byWeb: {}, byAndroid: {} }; };
  // a leaf that is a variant page of the record that answers it opens that page (as its row in the navigation pane does)
  var leafHref = function (key) { var i = key.indexOf('|'), sec = key.slice(0, i), leaf = key.slice(i + 1), a = ANSWER[key], vp = a && variantPageOf(a.rec, leaf); return vp ? vhref(a.rec, vp) : a ? href(a.rec) : '#/' + sec + '/leaf-' + sec + '-' + DS.slug(leaf); };
  var leafLink = function (key) { return h(P.Link, { key: key, href: leafHref(key) }, key.slice(key.indexOf('|') + 1)); };
  var extLink = function (label, url) { return h(P.Link, { href: url, external: true }, label); };
  var linkList = function (keys) { return h(React.Fragment, null, keys.map(function (k, i) { return h(React.Fragment, { key: k }, i ? ', ' : '', leafLink(k)); })); };
  var propTable = function (title, rows) { return table(title, ['Property', 'iOS', 'Android', 'Web'], rows.map(function (x) { return [x.property, x.ios || '\u2014', x.android || '\u2014', x.web || '\u2014']; })); };
  // a native page's sections, keyed as the Web page's (np- keeps them apart from the template's own) and titled the same
  var NATIVE_TOC = [['np-purpose', 'Overview and Purpose'], ['np-guide', 'Usage'], ['np-exh', 'Variants'], ['xplat', 'Across platforms', 'phone'], ['figma', 'Figma', 'phone'],
    ['plspec', 'Platform specification', 'phone'], ['np-states', 'States'], ['np-anat', 'Anatomy'], ['np-api', 'Development and API'], ['np-impl', 'Implementation'], ['np-map', 'Source-system mappings']];
  // the Plenix design of a native component (native-design.json, batch 336): what the guidance becomes as a real control
  var tokCell = function (t) { if (!t) return '\u2014'; var parts = String(t).split(/(plx-(?:sys|comp)-[a-z0-9-]*[a-z0-9])/); return parts.length < 2 ? t : h(React.Fragment, null, parts.map(function (x, i) { return i % 2 ? h(TokenLink, { key: i, name: '--' + x }) : x; })); };
  var figNode = function (label, id) { var fg = NG().figma; return fg && id ? extLink(label, fg.file.url + '?node-id=' + id.replace(':', '-')) : label; };
  // the platform of a native page: its code columns, the name of its system default, and its kit
  var designPlatform = function (key) {
    return /^android-/.test(key) ? { name: 'Android', sys: 'Material 3', kit: 'Material 3 style', def: 'Material 3 default', cols: [['compose', 'Jetpack Compose'], ['views', 'Android Views']], lang: 'kotlin' }
      : { name: 'iOS', sys: 'Apple', kit: 'Apple kit style', def: 'Apple default', cols: [['swiftui', 'SwiftUI'], ['uikit', 'UIKit'], ['appkit', 'AppKit']], lang: 'swift' };
  };
  function DesignPanels(key, leaf) {
    var d = (NG().design || {})[key]; if (!d) return [];
    var pf = designPlatform(key), colNames = pf.cols.map(function (c) { return c[1]; }), colsOf = function (x) { return pf.cols.map(function (c) { return x[c[0]] || '\u2014'; }); };
    var codeList = colNames.join(', ').replace(/, ([^,]*)$/, ' and $1');
    var shot = function (im) { return im ? h('img', { key: im.src, className: 'ds-native-shot', src: im.src, alt: im.alt }) : null; };
    var g = NG().pages[key];
    var follows = function (a) { if (a.followsUrl) return extLink(a.follows || 'Source', a.followsUrl); return g && a.follows ? extLink(a.follows, g.hig + '#' + ((g.rules || []).filter(function (r) { return r.section === a.follows; })[0] || {}).anchor) : a.follows || '\u2014'; };
    var out = [];
    if (!g && d.summary) out.push(h(SPanel, { key: 'np-purpose', title: 'Overview and Purpose', description: 'What ' + leaf + ' is on ' + pf.name + ', in Plenix\u2019s words.' }, h(P.Text, { as: 'p' }, d.summary)));
    var figRows = [d.figma && d.figma.compare ? ['In Figma', figNode(pf.sys + ' default and Plenix, side by side', d.figma.compare)] : null];
    out.push(h(SPanel, { key: 'np-exh', title: 'Variants', description: 'Each Plenix variant of ' + leaf + ' on ' + pf.name + (d.images && d.images.compare ? ': the ' + pf.def + ' beside the same component styled with the Plenix variables, in light and dark.' : ', its ' + pf.sys + ' counterpart and its tokens.') },
      h(Stack, null, shot(d.images && d.images.compare), figRows[0] ? props(figRows, 'The Figma drawing') : null,
        table(leaf + ': Plenix variants', ['Variant', pf.kit, 'On the web', 'Use'], (d.variants || []).map(function (v) { return [v.name, v.apple || v.material || '\u2014', v.web ? leafLink(v.web) : '\u2014', v.use]; })),
        plSub('Variant tokens', false),
        table(leaf + ': variant tokens', ['Variant', 'Background', 'Content', 'Border'], (d.variants || []).map(function (v) { return [v.name, tokCell(v.background), tokCell(v.content), tokCell(v.border)]; })),
        plSub('Variants in code', false),
        table(leaf + ': variants in code', ['Variant'].concat(colNames), (d.variants || []).map(function (v) { return [v.name].concat(colsOf(v)); })))));
    if ((d.states || []).length) out.push(h(SPanel, { key: 'np-states', title: 'States', description: 'The states of ' + leaf + ' on ' + pf.name + ': the Plenix tokens behind each, and where ' + codeList + ' report it.' },
      table(leaf + ': states', ['State', 'Plenix tokens'].concat(colNames), d.states.map(function (x) { return [x.state, tokCell(x.token)].concat(colsOf(x)); }))));
    out.push(h(SPanel, { key: 'np-anat', title: 'Anatomy', description: 'The parts of the Plenix ' + leaf.toLowerCase() + ' on ' + pf.name + ', and each attribute from its Plenix token to its value, the ' + pf.def + ', and the ' + codeList + ' attribute that sets it.' },
      h(Stack, null, shot(d.images && d.images.anatomy), d.figma && d.figma.anatomy ? props([['In Figma', figNode('The lettered drawing', d.figma.anatomy)]], 'The Figma drawing') : null,
        table(leaf + ': parts', ['Part', 'Name', 'What it is'], (d.anatomy || []).map(function (x) { return [x.part, x.name, x.about]; })),
        plSub('Attributes', false),
        table(leaf + ': attributes', ['Attribute', 'Plenix token', 'Plenix ' + pf.name + ' value', pf.def, 'Follows'], (d.attributes || []).map(function (a) { return [a.part + ' \u00b7 ' + a.attribute, tokCell(a.token), a.value, a.apple || a.material || '\u2014', follows(a)]; })),
        plSub('Attributes in code', false),
        table(leaf + ': attributes in code', ['Attribute'].concat(colNames), (d.attributes || []).map(function (a) { return [a.part + ' \u00b7 ' + a.attribute].concat(colsOf(a)); })))));
    return out;
  }
  // the Plenix code for a native component, first under Development and API
  function DesignCode(key) {
    var d = (NG().design || {})[key]; if (!d || !d.code) return null;
    var pf = designPlatform(key);
    var list = pf.cols.filter(function (x) { return d.code[x[0]]; });
    return list.length ? list.map(function (x, i) {
      return h(React.Fragment, { key: 'code-' + x[0] }, plSub('Plenix code: ' + x[1], i === 0), h(P.CodeBlock, { language: pf.lang }, d.code[x[0]].join('\n')));
    }) : null;
  }
  function GuidancePanels(key, leaf) {
    var g = NG().pages[key]; if (!g) return [];
    var dz = (NG().design || {})[key];
    return [h(SPanel, { key: 'np-purpose', title: 'Overview and Purpose', description: 'What ' + leaf + ' is, in Plenix\u2019s words.' }, h(Stack, null, h(P.Text, { as: 'p' }, g.summary), dz ? h(P.Text, { as: 'p' }, dz.summary) : null)),
      h(SPanel, { key: 'np-guide', title: 'Usage', description: 'Plenix\u2019s own rules for ' + leaf + ', written for Plenix from the Apple Human Interface Guidelines; each rule links to the section it follows.' },
        table('Plenix rules for ' + leaf, ['Rule', 'Level', 'Follows'], (g.rules || []).map(function (r) { return [r.rule, r.level === 'must' ? 'Must' : 'Should', extLink(r.section, g.hig + '#' + r.anchor)]; })))];
  }
  // an iOS page's counterparts on the Web and Android, and its property table across the three platforms
  function IosCross(key, leaf) {
    var g = NG().pages[key] || {}, web = [...new Set((g.web || []).concat(NG().iosWeb[key] || []))], and = g.android || [];
    if (!web.length && !and.length && !(g.properties || []).length) return null;
    return h(SPanel, { key: 'xplat', title: 'Across platforms', description: leaf + ' on the Web and Android, and its properties on each platform.' },
      h(Stack, null, props([web.length ? ['On the web', linkList(web)] : null, and.length ? ['On Android', linkList(and)] : null], leaf + ' on the other platforms'),
        (g.properties || []).length ? propTable(leaf + ' across platforms', g.properties) : null));
  }
  // a page's counterparts on the other platforms (web, iOS, Android), then the iOS guidance mapped to it: its summary and
  // property table (batch 332)
  function CrossPanel(m) {
    var rows = [(m.web || []).length ? ['On the web', linkList(m.web)] : null, (m.ios || []).length ? ['On iOS', linkList(m.ios)] : null, (m.android || []).length ? ['On Android', linkList(m.android)] : null];
    var guide = (m.guidance || []).filter(function (k) { return NG().pages[k]; });
    // the Plenix designs of the native counterparts (native-design.json): the iOS drawing, and a link to each design
    var des = NG().design || {}, designed = (m.ios || []).concat(m.android || []).filter(function (k) { return des[k]; });
    var designBlock = designed.length ? [plSub('The Plenix design on iOS and Android', false),
      props(designed.map(function (k) { return [designPlatform(k).name, h(React.Fragment, null, leafLink(k), ' \u2014 ' + (des[k].variants || []).map(function (v) { return v.name; }).join(', '))]; }), 'The Plenix native designs'),
      designed.filter(function (k) { return des[k].images && des[k].images.compare; }).slice(0, 1).map(function (k) { var im = des[k].images.compare; return h('img', { key: im.src, className: 'ds-native-shot', src: im.src, alt: im.alt }); })] : null;
    return h(SPanel, { key: 'xplat', title: 'Across platforms', description: 'The same thing on the other Plenix platforms, its Plenix design on iOS and Android, and the iOS guidance mapped to it (Plenix\u2019s rules written from the Apple Human Interface Guidelines).' },
      h(Stack, null, props(rows, 'Counterparts on the other platforms'), designBlock, guide.map(function (k) { var g = NG().pages[k], n = k.slice(k.indexOf('|') + 1);
        return h(React.Fragment, { key: k }, plSub('iOS guidance: ' + n, false), h(P.Text, { as: 'p' }, g.summary, ' ', leafLink(k), ' (' + (g.rules ? g.rules.length : g.nRules || 0) + ' rules)'),
          g.properties && g.properties.length ? propTable(n + ' across platforms', g.properties) : null); })));
  }
  // the components of Apple's iOS and iPadOS 27 Figma kit that draw the given iOS pages, each opening its node in the Plenix
  // copy of the file (native-guidance.js figma, from platform/standards/figma-map.json; batch 334)
  function FigmaPanel(keys, leaf) {
    var fg = NG().figma; if (!fg || !keys || !keys.length) return null;
    var seen = {}, rows = [];
    keys.forEach(function (k) { (fg.byIos[k] || []).forEach(function (c) { if (seen[c.id]) return; seen[c.id] = 1;
      var axes = Object.keys(c.axes || {}).map(function (a) { return a + ': ' + c.axes[a].join(', '); }).concat((c.props || []).length ? ['Properties: ' + c.props.join(', ')] : []);
      rows.push([extLink(c.name, fg.file.url + '?node-id=' + c.id.replace(':', '-')), c.page, c.variants ? String(c.variants) : '—', axes.length ? h(React.Fragment, null, axes.map(function (x, i) { return h('div', { key: i }, x); })) : '—']); }); });
    if (!rows.length) return null;
    return h(SPanel, { key: 'figma', title: 'Figma', description: 'The components of Apple’s ' + fg.file.name + ' kit that draw ' + leaf + '; each opens in the Plenix copy of the file.' },
      h(Stack, null, props([['Kit', extLink(fg.file.name, fg.file.url)], ['Source', extLink('Figma Community', fg.file.community)], ['Components', String(rows.length)]], 'The Figma kit'),
        table(leaf + ' in Figma', ['Component', 'Kit page', 'Variants', 'Variant properties'], rows)));
  }
  function StandardView(p) {
    var st = p.spec.standard, out = [], k0 = p.spec.key, leaf = p.spec.part;
    GuidancePanels(k0, leaf).concat(k0 ? DesignPanels(k0, leaf) : []).forEach(function (x) { out.push(x); });
    if (k0 && /^ios-/.test(k0)) { var ic = NG().pages[k0] ? IosCross(k0, leaf) : (NG().iosWeb[k0] || []).length ? CrossPanel({ web: NG().iosWeb[k0] }) : null; if (ic) out.push(ic); }
    if (k0 && /^android-/.test(k0) && ((NG().androidWeb[k0] || []).length || (NG().byAndroid[k0] || []).length)) out.push(CrossPanel({ web: NG().androidWeb[k0] || [], ios: NG().byAndroid[k0] || [], guidance: NG().byAndroid[k0] || [] }));
    var fp = !k0 ? null : /^ios-/.test(k0) ? FigmaPanel([k0], leaf) : /^android-/.test(k0) ? FigmaPanel(NG().byAndroid[k0], leaf) : null; if (fp) out.push(fp);
    // the Plenix Platforms Standard: one Platform specification on a page about one thing; the whole standard keeps a
    // section per part
    var whole = p.spec.mode === 'all' || p.spec.part === 'Overview';
    var lead = st.lead && st.lead.length ? st.lead.map(function (b, i) { return stdBlock(b, 'lead' + i, st.title); }) : [];
    var secBody = function (s) { return [(s.blocks || []).map(function (b, j) { return stdBlock(b, 's' + j, s.title); }), (s.subs || []).map(function (x, j) { return h(React.Fragment, { key: 'x' + j }, stdPart(x, j === 0 && !(s.blocks || []).length)); })]; };
    if (whole) {
      if (lead.length) out.push(h(SPanel, { key: 'std-lead', title: st.title, description: p.spec.mode === 'all' ? 'The whole standard (platform/standards/platforms.md).' : 'The opening of the Plenix Platforms Standard; each of its sections, for ' + st.name + ', is a page of its own.' }, h(Stack, null, lead)));
      st.sections.forEach(function (s, i) { out.push(h(SPanel, { key: 'std' + i, title: (s.n ? s.n + '. ' : '') + s.title }, h(Stack, null, secBody(s)))); });
    } else if (lead.length || st.sections.length) {
      out.push(h(SPanel, { key: 'plspec', title: 'Platform specification', description: 'The parts of the Plenix Platforms Standard (platform/standards/platforms.md) for ' + leaf + ' on ' + st.name + '.' },
        h(Stack, null, lead, st.sections.map(function (s, i) { return h(React.Fragment, { key: 'std' + i }, plSub((s.n ? s.n + '. ' : '') + s.title, i === 0 && !lead.length), secBody(s)); }))));
    }
    var ap = p.spec.apple;
    var appleLink = function (label, url) { return h(P.Link, { href: url, external: true }, label); };
    var kindOf = function (s) { return s[1] === 'article' ? 'Article' : /\(/.test(s[0]) ? 'Modifier or method' : /^[A-Z]/.test(s[0]) ? 'Type' : 'Property'; };
    // Development and API: the SwiftUI, UIKit and AppKit types behind the page, its SwiftUI topics and frameworks; on a page
    // without Apple's references (Android), the Plenix code alone
    if (!ap && k0 && DesignCode(k0)) out.push(h(SPanel, { key: 'np-api', title: 'Development and API', description: 'The Plenix code for ' + leaf + ' on ' + designPlatform(k0).name + ', on the generated Plenix tokens.' }, h(Stack, null, DesignCode(k0))));
    if (ap) out.push(h(SPanel, { key: 'np-api', title: 'Development and API', description: (DesignCode(k0) ? 'The Plenix code for ' + leaf + ' in SwiftUI, UIKit and AppKit, then the' : 'The') + ' developer documentation for ' + leaf + ': the SwiftUI, UIKit and AppKit types with every attribute, the SwiftUI topics and the frameworks, each linked to developer.apple.com (read ' + ap.read + ').' },
      h(Stack, null, DesignCode(k0), [plSub('SwiftUI, UIKit and AppKit', !DesignCode(k0)), h(ApiDocs, { key: 'api', title: leaf, link: appleLink })],
        ap.topics.length ? [plSub('SwiftUI topics', false), h(React.Fragment, { key: 'swiftui' }, table('SwiftUI symbols for ' + leaf, ['Topic', 'Symbol', 'Kind'], [].concat.apply([], ap.topics.map(function (t) { return t.symbols.map(function (s) { return [appleLink(t.article + ' \u203a ' + t.title, t.articleUrl), appleLink(s[0], s[2]), kindOf(s)]; }); }))))] : null,
        ap.frameworks.length ? [plSub('Apple frameworks', false), h(React.Fragment, { key: 'fw' }, table('Apple frameworks for ' + leaf, ['Framework', 'Documentation'], ap.frameworks.map(function (f) { return [f[0], appleLink(f[1].replace('https://', ''), f[1])]; })))] : null)));
    // Implementation: how to build, the token mapping and the generated files
    var impl = [];
    if (p.spec.guide) impl.push([plSub('How to build for ' + st.name, true), p.spec.guide.map(function (x, i) { return h(React.Fragment, { key: 'g' + i }, stdPart(x, false)); })]);
    if (p.spec.tokens) impl.push([plSub('Token mapping for ' + st.name, !impl.length), h(P.Text, { key: 'tm', as: 'p' }, 'One set of token names, with values per platform: each value of the ' + st.name + ' set carries the name of the web token for the same role, or is platform only where the web has no such role. A text role maps to the web role (plx-text--<role>) and its size or weight token.'), h(React.Fragment, { key: 'tmt' }, table('Token mapping for ' + st.name, ['Token', 'Web token', st.name + ' value', 'Source'], p.spec.tokens))]);
    if (p.spec.files) impl.push([plSub('Generated files for ' + st.name, !impl.length), h(React.Fragment, { key: 'files' }, table('The generated files', ['File', 'Path'], p.spec.files.map(function (f) { return [f[0], h(P.Link, { href: f[1], download: '' }, f[1].replace(/^\.\.\//, 'platform/'))]; })))]);
    if (impl.length) out.push(h(SPanel, { key: 'np-impl', title: 'Implementation', description: 'How to build for ' + st.name + ', the token mapping and the files build-tokens.js generates (sections 1.4, 1.5 and 7 of the Plenix Platforms Standard).' }, h(Stack, null, impl)));
    // Source-system mappings: the Apple Human Interface Guidelines page, its outline and resources
    if (ap && ap.hig) out.push(h(SPanel, { key: 'np-map', title: 'Source-system mappings', description: 'The Apple Human Interface Guidelines page for ' + leaf + ', its sections and its resources, each linked to developer.apple.com.' },
      h(Stack, null, props([['Human Interface Guidelines', appleLink(leaf, ap.hig.url)]], 'Apple Human Interface Guidelines page'),
        ap.hig.sections.length ? h(React.Fragment, { key: 'hig-sec' }, table('Sections of ' + leaf + ' in the Human Interface Guidelines', ['Section', 'Subsections'], ap.hig.sections.map(function (x) { return [appleLink(x.title, ap.hig.url + '#' + x.anchor), x.subs.length ? h(React.Fragment, null, x.subs.map(function (y, i) { return h(React.Fragment, { key: y.anchor }, i ? ' \u00b7 ' : '', appleLink(y.title, ap.hig.url + '#' + y.anchor)); })) : '\u2014']; }))) : null,
        [['related', 'Related'], ['documentation', 'Developer documentation'], ['videos', 'Videos']].map(function (r) { var list = ap.hig.resources[r[0]] || []; return list.length ? h(React.Fragment, { key: r[0] }, table(r[1] + ' for ' + leaf, [r[1], 'Link'], list.map(function (x) { return [x[0], appleLink(x[1].replace('https://', ''), x[1])]; }))) : null; }))));
    // in the Web order
    var order = NATIVE_TOC.map(function (t) { return t[0]; });
    var rank = function (el) { var k = String(el.key), n = order.indexOf(k); return n >= 0 ? n : /^std/.test(k) ? order.indexOf('plspec') + 0.5 : 99; };
    return out.map(function (el, i) { return [el, i]; }).sort(function (a, b) { return rank(a[0]) - rank(b[0]) || a[1] - b[1]; }).map(function (x) { return x[0]; });
  }
  // the parts of the standard a foundation, pattern or page structure follows
  function PlatformPage(p) { return h(Stack, null, p.parts.map(function (x, i) { return h(React.Fragment, { key: i }, stdPart(x, i === 0)); })); }
  // a component's Platforms section: its section 6 table and its functional equivalent (6.5)
  function PlatformRows(p) {
    var c = p.spec;
    return h(Stack, null, c.parts.map(function (x, i) { return h(React.Fragment, { key: i }, stdPart(x, i === 0)); }),
      c.equivalent ? [plSub('6.5 Functional equivalent', !c.parts.length), h(React.Fragment, { key: 'eq' }, stdBlock(c.equivalent, 'eq', 'Functional equivalent'))] : null);
  }
  function useAsync(fn, deps) { var s = useState(null); useEffect(function () { var live = true; fn().then(function (v) { if (live) s[1](v); }); return function () { live = false; }; }, deps); return s[0]; }
  // a specimen drawn by the token labs (DOM), inside a Platform panel
  function Specimen(p) { var ref = useRef(null); useEffect(function () { var n = ref.current; n.innerHTML = ''; p.build(n); }, [p.k]); return h('div', { ref: ref, className: 'ds-specimens' }); }

  /* one live example: the real component, and its code (written from what it renders) behind Show code */
  function Live(p) { var node = p.render(); var code = R.jsx(node); useEffect(function () { p.onCode(code); }); return node; }
  // a group of variants ([group, [[name, render], …]]): each variant in its own card, under its name
  /* attributes read from the stylesheet (Plenix decision 5): the declarations of the rules whose selector starts with a
     class. [[where, property, value]]: where is '' for the element itself, else the rest of the selector (":hover", "
     .plx-button__icon"). Comments are left out. */
  function attributesOf(css, cls) {
    var out = [], re = /([^{}]+)\{([^{}]*)\}/g, m;
    var text = (css || '').replace(/\/\*[\s\S]*?\*\//g, '');
    var head = new RegExp('^\\.' + cls.replace(/[-]/g, '\\-') + '(?![\\w-])(.*)$');
    while ((m = re.exec(text))) {
      m[1].split(',').forEach(function (sel) {
        var x = head.exec(sel.trim()); if (!x || /\.is-(hover|focus-visible|focused)(?![\w-])/.test(x[1])) return;   // the documentation twins repeat :hover / :focus
        m[2].split(';').forEach(function (d) { var i = d.indexOf(':'); if (i > 0 && d.trim()) out.push([x[1].trim(), d.slice(0, i).trim(), d.slice(i + 1).trim()]); });
      });
    }
    return out;
  }
  // the house style writes every side on its own (border-top-color, padding-inline-start…): sides with one value read as one row
  var SIDES = [[/^border-(top|right|bottom|left)-(color|style|width)$/, 4, function (m) { return 'border-' + m[2] + ' (all sides)'; }],
    [/^border-(top-left|top-right|bottom-left|bottom-right)-radius$/, 4, function () { return 'border-radius (all corners)'; }],
    [/^(padding|margin)-(block|inline)-(start|end)$/, 4, function (m) { return m[1] + ' (all sides)'; }],
    [/^(padding|margin)-(block|inline)-(start|end)$/, 2, function (m) { return m[1] + '-' + m[2] + ' (both ends)'; }, function (m) { return m[1] + '-' + m[2]; }]];
  function collapseSides(rows) {
    var out = rows.slice();
    SIDES.forEach(function (rule) {
      var groups = {};
      out.forEach(function (x, i) { var m = rule[0].exec(x[1]); if (!m) return; var k = x[0] + '|' + (rule[3] ? rule[3](m) : rule[2](m)) + '|' + x[2]; (groups[k] = groups[k] || []).push(i); });
      var drop = {};
      Object.keys(groups).forEach(function (k) { var ix = groups[k]; if (ix.length !== rule[1]) return; var m = rule[0].exec(out[ix[0]][1]); out[ix[0]] = [out[ix[0]][0], rule[2](m), out[ix[0]][2]]; ix.slice(1).forEach(function (i) { drop[i] = 1; }); });
      out = out.filter(function (x, i) { return !drop[i]; });
    });
    return out;
  }
  /* states read from the stylesheet (Plenix decision 6): every selector that names a state (:hover, :focus-visible,
     :disabled, [aria-selected="true"], .is-loading, [aria-invalid="true"]…). The order and names follow STANDARD.md §7;
     a state the component has no rule for is left out. force: how the spec draws it permanently (a documentation class
     for the pointer and focus states, otherwise the attribute or class itself). */
  var STATE_DEFS = [
    { key: 'hover', name: 'Hover', re: /:hover(?![\w-])/, set: 'The pointer over it (:hover)', force: { cls: 'is-hover' } },
    { key: 'focus', name: 'Focus', re: /:focus-visible(?![\w-])/, set: 'Keyboard focus (:focus-visible)', force: { cls: 'is-focus-visible' } },
    { key: 'focused', name: 'Focus (any)', re: /:focus(?![\w-])/, set: 'Any focus, pointer or keyboard (:focus)', force: { cls: 'is-focused' } },
    { key: 'held', name: 'Pressed (held)', re: /:active(?![\w-])/, set: 'The pointer held down on it (:active)', force: { cls: 'is-pointer-down' } },
    { key: 'active', name: 'Active', re: /\.is-active(?![\w-])/, set: 'The active option or drag target (is-active)', force: { cls: 'is-active' } },
    { key: 'selected', name: 'Selected', re: /\[aria-selected="true"\]|\.is-selected(?![\w-])/, set: 'selected (aria-selected, is-selected)', force: { cls: 'is-selected', attr: ['aria-selected', 'true'] } },
    { key: 'pressed', name: 'Selected (pressed)', re: /\[aria-pressed="true"\]|\.is-pressed(?![\w-])/, set: 'pressed: a toggle that is on (aria-pressed)', force: { cls: 'is-pressed', attr: ['aria-pressed', 'true'] } },
    { key: 'checked', name: 'Selected (checked)', re: /:checked|\[aria-checked="true"\]/, set: 'checked', force: { attr: ['checked', ''], prop: 'checked' } },
    { key: 'current', name: 'Selected (current)', re: /\[aria-current(="[^"]*")?\]|\.is-current(?![\w-])/, set: 'The current page or item (aria-current, is-current)', force: { cls: 'is-current', attr: ['aria-current', 'page'] } },
    { key: 'disabled', name: 'Disabled', re: /:disabled|\[aria-disabled="true"\]|\[disabled\]/, set: 'disabled', force: { attr: ['disabled', ''], attr2: ['aria-disabled', 'true'] } },
    { key: 'readonly', name: 'Read-only', re: /\[readonly\]|\[aria-readonly="true"\]/, set: 'readOnly', force: { attr: ['readonly', ''] } },
    { key: 'loading', name: 'Loading', re: /\.is-loading(?![\w-])|\[aria-busy="true"\]/, set: 'loading (aria-busy, is-loading)', force: { cls: 'is-loading', attr: ['aria-busy', 'true'] } },
    { key: 'error', name: 'Error', re: /\[aria-invalid="true"\]|\.is-error(?![\w-])/, set: 'invalid (aria-invalid)', force: { attr: ['aria-invalid', 'true'] } },
    { key: 'success', name: 'Success', re: /\.is-success(?![\w-])/, set: 'is-success', force: { cls: 'is-success' } },
    { key: 'expanded', name: 'Expanded', re: /\[aria-expanded="true"\]|\.is-expanded(?![\w-])/, set: 'expanded (aria-expanded)', force: { attr: ['aria-expanded', 'true'], cls: 'is-expanded' } }
  ];
  var DOC_TWIN = /\.is-(hover|focus-visible|focused|pointer-down)(?![\w-])/;
  // a selector list split at its own commas only: the commas inside :where(…), :is(…), :not(…) belong to them
  var splitSelectors = function (list) {
    var out = [], depth = 0, from = 0;
    for (var i = 0; i < list.length; i++) { var c = list.charAt(i); if (c === '(') depth++; else if (c === ')') depth--; else if (c === ',' && !depth) { out.push(list.slice(from, i)); from = i + 1; } }
    out.push(list.slice(from)); return out;
  };
  // a state written once for the pointer and its documentation twin (zero overlap, Styling Standard 3.3):
  // :is(:hover, .is-hover) reads as :hover, :is(:disabled, [aria-disabled="true"]) as :disabled
  var STATE_TOKEN = /^(:[\w-]+|\.is-[\w-]+|\[[^\]]*\])$/;
  var oneState = function (sel) {
    return sel.replace(/:is\(([^()]*)\)/g, function (g, list) {
      var parts = list.split(',').map(function (p) { return p.trim(); });
      if (!parts.every(function (p) { return STATE_TOKEN.test(p); })) return g;
      var real = parts.filter(function (p) { return !DOC_TWIN.test(p); })[0];
      return real || g;
    });
  };
  // the twin classes stand for their state where a component draws it only by class (a part that shows its item's
  // keyboard focus, is-focus-visible set by the component)
  var TWIN_OF = { hover: /\.is-hover(?![\w-])/, focus: /\.is-focus-visible(?![\w-])/, focused: /\.is-focused(?![\w-])/, held: /\.is-pointer-down(?![\w-])/ };
  function statesOf(css) {
    var found = {}, twins = [], re = /([^{}]+)\{([^{}]*)\}/g, m, text = (css || '').replace(/\/\*[\s\S]*?\*\//g, '');
    var take = function (d, sel, x, body) {
      var before = sel.slice(0, x.index), compound = (before.split(/\s+|>/).pop() || '').replace(/:(not|is|where)\([^)]*\)/g, '');
      var target = compound.replace(/(\[[^\]]*\]|:[\w-]+(\([^)]*\))?)+$/g, '');
      var where = (sel.slice(0, x.index) + sel.slice(x.index + x[0].length)).replace(/\s+/g, ' ').trim();
      var st = found[d.key] = found[d.key] || { def: d, target: target, rows: [] };
      body.split(';').forEach(function (dc) { var i = dc.indexOf(':'); if (i > 0 && dc.trim()) st.rows.push([where, dc.slice(0, i).trim(), dc.slice(i + 1).trim()]); });
    };
    while ((m = re.exec(text))) {
      splitSelectors(m[1]).forEach(function (sel) {
        sel = oneState(sel.trim());
        if (sel && DOC_TWIN.test(sel) && !/^@/.test(sel) && !/\.plx-[a-z0-9-]+--[a-z0-9-]+/.test(sel)) twins.push([sel, m[2]]);
        if (!sel || DOC_TWIN.test(sel) || /^@/.test(sel)) return;
        if (/\.plx-[a-z0-9-]+--[a-z0-9-]+/.test(sel)) return;   // a variant's own state: shown in that variant's card, never mixed in here
        STATE_DEFS.some(function (d) {
          // a state inside :not(…) is its absence, not the state: match on a copy with those groups blanked (batch 238)
          var bare = sel.replace(/:not\((?:[^()]|\([^()]*\))*\)/g, function (g) { return new Array(g.length + 1).join(' '); });
          var x = d.re.exec(bare); if (!x) return false;
          if (d.key === 'focused' && /:focus-(visible|within)/.test(sel)) return false;
          take(d, sel, x, m[2]);
          return true;
        });
      });
    }
    // a state no rule draws with its pseudo-class: its twin class's rules draw it
    twins.forEach(function (t) {
      STATE_DEFS.some(function (d) {
        if (!TWIN_OF[d.key] || (found[d.key] && !found[d.key].twin)) return false;
        var bare = t[0].replace(/:not\((?:[^()]|\([^()]*\))*\)/g, function (g) { return new Array(g.length + 1).join(' '); });
        var x = TWIN_OF[d.key].exec(bare); if (!x) return false;
        take(d, t[0], x, t[1]); found[d.key].twin = true;
        return true;
      });
    });
    return STATE_DEFS.filter(function (d) { return found[d.key]; }).map(function (d) { return found[d.key]; });
  }
  // the roles that may carry these ARIA states (WAI-ARIA 1.2); other attributes (disabled, checked, aria-busy…) are always allowed
  var ARIA_ROLES = { 'aria-selected': ['option', 'tab', 'gridcell', 'row', 'columnheader', 'rowheader', 'treeitem'], 'aria-pressed': ['button'],
    'aria-expanded': ['button', 'combobox', 'link', 'menuitem', 'tab', 'treeitem', 'row', 'gridcell', 'application', 'checkbox', 'switch'],
    'aria-current': null, 'aria-invalid': null, 'aria-busy': null, 'aria-disabled': null, 'aria-readonly': ['checkbox', 'combobox', 'grid', 'gridcell', 'listbox', 'radiogroup', 'slider', 'spinbutton', 'textbox', 'switch'] };
  function ariaAllowed(el, name) {
    if (!/^aria-/.test(name) || !(name in ARIA_ROLES) || !ARIA_ROLES[name]) return true;
    var tag = el.tagName.toLowerCase(), role = el.getAttribute('role') || (tag === 'button' ? 'button' : tag === 'a' && el.hasAttribute('href') ? 'link' : tag === 'input' || tag === 'textarea' ? 'textbox' : tag === 'select' ? 'combobox' : null);
    return ARIA_ROLES[name].indexOf(role) >= 0;
  }
  // draws its child with one state forced on the element the state's rule names (a class or an attribute)
  function ForceState(p) {
    var ref = useRef(null);
    useEffect(function () {
      var root = ref.current; if (!root || !p.st) return;
      var f = p.st.def.force, t = p.st.target;
      var el = (t && (root.querySelector(t) || (root.firstElementChild && root.firstElementChild.matches && root.firstElementChild.matches(t) ? root.firstElementChild : null))) || root.firstElementChild;
      if (!el) return;
      if (f.cls) el.classList.add(f.cls);
      // an ARIA state only where the element's role allows it (WAI-ARIA); the state's class still draws it (batch 211)
      [f.attr, f.attr2].forEach(function (a) { if (a && ariaAllowed(el, a[0])) el.setAttribute(a[0], a[1]); });
      if (f.prop === 'checked' && 'checked' in el) el.checked = true;
    });
    return h('div', { ref: ref }, p.children);
  }
  /* The states drawn (batch 266, owner): side by side, a thin vertical line between them, each column as wide as its
     sample (nothing inside wraps); the columns continue on the next line when the panel is full, with no line at a line's
     start. Button keeps a card per state (p.cards), and so does a component one of whose samples is wider than the panel
     (a big one: a table, a dialog, a header): the columns are measured once they are drawn. */
  function StatesPanel(p) {
    var list = p.states, sample = p.sample, ref = useRef(null), fits = useState(!p.cards);
    useEffect(function () {
      var n = ref.current; if (!n || !fits[0]) return undefined;
      var check = function () { var w = n.clientWidth; if (Array.prototype.some.call(n.querySelectorAll('.ds-state-row__item'), function (it) { return it.scrollWidth > w; })) fits[1](false); };
      check(); var t = setTimeout(check, 600);   // samples that draw late (a table engine, fonts)
      return function () { clearTimeout(t); };
    });
    var drawn = [['default', 'Default', null]].concat(list.map(function (st) { return [st.def.key, st.def.name, st]; }));
    var draw = function (st) { var live = h(Live, { render: sample, onCode: function () {} }); return st ? h(ForceState, { st: st }, live) : live; };
    var view = !sample ? null : fits[0]
      ? h('div', { ref: ref, className: 'ds-state-row' }, h('div', { className: 'ds-state-row__track', role: 'list', 'aria-label': 'States' }, drawn.map(function (x) {
        return h('div', { key: x[0], className: 'ds-state-row__item', role: 'listitem' }, h(P.Text, { as: 'h4', variant: 'label', className: 'ds-state-row__name' }, x[1]), h('div', { className: 'ds-state-row__sample' }, draw(x[2])));
      })))
      : h('div', { className: 'ds-cards' }, drawn.map(function (x) { return h(SPanel, { key: x[0], title: x[1], headingLevel: 4 }, h('div', { className: 'ds-sample-stage' }, draw(x[2]))); }));
    return h(SPanel, { key: 'states', id: p.id, title: 'States', description: 'Read from its stylesheet: each state it has, drawn permanently, and what each changes and what sets it.' },
      view,
      h(P.Table, { label: 'States', className: 'plx-u-mt-stack-md', data: list.map(function (st, i) { return { id: i, name: st.def.name, look: sample ? 'Drawn above' : '—', set: st.def.set, st: st }; }),
        // the columns of §7's States table: State · Looks · Set by · Changes
        columns: [{ title: 'State', field: 'name', kind: 'name', rowLabel: true, width: '--plx-ref-size-240px' },
          { title: 'Looks', field: 'look', kind: 'wrap' },
          { title: 'Set by', field: 'set', kind: 'wrap' },
          { title: 'Changes', field: 'looks', kind: 'wrap', sortable: false, render: function (x) { return h('div', null, collapseSides(x.st.rows).map(function (row, j) { return h('div', { key: j }, h(P.Text, { variant: 'data' }, (row[0] ? row[0] + ' ' : '') + row[1] + ': '), h(ValueCell, { value: row[2], name: row[1] })); })); } }] }));
  }
  /* a page template's wireframe (batch 166): lettered regions with no text inside, the legend beside it (the same look
     as the layout wireframes: .ds-wire in layout-lab.css). w: { areas, cols, rows (px of --plx-ref-size-*), regions } */
  function Wire(p) {
    var w = p.w;
    return h('div', { className: 'ds-wire' },
      h('div', { className: 'ds-wire__frame ' + DS.sampleClass('grid-template-areas', w.areas.map(function (a) { return '"' + a + '"'; }).join(' ')) + ' ' + DS.sampleClass('grid-template-columns', w.cols) + ' ' + DS.sampleClass('grid-template-rows', w.rows.map(function (n) { return 'var(--plx-ref-size-' + n + 'px)'; }).join(' ')), role: 'img', 'aria-label': 'Wireframe, regions ' + w.regions.map(function (r) { return r[0] + ': ' + r[1]; }).join('; ') },
        w.regions.map(function (r) { return h('div', { key: r[0], className: 'ds-wire__box ' + DS.sampleClass('grid-area', r[0].toLowerCase()) }, h('span', { className: 'ds-wire__marker' }, r[0])); })),
      h('dl', { className: 'ds-wire__legend' }, w.regions.map(function (r) { return [h('dt', { key: 't' + r[0] }, h('span', { className: 'ds-wire__marker ds-wire__marker--key' }, r[0])),
        h('dd', { key: 'd' + r[0] }, h('span', { className: 'ds-wire__term' }, r[1]), r[2] ? h('code', { className: 'ds-wire__code' }, r[2]) : null, r[3] ? h('span', { className: 'ds-wire__note' }, r[3]) : null)]; })));
  }
  function AttrTable(p) {
    if (!p.rows.length) return h(P.Text, { variant: 'secondary' }, p.empty || 'None of its own.');
    var rows = collapseSides(p.rows);   // where it applies (":hover", a part) reads before the property, so the value keeps the room
    return h(P.Table, { label: p.caption, data: rows.map(function (x, i) { return { id: i, prop: (x[0] ? x[0] + ' ' : '') + x[1], name: x[1], value: x[2] }; }),
      columns: [{ title: 'Property', field: 'prop', kind: 'data', rowLabel: true, width: '--plx-ref-size-240px' }, { title: 'Value', field: 'value', kind: 'wrap', render: function (x) { return dataValue(x.value); } },
        { title: 'Visual', field: 'visual', kind: 'center', sortable: false, width: '--plx-ref-size-80px', render: function (x) { return h(ValueVisual, { value: x.value, name: x.name }); } }] });
  }
  /* a variant's own page (batch 177): what this variant is and when to use it, its sample, the prop and class that make it,
     only the attributes and states its class sets, and its anatomy; everything every variant shares is on the base page */
  // a title in the plural, lower case: buttons, text areas, switches, checkboxes (batch 255). Acronyms keep their capitals
  // (QR codes); a title that is already plural (tabs) or has no plural (presence, rich text, inline code, circular
  // progress) stays as it is; a consonant before y takes ies (retries); an -es or -ies plural stays (recent searches, roles)
  var UNCOUNTABLE = /(^| )(access|content|data|feedback|guidance|help|information|inline code|media|motion|navigation|presence|progress|source code|spacing|text|typography)$/;
  var pluralOf = function (t) {
    var words = String(t).split(' ').map(function (w) { return /^[A-Z0-9]{2,}$/.test(w) ? w : w.toLowerCase(); });
    var phrase = words.join(' '), last = words[words.length - 1];
    if (UNCOUNTABLE.test(phrase) || /[^aeiosu]s$/.test(last) || /(ches|shes|xes|zes|sses|ies)$/.test(last) || /[bcdfgklmnprtv]es$/.test(last)) return phrase;
    words[words.length - 1] = /[^aeiou]y$/.test(last) ? last.slice(0, -1) + 'ies' : /(s|x|z|ch|sh)$/.test(last) ? last + 'es' : last + 's';
    return words.join(' ');
  };
  // a component's lab (component-lab.js, batch 252): registered by its inventory id; null when it has none
  var labById = function (id) { return (id && window.DSLabs && window.DSLabs[id]) || null; };
  // a record draws its own lab, or the lab it names (labId); a variant page the lab it names, or its record's
  var LAB = function (r) { return (r && labById(r.labId || r.id)) || null; };
  var VLAB = function (r, vp) { return vp && vp.labId ? labById(vp.labId) : LAB(r); };
  // a lab merged in beside the record's own (r.extraLabs: { id, title }), drawn at #/…/v/all-<id>
  var extraLabOf = function (r, variant) { return r && variant && (r.extraLabs || []).filter(function (x) { return variant === 'all-' + x.id && labById(x.id); })[0] || null; };
  function AllVariantsPage(p) {
    // the record's lab, or one of the labs merged into it (p.extra: { id, title }, #/…/v/all-<id>)
    var r = p.r, sx = SEC[r.sec], lid = p.extra ? p.extra.id : r.labId || r.id, name = p.extra ? p.extra.title : r.title, plural = 'All ' + pluralOf(name);
    var mine = function (x) { return p.extra ? x.labId === lid : !x.labId || x.labId === lid; };
    var body = [
      h(P.Breadcrumbs, { key: 'bc', items: [{ label: 'UI Inventory', href: '#/' }, { label: sx.n + ' ' + sx.title, href: '#/' + sx.id }, { label: r.sub }, { label: r.title + ' · Base', href: href(r) }, { label: plural }] }),
      h(P.EntityHeader, { key: 'rh', title: plural, facts: [{ label: 'Component', value: name }], media: { icon: r.icon, hue: 'surface' }, subtitle: 'Every variant of ' + name + ' in every state, drawn with the real stylesheet. Choose the ' + ((DS.labs[lid] || {}).labels || { size: 'size' }).size.toLowerCase() + ' and the content; click one to open its variant.', headingLevel: 1 }),
      h(SPanel, { key: 'all', id: 'sec-all', title: 'Every variant in every state' }, h(Specimen, { k: 'all-' + r.id + '-' + lid, build: function (n) { DATA.then(function (d) { labById(lid)(n, d, { only: 'matrix', onPick: function (v, s) {
        // the page of that style in that state (a state page, batch 253), else the style's own page, else any page of it
        var vps = (r.variantPages || []).filter(function (x) { return x.lab && x.lab.variant === v && mine(x); });
        var vp = vps.filter(function (x) { return x.lab.state === s && !x.lab.content && !x.lab.size; })[0] || vps.filter(function (x) { return !x.lab.state && !x.lab.content && !x.lab.size; })[0] || vps[0];
        if (vp) location.hash = vhref(r, vp);
      } }); }); } }))
    ];
    return h(OnThisPage, { toc: [['all', 'Every variant in every state', 'grid-2x2']], scroller: p.scroller, onToc: p.onToc, deps: r.id }, body);
  }
  function VariantPage(p) {
    var r = p.r, vp = p.vp, sx = SEC[r.sec];
    var data = useAsync(function () { return Promise.all([cssFilesOf(r).then(function (cf) { return Promise.all(cf.map(R.text)); }), r.src ? R.header(r.src) : Promise.resolve(['', '', null])]); }, [r.id]);
    var entryOf = function (name) { var out = null; (r.examples || []).forEach(function (g) { if (Array.isArray(g[1]) && g[0] === vp.group) g[1].forEach(function (v) { if (v[0] === name) out = v; }); }); return out; };
    var entries = [vp.name].concat(vp.also || []).map(entryOf).filter(Boolean), main = entries[0];
    var css = data ? data[0].join('\n') : '', hprops = data && data[1][2] ? data[1][2].props : [];
    var group = (r.examples || []).filter(function (g) { return g[0] === vp.group; })[0], pick = group && group[2] && group[2].prop;
    var pd = pick && hprops.filter(function (x) { return x[0].replace(/\(.*$/, '') === pick; })[0];
    var rowsOf = function (e) { return [].concat(e[2] || []).reduce(function (all, k) { return all.concat(attributesOf(css, k)); }, []); };
    var own = function (e) { return rowsOf(e).filter(function (x) { return !/^[:[]|^\.is-/.test(x[0]); }); }, states = function (e) { return rowsOf(e).filter(function (x) { return /^[:[]|^\.is-/.test(x[0]); }); };
    var base = href(r), todo = function () { return h(Note, null, 'Not written yet.'); };
    // the card titles (the owner, batch 189): "<Control> Variant: <variant>", and the Attributes card names what it draws
    var vtitle = r.title + ' Variant: ' + vp.leaf.replace(new RegExp('\\s*' + r.title + '$', 'i'), '');
    var drawn = useState(''), editing = useState(false);
    var body = [
      h(P.Breadcrumbs, { key: 'bc', items: [{ label: 'UI Inventory', href: '#/' }, { label: sx.n + ' ' + sx.title, href: '#/' + sx.id }, { label: r.sub }, { label: r.title + ' · Base', href: base }, { label: vp.leaf }] }),
      h(P.EntityHeader, { key: 'rh', title: vp.leaf, subtitle: vp.text, headingLevel: 1, media: { icon: r.icon, hue: 'surface' }, facts: [{ label: 'Variant of', value: r.title }], status: { tone: 'success', label: r.status } }),
      h(SPanel, { key: 'purpose', id: 'sec-purpose', title: 'Overview and Purpose' }, props([['Overview', vp.text], ['Variant of', h(P.Link, { href: base }, r.title + ' · Base (what every variant shares)')],
        ['Chosen with', h(P.Text, { variant: 'data' }, (main && main[3]) || pick || '—')], pd ? ['The prop', pd[1]] : null])),
      h(SPanel, { key: 'guide', id: 'sec-guide', title: 'Usage' }, h(Stack, null,
        h(P.Text, { as: 'h3', variant: 'label' }, 'When to use'), vp.use && vp.use.length ? h(P.List, { label: 'When to use', items: vp.use.map(function (x) { return { icon: 'circle-check', tone: 'success', children: x }; }) }) : todo(),
        h(P.Text, { as: 'h3', variant: 'label' }, 'When not to use'), vp.avoid && vp.avoid.length ? h(P.List, { label: 'When not to use', items: vp.avoid.map(function (x) { return { icon: 'close', tone: 'danger', children: x }; }) }) : todo())),
      h(SPanel, { key: 'exh', id: 'sec-exh', title: vtitle }, h('div', { className: 'ds-cards' }, entries.map(function (e) {
        // the variant card's tabs (batch 265): Preview, Props and class, Code; a heading only for a second form
        return h('div', { key: e[0] }, entries.length > 1 ? h(P.Text, { as: 'h3', variant: 'label', className: 'plx-u-mb-stack-sm' }, e[0]) : null,
          h(VariantTabs, { ex: e, attrs: null }));
      }))),
      h(SPanel, { key: 'attrs', id: 'sec-attrs', title: 'Attributes' + (drawn[0] ? ' · ' + drawn[0] : ''), description: 'The variant drawn large with its parts lettered, then every attribute it uses: its value, its part in the drawing and where it is set.',
        actions: vp.lab && VLAB(r, vp) ? [h(P.Button, { key: 'edit', size: 'sm', icon: 'pencil', onClick: function () { editing[1](true); } }, 'Edit'), FigmaFuture('figma', 'Open in Figma')] : null },
        vp.lab && VLAB(r, vp) ? h(Specimen, { k: 'anat-' + vp.leaf, build: function (n) { DATA.then(function (d) { VLAB(r, vp)(n, d, Object.assign({ only: 'anatomy', onTitle: function (t) { drawn[1](t); } }, vp.lab)); }); } }) : null,
        vp.lab && VLAB(r, vp) ? null : !data ? h(Note, null, 'Reading its stylesheet…') : entries.map(function (e) { return h('div', { key: e[0], className: 'plx-u-mt-stack-md' }, entries.length > 1 ? h(P.Text, { as: 'h3', variant: 'label' }, e[0]) : null, h(AttrTable, { caption: e[0] + ' attributes', rows: own(e), empty: 'Sets nothing of its own: it is the base look.' })); })),
      h(SPanel, { key: 'states', id: 'sec-states', title: 'States', description: 'How this variant reacts (its own state rules); the states every variant shares are on ' + r.title + ' · Base.' },
        !data ? h(Note, null, 'Reading its stylesheet…') : entries.map(function (e) { return h('div', { key: e[0] }, entries.length > 1 ? h(P.Text, { as: 'h3', variant: 'label' }, e[0]) : null, h(AttrTable, { caption: e[0] + ' states', rows: states(e), empty: 'No state rules of its own: it reacts as the base does.' })); })),
      h(SPanel, { key: 'shared', id: 'sec-shared', title: 'Shared with every variant' }, props([['Sizes, content, behavior, accessibility, API, implementation', h(P.Link, { href: base }, r.title + ' · Base')]])),
      vp.lab && VLAB(r, vp) ? h(EditDialog, { key: 'edit', open: editing[0], onClose: function () { editing[1](false); }, r: r, vp: vp }) : null
    ];
    var TOC = [['purpose', 'Overview and Purpose'], ['guide', 'Usage'], ['exh', vtitle, 'image-b'], ['attrs', 'Attributes', 'list-lines'], ['states', 'States'], ['shared', 'Shared with every variant', 'button']];
    return h(OnThisPage, { toc: TOC, scroller: p.scroller, onToc: p.onToc, deps: vp.leaf + (data ? '1' : '0') }, body);
  }
  var propClass = function (prop, cls) {
    return props([prop ? ['Prop', prop, true] : null, cls ? ['Class', lines([].concat(cls), '—', 'class', 'Class')] : null], 'Prop and class');
  };
  /* Edit (the owner, batch 189): a large dialog; every field a Select of the tokens that fit; the preview is the lettered
     drawing. Save (batch 262) sends the changes to the save service (POST /api/tokens on design-system.lighthouseway.org,
     signed in through Authentik; Editors and Admins): it rebuilds the tokens, runs the system check and opens a pull
     request. The dialog asks who is signed in when it opens (GET /api/session); each answer has its own message, and when
     nothing was saved the changes are shown to copy. */
  // sign in, then back to this page: the proxy returns to rd as written (nginx does not decode it), so rd is the plain path
  // and the page within the spec (#/…) waits in this tab's session storage until the spec opens again
  var SIGN_IN_HASH = 'plenix.signinHash';
  var SIGN_IN = function () { return '/api/signin?rd=' + location.pathname; };
  var rememberPlace = function () { try { sessionStorage.setItem(SIGN_IN_HASH, location.hash); } catch { /* storage unavailable */ } };
  try { var back = sessionStorage.getItem(SIGN_IN_HASH); if (back) { sessionStorage.removeItem(SIGN_IN_HASH); if (!location.hash || location.hash === '#/') location.hash = back; } } catch { /* storage unavailable */ }
  function EditDialog(p) {
    var ch = useState({ changes: [], json: '', count: 0 }), msg = useState(null), api = useRef(null);
    var who = useState(null), busy = useState(false);   // who: null (asking) | { user, canSave } | { out: true } | { none: true }
    var name = p.vp.leaf.replace(new RegExp('\\s*' + p.r.title + '$', 'i'), '');
    useEffect(function () {
      if (!p.open) return undefined;
      var live = true;
      fetch('/api/session', { credentials: 'same-origin', headers: { Accept: 'application/json' } })
        .then(function (res) { return res.status === 401 ? { out: true } : res.ok ? res.json() : { none: true }; })
        .catch(function () { return { none: true }; })
        .then(function (w) { if (live) who[1](w && (w.user || w.out) ? w : { none: true }); });
      return function () { live = false; };
    }, [p.open]);
    var signIn = function (text) { return [text, ' ', h('a', { key: 'a', href: SIGN_IN(), onClick: rememberPlace }, 'Sign in')]; };
    var saveIt = function () {
      busy[1](true);
      msg[1]({ tone: 'info', text: 'Saving: rebuilding the tokens and running the system check (up to a minute)…' });
      fetch('/api/tokens', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ component: p.r.id, variant: p.vp.leaf, file: ch[0].file, changes: ch[0].changes }) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (b) { return [res.status, b]; }); })
        .then(function (r) {
          var st = r[0], b = r[1] || {};
          if (st === 200 && b.pr) return msg[1]({ tone: 'success', text: ['Saved as a pull request: ', h('a', { key: 'a', href: b.pr, target: '_blank', rel: 'noopener' }, 'pull request #' + b.number), '. Merge it, then release, to make it live.'] });
          if (st === 200) return msg[1]({ tone: 'success', text: 'Saved on branch ' + b.branch + '.' });
          if (st === 401) { who[1]({ out: true }); return msg[1]({ tone: 'warning', text: signIn('You are signed out. Copy your changes below first: signing in reloads the page.'), show: true }); }
          if (st === 403) return msg[1]({ tone: 'warning', text: 'Your account cannot save tokens: only Editors and Admins can. Your changes are below to copy.', show: true });
          if (st === 409) return msg[1]({ tone: 'warning', text: (b.message || 'A token changed since this page loaded.') + ' Nothing was saved.', show: true });
          if (st === 422) return msg[1]({ tone: 'danger', text: 'The change does not pass the system check, so nothing was saved.', output: b.output, show: true });
          if (st === 503) return msg[1]({ tone: 'warning', text: 'Saving is not set up on this server yet. Your changes are below to copy.', show: true });
          if (st === 400 || st === 502) return msg[1]({ tone: 'danger', text: b.message || 'The server could not save this change.', show: true });
          throw new Error(st);
        })
        .catch(function () { msg[1]({ tone: 'warning', text: 'This page cannot save: saving works on design-system.lighthouseway.org. Your changes are below to copy.', show: true }); })
        .then(function () { busy[1](false); });
    };
    var w = who[0];
    var status = !w ? 'Checking who is signed in…' : w.none ? 'Saving works on design-system.lighthouseway.org' : w.out ? signIn('Signed out.') : w.canSave ? 'Signed in as ' + w.user : 'Signed in as ' + w.user + ' (cannot save: Editors and Admins only)';
    var canTry = !!w && (!!w.none || !!w.canSave);   // no save service here: Save shows the changes to copy
    return h(P.Dialog, { open: p.open, onClose: p.onClose, size: 'full', title: 'Edit ' + p.r.title + ' · ' + name, description: 'Every field is one ' + p.r.title + ' token. The preview on the right shows the change at once; Save opens a pull request with the changed tokens.',
      footer: [h(P.Text, { key: 'n', variant: 'secondary', className: 'ds-edit-count' }, (ch[0].count ? ch[0].count + (ch[0].count === 1 ? ' change' : ' changes') : 'No changes'), ' · ', status),
        h(P.Button, { key: 'r', variant: 'ghost', disabled: !ch[0].count || busy[0], onClick: function () { if (api.current) api.current.reset(); msg[1](null); } }, 'Reset'),
        h(P.Button, { key: 'c', onClick: p.onClose }, 'Close'),
        h(P.Button, { key: 's', variant: 'primary', disabled: !ch[0].count || !canTry, loading: busy[0], onClick: saveIt }, 'Save')] },
      msg[0] ? h(P.Notice, { tone: msg[0].tone, className: 'plx-u-mb-stack-md' }, msg[0].text) : null,
      msg[0] && msg[0].output ? h('div', { className: 'plx-u-mb-stack-md' }, h(P.CodeBlock, null, msg[0].output)) : null,
      msg[0] && msg[0].show && ch[0].json ? h('div', { className: 'plx-u-mb-stack-md' }, h(P.CodeBlock, null, ch[0].json)) : null,
      p.open ? h(Specimen, { k: 'edit-' + p.vp.leaf, build: function (n) { DATA.then(function (d) { LAB(p.r)(n, d, Object.assign({ only: 'editor', onChange: function (c) { ch[1](c); }, api: function (a) { api.current = a; } }, p.vp.lab)); }); } }) : null);
  }
  // the Base card: what every variant shares (the block's own rule) and the props that are not variant choices
  function BaseCard(p) {
    var c = p.ctx || {}, block = c.block;
    if (!block) return null;
    var picks = {}; (p.groups || []).forEach(function (g) { if (g[2] && g[2].prop) picks[g[2].prop] = 1; });
    var shared = (c.props || []).filter(function (x) { return !picks[x[0].replace(/\(.*$/, '')]; });
    return h(SPanel, { title: 'Base', headingLevel: 3, description: 'What every variant shares: the attributes of .' + block + ' (with their tokens) and the props that are not variant choices.' },
      h(P.Text, { as: 'h4', variant: 'label' }, 'Attributes'),
      c.css ? h(AttrTable, { caption: 'Base attributes', rows: attributesOf(c.css, block).filter(function (x) { return !x[0]; }) }) : h(P.Text, { variant: 'secondary' }, 'Reading its stylesheet…'),
      shared.length ? [h(P.Text, { key: 'h', as: 'h4', variant: 'label', className: 'plx-u-mt-stack-md' }, 'Shared props'),
        h(P.Table, { key: 't', label: 'Shared props', index: 'name', data: shared.map(function (x) { return { name: x[0], text: x[1] }; }),
          columns: [{ title: 'Prop', field: 'name', kind: 'data', rowLabel: true, width: '--plx-ref-size-240px' }, { title: 'Description', field: 'text', kind: 'wrap' }] })] : null);
  }
  // a group of variants of one kind: each variant in its own card with its live sample, the prop that selects it and only
  // the attributes that variant changes
  function Variants(p) {
    var meta = p.ex[2] || {}, c = p.ctx || {};
    // the group is a titled section without a frame (CollapsibleSection), so each variant card is the only frame around its
    // tables: two deep, never three (the nesting rule), and every table keeps its border (owner, 2026-10-09)
    return h(P.CollapsibleSection, { title: p.ex[0], headingLevel: 3 },
      // one line: the prop that chooses the variant and how many there are; the prop's full description is in the props
      // table (Development and API), not repeated here (owner, 2026-10-13: "out of place")
      h(P.Text, { as: 'p', variant: 'secondary' }, meta.prop ? ['Chosen with ', h(P.Text, { key: 'p', variant: 'data' }, meta.prop), ' · '] : null, p.ex[1].length + (p.ex[1].length === 1 ? ' variant' : ' variants')),
      h('div', { className: 'ds-cards' }, p.ex[1].map(function (v, i) { return h(Example, { key: i, ex: v, level: 4, ctx: c, variant: true, group: p.ex[0] }); })));
  }
  /* A variant card (owner, batch 265, "option D: tabs"): its name and "Its page ›" in the header, then the Folder tabs
     (the tab strip alone, the content unframed): Preview (the live sample alone on the plain surface, its edge a thin
     border-default line, batch 156: no gray stage), Props and class (the prop that selects it, its class and the
     attributes the class sets) and Code (the usage, colored). Other examples keep the stage and Show code. */
  // the tabs alone (p.ex: [name, render, class, prop, options]; options.full: the example spans the card's width; p.attrs: the attributes its class sets, or null where the page lists
  // them in their own panel)
  function VariantTabs(p) {
    var code = useState(''), tab = useState('preview'), cls = p.ex[2], prop = p.ex[3], attrs = p.attrs;
    var live = h(Live, { render: p.ex[1], onCode: function (x) { if (x !== code[0]) code[1](x); } });
    return h('div', null,
      h(P.Tabs, { variant: 'folder', label: p.ex[0], value: tab[0], onChange: tab[1], items: [
        { value: 'preview', label: 'Preview', content: h('div', { className: 'ds-variant-preview' + (p.ex[4] && p.ex[4].full ? ' ds-variant-preview--full' : '') }, live) },
        { value: 'props', label: 'Props and class', content: h(Stack, null,
          prop || cls ? propClass(prop, cls) : null,
          cls && attrs ? h(AttrTable, { caption: p.ex[0] + ' attributes', rows: attrs, empty: 'Changes nothing in its own rule (see the Base).' }) : null,
          !prop && !cls ? h(P.Text, { variant: 'secondary' }, 'This variant is chosen by its content, not by a prop or a class.') : null) },
        { value: 'code', label: 'Code', content: code[0] ? h(P.CodeBlock, null, code[0]) : h(P.Text, { variant: 'secondary' }, 'Open Preview once to read its code.') }
      ] }),
      // the sample stays mounted (hidden) so its code is read even before Preview has been shown
      tab[0] !== 'preview' && !code[0] ? h('div', { hidden: true }, live) : null);
  }
  function VariantCard(p) {
    var cls = p.ex[2], vh = p.ctx && p.ctx.vlink ? p.ctx.vlink(p.group, p.ex[0]) : null;
    var attrs = cls ? [].concat(cls).reduce(function (all, k) { return all.concat(attributesOf((p.ctx || {}).css, k)); }, []) : null;
    return h(SPanel, { title: p.ex[0], headingLevel: p.level || 3, actions: vh ? [h(P.Button, { key: 'page', size: 'sm', variant: 'ghost', href: vh, iconEnd: 'chevron-right' }, 'Its page')] : null },
      h(VariantTabs, { ex: p.ex, attrs: attrs }));
  }
  function Example(p) {
    if (Array.isArray(p.ex[1])) return h(Variants, p);
    if (p.variant) return h(VariantCard, p);
    var code = useState(''), show = useState(false);
    return h(SPanel, { title: p.ex[0], headingLevel: p.level || 3, actions: [h(P.Button, { key: 'code', size: 'sm', variant: 'ghost', pressed: show[0], onClick: function () { show[1](!show[0]); } }, show[0] ? 'Hide code' : 'Show code')] },
      h('div', { className: 'ds-sample-stage' }, h(Live, { render: p.ex[1], onCode: function (x) { if (x !== code[0]) code[1](x); } })),
      show[0] ? h('div', { className: 'plx-u-mt-stack-md' }, h(P.CodeBlock, null, code[0])) : null);
  }

  /* ── the views that foundation and governance pages add (all Platform tables) ── */
  function TokensView() {
    var t = useAsync(function () { return Promise.all(['system/tokens/reference.css', 'system/tokens/semantic.css', 'system/tokens/components.css', 'system/themes/default.css'].map(R.text)); }, []);
    if (!t) return null;
    var count = function (s, re) { return String((s.match(re) || []).length); };
    return h(Stack, null, table('Token tiers', ['Tier', 'Prefix', 'What it holds', 'Source → stylesheet', 'Tokens'], [
      ['Reference (primitive / global)', h(Mono, null, '--plx-ref-'), 'Raw values; the name carries the value', h(Mono, null, 'tokens/reference.tokens.json → system/tokens/reference.css'), count(t[0], /--plx-ref-[\w-]+\s*:/g)],
      ['System (semantic, state, responsive)', h(Mono, null, '--plx-sys-'), 'Roles by intent: surfaces, content, borders, spacing, radius, control heights and icons, density and interaction values', h(Mono, null, 'tokens/semantic*.tokens.json → system/tokens/semantic.css'), count(t[1], /--plx-sys-[\w-]+\s*:/g)],
      ['Theme', h(Mono, null, '--plx-sys- (themed)'), 'The light and dark values of the color roles and shadows', h(Mono, null, 'tokens/theme-plenix.light|dark.tokens.json → system/themes/default.css'), count(t[3], /--plx-sys-[\w-]+\s*:/g)],
      ['Component', h(Mono, null, '--plx-comp-'), 'Settings of one component (its own stylesheet sets most; shared ones here)', h(Mono, null, 'tokens/components*.tokens.json → system/tokens/components.css'), count(t[2], /--plx-comp-[\w-]+\s*:/g)]]),
      h(Note, null, 'The source is JSON in the W3C Design Tokens format (platform/tokens/*.tokens.json: $value, $type, $description; a reference is {plx-ref.color-gray-800}). build-tokens.js writes the stylesheets from it on every build; the stylesheets are never edited by hand (check-system rule generated). platform/tokens/tokens.index.json lists every token with its values per theme and density, its references, where it is written and what uses it.'),
      h(Note, null, 'Semantic tokens describe intent, not value: two roles may share a value today and stay separate, so either can change later without changing the components that use it. Roles are kept even before anything uses them. Components use roles; the reference scale feeds the roles. Every token a file uses must be declared (node check-system.js, rule defined).'));
  }
  function BreakpointsView() {
    var t = useAsync(function () { return Promise.all([R.text('system/tokens/reference.css'), R.text('system/tokens/semantic.css')]); }, []);
    if (!t) return null;
    var rows = [], m, re = /(--plx-(?:ref-breakpoint|sys-shell-[\w-]*below)[\w-]*)\s*:\s*([^;]+);/g, all = t[0] + t[1];
    while ((m = re.exec(all))) rows.push([h(Mono, null, m[1]), h(Mono, null, m[2].trim())]);
    return h(Stack, null, table('Breakpoints', ['Token', 'Value'], rows), h(Note, null, 'Main-region widths for the content grid: under 600px 4 columns, 600–1023px 8, 1024–1439px 12, 1440px and wider 16 (container queries in system/grid.css).'));
  }
  function ShadowsView() {
    var t = useAsync(function () { return R.text('system/themes/default.css'); }, []);
    if (!t) return null;
    var light = (/:root[^{]*\{([\s\S]*?)\n\}/.exec(t) || ['', ''])[1], re = /(--plx-sys-(?:shadow|elevation)[\w-]*)\s*:\s*([^;]+);/g, m, out = [], seen = {};
    while ((m = re.exec(light))) { if (!seen[m[1]]) { seen[m[1]] = 1; out.push([m[1], m[2].trim()]); } }
    return h(P.ContentGrid, { size: 'sm', label: 'Shadows' }, out.map(function (x) {
      return h(P.Card, { key: x[0], title: x[0].replace('--plx-sys-', ''), meta: x[1] }, h('div', { className: 'ds-shadow-sample ' + DS.sampleClass('box-shadow', 'var(' + x[0] + ')') }));
    }));
  }
  /* the Icon page: the set, the padding rule and the sizes by density (read live from semantic.css), then every icon */
  var DENSITY_BLOCKS = [['Compact', '[data-plx-density="compact"],:root[data-plx-density-policy="compact"]'], ['Standard', ':root,[data-plx-density="standard"]{'], ['Comfortable', '[data-plx-density="comfortable"],:root[data-plx-density-policy="comfortable"]'], ['Touch and mobile', ':root[data-plx-interaction="touch"]']];
  var ROLES = ['inline', 'toolbar', 'standard', 'prominent', 'dialog'];
  function controlSizes(css) {   // { Compact: { toolbar: [24, 16], … }, … } from the density blocks
    var out = {};
    DENSITY_BLOCKS.forEach(function (d) {
      var i = css.indexOf(d[1]); if (i < 0) return;
      var blk = css.slice(i, css.indexOf('}', i)), v = {};
      ROLES.forEach(function (r) {
        var hm = new RegExp('--plx-sys-control-height-' + r + ':\\s*var\\(--plx-ref-control-size-(\\d+)px').exec(blk), im = new RegExp('--plx-sys-control-icon-' + r + ':\\s*var\\(--plx-ref-size-(\\d+)px').exec(blk);
        if (hm && im) v[r] = [+hm[1], +im[1]];
      });
      out[d[0]] = v;
    });
    return out;
  }
  var px = function (n) { return (Math.round(n * 10) / 10) + 'px'; };
  function IconsView() {
    // the names from the icon set's map (issue 557: the stylesheet no longer carries a rule per icon); a release whose
    // source has no map (up to 0.73.0) still lists them from icon.css
    var t = useAsync(function () { return Promise.all([R.text('icons/map.json').catch(function () { return null; }), R.text('system/tokens/semantic.css'), R.text('components/Icon/icon.css').catch(function () { return ''; })]); }, []);
    if (!t) return null;
    var names = [], m;
    try { names = t[0] ? Object.keys(JSON.parse(t[0]).map) : []; } catch (e) { names = []; }
    if (!names.length) { var re = /\.plx-icon--([\w-]+)\{--plx-comp-icon-filled/g; while ((m = re.exec(t[2]))) names.push(m[1]); }
    var sizes = controlSizes(t[1]);
    var dens = DENSITY_BLOCKS.map(function (d) { var v = sizes[d[0]] || {}, x = v.toolbar || v.inline; return x ? [d[0], x[0], x[1]] : null; }).filter(Boolean);
    return h(Stack, null,
      h(SSub, { title: 'The icon set', headingLevel: 2 }, props([
        ['Set', 'Material Symbols Sharp (Google, Apache License 2.0)'],
        ['Weight', '300: a line of about 1px at 16px'],
        ['Optical size', '20 for icons up to 20px; 24 for 24px icons (the header, Comfortable, size lg)'],
        ['Versions', 'Outline by default; filled for the current or selected state (aria-current, aria-pressed, aria-selected, .is-selected, .is-current) or with <Icon filled>; a pinned row keeps its outline icon, only the pin is filled'],
        ['Corners', 'Square (Sharp)'],
        ['Files', h(Mono, null, 'platform/icons/<symbol>[-fill][-24][-24-fill].svg'), true],
        ['Names', h(Mono, null, 'platform/icons/map.json'), true],
        ['Source', h(Mono, null, 'google/material-design-icons @ 737e332'), true],
        ['Loading', 'One module per icon (platform/icons/<set>/<name>.js), imported where it is used or registered by a page’s icon file (plenix-icons-<site>.js, or plenix-icons-plenix.js for every Plenix icon); a name with no module loads its file once. Never from the stylesheet'],
        ['Never', 'Edit, redraw, re-pad or re-weight a file; mix in another set; draw a missing concept (list it for a decision)']])),
      h(SSub, { title: 'Padding: the icon in its control', headingLevel: 2 }, props([
        ['The icon\u2019s square', 'Includes the set\u2019s own padding: 1/12 of the square on each side (1.3px at 16, 1.7px at 20, 2px at 24). The system adds no padding to make up for it.'],
        ['Inset', '4px between the control\u2019s edge and the icon\u2019s square in controls up to 32px; 8px in 36\u201340px controls; 12px at 44px. Always on the 4px grid.'],
        ['Icon-only button', 'Its icon\u2019s square plus 4px on each side'],
        ['Icon to label', '4px from the icon\u2019s square to the label, in every density', ],
        ['Tokens', lines(['--plx-sys-control-height-<role>', '--plx-sys-control-icon-<role>', '--plx-comp-button-icon-label-gap'], '—', null, 'Tokens')]])),
      h(SSub, { title: 'By density', headingLevel: 2 }, table('Icon and control sizes by density',
        ['Density', 'Control', 'Icon (square)', 'Drawing inside it', 'Inset', 'Drawing to control edge'],
        dens.map(function (d) { var inset = (d[1] - d[2]) / 2; return [d[0], d[1] + 'px', d[2] + 'px', px(d[2] * 10 / 12), inset + 'px', px(inset + d[2] / 12)]; }))),
      h(SSub, { title: 'Control roles by density', headingLevel: 2 }, table('Control height and icon by role and density',
        ['Role'].concat(DENSITY_BLOCKS.map(function (d) { return d[0]; })),
        ROLES.map(function (r) { return [h(Mono, null, r)].concat(DENSITY_BLOCKS.map(function (d) { var v = (sizes[d[0]] || {})[r]; return v ? v[0] + 'px, icon ' + v[1] + 'px' : '\u2014'; })); }))),
      h(SSub, { title: 'What follows from the rule', headingLevel: 2 }, props([
        ['Compact', 'Toolbar and form-field controls are 24px tall (not only the icon buttons), with 16px icons'],
        ['Side panel header', 'Its row follows the toolbar role, so its buttons stay on the 4px grid'],
        ['Section chevron', 'The arrow draws at 16px inside its slot (about 13px of drawing, after the set\u2019s padding)'],
        ['Small indicators', 'Use the set\u2019s _small symbols (close_small, check_small) in a 16px box; actions are 16px or larger']])),
      h(SSub, { title: 'Every icon (' + names.length + ')', headingLevel: 2 },
        h(P.ContentGrid, { size: 'sm', label: 'Icons' }, names.map(function (n) { return h(P.Card, { key: n, title: n }, h(P.Icon, { name: n, size: 'lg' })); }))));
  }
  /* the Icon inventory page: candidate icons from other open libraries, restyled to the icon standard
     (platform/standards/icons.md). Its data, platform/icons/inventory/inventory.js (GENERATED by
     tools/icons/build-inventory.js), loads only on this page. A drawing is drawn from its path data alone: the library's
     original file (drawings.found) is never put on the page. */
  var ICON_INVENTORY_FILE = PlenixSource.at('icons/inventory/inventory.js');
  var iconInventory = null;
  function loadIconInventory() {
    if (window.PlenixIconInventory) return Promise.resolve(window.PlenixIconInventory);
    if (!iconInventory) iconInventory = new Promise(function (done) {
      var s = document.createElement('script');
      s.src = ICON_INVENTORY_FILE;
      s.onload = function () { done(window.PlenixIconInventory || false); };
      s.onerror = function () { done(false); };
      document.head.appendChild(s);
    });
    return iconInventory;
  }
  var PATH_DATA = /^[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]+$/;
  // one restyled drawing in its own square: size md (20px) for optical size 20, lg (24px) for 24
  function InventoryGlyph(p) {
    var d = typeof p.d === 'string' && PATH_DATA.test(p.d) ? p.d : null;
    if (!d) return h('span', { className: 'ds-inventory-glyph ds-inventory-glyph--' + p.size, role: 'img', 'aria-label': p.label + ': not drawn' }, '—');
    return h('span', { className: 'ds-inventory-glyph ds-inventory-glyph--' + p.size, role: 'img', 'aria-label': p.label },
      h('svg', { className: 'ds-inventory-glyph__svg', viewBox: '0 -960 960 960', 'aria-hidden': 'true', focusable: 'false' }, h('path', { d: d })));   // plx-allow-svg: the glyph browser draws every symbol of the icon bank from its path
  }
  function inventoryPair(icon, optical) {
    var dr = icon.drawings || {}, size = optical === 20 ? 'md' : 'lg';
    return h(P.Inline, { gap: 'xs' },
      h(InventoryGlyph, { d: dr['outline' + optical], size: size, label: icon.name + ', outline, ' + optical }),
      h(InventoryGlyph, { d: dr['filled' + optical], size: size, label: icon.name + ', filled, ' + optical }));
  }
  // states and library statuses are badges with an icon (owner: a status is never a dot)
  var INVENTORY_STATE = { found: ['neutral', 'search', 'Found'], restyled: ['waiting', 'schedule', 'Restyled'], approved: ['success', 'check', 'Approved'] };
  var LIBRARY_STATUS = { downloaded: ['success', 'download-arrow', 'Downloaded'], attribution: ['waiting', 'circle-info', 'Attribution'], wrapper: ['neutral', 'link', 'Wrapper'], local: ['active', 'folder', 'Local'], decision: ['action-required', 'warning', 'Owner decision'] };
  var statusBadge = function (map, key) { var s = map[key] || ['neutral', 'circle-info', String(key || '—')]; return h(P.Badge, { tone: s[0], icon: s[1] }, s[2]); };
  var CHECK_FILES = [['outline20', 'outline 20'], ['filled20', 'filled 20'], ['outline24', 'outline 24'], ['filled24', 'filled 24']];
  // the restyled files' check: Pass, or Fails with each failed rule and the files it fails in; warnings follow
  function inventoryCheck(icon) {
    var c = icon.check || {}, fails = {}, warns = {};
    CHECK_FILES.forEach(function (f) { var r = c[f[0]] || {}; (r.fail || []).forEach(function (x) { (fails[x] = fails[x] || []).push(f[1]); }); (r.warn || []).forEach(function (x) { (warns[x] = warns[x] || []).push(f[1]); }); });
    var pass = CHECK_FILES.every(function (f) { return c[f[0]] && c[f[0]].pass; });
    var said = function (o) { return Object.keys(o).map(function (k) { return k + ' (' + o[k].join(', ') + ')'; }); };
    return h(P.Stack, { gap: 'xs' },
      h('span', null, h(P.Badge, { tone: pass ? 'success' : 'negative', icon: pass ? 'check' : 'alert' }, pass ? 'Pass' : 'Fails')),
      said(fails).map(function (x) { return h(P.Text, { key: x }, x); }),
      Object.keys(warns).length ? h(P.Text, { variant: 'secondary' }, 'Warnings: ' + said(warns).join('; ')) : null);
  }
  function inventoryText(icon, libs) {
    var lib = libs[icon.library] || {};
    return [icon.name, icon.id, icon.category, icon.library, lib.name, icon.state, INVENTORY_STATE[icon.state] && INVENTORY_STATE[icon.state][2], icon.replaces]
      .concat(icon.aliases || [], icon.keywords || []).filter(Boolean).join(' ').toLowerCase();
  }
  function IconInventoryView() {
    var data = useAsync(loadIconInventory, []), find = useState('');
    if (data === null) return null;
    if (!data) return h(P.Text, { as: 'p' }, 'The inventory could not be loaded: platform/icons/inventory/inventory.js is missing. Run node tools/icons/build-inventory.js.');
    var libs = {}; (data.libraries || []).forEach(function (l) { libs[l.id] = l; });
    var words = find[0].trim().toLowerCase().split(/\s+/).filter(Boolean);
    var icons = (data.icons || []).filter(function (i) { var t = inventoryText(i, libs); return words.every(function (w) { return t.indexOf(w) >= 0; }); });
    var total = (data.icons || []).length;
    return h(Stack, null,
      h(SSub, { title: 'Rules', headingLevel: 2 }, h(Note, null, 'The inventory is separate from the working set (platform/icons/map.json): it lists candidate icons from other open icon libraries. Applications never draw an icon from the inventory. An icon joins the working set only when the owner approves it, in a release the owner declares. Every restyled icon follows the icon standard (platform/standards/icons.md): the canvas 0 -960 960 960, optical sizes 20 and 24, one line weight, flat line ends and square corners. A library’s original drawing is kept beside the restyled files for comparison and is never shown or used. The data is platform/icons/inventory/inventory.json and libraries.json; tools/icons/build-inventory.js restyles, checks and writes inventory.js.')),
      h(SSub, { title: 'Candidates (' + total + ')', headingLevel: 2 }, h(P.Stack, { gap: 'sm' },
        h(P.SearchField, { width: 'bar', value: find[0], onChange: function (ev) { find[1](ev.target.value); }, onClear: function () { find[1](''); }, placeholder: 'Find an icon', label: 'Find an icon by name, alias, keyword, category, library or state' }),
        h(P.Text, { variant: 'secondary', role: 'status' }, icons.length === total ? total + ' icons' : icons.length + ' of ' + total + ' icons'),
        h(P.Table, { label: 'Icon inventory', empty: 'No icon matches “' + find[0].trim() + '”.', data: icons,
          columns: [
            { title: 'Name and aliases', field: 'name', kind: 'wrap', rowLabel: true, render: function (i) { return h(P.Stack, { gap: 'xs' }, h(P.Text, { variant: 'label' }, i.name), (i.aliases || []).length ? lines(i.aliases, null, null, 'Aliases') : null); } },
            { title: 'Drawn', field: 'drawn', kind: 'center', render: function (i) { return h(P.Stack, { gap: 'xs' }, inventoryPair(i, 20), inventoryPair(i, 24)); } },
            { title: 'Keywords', field: 'keywords', kind: 'wrap', render: function (i) { return lines(i.keywords || [], '—', null, 'Keywords'); } },
            { title: 'Category', field: 'category', kind: 'wrap' },
            { title: 'Library and license', field: 'library', kind: 'wrap', render: function (i) { return h(P.Stack, { gap: 'xs' }, h('span', null, (libs[i.library] || {}).name || i.library), h(Mono, null, i.license || '—')); } },
            { title: 'State', field: 'state', kind: 'center', width: '--plx-ref-size-120px', render: function (i) { return statusBadge(INVENTORY_STATE, i.state); } },
            { title: 'Sizes', field: 'sizes', kind: 'data', render: function (i) { return (i.sizes || []).length ? h(Mono, null, i.sizes.join(', ')) : '—'; } },
            { title: 'Check', field: 'check', kind: 'wrap', width: '--plx-ref-size-160px', render: inventoryCheck },
            { title: 'Replaces', field: 'replaces', kind: 'data', render: function (i) { return i.replaces ? h(Mono, null, i.replaces) : '—'; } },
            { title: 'Why and needs', field: 'why', kind: 'wrap', render: function (i) { return asPoints([i.why, i.needs ? 'Needs: ' + i.needs : null].filter(Boolean)); } }] }))),
      h(SSub, { title: 'Libraries (' + (data.libraries || []).length + ')', headingLevel: 2 },
        h(P.Table, { label: 'Icon libraries', data: data.libraries || [],
          columns: [
            { title: 'Library', field: 'name', kind: 'name', rowLabel: true },
            { title: 'Status', field: 'status', kind: 'center', width: '--plx-ref-size-160px', render: function (l) { return statusBadge(LIBRARY_STATUS, l.status); } },
            { title: 'License', field: 'license', kind: 'wrap' },
            { title: 'Icons', field: 'icons', kind: 'data', render: function (l) { return l.icons != null ? String(l.icons) : '—'; } },
            { title: 'Version', field: 'version', kind: 'data', render: function (l) { return l.version || '—'; } },
            { title: 'Wraps', field: 'wraps', kind: 'wrap', render: function (l) { return l.wraps ? (libs[l.wraps] || {}).name || l.wraps : '—'; } },
            { title: 'Why', field: 'why', kind: 'wrap', render: function (l) { return l.why ? points(l.why) : '—'; } }] })),
      h(SSub, { title: 'Gaps (' + (data.gaps || []).length + ')', headingLevel: 2 }, (data.gaps || []).length
        ? props((data.gaps || []).map(function (g) { return [g.name, g.why]; }), 'Gaps', ['Icon', 'Why no candidate exists'])
        : h(P.Text, { as: 'p' }, 'No gaps: every concept asked for has a candidate.')));
  }
  function ExportsView() {
    var t = useAsync(function () { return R.text('index.js'); }, []);
    if (!t) return null;
    var re = /export \{([^}]+)\} from '([^']+)'/g, m, rows = [];
    while ((m = re.exec(t))) m[1].split(',').forEach(function (n) { n = n.trim(); var rec = REC.filter(function (r) { return r.plenix && r.plenix.split(/[ ,+.]+/).indexOf(n) >= 0; })[0]; rows.push([h(Mono, null, n), h(Mono, null, m[2].replace('./', 'platform/')), rec ? h(Link, { href: href(rec) }, rec.title) : 'part of a documented item']); });
    return table('Platform exports', ['Export', 'File', 'Inventory page'], rows);
  }
  function ImportsView() { var all = useAsync(function () { return IMPORTS; }, []); return all ? table('Stylesheets', ['#', 'Stylesheet (platform.css, in order)'], all.map(function (f, i) { return [String(i + 1), h(Mono, null, f)]; }), true) : null; }
  function LifecycleView() { return table('Lifecycle', ['Item', 'Section', 'Level', 'Status', 'Owner', 'Last reviewed'], REC.map(function (r) { return [h(Link, { href: href(r) }, r.title), SEC[r.sec].n + ' ' + SEC[r.sec].title, r.level, h(P.Badge, { tone: 'success', variant: 'soft' }, r.status), r.owner, h(P.Text, { variant: 'data' }, r.reviewed)]; }), true); }
  function PlacementView() { return table('Placement rules', ['If it…', 'Place it in'], window.DSPlacementRules.map(function (x) { return [x[0], x[1]]; })); }
  function ChangelogView() {
    var t = useAsync(function () { return R.text('../../Plenix%20-%20DAM/audit/batches/15-26.md'); }, []);
    if (t === null) return null;
    var heads = (t.match(/^## .*$/gm) || []).map(function (x) { return x.slice(3); }).reverse().slice(0, 40);
    return heads.length ? h(P.List, { items: heads.map(function (x) { return { icon: 'circle-check', tone: 'neutral', children: x }; }) }) : h(Note, null, 'The batch log could not be read from this server.');
  }
  // the filter specification: the rules every filter follows, then each kind of filter (window.DSFilterTypes, inventory.js)
  function FilterTypesView() {
    var T = window.DSFilterTypes || [], rules = window.DSFilterRules || [];
    var FIELDS = [['use', 'Use for'], ['trigger', 'In the bar'], ['opens', 'What opens'], ['chip', 'Its value, when set'], ['applies', 'When it applies'], ['keyboard', 'Keyboard'], ['validation', 'Validation and empty'], ['built', 'In Plenix']];
    return h(Stack, null,
      h(P.Text, { as: 'h3', variant: 'label' }, 'Every filter'),
      props(rules.map(function (x) { return [x[0], x[1]]; })),
      h(P.Text, { as: 'h3', variant: 'label', className: 'plx-u-mt-stack-md' }, 'Kinds of filter'),
      table('Kinds of filter', ['Kind', 'For example', 'In Plenix'], T.map(function (x) { return [x.name, x.example, h(P.Badge, { tone: /^Built/.test(x.built) ? 'success' : 'neutral', variant: 'soft' }, /^Built/.test(x.built) ? 'Built' : 'Not in Plenix yet')]; })),
      h('div', { className: 'ds-cards' }, T.map(function (x) { return h(SSub, { key: x.name, title: x.name, headingLevel: 4, description: 'For example: ' + x.example }, props(FIELDS.map(function (f) { return [f[1], x[f[0]]]; }))); })));
  }
  /* the Data grid's guidelines (the owner, batch 226): every table is a DataGrid (TanStack Table, owner 2026-10-16) in the owner's grid style;
     how to apply it, step by step; every part of the style with its tokens; density; light and dark */
  function DataGridView() {
    var head = function (t, first) { return h(P.Text, { as: 'h3', variant: 'label', className: first ? null : 'plx-u-mt-stack-md' }, t); };
    var STEPS = [
      'Import DataGrid from the Platform (plenix-platform, or window.Plenix). Never write a <table>, never use another grid library: check-system rejects both.',
      'Name the grid: label="Assets" (its accessible name, required).',
      'Give it the rows as plain objects with an id (or name the identifying field with index="…"). A tree: tree, with the children in children (or childrenField) and the toggle in treeColumn.',
      'Write the columns as Plenix column definitions: title, field, sorter, editor, align, frozen, sortable, width (the DataGrid page lists every field).',
      'Say what each column holds with kind: "name" for the row\'s name, "data" for codes, sizes and dates, "wrap" for long text, "center" for badges and buttons, "icon" for a mark column, "actions" for row actions; and its type ("number", "currency", "date", "select", "checkbox", "file", "image", "link", "person", "long-text"; text by default) for the icon before its name and its sort words.',
      'Two settings, never one: the app\'s density (Compact, Standard, Comfortable) sets the text size and the Short row; the table\'s row height (rowHeight: "short", "medium" 56px, "tall" 88px, "extra-tall" 128px; also in its view menu, kept in its view) sets its record rows only. Short rows put content in the middle; taller rows start it P from the top (a Short row\'s own padding) and keep at least P at the bottom: text ends in an ellipsis on the last line that fits, pictures fill the row less P above and below. "wrap" columns never grow a row.',
      'Grouping, Airtable style: groupBy (a field, or a list for nested groups), or Group by this field in the column menu. Each group header is the density row height + 16px: chevron, the field as an eyebrow, the value as its column draws it, the count; a 24px band between groups; headers stick to the top; open and closed groups are kept in the view. Optional: columns[].summary (sum, count, average, min, max) in the headers and onAddToGroup(value) for an add row at the end of each group. Grouped tables virtualize.',
      'Widths: the grid fits each column to its content (again when the density changes; never the rows); give a width only where a column must be fixed (a size token: width: \'--plx-ref-size-240px\'). The columns without one share the room left, and people resize them.',
      'Sort by value: sorter "number", or a function for sizes and dates (sorter: (a, b) => …). Filter with filter: true (contains) or "list" (one of the values).',
      'Cells that are more than text use render: (row) => <Badge …/> (any Platform component). Never style a cell yourself.',
      'Selection: selectable adds the checkbox column; keep the selection in the page with selected and onSelectionChange (bulk actions). A plain click on a row selects only that row; Ctrl or ⌘ + click toggles it, Shift + click extends the range, the checkbox toggles.',
      'Opening a row: onRowClick={(record) => open(record)} (and onRowDoubleClick); rows become Tab stops and Enter opens them. The open row is marked (aria-current and the selected look); openKey makes it controlled (null: none).',
      'Right-click menus: the column menu is there by default (Shift + F10 on a focused header); put the application\'s field actions first with columnMenu [{ label, icon, onSelect(column), danger }]; give rowMenu the row\'s actions [{ label, icon, onSelect, danger }].',
      'Moving: movableColumns, and movableRows with a rowHandle column and onRowMove(record, toIndex); editing: a column\'s editor ("input", "number") and onCellEdit(record, change).',
      'Many rows: choose the mode. "fill" (the default) fills the room left on screen and draws only the rows in view, each the density\'s row height (the browser\'s find in page finds only the drawn rows: offer a filter); "pages" shows pages with the range, the rows-per-page choice and Pagination; "load-more" shows the first rows and more at the bottom (Load more is the keyboard way). Rows from a server: fetchRows({ page, size, sort, filters, search }) → { rows, total }. A height (a size token) replaces the measured room.',
      'Density and light/dark need nothing: the grid takes the page\'s or the region\'s density and the theme\'s roles.'
    ];
    var PARTS = [
      ['Frame', 'Bordered box, 8px corners', '--plx-sys-data-grid-surface, --plx-sys-data-grid-border, --plx-comp-data-grid-radius'],
      ['Header row', 'Shaded, a line under it, as tall as a row', '--plx-sys-data-grid-header-background, --plx-sys-data-grid-header-line, --plx-sys-data-grid-row-height'],
      ['Column title', '12px semibold', '--plx-comp-data-grid-header-font-size, --plx-comp-data-grid-header-font-weight, --plx-sys-data-grid-text'],
      ['Header column line', 'Soft, the full height of the header (inset 0)', '--plx-sys-data-grid-header-line, --plx-comp-data-grid-header-line-inset'],
      ['Sort arrow', 'Shows on hover, kept while sorted, accent when sorted', '--plx-sys-data-grid-text-subtle, --plx-sys-data-grid-accent, --plx-comp-data-grid-sorter-inset, --plx-comp-data-grid-duration'],
      ['Filter button', 'Shows on hover, kept in the accent color while filtered', '--plx-comp-data-grid-popup-button-inset, --plx-comp-data-grid-header-icon-size, --plx-comp-data-grid-title-reserve'],
      ['Resize mark', 'Accent hairline on a header edge on hover', '--plx-sys-data-grid-accent'],
      ['Row', 'No zebra, a soft line under it', '--plx-sys-data-grid-surface, --plx-sys-data-grid-line, --plx-sys-data-grid-row-height'],
      ['Hover', 'Gray', '--plx-sys-data-grid-row-hover'],
      ['Selected', 'Light blue', '--plx-sys-data-grid-row-selected'],
      ['Selected + hover', 'Blue', '--plx-sys-data-grid-row-selected-hover'],
      ['Cell', '13px (Compact 12px), 8px each side, a full-height column line (inset 0)', '--plx-comp-data-grid-font-size, --plx-comp-data-grid-cell-padding-inline, --plx-sys-data-grid-line, --plx-comp-data-grid-column-line-inset'],
      ['Name (kind "name")', 'Medium weight', '--plx-comp-data-grid-name-font-weight'],
      ['Technical value (kind "data")', 'The data font (Reddit Mono) at the table’s size and line height', '--plx-comp-data-grid-data-font-family, --plx-comp-data-grid-data-font-size, --plx-sys-data-grid-text-muted'],
      ['Long text (kind "wrap")', 'One line in a Short row, the lines that fit in a taller one, then an ellipsis; never grows the row', '--plx-comp-data-grid-text-line-height'],
      ['Row height step', 'Short = the density\'s row height; Medium 56, Tall 88, Extra tall 128 at every density', '--plx-comp-data-grid-record-height, --plx-comp-data-grid-row-height-medium, --plx-comp-data-grid-row-height-tall, --plx-comp-data-grid-row-height-extra-tall'],
      ['Taller rows', 'Content from the top: P above, at least P below (P = a Short row\'s padding, 6px in Standard)', '--plx-comp-data-grid-cell-padding-block, --plx-comp-data-grid-text-line-height'],
      ['Type icon', 'Before each column name; hidden in Compact (28px header)', '--plx-comp-data-grid-header-type-icon-size, --plx-comp-data-grid-header-type-icon-gap, --plx-comp-data-grid-header-type-icon-text'],
      ['Wrap headers', 'Two lines, a fixed height', '--plx-comp-data-grid-header-wrap-height, --plx-comp-data-grid-header-title-line-height'],
      ['Checkbox column', '36px, pinned, a 16px mark in the accent color', '--plx-comp-data-grid-lead-column-width, --plx-comp-data-grid-mark-size, --plx-sys-data-grid-accent'],
      ['Icon column (kind "icon")', '36px, the icon muted, its icon in the header', '--plx-comp-data-grid-lead-column-width, --plx-sys-data-grid-text-muted'],
      ['Row header (rowLabel)', 'Header shade, pinned, a soft edge; the selected name in blue', '--plx-sys-data-grid-header-background, --plx-sys-data-grid-header-line, --plx-sys-data-grid-row-selected-text'],
      ['Row actions (kind "actions")', 'Shown while the row is hovered or selected', '--plx-comp-data-grid-duration'],
      ['Tree control', '14px bordered box, − open, + closed; branch line', '--plx-comp-data-grid-tree-control-size, --plx-comp-data-grid-tree-control-radius, --plx-comp-data-grid-tree-control-gap, --plx-comp-data-grid-tree-indent'],
      ['Group header row', 'Density row height + 16px, sunken; chevron, eyebrow, value, count in the data font; sticky', '--plx-comp-data-grid-group-header-height, --plx-comp-data-grid-group-background, --plx-comp-data-grid-group-indent, --plx-comp-data-grid-group-chevron-size'],
      ['Group gap', 'A 24px band between groups, lines above and below', '--plx-comp-data-grid-group-gap'],
      ['Grouped-by column', 'Tinted with the neutral sunken surface', '--plx-comp-data-grid-grouped-column-background'],
      ['Editing cell', 'Inset 2px accent outline; danger when invalid', '--plx-comp-data-grid-editing-outline-width, --plx-sys-data-grid-accent, --plx-sys-data-grid-danger'],
      ['Menus', '8px corners, soft shadow, 13px items with icons', '--plx-sys-data-grid-menu-shadow'],
      ['Filter popup', 'Uppercase label, input or list, Clear and Apply', '--plx-comp-data-grid-filter-label-font-size'],
      ['Empty message', 'Muted, medium', '--plx-comp-data-grid-placeholder-font-size, --plx-comp-data-grid-placeholder-font-weight'],
      ['Footer (pages, load-more)', 'A row\'s line above it; the range or count in the data font, Select and Pagination, or Load more', '--plx-comp-data-grid-footer-border-color, -text, -font-size, -gap, -padding-block, -padding-inline, -label-gap']
    ];
    return h(Stack, null,
      head('The rule', true),
      props([['Every table', 'A Table (static: information to read) or a DataGrid (records people sort, filter, select, open or edit): in the Plenix table style, each from its own tokens; the DataGrid is a React grid on TanStack Table and TanStack Virtual (MIT, part of the Platform bundle)'],
        ['Never', 'A <table> element, another table library, or styles of your own on a table'],
        ['The style', 'The parts below; data-grid.css draws them with tokens only'],
        ['Kept true by', 'tests/data-grid-reference.js (every part against the reference, light and dark, each density) and tests/data-grid.test.js (every grid in the apps: built, axe, no inline styles, row height)']]),
      head('How to apply it'),
      h(P.List, { label: 'How to apply it', items: STEPS.map(function (x, i) { return { children: (i + 1) + '. ' + x }; }) }),
      h(P.CodeBlock, { language: 'jsx' }, "import { DataGrid, Badge } from 'plenix-platform';\n\n<DataGrid label=\"Assets\" data={assets} selectable selected={keys} onSelectionChange={setKeys}\n  columns={[\n    { title: 'Name', field: 'name', kind: 'name', filter: true, width: '--plx-ref-size-240px' },\n    { title: 'Type', field: 'type', kind: 'data', filter: 'list' },\n    { title: 'Status', field: 'status', kind: 'center', render: (a) => <Badge tone=\"success\">{a.status}</Badge> },\n    { title: 'Size', field: 'size', kind: 'data', align: 'right', sorter: bySize },\n  ]}\n  rowMenu={[{ label: 'Open', icon: 'open', onSelect: open }, { label: 'Delete', icon: 'trash', danger: true, onSelect: remove }]}\n  onRowClick={open} />"),
      head('The style, part by part'),
      table('The style, part by part', ['Part', 'Looks', 'Tokens'], PARTS),
      head('Density'),
      table('Density', ['Density', 'Row height', 'Text'], [['Compact', '28px', '12px'], ['Standard', '32px', '13px'], ['Comfortable', '40px', '13px'], ['Touch and mobile', '44px (touch targets)', 'as the density']]),
      head('Light and dark'),
      table('Light and dark', ['Role', 'Light', 'Dark'], [
        ['--plx-sys-data-grid-surface', 'white', 'gray-950'], ['--plx-sys-data-grid-header-background', 'gray-100', 'gray-900'], ['--plx-sys-data-grid-header-line', 'gray-300', 'gray-700'],
        ['--plx-sys-data-grid-line', 'gray-200', 'gray-900'], ['--plx-sys-data-grid-border', 'gray-300', 'gray-800'], ['--plx-sys-data-grid-text', 'gray-900', 'gray-200'],
        ['--plx-sys-data-grid-text-muted', 'gray-700', 'gray-400'], ['--plx-sys-data-grid-text-subtle', 'gray-500', 'gray-500'], ['--plx-sys-data-grid-row-hover', 'gray-200', 'gray-900'],
        ['--plx-sys-data-grid-row-selected', 'blue-100', 'blue-900'], ['--plx-sys-data-grid-row-selected-hover', 'blue-200', 'blue-900'], ['--plx-sys-data-grid-row-selected-text', 'blue-600', 'blue-300'],
        ['--plx-sys-data-grid-accent', 'blue-400', 'blue-300'], ['--plx-sys-data-grid-danger', 'red-700', 'red-500'], ['--plx-sys-data-grid-menu-shadow', '0 8px 24px black-alpha-14', '0 8px 24px black-alpha-50']]));
  }
  var VIEWS = { dataGrid: DataGridView, tokens: TokensView, breakpoints: BreakpointsView, shadows: ShadowsView, icons: IconsView, iconInventory: IconInventoryView, exports: ExportsView, imports: ImportsView, lifecycle: LifecycleView, placement: PlacementView, changelog: ChangelogView, filterTypes: FilterTypesView };

  /* ── pages ── */
  function HomePage() {
    var leaves = 0, answered = 0; TAX.forEach(function (x) { x.subList.forEach(function (sub) { sub.leaves.forEach(function (l) { leaves++; if (ANSWER[x.id + '|' + l]) answered++; }); }); });
    var f = useState({ level: '', inter: '', status: '', sec: '' }), fv = f[0];
    var audit = useAsync(function () { return R.text('index.js').then(function (t) {
      var re = /export \{([^}]+)\}/g, m, names = []; while ((m = re.exec(t))) m[1].split(',').forEach(function (n) { names.push(n.trim()); });
      var known = {}; REC.forEach(function (r) { (r.plenix || '').split(/[ ,+.()]+/).forEach(function (n) { if (n) known[n] = 1; }); });
      var helpers = ['initialsOf', 'tabsPanelId', 'DEMO_SESSION', 'appById', 'appHref', 'SideNavPortal', 'useAppLayout', 'MenuItem', 'MenuDivider', 'MenuGroup', 'SelectionSummary'];
      return { total: names.length, missing: names.filter(function (n) { return !known[n] && helpers.indexOf(n) < 0; }) };
    }); }, []);
    var uniq = function (k) { return REC.map(function (r) { return r[k]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(); };
    var pick = function (label, key, values) {
      return h(P.Field, { label: label, layout: 'inline' }, h(P.Select, { value: fv[key], onChange: function (e) { var n = Object.assign({}, fv); n[key] = e.target.value; f[1](n); }, options: [{ value: '', label: 'All' }].concat(values.map(function (v) { return typeof v === 'string' ? { value: v, label: v } : v; })) }));
    };
    var rows = REC.filter(function (r) { return (!fv.level || r.level === fv.level) && (!fv.inter || interOf(r).indexOf(fv.inter) >= 0) && (!fv.status || r.status === fv.status) && (!fv.sec || r.sec === fv.sec); });
    return h(Stack, null,
      h(P.EntityHeader, { title: 'UI Inventory', headingLevel: 1, media: { icon: 'grid-3x2', hue: 'surface' }, subtitle: 'Every piece of the Plenix Platform has one canonical home here, organized by user purpose and UI role. Each item has its own page with its JSX, CSS and classes, read live from the files; each section shows its whole taxonomy, including what Plenix does not have yet. Source design systems appear as mappings on each item, never as categories.' }),
      h(SPanel, { title: 'At a glance' }, props([['Items with their own page', String(REC.length)], ['Inventory entries answered in Plenix', answered + ' of ' + leaves], ['Sections', String(TAX.length)],
        ['Platform exports placed', audit ? (audit.missing.length ? h(P.Badge, { tone: 'danger', variant: 'soft' }, 'Not placed: ' + audit.missing.join(', ')) : h(P.Badge, { tone: 'success', variant: 'soft' }, 'All ' + audit.total + ' are documented')) : '…']])),
      h(SPanel, { title: 'Sections' }, h(P.ContentGrid, { size: 'md', label: 'Sections' }, TAX.map(function (s) { return h(P.Card, { key: s.id, title: s.n + ' ' + s.title, meta: recordsOf(s.id).length + ' items', href: '#/' + s.id }, s.question); }))),
      h(SPanel, { title: 'All items', description: 'Filter by component level, interaction type, status or section.' },
        h('div', { className: 'ds-inline-row' },
          pick('Level', 'level', LEVELS.filter(function (l) { return REC.some(function (r) { return r.level === l; }); })), pick('Interaction', 'inter', REC.reduce(function (a, r) { return a.concat(interOf(r)); }, []).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort()), pick('Status', 'status', uniq('status')),
          pick('Section', 'sec', TAX.map(function (x) { return { value: x.id, label: x.n + ' ' + x.title }; }))),
        h(P.DataGrid, { label: rows.length + ' items', height: '--plx-ref-size-600px', columns: [
          { title: 'Item', field: 'title', kind: 'name', filter: true, frozen: true, render: function (r) { return h(Link, { href: href(r) }, r.title); } },
          { title: 'Plenix', field: 'plenixName', kind: 'data', filter: true },
          { title: 'Path', field: 'path', kind: 'wrap', filter: true },
          { title: 'Level', field: 'level', filter: 'list' }, { title: 'Interaction', field: 'interaction', filter: 'list' },
          { title: 'Status', field: 'status', kind: 'center', filter: 'list', render: function (r) { return h(P.Badge, { tone: 'success', variant: 'soft' }, r.status); } }],
          data: rows.map(function (r) { return { id: r.id, title: r.title, sec: r.sec, plenixName: r.plenix || '—', path: SEC[r.sec].n + ' ' + SEC[r.sec].title + ' › ' + r.sub, level: r.level, interaction: interText(r), status: r.status }; }) })),
      h(SPanel, { title: 'Where an item belongs', description: 'One canonical home, decided by its primary purpose.' }, h(PlacementView)));
  }

  function TokenPage(p) {
    var idx = useAsync(tokenIndex, []), name = '--' + p.name;
    if (!idx) return h(Note, null, 'Reading the token index…');
    var t = idx[name], dt = BY['design-tokens'];
    var crumbs = h(P.Breadcrumbs, { items: [{ label: 'UI Inventory', href: '#/' }, { label: '01 Foundations', href: '#/foundations' }, { label: 'Design tokens', href: href(dt) }, { label: name }] });
    if (!t) return h(Stack, null, crumbs, h(P.Notice, { tone: 'warning' }, name + ' is not a Platform token.'));
    var TIER = { 'plx-ref': 'Reference (primitive)', 'plx-sys': 'System (semantic role)', 'plx-comp': 'Component' };
    var chain = function (n, depth, seen) {
      var x = idx[n]; if (!x || seen[n]) return [];
      seen[n] = 1;
      return x.refs.reduce(function (out, r) { return out.concat([h('div', { key: depth + r, className: depth ? 'plx-u-pl-16px' : undefined }, h(TokenLink, { name: r }), idx[r] && idx[r].resolved.all ? h('span', { className: 'plx-u-pl-12px' }, h(ValueCell, { value: idx[r].resolved.all, name: r, data: true })) : null)], chain(r, depth + 1, seen)); }, []);
    };
    var refs = chain(name, 0, {});
    // the page of the component whose stylesheet uses it
    var pageOf = function (file) { var f = file.replace(/^platform\//, ''); return REC.filter(function (r) { return r.src && f.indexOf(r.src.replace(/[^/]+$/, '')) === 0; })[0] || null; };
    var vals = t.resolved.all != null ? [['Every theme and density', t.resolved.all]] : Object.keys(t.resolved).map(function (k) { return [k.replace('/', ' · '), t.resolved[k] == null ? '—' : t.resolved[k]]; });
    var body = [crumbs,
      h(P.EntityHeader, { key: 'rh', title: name, subtitle: t.description || TIER[t.tier] + ' token.', headingLevel: 1, media: { icon: 'database', hue: 'surface' }, facts: [{ label: 'Tier', value: TIER[t.tier] }, t.type ? { label: 'Type', value: t.type } : null] }),
      // a token going away (VERSIONING.md, Deprecation; issue 882): its $deprecated text from the token index
      t.deprecated ? h(P.Notice, { key: 'dep', tone: 'warning', title: 'Deprecated' }, t.deprecated) : null,
      h(SPanel, { key: 'value', id: 'sec-value', title: 'Value', description: t.local ? 'Its base value (the first rule that sets it), resolved in light and dark at each density; the rules under Definition change it where they apply.' : 'What it resolves to, in light and dark at each density.' }, table('Value', ['Theme · density', 'Value', 'Visual'], vals.map(function (v) { return [v[0], h(P.Text, { variant: 'data' }, v[1]), h(ValueVisual, { value: v[1], name: name })]; }))),
      h(SPanel, { key: 'def', id: 'sec-def', title: 'Definition', description: t.local ? 'Every rule that sets it.' : 'Each token set that gives it a value; the last that applies wins.' },
        table('Definition', ['Source (edit here)', 'Written under', 'Value as written', 'Visual'], t.sets.map(function (x) { return [h(FileName, { path: t.local ? x.file : 'platform/tokens/' + x.file }), h(P.Text, { variant: 'data' }, x.selector), dataValue(x.value), h(ValueVisual, { value: x.value, name: name })]; }))),
      h(SPanel, { key: 'chain', id: 'sec-chain', title: 'Reference chain', description: 'The tokens its value is made from, down to the reference values.' }, refs.length ? h('div', null, refs) : '—'),
      h(SPanel, { key: 'refby', id: 'sec-refby', title: 'Referenced by', description: 'The tokens built on it.' }, lines(t.referencedBy, '—', 'token', 'Referenced by')),
      h(SPanel, { key: 'used', id: 'sec-used', title: 'Used by', description: 'The Platform stylesheets that read it.' },
        t.usedBy.length ? table('Used by', ['Stylesheet', 'Page'], t.usedBy.map(function (f) { var o = pageOf(f); return [h(FileName, { path: f }), o ? h(P.Link, { href: href(o) }, o.title) : '—']; }), true) : '—'),
      h(SPanel, { key: 'written', id: 'sec-written', title: 'Generated stylesheet' }, table('Written', ['File', 'Line', 'Selector'], (t.written || []).map(function (w) { return [h(FileName, { path: w.file }), String(w.line), h(P.Text, { variant: 'data' }, w.selector)]; }), true))];
    var TOC = [['value', 'Value', 'database'], ['def', 'Definition', 'doc-text'], ['chain', 'Reference chain', 'list-lines'], ['refby', 'Referenced by', 'list-lines'], ['used', 'Used by', 'grid-2x2'], ['written', 'Generated stylesheet', 'document']];
    return h(OnThisPage, { toc: TOC, scroller: p.scroller, onToc: p.onToc, deps: name }, body);
  }

  function SectionPage(p) {
    var sx = p.sx;
    var layerParts = useAsync(function () { return sx.id === 'layout' ? pagePartsOf('section-layout', function (c, d) { var part = labSection('l-overview', d); if (part) c.appendChild(part); }) : Promise.resolve([]); }, [sx.id]);
    var TOC = [['intent', 'Intent', 'info-circle']].concat((layerParts || []).map(function (x) { return [x.id, x.title, 'grid-2x2']; }), sx.subList.map(function (sub) { return ['sub-' + DS.slug(sub.label), sub.label, 'folder']; }));
    var body = [
      h(P.Breadcrumbs, { items: [{ label: 'UI Inventory', href: '#/' }, { label: sx.n + ' ' + sx.title }] }),
      h(P.EntityHeader, { title: sx.n + ' ' + sx.title, subtitle: sx.intro, headingLevel: 1, media: { icon: sx.icon, hue: 'surface' } }),
      h(SPanel, { key: 'intent', id: 'sec-intent', title: 'Intent' }, props([['Question it answers', sx.question], ['Includes', sx.includes], ['Excludes', sx.excludes], ['Items with their own page', String(recordsOf(sx.id).length)]])),
      (layerParts || []).map(partCard),
      sx.subList.map(function (sub) {
        var home = [], covered = [], none = [];
        // a leaf that is a variant page of the record that answers it has its own page: that variant page
        sub.leaves.forEach(function (l) { var a = ANSWER[sx.id + '|' + l]; (a ? (a.home || variantPageOf(a.rec, l) ? home : covered) : none).push({ leaf: l, a: a }); });
        return h(SPanel, { key: sub.label, id: 'sec-sub-' + DS.slug(sub.label), title: sub.label, headingLevel: 2 }, props([
          home.length ? ['Its own page', h(P.TagList, { label: sub.label + ': its own page' }, home.map(function (x) { return h(P.Chip, { key: x.leaf, onClick: function () { go(leafHref(sx.id + '|' + x.leaf)); } }, x.leaf); }))] : null,
          covered.length ? ['Answered on another page', h(P.TagList, { label: sub.label + ': answered on another page' }, covered.map(function (x) { return h(P.Chip, { key: x.leaf, onClick: function () { go(href(x.a.rec)); } }, x.leaf + ' → ' + x.a.rec.title); }))] : null,
          none.length ? ['Not in Plenix yet', h(P.TagList, { label: sub.label + ': not in Plenix yet' }, none.map(function (x) { return h(P.Tag, { key: x.leaf }, x.leaf); }))] : null], sub.label, ['Where it is answered', 'Items']));
      })];
    return h(OnThisPage, { toc: TOC, scroller: p.scroller, onToc: p.onToc, deps: sx.id + (layerParts ? layerParts.length : 'x') }, body);
  }

  /* an item page: the template of STANDARD.md §7, in the order of importance the owner chose (Plenix decision 2). A section
     with nothing written yet still shows, marked "Not written yet" (decision 4): the specification is a living document. */
  var INTERACTIVE = { Action: 1, Input: 1, Selection: 1, Navigation: 1, Search: 1, Filter: 1, Disclosure: 1, Editing: 1, 'Drag and drop': 1 };
  // the Web item page template (page-template.js; STANDARD.md §7, owner 2026-10-21)
  var TPL = (window.DSPageTemplate || { sections: [] }).sections, TPL_AT = {};
  TPL.forEach(function (s, i) { TPL_AT[s.key] = i; });
  var tplTitle = function (k) { return (TPL[TPL_AT[k]] || {}).title || k; };
  var tplColumns = function (k) { return (TPL[TPL_AT[k]] || {}).columns || []; };
  var keyOf = function (el) { return el && el.key != null ? String(el.key).replace(/^\.\$/, '') : ''; };
  // a section folded into another becomes one of its parts: its title as a subheading, its description, its contents
  var asPart = function (el, title, first) {
    var kids = [].concat(el.props.children == null ? [] : el.props.children);
    return h.apply(null, [React.Fragment, { key: 'part-' + keyOf(el) }, plSub(title || el.props.title, first), el.props.description ? h(Note, null, el.props.description) : null].concat(kids));
  };
  // the item's own parts (a foundation's numbered parts, Themes in Figma, the Styling Standard) sit inside Specification
  var SPEC_PART = /^(p-|figma-themes$|styling$)/;
  // Platforms holds four parts, in the template's order: the counterparts, the functional equivalent (section 6), the
  // Platforms Standard parts the page follows, and Apple's iOS kit in Figma
  var PLATFORM_PARTS = [['xplat', 0], ['platforms', 1], ['plspec', 2], ['figma', 3]];
  function templateBody(body) {
    var specEl = null, specParts = [], plat = [], rest = [];
    body.forEach(function (el) {
      var k = keyOf(el);
      if (k === 'spec') specEl = el;
      else if (SPEC_PART.test(k)) specParts.push(el);
      else if (PLATFORM_PARTS.some(function (x) { return x[0] === k; })) plat.push(el);
      else rest.push(el);
    });
    if (specEl || specParts.length) rest.push(h(SPanel, { key: 'spec', title: tplTitle('spec') },
      specEl ? specEl.props.children : null, specParts.map(function (el, i) { return asPart(el, null, !specEl && i === 0); })));
    // a Platforms section with nothing written stays as it is; once a real part exists, the empty one drops
    var real = plat.filter(function (el) { return keyOf(el) !== 'platforms' || el.props.description; });
    var names = (TPL[TPL_AT.platforms] || {}).parts || [];
    if (real.length) {
      real.sort(function (a, b) { return PLATFORM_PARTS.filter(function (x) { return x[0] === keyOf(a); })[0][1] - PLATFORM_PARTS.filter(function (x) { return x[0] === keyOf(b); })[0][1]; });
      rest.push(h(SPanel, { key: 'platforms', title: tplTitle('platforms'), description: 'The same item on iOS and Android: ' + names.join(', ').toLowerCase().replace('apple ios', 'Apple’s iOS') + '.' },
        real.map(function (el, i) { return asPart(el, names[PLATFORM_PARTS.filter(function (x) { return x[0] === keyOf(el); })[0][1]], i === 0); })));
    } else plat.forEach(function (el) { rest.push(el); });
    // the template's order; the variant cards follow Variants, the page header comes first, anything else keeps its place
    var at = -1, ranked = rest.map(function (el, i) {
      var k = keyOf(el);
      at = /^(bc|rh|open)$/.test(k) ? -1 : TPL_AT[k] != null ? TPL_AT[k] : /^(base|ex)/.test(k) ? TPL_AT.exh : at;
      return { el: el, at: at, i: i };
    });
    ranked.sort(function (a, b) { return a.at - b.at || a.i - b.i; });
    return ranked.map(function (x) { return x.el; });
  }
  function templateToc(body) {
    var have = {}; body.forEach(function (el) { have[keyOf(el)] = 1; });
    return TPL.filter(function (s) { return have[s.key]; }).map(function (s) { return [s.key, s.title, s.key === 'platforms' ? 'phone' : undefined]; });
  }
  function ItemPage(p) {
    var r = p.r, sx = SEC[r.sec];
    var files = r.src ? [r.src].concat(r.also || []) : [];
    var data = useAsync(function () {
      return Promise.all([Promise.all(files.map(R.text)), cssFilesOf(r).then(function (cf) { return Promise.all(cf.map(R.text)).then(function (t) { return { files: cf, texts: t }; }); }), r.src ? R.header(r.src) : Promise.resolve(['', ''])]);
    }, [r.id]);
    var also = r.covers.map(function (c) { return c.indexOf('/') > 0 && SEC[c.split('/')[0]] ? c.split('/')[1] + ' (' + SEC[c.split('/')[0]].title + ')' : c; });
    var head = data ? data[2] : ['', ''];
    var overview = r.text || head[0] || (r.placeholder ? 'Not written yet.' : '');
    var todo = function (what) { return h(Note, null, (what ? what + ': ' : '') + 'Not written yet.'); };
    // `name` in written text is a technical value: it is drawn as code in the data font (batch 208)
    var rich = function (v) { return typeof v !== 'string' || v.indexOf('`') < 0 ? v : v.split('`').map(function (part, i) { return i % 2 ? h(P.Text, { key: i, as: 'code', variant: 'data' }, part) : part; }); };
    // a row that only says it does not apply (one sentence: "Not applicable: …", "None …") is hidden; a constraint
    // ("Not focusable") or a row with guidance after it stays, and a table never loses every row (spec wording rule 2)
    var emptyNote = function (v) { return typeof v === 'string' && /^(Not applicable|None)\b/.test(v) && sentencesOf(v).length === 1; };
    var say = function (name, v) { var row = [name, orTodo(v)]; row.raw = v; return row; };
    var said = function (rows) { var all = rows.filter(Boolean), kept = all.filter(function (x) { return !emptyNote(x.raw); }); return kept.length ? kept : all; };
    var orTodo = function (v) { return v == null || v === '' ? h(P.Text, { variant: 'secondary' }, 'Not written yet') : rich(v); };
    // an item with no source file of its own (a foundation, pattern, page structure, template or utility): rows read from
    // code do not apply to it, and say why (batch 208)
    var noCode = r.level === 'Foundation' ? 'a foundation, applied through its tokens and the system stylesheets (Specification above)' : 'a ' + String(r.level).toLowerCase() + ', made from the Platform components in its Anatomy and Related items';
    var na = function (v) { return v == null || v === '' ? (r.placeholder ? null : 'Not applicable: ' + noCode) : v; };
    // which apps use it: the Platform exports it names (r.plenix), looked up in the apps' imports (usage.js, build-usage.js)
    var usedIn = (function () {
      var names = String(r.plenix || '').split(/[,\s]+/).map(function (x) { return x.split('.')[0]; }).filter(Boolean), apps = [];
      names.forEach(function (n) { ((window.DSUsage || {})[n] || []).forEach(function (a) { if (apps.indexOf(a) < 0) apps.push(a); }); });
      return apps.sort();
    })();

    // what the code says (when the item has files): its classes, tokens, roles and keys
    var jsxTexts = data ? data[0] : [], css = data ? data[1] : { files: [], texts: [] };
    var allCss = css.texts.join('\n');
    if (r.blocks) allCss = (allCss.replace(/\/\*[\s\S]*?\*\//g, '').match(/[^{}]+\{[^{}]*\}/g) || []).filter(function (rule) { var sel = rule.split('{')[0]; return r.blocks.some(function (b) { return new RegExp('\\.' + b + '(?![\\w-])|\\.' + b + '(__|--)').test(sel); }); }).join('\n');
    var cl = classesOf(allCss), tk = tokensOf(allCss);
    if (r.blocks) {
      var mine = function (c) { return /^is-/.test(c) || r.blocks.some(function (b) { return c === b || c.indexOf(b + '__') === 0 || c.indexOf(b + '--') === 0 || (b.indexOf('__') > 0 && c.indexOf(b) === 0); }); };
      Object.keys(cl.kinds).forEach(function (k) { cl.kinds[k] = cl.kinds[k].filter(mine); });
      Object.keys(cl.all).forEach(function (c) { if (!mine(c)) delete cl.all[c]; });
    }
    var dens = (allCss.match(/--plx-sys-control-height-([\w-]+)/g) || []).map(function (x) { return x.replace('--plx-sys-control-height-', ''); }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var ax = a11yOf(jsxTexts.join('\n'));
    var B = r.behavior || {}, A = r.a11y || {}, C = r.content || {}, D = r.assets || {}, G = r.guidance || null;
    // a list of the guidance's rules (a placeholder with common-ground guidance)
    var rules = function (label, list) { return list && list.length ? h(P.List, { label: label, variant: 'bullets', items: list.map(function (x) { return { children: rich(x) }; }) }) : todo(); };
    var specParts = useAsync(function () {
      if (!r.guide || !(r.guide.families || r.guide.labs)) return Promise.resolve([]);
      return pagePartsOf(r.id, function (c, d) {
        var fam = familiesOf(d);
        (r.guide.families || []).forEach(function (fname) { if (fam[fname]) renderFamily(fname, fam[fname], d, c); });
        (r.guide.labs || []).forEach(function (id) { var part = labSection(id, d); if (part) c.appendChild(part); });
      });
    }, [r.id]);
    useEffect(function () {   // #/<section>/<item>/cls/<class>: scroll to that class in Anatomy and mark it
      if (!p.cls || !data) return;
      var at = function () { var e = document.getElementById('cls-' + p.cls); if (!e) return; e.scrollIntoView({ block: 'center' }); e.setAttribute('data-ds-marked', 'true'); };
      var t = setTimeout(at, 120), t2 = setTimeout(at, 900);   // again once the examples above have drawn
      return function () { clearTimeout(t); clearTimeout(t2); };
    }, [p.cls, !!data]);

    var body = [
      h(P.Breadcrumbs, { key: 'bc', items: [{ label: 'UI Inventory', href: '#/' }, { label: sx.n + ' ' + sx.title, href: '#/' + sx.id }, { label: r.sub }, { label: r.title }].filter(function (c) { return c.label; }) }),
      h(P.EntityHeader, { key: 'rh', title: r.variantPages ? r.title + ' · Base' : r.title, subtitle: overview, headingLevel: 1, media: { icon: r.icon, hue: 'surface' }, facts: [{ label: 'Level', value: r.level }], status: { tone: r.placeholder && !r.standardPage ? 'neutral' : 'success', label: r.status } }),
      r.href ? h('div', { key: 'open' }, h(P.Button, { href: r.href, variant: 'primary', icon: 'expand' }, 'Open ' + r.title.replace(/ \(reference\)$/, ''))) : null,
      // 1 Overview and Purpose
      h(SPanel, { key: 'purpose', title: 'Overview and Purpose' }, props([['Overview', orTodo(r.text || head[0] || (r.purpose ? String(r.purpose).split('. ')[0].replace(/\.?$/, '.') : null))], ['Purpose', orTodo(r.purpose)],
        G ? ['Common ground', G.commonGround] : null, G && G.sources && G.sources.length ? ['Sources', h(P.Stack, { gap: 'none' }, G.sources.map(function (u) { return h(P.Link, { key: u, href: u, external: true }, u.replace(/^https?:\/\//, '')); }))] : null,
        r.usedBy ? ['Used by', h(P.TagList, { label: 'Used by' }, r.usedBy.map(function (u) { return h(P.Chip, { key: u[0], onClick: function () { if (u[1].charAt(0) === '#') go(u[1]); else location.href = u[1]; } }, u[0]); }))] : null])),
      // 2 Usage: one card, When to use and When not to use as its subheadings
      h(SPanel, { key: 'guide', id: 'sec-guide', title: 'Usage' },
        h(P.Text, { as: 'h3', variant: 'label' }, 'When to use'),
        r.use.length ? h(P.List, { label: 'When to use', items: r.use.map(function (x) { return { icon: 'circle-check', tone: 'success', children: x }; }) }) : todo(),
        h(P.Text, { as: 'h3', variant: 'label', className: 'plx-u-mt-stack-md' }, 'When not to use'),
        r.avoid.length ? h(P.List, { label: 'When not to use', items: r.avoid.map(function (x) { return { icon: 'close', tone: 'danger', children: x }; }) }) : todo())
    ];
    // 3 Variants (and examples), the Button lab, the foundation specification
    if (r.examples && r.examples.length) {
      body.push(h(P.SectionHeading, { key: 'exh' }, tplTitle('exh')));
      var ectx = { css: allCss, block: r.blocks ? r.blocks[0] : r.src && /^(components|patterns)\//.test(r.src) ? 'plx-' + kebab(r.src.split('/').slice(-2)[0]) : null, props: head[2] ? head[2].props : [],
        vlink: function (g, n) { var vp = (r.variantPages || []).filter(function (v) { return v.group === g && (v.name === n || (v.also || []).indexOf(n) >= 0); })[0]; return vp ? vhref(r, vp) : null; } };
      if (r.examples.some(function (e) { return Array.isArray(e[1]); })) body.push(h(BaseCard, { key: 'base' + r.id, ctx: ectx, groups: r.examples }));
      r.examples.forEach(function (e, i) { body.push(h(Example, { key: 'ex' + r.id + i, ex: e, ctx: ectx })); });
    } else body.push(h(SPanel, { key: 'exh', title: 'Variants' }, r.placeholder ? todo()
      : css.files.length && cl.kinds.modifier.length ? props([['Its variants (modifier classes)', lines(cl.kinds.modifier, '—', 'class'), true], ['Examples', 'Not drawn here yet; the classes are in Anatomy']])
      : css.files.length ? h(P.Text, { as: 'p' }, 'One form: it has no variants.') : h(P.Text, { as: 'p' }, 'Not applicable: ' + noCode + '.')));
    // themes authored in Figma (owner, 2026-10-12; a future release): the entry point, marked as coming
    if (r.id === 'themes') body.push(h(SPanel, { key: 'figma-themes', title: 'Themes in Figma', description: 'Coming in a future release.' },
      h(Stack, null, h(P.Text, { as: 'p' }, 'A new theme starts from the Plenix Light and Dark themes. "New theme in Figma" makes a Figma file for it with the Plenix variables as its starting values; each part of the design system that can be adjusted opens its component there ("Open in Figma" beside Edit). Changes to the theme’s variables come back as token changes: a pull request that rebuilds and checks the design system, as the Edit dialog’s Save does.'),
        h('div', null, FigmaFuture('figma-theme', 'New theme in Figma', true)))));
    if (r.lab && LAB(r)) body.push(h(SPanel, { key: 'lab', title: tplTitle('lab'), description: 'Every variant, drawn and editable.' }, props([['Every variant in every state', h(P.Stack, { gap: 'none' }, [h(P.Link, { key: 'all', href: '#/' + r.sec + '/' + r.id + '/v/all' }, 'All ' + pluralOf(r.title))].concat((r.extraLabs || []).map(function (x) { return h(P.Link, { key: x.id, href: '#/' + r.sec + '/' + r.id + '/v/all-' + x.id }, 'All ' + pluralOf(x.title)); })))], ['The drawing and Edit', 'On each variant\'s page (Attributes)']])));
    if (r.guide) {
      var V = r.guide.render && VIEWS[r.guide.render];
      if (V) body.push(h(SPanel, { key: 'spec', title: tplTitle('spec') }, h(V)));
      (specParts || []).forEach(function (x) { body.push(partCard(x)); });
    }
    if (r.id === 'css-architecture') { var sv = StylingView(); if (sv) body.push(sv); }
    var plPage = window.DSPlatforms && window.DSPlatforms.pageOf(r);
    if (plPage && plPage.standard) StandardView({ spec: plPage }).forEach(function (n) { body.push(n); });
    var wm = !(plPage && plPage.standard) ? NG().webMap && NG().webMap[r.sec + '|' + r.leaf] : null; if (wm) { body.push(CrossPanel({ ios: wm.ios, android: wm.android, guidance: wm.ios })); var wf = FigmaPanel(wm.ios, r.leaf); if (wf) body.push(wf); }
    // an Android or iOS page the standard has no part for yet: its counterparts all the same
    var nk = r.sec + '|' + r.leaf; if (!(plPage && plPage.standard) && /^android-/.test(r.sec) && ((NG().androidWeb[nk] || []).length || (NG().byAndroid[nk] || []).length)) { body.push(CrossPanel({ web: NG().androidWeb[nk] || [], ios: NG().byAndroid[nk] || [], guidance: NG().byAndroid[nk] || [] })); var af = FigmaPanel(NG().byAndroid[nk], r.leaf); if (af) body.push(af); }
    if (plPage && !plPage.standard) body.push(h(SPanel, { key: 'plspec', title: 'Platform specification', description: 'The parts of the Plenix Platforms Standard this page follows (platform/standards/platforms.md).' }, h(PlatformPage, { parts: plPage.parts })));
    // 4 States: only where states apply (an interactive item, or one not decided yet)
    var autoStates = css.files.length ? statesOf(allCss) : [];
    var firstRender = (function () { var e = (r.examples || [])[0]; if (!e) return null; return Array.isArray(e[1]) ? (e[1][0] || [])[1] : e[1]; })();
    if (r.states) body.push(h(SPanel, { key: 'states', title: 'States', description: 'What each state looks like, how it is set and what it changes.' }, table('States', tplColumns('states'), r.states.map(function (row) { return [row[0], row[1], row[2], row[3] || '—'].map(linkify); }))));
    else if (autoStates.length) body.push(h(StatesPanel, { key: 'states', states: autoStates, sample: r.stateSample || firstRender, cards: r.id === 'button' }));
    else if (r.statesFrom || r.stateNote) body.push(h(SPanel, { key: 'states', title: 'States', description: 'A composite: its states are the states of its parts.' },
      r.stateNote ? h(P.Text, { as: 'p' }, linkify(r.stateNote)) : null,
      r.statesFrom ? h(P.TagList, { label: 'Parts whose states apply' }, r.statesFrom.filter(function (id) { return BY[id]; }).map(function (id) { return h(P.Chip, { key: id, onClick: function () { go(href(BY[id])); } }, BY[id].title + ' › States'); })) : null));
    else if (interOf(r).some(function (x) { return INTERACTIVE[x]; }) || r.placeholder) body.push(h(SPanel, { key: 'states', title: 'States' }, todo()));
    // 5 Anatomy: the parts, then what its stylesheet names
    body.push(h(SPanel, { key: 'anat', title: 'Anatomy', description: css.files.length ? 'The parts, then the class names in its stylesheets' + (r.blocks ? ' (its own: ' + r.blocks.map(function (b) { return '.' + b; }).join(', ') + ')' : '') + '.' : undefined },
      r.wire ? h(Wire, { w: r.wire }) : null,
      props([['Parts (required, optional, slots)', r.wire ? 'The lettered regions above' : G ? rules('Parts', G.anatomy) : Array.isArray(r.anatomy) ? rules('Parts', r.anatomy) : orTodo(r.anatomy)],
        css.files.length ? ['Block', lines(cl.kinds.block, '—', 'class'), true] : null, css.files.length ? ['Elements', lines(cl.kinds.element, '—', 'class'), true] : null,
        css.files.length ? ['Variants (modifiers)', lines(cl.kinds.modifier, '—', 'class'), true] : null, css.files.length ? ['States (classes)', lines(cl.kinds.state, '—'), true] : null,
        css.files.length ? ['States (pseudo-classes, attributes)', lines(cl.pseudo, '—'), true] : null])));
    // 6 Behavior
    if (G) body.push(h(SPanel, { key: 'behavior', title: 'Behavior', description: 'The common ground of the enterprise design systems.' }, rules('Behavior', G.behavior)));
    else body.push(h(SPanel, { key: 'behavior', title: 'Behavior' }, props(said([
      say('Mouse and touch', B.pointer),
      say('Keyboard', B.keyboard || (files.length ? (ax.keys.length ? 'Handles ' + ax.keys.join(', ') : 'Native keyboard behavior') : null)),
      say('Focus', B.focus || (files.length ? (ax.focus ? 'Manages focus (moves or restores it)' : 'Native focus order') : null)),
      say('Responsive', B.responsive || (css.files.length ? (/@media|@container/.test(allCss) ? 'Its own media or container queries' : 'From where it is placed (the grid and the shell)') : null)),
      say('Density', css.files.length ? (dens.length ? 'Follows display density through its control roles: ' + dens.join(', ') : 'Fixed sizes: display density does not change it') : B.density || (r.level === 'Foundation' ? 'See the Specification above' : na(null))),
      say('Motion', B.motion || (css.files.length ? (/motion-duration/.test(allCss) ? 'Motion tokens; reduced motion honored globally' : 'None of its own') : null)),
      say('Loading', B.loading), say('Error', B.error)]))));
    // 6b Platforms (Plenix decision 11): sizes and behavior per platform; the look comes from the theme everywhere
    var plRows = window.DSPlatforms && window.DSPlatforms.of(r);
    if (plRows) body.push(h(SPanel, { key: 'platforms', title: 'Platforms', description: 'Size, target and behavior on the web, iOS and Android, and the control each platform uses (the Plenix Platforms Standard, section 6).' }, h(PlatformRows, { spec: plRows })));
    else if (!r.placeholder && interOf(r).some(function (x) { return INTERACTIVE[x]; })) body.push(h(SPanel, { key: 'platforms', title: 'Platforms' }, todo()));
    // 7 Accessibility
    if (G) body.push(h(SPanel, { key: 'a11y', title: 'Accessibility', description: 'The common ground of the enterprise design systems.' }, rules('Accessibility', G.accessibility)));
    else body.push(h(SPanel, { key: 'a11y', title: 'Accessibility', description: files.length ? 'Roles and ARIA attributes are read from its JSX.' : undefined }, props(said([
      ['Semantic role', files.length ? lines(ax.roles, 'native elements only') : orTodo(na(A.role)), !!files.length && ax.roles.length > 0],
      ['ARIA attributes', files.length ? lines(ax.aria, '—') : orTodo(na(null)), !!files.length],
      say('Accessible name', A.name), say('Screen-reader announcements', A.announce),
      say('Focus management', A.focus || (files.length ? (ax.focus ? 'Moves or restores focus' : 'Native focus order') : null)),
      say('Contrast', A.contrast || (css.files.length ? 'Colors from the theme roles (light and dark)' : null)),
      say('Reduced motion', A.motion || (css.files.length ? 'Honored globally (platform/system/motion.css)' : null)),
      ['Every control', 'An accessible name, a visible focus indicator, 44px targets on touch']]))));
    // 8 Content guidance
    if (G) body.push(h(SPanel, { key: 'content', title: 'Content guidance', description: 'How to write its text.' }, rules('Content guidance', G.content)));
    else body.push(h(SPanel, { key: 'content', title: 'Content guidance' }, props(said([say('Labels', C.labels), say('Action copy', C.actions), say('Error messages', C.errors), say('Localization', C.localization)]))));
    // 9 Implementation: the API (header comment), then the tabs
    if (head[2]) {   // the structured header comment: the summary as text, the usage as code, the props as a table
      var hp = head[2], defs = R.defaults(jsxTexts[0]);
      var typeOf = function (v) { return v == null ? '—' : /^['"`]/.test(v) ? 'string' : /^(true|false)$/.test(v) ? 'boolean' : /^-?\d/.test(v) ? 'number' : /^\[/.test(v) ? 'array' : /^\{/.test(v) ? 'object' : '—'; };
      var sub = function (t) { return h(P.Text, { as: 'h3', variant: 'label', className: 'plx-u-mt-stack-md' }, t); };
      body.push(h(SPanel, { key: 'api', title: 'Development and API', description: 'From the source file\'s header comment and its code.' },
        h(P.Text, { as: 'p' }, hp.summary),
        hp.usage ? [sub('Code usage'), h(P.CodeBlock, { key: 'u', language: 'jsx' }, hp.usage)] : null,
        hp.props.length ? [sub('Props'), h(P.Table, { key: 'p', label: 'Props', index: 'name', data: hp.props.map(function (x) { var n = x[0].replace(/\(.*$/, ''); return { name: x[0], type: typeOf(defs[n]), def: defs[n] || '—', text: x[1] }; }),
          columns: [{ title: 'Prop', field: 'name', kind: 'data', rowLabel: true, width: '--plx-ref-size-240px' }, { title: 'Type', field: 'type' }, { title: 'Default', field: 'def', kind: 'data' }, { title: 'Description', field: 'text', kind: 'wrap' }] })] : null,
        hp.behavior.length ? [sub('Code behavior'), h(P.List, { key: 'b', label: 'Behavior', items: hp.behavior.map(function (x) { return { children: x }; }) })] : null,
        hp.notes.length ? [sub('Notes'), h(P.List, { key: 'n', label: 'Notes', items: hp.notes.map(function (x) { return { children: x }; }) })] : null));
    } else if (head[1]) body.push(h(SPanel, { key: 'api', title: 'Development and API', description: 'The source file\'s header comment (not yet in the structured form).' }, h(P.CodeBlock, { maxHeight: 'tall', language: 'text' }, head[1])));
    var tabs = [];
    files.forEach(function (f, i) { tabs.push({ value: 'jsx' + i, label: f.split('/').pop(), content: h(P.CodeBlock, { title: 'platform/' + f, maxHeight: 'tall' }, jsxTexts[i]) }); });
    css.files.forEach(function (f, i) { tabs.push({ value: 'css' + i, label: f.split('/').pop(), content: h(P.CodeBlock, { title: 'platform/' + f, maxHeight: 'tall' }, css.texts[i]) }); });
    if (css.files.length) {
      tabs.push({ value: 'classes', label: 'Classes', count: Object.keys(cl.all).length, content: h(P.Table, { label: 'Classes', index: 'cls', data: Object.keys(cl.all).sort().map(function (c) { return { cls: c, name: '.' + c, kind: /^is-/.test(c) ? 'state' : /--/.test(c) ? 'modifier (variant)' : /__/.test(c) ? 'element (anatomy)' : 'block', rules: String(cl.all[c]) }; }),
        columns: [{ title: 'Class', field: 'name', kind: 'data', rowLabel: true, width: '--plx-ref-size-240px' }, { title: 'Kind', field: 'kind', filter: 'list' }, { title: 'Rules', field: 'rules', kind: 'data', align: 'right', sorter: 'number' }] }) });
      tabs.push({ value: 'tokens', label: 'Tokens', count: tk.used.length, content: props([['Declares', lines(tk.declared, '—', 'token', 'Declares')], ['Uses', lines(tk.used, '—', 'token', 'Uses')]]) });
    }
    tabs.unshift({ value: 'use', label: 'Use in code', content: props([
      ['React', r.src && /^(components|patterns|providers|hooks)\//.test(r.src) ? 'import { ' + (r.plenix || '').split(/,\s*/)[0].split('.')[0] + ' } from \'@plenix-ds/react\'' : orTodo(na(r.plenix)), !!(r.src && /^(components|patterns|providers|hooks)\//.test(r.src)) || !!r.plenix],
      ['HTML / CSS', css.files.length ? 'The .' + (r.blocks ? r.blocks[0] : r.src ? 'plx-' + kebab(r.src.split('/').slice(-2)[0]) : cl.kinds.block[0] || 'plx-') + ' classes from @plenix-ds/styles (plenix.css)' : orTodo(na(null))],
      ['Vue, Angular, Web components, native', 'Not provided']]) });
    body.push(h(SPanel, { key: 'impl', title: 'Implementation', description: 'How to use it in code, and the files themselves: the JSX, the CSS, the classes and the tokens.' },
      h(P.Tabs, { key: 'tabs' + r.id, variant: 'folder', label: 'Implementation', items: tabs }),
      tabs.length === 1 && !r.placeholder ? h(Note, null, 'A pattern or guide with no source file of its own; its implementation is the items it combines (Related items).') : null));
    // 10 Design assets
    // (the Figma design is each variant's own: the variant block, §7)
    body.push(h(SPanel, { key: 'assets', title: 'Design assets' }, props([
      ['Token references', css.files.length ? tk.used.length + ' tokens (Implementation › Tokens)' : orTodo(r.level === 'Foundation' ? 'Its tokens: see the Specification above' : na(null))],
      ['Icon references', r.placeholder ? orTodo(null) : h(P.Inline, { gap: 'xs' }, h(P.Icon, { name: r.icon }), h(P.Text, { variant: 'data' }, r.icon))],
      ['Template references', orTodo(D.templates || (r.placeholder ? null : usedIn.length ? h(P.TagList, { label: 'Used in' }, usedIn.map(function (a) { return h(P.Tag, { key: a }, a); })) : r.usedBy ? 'See Used by (Overview and Purpose)' : 'Not used by a Plenix app yet'))],
      // the owner's own studies for this item, kept as references until they are built (r.studies: [label, href, note])
      r.studies && r.studies.length ? ['Reference studies', h(P.Stack, { gap: 'none' }, r.studies.map(function (s) { return h(P.Text, { key: s[1], as: 'p' }, h(P.Link, { href: s[1], external: true }, s[0]), s[2] ? ' — ' + s[2] : ''); }))] : null])));
    // 11 Related items, 12 Source-system mappings
    body.push(h(SPanel, { key: 'rel', title: 'Related items' }, r.related.length ? h(P.TagList, { label: 'Related items' }, r.related.filter(function (id) { return BY[id]; }).map(function (id) { return h(P.Chip, { key: id, onClick: function () { go(href(BY[id])); } }, BY[id].title); })) : todo()));
    body.push(h(SPanel, { key: 'map', title: 'Source-system mappings', description: 'Other design systems are reference libraries: their names are aliases of this canonical item.' },
      r.map.length ? table('Source-system mappings', ['Source system', 'Source component', 'Match type', 'Notes'], r.map.map(function (m) { return [m[0], m[1], m[2], m[3] || '—']; })) : r.placeholder ? todo() : h(Note, null, 'No direct equivalent in the mapped systems.')));
    // 13 Details and Lifecycle
    body.push(h(SPanel, { key: 'details', title: 'Details and Lifecycle' }, props([
      ['Canonical name', r.leaf], ['Canonical ID', r.sec + '.' + DS.slug(r.sub) + '.' + (r.placeholder ? DS.slug(r.leaf) : r.id), true],
      ['Category', 'UI Inventory › ' + sx.n + ' ' + sx.title + ' › ' + r.sub + ' › ' + r.leaf],
      also.length ? ['Also answers', lines(also, '—', null, 'Also answers')] : null,
      ['Aliases', r.aliases.length ? h(P.TagList, { label: 'Aliases' }, r.aliases.map(function (a) { return h(P.Tag, { key: a }, a); })) : r.placeholder ? orTodo(null) : '—'],
      ['Plenix', r.plenix ? r.plenix : orTodo(na(null)), !!r.plenix],
      ['Component level', r.level], ['Interaction', interText(r)], ['Scope', r.scope],
      ['Status', h(P.Badge, { tone: r.placeholder ? 'neutral' : 'success', variant: 'soft' }, r.status)], ['Owner', r.owner], ['Last reviewed', r.reviewed, true], ['Version', (window.DSRelease ? 'Release ' + window.DSRelease.version : 'Platform build') + ' (CHANGELOG.md; see 14 › Changelog)']])));
    // the template (page-template.js, §7): the sections in its order, with its titles; every top-level section is a scroll
    // target (sec-<key>), listed in "On this page"
    if (!(plPage && plPage.standard)) body = templateBody(body);
    var TOC = templateToc(body);
    // a Platforms page is written by the Platforms Standard: no empty template sections, and its own contents
    if (plPage && plPage.standard) {
      if (r.placeholder) body = body.filter(function (el) { var k = el && String(el.key).replace(/^\.\$/, ''); return k === 'bc' || k === 'rh' || /^(np-|figma|xplat|plspec|std)/.test(k || ''); });
      var have = {}; body.forEach(function (el) { if (el && el.key) have[String(el.key).replace(/^\.\$/, '')] = 1; });
      TOC = NATIVE_TOC.filter(function (t) { return have[t[0]]; }).map(function (t) { return [t[0], t[1], t[2] || TOC_ICON[t[0].replace(/^np-/, '')]]; });
      if (have['std-lead'] || have.std0) TOC.splice(TOC.findIndex(function (t) { return t[0] === 'np-api' || t[0] === 'np-impl' || t[0] === 'np-map'; }) < 0 ? TOC.length : TOC.findIndex(function (t) { return t[0] === 'np-api' || t[0] === 'np-impl' || t[0] === 'np-map'; }), 0,
        ...(have['std-lead'] ? [['std-lead', 'The standard', 'phone']] : []), ...plPage.standard.sections.map(function (x, i) { return ['std' + i, (x.n ? x.n + '. ' : '') + x.title, 'phone']; }));
    }
    body = body.map(function (el) {
      if (!el || !el.key) return el;
      var k = String(el.key).replace(/^\.\$/, '');
      if (k === 'exh' && el.type === P.SectionHeading) return h('div', { key: 'exh', id: 'sec-exh' }, el);
      return TOC.some(function (t) { return t[0] === k; }) ? React.cloneElement(el, { id: 'sec-' + k }) : el;
    });
    return h(OnThisPage, { toc: TOC, scroller: p.scroller, onToc: p.onToc, deps: r.id + (data ? '1' : '0') + (specParts ? specParts.length : 'x') }, body);
  }

  /* "On this page": the shell's right pane (SidePanel), like the asset app's Files pane: a header with its icon and title,
     then the Platform Tree, one row per section that the page has, each with its icon; the usage sections are the
     children of Usage. The row of the section in view is selected (scroll spy); a row scrolls to its section. The page
     reports its sections and the one in view to the App, which draws the pane. */
  // one icon per kind of section, never two kinds on one icon (owner, 2026-10-10: one look); 'document' marks only what is
  // not in Plenix yet
  var TOC_ICON = { purpose: 'circle-info', intent: 'circle-info', behavior: 'settings-customize', content: 'text-card', assets: 'download-tray', details: 'tags', states: 'settings-preferences', guide: 'list-bullets', exh: 'image-b', lab: 'sparkle', spec: 'doc-text',
    api: 'doc-search', anat: 'cards-medium', attrs: 'fields', a11y: 'settings-permissions', impl: 'settings-catalog', impls: 'app-switcher', rel: 'share', map: 'merge', plspec: 'phone' };
  var TOC_ALL = 'view-all';   // the "View all" row of On this page: every section at once (the default)
  // a Figma action that comes in a future release (themes authored in Figma, owner 2026-10-12): shown, not yet usable
  // (the badge only where nothing around it says so: on the Themes page the section's description does, owner 2026-10-12)
  function FigmaFuture(key, label, said) {
    return h(P.Inline, { key: key, gap: 'xs', align: 'center' }, h(P.Button, { size: 'sm', icon: 'open', disabled: true }, label), said ? null : h(P.Badge, null, 'Future release'));
  }
  var tocIcon = function (x) { return x[2] || TOC_ICON[x[0]] || 'doc-text'; };  // 'document' is kept for what is not in Plenix yet (owner, 2026-10-10)
  function OnThisPage(p) {
    var present = useState([]), active = useState(null);
    useEffect(function () {   // which sections this page has, once they are drawn
      var t = setTimeout(function () { present[1](p.toc.filter(function (x) { return document.getElementById('sec-' + x[0]); })); }, 50);
      return function () { clearTimeout(t); };
    }, [p.deps]);
    useEffect(function () {   // the section in view
      var sc = p.scroller.current; if (!sc) return undefined;
      var spy = function () {
        var top = sc.getBoundingClientRect().top + 96, cur = null;
        present[0].forEach(function (x) { var e = document.getElementById('sec-' + x[0]); if (e && e.getBoundingClientRect().top <= top) cur = x[0]; });
        if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4 && present[0].length) cur = present[0][present[0].length - 1][0];
        active[1](cur || (present[0][0] && present[0][0][0]));
      };
      spy(); sc.addEventListener('scroll', spy); return function () { sc.removeEventListener('scroll', spy); };
    }, [present[0]]);
    // one section at a time (owner, 2026-10-12): choosing a section shows only it; "View all", the default, shows the
    // whole page. The page's own header (breadcrumb and title) always stays.
    var only = useState(null);
    useEffect(function () {
      // a section is its marked element (sec-<key>) and everything after it up to the next one (the variant cards after
      // the Variants heading); what comes before the first section is the page's header and always shows
      var first = present[0].map(function (x) { return document.getElementById('sec-' + x[0]); }).filter(Boolean)[0];
      if (first && first.parentElement) {
        var cur = null;
        Array.prototype.forEach.call(first.parentElement.children, function (el) {
          if (/^sec-/.test(el.id)) cur = el.id.slice(4);
          el.classList.toggle('ds-section-hidden', !!only[0] && cur !== null && cur !== only[0]);
        });
      }
      var sc = p.scroller.current; if (sc && only[0]) sc.scrollTop = 0;
    }, [only[0], present[0]]);
    var go = function (id) {
      if (id === TOC_ALL) { only[1](null); return; }
      only[1](id); active[1](id);
      setTimeout(function () {   // once the other sections are hidden: the chosen one's heading takes focus
        var e = document.getElementById('sec-' + id); if (!e) return;
        var f = e.querySelector('h2, h3'); if (f) { f.setAttribute('tabindex', '-1'); f.classList.add('ds-jump-target'); f.focus({ preventScroll: true }); }
      }, 0);
    };
    useEffect(function () { p.onToc({ rows: present[0], active: only[0] || TOC_ALL, go: go }); }, [present[0], only[0]]);
    useEffect(function () { return function () { p.onToc(null); }; }, []);
    var icons = {}; p.toc.forEach(function (x) { icons[x[0]] = tocIcon(x); });
    return h(TocIcons.Provider, { value: icons }, h(Stack, null, p.children));
  }
  var tocNarrow = P.below('--plx-sys-shell-inspector-overlay-below');
  function TocPane(p) {
    var t = p.toc, narrow = useState(window.matchMedia(tocNarrow).matches);
    useEffect(function () { var mq = window.matchMedia(tocNarrow), f = function () { narrow[1](mq.matches); }; mq.addEventListener('change', f); return function () { mq.removeEventListener('change', f); }; }, []);
    if (narrow[0]) return null;   // a narrow window keeps the whole width for the content
    return h('aside', { 'aria-label': 'On this page', className: 'ds-toc-pane' },
      h('div', { className: 'ds-toc-head' }, h(P.Icon, { name: 'list-lines' }), h('span', null, 'On this page')),
      h(P.NavList, { label: 'Sections of this page', value: t.active, onSelect: t.go, items: [{ id: TOC_ALL, label: 'View all', icon: 'cards-medium' }].concat(t.rows.map(function (x) { return { id: x[0], label: x[1], icon: tocIcon(x) }; })) }));
  }
  // the pane: as the asset app's Files pane (left of the content, a divider on its right), narrow, scrolling on its own

  /* ── the navigation pane: the Platform NavList, the same as every application's: one collapsible group per section (its
     icon in the heading), an icon on every item; the current section opens, a search opens every match ── */
  function SpecNav(p) {
    var needle = p.find.trim().toLowerCase();
    // every leaf of the standard, in its order, in a folding subgroup per subcategory (its leaf count after its name): its
    // own page, the page that answers it, or its placeholder page (muted); the subgroup holding the current page opens, a
    // search opens every subgroup with a match
    var groups = TAX.filter(function (s) { return platformOf(s) === p.platform; }).map(function (s) {
      var rows = [];
      s.subList.forEach(function (sub) {
        var kids = [];
        sub.leaves.forEach(function (l) {
          var a = ANSWER[s.id + '|' + l], r = a.rec;
          if (needle && [l, r.title, r.leaf, sub.name, r.plenix || ''].concat(r.aliases).join(' ').toLowerCase().indexOf(needle) < 0) return;
          var vp = variantPageOf(r, l);
          kids.push({ id: rowId(s.id, sub.name, l), label: l, icon: a.placeholder ? 'document' : r.icon, muted: !!a.placeholder, href: vp ? vhref(r, vp) : href(r) });
        });
        // a component whose variants are items here: its "· Base" page (what every variant shares) heads the subgroup
        REC.filter(function (r) { return r.variantPages && r.sec === s.id && r.sub === sub.name; }).forEach(function (r) {
          if (r.lab && (!needle || ('all ' + r.title).toLowerCase().indexOf(needle) >= 0)) kids.unshift({ id: 'all:' + r.id, label: 'All ' + pluralOf(r.title), icon: 'grid-2x2', href: '#/' + r.sec + '/' + r.id + '/v/all' });
          if (!needle || (r.title + ' base').toLowerCase().indexOf(needle) >= 0) kids.unshift({ id: 'base:' + r.id, label: r.title + ' · Base', icon: r.icon, href: href(r) });
        });
        if (kids.length) { if (sub.flat) rows = rows.concat(kids); else rows.push({ id: 'sub:' + s.id + '|' + sub.name, label: sub.name, count: kids.length, defaultExpanded: !!needle, children: kids }); }
      });
      if (needle && !rows.length) return null;
      return { heading: s.n + ' ' + s.title, icon: s.icon, defaultExpanded: !!needle || s.id === p.sid,
        items: [{ id: 'sec:' + s.id, label: 'Overview', icon: 'info-circle', href: '#/' + s.id }].concat(rows) };
    }).filter(Boolean);
    var vpc = p.rid && p.variant ? variantPageOf(BY[p.rid], null, p.variant) : null;
    var cur = p.rid && p.variant === 'all' ? 'all:' + p.rid : vpc ? rowId(BY[p.rid].sec, BY[p.rid].sub, vpc.leaf) : p.rid && BY[p.rid] && BY[p.rid].variantPages ? 'base:' + p.rid : p.rid && BY[p.rid] ? rowId(BY[p.rid].sec, BY[p.rid].sub, BY[p.rid].leaf) : p.sid ? 'sec:' + p.sid : null;
    return h(P.NavList, { key: (p.sid || 'home') + '|' + needle, label: 'UI Inventory sections', value: cur, groups: groups });
  }

  /* ── the app: the shell, the header, the pane, the footer ── */
  // an iOS or Android page opened from a Web visit: the full native data is not loaded yet (native-boot.js)
  var needsNative = function (sid) { return !window.DSNativeFull && !!sid && !!SEC[sid] && platformOf(SEC[sid]) !== 'web'; };
  function readRoute() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean), sid = parts[0], rid = parts[1];
    if (sid === 'foundations' && rid === 'token' && parts[2]) return { sid: sid, rid: null, token: parts[2] };
    var cls = parts[2] === 'cls' ? parts[3] : null, variant = parts[2] === 'v' ? parts[3] : null;
    if (sid && !SEC[sid]) { sid = null; rid = null; }
    if (rid && (!BY[rid] || BY[rid].sec !== sid)) rid = null;
    return { sid: sid || null, rid: rid || null, cls: rid ? cls : null, variant: rid && variant && ((variant === 'all' && BY[rid].lab) || extraLabOf(BY[rid], variant) || variantPageOf(BY[rid], null, variant)) ? variant : null };
  }
  var sysDark = window.matchMedia('(prefers-color-scheme: dark)');
  function App() {
    var route = useState(readRoute()), find = useState(''), theme = useState(''), scroller = useRef(null);
    useEffect(function () { warmSources(); }, []);
    // the item page's sections for the "On this page" pane; the pane's open state and its expanded rows are remembered
    var toc = useState(null);   // the item page's sections, for the "On this page" pane
    useEffect(function () { var f = function () { var next = readRoute(); if (needsNative(next.sid)) { location.reload(); return; } route[1](next); if (scroller.current) scroller.current.scrollTop = 0; }; window.addEventListener('hashchange', f); return function () { window.removeEventListener('hashchange', f); }; }, []);
    useEffect(function () { var set = function () { document.documentElement.setAttribute('data-plx-mode', theme[0] || (sysDark.matches ? 'dark' : 'light')); }; set(); sysDark.addEventListener('change', set); return function () { sysDark.removeEventListener('change', set); }; }, [theme[0]]);
    var rt = route[0];
    var view = useState(function () { return rt.sid && SEC[rt.sid] ? platformOf(SEC[rt.sid]) : savedPlatform(); });
    // a page of another platform's section switches the pane to that platform
    useEffect(function () { if (rt.sid && SEC[rt.sid] && platformOf(SEC[rt.sid]) !== view[0]) view[1](platformOf(SEC[rt.sid])); }, [rt.sid]);
    useEffect(function () { try { localStorage.setItem(PLATFORM_KEY, view[0]); } catch (e) { /* not stored: it lasts for this visit */ } }, [view[0]]);
    var choosePlatform = function (ev) {
      var v = ev.target.value;
      var first = TAX.filter(function (s) { return platformOf(s) === v; })[0];
      // Web to iOS or Android: remember the platform; the hash change reloads the page with the full native data
      if (v !== 'web' && !window.DSNativeFull) { try { localStorage.setItem(PLATFORM_KEY, v); } catch (e) { /* the section in the hash decides */ } }
      else view[1](v);
      location.hash = v === 'web' || !first ? '#/' : '#/' + first.id;
    };
    var platformPicker = h(P.Select, { 'aria-label': 'Platform', className: 'ds-platform-select', value: view[0], onChange: choosePlatform, options: PLATFORMS });
    useEffect(function () { document.title = (rt.token ? '--' + rt.token + ' · ' : rt.rid ? BY[rt.rid].title + ' · ' : rt.sid ? SEC[rt.sid].title + ' · ' : '') + 'Plenix Design System'; }, [rt.sid, rt.rid, rt.token]);
    var page = rt.token ? h(TokenPage, { key: 'tk' + rt.token, name: rt.token, scroller: scroller, onToc: toc[1] }) : rt.rid && rt.variant === 'all' && BY[rt.rid].lab ? h(AllVariantsPage, { key: rt.rid + '/all', r: BY[rt.rid], scroller: scroller, onToc: toc[1] }) : rt.rid && extraLabOf(BY[rt.rid], rt.variant) ? h(AllVariantsPage, { key: rt.rid + '/' + rt.variant, r: BY[rt.rid], extra: extraLabOf(BY[rt.rid], rt.variant), scroller: scroller, onToc: toc[1] }) : rt.rid && rt.variant ? h(VariantPage, { key: rt.rid + '/' + rt.variant, r: BY[rt.rid], vp: variantPageOf(BY[rt.rid], null, rt.variant), scroller: scroller, onToc: toc[1] }) : rt.rid ? h(ItemPage, { key: rt.rid, r: BY[rt.rid], cls: rt.cls, scroller: scroller, onToc: toc[1] }) : rt.sid ? h(SectionPage, { key: rt.sid, sx: SEC[rt.sid], scroller: scroller, onToc: toc[1] }) : h(HomePage, { key: 'home' });
    var themeMenu = h(P.Menu, { label: 'Theme', placement: 'bottom-end', trigger: h(P.AppHeader.Item, { icon: h(P.Icon, { name: 'gear' }), label: 'Theme', tooltip: false }) },
      [['', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(function (x) { return h(P.MenuItem, { key: x[0] || 'sys', checked: theme[0] === x[0], onSelect: function () { theme[1](x[0]); } }, x[1]); }));
    // the Plenix applications, one row each (the switcher's list), under a collapsible "View Plenix Apps" heading
    var appsNav = h(P.NavList, { label: 'Plenix applications', groups: [{ heading: 'View Plenix Apps', icon: 'app-switcher', defaultExpanded: false,
      items: P.PLENIX_APPS.map(function (a) { return { id: 'app:' + a.id, label: a.label, icon: a.icon, href: P.appHref(a, '../../') }; }) }] });
    return h(P.SessionProvider, null, h(P.ThemeProvider, null, h(P.ToastProvider, null,
      h(P.AppShell, {
        header: h(P.AppHeader, { tone: 'accent', appName: 'Design System', brandHref: '#/', actions: themeMenu,
          search: h(P.SearchField, { value: find[0], onChange: function (ev) { find[1](ev.target.value); }, onClear: function () { find[1](''); }, placeholder: 'Find an item or alias…', label: 'Find an item or alias', onAccent: true }) }),
        sideNav: h(P.NavPane, { label: 'UI Inventory', title: platformPicker, footer: h(P.AppHeader.Account, { placement: 'pane', density: true }) }, h(SpecNav, { find: find[0], platform: view[0], sid: rt.sid, rid: rt.token ? 'design-tokens' : rt.rid, variant: rt.variant }), appsNav),
        footer: h(P.StatusBar, { start: h('span', null, REC.length + ' items · ' + (function (n) { return n + (n === 1 ? ' section' : ' sections'); })(TAX.filter(function (s) { return platformOf(s) === view[0]; }).length) + ' on ' + PLATFORMS.filter(function (x) { return x.value === view[0]; })[0].label), end: h('span', null, 'Plenix Platform · read live from the files') }),
        mainId: 'main'
      }, h('div', { className: 'ds-page-row' },
        (rt.rid || rt.sid || rt.token) && toc[0] && toc[0].rows.length ? h(TocPane, { toc: toc[0] }) : null,
        h('div', { ref: scroller, className: 'ds-page-scroll' }, page))))));
  }
  // the examples show a fictional person (DEMO_SESSION): the Platform's own default session is empty (RedSave P-37)
  if (P.setDefaultSession) P.setDefaultSession(P.DEMO_SESSION);
  ReactDOM.createRoot(document.getElementById('dsRoot')).render(h(App));
})();
