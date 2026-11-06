// Plenix · DT-6 faceted QuickFilter counts: the actual hook and controls, including live table data.
const assert = require('assert'), fs = require('fs'), path = require('path');
const { serve, launch } = require('./lib.js');
const ROOT = path.resolve(__dirname, '..');
module.exports = async function facets(page) {
  const esbuild = require('esbuild');
  const bundle = await esbuild.build({ stdin: { contents: "export {useCollectionView} from './platform/hooks/useCollectionView.ts'; export {QuickFilter} from './platform/patterns/QuickFilter/QuickFilter.tsx';", resolveDir: ROOT }, bundle: true, write: false, format: 'iife', globalName: 'FacetTest',
    plugins: [require('./icon-modules.js'), { name: 'browser-peers', setup(build) { build.onResolve({ filter: /^react(-dom)?$/ }, args => ({ path: args.path, namespace: 'peers' })); build.onLoad({ filter: /.*/, namespace: 'peers' }, args => ({ contents: 'module.exports = window.' + (args.path === 'react' ? 'React' : 'ReactDOM') + ';' })); } }] });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  return page.evaluate(async () => {
    const R = React, D = ReactDOM, h = R.createElement, host = document.createElement('div'); document.body.appendChild(host);
    let root = D.createRoot(host), v, checks = 0;
    const check = (ok, text) => { if (!ok) throw new Error(text); checks++; };
    const wait = () => new Promise(r => setTimeout(r, 80));
    const fields = [{ value: 'name', kind: 'text' }, { value: 'color', kind: 'select', get: row => row.shade }, { value: 'status', kind: 'select' }, { value: 'tags', kind: 'multi' }, { value: 'modified', kind: 'date' }, { value: 'score', kind: 'number' }];
    const rows = [{ id: 1, name: 'Alpha', shade: 'red', status: 'open', tags: ['x', 'x', 'y'], modified: '2026-10-15', score: 10 }, { id: 2, name: 'Beta', shade: 'blue', status: 'closed', tags: ['y'], modified: '2026-10-10', score: 20 }, { id: 3, name: 'Alpine', shade: 'blue', status: 'open', tags: ['x'], modified: '2026-09-01', score: 30 }, { id: 4, name: 'Gamma', shade: 'red', status: 'open', tags: [], modified: '2026-10-14', score: 40 }];
    const options = { data: rows, text: row => row.name, today: '2026-10-16', quick: { color: 'list', status: 'list', tags: 'list', modified: 'date' } };
    const Harness = ({ options, display = true, supplied }) => { v = FacetTest.useCollectionView(fields, options); return display ? h(FacetTest.QuickFilter, Object.assign({ label: 'Color', inline: true, options: supplied || ['red', 'blue', 'green'] }, v.quickProps('color'))) : null; };
    const mount = async (props) => { D.flushSync(() => root.render(h(Harness, props))); await wait(); };
    const change = async fn => { D.flushSync(fn); await wait(); };
    const count = (key, value) => v.quickProps(key).counts.get(value) || 0;
    const labels = () => [...host.querySelectorAll('.plx-find-panel__checklist label')].map(e => [e.querySelector('.plx-category').textContent, e.querySelector('.plx-text--data')?.textContent]);
    try {
      await mount({ options });
      check(count('color', 'red') === 2 && count('color', 'blue') === 2, 'counts use field getters over source rows');
      check(count('tags', 'x') === 2 && count('tags', 'y') === 2, 'repeated values count a record only once');
      check(host.querySelectorAll('.plx-text--data').length === 3 && [...host.querySelectorAll('.plx-text--data')].at(-1).textContent === '0', 'unmatched options display zero');
      check(fields.every(f => v.groupProps.fields.some(group => group.value === f.value)), 'GroupPanel offers every eligible field, including text, dates, numbers and multi fields');
      await change(() => v.setQuick('color', ['red']));
      check(count('color', 'red') === 2 && count('color', 'blue') === 2, 'a facet excludes only its own quick selection');
      check(count('status', 'open') === 2 && count('status', 'closed') === 0, 'a facet applies the other quick selections');
      await change(() => { v.setQuick('status', ['open']); v.setSearch('AL'); });
      check(count('color', 'red') === 1 && count('color', 'blue') === 1, 'facets apply the existing case-insensitive collection search');
      await change(() => v.setFilter({ join: 'and', items: [{ field: 'score', op: 'gt', value: 20 }] }));
      check(count('color', 'blue') === 1 && count('color', 'red') === 0 && v.count(rows) === 0, 'advanced filters apply while the facet remains independent of its own selection');
      await change(() => { v.setSearch(''); v.setFilter({ join: 'and', items: [] }); });
      check(count('modified', 'any') === 2 && count('modified', '7') === 2, 'date presets count within other active facets');
      await change(() => v.setQuick('modified', { preset: 'custom', from: '2026-10-15', to: '2026-10-15' }));
      check(count('modified', 'any') === 2 && count('color', 'red') === 1 && count('color', 'blue') === 0, 'date facets exclude their own range but other facets apply it');
      await change(() => v.setGroup([{ field: 'tags', hideEmpty: true }]));
      check(count('modified', 'any') === 1, 'hide-empty group filters apply to facet counts');
      await mount({ options, supplied: [{ value: 'red', count: 0 }, { value: 'blue', count: 99 }, { value: 'green', count: null }] });
      const values = [...host.querySelectorAll('.plx-find-panel__checklist label')].map(e => e.querySelector('.plx-text--data')?.textContent);
      check(values[0] === '0' && values[1] === '99' && values[2] === undefined, 'application counts win including explicit zero and intentional null');
      check([...host.querySelectorAll('.plx-text--data')].every(e => getComputedStyle(e).fontFamily.includes('Reddit Mono')), 'count values use the existing technical-value font');
      D.flushSync(() => root.unmount()); root = D.createRoot(host);
      await mount({ options: { quick: { color: 'list' } } });
      check(v.quickProps('color').counts === undefined && !host.querySelector('.plx-text--data'), 'no source preserves existing labels without fabricated zero counts');
      const listeners = new Map(); let data = rows;
      const table = { getData: () => rows.concat(rows), plxData: () => data, on: (event, callback) => listeners.set(event, callback), off: event => listeners.delete(event) };
      await change(() => v.tableProps.onReady(table));
      check(count('color', 'red') === 2 && count('color', 'blue') === 2, 'ready DataGrid supplies canonical rows rather than multi-group display duplicates');
      data = rows.slice(0, 1); await change(() => listeners.get('dataChanged')());
      check(count('color', 'red') === 1 && count('color', 'blue') === 0, 'live dataChanged refreshes facet counts');
      data = rows; await change(() => listeners.get('dataLoaded')());
      check(count('color', 'blue') === 2, 'dataLoaded refreshes facet counts');
      await change(() => v.setSearch('missing'));
      check(count('color', 'red') === 2, 'search without options.text retains the existing no-search semantics');
      await mount({ options: { data: rows.slice(2), quick: { color: 'list' } } });
      check(count('color', 'red') === 1 && count('color', 'blue') === 1, 'explicit options.data takes precedence and updates without a table');
      const nextListeners = new Map(), next = { getData: () => [], on: (event, callback) => nextListeners.set(event, callback), off: event => nextListeners.delete(event) };
      await change(() => v.tableProps.onReady(next));
      check(listeners.size === 0 && nextListeners.size === 2, 'replacing the table detaches old data subscriptions');
      check(!host.querySelector('[style]'), 'count labels add no inline styles');
      D.flushSync(() => root.unmount()); check(nextListeners.size === 0, 'hook unmount detaches table data subscriptions'); host.remove();
      return checks;
    } catch (error) { D.flushSync(() => root.unmount()); host.remove(); throw error; }
  });
};
if (require.main === module) {
  (async () => { const port = +process.env.TEST_PORT || 9158, server = await serve(port); let browser;
    try { browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 }); await page.goto('http://127.0.0.1:' + port + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'networkidle0' });
      const count = await module.exports(page); assert(count >= 20); console.log('COLLECTION_FACETS_OK ' + count);
    } finally { if (browser) await browser.close(); server.close(); }
  })().catch(e => { console.error(e); process.exitCode = 1; });
}
