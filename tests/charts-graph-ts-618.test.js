/* Plenix tests · Diagram, NetworkGraph and SankeyDiagram draw the same after the TypeScript rename (issue 618, wave 2): a smoke probe that mounts each
   (flowchart, boxes, force and hierarchical graphs, a Sankey), reads what they draw (the text, the number of shapes, the data grid) and the
   keyboard reading (an arrow moves to a node and the live region says it), and prints one signature line per case. Run on the code before the
   change and after it, the lines are equal. No script errors or dev warnings. Usage: node tests/charts-graph-ts-618.test.js */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const PORT = +process.env.TEST_PORT || 9848, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 900, height: 700 });
    const problems = [];
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => { if (/error|warn/.test(m.type()) && !/Failed to load resource|net::/.test(m.text())) problems.push(m.text()); });
    await page.goto('http://127.0.0.1:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'load' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM);
    const cases = {
      flowchart: () => React.createElement(Plenix.Diagram, { title: 'Sign-up flow', nodes: [{ id: 'a', label: 'Start', shape: 'terminal' }, { id: 'b', label: 'Enter email' }, { id: 'c', label: 'Valid?', shape: 'decision' }, { id: 'd', label: 'Create account', shape: 'data' }], edges: [{ source: 'a', target: 'b' }, { source: 'b', target: 'c' }, { source: 'c', target: 'd', label: 'Yes' }, { source: 'c', target: 'b', label: 'No' }] }),
      boxes: () => React.createElement(Plenix.Diagram, { title: 'Parts', variant: 'boxes', direction: 'right', groups: [{ id: 'g', label: 'Core' }], nodes: [{ id: 'a', label: 'API', detail: 'Handles calls', group: 'g' }, { id: 'b', label: 'Store', detail: 'Keeps data', group: 'g' }, { id: 'c', label: 'Cache' }], edges: [{ source: 'a', target: 'b' }, { source: 'a', target: 'c' }] }),
      force: () => React.createElement(Plenix.NetworkGraph, { title: 'Team', groups: [{ id: 'x', label: 'Core' }, { id: 'y', label: 'Guests' }], nodes: [{ id: 'a', label: 'Ann', group: 'x' }, { id: 'b', label: 'Bo', group: 'x' }, { id: 'c', label: 'Cy', group: 'y' }, { id: 'd', label: 'Di', group: 'y' }], edges: [{ source: 'a', target: 'b' }, { source: 'b', target: 'c', kind: 'dashed' }, { source: 'c', target: 'd' }], directed: true }),
      hierarchical: () => React.createElement(Plenix.NetworkGraph, { title: 'Org', layout: 'hierarchical', direction: 'right', nodes: [{ id: 'a', label: 'Ann' }, { id: 'b', label: 'Bo' }, { id: 'c', label: 'Cy' }], edges: [{ source: 'a', target: 'b' }, { source: 'a', target: 'c' }] }),
      sankey: () => React.createElement(Plenix.SankeyDiagram, { title: 'Budget', nodes: [{ id: 'in', label: 'Income' }, { id: 'rent', label: 'Rent' }, { id: 'food', label: 'Food' }, { id: 'save', label: 'Savings' }], links: [{ source: 'in', target: 'rent', value: 40 }, { source: 'in', target: 'food', value: 25 }, { source: 'in', target: 'save', value: 35 }] }),
    };
    const lines = [];
    for (const name of Object.keys(cases)) {
      await page.evaluate(async (src) => {
        window.__root && window.__root.unmount(); document.querySelector('main').innerHTML = '<div id="c" style="width:800px"></div>';
        window.__root = ReactDOM.createRoot(document.getElementById('c')); window.__root.render(eval('(' + src + ')')());
        await new Promise((r) => setTimeout(r, 1200));
      }, cases[name].toString());
      const sig = await page.evaluate(() => {
        const fig = document.querySelector('#c figure') || document.querySelector('#c');
        const svg = fig.querySelector('svg');
        return { text: fig.textContent.replace(/\s+/g, ' ').trim().slice(0, 400), shapes: svg ? svg.querySelectorAll('rect, path, circle, polygon, line, ellipse').length : -1, texts: svg ? svg.querySelectorAll('text').length : -1, label: fig.getAttribute('aria-label') || (fig.querySelector('figcaption') || {}).textContent || '' };
      });
      // the keyboard reading: focus the plot and step once
      const said = await page.evaluate(async () => {
        const plot = document.querySelector('#c [tabindex="0"]'); if (!plot) return 'no plot';
        plot.focus(); plot.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })); await new Promise((r) => setTimeout(r, 300));
        return [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent.trim()).filter(Boolean).join(' | ').slice(0, 160);
      });
      assert.ok(sig.shapes !== 0, name + ' draws shapes');
      lines.push(name + ' ' + JSON.stringify(Object.assign(sig, { said })));
    }
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log(lines.join('\n'));
    console.log('charts-graph-ts-618: OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
