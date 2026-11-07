/* Plenix tests · #939: date filters read a date given as ISO text, a Date, epoch milliseconds or epoch seconds the same.
   Summary: the same day (3 days ago, 22:00 local) as ISO text, a Date, milliseconds and seconds (the field says unit: "s"; no guessing from the number's size):
     "within last 7 days" (the filter condition), the date quick filter's "7" preset, "is", "before" and "after" keep or drop all four alike, and a day 20 days ago drops from all four.
     Seconds without the unit are read as milliseconds (the unit is never guessed). Empty stays empty. In America/Los_Angeles, UTC and Pacific/Auckland.
   Usage: node tests/date-filters-formats-939.test.js   → DATE_FILTERS_FORMATS_939_OK */
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), Babel = require('@babel/standalone');
const ROOT = path.join(__dirname, '..'), cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const mod = { exports: {} }; cache.set(file, mod.exports);
  const code = Babel.transform(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['transform-modules-commonjs'], presets: [['react', { runtime: 'classic' }], 'typescript'], filename: file }).code;
  const req = (spec) => {
    if (spec === 'react') return { createElement: () => null };
    if (/^plenix-platform\/icons\//.test(spec)) return { default: { name: spec.split('/').pop() } };
    if (spec.startsWith('.')) { let p = path.resolve(path.dirname(file), spec); if (!fs.existsSync(p)) p += ['.js', '.jsx', '.ts'].find((x) => fs.existsSync(p + x)) || '.tsx'; return load(p); }
    return require(spec);
  };
  new Function('module', 'exports', 'require', code)(mod, mod.exports, req);
  cache.set(file, mod.exports); return mod.exports;
}
const F = load(path.join(ROOT, 'platform/utils/format.ts')), X = load(path.join(ROOT, 'platform/utils/fields.ts'));
const at = (daysAgo) => { const d = new Date(); d.setDate(d.getDate() - daysAgo); d.setHours(22, 0, 0, 0); return d; };
const forms = (d) => ({ iso: F.isoDay(d), date: d, ms: d.getTime(), s: Math.floor(d.getTime() / 1000) });
const fieldFor = (k) => ({ value: 'd', label: 'D', kind: 'date', unit: k === 's' ? 's' : undefined });
const quick = (f, v) => X.matchesDate({ preset: '7' }, X.valueOf(f, { d: v }), undefined, f.unit);
const cond = (op, val) => (f, v) => X.matchesFilter({ join: 'and', items: [{ id: '1', field: 'd', op, value: val }] }, { d: v }, [f]);
const checks = { 'quick 7 days': quick, within: (f, v) => cond('within', X.WITHIN[0].value)(f, v), is: (f, v) => cond('is', F.isoDay(at(3)))(f, v), before: (f, v) => cond('before', F.isoDay(at(2)))(f, v), after: (f, v) => cond('after', F.isoDay(at(4)))(f, v) };
if (!process.env.PLX_TZ_939) {   // run once per zone: the zone is the process's
  for (const tz of ['America/Los_Angeles', 'UTC', 'Pacific/Auckland']) { const r = require('child_process').spawnSync(process.execPath, [__filename], { env: Object.assign({}, process.env, { TZ: tz, PLX_TZ_939: tz }), stdio: 'inherit' }); if (r.status) process.exit(r.status); }
  console.log('DATE_FILTERS_FORMATS_939_OK'); process.exit(0);
}
{ const tz = process.env.PLX_TZ_939;
  const near = forms(at(3)), far = forms(at(20));
  for (const [name, fn] of Object.entries(checks)) {
    const got = Object.keys(near).map((k) => fn(fieldFor(k), near[k]));
    assert.deepEqual(got, [true, true, true, true], tz + ' ' + name + ': 3 days ago kept as iso, Date, ms, seconds ' + JSON.stringify(got));
  }
  for (const name of ['quick 7 days', 'within']) {
    const got = Object.keys(far).map((k) => checks[name](fieldFor(k), far[k]));
    assert.deepEqual(got, [false, false, false, false], tz + ' ' + name + ': 20 days ago dropped alike ' + JSON.stringify(got));
  }
  assert.equal(quick({ value: 'd', kind: 'date' }, near.s), false, 'seconds without the unit are read as milliseconds (1970), never guessed');
  assert.equal(quick(fieldFor('s'), ''), false, 'empty stays empty');
}
