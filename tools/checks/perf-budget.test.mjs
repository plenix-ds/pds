#!/usr/bin/env node
// Self-test of tools/checks/perf-budget.mjs (#1188): a scope that reaches elements is limited, a :root-only scope is not,
// media and layer copies of one scope add up, and plenix.js is measured with brotli 5.
//   node tools/checks/perf-budget.test.mjs        (CI: the Bundle budgets job)
import assert from 'node:assert/strict';
import { reachesElements, scopeTokens, check } from './perf-budget.mjs';

assert.equal(reachesElements(':root'), false);
assert.equal(reachesElements('html'), false);
assert.equal(reachesElements(':root[data-plx-mode=dark]:not([data-plx-theme])'), false);
assert.equal(reachesElements(':root, [data-plx-density]'), true);
assert.equal(reachesElements('[data-plx-density=compact], :root[data-plx-density-policy=compact]'), true);
assert.equal(reachesElements(':rooted'), true);

const decls = (n, p) => Array.from({ length: n }, (_, i) => `--${p}-${i}: 1px;`).join(' ');
const css = `@layer t { :root { ${decls(50, 'a')} } :root, [data-plx-density] { ${decls(8, 'b')} color: red; } }
@media (forced-colors: active) { :root, [data-plx-density] { ${decls(3, 'c')} } }
@layer t { :root, [data-plx-density] { ${decls(2, 'd')} } }`;
const s = scopeTokens(css);
assert.equal(s.total, 63);
assert.equal(s.scopes[0].count, 50);
const t = s.scopes.find((x) => x.scope === '@layer t :root, [data-plx-density]');
assert.equal(t.count, 10, 'two copies of one scope in the same layer add up');

const js = Buffer.from('x'.repeat(5000));
const budget = (scope, jsLimit) => ({ scopeTokens: { limit: scope }, jsBrotli: { file: 'plenix.js', limit: jsLimit } });
assert.deepEqual(check({ css, js, budget: budget(10, 1e6) }).fails, []);
assert.match(check({ css, js, budget: budget(9, 1e6) }).fails[0], /declares 10 custom properties \(limit 9\)/);
assert.equal(check({ css, js, budget: budget(10, 1) }).fails.length, 1, 'plenix.js over its brotli limit fails');
assert.ok(check({ css, js, budget: budget(10, 1e6) }).notes.some((n) => /plenix\.css: .*printed, not limited/.test(n)));
console.log('PERF_BUDGET_TEST_OK');
