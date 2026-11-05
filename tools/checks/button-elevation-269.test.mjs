// #269 / #6 / D-0048: every raised outline button shares one lighter elevation. Static check of tokens and CSS.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const tokens = JSON.parse(fs.readFileSync('platform/tokens/components.tokens.json', 'utf8'));
const css = fs.readFileSync('platform/components/Button/button.css', 'utf8');
const t = (k) => tokens[k] ?? Object.values(tokens).find((v) => v && v[k])?.[k];
const val = (k) => (t(k) || tokens['plx-comp']?.[k] || findDeep(tokens, k))?.$value;
function findDeep(o, k) { if (!o || typeof o !== 'object') return; if (o[k]) return o[k]; for (const v of Object.values(o)) { const r = findDeep(v, k); if (r) return r; } }

describe('#269 button elevation (D-0048)', () => {
  it('rest shadow is none, hover shadow is Halo', () => {
    expect(val('button-raised-rest-shadow')).toBe('none');
    expect(val('button-raised-hover-shadow')).toBe('{plx-comp.card-elevation-halo-shadow}');
  });
  it('the four glow images start the rim at 90%, not 75%', () => {
    for (const k of ['button-secondary-glow-image', 'button-secondary-hover-glow-image', 'button-primary-glow-image', 'button-primary-hover-glow-image', 'button-danger-glow-image', 'button-danger-hover-glow-image']) {
      expect(val(k), k).toMatch(/ 90%,/);
      expect(val(k), k).not.toMatch(/ 75%,/);
    }
  });
  it('danger-secondary joins the raised family and honors the bar hooks', () => {
    const rule = css.match(/\.plx-button--danger-secondary:where\(:not\(\.plx-button--size-2xs\)\)\s*\{([^}]*)\}/);
    expect(rule, 'raised rule for danger-secondary').toBeTruthy();
    expect(rule[1]).toContain('--plx-state-button-rest-image: var(--plx-comp-button-context-glow, var(--plx-comp-button-secondary-glow-image))');
    expect(rule[1]).toMatch(/hover-elevation: var\(\s*--plx-comp-button-context-elevation,\s*var\(--plx-comp-button-raised-hover-shadow\)/);
    expect(rule[1]).toMatch(/rest-elevation: var\(\s*--plx-comp-button-context-elevation,\s*var\(--plx-comp-button-raised-rest-shadow\)/);
    expect(rule[1]).not.toContain('hover-image');
  });
});
