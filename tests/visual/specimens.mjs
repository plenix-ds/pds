// Check 12 manifest: one entry per component specimen. `html` is the body; the page adds the stylesheet, theme, direction, density.
// A component whose text, direction or density code changed is listed in VISUAL_EXTRA (comma list); it then also runs RTL and compact.
import { readFileSync } from 'node:fs';
// parts rendered by tests/visual/make-parts-specimens.cjs (issue 1021): static markup, no script
const parts = JSON.parse(readFileSync(new URL('./specimens-parts.json', import.meta.url), 'utf8'));
const STATES = ['rest', 'hover', 'selected', 'focus', 'disabled', 'loading'];
const cls = (v, st) => ['plx-button', `plx-button--${v}`, st === 'hover' && 'is-hover', st === 'selected' && 'is-selected', st === 'focus' && 'is-focus-visible', st === 'loading' && 'is-loading'].filter(Boolean).join(' ');
const button = (v) => STATES.map((st) => `<button class="${cls(v, st)}"${st === 'disabled' ? ' disabled' : ''}><span class="plx-button__label">Save</span></button>`).join(' ');

export const specimens = {
  ...parts,
  'button-secondary': button('secondary'),
  'button-primary': button('primary'),
  'button-danger': button('danger'),
  'badge-status': ['neutral', 'success', 'active', 'waiting', 'action-required', 'negative'].map((v) => `<span class="plx-badge plx-badge--${v}">${v}</span>`).join(' '),
};
