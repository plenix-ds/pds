// The npm package's Arabic opt-in (issue 702): import '@plenix-ds/react/i18n/ar' once, at the app's start, and Plenix's own
// words show in Arabic on an Arabic page, exactly as on the CDN. Built as dist/i18n/ar.js (build-packages.js); the browser
// global and the CDN files have Arabic built in and need nothing.
import arabic from './ar.js';
import { addLanguage } from './optional.ts';

addLanguage('ar', arabic);
