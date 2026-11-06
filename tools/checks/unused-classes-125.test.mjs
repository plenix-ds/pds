// issue 125: the unused-classes rule. A class nothing produces is a finding; a dynamically built name, a deprecated one and a used one are not.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
const { built, findings } = createRequire(import.meta.url)('../../check-system.rules/unused-classes.js');

describe('unused-classes (125)', () => {
  it('a name built from a stem counts as used', () => {
    expect(built('plx-layout--justify-start', "cx('plx-layout--justify-' + value)")).toBe(true);
    expect(built("plx-card--soft", "`plx-card--${tone}`")).toBe(true);
    expect(built('plx-card--soft', "'plx-card--' + tone")).toBe(true);
  });
  it('a name whose block is a variable counts as used by its tail', () => {
    expect(built('plx-data-grid__tree-cell--level-3', '`${block}__tree-cell--level-${n}`')).toBe(true);
  });
  it('a name nothing builds is not used', () => {
    expect(built('plx-layout--justify-start', "'plx-other--thing'")).toBe(false);
    expect(built('plx-plain', 'anything')).toBe(false);
  });
  it('the repository has no unused class outside the deprecated list', () => {
    expect(findings().map((f) => f.text)).toEqual([]);
  }, 60000);   // it reads the whole repository
});
