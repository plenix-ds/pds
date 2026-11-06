/* Plenix tests · #527: Tag's corner radii are the logical corners (border-start-start-radius …), not the physical left and right, so right-to-left
   needs no special case. Usage: node tests/tag-logical-radius-527.test.js -> TAG_LOGICAL_RADIUS_527_OK */
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const css = fs.readFileSync(path.join(__dirname, '..', 'platform', 'components', 'Tag', 'tag.css'), 'utf8');
const physical = css.match(/border-(top|bottom)-(left|right)-radius/g) || [];
assert.deepEqual(physical, [], 'tag.css has physical corner radii: ' + physical.join(', '));
assert.ok(/border-start-start-radius/.test(css) && /border-end-end-radius/.test(css), 'the logical corners are used');
console.log('TAG_LOGICAL_RADIUS_527_OK');
