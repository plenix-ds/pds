import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// #108 case 2: a fact's icon has no box (transparent, no border, no radius) and fills its 40px square.
const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;

for (const mode of ['light', 'dark']) {
  for (const dir of ['ltr', 'rtl']) {
    test(`fact icon has no box and fills its square (${mode}, ${dir})`, async ({ page }) => {
      const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fact-')), 'p.html');
      fs.writeFileSync(file, `<!doctype html><html dir="${dir}" data-plx-theme="default" data-plx-mode="${mode}"><head><link rel="stylesheet" href="${css}"></head><body><dl><div class="plx-entity-header__fact plx-entity-header__fact--icon"><dt class="plx-entity-header__fact-label plx-entity-header__fact-label--tile"><span class="plx-entity-header__fact-icon"><span class="plx-icon plx-icon--add"></span></span><span class="plx-entity-header__fact-name">Presiding</span></dt><dd>Fr. Mark</dd></div></dl></body></html>`);
      await page.goto(pathToFileURL(file).href);
      await page.waitForLoadState('networkidle');
      const r = await page.$eval('.plx-entity-header__fact-icon', (el) => {
        const s = getComputedStyle(el), i = getComputedStyle(el.firstElementChild);
        return { bg: s.backgroundColor, bw: s.borderTopWidth, br: s.borderTopLeftRadius, w: el.getBoundingClientRect().width, iw: parseFloat(i.width) };
      });
      expect(r.bg).toBe('rgba(0, 0, 0, 0)');
      expect(r.bw).toBe('0px');
      expect(r.br).toBe('0px');
      expect(r.w).toBe(40);
      expect(r.iw).toBe(r.w);
    });
  }
}
