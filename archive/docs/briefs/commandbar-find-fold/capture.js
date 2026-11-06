/* #274 pictures: the command bar in a 200px pane, before (the find side past the bar) and after (one Find and view
   button; its popover open), plus a wide panel (the bar as before). Usage: node docs/briefs/commandbar-find-fold/capture.js <before root> <after root> */
const path = require('path'), fs = require('fs');
const [beforeRoot, afterRoot] = process.argv.slice(2);
const shoot = async (root, port, jobs) => {
  const stage = path.join(path.resolve(root), 'docs/briefs/commandbar-find-fold');
  if (path.resolve(stage) !== path.resolve(__dirname)) { fs.mkdirSync(stage, { recursive: true }); fs.copyFileSync(path.join(__dirname, 'stage.html'), path.join(stage, 'stage.html')); fs.copyFileSync(path.join(__dirname, '..', 'review.css'), path.join(stage, '..', 'review.css')); }
  const { serve, launch } = require(path.join(path.resolve(root), 'tests', 'lib.js'));
  const server = await serve(port); let browser;
  try {
    browser = await launch(); const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 500, deviceScaleFactor: 2 });
    for (const job of jobs) {
      await page.goto('http://localhost:' + port + '/Plenix/docs/briefs/commandbar-find-fold/stage.html' + job.q, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.plx-command-bar'); await new Promise((r) => setTimeout(r, 800));
      if (job.open) { await page.click('.plx-command-bar__find button'); await new Promise((r) => setTimeout(r, 600)); }
      const clip = await page.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); const d = document.querySelector('[role=dialog]'); const b = d ? d.getBoundingClientRect().bottom : 0; return { x: r.left, y: r.top, width: Math.max(r.width, 480), height: Math.max(r.height, b - r.top + 12) }; });
      await page.screenshot({ path: path.join(__dirname, job.name + '.png'), clip });
    }
  } finally { if (browser) await browser.close(); server.close(); }
};
(async () => {
  await shoot(beforeRoot, 9621, [{ name: 'before-tiny', q: '?w=tiny&find=more' }]);
  await shoot(afterRoot, 9622, [{ name: 'after-tiny', q: '?w=tiny&find=more' }, { name: 'after-tiny-open', q: '?w=tiny&find=more', open: true }, { name: 'after-wide', q: '?find=more' }]);
  console.log('captured');
})().catch((e) => { console.error(e); process.exit(1); });
