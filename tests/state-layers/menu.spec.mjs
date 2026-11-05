import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

// #109 (D-0037, ADR 0004): menu commands draw the same state layer: a see-through layer, no solid hover fill; disabled gets none.
const root = path.resolve(import.meta.dirname, '../..');
const css = pathToFileURL(path.join(root, 'platform/platform.css')).href;
const STATES = { rest: '', hover: 'is-hover', focus: 'is-focused', pressed: 'is-pointer-down' };

for (const mode of ['light', 'dark']) {
  test(`menu items draw the state layer (${mode})`, async ({ page }) => {
    let html = '<div class="plx-menu" role="menu">';
    for (const kind of ['', ' plx-menu__item--danger']) for (const [s, c] of Object.entries(STATES)) html += `<button role="menuitem" data-id="${kind.trim() || 'plain'}|${s}" class="plx-menu__item${kind} ${c}"><span class="plx-menu__label">Rename</span></button>`;
    html += '<button role="menuitem" aria-disabled="true" data-id="disabled|hover" class="plx-menu__item is-hover"><span class="plx-menu__label">Rename</span></button></div>';
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'menu-')), 'p.html');
    fs.writeFileSync(file, `<!doctype html><html data-plx-theme="default" data-plx-mode="${mode}"><head><link rel="stylesheet" href="${css}"></head><body>${html}</body></html>`);
    await page.goto(pathToFileURL(file).href);
    await page.waitForLoadState('networkidle');
    const m = await page.$$eval('[data-id]', (bs) => Object.fromEntries(bs.map((b) => { const s = getComputedStyle(b); return [b.dataset.id, { bg: s.backgroundColor, img: s.backgroundImage }]; })));
    for (const k of ['plain', 'plx-menu__item--danger']) {
      for (const s of ['hover', 'focus', 'pressed']) {
        expect(m[`${k}|${s}`].bg, `${k} ${s}: no solid fill`).toBe('rgba(0, 0, 0, 0)');
        expect(m[`${k}|${s}`].img, `${k} ${s}: a layer`).toContain('linear-gradient');
      }
      expect(m[`${k}|pressed`].img, `${k}: pressed stronger than hover`).not.toBe(m[`${k}|hover`].img);
      expect(m[`${k}|focus`].img, `${k}: focus equals pressed (10%)`).toBe(m[`${k}|pressed`].img);
      expect(m[`${k}|rest`].img, `${k}: no layer at rest`).toBe('none');
    }
    expect(m['disabled|hover'].img, 'disabled: no layer').toBe('none');
  });
}
