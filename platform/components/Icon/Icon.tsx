/* Plenix · Icon, StatusIcon
   Summary: One icon of the Plenix set, or any Material Symbols icon, drawn as an inline SVG in the current text color.
     StatusIcon is a tone's icon in the
     tone's color (info, success, warning, danger, neutral), alone or with a short label.
   Usage:
     <Icon name="folder" />
     <Icon name="bookmark" size="sm" filled label="Bookmarked" />
     import Add from 'plenix-platform/icons/plenix/add';  <Icon icon={Add} />      // an imported icon module (#282)
     registerIcons(Add, Close);  <Icon name="add" />                               // a name drawn from its module first
     el.innerHTML = '<button>' + iconMarkup(Add) + 'Add</button>';                 // the same markup as a string (issue 557)
     <StatusIcon tone="warning" />
     <StatusIcon tone="success" size="sm">Synced</StatusIcon>
   Props:
     name: the naming contract (2026-10-22): a Plenix name, with dashes (platform/icons/map.json: mic-off, person-cancel);
       a Plenix name that is its Material symbol with dashes also answers to the underscore spelling (mic_off,
       person_cancel); any other Material Symbols name (rocket_launch) too, from its module or its library file. A
       Material name that is also a Plenix name draws the Plenix icon (check, home). Unknown names draw nothing
     size: "xs" 12px | "sm" 16px | "md" 20px | "lg" 24px | "xl" 48px, a page title (--plx-sys-icon-size-*); without it the icon takes its container's
       grid icon (a control's --plx-sys-control-icon-<role>) or --plx-sys-icon-size
     icon: an imported icon module (platform/icons/layout.js: icons/<set>/<name>.js; in an application,
       import X from 'plenix-platform/icons/<set>/<name>'): drawn from its own drawings instead of icon.css, with the same
       classes, so sizes, fills, the optical size and right-to-left mirroring work exactly as for name (issue 282)
     filled: true draws the filled version (default false)
     label: the accessible name, when the icon alone carries meaning
     className: more classes on the icon
     StatusIcon.tone: "info" (default) | "success" | "warning" | "danger" | "neutral"; each has its own icon (neutral shares
       the info icon, in the neutral color)
     StatusIcon.size: "sm" (16px) | "md" (default; 20px) | "lg" (24px)
     StatusIcon.label: the accessible name of the icon alone (default: the tone's word from strings)
     StatusIcon.children: a short visible label after the icon; the icon is then decorative and the text says the state
     StatusIcon.strings: the tone words, for other languages: { info: "Information", success: "Success", warning: "Warning",
       danger: "Error", neutral: "Note" }
     StatusIcon.className: more classes on the status icon
     library: where a name is looked up (issue 281): "plenix" (default: registered modules, the Plenix set, then the
       Material library, as before), "material" (Material's own symbol even where a Plenix name exists), or a project's own
       library registered with registerIcons(..., { library }) (only its modules). setDefaultIconLibrary(name) sets the page's
       default: call it at startup, before icons draw (icons already on the page do not draw again)
     registerIcons(...modules[, { library }]): modules drawn first by their name and their symbol's spelling, in their
       set's library or the one named
     iconMarkup(icon[, { size, filled, label, className, library }]): the markup Icon renders, as an HTML string, from an
       imported module or a name with a registered module (no module: the span without a drawing, and a development
       warning); for code that writes HTML instead of the deprecated bare class plx-icon--<name>
     Every loaded icon file and every module drawing is untrusted (issue 285): it is read through the allow-list in
       utils/iconSafety.ts (one svg, one path, values by grammar, bounded size), and anything else refuses it; development
       warns once with the reason. Nothing is ever inserted as HTML: the values become React props.
     A name drawn by a run-time fetch (a Material name not imported or registered) warns once in development: production
       should import or register it. An icon value that is not a module warns once per kind of value and draws nothing
   Behavior:
     The component that owns a current or selected state passes filled (NavList's current item and pinned pin, a
       selected or pressed Button); filled={false} keeps the outline (Tree owns each item state).
     Omitting filled: until every owner passes it, the filled version is still drawn inside a current or selected
       element (aria-current, aria-pressed, aria-selected, .is-selected, .is-current): the rollout backlog.
     The optical size follows the context: 24 in a Comfortable region and in a 24px container (the app header, a
       pictogram), and for sizes lg and xl; 20 everywhere else.
     A pinned item shows the filled pin, not a filled row.
     Without a label the icon is decorative and hidden from assistive technology; with one it is an image (role="img").
     StatusIcon alone is an image named by its tone (role="img", "Warning"), so the state never rests on color only; with a
       visible label the label carries the state and the icon is hidden from assistive technology.
   Notes:
     The set is Material Symbols Sharp, weight 300, used exactly as published (platform/icons/).
     The size names the icon's whole square, which includes the set's own padding (1/12 of the square on each side): the
       system adds none to make up for it.
     Other props pass through to the <span>. The drawings come from icon modules (issue 557): imported (the icon prop), or
     registered by name (registerIcons; a page's icon file, plenix-icons-<site>.js, or plenix-icons-plenix.js for every
     Plenix icon); a Plenix name with no module loads its files once from the asset layout beside the bundle (dist/icons/plenix/,
     or the CDN's /cdn/<version>/icons/plenix/), and development warns that production should register it. Never from the
     stylesheet. The outline or the filled version, at optical sizes 20 and 24, the stylesheet showing the one the context
     draws; inline paths paint about 200 times faster than masks (owner, 2026-10-23). Every icon that points along the reading
     direction is marked plx-icon--mirrored and mirrors in right to left.
     A bare class name (plx-icon plx-icon--<name>, no component) is deprecated (owner, issue 277 Q3): it still draws the mask from
       the stylesheet in this release, and development warns (dev/style-audit.js); iconMarkup(icon) writes the component's
       markup where a page builds HTML.
     The name tables (library.ts: the Plenix names, symbols and mirrored symbols, and the Material library's names) are
       built into the browser global, the CDN's plenix.esm.js and the suite. The npm package's ES modules load them the
       first time a name is not a registered module (issues 702 and 882): until they arrive that icon draws nothing, then
       it draws; an unknown name warns after they arrive. An imported or registered module never waits, so an app that
       draws only modules never loads them. iconMarkup of a name with a registered module writes its drawing at once.
     StatusIcon's colors and sizes are its own tokens (--plx-comp-status-icon-*, components/Icon/status-icon.css); the label
       keeps the text color and size of where it sits.
*/
import React from 'react';
import { devWarn, development } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { LIBRARY_COMMIT } from './glyphs.js';
import type { IconNames } from './glyphs.js';
import { SYMBOLS, NAMES, MIRRORED, LIBRARY, loadNames } from './library.ts';
import { checkIconSvg, checkDrawing, ICON_LIMITS } from '../../utils/iconSafety.ts';
import type { IconDrawing } from '../../utils/iconSafety.ts';
import AlertIcon from 'plenix-platform/icons/plenix/alert';
import CircleCheckIcon from 'plenix-platform/icons/plenix/circle-check';
import CircleInfoIcon from 'plenix-platform/icons/plenix/circle-info';
import WarningIcon from 'plenix-platform/icons/plenix/warning';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';

