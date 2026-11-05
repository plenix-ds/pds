// #275 / D-0049: the EntityHeader media tile is a bordered box and uses logical properties only.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const css = fs.readFileSync('platform/patterns/EntityHeader/entity-header.css', 'utf8');
const tile = css.match(/\n\.plx-entity-header__tile \{([^}]*)\}/)[1];
describe('#275 EntityHeader media tile', () => {
  it('draws the box: a border on all four sides and a radius', () => {
    for (const side of ['top', 'bottom', 'inline-start', 'inline-end']) expect(tile, side).toMatch(new RegExp('border-' + side + '-width'));
    expect(tile).toMatch(/border-start-start-radius/);
    expect(tile).toMatch(/border-end-end-radius/);
  });
  it('uses no physical left/right border or corner properties', () => {
    expect(tile).not.toMatch(/border-(left|right)-/);
    expect(tile).not.toMatch(/border-(top|bottom)-(left|right)-radius/);
  });
});
