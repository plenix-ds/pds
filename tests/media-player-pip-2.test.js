/* Plenix tests · MediaPlayer picture in picture (issue 2): the button label follows the real state.
   React 18 never calls onEnterPictureInPicture, so leaving PiP through the browser's own control left the wrong label.
   The probe fires the browser's own events on the <video> and reads the button; no dev warning about the unknown handler.
   Usage: node tests/media-player-pip-2.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
(async () => {
  const PORT = +process.env.TEST_PORT || 9638, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    const page = await browser.newPage();
    page.on('pageerror', (e) => problems.push(e.message)); page.on('console', (m) => { if (/error|warn/.test(m.type())) problems.push(m.text()); });
    await page.evaluateOnNewDocument(() => { Object.defineProperty(document, 'pictureInPictureEnabled', { value: true, configurable: true }); });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    await page.evaluate(() => {
      document.querySelector('main').innerHTML = '<div id="m"></div>';
      ReactDOM.createRoot(document.getElementById('m')).render(React.createElement(Plenix.MediaPlayer, { src: 'data:video/mp4;base64,', label: 'Clip' }));
    });
    await page.waitForSelector('#m video');
    // loadedmetadata enables the button
    await page.evaluate(() => document.querySelector('#m video').dispatchEvent(new Event('loadedmetadata')));
    const label = () => page.evaluate(() => [...document.querySelectorAll('#m button')].map((b) => b.textContent).find((t) => /picture in picture/i.test(t)));
    assert.equal(await label(), 'Picture in picture', 'before: enter label');
    await page.evaluate(() => document.querySelector('#m video').dispatchEvent(new Event('enterpictureinpicture')));
    assert.equal(await label(), 'Exit picture in picture', 'after the browser enters PiP');
    await page.evaluate(() => document.querySelector('#m video').dispatchEvent(new Event('leavepictureinpicture')));
    assert.equal(await label(), 'Picture in picture', 'after the browser leaves PiP (its own control)');
    assert.deepEqual(problems.filter((p) => !/Failed to load resource|net::/.test(p)), [], 'no script errors or dev warnings');
    console.log('media-player-pip-2: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
