/* #326 pictures: number columns in a DataGrid and a Table, before (labels follow the numbers to the right) and after
   (every label at the start; the numbers stay right). Usage: node docs/briefs/header-labels-start/capture.js <before root> <after root> */
const path = require('path'), fs = require('fs');
const [beforeRoot, afterRoot] = process.argv.slice(2);
const shoot = async (root, port, name) => {
  const stage = path.join(path.resolve(root), 'docs/briefs/header-labels-start');
  if (path.resolve(stage) !== path.resolve(__dirname)) { fs.mkdirSync(stage, { recursive: true }); fs.copyFileSync(path.join(__dirname, 'stage.html'), path.join(stage, 'stage.html')); }
  const { serve, launch } = require(path.join(path.resolve(root), 'tests', 'lib.js'));
  const server = await serve(port); let browser;
  try {
    browser = await launch(); const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:' + port + '/Plenix/docs/briefs/header-labels-start/stage.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelectorAll('[role="columnheader"]').length >= 8, { timeout: 60000 }); await new Promise((r) => setTimeout(r, 1200));
    const clip = await page.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
    await page.screenshot({ path: path.join(__dirname, name + '.png'), clip });
  } finally { if (browser) await browser.close(); server.close(); }
};
(async () => { await shoot(beforeRoot, 9631, 'before'); await shoot(afterRoot, 9632, 'after'); console.log('captured'); })().catch((e) => { console.error(e); process.exit(1); });
