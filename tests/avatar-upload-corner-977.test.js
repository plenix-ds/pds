/* Plenix tests · AvatarUpload actions="corner" (issue 977, ADR 0034, D-0112, D-0113): a discreet corner action to change the photo.
   Summary: <AvatarUpload actions="corner" size="lg|xl|2xl">: one icon-only button at the avatar's bottom-end corner (bottom-left in right to left), named "Add photo" without a picture and "Change photo"
     with one (a Tooltip says the same), always in the tab order and visible at rest, with a target of at least 24px at every size; the secondary buttons and the description line are not drawn; Enter
     (and a click) opens the file picker without a picture; with a picture and `removable` it opens a menu with Change photo and Remove photo, and Remove hands focus back to the button; disabled draws
     no button; the default actions="buttons" is unchanged and does not accept size "lg" (development warns). Left to right and right to left.
   Proof first: before the change there is no corner button: the control is the secondary buttons beside the avatar.
   Usage: node tests/avatar-upload-corner-977.test.js   → AVATAR_UPLOAD_CORNER_977_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const PIC = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#888"/></svg>');
(async () => {
  const PORT = +process.env.TEST_PORT || 9977, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const problems = [], warns = [];
    for (const dir of ['ltr', 'rtl']) {
      const T = dir + ': ';
      const page = await browser.newPage(); page.on('pageerror', (e) => problems.push(e.message));
      page.on('console', (m) => { if (/warn/.test(m.type()) && /AvatarUpload/.test(m.text())) warns.push(m.text()); else if (/error|warn/.test(m.type()) && !/Failed to load resource|net::|was fetched at run time|AvatarUpload/.test(m.text())) problems.push(m.text()); });
      await page.setViewport({ width: 1000, height: 800 });
      await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html?react=dev', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
      const mount = (expr) => page.evaluate(async (dir, expr) => {
        document.documentElement.setAttribute('dir', dir); window.__log = []; window.__root && window.__root.unmount();
        const host = document.createElement('div'); host.id = 'c'; host.style.padding = '24px'; document.querySelector('main').replaceChildren(host);
        const h = React.createElement, P = window.Plenix; window.__root = ReactDOM.createRoot(host); window.__root.render(eval(expr)); await new Promise((r) => setTimeout(r, 700));
      }, dir, expr);
      const read = () => page.evaluate(() => {
        const root = document.querySelector('#c .plx-avatar-upload'), av = root.querySelector('.plx-avatar'), btn = root.querySelector('.plx-avatar-upload__corner');
        const ar = av.getBoundingClientRect(), br = btn && btn.getBoundingClientRect(), cs = btn && getComputedStyle(btn);
        return { corner: !!btn, name: btn && btn.getAttribute('aria-label'), tab: btn && btn.tabIndex, opacity: btn && +cs.opacity, w: br && Math.round(br.width), h: br && Math.round(br.height),
          bottom: br && Math.abs(br.bottom - ar.bottom) <= 8, end: br && (document.documentElement.dir === 'rtl' ? Math.abs(br.left - ar.left) <= 8 : Math.abs(br.right - ar.right) <= 8),
          buttons: root.querySelectorAll('button:not(.plx-avatar-upload__corner)').length, hint: !!root.querySelector('.plx-avatar-upload__hint'), disabled: btn && (btn.disabled || btn.getAttribute('aria-disabled') === 'true') };
      });
      // no picture: Add photo, at the bottom-end corner, in the tab order, at every allowed size
      for (const size of ['lg', 'xl', '2xl']) {
        await mount("h(P.AvatarUpload, { actions: 'corner', size: '" + size + "', name: 'Maya Chen', description: 'At least 200 x 200', onChange: (p) => window.__log.push(p ? 'new' : 'removed') })");
        const r = await read(), T2 = T + size + ': ';
        assert.ok(r.corner, T2 + 'the corner button is drawn'); assert.equal(r.name, 'Add photo', T2 + 'without a picture it is named "Add photo"');
        assert.ok(r.tab >= 0 && r.opacity > 0, T2 + 'it is in the tab order and visible at rest'); assert.ok(r.w >= 24 && r.h >= 24, T2 + 'its target is at least 24px (' + r.w + 'x' + r.h + ')');
        assert.ok(r.bottom && r.end, T2 + 'it sits at the bottom-end corner ' + JSON.stringify(r)); assert.equal(r.buttons, 0, T2 + 'the secondary buttons are not drawn'); assert.equal(r.hint, false, T2 + 'the description line is not drawn');
      }
      // keyboard opens the file picker
      await mount("h(P.AvatarUpload, { actions: 'corner', size: 'xl', name: 'Maya Chen', removable: true, onChange: (p) => window.__log.push(p ? 'new' : 'removed') })");
      await page.keyboard.press('Shift'); await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Add photo', T + 'Tab reaches the button');
      const chooser = page.waitForFileChooser({ timeout: 4000 }); await page.keyboard.press('Enter');
      assert.ok(await chooser.then(() => true, () => false), T + 'Enter opens the file picker');
      const chooser2 = page.waitForFileChooser({ timeout: 4000 }); await page.click('#c .plx-avatar-upload__corner');
      assert.ok(await chooser2.then(() => true, () => false), T + 'a click opens the file picker');
      // a hover shows the tooltip
      await page.hover('#c .plx-avatar-upload__corner'); await new Promise((r) => setTimeout(r, 900));
      assert.ok(await page.evaluate(() => [...document.querySelectorAll('[role=tooltip]')].some((t) => /Add photo/.test(t.textContent) && t.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))), T + 'hovering shows the tooltip "Add photo"');
      await page.mouse.move(2, 2);
      // with a picture and removable: a menu with Change photo and Remove photo
      await mount("h(P.AvatarUpload, { actions: 'corner', size: '2xl', name: 'Maya Chen', src: '" + PIC + "', removable: true, onChange: (p) => window.__log.push(p ? 'new' : 'removed') })");
      assert.equal((await read()).name, 'Change photo', T + 'with a picture it is named "Change photo"');
      await page.keyboard.press('Shift'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await new Promise((r) => setTimeout(r, 500));
      const items = await page.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem]')].map((x) => x.textContent.trim()));
      assert.deepEqual(items, ['Change photo', 'Remove photo'], T + 'a menu offers Change photo and Remove photo (' + JSON.stringify(items) + ')');
      await page.evaluate(() => [...document.querySelectorAll('[role=menu] [role=menuitem]')].find((x) => /Remove/.test(x.textContent)).click()); await new Promise((r) => setTimeout(r, 500));
      assert.deepEqual(await page.evaluate(() => window.__log), ['removed'], T + 'Remove photo runs onChange(null) once');
      assert.ok(await page.evaluate(() => document.activeElement.classList.contains('plx-avatar-upload__corner')), T + 'focus returns to the corner button');
      // no menu without removable: the picker opens
      await mount("h(P.AvatarUpload, { actions: 'corner', size: 'xl', name: 'Maya Chen', src: '" + PIC + "', removable: false })");
      await page.keyboard.press('Shift'); await page.keyboard.press('Tab'); const ch3 = page.waitForFileChooser({ timeout: 4000 }); await page.keyboard.press('Enter');
      assert.ok(await ch3.then(() => true, () => false), T + 'with removable false it opens the picker');
      // disabled draws no button; the default is unchanged
      await mount("h(P.AvatarUpload, { actions: 'corner', size: 'xl', name: 'Maya Chen', disabled: true })"); assert.equal((await read()).corner, false, T + 'disabled draws no corner button');
      await mount("h(P.AvatarUpload, { name: 'Maya Chen', description: 'At least 200 x 200' })"); const d = await read();
      assert.ok(!d.corner && d.hint, T + 'the default actions="buttons" is unchanged');
      await mount("h(P.AvatarUpload, { size: 'lg', name: 'Maya Chen' })");
    }
    assert.ok(warns.some((w) => /lg/.test(w) || /size/.test(w)), 'size "lg" with the default buttons warns in development: ' + JSON.stringify(warns.slice(0, 2)));
    assert.deepEqual(problems, [], 'no script errors or warnings: ' + problems.join(' | '));
    console.log('AVATAR_UPLOAD_CORNER_977_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
