/* Plenix · contrast (platform/utils/contrast.ts): the contrast rules in code.
   Summary: WCAG 2.2 contrast between two colors (contrastRatio), whether a ratio meets a rule (meetsContrast), the rules
     themselves (CONTRAST_MINIMUMS) and the theme's role pairs that must meet them (CONTRAST_PAIRS). tests/contrast.test.js
     checks every pair in every theme and mode; the Contrast rules page draws the same pairs live from the page's tokens.
   Usage:
     import { contrastRatio, meetsContrast, CONTRAST_PAIRS } from 'plenix-platform';
     const css = getComputedStyle(document.documentElement), role = (n) => css.getPropertyValue('--plx-sys-' + n).trim();
     contrastRatio(role('content-muted'), role('surface-default'))   // 7.11 in the default light theme
     meetsContrast(4.6, 'text')                      // true: 4.5:1 is the rule for normal text
     CONTRAST_PAIRS.filter((p) => p.rule === 'non-text')
   Props:
     contrastRatio(a, b): the ratio (1 to 21) of two colors, "#rgb", "#rrggbb" or "rgb(r, g, b)"; NaN when one is not a color
     relativeLuminance(color): the color's relative luminance (0 to 1), as WCAG defines it
     parseColor(color): [r, g, b] (0 to 255), or null
     meetsContrast(ratio, rule): true when the ratio meets the rule ("text", "large-text", "enhanced", "non-text")
     CONTRAST_MINIMUMS: { text: 4.5, 'large-text': 3, enhanced: 7, 'non-text': 3 }
     CONTRAST_PAIRS: [{ fg, bg, rule, use }]: a foreground role on a background role (--plx-sys-<fg> on --plx-sys-<bg>)
   Behavior:
     Ratios are not rounded: 4.49 fails the text rule. Colors are opaque in Plenix (opacity is its own token), so alpha is
     ignored.
   Notes:
     The rules are the baseline (WCAG 2.2 AA; enhanced is AAA for dense small text): never loosen them. A pair that fails is
     fixed by pointing a role at another palette color in that theme and mode, never by adding a color. */

// the minimum ratio of each rule (WCAG 2.2: 1.4.3, 1.4.6 and 1.4.11)
export const CONTRAST_MINIMUMS = Object.freeze({ text: 4.5, 'large-text': 3, enhanced: 7, 'non-text': 3 });

