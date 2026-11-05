/* Plenix · grid (platform/utils/grid.ts)
   Summary: Puts a length that JavaScript writes inline on the Plenix grid (owner, 2026-10-13: an on-the-spot offset "has
     to conform to fit into the grid system!!! important"). The grid step is the base spacing token (--plx-ref-space-1u),
     read from the page, never written as a number. A size with steps of its own takes them (Resizable's steps); a dragged
     pane or box lands on the grid (gridWithin).
   Usage:
     import { snapToGrid, gridPx } from '../../utils/grid.ts';
     el.style.insetBlockStart = gridPx(anchor.bottom + tokenPx('--plx-sys-space-stack-xs'));   // a measured anchor plus a token
     column.setWidth(snapToGrid(measured, { round: 'up' }));                                    // a measured width, on the grid
   Props:
     gridStep(el): the grid step in pixels (the base spacing token where el is; default the page's root)
     snapToGrid(px, { round, el }): px on the grid: round "nearest" (default) | "up" | "down"
     gridPx(px, { round, el }): the same, as a CSS length ("12px"), for an inline style
     onGrid(px, el): true when px is a whole number of grid steps (within half a pixel's rounding)
     gridWithin(px, min, max, { el }): the grid line nearest px inside [min, max] (each limit taken to the nearest grid line
       inside it): a dragged pane's or box's size, one grid line at a time (owner, 2026-10-26: "only after a user positions
       the menu, it would automatically reposition itself to the nearest grid line")
   Behavior:
     A measured anchor (where a trigger is) is layout, not an invented value: snap the result, not the anchor. Offsets and
     gaps added to it come from tokens. 0 stays 0; a negative length snaps the same way as a positive one.
   Notes:
     The run-time style audit (platform/dev/style-audit.js) reports an inline length that is neither a Platform token (var)
     reference nor a whole number of grid steps; check-system (rule inline-style) reports style-writing code whose
     length is neither a token nor passed through this helper (or the size steps).
*/

export const GRID_TOKEN = '--plx-ref-space-1u';

// the base spacing token in pixels where el is (a rem token follows the root font size)
export function gridStep(el?: Element | null): number {
  if (typeof document === 'undefined') return 4;
  const at = el || document.documentElement, win = at.ownerDocument.defaultView;
  // a document without a window (a preview frame already removed): nothing to read, the base step
  if (!win) return 4;
  const v = win.getComputedStyle(at).getPropertyValue(GRID_TOKEN).trim();
  const px = /rem$/.test(v) ? parseFloat(v) * (parseFloat(win.getComputedStyle(at.ownerDocument.documentElement).fontSize) || 16) : parseFloat(v);
  return px > 0 ? px : 4;
}

// how a length lands on the grid: round 'nearest' (default) | 'up' | 'down'; el: where the step is read; step: a step already read
export type GridOptions = { round?: 'nearest' | 'up' | 'down'; el?: Element | null; step?: number };
export function snapToGrid(px: unknown, opts?: GridOptions | null): number {
  const o = opts || {}, step = o.step || gridStep(o.el), n = Number(px) || 0;   // opts.step: a step already read (a loop reads it once)
  const f = o.round === 'up' ? Math.ceil : o.round === 'down' ? Math.floor : Math.round;
  const q = n / step;
  return f(Math.abs(q - Math.round(q)) < 1e-6 ? Math.round(q) : q) * step;
}

export const gridPx = (px: unknown, opts?: GridOptions | null): string => snapToGrid(px, opts) + 'px';

export function onGrid(px: unknown, el?: Element | null): boolean {
  const step = gridStep(el), q = Math.abs(Number(px) || 0) / step;
  return Math.abs(q - Math.round(q)) * step <= 0.5;
}

export function gridWithin(px: number, min: number, max: number, opts?: GridOptions | null): number {
  const o = opts || {}, step = o.step || gridStep(o.el);
  const lo = snapToGrid(min, { step, round: 'up' }), hi = Math.max(lo, snapToGrid(max, { step, round: 'down' }));
  return Math.max(lo, Math.min(hi, snapToGrid(px, { step })));
}
