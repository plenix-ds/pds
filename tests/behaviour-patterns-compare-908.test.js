/* Plenix tests · baseline behaviour (plan 7e) of ComparisonView, DuplicateAction, FeatureCard and the image editor's steps (issue 908).
   Summary (the browser, left to right and right to left, dev React, no console warnings):
     ComparisonView: side by side by default, a heading per item; a differing value carries a Changed badge (a word, not color only) and the count says how many differ; Show only
       differences hides matching rows; modes switch between columns, a table and the slider (onModeChange once per switch); the slider is a slider; long values do not overflow
     DuplicateAction: the copy variant duplicates in one press as "Copy of <name>" and numbers it when taken; the rename variant opens a dialog with the field focused; an empty or taken
       name keeps it open with the message and calls nothing; a free name calls onDuplicate(name, chosen options) once; Cancel and Escape close it
     FeatureCard: the title is the heading; with href the title is one link, with onOpen one button that runs once, with neither nothing is interactive; one Tab stop; a decorative
       picture has empty alt; a 3x longer title and description stay in the card
     ImageEditor: the exported IMAGE_EDITOR_STEPS (generated) has the zoom limits and each slider with a key, a label and min below max
   Usage: node tests/behaviour-patterns-compare-908.test.js   -> BEHAVIOUR_PATTERNS_COMPARE_908_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
(async () => {
  const PORT = +process.env.TEST_PORT || 9920, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); await page.setViewport({ width: 1100, height: 900 });
      page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      await page.evaluate((dir) => { document.documentElement.setAttribute('dir', dir); window.__log = [];
        window.__mount = async (node, width) => { window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="inline-size:' + (width || 900) + 'px"></div>';
          window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(React.createElement(Plenix.ToastProvider, null, node)); await new Promise((r) => setTimeout(r, 600)); }; }, dir);
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const pressText = (name) => page.evaluate((name) => { const b = [...document.querySelectorAll('button, [role="radio"], [role="tab"]')].find((x) => (x.textContent.trim() === name || x.getAttribute('aria-label') === name) && !x.disabled); if (b) b.click(); return !!b; }, name);

      // ComparisonView
      const px = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
      const items = [{ id: 'v2', title: 'Version 2', meta: '2 Oct 2026', image: { src: px, alt: 'Banner v2' }, values: { format: 'JPEG', size: '2.4 MB', width: '1920 px' } }, { id: 'v3', title: 'Version 3', meta: '9 Oct 2026', image: { src: px, alt: 'Banner v3' }, values: { format: 'PNG', size: '3.1 MB', width: '1920 px' } }];
      const attributes = [{ key: 'format', label: 'Format' }, { key: 'size', label: 'Size', kind: 'data' }, { key: 'width', label: 'Width', kind: 'data' }];
      await page.evaluate(async (items, attributes) => { const h = React.createElement, P = Plenix; window.__log = [];
        await window.__mount(h(P.ComparisonView, { label: 'Compare versions', items, attributes, modes: ['columns', 'matrix', 'slider'], onModeChange: (m) => window.__log.push(m) })); }, items, attributes);
      let t = await page.evaluate(() => document.querySelector('#c').textContent);
      assert.ok(/Version 2/.test(t) && /Version 3/.test(t), T + 'each item has its title'); assert.ok(/Changed/.test(t), T + 'a differing value carries the word Changed');
      assert.ok(/2 differences/.test(t), T + 'the count says how many attributes differ, got ' + t.slice(0, 200));
      assert.ok(await page.$('[aria-label="Compare versions"], [role="group"][aria-label]'), T + 'the view is named');
      await pressText('Table'); await wait(400); assert.ok(await page.$('#c [role="table"], #c table, #c [role="grid"]'), T + 'the table mode draws a table'); assert.deepEqual(await page.evaluate(() => window.__log), ['matrix'], T + 'onModeChange runs once with the mode');
      await pressText('Slider'); await wait(500); assert.ok(await page.$('#c [role="slider"], #c input[type="range"]'), T + 'the slider mode has a slider'); assert.deepEqual(await page.evaluate(() => window.__log), ['matrix', 'slider'], T + 'one call per switch');
      await page.evaluate(async (items, attributes) => { const h = React.createElement, P = Plenix;
        await window.__mount(h(P.ComparisonView, { label: 'Compare', items, attributes, defaultOnlyDifferences: true })); }, items, attributes);
      t = await page.evaluate(() => document.querySelector('#c').textContent); assert.ok(!/1920 px/.test(t), T + 'Show only differences hides the matching row');
      await page.evaluate(async (items, attributes) => { const h = React.createElement, P = Plenix; const long = 'A value that is three times longer than the usual English text so that it must wrap inside its pane and not push it wider ';
        await window.__mount(h(P.ComparisonView, { label: 'Long', items: items.map((i) => Object.assign({}, i, { values: { format: long + i.id, size: long, width: long } })), attributes })); }, items, attributes);
      assert.ok(await page.evaluate(() => document.querySelector('#c').scrollWidth <= document.querySelector('#c').clientWidth + 1), T + 'long values do not overflow the view');

      // DuplicateAction
      const da = (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__log = [];
        await window.__mount(h(P.DuplicateAction, Object.assign({ name: 'Easter banner', noun: 'asset', onDuplicate: (n, chosen) => window.__log.push('dup:' + n + ':' + JSON.stringify(chosen || [])) }, props))); }, props);
      await da({}); await pressText('Duplicate'); await wait(300); assert.deepEqual(await page.evaluate(() => window.__log), ['dup:Copy of Easter banner:[]'], T + 'the copy variant duplicates once, named Copy of ...');
      await da({ taken: ['Copy of Easter banner'] }); await pressText('Duplicate'); await wait(300); assert.deepEqual(await page.evaluate(() => window.__log), ['dup:Copy of Easter banner (2):[]'], T + 'a taken name is numbered');
      await da({ variant: 'rename', taken: ['Advent'], source: '12 assets', options: [{ id: 'members', label: 'Members' }] }); await pressText('Duplicate'); await wait(500);
      assert.ok(await page.$('[role="dialog"]'), T + 'rename opens a dialog'); assert.equal(await page.evaluate(() => document.activeElement.tagName), 'INPUT', T + 'the field has focus');
      await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.press('Backspace');
      await page.evaluate(() => { [...document.querySelectorAll('[role="dialog"] button')].find((b) => b.textContent.trim() === 'Duplicate').click(); }); await wait(300);
      assert.ok(/Enter a name/.test(await page.$eval('[role="dialog"]', (d) => d.textContent)), T + 'an empty name says so'); assert.deepEqual(await page.evaluate(() => window.__log), [], T + 'an empty name calls nothing');
      await page.keyboard.type('Advent'); await page.evaluate(() => { [...document.querySelectorAll('[role="dialog"] button')].find((b) => b.textContent.trim() === 'Duplicate').click(); }); await wait(300);
      assert.ok(/already exists/.test(await page.$eval('[role="dialog"]', (d) => d.textContent)), T + 'a taken name is refused'); assert.deepEqual(await page.evaluate(() => window.__log), [], T + 'a taken name calls nothing');
      await page.click('[role="dialog"] input[type="checkbox"]'); await page.focus('[role="dialog"] input[type="text"], [role="dialog"] input:not([type])');
      await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control'); await page.keyboard.type('Lent');
      await page.evaluate(() => { [...document.querySelectorAll('[role="dialog"] button')].find((b) => b.textContent.trim() === 'Duplicate').click(); }); await wait(400);
      assert.deepEqual(await page.evaluate(() => window.__log), ['dup:Lent:["members"]'], T + 'a free name calls onDuplicate once with the chosen options');
      await da({ variant: 'rename' }); await pressText('Duplicate'); await wait(400); await page.keyboard.press('Escape'); await wait(400); assert.equal(await page.$('[role="dialog"]'), null, T + 'Escape closes the rename dialog');

      // FeatureCard
      const fc = (props) => page.evaluate(async (props) => { const h = React.createElement, P = Plenix; window.__log = [];
        await window.__mount(h(P.FeatureCard, Object.assign({ title: 'Smart tags', description: 'Tags your pictures as they upload.' }, props, props.onOpen ? { onOpen: () => window.__log.push('open') } : {})), 320);
        const card = document.querySelector('#c article'); return { heading: (card.querySelector('h1,h2,h3,h4,h5,h6') || {}).tagName, tabs: card.querySelectorAll('a[href], button').length, link: !!card.querySelector('a[href]'), button: !!card.querySelector('button'), imgAlt: (card.querySelector('img') || {}).alt, over: card.scrollWidth > card.clientWidth + 1 }; }, props);
      let f = await fc({ href: '#/tags' }); assert.equal(f.heading, 'H3', T + 'the title is a heading'); assert.ok(f.link && f.tabs === 1, T + 'with href the card is one link');
      f = await fc({ onOpen: true }); assert.ok(f.button && f.tabs === 1, T + 'with onOpen the card is one button'); await page.focus('#c article button'); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); await wait(100);
      assert.deepEqual(await page.evaluate(() => window.__log), ['open', 'open'], T + 'Enter and Space each run onOpen once');
      f = await fc({}); assert.equal(f.tabs, 0, T + 'with neither, nothing is interactive');
      f = await fc({ variant: 'image', image: px, href: '#/b' }); assert.equal(f.imgAlt, '', T + 'a decorative picture has an empty alt');
      f = await fc({ title: 'A feature title that is three times longer than the usual English title for a feature card', description: 'A description that goes on for three times as long as the usual one or two lines of English text, to be sure it wraps.', href: '#/x' }); assert.ok(!f.over, T + 'long text stays in the card');

      // ImageEditor steps
      const steps = await page.evaluate(() => { const s = Plenix.IMAGE_EDITOR_STEPS; return { zoom: s && s.zoom, sliders: s && s.sliders }; });
      assert.ok(steps.zoom && steps.zoom.min < steps.zoom.max && steps.zoom.base > 1, T + 'the zoom limits are ordered'); assert.ok(steps.sliders.length >= 3 && steps.sliders.every((x) => x.key && x.label && x.min < x.max), T + 'every slider has a key, a label and a range');
      await page.close();
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | ').slice(0, 400));
    console.log('BEHAVIOUR_PATTERNS_COMPARE_908_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
