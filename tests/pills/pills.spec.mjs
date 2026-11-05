import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// Check 11 (plan §7): pills in one table row measure the same height. Bounding boxes, not CSS values.
const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;

const badge = (v, text, icon = '') => `<span class="plx-badge plx-badge--${v}">${icon}${text}</span>`;
const row = (cells) => `<table><tbody><tr>${cells.map((c) => `<td>${c}</td>`).join('')}</tr></tbody></table>`;

async function heights(page, html, theme = 'light', dir = 'ltr') {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pills-')), 'page.html');
  fs.writeFileSync(file, `<!doctype html><html dir="${dir}" data-plx-theme="default" data-plx-mode="${theme}"><head><link rel="stylesheet" href="${css}"></head><body>${html}</body></html>`);
  await page.goto(pathToFileURL(file).href); // about:blank cannot load a file:// stylesheet
  await page.waitForLoadState('networkidle');
  return page.$$eval('.plx-badge, .plx-data-pill', (els) => els.map((e) => Math.round(e.getBoundingClientRect().height * 100) / 100));
}

const VARIANTS = ['neutral', 'success', 'active', 'waiting', 'action-required', 'negative'];

for (const theme of ['light', 'dark']) {
  for (const dir of ['ltr', 'rtl']) {
    test(`all status badges in a row are one height (${theme}, ${dir})`, async ({ page }) => {
      const h = await heights(page, row(VARIANTS.map((v) => badge(v, v))), theme, dir);
      expect(h).toHaveLength(VARIANTS.length);
      expect(h[0]).toBeGreaterThan(0);
      expect(new Set(h).size).toBe(1);
    });
  }
}

test('long text and an icon do not change the height of a badge in the row', async ({ page }) => {
  const icon = '<svg width="12" height="12" aria-hidden="true"></svg>';
  const h = await heights(page, row([badge('success', 'Ok', icon), badge('negative', 'Payment overdue by many days'), badge('waiting', 'Hold')]));
  expect(new Set(h).size).toBe(1);
});

test('a data pill in the row matches the data pill beside it', async ({ page }) => {
  const dp = (t) => `<span class="plx-data-pill plx-data-pill--soft plx-data-pill--md" data-plx-category="${t}">Value</span>`;
  const h = await heights(page, row([dp('blue'), dp('green'), dp('gray')]));
  expect(h).toHaveLength(3);
  expect(new Set(h).size).toBe(1);
});

test('the measurement sees the stylesheet: a count badge (sm) is shorter than a status badge', async ({ page }) => {
  const h = await heights(page, row([badge('neutral', 'Status'), `<span class="plx-badge plx-badge--sm plx-badge--neutral">3</span>`]));
  expect(h[1]).toBeLessThan(h[0]);
});
