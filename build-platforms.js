// Plenix · build-platforms.js (batch 297): the Plenix Platforms Standard (platform/standards/platforms.md, the source of
// truth; owner: "the design system is corrected to match this standard") becomes the design system's data,
// platform/design-system/platforms-standard.js (window.DSStandard; GENERATED: never edit it by hand). The Markdown is read
// as it is written: "## n. Title" sections, "### n.m Title" subsections, paragraphs, "- " lists and pipe tables; inline
// Markdown (code, bold, links) stays in the strings and the spec renders it. Run by build-app.js; alone: node build-platforms.js
const fs = require('fs');
const path = require('path');
const { css } = require('./tools/token-value.js');   // a $value as text: the W3C typed values too (#872)

function parse(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const doc = { title: '', lead: [], sections: [] };
  let sec = null, sub = null, para = [], list = null, table = null;
  const target = () => (sub || sec || { blocks: doc.lead });
  const blocks = () => { const t = target(); if (!t.blocks) t.blocks = []; return t.blocks; };
  const flush = () => {
    if (para.length) { blocks().push({ type: 'p', text: para.join(' ') }); para = []; }
    if (list) { blocks().push({ type: 'list', items: list }); list = null; }
    if (table) { blocks().push(table); table = null; }
  };
  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  for (const raw of lines) {
    const l = raw.trimEnd();
    let m;
    if ((m = /^# (.+)$/.exec(l))) { flush(); doc.title = m[1]; continue; }
    if ((m = /^## (?:(\d+)\.\s+)?(.+)$/.exec(l))) { flush(); sub = null; sec = { n: m[1] || '', title: m[2], blocks: [], subs: [] }; doc.sections.push(sec); continue; }
    if ((m = /^### (?:(\d+\.\d+)\s+)?(.+)$/.exec(l))) { flush(); sub = { n: m[1] || '', title: m[2], blocks: [] }; (sec || doc).subs ? sec.subs.push(sub) : null; continue; }
    if (/^---+$/.test(l.trim())) { flush(); continue; }
    if (/^\s*\|/.test(l)) {
      if (para.length || list) { const t = table; table = null; flush(); table = t; }
      const c = cells(l);
      if (!table) { table = { type: 'table', heads: c, rows: [] }; continue; }
      if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue;
      table.rows.push(c); continue;
    }
    if (table) { blocks().push(table); table = null; }
    if ((m = /^\s*[-*] (.+)$/.exec(l))) { if (para.length) { blocks().push({ type: 'p', text: para.join(' ') }); para = []; } list = list || []; list.push(m[1]); continue; }
    if (list && /^\s{2,}\S/.test(l)) { list[list.length - 1] += ' ' + l.trim(); continue; }
    if (!l.trim()) { flush(); continue; }
    if (list) { blocks().push({ type: 'list', items: list }); list = null; }
    para.push(l.trim());
  }
  flush();
  return doc;
}

// the same reading, for a standard that also writes nested lists ("  - " under an item), numbered lists ("1. "), quoted
// rules ("> ") and code (``` fences): lists are { type: 'list', ordered, items: [{ text, items }] }, code is
// { type: 'code', lang, text }, a quote is { type: 'p', quote: true }. A line indented under an item, after an empty line,
// still belongs to that item (its after text, when it follows the item's nested list).
function parseRich(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const doc = { title: '', lead: [], sections: [] };
  let sec = null, sub = null, para = [], quote = false, list = null, last = null, top = null, table = null, code = null, blank = false;
  const target = () => (sub || sec || { blocks: doc.lead });
  const blocks = () => { const t = target(); if (!t.blocks) t.blocks = []; return t.blocks; };
  const flushPara = () => { if (para.length) { blocks().push(Object.assign({ type: 'p', text: para.join(' ') }, quote ? { quote: true } : {})); para = []; quote = false; } };
  const flushList = () => { if (list) { blocks().push(list); list = null; last = null; } };
  const flush = () => { flushPara(); flushList(); if (table) { blocks().push(table); table = null; } };
  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  for (const raw of lines) {
    const l = raw.trimEnd();
    let m;
    if (code) {
      if (/^\s*```\s*$/.test(l)) { blocks().push({ type: 'code', lang: code.lang, text: code.lines.join('\n') }); code = null; continue; }
      code.lines.push(l.slice(Math.min(code.indent, l.length - l.trimStart().length))); continue;
    }
    if ((m = /^(\s*)```(\w*)\s*$/.exec(l))) { flush(); code = { lang: m[2], indent: m[1].length, lines: [] }; blank = false; continue; }
    if ((m = /^# (.+)$/.exec(l))) { flush(); doc.title = m[1]; continue; }
    if ((m = /^## (?:(\d+)\.\s+)?(.+)$/.exec(l))) { flush(); sub = null; sec = { n: m[1] || '', title: m[2], blocks: [], subs: [] }; doc.sections.push(sec); continue; }
    if ((m = /^### (?:(\d+\.\d+)\s+)?(.+)$/.exec(l))) { flush(); sub = { n: m[1] || '', title: m[2], blocks: [] }; if (sec) sec.subs.push(sub); continue; }
    if (/^---+$/.test(l.trim())) { flush(); continue; }
    if (!l.trim()) { flushPara(); blank = true; continue; }
    const indent = l.length - l.trimStart().length;
    if (/^\s*\|/.test(l)) {
      if (!table) { flush(); table = { type: 'table', heads: cells(l), rows: [] }; continue; }
      const c = cells(l);
      if (c.every((x) => /^:?-{2,}:?$/.test(x))) continue;
      table.rows.push(c); continue;
    }
    if (table) { blocks().push(table); table = null; }
    if ((m = /^(\s*)(?:[-*]|(\d+)\.) (.+)$/.exec(l))) {
      flushPara();
      const ordered = !!m[2];
      if (list && indent >= 2 && list.items.length) {   // a nested item
        const parent = list.items[list.items.length - 1]; parent.items = parent.items || [];
        last = { text: m[3] }; parent.items.push(last);
      } else {
        if (list && list.ordered !== ordered) flushList();
        if (!list) list = { type: 'list', ordered, items: [] };
        last = { text: m[3] }; list.items.push(last); top = last;
      }
      blank = false; continue;
    }
    if (list && indent >= 2 && last) {   // text under the item; after its nested list and an empty line, it follows that list
      if (blank && top.items) { top.after = (top.after ? top.after + ' ' : '') + l.trim(); last = { set text(v) { top.after = v; }, get text() { return top.after; } }; }
      else { if (blank) last = top; last.text += ' ' + l.trim(); }
      blank = false; continue;
    }
    if (list) flushList();
    blank = false;
    if ((m = /^> ?(.*)$/.exec(l))) { if (!quote) flushPara(); quote = true; para.push(m[1]); continue; }
    if (quote) flushPara();
    para.push(l.trim());
  }
  flush();
  return doc;
}

// the token mapping (7.1: one set of names, values per platform): every value of the iOS and Android sets with the web
// token it maps to (or none: platform only) and its source, one row per name, for the iOS and Android pages
function tokenMap(root) {
  const T = path.join(root, 'platform', 'tokens');
  const rows = new Map();
  const walk = (obj, pre, plat) => { for (const k of Object.keys(obj)) {
    if (k.charAt(0) === '$') continue;
    const v = obj[k], seg = /^plx-/.test(k) ? '' : k, name = !seg ? pre : pre ? pre + '.' + seg : seg;
    if (v && v.$value !== undefined) {
      const p = (v.$extensions && v.$extensions.plenix) || {}, s = p.source || {};
      const web = p.web && typeof p.web === 'object' ? '.' + p.web.class + (p.web.token ? ' (' + p.web.token + ')' : '') : p.web || '';
      const row = rows.get(name) || { name, web: '', ios: '', android: '', iosSource: '', androidSource: '' };
      if (web) row.web = web;
      row[plat] = css(v.$value);
      row[plat + 'Source'] = s.name ? s.framework + ': ' + s.name + (s.plenix !== undefined ? ' (published ' + s.published + ', Plenix ' + s.plenix + ')' : '') : '';
      rows.set(name, row);
    } else if (v && typeof v === 'object') walk(v, name, plat);
  } };
  walk(JSON.parse(fs.readFileSync(path.join(T, 'platform-ios.tokens.json'), 'utf8'))['plx-platform-ios'], '', 'ios');
  walk(JSON.parse(fs.readFileSync(path.join(T, 'platform-android.tokens.json'), 'utf8'))['plx-platform-android'], '', 'android');
  return [...rows.values()];
}

module.exports = function buildPlatforms(root) {
  const src = path.join(root, 'platform', 'standards', 'platforms.md');
  const out = path.join(root, 'platform', 'design-system', 'platforms-standard.js');
  // without the design system checked out (CI: a private submodule) there is nothing to write into
  if (!fs.existsSync(path.dirname(out))) return { changed: false, sections: 0, tables: 0 };
  const doc = parse(fs.readFileSync(src, 'utf8'));
  doc.tokenMap = tokenMap(root);
  const text ='/* Plenix · the Platforms Standard as data (window.DSStandard). GENERATED by build-platforms.js from\n'
    + '   platform/standards/platforms.md: edit the standard, never this file. */\n'
    + 'window.DSStandard = ' + JSON.stringify(doc) + ';\n';
  let changed = !fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== text;
  if (changed) fs.writeFileSync(out, text);
  // the Plenix Styling Standard (platform/standards/styling.md) -> styling-standard.js (window.DSStyling), drawn on
  // 14 › Engineering guidance › CSS architecture
  const sSrc = path.join(root, 'platform', 'standards', 'styling.md'), sOut = path.join(root, 'platform', 'design-system', 'styling-standard.js');
  if (fs.existsSync(sSrc)) {
    const sText = '/* Plenix · the Styling Standard as data (window.DSStyling). GENERATED by build-platforms.js from\n'
      + '   platform/standards/styling.md: edit the standard, never this file. */\n'
      + 'window.DSStyling = ' + JSON.stringify(parseRich(fs.readFileSync(sSrc, 'utf8'))) + ';\n';
    if (!fs.existsSync(sOut) || fs.readFileSync(sOut, 'utf8') !== sText) { fs.writeFileSync(sOut, sText); changed = true; }
  }
  return { changed, sections: doc.sections.length, tables: JSON.stringify(doc).split('"type":"table"').length - 1 };
};

if (require.main === module) { const r = module.exports(__dirname); console.log('Wrote platform/design-system/platforms-standard.js (' + r.sections + ' sections, ' + r.tables + ' tables' + (r.changed ? '' : ', unchanged') + ')'); }
