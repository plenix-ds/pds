import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// #122 (D-0066 surface-title role): a dialog's and a sheet's title draw the whole surface-title role: heading family, 15px, bold, line height 1.5,
// letter and word spacing normal. The record of what they drew before the role is in docs/pds1/slices/122-text-roles/before.json.
const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;
const PARTS = { 'plx-dialog__title': 'dialog', 'plx-sheet__title': 'sheet' };

for (const mode of ['light', 'dark']) {
  for (const dir of ['ltr', 'rtl']) {
    test(`the dialog and sheet titles draw the surface-title role (${mode}, ${dir})`, async ({ page }) => {
      const html = Object.keys(PARTS).map((c) => `<div class="plx-${PARTS[c]}"><div class="plx-${PARTS[c]}__header"><h2 class="${c}" data-part="${c}">Edit the parish council meeting notes</h2></div></div>`).join('');
      const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'st-')), 'p.html');
      fs.writeFileSync(file, `<!doctype html><html dir="${dir}" lang="${dir === 'rtl' ? 'ar' : 'en'}" data-plx-theme="default" data-plx-mode="${mode}"><head><link rel="stylesheet" href="${css}"></head><body>${html}</body></html>`);
      await page.goto(pathToFileURL(file).href);
      await page.waitForLoadState('networkidle');
      const got = await page.$$eval('[data-part]', (els) => els.map((e) => { const s = getComputedStyle(e); return { part: e.dataset.part, family: s.fontFamily.split(',')[0].replace(/"/g, '').trim(), size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, letter: s.letterSpacing, word: s.wordSpacing }; }));
      for (const g of got) {
        expect(g.size, g.part + ' size').toBe('15px');
        expect(g.weight, g.part + ' weight').toBe('700');
        expect(g.lineHeight, g.part + ' line height (1.5 of 15px)').toBe('22.5px');
        expect(g.letter, g.part + ' letter spacing').toBe('normal');
        expect(g.word, g.part + ' word spacing').toBe('0px');
      }
    });
  }
}
