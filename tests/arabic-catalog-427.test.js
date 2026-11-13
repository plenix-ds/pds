/* Plenix tests · every built-in English word has its Arabic (issue 427).
   Summary: platform/i18n/en.js and ar.js, key by key: every English key has an Arabic entry (a plural counts when Arabic
     has any of its forms); dialog.close is إغلاق (the owner, 2026-10-29); the unread keys removed in #427 (the common
     section, wizard.finish/step/error, emptyState.title/description/action) stay gone; every l.t('key') or t('section.key')
     in the spec's parts (a lane's copy in place of the pinned one) is in en.js or in that example's own English catalog.
   Proof first: before #427 dialog.close had no Arabic and the common section was in English only, so those lines fail;
     the pinned w15C.records.js reads common.save with a French catalog only, so the spec line fails without lanes/427-catalog.
   Every rule is a named check in the results file (tests/check.js): one per English key ("<key>: has its Arabic"), so CI can
     quarantine the keys that wait for the owner's Arabic (D-0012) and still block on a new key without it (#1327, G5a M1).
   Usage: node tests/arabic-catalog-427.test.js   → ARABIC_CATALOG_427_OK */
const path = require('path'), { pathToFileURL } = require('url');
const shared = require('./check.js');
const bad = [];
const rule = (name, ok, detail) => { shared.record(name, ok, detail); if (!ok) bad.push(name + (detail ? ': ' + detail : '')); };
(async () => {
  const load = async (f) => (await import(pathToFileURL(path.join(__dirname, '..', 'platform', 'i18n', f)).href)).default;
  const en = await load('en.js'), ar = await load('ar.js');
  const flat = (o, pre = '', out = {}) => { for (const [k, v] of Object.entries(o)) { const n = pre ? pre + '.' + k : k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, n, out); else out[n] = v; } return out; };
  const E = flat(en), A = flat(ar);
  const base = (k) => k.replace(/\.(zero|one|two|few|many|other|=0)$/, '');
  const arBases = new Set(Object.keys(A).map(base));
  for (const k of Object.keys(E)) rule(k + ': has its Arabic', k in A || arBases.has(base(k)), 'no Arabic entry in ar.js');
  rule('dialog.close: is إغلاق', (ar.dialog || {}).close === 'إغلاق', (ar.dialog || {}).close);
  rule('common: the unread section is gone', en.common === undefined, 'en.js still has common');
  for (const k of ['wizard.finish', 'wizard.step', 'wizard.error', 'emptyState.title', 'emptyState.description', 'emptyState.action']) rule(k + ': is gone', !(k in E), 'still in en.js');
  // every catalog word a spec example reads is in en.js or in that example's own English catalog (QA on #629: the spec's
  // "Localized content" example read common.save after it was removed). The parts read are the spec's
  // (platform/design-system/parts/*.js) with each lane's copy (lanes/*/design-system/parts/*.js) in place of the pinned one.
  const fs = require('fs'), root = path.join(__dirname, '..');
  const PARTS = path.join(root, 'platform', 'design-system', 'parts'), LANES = path.join(root, 'lanes');
  const laneParts = fs.existsSync(LANES) ? fs.readdirSync(LANES).map((l) => path.join(LANES, l, 'design-system', 'parts')).filter((d) => fs.existsSync(d))
    .flatMap((d) => fs.readdirSync(d).filter((f) => f.endsWith('.js')).map((f) => path.join(d, f))) : [];
  const laneNames = new Set(laneParts.map((f) => path.basename(f)));
  const pinned = fs.existsSync(PARTS) ? fs.readdirSync(PARTS).filter((f) => f.endsWith('.js') && !laneNames.has(f)).map((f) => path.join(PARTS, f)) : [];
  const get = (o, k) => k.split('.').reduce((v, s) => (v && typeof v === 'object' ? v[s] : undefined), o);
  const unknown = [];
  for (const file of pinned.concat(laneParts)) {
    const src = fs.readFileSync(file, 'utf8');
    // a translator call: l.t('key') with any key, or t('section.key') (a bare t('name') is a local toggle, as in w00B)
    const keys = [...src.matchAll(/\bl\.t\('([A-Za-z0-9_.]+)'|(?<![.\w])t\('([A-Za-z0-9_]+\.[A-Za-z0-9_.]+)'/g)].map((m) => m[1] || m[2]);
    if (!keys.length) continue;
    // the example's own catalogs: one-line `var NAME = { … };` objects passed as `en: NAME` in a catalogs prop
    const defs = {};
    for (const m of src.matchAll(/^\s*var\s+([A-Z][A-Z0-9_]*)\s*=\s*(\{.*\});\s*$/gm)) { try { defs[m[1]] = Function('return (' + m[2] + ')')(); } catch (e) { /* not a plain object */ } }
    const english = [...src.matchAll(/catalogs:\s*\{[^}]*?\ben:\s*([A-Z][A-Z0-9_]*)/g)].map((m) => defs[m[1]]).filter(Boolean);
    for (const k of keys) if (get(en, k) === undefined && !english.some((c) => get(c, k) !== undefined)) unknown.push(path.relative(root, file) + ': ' + k);
  }
  rule('Spec examples: every word a spec example reads has English', !unknown.length, unknown.join(', '));
  shared.ended();   // every failure above is a recorded check (G5a I1)
  if (bad.length) { console.log('ARABIC_CATALOG_427_FAIL ' + bad.length + ': ' + bad.join(' · ')); process.exit(1); }
  console.log('ARABIC_CATALOG_427_OK');
})().catch((e) => { console.error(e); process.exit(1); });
