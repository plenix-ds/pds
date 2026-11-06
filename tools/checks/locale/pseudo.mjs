// Pseudo-locales (plan §7 locale checks; #192): the English catalog rewritten so layout and wiring problems show.
//   node tools/checks/locale/pseudo.mjs [en-XA|ar-XB] [out.json]   (default en-XA, printed)
//   en-XA  accented, about 40% longer, each string in ⟦ ⟧: a cut-off string loses its closing bracket, two strings
//          joined into one sentence show two pairs, and English text with no accents was written in code, not the catalog
//   ar-XB  the same, set right to left with an RTL isolate (U+2067 … U+2069), for a page with dir="rtl": text that
//          stays left to right, or punctuation that lands on the wrong side, shows a direction problem
// Placeholders ({name}), ICU-like plural keys and the catalog's shape stay as they are, so the catalog loads through
// Plenix.addLanguage like any language.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ACCENTS = {
  a: 'á', b: 'ƀ', c: 'ç', d: 'ð', e: 'é', f: 'ƒ', g: 'ĝ', h: 'ĥ', i: 'í', j: 'ĵ', k: 'ķ', l: 'ļ', m: 'ɱ', n: 'ñ', o: 'ó',
  p: 'þ', q: 'ǫ', r: 'ŕ', s: 'š', t: 'ţ', u: 'ú', v: 'ṽ', w: 'ŵ', x: 'ẋ', y: 'ý', z: 'ž',
  A: 'Á', B: 'Ɓ', C: 'Ç', D: 'Ð', E: 'É', F: 'Ƒ', G: 'Ĝ', H: 'Ĥ', I: 'Í', J: 'Ĵ', K: 'Ķ', L: 'Ļ', M: 'Ṁ', N: 'Ñ', O: 'Ó',
  P: 'Þ', Q: 'Ǫ', R: 'Ŕ', S: 'Š', T: 'Ţ', U: 'Ú', V: 'Ṽ', W: 'Ŵ', X: 'Ẋ', Y: 'Ý', Z: 'Ž',
};
const PAD = ' ·~·~·~·~·~·~·~·~·~·~';

export function pseudoString(s, { rtl = false } = {}) {
  if (typeof s !== 'string' || !s) return s;
  // keep {placeholders} as they are; accent the rest
  const body = s.split(/(\{[^}]*\})/).map((part) => (part.startsWith('{') ? part : part.replace(/[A-Za-z]/g, (c) => ACCENTS[c] || c))).join('');
  const letters = s.replace(/\{[^}]*\}/g, '').length;
  const pad = PAD.slice(0, Math.max(1, Math.ceil(letters * 0.4)));
  const out = `⟦${body}${pad}⟧`;
  return rtl ? `⁧${out}⁩` : out;
}

export function pseudoCatalog(catalog, opts) {
  if (typeof catalog === 'string') return pseudoString(catalog, opts);
  if (!catalog || typeof catalog !== 'object' || Array.isArray(catalog)) return catalog;
  return Object.fromEntries(Object.entries(catalog).map(([k, v]) => [k, pseudoCatalog(v, opts)]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const [code = 'en-XA', out] = process.argv.slice(2);
  if (!['en-XA', 'ar-XB'].includes(code)) { console.error('usage: pseudo.mjs [en-XA|ar-XB] [out.json]'); process.exit(2); }
  const en = JSON.parse(fs.readFileSync(path.join(root, 'platform/i18n/en.json'), 'utf8'));
  const text = JSON.stringify(pseudoCatalog(en, { rtl: code === 'ar-XB' }), null, 1) + '\n';
  if (out) fs.writeFileSync(out, text); else process.stdout.write(text);
}
