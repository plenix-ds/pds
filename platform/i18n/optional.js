// Plenix's built-in words in a language an app turns on (issue 702). LocaleProvider reads a language's built-in words
// from i18n/<code>.js. The browser global (plenix.js), the CDN's plenix.esm.js, the CommonJS build and the suite's pages
// import them, so Arabic is always there. The npm package's ES modules swap that import at build time (build-packages.js)
// for languageSlot(code): an empty catalog that the language's opt-in module fills when the app imports it
// (import '@plenix-ds/react/i18n/ar'). Without it, an Arabic page shows Plenix's own words in English (the app's own
// catalog still applies).
const slots = {};
// the one catalog object LocaleProvider holds for a language, filled in place by addLanguage
export function languageSlot(code) { return slots[code] || (slots[code] = {}); }
// turn a language on: its built-in words, before the first render (a translator made earlier keeps what it had)
// The page hears it ('plenix:language', issue 882): a LocaleProvider already showing that language draws again with its words
// (the CDN's plenix-ar.js can arrive after the first render, when a person switches to Arabic without a reload)
export function addLanguage(code, catalog) {
  Object.assign(languageSlot(code), catalog);
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') window.dispatchEvent(new CustomEvent('plenix:language', { detail: { code } }));
}
