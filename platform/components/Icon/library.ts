/* Plenix · Icon name tables
   Summary: The icon name tables Icon resolves names with (issues 702 and 882): the Plenix set's names, symbols and mirrored
     symbols, and the whole Material library's symbol names. Built in here: the browser global (plenix.js), the CDN's
     plenix.esm.js, the CommonJS build and the suite's pages read them from glyphs.js when Icon loads. The npm package's ES
     modules swap this file at build time (build-packages.js) for one whose tables are empty and whose loadNames() loads
     them the first time an Icon meets a name, so an app that imports one part carries none of them (about 65 KB) and an
     app that draws only imported icon modules never loads them.
   Usage: import { SYMBOLS, NAMES, MIRRORED, LIBRARY, loadNames } from './library.ts'   (Icon.tsx only)
   Props:
     SYMBOLS, NAMES, MIRRORED, LIBRARY: the tables (glyphs.js); in the npm package's ES modules empty ('' and null)
     loadNames: null when the tables are built in; in the npm package, a function that returns a Promise of all four */
import type { IconNames } from './glyphs.js';
export { SYMBOLS, NAMES, MIRRORED, LIBRARY } from './glyphs.js';
export const loadNames: (() => Promise<IconNames>) | null = null;
