import { describe, it, expect } from 'vitest';
import { checkNumericCss } from './numeric.mjs';

describe('check 10: numeric columns', () => {
  it('passes tabular-nums with end alignment', () => {
    const css = '.plx-x__cell--numeric{font-variant-numeric:tabular-nums;text-align:end;}';
    expect(checkNumericCss(css, 'a.css')).toEqual([]);
  });
  it('accepts the DataGrid right-aligned cell rule', () => {
    const css = '.plx-data-grid__cell--align-right:where(:not(.a)){font-variant-numeric:tabular-nums;text-align:end;}';
    expect(checkNumericCss(css, 'a.css')).toEqual([]);
  });
  it('fails without tabular-nums', () => {
    expect(checkNumericCss('.plx-x--numeric{text-align:end;}', 'a.css')[0]).toContain('tabular-nums');
  });
  it('passes start alignment with tabular-nums (D-0087: grid content is start-aligned, numbers included)', () => {
    const css = '.plx-x--numeric{font-variant-numeric:tabular-nums;text-align:start;}';
    expect(checkNumericCss(css, 'a.css')).toEqual([]);
  });
  it('passes tabular-nums with no alignment of its own', () => {
    expect(checkNumericCss('.plx-x--numeric{font-variant-numeric:tabular-nums;}', 'a.css')).toEqual([]);
  });
  it('still fails on start alignment without tabular-nums', () => {
    expect(checkNumericCss('.plx-x--numeric{text-align:start;}', 'a.css')[0]).toContain('tabular-nums');
  });
  it('skips the layout-only rule of a right-aligned cell', () => {
    expect(checkNumericCss('.plx-g__cell--align-right{justify-content:flex-end;}', 'a.css')).toEqual([]);
  });
  it('ignores rules that are not numeric columns', () => {
    expect(checkNumericCss('.plx-x{text-align:start;}', 'a.css')).toEqual([]);
  });
});
