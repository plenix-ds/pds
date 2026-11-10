/* Plenix · monitorWidths (platform/utils/monitorWidths.ts)
   Summary: The width a person dragged a pane to, remembered per monitor (owner, issue 463 option C, step 3): one saved value per panel per
     monitor, the monitor named by its physical size (screen size times devicePixelRatio, to the nearest 10px: "2560x1440"), so browser zoom does not change it. A laptop screen and an external monitor each keep their own.
   Usage:
     const [width, setWidth] = useMonitorWidth('side', { legacy: () => oldValue, min: () => px, max: () => px });
     width is the saved width for this monitor when it still fits the window (between min and the window's share, paneMax), else null
     (the pane starts at its default); setWidth(w) saves w for this monitor; setWidth(null) forgets it (the pane is back at its standard width).
   Props: panel: "side" (the side panel) | "nav" (the navigation pane); legacy(): the single value saved before this change (read once);
     min(), max(): the limits now, in pixels (the component's tokens).
   Behavior:
     Storage: one localStorage object, plenix.paneWidths = { side: { "2560x1440": 560 }, nav: { … } }. The old single value (plenix.sidePanelWidth,
       plenix.sideNav.width) becomes the current monitor's value the first time a panel is read, and the old key stays where it is.
     A saved width that no longer fits the window (a smaller window, a lower limit) is not used and not deleted: it comes back when it fits.
     Moving the window to another monitor is noticed on the next window resize and the other monitor's width is read.
     Nothing stored (private window, blocked site data): the width lasts for this visit only.
   Notes: Internal; not part of the public API. The 90% share and the 4px grid come from paneMax (utils/paneLimit.ts). */
import React from 'react';
import { paneMax } from './paneLimit.ts';

const STORE = 'plenix.paneWidths';
// the saved widths: panel -> monitor key -> width in pixels
type Widths = Record<string, Record<string, number> | undefined>;
type ScreenWindow = { screen?: { width: number; height: number }; devicePixelRatio?: number };
// The monitor's identity is its physical size: the screen's CSS size times devicePixelRatio, to the nearest 10px (a fractional zoom step rounds to the same
// size). A browser reports screen.width in zoom-adjusted CSS pixels (1920 at 100% is about 1280 at 150%), so screen.width alone would change with every
// Ctrl+plus; multiplied by devicePixelRatio the zoom cancels out.
export const monitorKey = (win?: ScreenWindow | null): string => {
  const w: ScreenWindow = win || (typeof window !== 'undefined' ? window : null) || {}, s = w.screen, r = w.devicePixelRatio || 1;
  const tenth = (n: number) => Math.round((n * r) / 10) * 10;
  return s && s.width ? tenth(s.width) + 'x' + tenth(s.height) : 'unknown';
};
const load = (): Widths => { try { const o = JSON.parse(localStorage.getItem(STORE) as string); return o && typeof o === 'object' && !Array.isArray(o) ? o : {}; } catch (e) { return {}; } };
const save = (all: Widths) => { try { localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) { /* this visit only */ } };
const whole = (v: unknown): number | null => { const n = +(v as number); return Number.isFinite(n) && n > 0 ? n : null; };

// A stored key whose two sizes are both within 10px of this key's is the same monitor: a size ending in 4 to 6 can round either way at an odd zoom
// step, so the exact key alone could straddle the rounding edge. The nearest such key wins; none matches: the key itself.
function nearest(mine: Record<string, number> | undefined, key: string): string {
  if (!mine || typeof mine !== 'object' || key in mine) return key;
  const at = (k: string) => /^(\d+)x(\d+)$/.exec(k), c = at(key);
  if (!c) return key;
  // keys in sorted order, and only a strictly smaller gap replaces the best: on a tie the smaller key wins, the same key every time
  let best = key, gap = Infinity;
  for (const k of Object.keys(mine).sort()) { const m = at(k); if (!m) continue; const a = Math.abs((m[1] as unknown as number) - (c[1] as unknown as number)), b = Math.abs((m[2] as unknown as number) - (c[2] as unknown as number)); if (a <= 10 && b <= 10 && a + b < gap) { best = k; gap = a + b; } }
  return best;
}
// the saved width for a monitor; the first read of a panel carries the old single value over as this monitor's (written by the caller, in an
// effect: reading never writes)
function read(panel: string, key: string, legacy?: () => unknown): { value: number | null; carried: boolean } {
  const mine = load()[panel];
  if (mine && typeof mine === 'object') return { value: whole(mine[nearest(mine, key)]), carried: false };
  const old = legacy ? whole(legacy()) : null;
  return { value: old, carried: !!old };
}
function write(panel: string, key: string, w: number | null): void { const all = load(); all[panel] = Object.assign({}, all[panel], { [nearest(all[panel], key)]: w }); save(all); }

export type MonitorWidthOptions = { legacy?: () => unknown; min?: () => number; max?: () => number };
export function useMonitorWidth(panel: 'side' | 'nav' | string, { legacy, min, max }: MonitorWidthOptions): [number | null, (w: number | null) => void] {
  const [key, setKey] = React.useState(() => monitorKey());
  const [first] = React.useState(() => read(panel, key, legacy));
  const [raw, setRaw] = React.useState(first.value);
  // the old single value becomes this monitor's value: saved once, here, not while rendering
  React.useEffect(() => { if (first.carried) write(panel, key, first.value); }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const onResize = () => { const k = monitorKey(); if (k !== key) { setKey(k); const r = read(panel, k, legacy); setRaw(r.value); if (r.carried) write(panel, k, r.value); } };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [key, panel]);   // eslint-disable-line react-hooks/exhaustive-deps
  const set = React.useCallback((w: number | null) => { setRaw(w); write(panel, key, w); }, [panel, key]);
  const lo = min ? min() : 0, hi = max ? paneMax(max(), lo) : Infinity;
  return [raw && raw >= lo && raw <= hi ? raw : null, set];
}
