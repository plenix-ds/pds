// Plenix tests · the in-page probe of the component-tokens test (tests/component-tokens.test.js): prepare() and check() run in
// the page (page.evaluate). Its own file since #1337, so tests/component-tokens-probe-1337.test.js runs it on fixtures.
// runs in the page: copies the state rules onto the test attribute (once per document)
function prepare() {
  if (window.__plxTokenStates) return;
  window.__plxTokenStates = true;
  const STATE = { ':hover': 'hover', ':focus-visible': 'focus', ':focus-within': 'within', ':focus': 'focus', ':active': 'active' };
  const swap = (sel) => sel.replace(/:(hover|focus-visible|focus-within|focus|active)\b/g, (m) => '[data-plx-test-state~="' + STATE[m] + '"]');
  const walk = (list, owner) => {
    for (let i = list.length - 1; i >= 0; i--) {
      const r = list[i];
      if (r.styleSheet) { try { walk(r.styleSheet.cssRules, r.styleSheet); } catch (e) { /* unreadable */ } continue; }
      if (r.cssRules && !r.selectorText) { try { walk(r.cssRules, r); } catch (e) { /* unreadable */ } continue; }
      if (r.selectorText && /:(hover|focus-visible|focus-within|focus|active)\b/.test(r.selectorText) && /--plx-comp-/.test(r.style.cssText)) {
        try { owner.insertRule(swap(r.selectorText) + '{' + r.style.cssText + '}', i + 1); } catch (e) { /* the browser rejects it */ }
      }
    }
  };
  Array.from(document.styleSheets).forEach((s) => { try { walk(s.cssRules, s); } catch (e) { /* unreadable */ } });
}