// One way to draw an icon (owner, 2026-10-23: "no band-aid"): every name goes through resolveIcon, and every icon is an
// inline SVG in the text color (inline paths paint about 200 times faster than masks).
//   1. A registered or imported module: drawn at once from its own drawings.
//   2. A Plenix name (map.json, dashes; its underscore alias too) with no module: its files are loaded once from the
//      Plenix asset layout (platform/dist/icons/plenix beside the bundle, or the CDN's /cdn/<version>/icons/plenix/), and
//      development warns that production should import or register it (#557); the box stays empty while it loads.
//   3. Any other Material Symbols name, in dashes or underscores, any case (rocket_launch, Rocket-Launch): its files are
//      loaded once from the library (platform/icons/library beside the bundle, or the CDN's /cdn/material/<commit>/)
//      and drawn the same way.
//   4. An unknown name draws nothing (never a filled square) and warns once, with the closest names.
//   A fetched icon asks for the one file it will show (the 20px drawing, or the 24px one in a comfortable density, with data-plx-icon-optical="24", and for lg and xl),
//   at most 6 files at a time (#642); a density change on the page reads the optical size again and asks for the other file.
//   A file that fails to load (the network, a 5xx) is asked for once more after a short pause; a 404 is answered once; after two
//   failures the icon draws nothing for the session (#283).
// an imported or registered icon module (#282; platform/icons/modules.d.ts describes the imported ones)
export type IconModule = { name: string; set?: string; symbol?: string; fillOutline?: boolean; mirrored?: boolean; drawings: Record<20 | 24, { outline: IconDrawing; fill: IconDrawing }> };
// what an icon slot takes: a name or a module
export type IconValue = string | IconModule;
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
// where a name's drawing comes from (resolveIcon)
export type IconFound = { kind: 'module' | 'plenix' | 'library'; symbol: string; fillOutline: boolean; file?: string; module?: IconModule };
// a drawing as parseSvg and moduleGlyph give it: [path, viewBox, extra attributes]
type Glyph = [string, string, Partial<Pick<IconDrawing, 'transform' | 'fillRule' | 'clipRule'>>];
// The outline or the filled version, at optical sizes 20 and 24: the stylesheet shows the one the context draws (icon.css).
const LARGE: Record<string, boolean> = { lg: true, xl: true };
const VARIANT = ['', '-fill', '-24', '-24-fill'];   // outline 20, filled 20, outline 24, filled 24
// The name tables (library.ts): the Plenix names, symbols and mirrored symbols, and the whole Material library's names.
// Built in, or in the npm package's ES modules loaded the first time an Icon meets a name (issues 702 and 882): until they
// arrive a name resolves to nothing, draws nothing and does not warn, and Icon redraws when they arrive (useDrawings).
// An imported or registered module never waits for them.
let names: Record<string, [string, number]> = {}, plenix = new Set<string>(), mirroredSymbols = new Set<string>(), library = new Set<string>();
// a Plenix symbol -> its Plenix name (the dashed spelling: the asset layout's file names; an alias has no file of its own)
const nameOfSymbol = new Map<string, string>();
function takeNames(t: Partial<IconNames> | null | undefined): void {
  names = (t && t.NAMES) || {};
  plenix = new Set(String((t && t.SYMBOLS) || '').split(' ').filter(Boolean));
  mirroredSymbols = new Set(String((t && t.MIRRORED) || '').split(' ').filter(Boolean));
  library = new Set(String((t && t.LIBRARY) || '').split(' ').filter(Boolean));
  nameOfSymbol.clear();
  for (const n of Object.keys(names)) if (!n.includes('_') && !nameOfSymbol.has(names[n][0])) nameOfSymbol.set(names[n][0], n);
}
let libraryLoad: Promise<void> | null = null, libraryDone = !!NAMES || !loadNames;
if (NAMES) takeNames({ SYMBOLS, NAMES, MIRRORED, LIBRARY });
function libraryWaits(): Promise<void> | null {
  if (libraryDone) return null;
  if (!libraryLoad) libraryLoad = Promise.resolve().then(loadNames as () => Promise<IconNames>).then(takeNames, () => {})
    .then(() => { libraryDone = true; });
  return libraryLoad;
}
// a name in the library: asking starts the load when the tables are not here yet (resolveIcon answers null until then)
const inLibrary = (symbol: string) => { libraryWaits(); return library.has(symbol); };
// imported icon modules (#282): { name, set, symbol, fillOutline, mirrored, drawings: { 20: { outline, fill }, 24: … } }.
// The registry (#281): per library, a name (and its symbol's spelling) -> its module. registerIcons(...modules) puts each
// module in its own set's library ("plenix", "material"); registerIcons(...modules, { library: 'acme' }) makes a
// project's own library, which <Icon library="acme"> draws from only
const libraries = new Map<string, Map<string, IconModule>>();   // library -> Map(name -> module)
// a module is untrusted (#285): its four drawings pass the same allow-list as a file, once per module object
const checked = new WeakMap<object, string | null>();
function moduleProblem(m: unknown): string | null {
  if (!(m && typeof m === 'object' && (m as IconModule).drawings && (m as IconModule).drawings[20] && (m as IconModule).drawings[24] && (m as IconModule).name)) return 'not an icon module';
  if (checked.has(m)) return checked.get(m) as string | null;
  let problem: string | null = null;
  // the problem is a message to developers (the console), not a word for people
  for (const size of [20, 24] as const) for (const k of ['outline', 'fill'] as const) { const r = checkDrawing((m as IconModule).drawings[size][k]); if (!r.ok && !problem) problem = ['its', size, k, 'drawing:', r.reason].join(' '); }
  checked.set(m, problem);
  return problem;
}
const isModule = (m: unknown): m is IconModule => !moduleProblem(m);
// for the components that take an icon (#280, stage 5a): an imported module counts as an icon as a name does
export const isIconModule = isModule;
// an icon slot's value as an element: a name or an imported module becomes an Icon (props: more Icon props); an element,
// null or anything else passes through
export function asIcon(i: unknown, props?: Partial<IconProps>): React.ReactNode {
  if (typeof i === 'string') return <Icon name={i} {...props} />;
  if (isModule(i)) return <Icon icon={i} {...props} />;
  return i as React.ReactNode;
}
// an icon slot's value as a key (a name, or a module's name): for the tables keyed by icon name (an open folder's icon)
export const iconKey = (i: unknown): string | null => (typeof i === 'string' ? i : isModule(i) ? i.name : null);
export function registerIcons(...args: Array<IconModule | IconModule[] | { library: string }>): void {
  const last = args[args.length - 1], options = last && typeof last === 'object' && !Array.isArray(last) && !isModule(last) && 'library' in last ? args.pop() : null;
  for (const m of args.flat() as IconModule[]) {
    const problem = moduleProblem(m);
    if (problem) { if (typeof console !== 'undefined') console.warn('[Plenix] registerIcons: refused (' + problem + ')', m); continue; }
    const lib = (options && (options as { library: string }).library) || m.set || 'plenix';
    if (!libraries.has(lib)) libraries.set(lib, new Map());
    const map = libraries.get(lib) as Map<string, IconModule>; map.set(m.name, m); if (m.symbol && m.symbol !== m.name) map.set(m.symbol, m);
  }
}
// the library an Icon without its own library prop draws from: "plenix" (the Plenix set, then the Material library, as
// before), "material", or a project's own registered library
let defaultLibrary = 'plenix';
// call it at startup, before icons draw: an icon already on the page does not draw again when it changes
export function setDefaultIconLibrary(name?: string | null): void { defaultLibrary = name ? String(name) : 'plenix'; }
// a module's drawing i (VARIANT order: outline 20, filled 20, outline 24, filled 24) as [path, viewBox, extra], the shape
// parseSvg gives, with the extras in the same order, so the markup is the same as from the stylesheet
const SLOT: Array<[20 | 24, 'outline' | 'fill']> = [[20, 'outline'], [20, 'fill'], [24, 'outline'], [24, 'fill']];
function moduleGlyph(m: IconModule, i: number): Glyph | null {
  const d = m.drawings[SLOT[i][0]] && m.drawings[SLOT[i][0]][SLOT[i][1]];
  if (!d || !d.d || !d.viewBox) return null;
  const extra: Glyph[2] = {}; for (const key of ['transform', 'fillRule', 'clipRule'] as const) if (d[key]) extra[key] = d[key];
  return [d.d, d.viewBox, extra];
}
const normal = (name: unknown): string => String(name == null ? '' : name).trim();
// One resolver (#281): the registered modules of the chosen library first; then, for "plenix", the Plenix set (its files
// in the asset layout) and the Material library; for "material", the Material library only (a Material name draws
// Material's own symbol even where a Plenix name exists); a project's library draws only its registered modules. A name
// that is not registered is fetched at run time (development warns once that production should import or register it).
// Returns { kind: 'module' | 'plenix' | 'library', symbol, fillOutline, file?, module? } or null; file is a Plenix
// name's file in the asset layout.
export function resolveIcon(name: unknown, options?: { library?: string | null } | null): IconFound | null {
  const n = normal(name), lib = (options && options.library) || defaultLibrary;
  const fromRegistry = (l: string): IconFound | null => { const map = libraries.get(l); const m = map && (map.get(n) || map.get(n.toLowerCase().replace(/_/g, '-')) || map.get(n.toLowerCase().replace(/-/g, '_'))); return m ? { kind: 'module', symbol: m.symbol || m.name, fillOutline: !!m.fillOutline, module: m } : null; };
  if (lib === 'material') {
    const reg = fromRegistry('material'); if (reg) return reg;
    const symbol = n.toLowerCase().replace(/-/g, '_');
    if (inLibrary(symbol)) return { kind: 'library', symbol, fillOutline: false };
    // the npm ES modules: until the library's names arrive, wait (null) rather than draw the Plenix symbol of a name both
    // sets have (176 do, account_circle among them); Icon redraws when they arrive (useDrawings)
    if (!libraryDone) return null;
    // Plenix's own drawings (platform/icons/custom) are not in the library: their files are in the Plenix layout
    return plenix.has(symbol) && nameOfSymbol.has(symbol) ? { kind: 'plenix', symbol, fillOutline: false, file: nameOfSymbol.get(symbol) } : null;
  }
  if (lib !== 'plenix') return fromRegistry(lib);
  // a registered Plenix module, then the Plenix set: a registered Material module never replaces a Plenix name (importing
  // material/home must not swap every <Icon name="home"> on the page); it serves only names outside the Plenix set
  const reg = fromRegistry('plenix'); if (reg) return reg;
  // the npm ES modules: until the tables arrive, wait (null) rather than draw a registered Material module for a Plenix name
  if (libraryWaits()) return null;
  const p = resolvePlenix(n); if (p && p.kind === 'plenix') return p;
  return fromRegistry('material') || p;
}
// a Plenix name -> its symbol, its fill flag and its file in the Plenix asset layout (the name, dashed: an alias has no
// file of its own, so mic_off loads mic-off's files)
function resolvePlenix(n: string): IconFound | null {
  if (libraryWaits()) return null;   // the npm ES modules: the tables are on their way
  const named = (key: string): IconFound => ({ kind: 'plenix', symbol: names[key][0], fillOutline: names[key][1] === 1, file: key.includes('_') && names[key.replace(/_/g, '-')] ? key.replace(/_/g, '-') : key });
  if (names[n]) return named(n);
  const dashed = n.toLowerCase().replace(/_/g, '-');
  if (names[dashed]) return named(dashed);
  const symbol = n.toLowerCase().replace(/-/g, '_');
  if (plenix.has(symbol) && nameOfSymbol.has(symbol)) return { kind: 'plenix', symbol, fillOutline: false, file: nameOfSymbol.get(symbol) };
  if (inLibrary(symbol)) return { kind: 'library', symbol, fillOutline: false };
  return null;
}
// where the library's files are: set by the page (setIconLibrary or window.PlenixIconLibrary), else beside the bundle's script or
// stylesheet, else beside the ES module itself (plenix.esm.js under any name, #284)
let libraryBase: string | null = null, plenixBase: string | null | undefined;
export function setIconLibrary(url?: string | null): void { libraryBase = url ? String(url).replace(/\/?$/, '/') : null; files.clear(); }
// the Plenix bundle's own script or stylesheet on the page (its URL), or null
function bundleUrl(): string | null {
  if (typeof document === 'undefined') return null;
  return [...document.querySelectorAll('script[src], link[rel="stylesheet"][href]')].map((el) => (el as HTMLScriptElement).src || (el as HTMLLinkElement).href)
    .find((url) => /\/(plenix(\.esm|\.min)?\.(js|css)|platform\.(js|css))(\?|#|$)/.test(url)) || null;
}
// the URL of this module when it is the ES module build (the build gives it a banner constant: `const __plenixModuleUrl = import.meta.url`): a page
// that imports plenix.esm.js, under any file name, finds its icons beside it with no setting (#284). Other builds have no such constant.
function moduleUrl(): string | null {
  try {
    const url = typeof __plenixModuleUrl === 'string' ? __plenixModuleUrl : null;
    // not the npm package's dist/index.js: it carries no icon folder (an app that installs it registers or imports its icons)
    return url && /^(https?|file|chrome-extension|moz-extension):/.test(url) && !/\/dist\/index\.js(\?|#|$)/.test(url) ? url : null;
  } catch (e) { return null; }
}
function base(): string | null {
  if (libraryBase) return libraryBase;
  // a page (or an extension whose bundler renames the Plenix files) can name it before Plenix draws: window.PlenixIconLibrary
  if (typeof window !== 'undefined' && typeof window.PlenixIconLibrary === 'string' && window.PlenixIconLibrary) return (libraryBase = window.PlenixIconLibrary.replace(/\/?$/, '/'));
  const at = bundleUrl() || moduleUrl();
  if (!at) return null;
  // the CDN: /cdn/<version>/plenix.js -> /cdn/material/<commit>/; this repository: platform/... -> platform/icons/library/
  libraryBase = /\/cdn\/[^/]+\/[^/]+$/.test(new URL(at).pathname) ? new URL('../material/' + LIBRARY_COMMIT + '/', at).href
    : new URL(/\/dist\/[^/]+$/.test(new URL(at).pathname) ? '../icons/library/' : 'icons/library/', at).href;
  return libraryBase;
}
// where the Plenix set's files are (the asset layout, #279): icons/plenix/ beside plenix.js or plenix.css (the CDN's
// /cdn/<version>/, a self-hosted archive) and beside dist/platform.js; platform/dist/icons/plenix/ from platform.css
function plenixFiles(): string | null {
  if (plenixBase !== undefined) return plenixBase;
  const at = bundleUrl() || moduleUrl();
  if (!at) return null;   // not kept: the bundle's tag may not be on the page yet
  plenixBase = new URL(/\/platform\.css(\?|#|$)/.test(at) ? 'dist/icons/plenix/' : 'icons/plenix/', at).href;
  return plenixBase;
}
// an icon file -> [path, viewBox, { transform, fillRule, clipRule }]: its one path, in its viewBox (or its width and height)
// an icon file -> [path, viewBox, { transform, fillRule, clipRule }], through the allow-list (#285: a loaded file is
// untrusted; utils/iconSafety.ts): anything else in the file refuses it, and development warns once with the reason
const refused = new Set<string>();
function parseSvg(svg: string | null | undefined, from?: string): Glyph | null {
  if (!svg) return null;
  const r = checkIconSvg(svg);
  if (!r.ok) {
    const key = (from || 'an icon file') + ': ' + r.reason;
    if (!refused.has(key) && development() && typeof console !== 'undefined') { refused.add(key); console.warn('[Plenix] Icon: refused ' + key); }
    return null;
  }
  const { viewBox, d, ...extra } = r.drawing;
  return [d, viewBox, extra];
}
// a fetched file is read only up to the size limit (issue 285): a Content-Length over it is refused before reading, and a
// body without one is read in chunks and dropped as soon as it passes the limit
function readCapped(response: Response): Promise<string | null> | null {
  const max = ICON_LIMITS.file, length = Number(response.headers && response.headers.get && response.headers.get('content-length'));
  if (length > max) return null;
  if (!response.body || typeof response.body.getReader !== 'function') return response.text().then((t) => (t.length > max ? null : t));
  const reader = response.body.getReader(), parts: Uint8Array[] = [];
  let size = 0;
  const step = (): Promise<string | null> => reader.read().then(({ done, value }) => {
    if (done) return new TextDecoder().decode(parts.length === 1 ? parts[0] : parts.reduce((all, p) => { const out = new Uint8Array(all.length + p.length); out.set(all); out.set(p, all.length); return out; }, new Uint8Array(0)));
    size += value.length;
    if (size > max) { reader.cancel(); return null; }
    parts.push(value);
    return step();
  });
  return step();
}
// key -> [path, viewBox, extra] | null (missing) | a Promise while it loads. Keys: a library file (rocket_launch-24), or
// "plenix:" and a Plenix layout file (plenix:chevron-right-24)
const files = new Map<string, Glyph | null | Promise<Glyph | null>>();
const PLENIX_FILE = 'plenix:';
const RETRY_AFTER_MS = 250;   // the pause before a failed icon file is asked for once more
// at most this many icon files are in flight at once (#642): a page that names hundreds of icons asks in turn, so no burst reaches the server's limit on simultaneous requests
const MAX_FETCHES = 6;
let running = 0;
const waiting: Array<() => void> = [];
const pump = () => { while (running < MAX_FETCHES && waiting.length) { const next = waiting.shift(); running++; (next as () => void)(); } };
const queued = <T,>(job: () => Promise<T>) => new Promise<T>((resolve) => { waiting.push(() => job().then(resolve, resolve).then(() => { running--; pump(); })); pump(); });
function loadFile(key: string): Glyph | null | Promise<Glyph | null> {
  if (files.has(key)) return files.get(key) as Glyph | null | Promise<Glyph | null>;
  const fromPlenix = key.startsWith(PLENIX_FILE), file = fromPlenix ? key.slice(PLENIX_FILE.length) : key, root = fromPlenix ? plenixFiles() : base();
  // a network failure or a server error (5xx) is tried once more after a short pause (#283); a file that is not there (404), too
  // large or not a drawing is answered once. Two failures draw nothing for the session (never a square).
  const attempt = (): Promise<string | null> => fetch(root + file + '.svg').then((r) => (r.ok ? readCapped(r) : r.status >= 500 ? Promise.reject(new Error('icon file ' + r.status)) : null));
  const job = !root || typeof fetch !== 'function' ? Promise.resolve(null)
    : queued(() => attempt().catch(() => new Promise((resolve) => setTimeout(resolve, RETRY_AFTER_MS)).then(attempt))
      .then((text) => parseSvg(text, file + '.svg')).catch(() => null)).then((glyph) => { files.set(key, glyph); return glyph; });
  files.set(key, job);
  return job;
}
const warned = new Set<string>();
function warnUnknown(name: unknown): void {
  const n = normal(name);
  if (!n || warned.has(n)) return;
  warned.add(n);
  const key = n.toLowerCase().replace(/[-_\s]+/g, '');
  const near = [...Object.keys(names), ...library].filter((c) => { const k = c.replace(/[-_]/g, ''); return k.includes(key) || key.includes(k); }).slice(0, 6);
  if (typeof console !== 'undefined') console.warn('[Plenix] Icon: no icon is named "' + n + '"; nothing is drawn.' + (near.length ? ' Closest: ' + near.join(', ') + '.' : ''));
}
// a name drawn by a run-time fetch: development warns once that production should import or register it
const fetchedNotice = new Set<string>();
function noticeFetch(found: IconFound): void {
  const key = found.kind + ':' + (found.file || found.symbol);
  if (fetchedNotice.has(key) || !development() || typeof console === 'undefined') return;
  fetchedNotice.add(key);
  console.warn('[Plenix] Icon: ' + (found.file || found.symbol) + ' was fetched at run time; for production ' + (found.kind === 'plenix'
    ? 'load an icon file after plenix.js (plenix-icons-<site>.js from tools/icons/site-icons.js, or plenix-icons-plenix.js), import it (plenix-platform/icons/plenix/' + found.file + ') or register it (registerIcons).'
    : 'import it (plenix-platform/icons/material/' + found.symbol.replace(/_/g, '-') + ') or register it (registerIcons).'));
}
// which optical size the stylesheet will show for this icon: 24 for lg and xl, else what its context says (a comfortable density or
// data-plx-icon-optical="24" shows the 24 drawing, any other the 20). A fetched icon asks for that one file only (#642); it is read from the
// icon's own computed settings once it is in the page, and read again when a density or optical setting changes on the page.
// Only a fetched icon below lg reads it: a module (imported, registered, a site's icon file) carries both drawings and the stylesheet picks, so it
// has no watcher, reads no style and sets no state. The one page-wide observer exists only while such a fetched icon is mounted.
const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
const watchers = new Set<() => void>();
let observer: MutationObserver | null = null;
function watchOptical(callback: () => void): () => void {
  watchers.add(callback);
  if (!observer && typeof MutationObserver === 'function' && typeof document !== 'undefined') {
    observer = new MutationObserver(() => watchers.forEach((w) => w()));
    observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-plx-density', 'data-plx-icon-optical'] });
  }
  return () => { watchers.delete(callback); if (!watchers.size && observer) { observer.disconnect(); observer = null; } };
}
const opticalOf = (el: Element | null): 20 | 24 => (el && typeof getComputedStyle === 'function' && getComputedStyle(el).getPropertyValue('--plx-comp-icon-glyph-show-24').trim() === 'block' ? 24 : 20);
function useOptical(ref: React.RefObject<HTMLSpanElement | null>, size: string | undefined, fetched: boolean): 20 | 24 | null {
  const watched = fetched && !LARGE[size as string];
  const [optical, setOptical] = React.useState<20 | 24 | null>(null);
  useIsoLayoutEffect(() => {
    if (!watched) return undefined;
    const read = () => setOptical(opticalOf(ref.current));
    read();
    const stop = watchOptical(read);
    // forget the reading when the icon stops watching (a name that becomes a module, or lg): a later watch starts from unknown, never from a stale size
    return () => { stop(); setOptical(null); };
  }, [watched]);
  return LARGE[size as string] ? 24 : watched ? optical : null;
}
// an icon's drawing source, resolved once per render: the imported module, else the name through the resolver
const resolveShown = (name: unknown, mod: IconModule | null, lib: string | undefined): IconFound | null => (mod ? { kind: 'module', symbol: mod.symbol || mod.name, fillOutline: !!mod.fillOutline, module: mod } : resolveIcon(name, { library: lib }));
const isFetched = (found: IconFound | null) => !!found && (found.kind === 'library' || found.kind === 'plenix');
function useDrawings(name: unknown, size: string | undefined, filled: boolean | undefined, found: IconFound | null, optical: 20 | 24 | null): React.ReactElement[] {
  const mod = found && found.kind === 'module' ? (found.module as IconModule) : null;
  const fill = filled === true || (found && found.fillOutline);
  const fetched = isFetched(found);
  // a module has both drawings and the stylesheet picks; a fetched icon loads only the one it will show (none until its optical size is known)
  const wanted: Array<[number, 20 | 24]> = fetched ? (optical === null ? [] : [[fill ? (optical === 24 ? 3 : 1) : (optical === 24 ? 2 : 0), optical]])
    : LARGE[size as string] ? [[fill ? 3 : 2, 24]] : [[fill ? 1 : 0, 20], [fill ? 3 : 2, 24]];
  // a fetched drawing's key: the library's file (symbol), or the Plenix layout's file (the Plenix name)
  const fileOf = (i: number) => ((found as IconFound).kind === 'plenix' ? PLENIX_FILE + (found as IconFound).file : (found as IconFound).symbol) + VARIANT[i];
  const [, redraw] = React.useReducer((x: number) => x + 1, 0);
  const pending = fetched ? wanted.filter(([i]) => !Array.isArray(files.get(fileOf(i))) && files.get(fileOf(i)) !== null) : [];
  React.useEffect(() => {
    if (!found) {
      const waits = libraryWaits();
      if (!waits) { warnUnknown(name); return undefined; }
      let live = true;
      waits.then(() => { if (live) redraw(); });
      return () => { live = false; };
    }
    if (fetched) noticeFetch(found);
    if (!pending.length) return undefined;
    let live = true;
    Promise.all(pending.map(([i]) => loadFile(fileOf(i)))).then(() => { if (live) redraw(); });
    return () => { live = false; };
  }, [found && found.kind, found && (found.file || found.symbol), fill, LARGE[size as string] ? 1 : 0, optical, pending.length, libraryDone]);
  if (!found) return [];
  const glyphs = wanted.map(([i, optical]) => [found.kind === 'module' ? moduleGlyph(mod as IconModule, i) : files.get(fileOf(i)), optical]).filter(([glyph]) => Array.isArray(glyph)) as Array<[Glyph, 20 | 24]>;
  if (!glyphs.length) return [];
  // the drawings share one svg when they share a box (nearly every icon): the stylesheet shows one path; otherwise each
  // drawing is its own svg in its own box
  if (glyphs.every(([glyph]) => glyph[1] === glyphs[0][0][1]))
    return [<svg key="svg" className="plx-icon__svg plx-icon__svg--shared" viewBox={glyphs[0][0][1]} aria-hidden="true" focusable="false">{glyphs.map(([glyph, optical]) => <path key={optical} className={'plx-icon__glyph--' + optical} d={glyph[0]} {...((glyph[2] || null) as React.SVGProps<SVGPathElement> | null)} />)}</svg>];
  return glyphs.map(([glyph, optical]) => <svg key={optical} className={'plx-icon__svg plx-icon__glyph--' + optical} viewBox={glyph[1]} aria-hidden="true" focusable="false"><path d={glyph[0]} {...((glyph[2] || null) as React.SVGProps<SVGPathElement> | null)} /></svg>);
}

const badIcon = new Set<string>();
export type IconProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** an imported icon module */
  icon?: IconModule | null;
  /** an icon name, or a module given as the name */
  name?: IconValue | null;
  library?: string;
  size?: IconSize;
  filled?: boolean;
  label?: string;
};
export function Icon({ icon, name, library: lib, size, filled, label, className, ...rest }: IconProps) {
  if (icon == null && name != null && typeof name === 'object' && isModule(name)) { icon = name; name = undefined; }   // a module given as the name
  devWarn('Icon', { size }, { size: ['xs','sm','md','lg','xl'] });
  // an imported module (icon); else the name through the resolver (registered modules, the Plenix files, the library)
  // once per kind of bad value (its type and keys), so an object written inline, new on every render, warns once
  const badKey = icon != null && !isModule(icon) ? Object.prototype.toString.call(icon) + ':' + (typeof icon === 'object' ? Object.keys(icon).sort().join(',') : String(icon)) : null;
  if (badKey && !badIcon.has(badKey)) { badIcon.add(badKey); if (typeof console !== 'undefined') console.warn('[Plenix] Icon: icon is refused (' + moduleProblem(icon) + '; import it from plenix-platform/icons/<set>/<name>); nothing is drawn.', icon); }
  const shown = isModule(icon) ? icon.name : name;
  const ref = React.useRef<HTMLSpanElement>(null);
  // fetched or not is decided first, so only a fetched icon watches its optical size (#642)
  const found = resolveShown(shown, isModule(icon) ? icon : null, lib);
  const optical = useOptical(ref, size, isFetched(found));
  const svg = useDrawings(shown, size, filled, found, optical);
  return (
    <span ref={ref} className={iconClasses(shown, isModule(icon) ? icon : null, lib, size, filled, className)}
      role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} {...rest}>{svg}</span>
  );
}
// the classes of an Icon's span. Every icon that points along the reading direction is marked plx-icon--mirrored, which
// icon.css mirrors in right to left (#557): a module by its mirrored flag, a name by its symbol (glyphs.js MIRRORED)
function iconClasses(shown: unknown, mod: IconModule | null, lib: string | undefined, size: string | undefined, filled: boolean | undefined, className: string | undefined): string {
  const f = mod ? null : resolveIcon(shown, { library: lib });
  const m = mod || (f && f.kind === 'module' ? f.module : null);
  const mirrored = m ? !!m.mirrored : !!(f && mirroredSymbols.has(f.symbol));
  return cx('plx-icon', 'plx-icon--' + normal(shown), size ? 'plx-icon--size-' + size : null, filled === true && 'plx-icon--filled', filled === false && 'plx-icon--outline', 'plx-icon--inline', mirrored && 'plx-icon--mirrored', className);
}

// iconMarkup(icon, { size, filled, label, className }): the markup <Icon> renders, as a string, for code that writes HTML
// (a server-rendered page, a lab that builds an HTML string) instead of the deprecated bare class (plx-icon--<name>, #557).
// icon: an imported module, or a name with a registered module (an icon file on the page, registerIcons). The drawing
// comes only from the module, through the allow-list (#285: numbers and path grammar only), and every value is escaped;
// a name with no module gives the span without a drawing, and development warns once.
const ESCAPE: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s: unknown) => String(s).replace(/[&<>"']/g, (c) => ESCAPE[c]);
const markupMissing = new Set<string>();
export type IconMarkupOptions = { size?: IconSize; filled?: boolean; label?: string; className?: string; library?: string };
export function iconMarkup(icon: IconValue, options?: IconMarkupOptions | null): string {
  const o: IconMarkupOptions = options || {}, size = LARGE[o.size as string] || ['xs', 'sm', 'md'].includes(o.size as string) ? o.size : undefined;
  const given = isModule(icon) ? icon : null, shown = given ? (icon as IconModule).name : normal(icon);
  const f = given ? null : resolveIcon(shown, { library: o.library });
  const mod = given || (f && f.kind === 'module' ? (f.module as IconModule) : null);
  let svg = '';
  if (mod && !moduleProblem(mod)) {
    const fill = o.filled === true || !!mod.fillOutline;
    const wanted: Array<[number, 20 | 24]> = LARGE[size as string] ? [[fill ? 3 : 2, 24]] : [[fill ? 1 : 0, 20], [fill ? 3 : 2, 24]];
    const glyphs = wanted.map(([i, optical]) => [moduleGlyph(mod, i), optical]).filter(([g]) => Array.isArray(g)) as Array<[Glyph, 20 | 24]>;
    const attrs = (g: Glyph) => ' d="' + esc(g[0]) + '"' + (g[2].transform ? ' transform="' + esc(g[2].transform) + '"' : '') + (g[2].fillRule ? ' fill-rule="' + esc(g[2].fillRule) + '"' : '') + (g[2].clipRule ? ' clip-rule="' + esc(g[2].clipRule) + '"' : '');
    if (glyphs.length && glyphs.every(([g]) => g[1] === glyphs[0][0][1]))
      svg = '<svg class="plx-icon__svg plx-icon__svg--shared" viewBox="' + esc(glyphs[0][0][1]) + '" aria-hidden="true" focusable="false">' + glyphs.map(([g, optical]) => '<path class="plx-icon__glyph--' + optical + '"' + attrs(g) + '></path>').join('') + '</svg>';
    else svg = glyphs.map(([g, optical]) => '<svg class="plx-icon__svg plx-icon__glyph--' + optical + '" viewBox="' + esc(g[1]) + '" aria-hidden="true" focusable="false"><path' + attrs(g) + '></path></svg>').join('');
  } else if (!markupMissing.has(shown) && development() && typeof console !== 'undefined') {
    markupMissing.add(shown);
    console.warn('[Plenix] iconMarkup: "' + shown + '" has no module (import it, or load an icon file before this runs); its span is written without a drawing.');
  }
  const classes = iconClasses(shown, mod, o.library, size, o.filled, o.className).split(' ').map((c) => c.replace(/[^A-Za-z0-9_-]/g, '')).filter(Boolean).join(' ');
  // as Icon: with a label (the caller's words) an image, without one decorative
  const named: Record<string, string> = o.label ? { role: 'img', 'aria-label': o.label } : { 'aria-hidden': 'true' };
  return '<span class="' + esc(classes) + '"' + Object.keys(named).map((k) => ' ' + k + '="' + esc(named[k]) + '"').join('') + '>' + svg + '</span>';
}

// stateIcon: an icon a component draws in its own state: filled while the state is on, the outline otherwise (Styling
// Standard 3.6: the component that owns the state passes it; no rule reaches in from the ancestor). A string is an icon
// name or an imported module; an Icon element the caller gives keeps a fill it sets itself; anything else passes through. extra: more props for
// the Icon (a size), given only where the caller set none.
export function stateIcon(icon: unknown, on: unknown, extra?: Partial<IconProps> | null): React.ReactNode {
  if (typeof icon === 'string') return <Icon name={icon} filled={!!on} {...extra} />;
  if (isModule(icon)) return <Icon icon={icon} filled={!!on} {...extra} />;
  if (React.isValidElement<Record<string, unknown>>(icon) && icon.type === Icon) {
    const add: Record<string, unknown> = {};
    if (icon.props.filled === undefined) add.filled = !!on;
    for (const k of Object.keys(extra || {})) if (icon.props[k] === undefined) add[k] = (extra as Record<string, unknown>)[k];
    return Object.keys(add).length ? React.cloneElement(icon, add) : icon;
  }
  return icon as React.ReactNode;
}

// StatusIcon: a tone's icon in the tone's color, alone (an image named by the tone) or before a short visible label
const STATUS_ICONS: Record<string, IconModule> = { info: CircleInfoIcon, success: CircleCheckIcon, warning: WarningIcon, danger: AlertIcon, neutral: CircleInfoIcon };   // imported (#280)
export type StatusIconProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  strings?: Catalog | null;
};
export function StatusIcon({ tone = 'info', size = 'md', label, children, strings, className, ...rest }: StatusIconProps) {
  devWarn('StatusIcon', { tone, size }, { tone: ['info','success','warning','danger','neutral'], size: ['sm','md','lg'] });
  const t = STATUS_ICONS[tone] ? tone : 'info';
  const words = useStrings('icon.status', strings);
  const shown = children !== undefined && children !== null && children !== false;
  return (
    <span className={cx('plx-status-icon', 'plx-status-icon--' + t, 'plx-status-icon--' + size, className)} {...rest}>
      <span className={cx('plx-status-icon__glyph', 'plx-status-icon__glyph--' + t)}><Icon name={STATUS_ICONS[t]} size={size} label={shown ? undefined : (label || (words[t] as string))} /></span>
      {shown ? <span className="plx-status-icon__label">{children}</span> : null}
    </span>
  );
}
