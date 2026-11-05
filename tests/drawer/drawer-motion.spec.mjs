import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// #100: a Drawer slides in from its own edge in both directions; a Dialog keeps its pop-in.
const css = pathToFileURL(path.resolve(import.meta.dirname, '../../platform/platform.css')).href;
const cases = [
  ['ltr', 'plx-dialog plx-drawer', 'motion-slide-in-right'],
  ['ltr', 'plx-dialog plx-drawer plx-drawer--start', 'motion-slide-in-left'],
  ['rtl', 'plx-dialog plx-drawer', 'motion-slide-in-left'],
  ['rtl', 'plx-dialog plx-drawer plx-drawer--start', 'motion-slide-in-right'],
  ['ltr', 'plx-dialog', 'motion-pop-in'],
  ['rtl', 'plx-dialog', 'motion-pop-in'],
];
for (const [dir, cls, name] of cases) {
  test(`${cls} (${dir}) animates as ${name}`, async ({ page }) => {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'drawer-')), 'page.html');
    fs.writeFileSync(file, `<!doctype html><html dir="${dir}"><head><link rel="stylesheet" href="${css}"></head><body><div id="x" class="${cls}"></div></body></html>`);
    await page.goto(pathToFileURL(file).href);
    await page.waitForLoadState('networkidle');
    expect(await page.$eval('#x', (e) => getComputedStyle(e).animationName)).toBe(name);
  });
}
