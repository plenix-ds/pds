/* Plenix tests · DocumentViewer data numbers (issue 1): the page counter and the thumbnail numbers use Text variant="data"
   (the data font), and no stray `kind` attribute lands in the HTML.
   Usage: node tests/document-viewer-data-1.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9639, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const errors = [];
    const page = await browser.newPage(); page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => {
      document.querySelector('main').innerHTML = '<div id="d"></div>';
      const px = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>');
      ReactDOM.createRoot(document.getElementById('d')).render(React.createElement(Plenix.DocumentViewer, { kind: 'images', label: 'Doc', pages: [{ src: px, alt: 'one' }, { src: px, alt: 'two' }] }));
    });
    await page.waitForSelector('#d [role=status]');
    const r = await page.evaluate(() => {
      const counter = document.querySelector('#d [role=status]'), thumb = [...document.querySelectorAll('#d [role=group] span')].find((s) => s.textContent === '1');
      return { counterFont: getComputedStyle(counter).fontFamily, thumbFont: getComputedStyle(thumb).fontFamily, bodyFont: getComputedStyle(document.querySelector('#d')).fontFamily, kindAttr: !!document.querySelector('#d [kind]') };
    });
    assert.match(r.counterFont, /Reddit Mono/i, 'the page counter is in the data font: ' + r.counterFont);
    assert.match(r.thumbFont, /Reddit Mono/i, 'the thumbnail number is in the data font: ' + r.thumbFont);
    assert.equal(r.kindAttr, false, 'no stray kind attribute');
    assert.deepEqual(errors, [], 'no script errors');
    console.log('document-viewer-data-1: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
