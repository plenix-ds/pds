// Plenix · tests/data-grid-setvalue-736.test.js: api.cell(id, field).setValue reaches the row's record (issue 736). Node only, no browser.
//   node tests/data-grid-setvalue-736.test.js   → SETVALUE_736_OK
// The fault: the adapter's public row() and cell() took the id as the grid's key. The grid keys rows by recordKey(id) ("string:r10", "number:3"),
//   so api.cell('r10', 'name') found no record, and commitEdit called onCellEdit with no row (row: undefined) and a record made from nothing.
// The probe is proved able to see the fault first: on the adapter before the fix, the cell's getData() is undefined and setValue hands commitEdit
//   the key 'r10', which names no record.
// Cases: a string id, a number id and a key already in the grid's form reach the same record; setValue passes the grid's key to commitEdit;
//   an id that names no row gives no record; api.getRow still answers false for it.
const shared = require('./check.js');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const Babel = require('@babel/standalone');
require('./limit.js');

const ROOT = path.join(__dirname, '..');
const load = (file, requires) => {
  const src = fs.readFileSync(path.join(ROOT, 'platform', 'components', 'DataGrid', file), 'utf8');
  const mod = { exports: {} };
  const plain = /\.ts$/.test(file) ? require('esbuild').transformSync(src, { loader: 'ts', format: 'esm', target: 'es2020' }).code : src;   // state is TypeScript
  new Function('exports', 'module', 'require', Babel.transform(plain, { presets: ['env'], sourceType: 'module' }).code)(mod.exports, mod, (name) => requires[name]);
  return mod.exports;
};
const state = load('state.ts', {});
const adapter = load('adapter.ts', { './state.ts': state, './cells.tsx': { valueText: String } });
const { recordKey } = state;

const records = [{ id: 'r10', name: 'Ten' }, { id: 3, name: 'Three' }];
const commits = [];
const live = {
  index: 'id', fields: [{ field: 'name' }], childField: null, selection: {}, rowElements: new Map(), headerElements: new Map(),
  recordsByKey: new Map(records.map((r) => [recordKey(r.id), r])),
  commitEdit: (key, field, value) => commits.push({ key, field, value, old: live.recordsByKey.get(key) }),
};
const api = adapter.createAdapter({ current: live });

let passed = 0, failed = 0;
const check = (name, fn) => { if (!shared.wanted(name)) return; try { fn(); passed++; shared.record(name, true); } catch (e) { failed++; shared.record(name, false, e.message); console.log('FAIL ' + name + ': ' + e.message); } };
check('a string id reaches its record', () => assert.strictEqual(api.cell('r10', 'name').getData(), records[0]));
check('a number id reaches its record', () => assert.strictEqual(api.cell(3, 'name').getData(), records[1]));
check('a key in the grid\'s form still works', () => assert.strictEqual(api.cell(recordKey('r10'), 'name').getData(), records[0]));
check('setValue hands commitEdit the grid\'s key, which names the record', () => {
  commits.length = 0;
  api.cell('r10', 'name').setValue('Via API');
  assert.deepStrictEqual(commits.map((c) => [c.key, c.field, c.value]), [[recordKey('r10'), 'name', 'Via API']]);
  assert.strictEqual(commits[0].old, records[0]);
});
check('setValue with a number id', () => {
  commits.length = 0;
  api.cell(3, 'name').setValue('X');
  assert.strictEqual(commits[0].old, records[1]);
});
check('api.row takes an id as well', () => assert.strictEqual(api.row('r10').getData(), records[0]));
check('an id that names no row gives no record', () => assert.strictEqual(api.cell('nope', 'name').getData(), undefined));
check('getRow still answers false for an unknown id', () => assert.strictEqual(api.getRow('nope'), false));
console.log(failed ? '\n' + failed + ' failed, ' + passed + ' passed' : 'SETVALUE_736_OK (' + passed + ' checks)');
process.exit(failed ? 1 : 0);
