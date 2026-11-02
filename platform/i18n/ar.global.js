// plenix-ar.js (issue 882): Plenix's built-in Arabic words for a page that loads plenix.js from the CDN. The CDN's plenix.js
// leaves them out (they are about 200 KB, and most pages are not Arabic); an Arabic page loads this file after plenix.js and
// before its own script (the page loader does it on a page whose <html lang> is Arabic, or whose loader tag lists ar in
// data-plenix-languages). It fills LocaleProvider's Arabic catalog through Plenix.addLanguage. This checkout's own
// platform/dist/platform.js keeps Arabic built in, so a page opened from file:// or a local server needs nothing.
// Built by build-packages.js (vite.packages.config.mjs, build "ar") into release/cdn/<version>/plenix-ar.js.
import arabic from './ar.js';

if (!window.Plenix || typeof window.Plenix.addLanguage !== 'function') throw new Error('Plenix: plenix.js is not loaded before plenix-ar.js');
window.Plenix.addLanguage('ar', arabic);
