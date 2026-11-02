// Plenix · tests/field-warning-811.test.js: the warning field state (issue 811). Node only, no browser, reads the source.
//   node tests/field-warning-811.test.js   → FIELD_WARNING_811_OK
// What it holds: Field has a warning prop that is announced politely (role status) with an icon and the catalog's word "Warning" for screen
//   readers (the color is never the only cue); an error wins over a warning; the control gets warning unless it sets its own; every
//   control that sets aria-invalid also takes warning and marks data-plx-warning; the styles read only existing feedback-warning roles (no new
//   color), keep the warning border while focused, and never overlap the invalid rules (the :not lists); the catalogs (en.json, en.js, ar.js) have
//   field.warning.
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
require('./limit.js');   // the hard time limit (TEST_TIMEOUT_MS)

const ROOT = path.join(__dirname, '..', 'platform');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
let passed = 0, failed = 0;
const check = (name, fn) => { if (!shared.wanted(name)) return; try { fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };

const field = read('components/Field/Field.tsx');
check('Field takes warning, shows it with an icon and the word, politely', () => {
  assert.ok(/error, warning, required/.test(field), 'the prop');
  assert.ok(/role="status"/.test(field) && /plx-field__warning/.test(field), 'the status line');
  assert.ok(/<Icon icon=\{WarningIcon\}/.test(field), 'the icon');
  assert.ok(/warnWord/.test(field) && /plx-visually-hidden/.test(field), 'the word for screen readers');
});
check('an error wins over a warning', () => assert.ok(/const showWarning = !!warning && !error/.test(field)));
check('the warning is in the control\'s description', () => assert.ok(/useDescribedBy\([^)]*errId, warnId\)/.test(field)));
check('the control gets warning unless it sets its own', () => assert.ok(/child\.props\.warning !== undefined\) props\.warning = child\.props\.warning;\s*else if \(showWarning\) props\.warning = true/.test(field)));

const controls = ['Input/Input', 'Combobox/Combobox', 'Cascader/Cascader', 'TreeSelect/TreeSelect', 'TimeZoneSelect/TimeZoneSelect', 'TimePicker/TimePicker', 'DatePicker/DatePicker', 'EntityPicker/EntityPicker', 'OtpInput/OtpInput'];
check('every control that sets aria-invalid marks data-plx-warning beside it', () => controls.forEach((c) => {
  // the control's source under whichever name it has now: TypeScript (.tsx, #708) or not yet (.jsx)
  const s = read(['.tsx', '.jsx'].map((x) => 'components/' + c + x).find((f) => fs.existsSync(path.join(ROOT, f))) || 'components/' + c + '.jsx');
  const a = (s.match(/aria-invalid=\{/g) || []).length, w = (s.match(/data-plx-warning=\{warning \|\| undefined\}/g) || []).length;
  assert.ok(a > 0 && w === a, c + ': ' + a + ' aria-invalid, ' + w + ' data-plx-warning');
}));
check('the controls that draw their own box take warning too', () => {
  assert.ok(/data-plx-warning=\{warning \|\| undefined\}>/.test(read('components/CodeEditor/CodeEditor.jsx')), 'CodeEditor');
  assert.ok(/data-plx-warning=\{warning \|\| undefined\} \{\.\.\.rest\}/.test(read('components/RichTextEditor/RichTextEditor.jsx')), 'RichTextEditor');
  assert.ok(/data-plx-warning=\{isWarning \|\| undefined\}/.test(read('components/InputGroup/InputGroup.tsx')), 'InputGroup');
  assert.ok(/warning=\{warning\}/.test(read('components/NumberInput/NumberInput.tsx')), 'NumberInput passes it to its group');
  assert.ok(/warning=\{warning\}/.test(read('components/RelativeDateInput/RelativeDateInput.tsx')), 'RelativeDateInput passes it on');
});

const input = read('components/Input/input.css');
check('the input styles: warning border kept while focused and hovered, fill, and no overlap with invalid', () => {
  assert.ok(/\.plx-input\[data-plx-warning="true"\]:where\(:not\(\[aria-invalid="true"\]\)\)\{--plx-state-input-border:var\(--plx-comp-input-warning-border-color\)/.test(input), 'border');
  assert.ok(/:is\(:focus-visible[^}]*\):where\(:not\(\[aria-invalid="true"\], \[data-plx-warning="true"\]\)\)/.test(input), 'focus rule leaves the warning border');
  assert.ok(/:is\(:hover, \.is-hover\):where\(:not\(\[aria-invalid="true"\], \[data-plx-warning="true"\]/.test(input), 'hover rule leaves the warning border');
  assert.ok(/--plx-state-input-background:var\(--plx-comp-input-warning-background\)/.test(input), 'fill');
});
check('the warning tokens use the existing feedback-warning roles only', () => {
  const t = [read('tokens/components/input.tokens.json'), read('tokens/components/field.tokens.json')].join('\n');
  ['input-warning-border-color', 'input-warning-background', 'field-warning-text'].forEach((n) => {
    const m = new RegExp('"' + n + '":\\s*\\{\\s*"\\$value":\\s*"\\{plx-sys\\.feedback-warning-(content|soft)\\}"').exec(t);
    assert.ok(m, n + ' is not a feedback-warning role');
  });
  ['code-editor', 'input-group', 'rich-text-editor'].forEach((n) => assert.ok(/\{plx-comp\.input-warning-border-color\}/.test(read('tokens/components/' + n + '.tokens.json')), n));
  assert.ok(!/#[0-9a-fA-F]{3,8}\b|rgb\(/.test(['input', 'field'].map((n) => read('tokens/components/' + n + '.tokens.json').split('warning').slice(1).join('')).join('')), 'a raw color');
});
check('the catalogs have field.warning', () => {
  assert.ok(typeof JSON.parse(read('i18n/en.json')).field.warning === 'string', 'en.json');
  assert.ok(/"field": \{[\s\S]*?"warning": "Warning"/.test(read('i18n/en.js')), 'en.js');
  assert.ok(/"field": \{[\s\S]*?"warning": "[؀-ۿ]+"/.test(read('i18n/ar.js')), 'ar.js');
});
console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'FIELD_WARNING_811_OK (' + passed + ' checks)');
process.exit(failed ? 1 : 0);
