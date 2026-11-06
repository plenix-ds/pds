// #84 (review on #444): while a lazy cell editor's code arrives (the first open in an ES-module build) the cell shows its current value, busy, not a blank.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const parts = fs.readFileSync('platform/components/DataGrid/engine/parts.jsx', 'utf8');
describe('#84 lazy editor fallback', () => {
  it('the Suspense fallback is not null: it shows the value text with aria-busy', () => {
    const m = parts.match(/<React\.Suspense\s+fallback=\{([\s\S]*?)\}\s*>\s*<LazyEditor/);
    expect(m, 'a Suspense around LazyEditor').toBeTruthy();
    expect(m[1].trim()).not.toBe('null');
    expect(m[1]).toContain('aria-busy');
  });
});
