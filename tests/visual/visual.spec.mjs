import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { specimens } from './specimens.mjs';

const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;
const extra = new Set((process.env.VISUAL_EXTRA || '').split(',').filter(Boolean));

// every specimen in light and dark at standard density; RTL and compact only for the components named in VISUAL_EXTRA
const variants = (name) => [
  { mode: 'light', dir: 'ltr', density: 'standard' },
  { mode: 'dark', dir: 'ltr', density: 'standard' },
  ...((extra.has(name) || extra.has('all')) ? [{ mode: 'light', dir: 'rtl', density: 'standard' }, { mode: 'light', dir: 'ltr', density: 'compact' }] : []),
];

for (const [name, html] of Object.entries(specimens)) {
  for (const v of variants(name)) {
    const id = [name, v.mode, v.dir === 'rtl' ? 'rtl' : '', v.density === 'compact' ? 'compact' : ''].filter(Boolean).join('-');
    test(id, async ({ page }) => {
      const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'visual-')), 'page.html');
      fs.writeFileSync(file, `<!doctype html><html lang="${v.dir === 'rtl' ? 'ar' : 'en'}" dir="${v.dir}" data-plx-theme="default" data-plx-mode="${v.mode}" data-plx-density="${v.density}"><head><meta charset="utf-8"><link rel="stylesheet" href="${css}"></head><body style="padding:16px">${html}</body></html>`);
      await page.goto(pathToFileURL(file).href);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`${id}.png`);
    });
  }
}
