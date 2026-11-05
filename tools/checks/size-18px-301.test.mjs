// #301: no hand-written 18px step in a component stylesheet; size-18px is deprecated (ADR 0012).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('#301 no 18px step by hand', () => {
  for (const f of ['platform/components/DataGrid/data-grid.css', 'platform/components/Resizable/resizable.css']) {
    it(f + ' has no 18px rule and does not read size-18px', () => {
      const css = fs.readFileSync(f, 'utf8');
      expect(css).not.toMatch(/\+?18px"/);
      expect(css).not.toContain('--plx-ref-size-18px');
    });
  }
});
