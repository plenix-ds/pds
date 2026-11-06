/* Plenix tests · DataGrid's two "no value" words are two keys (issue 720).
   Summary: en.json's dataGrid section had noValue twice ("(Empty)" and "No value"); the later won, so empty group rows and the
     "Add to …" label read "No value" while Arabic read (فارغ). Now: dataGrid.noValue is "(Empty)" (group rows, Add to), the
     Form Edit's hidden text has its own key, dataGrid.formNoValue "No value", and no catalog writes a key twice.
   Proof first: on 0.90.0 en.js's dataGrid.noValue reads "No value" and formNoValue does not exist: those lines fail.
   No browser. Usage: node tests/data-grid-no-value-720.test.js   → DATA_GRID_NO_VALUE_720_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const root = path.join(__dirname, '..');
(async () => {
  const en = (await import(pathToFileURL(path.join(root, 'platform/i18n/en.js')).href)).default;
  const json = JSON.parse(fs.readFileSync(path.join(root, 'platform/i18n/en.json'), 'utf8'));
  for (const [name, cat] of [['en.js', en], ['en.json', json]]) {
    assert.equal(cat.dataGrid.noValue, '(Empty)', name + ': dataGrid.noValue is "(Empty)", as the Arabic (فارغ)');
    assert.equal(cat.dataGrid.formNoValue, 'No value', name + ': the Form Edit word has its own key');
  }
  const { duplicateKeys } = await import(pathToFileURL(path.join(root, 'tools/checks/locale/locale.mjs')).href);
  for (const f of ['platform/i18n/en.json', 'platform/i18n/en.js', 'platform/i18n/ar.js'])
    assert.deepEqual(duplicateKeys(fs.readFileSync(path.join(root, f), 'utf8')), [], f + ': no key written twice');
  const read = (f) => fs.readFileSync(path.join(root, 'platform/components/DataGrid/engine', f), 'utf8');
  assert.match(read('formEdit.tsx'), /S\.formNoValue/, 'Form Edit reads formNoValue');
  assert.doesNotMatch(read('formEdit.tsx'), /S\.noValue/, 'Form Edit no longer reads the group word');
  assert.match(read('bodyRows.tsx'), /S\.noValue/, 'group rows still read noValue');
  console.log('DATA_GRID_NO_VALUE_720_OK');
})().catch((e) => { console.error(e); process.exit(1); });
