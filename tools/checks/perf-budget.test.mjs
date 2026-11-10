// issue 1188: the performance budgets (tools/checks/perf-budget.mjs). A scope that reaches elements is limited, a
// :root-only scope is not, layer copies of one scope add up, and plenix.js is measured with brotli 5. Runs in the checks'
// Vitest job.
import { describe, it, expect } from 'vitest';
import { reachesElements, isDensityScope, scopeTokens, check, checkTraces } from './perf-budget.mjs';

const decls = (n, p) => Array.from({ length: n }, (_, i) => `--${p}-${i}: 1px;`).join(' ');
const css = `@layer t { :root { ${decls(50, 'a')} } :root, [data-plx-density] { ${decls(8, 'b')} color: red; } }
@media (forced-colors: active) { :root, [data-plx-density] { ${decls(3, 'c')} } }
@layer t { :root, [data-plx-density] { ${decls(2, 'd')} } }`;
const js = Buffer.from('x'.repeat(5000));
const budget = (scope, jsLimit) => ({ scopeTokens: { limit: scope }, jsBrotli: { file: 'plenix.js', limit: jsLimit } });

describe('perf-budget (1188)', () => {
  it('a selector on :root or html reaches only the root; any other part reaches elements', () => {
    expect(reachesElements(':root')).toBe(false);
    expect(reachesElements('html')).toBe(false);
    expect(reachesElements(':root[data-plx-mode=dark]:not([data-plx-theme])')).toBe(false);
    expect(reachesElements(':root, [data-plx-density]')).toBe(true);
    expect(reachesElements('[data-plx-density=compact], :root[data-plx-density-policy=compact]')).toBe(true);
    expect(reachesElements(':rooted')).toBe(true);
  });
  it('counts custom properties per scope; copies in the same layer add up', () => {
    const s = scopeTokens(css);
    expect(s.total).toBe(63);
    expect(s.scopes[0].count).toBe(50);
    expect(s.scopes.find((x) => x.scope === '@layer t :root, [data-plx-density]').count).toBe(10);
  });
  it('a density scope lists the bare density or interaction attribute', () => {
    expect(isDensityScope(':root, [data-plx-density], [data-plx-interaction]')).toBe(true);
    expect(isDensityScope(':root, [data-plx-interaction]')).toBe(true);
    expect(isDensityScope('[data-plx-density=compact], :root[data-plx-density-policy=compact]')).toBe(false);
    expect(isDensityScope(':root, [data-plx-theme], [data-plx-mode]')).toBe(false);
  });
  it('fails when the density scope is over its own limit, even under the general one (#1205)', () => {
    const b = { ...budget(100, 1e6), densityTokens: { limit: 9 } };
    expect(check({ css, js, budget: b }).fails[0]).toMatch(/density scope declares 10 custom properties \(limit 9\)/);
    expect(check({ css, js, budget: { ...b, densityTokens: { limit: 10 } } }).fails).toEqual([]);
  });
  it('fails over a limit and only prints the CSS size', () => {
    expect(check({ css, js, budget: budget(10, 1e6) }).fails).toEqual([]);
    expect(check({ css, js, budget: budget(9, 1e6) }).fails[0]).toMatch(/declares 10 custom properties \(limit 9\)/);
    expect(check({ css, js, budget: budget(10, 1) }).fails).toHaveLength(1);
    expect(check({ css, js, budget: budget(10, 1e6) }).notes.some((n) => /plenix\.css: .*printed, not limited/.test(n))).toBe(true);
  });
  it('a reference page over its LCP or INP budget fails; a missing page fails (#1213)', () => {
    const traces = { lcpMs: 2500, inpMs: 200, pages: ['grid', 'record', 'form'] };
    const ok = { pages: { grid: { lcp: 248, inp: 24 }, record: { lcp: 72, inp: 16 }, form: { lcp: 76, inp: 0 } } };
    expect(checkTraces(ok, traces).fails).toEqual([]);
    const slow = { pages: { ...ok.pages, grid: { lcp: 2600, inp: 240 } } };
    expect(checkTraces(slow, traces).fails).toEqual(['grid: LCP 2600 ms is over 2500 ms', 'grid: INP 240 ms is over 200 ms']);
    expect(checkTraces({ pages: { grid: ok.pages.grid, record: ok.pages.record } }, traces).fails).toEqual(['form: no LCP or INP in the trace']);
    expect(checkTraces({}, traces).fails).toHaveLength(3);
  });
});
