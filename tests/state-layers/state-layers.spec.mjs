import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// #109 (D-0037, ADR 0004): Button state layers. Hover, pressed and focus draw one see-through layer over the variant's own fill
// (8%, 10%, 10%); the fill itself does not change; disabled and loading get no layer.
const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;
const VARIANTS = ['secondary', 'primary', 'tertiary', 'ghost', 'danger', 'danger-secondary'];
const STATES = { rest: '', hover: 'is-hover', pressed: 'is-pointer-down', focus: 'is-focus-visible' };

for (const mode of ['light', 'dark']) {
  test(`buttons draw the state layer over their own fill (${mode})`, async ({ page }) => {
    let html = '';
    for (const v of VARIANTS) for (const [s, c] of Object.entries(STATES)) html += `<button data-id="${v}|${s}" class="plx-button plx-button--${v} ${c}"><span class="plx-button__label">Save</span></button> `;
    for (const v of VARIANTS) html += `<button data-id="${v}|disabled" disabled class="plx-button plx-button--${v}"><span class="plx-button__label">Save</span></button> <button data-id="${v}|loading" class="plx-button plx-button--${v} is-loading"><span class="plx-button__label">Save</span></button> `;
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'layer-')), 'p.html');
    fs.writeFileSync(file, `<!doctype html><html data-plx-theme="default" data-plx-mode="${mode}"><head><link rel="stylesheet" href="${css}"></head><body>${html}</body></html>`);
    await page.goto(pathToFileURL(file).href);
    await page.waitForLoadState('networkidle');
    const m = await page.$$eval('button[data-id]', (bs) => Object.fromEntries(bs.map((b) => { const s = getComputedStyle(b); return [b.dataset.id, { bg: s.backgroundColor, img: s.backgroundImage }]; })));
    const first = (img) => img.split(/\),\s*(?=[a-z-]+-gradient)/)[0];
    for (const v of VARIANTS) {
      for (const s of ['hover', 'pressed', 'focus']) {
        expect(m[`${v}|${s}`].bg, `${v} ${s}: the fill is the rest fill`).toBe(m[`${v}|rest`].bg);
        expect(first(m[`${v}|${s}`].img), `${v} ${s}: a layer is drawn first`).toContain('linear-gradient');
      }
      expect(first(m[`${v}|pressed`].img), `${v}: pressed is a stronger layer than hover`).not.toBe(first(m[`${v}|hover`].img));
      expect(first(m[`${v}|focus`].img), `${v}: focus equals pressed (10%)`).toBe(first(m[`${v}|pressed`].img));
      expect(m[`${v}|rest`].img, `${v}: no layer at rest`).not.toMatch(/linear-gradient\(color/);
      for (const s of ['disabled', 'loading']) expect(first(m[`${v}|${s}`].img), `${v} ${s}: no layer`).not.toMatch(/linear-gradient/);
    }
  });
}
