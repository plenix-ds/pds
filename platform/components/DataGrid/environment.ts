/* Plenix · DataGridEngine environment
   Summary: Engine-independent CSS token resolution.
   Usage: Internal to DataGridEngine; no legacy grid modules are imported.
   Props: A token/length and optional element.
   Behavior: Reads dimensions from inherited CSS tokens.
   Notes: Contains no engine loader or runtime stylesheet requests. */
const measured = new WeakMap<Document, Map<string, number>>();   // document → (length and context → pixels)
export function tokenPixels(token: string | number | null | undefined, el?: Element | null): number {
  if (!token || typeof document === 'undefined') return 0;
  const m = /^(--[\w-]+)$|^var\(\s*(--[\w-]+)\s*\)$/.exec(String(token).trim());
  if (!m) {
    if (typeof token === 'number' || /^\d+(?:\.\d+)?px$/.test(String(token))) return parseFloat(String(token)) || 0;
    const host: Element = el || document.documentElement, doc = host.ownerDocument || document, win = doc.defaultView;
    if (!win || !win.CSS.supports('inline-size', String(token)) || !win.CSSStyleSheet || !('adoptedStyleSheets' in doc)) return 0;
    // a measured length is kept for the context it depends on (the font sizes, the window and, for a percentage, the
    // container's width): adding the probe's sheet restyles the whole document, so it runs once per length and context
    const text = String(token), rootFont = getComputedStyle(doc.documentElement).fontSize, ownFont = getComputedStyle(host).fontSize;
    const key = text + '|' + ownFont + '|' + rootFont + '|' + win.innerWidth + 'x' + win.innerHeight + (/%/.test(text) ? '|' + host.clientWidth : '');
    let known = measured.get(doc); if (!known) { known = new Map<string, number>(); measured.set(doc, known); }
    // only a container on screen measures (a hidden one reads 0), so only its lengths are kept and reused
    const shown = host.getClientRects().length > 0;
    if (shown && known.has(key)) return known.get(key) as number;
    // Measure a caller CSS length in the container's inherited font and available width, without an inline style or a retained rule.
    const sheet = new win.CSSStyleSheet(), before = doc.adoptedStyleSheets, probe = doc.createElement('span');
    sheet.replaceSync('.plx-data-grid__length-probe{inline-size:' + text + ';}');
    probe.className = 'plx-data-grid__length-probe';
    try { doc.adoptedStyleSheets = before.concat(sheet); host.appendChild(probe); const px = probe.getBoundingClientRect().width || 0; if (shown && px > 0) known.set(key, px); return px; }
    finally { probe.remove(); doc.adoptedStyleSheets = before; }
  }
  const v = getComputedStyle(el || document.documentElement).getPropertyValue(m[1] || m[2]).trim();
  if (/rem$/.test(v)) return parseFloat(v) * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
  return /^\d+(?:\.\d+)?px$/.test(v) ? parseFloat(v) : v ? tokenPixels(v, el) : 0;
}
