// issue 1208: the entries check (tools/checks/esm-entries.mjs) and the entry writer (tools/publish/esm-parts.js). Runs in the
// checks' Vitest job.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { compare, specifiers } from './esm-entries.mjs';

const { exportsOf, staticImports, closure } = createRequire(import.meta.url)('../publish/esm-parts.js');

describe('esm entries (1208)', () => {
  it('a name missing from a place, or a place holding a name that is no export, is a finding', () => {
    expect(compare(['A', 'B'], { parts: new Set(['A', 'B']) })).toEqual([]);
    expect(compare(['A', 'B'], { parts: new Set(['A', 'C']) })).toEqual(['parts: B is missing', 'parts: C is no export']);
  });
  it('reads every relative specifier, a literal import() too, and skips bare names', () => {
    const code = "import React from 'react';\nimport { a } from \"./a.js\";\nexport { b } from '../b.js';\nimport './c.js';\nconst d = () => import('./d.js');";
    expect(specifiers(code)).toEqual(['./a.js', '../b.js', './c.js', './d.js']);
  });
  it('the static closure follows import and export from, not import()', () => {
    expect(staticImports("import { a } from './a.js';export { b } from \"./b.js\";import 'react';const l = () => import('./lazy.js');")).toEqual(['./a.js', './b.js']);
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'esm-parts-'));
    fs.mkdirSync(path.join(dir, 'chunks'));
    fs.writeFileSync(path.join(dir, 'E.js'), "export { E } from './chunks/e.js';\n");
    fs.writeFileSync(path.join(dir, 'chunks', 'e.js'), "import { s } from './s.js';\nexport const E = s;\nconst l = () => import('./lazy.js');\n");
    fs.writeFileSync(path.join(dir, 'chunks', 's.js'), 'export const s = 1;\n');
    expect(closure(dir, 'E.js', new Map())).toEqual(['E.js', 'chunks/e.js', 'chunks/s.js']);
  });
  it('lists the public exports with their modules, renamed ones by their public name', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'esm-index-'));
    const f = path.join(dir, 'index.ts');
    fs.writeFileSync(f, "export { Button } from './components/Button/Button';\nexport { PLACEMENTS as FLOATING_PLACEMENTS, Floating } from './utils/floating.ts';\n");
    expect(exportsOf(f)).toEqual([
      { name: 'Button', local: 'Button', mod: 'components/Button/Button' },
      { name: 'FLOATING_PLACEMENTS', local: 'PLACEMENTS', mod: 'utils/floating' },
      { name: 'Floating', local: 'Floating', mod: 'utils/floating' },
    ]);
  });
});
