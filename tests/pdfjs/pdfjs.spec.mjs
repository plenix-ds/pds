import { test, expect } from '@playwright/test';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

// #86: the vendored PDF.js is the current 6.x, opens the DocumentViewer's sample PDF offline and draws it.
const root = path.resolve(import.meta.dirname, '../..');
const WANT = process.env.PDFJS_VERSION || '6.5.438';
let server, base;
test.beforeAll(async () => {
  server = http.createServer((req, res) => {
    const f = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    const type = f.endsWith('.js') ? 'text/javascript' : f.endsWith('.pdf') ? 'application/pdf' : 'text/html';
    res.writeHead(200, { 'content-type': type }); res.end(fs.readFileSync(f));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/`;
});
test.afterAll(() => server.close());

test(`PDF.js ${WANT} opens and draws the sample PDF from the vendor folder`, async ({ page }) => {
  const external = [];
  page.on('request', (r) => { if (!r.url().startsWith(base)) external.push(r.url()); });
  await page.goto(base + 'platform/vendor/pdfjs/README.md'); // any same-origin page
  const out = await page.evaluate(async (b) => {
    const m = await import(b + 'platform/vendor/pdfjs/pdf.js');
    m.GlobalWorkerOptions.workerSrc = b + 'platform/vendor/pdfjs/pdf.worker.js';
    const doc = await m.getDocument({ url: b + 'platform/components/DocumentViewer/fixtures/sample.pdf' }).promise;
    const p = await doc.getPage(1), vp = p.getViewport({ scale: 1 });
    const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
    await p.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let dark = 0; for (let i = 0; i < d.length; i += 4) if (d[i] < 128 && d[i + 3] > 0) dark++;
    const text = (await p.getTextContent()).items.length;
    return { version: m.version, pages: doc.numPages, dark, text };
  }, base);
  expect(out.version).toBe(WANT);
  expect(out.pages).toBeGreaterThan(0);
  expect(out.dark).toBeGreaterThan(0);
  expect(out.text).toBeGreaterThan(0);
  expect(external).toEqual([]);
});
