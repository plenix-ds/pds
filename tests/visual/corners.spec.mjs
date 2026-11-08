import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { specimens } from './specimens.mjs';

// Issue 1031: the Panel and Card header glow must not paint over the rounded top corners (the border has to stay visible along the curve).
// Two proofs per scale (1x, 1.5x, 2x) and mode (light, dark), on the desktop project only:
//   - computed: the header's top radii equal the container's radius minus its border width (the header sits inside the border, so its curve follows it);
//   - picture: the top-left corner of each container at that scale (baseline written from the fixed build, so it shows the border along the curve).
const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;
const SCALES = [1, 1.5, 2];

for (const scale of SCALES) {
  for (const mode of ['light', 'dark']) {
    const id = `panel-header-corners-${scale === 1.5 ? '1_5x' : scale + 'x'}-${mode}`;
    test.describe(id, () => {
      test.use({ deviceScaleFactor: scale });
      test(id, async ({ page }, info) => {
        test.skip(info.project.name !== 'desktop-1920x1080', 'one screen size is enough for corners');
        const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'corners-')), 'page.html');
        fs.writeFileSync(file, `<!doctype html><html lang="en" dir="ltr" data-plx-theme="default" data-plx-mode="${mode}" data-plx-density="standard"><head><meta charset="utf-8"><link rel="stylesheet" href="${css}"></head><body style="padding:16px">${specimens['panel-header-corners']}</body></html>`);
        await page.goto(pathToFileURL(file).href);
        await page.waitForLoadState('networkidle');
        const radii = await page.evaluate(() => [...document.querySelectorAll('.plx-panel__header')].map((hd) => {
          const box = hd.closest('.plx-panel'), cs = getComputedStyle(hd), bs = getComputedStyle(box);
          return { start: parseFloat(cs.borderStartStartRadius), end: parseFloat(cs.borderStartEndRadius), want: parseFloat(bs.borderStartStartRadius) - parseFloat(bs.borderTopWidth) };
        }));
        expect(radii.length).toBeGreaterThan(0);
        for (const r of radii) { expect(r.start).toBe(r.want); expect(r.end).toBe(r.want); }
        const box = await page.locator('.plx-panel').first().boundingBox();
        await expect(page).toHaveScreenshot(`${id}.png`, { clip: { x: box.x - 4, y: box.y - 4, width: 48, height: 48 } });
      });
    });
  }
}
