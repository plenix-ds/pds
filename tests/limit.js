// Plenix tests · a hard time limit for every test: a stuck run fails fast, naming what it was doing, instead of hanging
// (owner, 2026-10-13: a per-push CI run took almost two hours). Required by tests/lib.js, so every browser test has it.
//   TEST_TIMEOUT_MS=<ms>   the limit (default 15 minutes; 90 with TEST_SCOPE=full)
//   require('./limit.js').at('settings/index.html')   the step the timeout message names
//   require('./limit.js').excluding(() => spawnSync(...))   a child test's time is not charged to its parent
const path = require('path');
const LIMIT = +process.env.TEST_TIMEOUT_MS || (process.env.TEST_SCOPE === 'full' ? 90 : 15) * 60000;
const NAME = path.basename(process.argv[1] || 'test').replace(/\.test\.js$/, '').replace(/\.js$/, '').toUpperCase().replace(/-/g, '_');
let step = '';
let deadline = Date.now() + LIMIT;
let timer;
function arm() {
  timer = setTimeout(() => {
    console.log(NAME + '_FAIL timed out after ' + Math.round(LIMIT / 1000) + 's (TEST_TIMEOUT_MS)' + (step ? ' on ' + step : ''));
    process.exit(1);
  }, Math.max(0, deadline - Date.now()));
  timer.unref();   // the limit never keeps a finished test alive
}
arm();
// limit.excluding(() => spawnSync(...child test...)): the time a child test takes is not charged to its parent (#1327).
// The child has its own limit; a parent that runs its children one after another (Layout, the DataGrid, Reflow) counts
// only its own work. spawnSync blocks the event loop, so without this the parent's timer fired right after its last child.
function excluding(work) {
  const started = Date.now();
  try { return work(); } finally {
    clearTimeout(timer);
    deadline += Date.now() - started;
    arm();
  }
}
module.exports = { LIMIT, at: (s) => { step = s; }, excluding };
