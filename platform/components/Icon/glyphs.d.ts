/* Plenix · the Icon glyph tables' type (platform/components/Icon/glyphs.d.ts)
   Summary: What TypeScript reads for glyphs.js, which build-icons.js generates (its header lists the same exports).
     Types only; the values stay in the generated file. */
/** the Plenix set's symbols, space separated */
export declare const SYMBOLS: string;
/** each Plenix icon name (and its underscore alias) -> [its symbol, 1 when the outline is drawn filled, else 0] */
export declare const NAMES: Record<string, [string, number]>;
/** the symbols that point along the reading direction (mirrored right to left), space separated */
export declare const MIRRORED: string;
/** the whole Material library's symbol names, space separated */
export declare const LIBRARY: string;
/** the four name tables together, as the npm package's ES modules load them (library.ts loadNames) */
export type IconNames = { SYMBOLS: string; NAMES: Record<string, [string, number]>; MIRRORED: string; LIBRARY: string };
/** the Material Symbols commit the library is taken from */
export declare const LIBRARY_COMMIT: string;