// runs in the page: checks each rule × property × token on up to three matching elements; skips the keys already wired
function check(done) {
  const DONE = new Set(done);
  const COLOR = /(^|-)(color|fill|stroke|shadow)$|^background$|^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?$|^outline$|^text-decoration$|^caret-color$/;
  const MARKS = ['37px', '0.37', '9', '"Courier New"', '900', 'none', 'hidden', 'solid', 'dashed', 'translateX(7px)', '123px 45px', 'linear-gradient(rgb(1, 2, 3), rgb(1, 2, 3))'];
  const STATE = { hover: 'hover', 'focus-visible': 'focus', 'focus-within': 'within', focus: 'focus', active: 'active' };
  const out = { wired: [], dead: {} };
  const rules = [];
  // a rule inside @container holds only where its container's condition does (#1337: the SplitView's narrow rule was read on a
  // wide SplitView): each rule keeps the @container rules around it (cq), and live() asks the browser on each element
  const conds = [];
  const walk = (list, cq) => {
    for (const r of list) {
      if (r.styleSheet) { try { walk(r.styleSheet.cssRules, cq); } catch (e) { /* unreadable */ } continue; }
      if (r instanceof CSSMediaRule) { if (window.matchMedia(r.conditionText).matches) try { walk(r.cssRules, cq); } catch (e) { /* unreadable */ } continue; }
      if (typeof CSSContainerRule !== 'undefined' && r instanceof CSSContainerRule) { conds.push(r); try { walk(r.cssRules, (cq || []).concat(conds.length - 1)); } catch (e) { /* unreadable */ } continue; }
      if (r.cssRules && !r.selectorText) { try { walk(r.cssRules, cq); } catch (e) { /* unreadable */ } continue; }
      if (!r.selectorText || !/--plx-comp-/.test(r.style.cssText) || /data-plx-test-state/.test(r.selectorText)) continue;
      for (let i = 0; i < r.style.length; i++) {
        const prop = r.style[i]; if (/^--|^(transition|animation)/.test(prop)) continue;   // motion is reduced on every test page
        const v = r.style.getPropertyValue(prop);
        const tokens = [...new Set((v.match(/--plx-comp-[\w-]+/g) || []))];
        tokens.forEach((t) => rules.push({ sel: r.selectorText, prop, token: t.slice(2), cq }));
      }
    }
  };
  Array.from(document.styleSheets).forEach((s) => { try { walk(s.cssRules); } catch (e) { /* unreadable */ } });
  // whether the @container rules cq hold for el: a marker rule inside each one ([data-plx-test-cq="<n>"]) is read on el, so the
  // browser evaluates the condition itself (ranges, rem, names, scroll-state); a rule the browser refuses counts as holding
  const live = (el, cq) => !cq || cq.every((n) => {
    const c = conds[n];
    if (!c.__plxProbe) { try { c.insertRule('[data-plx-test-cq="' + n + '"]{--plx-test-cq:on}', c.cssRules.length); c.__plxProbe = 'on'; } catch (e) { c.__plxProbe = 'off'; } }
    if (c.__plxProbe === 'off') return true;
    el.setAttribute('data-plx-test-cq', String(n));
    const on = getComputedStyle(el).getPropertyValue('--plx-test-cq').trim() === 'on';
    el.removeAttribute('data-plx-test-cq');
    return on;
  });
  // where an element sits: its classes and its parents' (#1337: three folders came before a file, and the folder rule wins
  // over the file icon's color on each of them)
  const place = (el) => { const s = []; for (let e = el, n = 0; e && n < 6; e = e.parentElement, n++) s.push(e.tagName + '.' + (e.getAttribute('class') || '')); return s.join('<'); };
  const read = (el, pseudo, prop) => getComputedStyle(el, pseudo || null).getPropertyValue(prop).trim();
  for (const x of rules) {
    const key = x.sel + ' | ' + x.prop + ' | ' + x.token;
    if (DONE.has(key)) continue;
    // each selector of a list on its own: the part, its pseudo-element and its states
    const parts = x.sel.split(/,(?![^(]*\))/).map((p) => p.trim());
    let matched = false, moved = false, why = '';
    for (const part of parts) {
      // a state inside :has() (a row that holds a focused button) is the state of another element: not forced here
      if (/:has\([^)]*:(hover|focus-visible|focus-within|focus|active)/.test(part)) continue;
      const pe = /::?(before|after|placeholder|marker|selection|backdrop|-webkit-[\w-]+)\s*$/.exec(part);
      const base = pe ? part.slice(0, pe.index) : part;
      const states = [...new Set((base.match(/:(hover|focus-visible|focus-within|focus|active)\b/g) || []).map((m) => STATE[m.slice(1)]))];
      const plain = base.replace(/:(hover|focus-visible|focus-within|focus|active)\b/g, '');
      let els = [];
      // up to six elements where the rule holds, each in a different place (the first one wires most rules)
      try {
        const seen = new Set();
        for (const e of document.querySelectorAll(plain || '*')) {
          if (els.length >= 6) break;
          if (!(e.getClientRects().length || pe) || !live(e, x.cq)) continue;
          const k = place(e); if (seen.has(k)) continue;
          seen.add(k); els.push(e);
        }
      } catch (e) { continue; }
      for (const el of els) {
        matched = true;
        const had = el.getAttribute('data-plx-test-state');
        if (states.length) el.setAttribute('data-plx-test-state', states.join(' '));
        const pseudo = pe ? '::' + pe[1] : null;
        const before = read(el, pseudo, x.prop);
        const marks = COLOR.test(x.prop) ? ['rgb(1, 2, 3)', '3px solid rgb(1, 2, 3)', 'rgb(1, 2, 3) 0px 0px 0px 3px'] : MARKS;
        for (const m of marks) {
          el.style.setProperty('--' + x.token, m);
          const after = read(el, pseudo, x.prop);
          el.style.removeProperty('--' + x.token);
          if (after !== before) { moved = true; break; }
        }
        if (had === null) el.removeAttribute('data-plx-test-state'); else el.setAttribute('data-plx-test-state', had);
        if (moved) break;
        why = 'reads ' + before.slice(0, 40) + ' on ' + el.tagName.toLowerCase() + '.' + String(el.className).split(' ').slice(0, 2).join('.');
      }
      if (moved) break;
    }
    if (moved) out.wired.push(key); else if (matched) out.dead[key] = why;
  }
  return out;
}

module.exports = { prepare, check };