// the role pairs the themes must keep: text on its surfaces, content on its fills, marks and edges on the surface
const T = 'text', N = 'non-text';
export const CONTRAST_PAIRS = Object.freeze([
  { fg: 'content-default', bg: 'surface-canvas', rule: T, use: 'Body text on the canvas' },
  { fg: 'content-default', bg: 'surface-default', rule: T, use: 'Body text on a surface' },
  { fg: 'content-default', bg: 'surface-raised', rule: T, use: 'Body text on a raised surface' },
  { fg: 'content-default', bg: 'surface-sunken', rule: T, use: 'Body text on a sunken surface (read-only fields)' },
  { fg: 'content-default', bg: 'surface-overlay', rule: T, use: 'Body text in menus and dialogs' },
  { fg: 'content-muted', bg: 'surface-default', rule: T, use: 'Secondary text on a surface' },
  { fg: 'content-muted', bg: 'surface-canvas', rule: T, use: 'Secondary text on the canvas' },
  { fg: 'content-link', bg: 'surface-default', rule: T, use: 'Links on a surface' },
  { fg: 'content-link-visited', bg: 'surface-default', rule: T, use: 'Visited links on a surface' },
  { fg: 'content-inverse', bg: 'surface-inverse', rule: T, use: 'Text on the inverse surface' },
  { fg: 'field-placeholder', bg: 'control-background', rule: T, use: 'Placeholder text in a field' },
  { fg: 'action-primary-content', bg: 'action-primary-background', rule: T, use: 'Primary button label' },
  { fg: 'action-danger-content', bg: 'action-danger-background', rule: T, use: 'Danger button label' },
  { fg: 'fill-neutral-content', bg: 'fill-neutral', rule: T, use: 'Label on a neutral fill (secondary button)' },
  { fg: 'selected-content', bg: 'state-selected', rule: T, use: 'Text of a selected row or item' },
  { fg: 'accent-content', bg: 'accent-surface', rule: T, use: 'Text in the accent header' },
  { fg: 'tooltip-content', bg: 'tooltip-background', rule: T, use: 'Tooltip text' },
  { fg: 'toast-content', bg: 'toast-background', rule: T, use: 'Toast text' },
  { fg: 'status-bar-content', bg: 'status-bar-background', rule: T, use: 'Status bar text' },
  { fg: 'data-grid-text', bg: 'data-grid-surface', rule: T, use: 'Table cells' },
  { fg: 'avatar-content', bg: 'avatar-background', rule: T, use: 'Avatar initials' },
  { fg: 'feedback-info-content', bg: 'feedback-info-soft', rule: T, use: 'Info message text' },
  { fg: 'feedback-success-content', bg: 'feedback-success-soft', rule: T, use: 'Success message text' },
  { fg: 'feedback-warning-content', bg: 'feedback-warning-soft', rule: T, use: 'Warning message text' },
  { fg: 'feedback-danger-content', bg: 'feedback-danger-soft', rule: T, use: 'Error message text' },
  { fg: 'feedback-neutral-content', bg: 'feedback-neutral-soft', rule: T, use: 'Neutral message text' },
  { fg: 'feedback-info-on-solid', bg: 'feedback-info-solid', rule: T, use: 'Text on a solid info badge' },
  { fg: 'feedback-success-on-solid', bg: 'feedback-success-solid', rule: T, use: 'Text on a solid success badge' },
  { fg: 'feedback-warning-on-solid', bg: 'feedback-warning-solid', rule: T, use: 'Text on a solid warning badge' },
  { fg: 'feedback-danger-on-solid', bg: 'feedback-danger-solid', rule: T, use: 'Text on a solid danger badge' },
  { fg: 'control-border', bg: 'control-background', rule: N, use: 'The edge of a field' },
  { fg: 'border-strong', bg: 'surface-default', rule: N, use: 'Strong borders and control edges' },
  { fg: 'focus-ring-color', bg: 'surface-default', rule: N, use: 'The focus color on a surface' },
  { fg: 'focus-ring-color', bg: 'surface-canvas', rule: N, use: 'The focus color on the canvas' },
  { fg: 'feedback-info-solid', bg: 'surface-default', rule: N, use: 'Info marks (dots, icons)' },
  { fg: 'feedback-success-solid', bg: 'surface-default', rule: N, use: 'Success marks (dots, icons)' },
  { fg: 'feedback-warning-solid', bg: 'surface-default', rule: N, use: 'Warning marks (dots, icons)' },
  { fg: 'feedback-danger-solid', bg: 'surface-default', rule: N, use: 'Danger marks (dots, icons)' },
  // the brand and status roles (color groups, owner 2026-10-13)
  { fg: 'brand-on-primary', bg: 'brand-primary', rule: T, use: 'Text and icons on the brand blue (a product tile)' },
  { fg: 'brand-primary', bg: 'brand-on-primary', rule: T, use: 'The teaching bubble primary action: the brand blue label on its fill' },
  { fg: 'brand-on-primary', bg: 'brand-primary', rule: N, use: 'Teaching bubble focus ring and action outlines on the brand blue' },
  { fg: 'status-online', bg: 'surface-default', rule: N, use: 'Presence: online (a dot)' },
  { fg: 'status-away', bg: 'surface-default', rule: N, use: 'Presence: away (a dot)' },
  { fg: 'status-busy', bg: 'surface-default', rule: N, use: 'Presence: busy (a dot)' },
  { fg: 'status-dnd', bg: 'surface-default', rule: N, use: 'Presence: do not disturb (a dot)' },
  { fg: 'status-offline', bg: 'surface-default', rule: N, use: 'Presence: offline (a dot)' },
  { fg: 'status-done', bg: 'surface-default', rule: N, use: 'Workflow: done (a dot, an icon)' },
  { fg: 'status-in-progress', bg: 'surface-default', rule: N, use: 'Workflow: in progress (a dot, an icon)' },
  { fg: 'status-blocked', bg: 'surface-default', rule: N, use: 'Workflow: blocked (a dot, an icon)' },
  { fg: 'status-not-started', bg: 'surface-default', rule: N, use: 'Workflow: not started (a dot, an icon)' },
  // the status pills and the category pills (owner, 2026-10-14, docs/pills-and-colors.md): every pill text on its background
  { fg: 'status-pill-neutral-text', bg: 'status-pill-neutral-background', rule: T, use: 'Status pill text: Neutral' },
  { fg: 'status-pill-success-text', bg: 'status-pill-success-background', rule: T, use: 'Status pill text: Success' },
  { fg: 'status-pill-active-text', bg: 'status-pill-active-background', rule: T, use: 'Status pill text: Active' },
  { fg: 'status-pill-waiting-text', bg: 'status-pill-waiting-background', rule: T, use: 'Status pill text: Waiting' },
  { fg: 'status-pill-action-required-text', bg: 'status-pill-action-required-background', rule: T, use: 'Status pill text: Action required' },
  { fg: 'status-pill-negative-text', bg: 'status-pill-negative-background', rule: T, use: 'Status pill text: Negative' },
  { fg: 'category-red-on-soft', bg: 'category-red-soft', rule: T, use: 'Category pill text: red' },
  { fg: 'category-green-on-soft', bg: 'category-green-soft', rule: T, use: 'Category pill text: green' },
  { fg: 'category-yellow-on-soft', bg: 'category-yellow-soft', rule: T, use: 'Category pill text: yellow' },
  { fg: 'category-blue-on-soft', bg: 'category-blue-soft', rule: T, use: 'Category pill text: blue' },
  { fg: 'category-orange-on-soft', bg: 'category-orange-soft', rule: T, use: 'Category pill text: orange' },
  { fg: 'category-purple-on-soft', bg: 'category-purple-soft', rule: T, use: 'Category pill text: purple' },
  { fg: 'category-cyan-on-soft', bg: 'category-cyan-soft', rule: T, use: 'Category pill text: cyan' },
  { fg: 'category-magenta-on-soft', bg: 'category-magenta-soft', rule: T, use: 'Category pill text: magenta' },
  { fg: 'category-lime-on-soft', bg: 'category-lime-soft', rule: T, use: 'Category pill text: lime' },
  { fg: 'category-pink-on-soft', bg: 'category-pink-soft', rule: T, use: 'Category pill text: pink' },
  { fg: 'category-teal-on-soft', bg: 'category-teal-soft', rule: T, use: 'Category pill text: teal' },
  { fg: 'category-lavender-on-soft', bg: 'category-lavender-soft', rule: T, use: 'Category pill text: lavender' },
  { fg: 'category-brown-on-soft', bg: 'category-brown-soft', rule: T, use: 'Category pill text: brown' },
  { fg: 'category-beige-on-soft', bg: 'category-beige-soft', rule: T, use: 'Category pill text: beige' },
  { fg: 'category-maroon-on-soft', bg: 'category-maroon-soft', rule: T, use: 'Category pill text: maroon' },
  { fg: 'category-mint-on-soft', bg: 'category-mint-soft', rule: T, use: 'Category pill text: mint' },
  { fg: 'category-olive-on-soft', bg: 'category-olive-soft', rule: T, use: 'Category pill text: olive' },
  { fg: 'category-apricot-on-soft', bg: 'category-apricot-soft', rule: T, use: 'Category pill text: apricot' },
  { fg: 'category-navy-on-soft', bg: 'category-navy-soft', rule: T, use: 'Category pill text: navy' },
  { fg: 'category-gray-on-soft', bg: 'category-gray-soft', rule: T, use: 'Category pill text: gray' }
]);

// a color as three channels, 0 to 255
export type RGB = [number, number, number];
export type ContrastRule = 'text' | 'large-text' | 'enhanced' | 'non-text';
export function parseColor(color: unknown): RGB | null {
  const s = String(color || '').trim().toLowerCase();
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{1,2})?$/.exec(s);
  if (m) {
    const h = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1];
    return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)) as RGB;
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(s);
  return m ? [+m[1], +m[2], +m[3]] : null;
}

export function relativeLuminance(color: unknown): number {
  const c: number[] | null = Array.isArray(color) ? color : parseColor(color);
  if (!c) return NaN;
  const lin = c.map((v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrastRatio(a: unknown, b: unknown): number {
  const la = relativeLuminance(a), lb = relativeLuminance(b);
  if (Number.isNaN(la) || Number.isNaN(lb)) return NaN;
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function meetsContrast(ratio: number, rule: ContrastRule | string = 'text'): boolean {
  const min = (CONTRAST_MINIMUMS as Readonly<Record<string, number>>)[rule];
  if (min == null) throw new Error('meetsContrast: no rule "' + rule + '" (text, large-text, enhanced, non-text)');
  return ratio >= min;
}
