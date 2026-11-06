// #122 (G3 ruling A): the text-contract checker counts an explicit `inherit` as "follows the context" for font-size, letter-spacing, line-height and word-spacing.
// A part that changes the font family is complete when its family and weight come from one role and every other property is the role's or an explicit inherit;
// it is then declared "context-sized" (visible in text-contracts.json), not on the backlog. unset, initial, revert and a missing declaration stay findings,
// and font-family / font-weight are never excused by inherit.
import { describe, it, expect } from 'vitest';
import { createRequire } from 'node:module';
const { measure } = createRequire(import.meta.url)('../../check-system.rules/text-contract.js');
const css = (text) => measure({ files: [{ file: 'platform/components/X/x.css', text }] });
const FAMILY = 'font-family:var(--plx-sys-text-body-font-family);word-spacing:var(--plx-sys-text-body-word-spacing);';
const WEIGHT = 'font-weight:var(--plx-sys-text-body-font-weight);';
describe('#122 context-sized parts', () => {
  it('explicit inherits for size, spacing and line height complete the part: context-sized, not on the backlog', () => {
    const m = css('.plx-x{' + FAMILY + WEIGHT + 'font-size:inherit;letter-spacing:inherit;line-height:inherit;}');
    expect(m.incomplete['plx-x']).toBeUndefined();
    expect(m.declared['plx-x']).toMatchObject({ contract: 'context-sized' });
    expect(m.declared['plx-x'].inherits).toEqual(['font-size', 'letter-spacing', 'line-height']);
  });
  it('a missing declaration is still a finding (a forgotten property cannot pass as deliberate)', () => {
    const m = css('.plx-x{' + FAMILY + WEIGHT + 'font-size:inherit;letter-spacing:inherit;}');
    expect(m.incomplete['plx-x']).toMatch(/missing line-height/);
  });
  it('unset, initial and revert do not count as following the context', () => {
    for (const v of ['unset', 'initial', 'revert']) {
      const m = css('.plx-x{' + FAMILY + WEIGHT + 'font-size:' + v + ';letter-spacing:inherit;line-height:inherit;}');
      expect(m.incomplete['plx-x'], v).toBeDefined();
    }
  });
  it('font-weight is never excused by inherit: a part with only the font switch and inherits keeps the follows contract, not context-sized', () => {
    const m = css('.plx-x{' + FAMILY + 'font-weight:inherit;font-size:inherit;letter-spacing:inherit;line-height:inherit;}');
    expect(m.declared['plx-x'].contract).toBe('follows');
  });
  it('a weight of its own that no text role has (500) keeps the part on the backlog, however many inherits it writes (plx-link--standalone)', () => {
    const m = css('.plx-x{' + FAMILY + 'font-weight:500;font-size:inherit;letter-spacing:inherit;line-height:inherit;}');
    expect(m.declared['plx-x'].contract).not.toBe('context-sized');
  });
});
