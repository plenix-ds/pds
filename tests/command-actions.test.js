// Plenix · CommandBar contextual-action regressions, including actual keyboard input and folded forms.
const assert = require('assert');
const fs = require('fs'), path = require('path');
const { serve, launch, sleep } = require('./lib.js');
const ROOT = path.resolve(__dirname, '..');
const BASE_PATH = '/Plenix/tests/fixtures/platform-host.html';   // an empty page with this checkout's Platform
async function internalActions(page) {
  const esbuild = require('esbuild');
  const output = await esbuild.build({ entryPoints: [path.join(ROOT, 'platform/patterns/CommandBar/BarActions.tsx')], bundle: true, write: false, format: 'iife', globalName: 'CommandActionsTest',
    plugins: [require('./icon-modules.js'), { name: 'global-react', setup(build) { build.onResolve({ filter: /^react(-dom)?$/ }, args => ({ path: args.path, namespace: 'global-react' })); build.onLoad({ filter: /.*/, namespace: 'global-react' }, args => ({ contents: 'module.exports = window.' + (args.path === 'react' ? 'React' : 'ReactDOM') + ';' })); } }] });
  await page.addScriptTag({ content: output.outputFiles[0].text });
}
module.exports = async function regressions(page) {
  await internalActions(page);
  const checks = await page.evaluate(async () => {
    const R = window.React, D = window.ReactDOM, P = window.Plenix, h = R.createElement, B = CommandActionsTest.BarActions;
    const host = document.createElement('div'); document.body.appendChild(host); host.id = 'command-action-regressions';
    let root = D.createRoot(host), n = 0, calls = 0;
    const wait = (time = 120) => new Promise(r => setTimeout(r, time));
    const check = (ok, text) => { if (!ok) throw new Error(text); n++; };
    const mount = async node => { D.flushSync(() => root.render(node)); await wait(450); };
    const reset = async () => { D.flushSync(() => root.unmount()); root = D.createRoot(host); await wait(); };
    const button = text => [...host.querySelectorAll('button')].find(e => (e.getAttribute('aria-label') || e.textContent).trim() === text);
    const busy = ['Plain', 'Toggle', 'Menu', 'Choice', 'Panel'].map((label, i) => Object.assign({ id: label, label, icon: 'plus', loading: true, onSelect: () => calls++ }, i === 1 ? { toggle: true, pressed: true } : i === 2 ? { items: [{ label: 'Child', onSelect: () => calls++ }] } : i === 3 ? { choices: [{ value: 'one', label: 'One' }], value: 'one', onChange: () => calls++ } : i === 4 ? { panel: () => h(P.Input, { label: 'Pending input' }) } : {}));
    await mount(h(P.CommandBar, { label: 'Pending commands', actions: busy }));
    const pending = [...host.querySelectorAll('button[aria-busy="true"]')];
    check(pending.length === 5 && pending.every(e => e.getAttribute('aria-disabled') === 'true' && e.querySelector('.plx-spinner')), 'all visible command kinds use the existing busy Button state');
    pending.forEach(e => e.click()); await wait(); check(!calls && !host.querySelector('[role="menu"],[role="dialog"]'), 'busy commands never run or open a menu or form');
    await reset(); await mount(h(P.Toolbar, { label: 'Folded pending commands' }, h(B, { actions: busy, fold: 10 })));
    button('More actions').click(); await wait();
    const items = [...host.querySelectorAll('[data-plx-menu-item]')];
    check(items.length === 5 && items.every(e => e.getAttribute('aria-busy') === 'true' && e.getAttribute('aria-disabled') === 'true' && e.querySelector('.plx-spinner')), 'all folded pending kinds show spinners, busy and disabled semantics');
    check(items.some(e => e.getAttribute('role') === 'menuitemcheckbox' && e.getAttribute('aria-checked') === 'true'), 'pending folded toggle preserves its checked role and state');
    check(items.some(e => e.getAttribute('aria-label') === 'Choice: One'), 'pending folded choice preserves its current value in the accessible name');
    items.forEach(e => e.click()); await wait(); check(!calls && !host.querySelector('[role="dialog"]'), 'folded busy commands cannot be chosen');
    await reset();
    const action = { id: 'tag', label: 'Add tag', icon: 'plus', tooltip: 'Organize these records', panel: ({ close }) => h(P.Stack, { gap: 'sm' }, h(P.Input, { 'aria-label': 'Tag name' }), h(P.Button, { onClick: close }, 'Apply tag')) };
    await mount(h(P.CommandBar, { label: 'Help example', actions: [{ label: 'Export', icon: 'download-arrow', tooltip: 'Download records', onSelect: () => calls++ }] }));
    const exportButton = button('Export'); exportButton.dispatchEvent(new FocusEvent('focusin', { bubbles: true })); await wait();
    check((exportButton.getAttribute('aria-describedby') || '').split(' ').some(id => document.getElementById(id)?.textContent === 'Download records'), 'labeled enabled actions show explicit help on focus');
    await reset(); await mount(h(P.CommandBar, { label: 'Disabled help', actions: [{ label: 'Export', disabled: true, why: 'Select a record', tooltip: 'Download records' }] }));
    button('Export').dispatchEvent(new FocusEvent('focusin', { bubbles: true })); await wait();
    check([...host.querySelectorAll('[role="tooltip"]')].some(e => e.textContent === 'Select a record'), 'disabled why remains the specific tooltip');
    await reset();
    const described = [{ label: 'Menu help', icon: 'plus', tooltip: 'Menu explanation', items: [{ label: 'Child' }] }, { label: 'Choice help', icon: 'check', tooltip: 'Choice explanation', choices: [{ value: 'one', label: 'One' }], value: 'one' }, action];
    await mount(h(P.Toolbar, { label: 'Composite descriptions' }, h(B, { actions: described, iconOnly: true })));
    check(described.every(a => { const e = [...host.querySelectorAll('button')].find(e => (e.getAttribute('aria-label') || '').startsWith(a.label)); return e && (e.getAttribute('aria-describedby') || '').split(' ').some(id => document.getElementById(id)?.textContent === a.tooltip); }), 'icon-only menu, choices and form triggers keep explicit tooltip associations');
    await reset(); await mount(h(P.Toolbar, { label: 'Folded choice description' }, h(B, { actions: [described[1]], fold: 1 })));
    button('More actions').click(); await wait();
    const sub = host.querySelector('[aria-haspopup="menu"] [data-plx-menu-item]') || host.querySelector('[data-plx-menu-item]');
    check(sub && (sub.getAttribute('aria-describedby') || '').split(' ').some(id => document.getElementById(id)?.textContent === 'Choice explanation'), 'folded choices submenu keeps its actual tooltip association');
    await reset();
    const command = props => h(P.CommandBar, Object.assign({ label: 'Position', actions: [{ label: 'Add', icon: 'plus' }] }, props));
    await mount(h(P.PageContent, null, command())); check(getComputedStyle(host.querySelector('.plx-command-bar')).position === 'sticky', 'auto sticks as a direct PageContent child');
    await mount(h('div', { className: 'plx-app-shell__main' }, command())); check(getComputedStyle(host.querySelector('.plx-command-bar')).position === 'sticky', 'auto sticks as a direct AppShell main child');
    await mount(h(P.PageContent, null, h(P.Stack, null, command()))); check(getComputedStyle(host.querySelector('.plx-command-bar')).position === 'static', 'auto stays in normal flow inside a layout/card wrapper');
    await mount(h(P.Stack, null, command({ sticky: true }))); check(getComputedStyle(host.querySelector('.plx-command-bar')).position === 'sticky', 'true forces sticking inside a wrapper');
    await mount(h(P.PageContent, null, command({ sticky: false }))); check(getComputedStyle(host.querySelector('.plx-command-bar')).position === 'static', 'false forces normal flow at page level');
    await reset(); await mount(h(P.CommandBar, { label: 'Selection panel', selection: { count: 2, onClear: () => calls++, actions: [action] } }));
    button('Add tag').click(); await wait(); check(document.activeElement.getAttribute('aria-label') === 'Tag name', 'selection panel focuses its first field');
    button('Apply tag').click(); await wait(); check(!host.querySelector('[role="dialog"]') && document.activeElement.textContent.trim() === 'Add tag', 'panel close callback restores focus to its action');
    check(calls === 0, 'opening and closing a selection form does not clear the selection');
    await reset(); await mount(h(P.CommandBar, { label: 'Posts', actions: [{ id: 'new', label: 'New post', icon: 'plus', onSelect() {} }],
      find: h(P.CommandBarSearch, { value: '', onChange() {}, placeholder: 'Search posts' }),
      quickFilters: [{ id: 'community', label: 'Community', options: [{ value: 'a', label: 'A' }], value: [], onChange() {} }],
      selection: { mode: 'swap', count: 2, onClear() {}, actions: [{ id: 'archive', label: 'Archive', icon: 'archive', onSelect() {} }] } }));
    check(!!host.querySelector('.plx-command-bar input') && !!button('Community') && !!button('Archive') && !button('New post'),
      'CommandBar: in selection.mode "swap", while rows are ticked, search and filters stay and only the page actions give way to the selection commands #454');
    await reset(); await mount(h(P.CommandBar, { label: 'Posts', actions: [{ id: 'new', label: 'New post', icon: 'plus', onSelect() {} }],
      find: h(P.CommandBarSearch, { value: '', onChange() {}, placeholder: 'Search posts' }),
      selection: { count: 2, onClear() {}, actions: [{ id: 'archive', label: 'Archive', icon: 'archive', onSelect() {} }] } }));
    check(!!host.querySelector('.plx-command-bar input') && !!button('Archive') && !!button('New post'), 'CommandBar: by default (selection.mode "add", D-0068) the selection commands come with the page commands, not instead of them');
    let cleared = 0; await reset(); await mount(h(P.CommandBar, { label: 'Posts', find: h(P.CommandBarSearch, { value: 'cairo', onChange() {}, placeholder: 'Search posts' }),
      selection: { count: 2, onClear: () => cleared++, actions: [{ id: 'archive', label: 'Archive', icon: 'archive', onSelect() {} }] } }));
    const field = host.querySelector('.plx-command-bar input'); field.focus();
    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }); field.dispatchEvent(esc); await wait();
    check(cleared === 0, 'CommandBar: Escape in the search field while rows are ticked does not clear the selection #454');
    button('Archive').focus(); button('Archive').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })); await wait();
    check(cleared === 1, 'CommandBar: Escape on the bar while rows are ticked still clears the selection #454');
    await reset(); await mount(h(P.Toolbar, { label: 'Folded form toolbar' }, h(B, { actions: [action, { label: 'Other', icon: 'check' }], fold: 5 })));
    button('More actions').click(); await wait(); button('Add tag').click(); await wait();
    check(document.activeElement.getAttribute('aria-label') === 'Tag name', 'folded panel opens from its actual More item and focuses the field');
    const panel = host.querySelector('[role="dialog"]'), trigger = host.querySelector('[data-plx-menu-item][aria-haspopup="dialog"]');
    check(trigger && trigger.getAttribute('aria-expanded') === 'true' && panel.getAttribute('data-plx-floating') === trigger.getAttribute('data-plx-floating-anchor'), 'folded form uses the More item as its floating anchor');
    button('Apply tag').click(); await wait(); check(document.activeElement === trigger && !!host.querySelector('[role="menu"]'), 'folded close restores focus to the still-mounted menu item');
    await reset();
    const many = Array.from({ length: 6 }, (_, i) => ({ id: 'command-' + i, label: 'Command ' + i, icon: 'check' })).concat(action);
    await mount(h(P.Stack, { width: 'sm' }, h(P.CommandBar, { label: 'Measured folded selection', selection: { count: 2, onClear: () => calls++, actions: many } })));
    check(!!button('More actions'), 'real CommandBar measurement folds selection commands into More');
    button('More actions').click(); await wait(); button('Add tag').click(); await wait();
    check(document.activeElement.getAttribute('aria-label') === 'Tag name', 'real measured selection overflow opens its form with focus inside');
    button('Apply tag').click(); await wait(); check(!calls && document.activeElement.textContent.trim() === 'Add tag', 'measured folded selection closes back to its action without clearing selection');
    await reset();
    check(CommandActionsTest.foldOrder([{ id: 'a' }, { id: 'danger', danger: true }, { id: 'b' }, { id: 'primary', primary: true }]).map(a => a.id).join() === 'b,a,danger', 'existing overflow order and primary exclusion remain unchanged');
    D.flushSync(() => root.unmount()); host.remove(); return n;
  });
  return checks + await module.exports.pointer(page);
};
module.exports.pointer = async function pointer(page) {
  let checks = 0;
  for (const width of [1440, 390]) {
    await page.setViewport({ width, height: 1000 });
    await page.evaluate(() => {
      const R = React, h = R.createElement, P = Plenix, D = ReactDOM, host = document.createElement('div');
      host.id = 'folded-pointer-regression'; document.body.appendChild(host); const root = D.createRoot(host);
      window.foldedPointer = { host, root };
      const action = { label: 'Folded tag form', icon: 'plus', tooltip: 'Add a tag to the selection', panel: ({ close }) => h(P.Stack, { gap: 'sm' }, h(P.Input, { 'aria-label': 'Pointer tag' }), h(P.Button, { onClick: close }, 'Save pointer tag')) };
      D.flushSync(() => root.render(h(P.Stack, null, h(P.Toolbar, { label: 'Pointer toolbar' }, h(CommandActionsTest.BarActions, { actions: [action], fold: 5 })), h(P.Button, { id: 'pointer-outside' }, 'Outside form'))));
    });
    await sleep(350); await page.click('#folded-pointer-regression button[aria-label="More actions"]'); await sleep(200);
    await page.click('#folded-pointer-regression [data-plx-menu-item]'); await sleep(350);
    assert(await page.evaluate(() => { const item = document.querySelector('#folded-pointer-regression [data-plx-menu-item]'); return (item.getAttribute('aria-describedby') || '').split(' ').some(id => document.getElementById(id)?.textContent === 'Add a tag to the selection'); }), 'folded form trigger retains its actual tooltip description'); checks++;
    const field = '[role="dialog"] input[aria-label="Pointer tag"]';
    await page.click(field); await page.keyboard.type('Design');
    assert(await page.$eval(field, e => e.value === 'Design'), 'real pointer click inside folded form keeps it mounted at width ' + width); checks++;
    const save = await page.$('[role="dialog"] button:not([aria-label])');
    assert(save, 'form has save action'); await save.click(); await sleep(300);
    assert(await page.evaluate(() => !document.querySelector('[role="dialog"] input[aria-label="Pointer tag"]') && document.activeElement.textContent.trim() === 'Folded tag form'), 'real save click closes form and restores the folded item at width ' + width); checks++;
    await page.click('#folded-pointer-regression [data-plx-menu-item]'); await sleep(300);
    await page.keyboard.press('Escape'); await sleep(300);
    assert(await page.evaluate(() => document.activeElement.textContent.trim() === 'Folded tag form'), 'Escape returns from folded form to menu item at width ' + width); checks++;
    await page.click('#folded-pointer-regression [data-plx-menu-item]'); await sleep(300);
    if (width === 390) {
      await page.mouse.click(8, 100); await sleep(300);
      assert(await page.evaluate(() => !document.querySelector('[role="dialog"] input[aria-label="Pointer tag"]') && (document.activeElement.getAttribute('aria-label') === 'More actions' || document.activeElement.textContent.trim() === 'Folded tag form')), 'narrow modal scrim dismisses the form and restores its item or surviving More trigger'); checks++;
    }
    await page.click('#pointer-outside'); await sleep(300);
    assert(await page.evaluate(() => !document.querySelector('#folded-pointer-regression [role="menu"]') && !document.querySelector('[role="dialog"] input[aria-label="Pointer tag"]') && document.activeElement.id === 'pointer-outside'), 'outside pointer closes both layers without stealing focus at width ' + width); checks++;
    if (width === 1440) {
      await page.click('#folded-pointer-regression button[aria-label="More actions"]'); await sleep(200);
      await page.click('#folded-pointer-regression [data-plx-menu-item]'); await sleep(250);
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await sleep(250);
      assert(await page.evaluate(() => !document.querySelector('#folded-pointer-regression [role="menu"]') && !document.querySelector('[role="dialog"] input[aria-label="Pointer tag"]') && document.activeElement.id === 'pointer-outside'), 'Tab exits the folded form and closes both layers without refocusing the menu'); checks++;
    }
    await page.evaluate(() => { ReactDOM.flushSync(() => foldedPointer.root.unmount()); foldedPointer.host.remove(); delete window.foldedPointer; });
  }
  await page.setViewport({ width: 1440, height: 1000 });
  return checks;
};
module.exports.keyboard = async function keyboard(page) {
  await page.evaluate(() => {
    const R = window.React, D = window.ReactDOM, P = window.Plenix, h = R.createElement;
    const host = document.createElement('div'); host.id = 'command-panel-keyboard'; document.body.appendChild(host);
    const root = D.createRoot(host); window.commandPanelKeyboard = { host, root, clears: 0 };
    const action = { label: 'Add tag keyboard', icon: 'plus', panel: ({ close }) => h(P.Stack, { gap: 'sm' }, h(P.Input, { 'aria-label': 'Keyboard tag' }), h(P.Button, { onClick: close }, 'Apply keyboard tag')) };
    D.flushSync(() => root.render(h(P.CommandBar, { label: 'Keyboard panel', selection: { count: 2, onClear: () => window.commandPanelKeyboard.clears++, actions: [action] } })));
  });
  await sleep(500); // the count and Clear lead the bar in add mode (D-0068, #543), so the first button is Clear: aim at the action itself
  await page.focus('#command-panel-keyboard button[aria-haspopup="dialog"]'); await page.keyboard.press('Enter'); await sleep(250);
  assert(await page.evaluate(() => document.activeElement.getAttribute('aria-label') === 'Keyboard tag'), 'Enter opens selection action form and focuses its first field');
  await page.keyboard.type('Report'); await page.keyboard.press('Home'); await page.keyboard.press('ArrowRight');
  assert(await page.evaluate(() => document.activeElement.selectionStart === 1), 'form Home/arrow keys edit text without toolbar navigation');
  await page.keyboard.press('Tab');
  assert(await page.evaluate(() => document.activeElement.textContent.trim() === 'Apply keyboard tag'), 'Tab reaches the form action without toolbar roving');
  await page.keyboard.press('Escape'); await sleep(250);
  assert(await page.evaluate(() => !document.querySelector('#command-panel-keyboard [role="dialog"]') && document.activeElement.textContent.trim() === 'Add tag keyboard' && commandPanelKeyboard.clears === 0), 'Escape closes only the form and restores its action without clearing selection');
  await page.keyboard.press('Escape');
  assert(await page.evaluate(() => commandPanelKeyboard.clears === 1), 'Escape on the selection toolbar still clears selection');
  await page.evaluate(() => { ReactDOM.flushSync(() => commandPanelKeyboard.root.unmount()); commandPanelKeyboard.host.remove(); delete window.commandPanelKeyboard; });
  return 5;
};
if (require.main === module) {
  (async () => { const port = +process.env.TEST_PORT || 9120, server = await serve(port); let browser;
    try { browser = await launch(); const page = await browser.newPage(); await page.setViewport({ width: 1440, height: 1000 }); await page.goto('http://127.0.0.1:' + port + BASE_PATH, { waitUntil: 'networkidle0' });
      const count = await module.exports(page) + await module.exports.keyboard(page); console.log('COMMAND_ACTIONS_OK ' + count);
    } finally { if (browser) await browser.close(); server.close(); }
  })().catch(e => { console.error(e); process.exitCode = 1; });
}
