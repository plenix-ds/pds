/* Plenix tests · #384: the DocumentViewer decodes JPEG 2000 images in a PDF (PDF.js 6.x decodes them with WebAssembly from a wasm folder).
   Summary: a PDF whose only content is a JPEG 2000 (JPXDecode) image of red and blue squares opens in the DocumentViewer; the viewer fetches the vendored
     wasm/openjpeg.wasm from beside the worker (vendor/pdfjs/wasm/), and the page canvas shows the red and blue squares, not a blank page; nothing leaves the page's origin.
   Proof first: before #384 the wasm folder is not vendored (404) and the page draws blank or fails: those lines fail.
   Usage: node tests/document-viewer-jpx-384.test.js   → DOCUMENT_VIEWER_JPX_384_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9855, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [], asked = [], external = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message)); await page.setViewport({ width: 1000, height: 800 });
    page.on('response', (r) => { if (/\.wasm$/.test(r.url())) asked.push(r.url().split('/').slice(-3).join('/') + ' ' + r.status()); });
    page.on('request', (r) => { if (!r.url().startsWith('http://localhost:' + PORT) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) external.push(r.url()); });
    await page.evaluateOnNewDocument((p) => { window.PlenixVendorBase = 'http://localhost:' + p + '/Plenix/platform/vendor/'; }, PORT);
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => {
      document.querySelector('main').innerHTML = '<div id="d"></div>';
      ReactDOM.createRoot(document.getElementById('d')).render(React.createElement(Plenix.DocumentViewer, { kind: 'pdf', src: '/Plenix/tests/fixtures/jpx-image.pdf', label: 'Scan', thumbnails: false }));
    });
    // the page canvas: red and blue squares drawn from the JPEG 2000 data
    await page.waitForFunction(() => { const c = document.querySelector('#d canvas'); return c && c.width > 0 && !document.querySelector('#d [role=alert]'); }, { timeout: 30000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 2500));
    const px = await page.evaluate(() => {
      const c = document.querySelector('#d canvas'); if (!c) return { canvas: false, text: document.querySelector('#d').textContent.slice(0, 120) };
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let red = 0, blue = 0, white = 0;
      for (let i = 0; i < d.length; i += 4) { if (d[i] > 150 && d[i + 2] < 100) red++; else if (d[i + 2] > 150 && d[i] < 100) blue++; else if (d[i] > 240 && d[i + 1] > 240 && d[i + 2] > 240) white++; }
      return { canvas: true, red, blue, white, total: d.length / 4 };
    });
    assert.ok(px.canvas, 'the viewer drew a page (got ' + JSON.stringify(px) + ')');
    assert.ok(px.red > px.total * 0.2 && px.blue > px.total * 0.2, 'the JPEG 2000 squares show in red and blue, not a blank page: ' + JSON.stringify(px));
    assert.ok(asked.some((a) => /vendor\/pdfjs\/wasm\/openjpeg\.wasm 200|pdfjs\/wasm\/openjpeg\.wasm 200/.test(a) || /wasm\/openjpeg\.wasm 200/.test(a)), 'openjpeg.wasm is fetched from the vendor folder: ' + JSON.stringify(asked));
    assert.deepEqual(external, [], 'nothing leaves the page origin');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('DOCUMENT_VIEWER_JPX_384_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
