/* Plenix tests · the print parts (issue 87, ADR 0014, design PR 319).
   Summary: PrintDocument, AnswerLines and PageBreak.
     PrintDocument on screen: a sheet 210mm wide, at least 297mm tall, 20mm padding, 1px border, 6px corners, a shadow; the header
       slot, then the children, then the footer; dir and lang on the sheet
     AnswerLines: rows 32px tall with a block-end border only; 3 lines by default, 1 to 40 clamped, an invalid count gives 3;
       a label makes it a named group, no label makes the lines aria-hidden
     PageBreak: nothing drawn on screen (zero height, aria-hidden); preview draws a dashed line
     on paper (print media): the sheet has no border, shadow, corners or padding, the break starts a new sheet, @page plx-document is A4
   Proof first: before 87 the three parts do not exist: every line fails.
   Usage: node tests/print-document-87.test.js   → PRINT_DOCUMENT_87_OK */
const assert = require('assert/strict'), { serve, launch } = require('./lib');
require('./limit.js');
const MM = 96 / 25.4;   // CSS pixels per millimetre
(async () => {
  const PORT = +process.env.TEST_PORT || 9687, server = await serve(PORT); let browser;
  try {
    browser = await launch(); const page = await browser.newPage(); const errors = [];
    page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
    await page.setViewport({ width: 1200, height: 900 });
    await page.goto('http://localhost:' + PORT + '/Plenix/tests/fixtures/platform-host.html', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.Plenix && window.ReactDOM, { timeout: 60000 });
    const out = await page.evaluate(async () => {
      const h = React.createElement, P = window.Plenix;
      const r = { has: ['PrintDocument', 'AnswerLines', 'PageBreak'].map((n) => !!P[n]) };
      if (!r.has.every(Boolean)) return r;
      document.getElementById('main').innerHTML = '<div id="c"></div>';
      ReactDOM.createRoot(document.getElementById('c')).render(h(P.PrintDocument, { id: 'doc', dir: 'rtl', lang: 'ar', header: h('p', { id: 'hd' }, 'Letterhead'), footer: h('p', { id: 'ft' }, 'End') },
        h('p', { id: 'body' }, 'Body'), h(P.AnswerLines, { id: 'a3' }), h(P.AnswerLines, { label: 'Notes', lines: 2, id: 'a2' }), h(P.AnswerLines, { lines: 99, id: 'a40' }), h(P.AnswerLines, { lines: 'x', id: 'abad' }),
        h(P.PageBreak, { id: 'pb' }), h(P.PageBreak, { preview: true, id: 'pbp' })));
      await new Promise((res) => setTimeout(res, 600));
      const q = (s) => document.querySelector(s), cs = (s) => getComputedStyle(q(s));
      const sheet = q('.plx-print-document');
      r.sheet = { w: sheet.getBoundingClientRect().width, minH: cs('.plx-print-document').minBlockSize, pad: cs('.plx-print-document').paddingTop, border: cs('.plx-print-document').borderTopWidth, radius: cs('.plx-print-document').borderTopLeftRadius, shadow: cs('.plx-print-document').boxShadow, dir: sheet.getAttribute('dir'), lang: sheet.getAttribute('lang') };
      const order = [...sheet.querySelectorAll('#hd, #body, #ft')].map((e) => e.id); r.order = order;
      const rows = (id) => q('#' + id).querySelectorAll('.plx-answer-lines__row').length;
      r.rows = { a3: rows('a3'), a2: rows('a2'), a40: rows('a40'), abad: rows('abad') };
      const row = q('#a3 .plx-answer-lines__row'); r.row = { h: row.getBoundingClientRect().height, bb: getComputedStyle(row).borderBottomWidth, bt: getComputedStyle(row).borderTopWidth };
      r.group = { a2role: q('#a2').getAttribute('role'), a2labelled: !!q('#a2').getAttribute('aria-labelledby'), a3hidden: q('#a3').getAttribute('aria-hidden') };
      r.pb = { h: q('#pb').getBoundingClientRect().height, hidden: q('#pb').getAttribute('aria-hidden'), prev: getComputedStyle(q('#pbp')).borderTopStyle + ' ' + getComputedStyle(q('#pbp')).borderTopWidth, bd: getComputedStyle(q('#pb')).breakBefore };
      return r;
    });
    assert.deepEqual(out.has, [true, true, true], 'PrintDocument, AnswerLines and PageBreak are exported');
    assert.ok(Math.abs(out.sheet.w - 210 * MM) < 1.5, 'the sheet is 210mm wide, got ' + out.sheet.w);
    assert.ok(Math.abs(parseFloat(out.sheet.minH) - 297 * MM) < 1.5, 'at least 297mm tall, got ' + out.sheet.minH);
    assert.ok(Math.abs(parseFloat(out.sheet.pad) - 20 * MM) < 1, '20mm padding, got ' + out.sheet.pad);
    assert.equal(out.sheet.border, '1px'); assert.equal(out.sheet.radius, '6px'); assert.notEqual(out.sheet.shadow, 'none');
    assert.deepEqual([out.sheet.dir, out.sheet.lang], ['rtl', 'ar'], 'dir and lang on the sheet');
    assert.deepEqual(out.order, ['hd', 'body', 'ft'], 'header, children, footer');
    assert.deepEqual(out.rows, { a3: 3, a2: 2, a40: 40, abad: 3 }, 'default 3, clamped 1 to 40, invalid gives 3');
    assert.equal(out.row.h, 32); assert.equal(out.row.bb, '1px'); assert.equal(out.row.bt, '0px');
    assert.deepEqual(out.group, { a2role: 'group', a2labelled: true, a3hidden: 'true' });
    assert.equal(out.pb.h, 0); assert.equal(out.pb.hidden, 'true'); assert.match(out.pb.prev, /^dashed 1px$/); assert.equal(out.pb.bd, 'auto', 'no break on screen');
    // on paper
    await page.emulateMediaType('print');
    const paper = await page.evaluate(() => { const s = getComputedStyle(document.querySelector('.plx-print-document')); return { border: s.borderTopWidth, shadow: s.boxShadow, radius: s.borderTopLeftRadius, pad: s.paddingTop, page: s.page, bd: getComputedStyle(document.getElementById('pb')).breakBefore }; });
    assert.deepEqual(paper, { border: '0px', shadow: 'none', radius: '0px', pad: '0px', page: 'plx-document', bd: 'page' }, 'on paper: no frame, own page, the break starts a sheet');
    assert.deepEqual(errors, [], 'no errors or warnings');
    console.log('PRINT_DOCUMENT_87_OK');
  } finally { if (browser) await browser.close(); server.close(); }
})().catch((e) => { console.error(e); process.exit(1); });
