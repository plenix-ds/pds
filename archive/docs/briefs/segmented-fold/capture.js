/* #276 pictures: the Show control in a 360px side panel, before (segments past the card) and after (a drop-down list),
   plus the wide panel (segments as before). Usage: node docs/briefs/segmented-fold/capture.js <before root> <after root> */
const path = require('path'), fs = require('fs');
const [beforeRoot, afterRoot] = process.argv.slice(2);
const shoot = async (root, port, jobs) => {
  const stage = path.join(path.resolve(root), 'docs/briefs/segmented-fold');
  if (!fs.existsSync(path.join(stage, 'stage.html'))) { fs.mkdirSync(stage, { recursive: true }); fs.copyFileSync(path.join(__dirname, 'stage.html'), path.join(stage, 'stage.html')); }
  const { serve, launch } = require(path.join(path.resolve(root), 'tests', 'lib.js'));
  const server = await serve(port); let browser;
  try {
    browser = await launch(); const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 500, deviceScaleFactor: 2 });
    for (const job of jobs) {
      await page.goto('http://localhost:' + port + '/Plenix/docs/briefs/segmented-fold/stage.html' + job.q, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#alone > *'); await new Promise((r) => setTimeout(r, 800));
      const clip = await page.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.left, y: r.top, width: Math.max(r.width, 480), height: r.height }; });
      await page.screenshot({ path: path.join(__dirname, job.name + '.png'), clip });
    }
  } finally { if (browser) await browser.close(); server.close(); }
};
(async () => {
  await shoot(beforeRoot, 9621, [{ name: 'before-narrow', q: '?w=narrow' }]);
  await shoot(afterRoot, 9622, [{ name: 'after-narrow', q: '?w=narrow' }, { name: 'after-wide', q: '' }]);
  console.log('captured');
})().catch((e) => { console.error(e); process.exit(1); });
