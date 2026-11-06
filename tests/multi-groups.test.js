// Plenix · DT-5 public grouped APIs retain canonical identity, selection and source data.
const assert = require('assert'), fs = require('fs'), path = require('path');
const { serve, launch } = require('./lib.js');
const ROOT = path.resolve(__dirname, '..');
module.exports = async function groups(page) {
  const esbuild = require('esbuild');
  const output = await esbuild.build({ stdin: { contents: "export {DataGrid as MultiTable} from './platform/components/DataGrid/DataGrid.tsx'; export {useCollectionView} from './platform/hooks/useCollectionView.ts';", resolveDir: ROOT, loader: 'jsx' }, bundle: true, write: false, format: 'iife', globalName: 'MultiGroupsTest',
    plugins: [require('./icon-modules.js'), { name: 'browser-peers', setup(build) { build.onResolve({ filter: /^react(-dom)?$/ }, args => ({ path: args.path, namespace: 'peers' })); build.onLoad({ filter: /.*/, namespace: 'peers' }, args => ({ contents: 'module.exports = window.' + (args.path === 'react' ? 'React' : 'ReactDOM') + ';' })); } }] });
  await page.addScriptTag({ content: output.outputFiles[0].text });
  return page.evaluate(async () => {
    const R = React, D = ReactDOM, h = R.createElement, host = document.createElement('div'); document.body.appendChild(host);
    const root = D.createRoot(host); let table, checks = 0, notifications = [], events = [], edits = [];
    const wait = (ms = 180) => new Promise(r => setTimeout(r, ms));
    const check = (ok, message) => { if (!ok) throw new Error(message); checks++; };
    const columns = [{ title: 'Name', field: 'name', rowLabel: true, width: 160 }, { title: 'Tags', field: 'tags', type: 'multi' }, { title: 'Owners', field: 'owners', type: 'multi' }];
    let data = [{ id: 1, name: 'One', tags: ['x', 'x', 'y'], owners: ['A', 'B'] }, { id: '1', name: 'String one', tags: ['z'], owners: ['B'] }, { id: 2, name: 'Empty', tags: [], owners: ['A'] }, { id: 3, name: 'Three', tags: ['y'], owners: ['B'] }];
    const mount = async props => { D.flushSync(() => root.render(h(MultiGroupsTest.MultiTable, Object.assign({ label: 'Grouped API regression', data, columns, groupBy: ['tags'], selectable: true, narrow: 'table', height: '240px', onReady: t => { table = t; }, onSelectionChange: (ids, info) => notifications.push({ ids, info }), on: { cellEdit: cell => edits.push(cell.getRow().getData().name), rowSelectionChanged: (data, rows) => events.push([data.map(row => row.id), rows.map(row => row.getIndex())]) } }, props)))); for (let i = 0; !table && i < 100; i++) await wait(100); check(!!table, 'grouped table becomes ready: ' + host.textContent.slice(0,180)); await wait(400); };
    try {
      await mount();
      check(table.plxRows().length === 5 && table.getRows().length === 4 && table.getDataCount() === 4, 'duplicate memberships are physical rows while public row counts are canonical');
      check(table.getRows().map(row => row.getIndex()).some(id => id === 1) && table.getRows().map(row => row.getIndex()).some(id => id === '1'), 'typed numeric and string record IDs remain distinct');
      check(table.getRow(1).getData().name === 'One' && !Object.getOwnPropertyNames(table.getRow(1).getData()).some(key => key.startsWith('__plxDisplayIndex')), 'public getRow and row data never expose display indexes');
      check(!JSON.stringify(table.getData()).includes('__plxDisplayIndex') && table.plxData().length === 4, 'public data and collection source contain only canonical records');
      notifications = []; events = []; table.selectRow(1); await wait();
      check(table.getSelectedRows().length === 1 && table.plxSelectedRows().length === 2 && table.getSelectedData()[0].id === 1, 'selectRow canonical ID selects all memberships and returns one selected record');
      check(notifications.length === 1 && notifications[0].ids.length === 1 && events.length === 1, 'public selection emits one canonical callback and one canonical event');
      notifications = []; events = []; table.selectRow(1); await wait(); check(!notifications.length && !events.length, 'selecting an already-selected canonical record emits no duplicate callbacks');
      notifications = []; table.getRow(1).deselect(); await wait(); check(!table.getSelectedData().length && notifications.length === 1, 'row-component deselect removes every membership once');
      table.getRow('1').select(); await wait(); check(table.getSelectedData().length === 1 && table.getSelectedData()[0].id === '1', 'row-component select respects typed IDs');
      table.selectRow(1); await wait(); notifications = []; await table.updateData([{ id: 1, name: 'Updated one' }]); await wait(350);
      check(table.getRow(1).getData().name === 'Updated one' && table.plxRows().filter(row => row.getData().id === 1).every(row => row.getData().name === 'Updated one'), 'updateData updates every display membership from one canonical record');
      check(table.getSelectedData().length === 2 && notifications.length === 0, 'updateData preserves record selection without duplicate callbacks');
      edits = []; table.getRow(1).getCell('name').setValue('Cell edited'); await wait(350); check(table.getRow(1).getData().name === 'Cell edited' && edits.length === 1 && edits[0] === 'Cell edited', 'a physical cell edit updates canonical data before its single public callback');
      const row = await table.updateRow(1, { tags: ['new'] }); await wait(350);
      check(row.getIndex() === 1 && table.plxRows().length === 4 && table.plxData().find(row => row.id === 1).tags[0] === 'new', 'updateRow can change membership and updates canonical source');
      await table.addData([{ id: 4, name: 'Added', tags: ['x', 'y'], owners: ['A'] }]); await wait(350);
      check(table.getDataCount() === 5 && table.plxRows().length === 6 && table.getRow(4).getIndex() === 4, 'addData expands new memberships but counts one added record');
      await table.getRow(4).update({ name: 'Edited added' }); await wait(300); check(table.getRow(4).getData().name === 'Edited added', 'row-component update uses canonical mutations');
      await table.deleteRow(1); await wait(300); check(!table.getRow(1) && !!table.getRow('1') && table.getSelectedData().length === 1, 'deleteRow removes all numeric-ID memberships without deleting the string-ID record');
      await table.getRow(4).delete(); await wait(300); check(!table.getRow(4) && table.plxData().length === 3, 'row-component delete updates canonical source');
      data = [{ id: 1, name: 'Controlled', tags: ['x', 'y'], owners: ['A'] }];
      await mount({ selected: [] }); notifications = []; table.selectRow(1); await wait(); check(notifications.length === 1, 'controlled user/API selection reports the canonical ID');
      await mount({ selected: [1] }); notifications = []; await mount({ selected: [] }); await wait(); check(notifications.length === 0 && !table.getSelectedData().length, 'controlled prop changes do not emit user selection callbacks');
      await mount({ selected: [1] }); check(table.getSelectedData().length === 1 && table.getSelectedData()[0].id === 1, 'fresh controlled empty-to-selected prop selects all memberships');
      await mount({ selected: [] }); notifications = []; table.selectRow(1); await wait(); check(notifications.length === 1, 'reselecting an externally cleared record is not suppressed as a stale duplicate');
      data = [{ id: 5, name: 'Product', tags: ['x', 'y'], owners: ['A', 'B'] }, { id: 6, name: 'Empty', tags: [], owners: [] }];
      await mount({ groupBy: ['tags', 'owners'] }); check(table.plxRows().length === 5 && table.getRows().length === 2, 'multiple multi-value groups form a deduplicated Cartesian product and one empty membership');
      check(table.getRowPosition(6) === 2 && table.getRowFromPosition(2).getIndex() === 6, 'public row positions count records rather than memberships');
      check(table.getDataCount('active') === 2 && table.getRows('active').length === 2, 'active public counts remain canonical');
      data = [{ id: 1, name: 'Numeric', tags: ['x', 'y'] }, { id: '1', name: 'String', tags: ['z'] }];
      await mount({ key: 'typed-controlled', selected: [1, '1'] }); check(table.getSelectedData().length === 2 && table.plxSelectedRows().length === 3, 'controlled numeric and string IDs remain independently selected');
      const customGroup = row => row.name.slice(0, 1);
      await mount({ key: 'custom', groupBy: undefined, options: { groupBy: customGroup } });
      check(table.getGroups().length === 2, 'plain table preserves custom options.groupBy functions');
      await table.addData([{ id: 9, name: 'Nine', tags: [] }]); check(table.plxData().length === 3, 'plain collection source reflects imperative addData');
      await table.deleteRow(9); check(table.plxData().length === 2, 'plain collection source reflects imperative deleteRow');
      await mount({ key: 'dynamic-group', groupBy: false, filter: () => true, sort: [] });
      check(table.getGroups().length === 0, 'dynamic grouping starts ungrouped');
      await mount({ key: 'dynamic-group', groupBy: ['tags'], filter: () => true, sort: [{ field: 'tags', dir: 'asc' }] }); await wait(500);
      check(table.getGroups().length === 3 && table.plxRows().length === 3, 'dynamic collection grouping creates membership headers after false-to-multi transition');
      await mount({ key: 'dynamic-group', groupBy: false, filter: () => true, sort: [] }); await wait(500);
      check(table.getGroups().length === 0 && table.getDataCount() === 2, 'dynamic collection grouping can return to canonical ungrouped rows');
      const sortedData = data;
      data = data.concat([{ id: 'null-tags', name: 'Null tags', tags: null }, { id: 'empty-tags', name: 'Empty tags', tags: [] }]);
      await mount({ key: 'empty-multi-sort', groupBy: ['tags'], sort: [{ field: 'tags', dir: 'asc' }] });
      check(table.getDataCount() === 4 && table.getGroups().length === 4, 'default multi sorter handles arrays, null and empty memberships');
      data = sortedData;
      let customSortCalls = 0;
      await mount({ key: 'custom-multi-sort', groupBy: ['tags'], sort: [{ field: 'tags', dir: 'asc' }], columns: columns.map(column => column.field === 'tags' ? { ...column, sorter: (a, b) => { customSortCalls++; return String(b).localeCompare(String(a)); } } : column) });
      check(customSortCalls > 0 && table.getGroups().length === 3, 'multi grouping preserves an explicitly supplied application sorter');
      function CollectionGroups() {
        const view = MultiGroupsTest.useCollectionView([{ value: 'name', label: 'Name', kind: 'text' }, { value: 'tags', label: 'Tags', kind: 'multi' }], { data });
        R.useEffect(() => { view.setGroup([{ field: 'tags', dir: 'asc' }]); }, []);
        return h(MultiGroupsTest.MultiTable, { label: 'Immediate collection grouping', data, columns, selectable: true, narrow: 'table', height: '240px', ...view.tableProps, onReady: t => { table = t; view.tableProps.onReady(t); } });
      }
      table = null; D.flushSync(() => root.render(h(CollectionGroups))); for (let i = 0; (!table || !table.element.isConnected || !Object.prototype.hasOwnProperty.call(table, 'plxRows')) && i < 100; i++) await wait(100); await wait(300);
      check(table && table.element.isConnected && table.getGroups().length === 3 && table.plxRows().length === 3, 'real collection hook groups and sorts immediately after mount without a discarded table overwriting its ready reference');
      const remoteRows = [{ id: 10, name: 'Remote one', tags: ['x', 'y'] }, { id: 11, name: 'Remote two', tags: ['z'] }];
      const fetchRows = async ask => ({ rows: [remoteRows[ask.page - 1]], total: 2 });
      await mount({ key: 'remote-pages', data: [], mode: 'pages', pageSize: 1, fetchRows }); await wait(400);
      check(table.plxRows().length === 2 && table.getData().length === 1 && table.plxData()[0].id === 10, 'remote first page expands memberships but exposes one canonical record');
      check(host.textContent.includes('of 2'), 'remote footer retains canonical server total independently of accessible group rows');
      await table.setPage(2); await wait(400);
      check(table.plxRows().length === 1 && table.getData()[0].id === 11 && table.plxData().length === 1, 'remote page changes replace canonical source');
      const observer = window.IntersectionObserver; window.IntersectionObserver = undefined;
      try {
        await mount({ key: 'remote-more', data: [], mode: 'load-more', pageSize: 1, fetchRows }); await wait(400);
        table.selectRow(10); await wait();
        const more = [...host.querySelectorAll('button')].find(button => button.textContent === 'Load more'); check(!!more, 'remote load-more offers the next canonical page: ' + host.textContent + ' DATA ' + table.getDataCount() + '/' + table.plxRows().length); more.click(); await wait(650);
        check(table.plxRows().length === 3 && table.getData().length === 2 && table.plxData().length === 2, 'remote load-more appends expanded memberships with canonical loaded counts');
        check(table.getSelectedData().length === 1 && table.getSelectedData()[0].id === 10, 'remote append preserves canonical selection');
        check(host.textContent.includes('2 of 2'), 'remote load-more footer counts records rather than memberships');
        let releaseMore;
        const overlapping = ask => ask.page > 1 ? new Promise(resolve => { releaseMore = resolve; }) : Promise.resolve({ rows: [ask.search ? { id: 20, name: 'Searched', tags: ['new', 'other'] } : remoteRows[0]], total: ask.search ? 1 : 3 });
        await mount({ key: 'remote-overlap', data: [], mode: 'load-more', pageSize: 1, fetchRows: overlapping }); await wait(300);
        [...host.querySelectorAll('button')].find(button => button.textContent === 'Load more').click(); await wait(100);
        check(typeof releaseMore === 'function', 'overlap regression holds a load-more request in flight');
        await mount({ key: 'remote-overlap', data: [], mode: 'load-more', pageSize: 1, search: 'new search', fetchRows: overlapping }); await wait(300);
        releaseMore({ rows: [remoteRows[1]], total: 3 }); await wait(400);
        check(table.getData().length === 1 && table.getData()[0].id === 20 && table.plxRows().length === 2 && table.plxData().length === 1, 'late load-more cannot append stale memberships after a new remote search');
        check(host.textContent.includes('1 of 1') && ![...host.querySelectorAll('button')].some(button => button.textContent === 'Load more'), 'new remote search preserves canonical server total and clears loading state');
      } finally { window.IntersectionObserver = observer; }
      D.flushSync(() => root.unmount()); host.remove(); return checks;
    } catch (error) { D.flushSync(() => root.unmount()); host.remove(); throw error; }
  });
};
if (require.main === module) {
  (async () => { const port = +process.env.TEST_PORT || 9159, server = await serve(port); let browser;
    try { browser = await launch(); const page = await browser.newPage(); page.on('pageerror', error => console.error('PAGE_ERROR',error.message)); page.on('console', message => {if(message.type()==='error')console.error('PAGE_CONSOLE',message.text());}); await page.setViewport({ width: 1440, height: 1000 }); await page.goto('http://127.0.0.1:' + port + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'networkidle0' }); console.log('MULTI_GROUPS_OK ' + await module.exports(page));
    } finally { if (browser) await browser.close(); server.close(); }
  })().catch(error => { console.error(error); process.exitCode = 1; });
}




