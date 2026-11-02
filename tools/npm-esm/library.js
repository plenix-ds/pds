// The npm package's ES modules only (#702, #882; #709 step 5): Icon's import of library.ts resolves here
// (vite.packages.config.mjs, resolve.alias). The tables are empty; loadNames() loads them (the chunk icon-names, cut from
// glyphs.js by the config's plenix-icon-names plugin) the first time an Icon meets a name.
export const SYMBOLS = '';
export const NAMES = null;
export const MIRRORED = '';
export const LIBRARY = '';
export const loadNames = () => import('./icon-names.js');
