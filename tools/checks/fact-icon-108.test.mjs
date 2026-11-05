// #108 case 2 (D-0036, D-0038 A): an EntityHeader fact icon has no box; the icon fills its 40px square.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const css = fs.readFileSync('platform/patterns/EntityHeader/entity-header.css', 'utf8');
const tokens = JSON.parse(fs.readFileSync('platform/tokens/components/entity-header.tokens.json', 'utf8'))['plx-comp'];
const rule = css.match(/\n\.plx-entity-header__fact-icon \{([^}]*)\}/)[1];
describe('#108 case 2: fact icons without a box', () => {
  it('the rule draws no fill, border or corners', () => {
    expect(rule).not.toMatch(/background-color|border-|border:|border-radius/);
  });
  it('keeps its square and the muted colour', () => {
    expect(rule).toContain('inline-size: var(--plx-comp-entity-header-fact-icon-tile-size)');
    expect(rule).toContain('--plx-comp-entity-header-fact-icon-tile-text');
  });
  it('the icon is as wide as the square', () => {
    expect(tokens['entity-header-fact-icon-size']['$value']).toBe('{plx-comp.entity-header-fact-icon-tile-size}');
    for (const k of ['background', 'border-color', 'radius']) expect(tokens['entity-header-fact-icon-tile-' + k]).toBeUndefined();
  });
});
