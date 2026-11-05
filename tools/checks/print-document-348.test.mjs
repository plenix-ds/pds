// #348: PrintDocument uses logical properties, its own comp tokens, and no print-only rule (G2 findings on #340).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
const css = fs.readFileSync('platform/patterns/PrintDocument/print-document.css', 'utf8');
const print = fs.readFileSync('platform/system/print.css', 'utf8');
describe('#348 PrintDocument', () => {
  it('uses no physical border properties', () => {
    expect(css).not.toMatch(/border-(left|right|top|bottom)-/);
  });
  it('reads its own tokens, not Card\'s', () => {
    expect(css).not.toContain('--plx-comp-card-');
    expect(css).toContain('--plx-comp-print-document-background');
  });
  it('has no @media print block in print.css (the @page at-rule is fine)', () => {
    expect(print).not.toMatch(/@media print/);
    expect(print).toContain('@page plx-document');
  });
});
