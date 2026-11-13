/* Plenix · remaining DataGrid contracts. These checks also run from data-grid.test.js. */
const fs = require('fs'),
  path = require('path'),
  ROOT = path.resolve(__dirname, '..');
module.exports = async function rest(page) {
  const build = await require('esbuild').build({
    stdin: {
      contents: (process.env.DT_ENGINE==='next'?"import React from 'react';import {DataGrid as Base} from './platform/components/DataGrid/DataGrid.tsx';export const DataGrid=Object.assign(props=>React.createElement(Base,{...props,engine:'next'}),{useActions:Base.useActions});":"export {DataGrid} from './platform/components/DataGrid/DataGrid.tsx';")+"export {ToastProvider} from './platform/components/Toast/Toast.tsx';export {CommandBar} from './platform/patterns/CommandBar/CommandBar.tsx';export {Button} from './platform/components/Button/Button.tsx';",
      resolveDir: ROOT
    },
    bundle: true,
    write: false,
    format: 'iife',
    globalName: 'RestTest',
    plugins: [require('./icon-modules.js'), {
      name: 'peers',
      setup(b) {
        b.onResolve({
          filter: /^react(-dom)?$/
        }, a => ({
          path: a.path,
          namespace: 'peer'
        }));
        b.onLoad({
          filter: /.*/,
          namespace: 'peer'
        }, a => ({
          contents: 'module.exports=window.' + (a.path === 'react' ? 'React' : 'ReactDOM') + ';'
        }));
      }
    }]
  });
  await page.addScriptTag({
    content: build.outputFiles[0].text
  });
  return page.evaluate(async () => {
    const R = React,
      D = ReactDOM,
      h = R.createElement,
      P = RestTest,
      host = document.createElement('div');
    document.body.appendChild(host);
    const baseRegions = document.querySelectorAll('.plx-toast-region').length;
    let root = D.createRoot(host),
      table,
      n = 0;
    const wait = (ms = 100) => new Promise(r => setTimeout(r, ms)),
      ok = (v, m) => {
        if (!v) throw Error(m);
        n++;
      },
      render = async p => {
        table = null;
        D.flushSync(() => root.render(h(P.DataGrid, {
          label: 'Remaining table contracts',
          narrow: 'table',
          ...p,
          onReady: t => {
            table = t;
            p.onReady?.(t);
          }
        })));
        for (let i = 0; i < 100 && !table; i++) await wait(30);
        if (!table) throw Error('Table did not build');
        await wait();
        return table;
      },
      reset = async () => {
        D.flushSync(() => root.unmount());
        await wait();
        root = D.createRoot(host);
        table = null;
      },
      button = text => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === text),
      defer = () => {
        let resolve, reject;
        const promise = new Promise((a, b) => {
          resolve = a;
          reject = b;
        });
        return {
          resolve,
          reject,
          promise
        };
      };
    let rows = [{
      id: 1,
      name: 'Large file',
      size: 2500000,
      person: {
        name: 'Maya Chen'
      },
      tags: ['Client', 'Review'],
      status: {
        label: 'Approved',
        tone: 'success',
        icon: 'check'
      },
      missing: null,
      zero: 0,
      no: false
    }, {
      id: 2,
      name: 'Small file',
      size: 750000,
      person: {
        name: 'Alex Rivera'
      },
      tags: ['Review'],
      status: {
        label: 'Draft',
        icon: 'pencil'
      },
      missing: '',
      zero: 0,
      no: false
    }, {
      id: 3,
      name: 'Empty file',
      size: 0,
      person: {
        name: 'Sam Lee'
      },
      tags: [],
      status: {
        label: 'Draft',
        icon: 'pencil'
      },
      missing: undefined,
      zero: 0,
      no: false
    }];
    const columns = [{
      title: 'Name',
      field: 'name',
      width: '12ch'
    }, {
      title: 'Size',
      field: 'size',
      type: 'bytes',
      filter: true,
      width: '120px'
    }, {
      title: 'Person',
      field: 'person',
      kind: 'avatar-name'
    }, {
      title: 'Tags',
      field: 'tags',
      kind: 'tags'
    }, {
      title: 'Status',
      field: 'status',
      kind: 'badge'
    }, {
      title: 'Missing',
      field: 'missing',
      empty: 'Unavailable'
    }, {
      title: 'Deleted',
      field: 'removed',
      kind: 'deleted',
      empty: 'Deleted'
    }, {
      title: 'Zero',
      field: 'zero', width: 'calc(var(--plx-ref-size-10u) * 3)'
    }, {
      title: 'No',
      field: 'no', width: 'clamp(80px, calc(var(--plx-ref-size-10u) * 3), 160px)'
    }];
    let t = await render({
      data: rows,
      columns,
      height: '--plx-ref-size-60u'
    });
    ok(t.getColumn('name').getWidth() > 60 && t.getColumn('name').getWidth() < 200, 'CSS ch length resolves as a column width');
    ok(t.getColumn('size').getWidth() === 120, 'CSS px width preserves requested grid value');
    ok(t.getColumn('zero').getWidth() === 120, 'CSS calc width keeps its expression instead of extracting an inner token');
    ok(t.getColumn('no').getWidth() === 120, 'CSS clamp width resolves the complete expression');
    let row = t.getRow(1);
    ok(row.getCell('size').getElement().textContent.includes('2.5'), 'Byte cell formats numeric bytes');
    ok(['left','start'].includes(getComputedStyle(row.getCell('size').getElement()).textAlign), 'Bytes start-aligned like every cell (D-0087, DESIGN.md numbers)');
    ok(getComputedStyle(row.getCell('size').getElement()).fontFamily.includes('Reddit Mono'), 'Bytes use data font');
    ok(row.getCell('missing').getElement().textContent === 'Unavailable', 'Column missing copy used');
    ok(row.getCell('zero').getElement().textContent === '0' && row.getCell('no').getElement().textContent === 'false', 'Zero and false are retained');
    ok(host.querySelectorAll('.plx-data-grid__deleted').length === 3, 'Missing deleted cells use deleted look');
    ok(getComputedStyle(host.querySelector('.plx-data-grid__deleted')).fontStyle === 'italic', 'Deleted values are italic');
    ok(row.getCell('person').getElement().querySelector('.plx-avatar')?.textContent === 'MC', 'Native avatar name renders initials');
    ok(getComputedStyle(host.querySelector('.plx-avatar')).fontSize === getComputedStyle(row.getCell('person').getElement()).fontSize, 'Native avatar initials use the table text size');
    ok(row.getCell('tags').getElement().querySelectorAll('.plx-tag').length === 2, 'Native tag cells render tags');
    ok(row.getCell('status').getElement().querySelector('.plx-badge .plx-icon'), 'Native status badge has an icon');
    const badgeRect = row.getCell('status').getElement().querySelector('.plx-badge').getBoundingClientRect(), statusRect = row.getCell('status').getElement().getBoundingClientRect();
    ok(Math.abs((badgeRect.top + badgeRect.bottom - statusRect.top - statusRect.bottom) / 2) <= 1, 'Native badge is vertically centered');
    ok(!host.querySelector('.plx-data-grid__portal'), 'Built-in rich cells need no portal');
    const densityBefore = document.documentElement.getAttribute('data-plx-density'); document.documentElement.setAttribute('data-plx-density', 'comfortable'); host.querySelector('.plx-data-grid').setAttribute('data-plx-row-height', 'medium'); await wait();
    const personCell = row.getCell('person').getElement(), avatarBox = personCell.querySelector('.plx-avatar').getBoundingClientRect(), nameBox = personCell.querySelector('.plx-data-grid__rich > .plx-data-grid__value').getBoundingClientRect();
    ok(Math.abs((avatarBox.top + avatarBox.bottom - nameBox.top - nameBox.bottom) / 2) <= 1, 'Taller rows keep avatar and name aligned on one row');
    host.querySelector('.plx-data-grid').setAttribute('data-plx-row-height', 'short'); if (densityBefore === null) document.documentElement.removeAttribute('data-plx-density'); else document.documentElement.setAttribute('data-plx-density', densityBefore); await wait();
    ok(!document.querySelector('.plx-data-grid__length-probe'), 'Length measurement leaves no probe');
    t.setSort('person', 'asc'); await wait();
    ok(t.getRows('active').map(r => r.getIndex()).join(',') === '2,1,3', 'Native avatar-name sorts by its visible name');
    t.setSort('tags', 'asc'); await wait();
    ok(t.getRows('active').map(r => r.getIndex()).join(',') === '3,1,2', 'Native tags sort safely including empty arrays');
    t.setSort('status', 'desc'); await wait();
    ok(t.getRows('active')[2].getIndex() === 1, 'Native badges sort by their visible labels');
    t.setSort('size', 'asc');
    await wait();
    ok(t.getRows('active').map(r => r.getIndex()).join(',') === '3,2,1', 'Bytes sort numerically');
    t.addFilter('size', 'plxBytes', '> 2 MB');
    await wait();
    ok(t.getRows('active').length === 1 && t.getRows('active')[0].getIndex() === 1, 'Human byte query filters raw bytes');
    t.clearFilter();
    t.addFilter('size', 'plxBytes', '<= 1 MiB');
    await wait();
    ok(t.getRows('active').length === 2, 'Binary unit query supported');
    t.clearFilter();
    t.addFilter('size', 'plxBytes', 'not a size');
    await wait();
    ok(t.getRows('active').length === 0, 'Invalid byte query never coerces to a match');
    await reset();
    host.className = 'plx-layout--width-sm';
    t = await render({
      data: rows,
      columns: columns.slice(0, 3),
      narrow: 'list',
      narrowAt: 900,
      keyColumns: ['name', 'size']
    });
    await wait(250);
    ok(host.querySelector('.plx-data-grid--narrow'), 'Caller narrowAt controls actual list class');
    // auto (issue 679): the grid is the row cards when its visible columns do not all fit its width, not only its key columns
    // minimum widths (issue 929: the switch weighs each column at its minimum readable width): the key columns need 400px,
    // all three 560px
    const autoColumns = [{
      title: 'Name',
      field: 'name',
      width: 200,
      minWidth: 200
    }, {
      title: 'Size',
      field: 'size',
      type: 'bytes',
      width: 200,
      minWidth: 200
    }, {
      title: 'Person',
      field: 'person',
      kind: 'avatar-name',
      minWidth: 160
    }];
    await reset();
    t = await render({
      data: rows,
      columns: autoColumns,
      narrow: 'auto',
      keyColumns: ['name', 'size']
    });
    await wait(300);
    ok(host.querySelector('.plx-data-grid--narrow'), 'Auto: the row cards when the visible columns do not fit the grid (#679)');
    // 420px holds the two key columns (200px minimums) but not the avatar-name column as well: the cards by every visible column (#679),
    // where the key columns alone (before #679) would have kept the table
    await reset();
    host.className = '';
    host.style.inlineSize = '420px';
    t = await render({
      data: rows,
      columns: autoColumns,
      narrow: 'auto',
      keyColumns: ['name', 'size']
    });
    await wait(300);
    ok(host.querySelector('.plx-data-grid--narrow'), 'Auto counts every visible column, not only the key columns (#679)');
    host.style.removeProperty('inline-size');
    await reset();
    let mounted = 0,
      unmounted = 0;
    function Rich(p) {
      R.useEffect(() => {
        mounted++;
        return () => {
          unmounted++;
        };
      }, []);
      return h('span', null, p.name);
    }
    t = await render({
      data: Array.from({
        length: 1200
      }, (_, i) => ({
        id: i,
        name: 'Virtual row ' + i
      })),
      columns: [{
        title: 'Name',
        field: 'name',
        render: r => h(Rich, {
          name: r.name
        })
      }],
      height: '--plx-ref-size-60u'
    });
    await wait(250);
    ok(mounted > 0 && mounted - unmounted < 100, 'Only virtual visible rich cells mount');
    const before = mounted,
      holder = host.querySelector('.plx-data-grid__grid-tableholder');
    holder.scrollTop = holder.scrollHeight;
    holder.dispatchEvent(new Event('scroll'));
    await wait(400);
    ok(mounted > before && unmounted > 0, 'Scrolling mounts new rich cells and unmounts old ones');
    ok(mounted - unmounted < 100, 'Mounted portal count stays bounded after scrolling');
    const awayMounted = mounted;
    holder.scrollTop = 0;
    holder.dispatchEvent(new Event('scroll'));
    await wait(350);
    ok(mounted > awayMounted && mounted - unmounted < 100, 'Returning to cached virtual rows remounts only their rich cells');
    await reset();
    ok(mounted === unmounted, 'Unmount releases every rich cell');
    let action = 0,
      restored;
    const req = defer();
    function RowUndo() {
      const [data, setData] = R.useState([{
        id: 1,
        name: 'Keep this snapshot'
      }]);
      return h(P.DataGrid, {
        label: 'Row undo',
        data,
        columns: [{
          title: 'Name',
          field: 'name'
        }],
        rowMenu: [{
          label: 'Archive record',
          onSelect: async r => {
            action++;
            await req.promise;
            setData([]);
            return 'archive-token';
          },
          undo: (r, component, result) => {
            restored = {
              r,
              result
            };
            setData([r]);
          },
          message: 'Record archived'
        }]
      });
    }
    D.flushSync(() => root.render(h(RowUndo)));
    await wait(500);
    host.querySelector('button[aria-label="Row actions"]').click();
    await wait();
    let item = [...document.querySelectorAll('[role="menuitem"]')].find(e => e.textContent.includes('Archive record'));
    item.click();
    await wait();
    ok(action === 1 && !button('Undo'), 'Pending row action offers no premature undo');
    req.resolve();
    await wait(200);
    ok(button('Undo') && document.querySelectorAll('.plx-toast-region').length === baseRegions + 1, 'Standalone row action gets one local toast provider');
    button('Undo').click();
    await wait(250);
    ok(restored.r.id === 1 && restored.result === 'archive-token', 'Row undo receives original record and action result');
    await reset();
    let selection = [1, 2],
      undoKeys,
      runKeys,
      selectionApi,
      resolve;
    function Selection() {
      const [keys, setKeys] = R.useState(selection);
      selectionApi = setKeys;
      const actions = P.DataGrid.useActions([{
        id: 'archive',
        label: 'Archive selected',
        onSelect: ids => {
          runKeys = ids;
          return new Promise(r => {
            resolve = r;
          });
        },
        undo: ids => {
          undoKeys = ids;
        }
      }], keys);
      return h(P.CommandBar, {
        label: 'Selection undo',
        selection: {
          count: keys.length,
          onClear: () => setKeys([]),
          actions
        }
      });
    }
    D.flushSync(() => root.render(h(P.ToastProvider, null, h(Selection))));
    await wait();
    button('Archive selected').click();
    await wait();
    D.flushSync(() => selectionApi([3]));
    resolve();
    await wait();
    ok(runKeys.join(',') === '1,2', 'Selection action receives captured keys');
    ok(document.querySelectorAll('.plx-toast-region').length === baseRegions + 1, 'Selection hook reuses app provider');
    button('Undo').click();
    await wait();
    ok(undoKeys.join(',') === '1,2', 'Undo retains selection snapshot after selection changes');
    await reset();
    let failedUndo = 0;
    function FailedAction() {
      const actions = P.DataGrid.useActions([{
        id: 'bad',
        label: 'Fail action',
        onSelect: async () => {
          throw Error('offline');
        },
        undo: () => {
          failedUndo++;
        }
      }], [1]);
      return h(P.Button, {
        onClick: actions[0].onSelect
      }, 'Fail action');
    }
    D.flushSync(() => root.render(h(P.ToastProvider, null, h(FailedAction))));
    await wait();
    button('Fail action').click();
    await wait();
    ok(document.querySelector('.plx-toast--danger')?.textContent.includes('The action failed') && !button('Undo') && failedUndo === 0, 'Rejected action reports failure without an undo');
    await reset();
    let failRestore = true,
      restoredCount = 0;
    function FailedRestore() {
      const actions = P.DataGrid.useActions([{
        id: 'retry',
        label: 'Archive for retry',
        onSelect: () => {},
        undo: async () => {
          if (failRestore) throw Error('offline');
          restoredCount++;
        }
      }], [1]);
      return h(P.Button, {
        onClick: actions[0].onSelect
      }, 'Archive for retry');
    }
    D.flushSync(() => root.render(h(P.ToastProvider, null, h(FailedRestore))));
    await wait();
    button('Archive for retry').click();
    await wait();
    button('Undo').click();
    await wait();
    ok(document.querySelector('.plx-toast--danger')?.textContent.includes('Could not undo'), 'Failed restoration is explained');
    failRestore = false;
    document.querySelector('.plx-toast--danger .plx-toast__action').click();
    await wait();
    ok(restoredCount === 1, 'Failed undo can retry the captured inverse');
    await reset();
    host.hidden = true;
    let changeView, hiddenTable;
    function HiddenView() {
      const [view, setView] = R.useState({});
      changeView = setView;
      return h(P.DataGrid, {
        label: 'Hidden selectable table',
        data: rows,
        columns: [{
          title: 'Name',
          field: 'name'
        }, {
          title: 'Size',
          field: 'size',
          type: 'bytes'
        }],
        selectable: true,
        narrow: 'table',
        ...view,
        onReady: t => {
          hiddenTable = t;
        }
      });
    }
    D.flushSync(() => root.render(h(HiddenView)));
    for (let i = 0; i < 100 && !hiddenTable; i++) await wait(30);
    D.flushSync(() => changeView({
      sort: [{
        field: 'size',
        dir: 'desc'
      }],
      groupBy: 'name',
      columnOrder: ['size', 'name']
    }));
    await wait(200);
    host.hidden = false;
    await wait(300);
    let boxes = [...host.querySelectorAll('.plx-data-grid__grid-row input[type=checkbox]')];
    ok(boxes.length > 0 && boxes.every(box => box.getAttribute('aria-label')?.trim()), 'Off-screen sort/group/order updates retain row checkbox names');
    await reset();
    host.remove();
    return n;
  });
};
if (require.main === module) {
  const {
    serve,
    launch
  } = require('./lib');
  (async () => {
    const port = +process.env.TEST_PORT || 9170,
      server = await serve(port);
    let b;
    try {
      b = await launch();
      const p = await b.newPage();
      await p.goto('http://127.0.0.1:' + port + '/Plenix/tests/fixtures/platform-host.html', {
        waitUntil: 'networkidle0'
      });
      console.log('DATA_GRID_REST_OK ' + (await module.exports(p)) + ' checks');
    } finally {
      if (b) await b.close();
      await new Promise(r => server.close(r));
    }
  })().catch(e => {
    console.error(e);
    process.exitCode = 1;
  });
}
