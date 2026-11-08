// Plenix tests · PropertyGroup (#946, ADR 0033, D-0111): the group heading over read-only fields. Node only.
// Markup: a <section> named by its heading (aria-labelledby), the heading level (default 3), className and ...rest, children after it.
// Style: the heading takes text-group-heading-* and read-only-group-heading through the comp tokens; 40px (space-stack-group) above a
// group that follows another; the first sets no outer margin; no text-transform; the export is public.
//   node tests/property-group-946.test.js
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
const Babel = require('@babel/standalone');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
require('./limit.js');

const ROOT = path.join(__dirname, '..');
let failed = 0;
const check = (n, ok, d) => { if (!shared.check(n, ok, d)) return; if (!ok) { failed++; console.log('FAIL ' + n + (d ? ': ' + d : '')); } };
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const file = 'platform/patterns/PropertyGroup/PropertyGroup.tsx';
let html = '', html2 = '';
try {
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', Babel.transform(rd(file), { presets: ['env', 'react', 'typescript'], filename: 'PropertyGroup.tsx', sourceType: 'module' }).code)(mod.exports, mod, (n) => { if (n === 'react') return React; if (/cx\.ts$/.test(n)) return { cx: (...a) => a.filter(Boolean).join(' ') }; throw new Error('unexpected import ' + n); });
  const { PropertyGroup } = mod.exports;
  html = renderToStaticMarkup(React.createElement(PropertyGroup, { heading: 'Contact', className: 'x', 'data-k': '1' }, React.createElement('p', null, 'body')));
  html2 = renderToStaticMarkup(React.createElement(PropertyGroup, { heading: 'Case', level: 2 }, null));
} catch (e) { check('PropertyGroup renders', false, String(e.message).slice(0, 120)); }
const id = (/<h3 id="([^"]+)"/.exec(html) || [])[1];
check('a section with the class and rest props', /^<section class="plx-property-group x"/.test(html) && html.includes('data-k="1"'), html);
check('named by its heading', !!id && html.includes('aria-labelledby="' + id + '"'), html);
check('heading level 3 by default, with the class', new RegExp('<h3 id="' + id + '" class="plx-property-group__heading">Contact</h3>').test(html), html);
check('level 2 gives an h2', /<h2 /.test(html2), html2);
check('children follow the heading', html.indexOf('</h3><p>body</p>') > 0, html);

const comp = JSON.parse(rd('platform/tokens/components.tokens.json'))['plx-comp'];
const want = {
  'property-group-heading-text': 'read-only-group-heading',
  'property-group-heading-font-family': 'text-group-heading-font-family',
  'property-group-heading-font-size': 'text-group-heading-font-size',
  'property-group-heading-font-weight': 'text-group-heading-font-weight',
  'property-group-heading-line-height': 'text-group-heading-line-height',
  'property-group-heading-letter-spacing': 'text-group-heading-letter-spacing',
  'property-group-gap': 'space-stack-group',
  'property-group-heading-gap': 'space-stack-field',
};
for (const [k, v] of Object.entries(want)) check('plx-comp.' + k + ' -> ' + v, (comp[k] || {}).$value === '{plx-sys.' + v + '}', String((comp[k] || {}).$value));
let css = ''; try { css = rd('platform/patterns/PropertyGroup/property-group.css'); } catch (e) { check('property-group.css exists', false); }
check('the heading reads the comp tokens', ['text', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'].every((p) => css.includes('var(--plx-comp-property-group-heading-' + p + ')')));
check('a following group gets the 40px gap; the first none', /margin-block-start:var\(--plx-comp-property-group-gap\)/.test(css) && /:first-child\{[^}]*margin-block-start:0/.test(css));
check('no text-transform, no physical sides', !/text-transform/.test(css) && !/(^|[^-])(left|right)\s*:/.test(css));
check('platform.css imports it', rd('platform/platform.css').includes('patterns/PropertyGroup/property-group.css'));
check('the export is public', /export \{ PropertyGroup[^}]*\} from '\.\/patterns\/PropertyGroup\/PropertyGroup\.tsx'/.test(rd('platform/index.ts')));

console.log(failed ? '\nPROPERTY_GROUP_FAIL ' + failed : 'PROPERTY_GROUP_OK');
process.exit(failed ? 1 : 0);
