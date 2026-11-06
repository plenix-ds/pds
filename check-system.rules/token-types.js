// Plenix · check-system rule "token-types" (docs/adr/0002, #499, #502): every token says what kind of value it holds.
// A plx-ref, plx-sys or plx-comp token in platform/tokens/**/*.tokens.json is a finding when it has no "$type" of its own,
// no group above it gives one (DTCG: a group's $type applies to the tokens inside it), and it isn't web only
// ($extensions["com.plenix"].webOnly: a CSS value DTCG has no type for, such as a keyword, mm, %, a ratio or a grid
// template; tools/token-value.js). The token index, the typed-value build and the native files read $type.
// A $deprecated token (a renamed token's alias, docs/adr/0012) is checked too: it keeps the type of the token it points to.
// Alone: node check-system.rules/token-types.js   -> TOKEN_TYPES_OK, or the findings and exit 1
const path = require('path');
const G = require('./token-graph.js');

const NAME = 'token-types';
const TIERS = ['plx-ref', 'plx-sys', 'plx-comp'];

function findings(docs = G.load()) {
  const out = [];
  for (const { file, data } of docs) {
    for (const tier of TIERS) {
      const walk = (o, at, inherited) => {
        if (!o || typeof o !== 'object') return;
        const own = o.$extensions && o.$extensions['com.plenix'] && o.$extensions['com.plenix'].webOnly;
        const type = typeof o.$type === 'string' ? o.$type : own ? 'web-only' : inherited;
        if ('$value' in o) {
          if (!type) out.push({ file, text: tier + '.' + at.join('-') + ' has no $type: add one ("dimension", "number", "color", "fontWeight", …), or mark a CSS-only value $extensions["com.plenix"].webOnly' });
          return;
        }
        for (const k of Object.keys(o)) if (k[0] !== '$') walk(o[k], at.concat(k), type);
      };
      if (data && data[tier]) walk(data[tier], [], null);
    }
  }
  return out;
}

function check({ add }) { for (const f of findings()) add(NAME, f.file, 0, f.text); }
module.exports = { check, findings, NAME };

if (require.main === module) {
  const list = findings();
  list.forEach((f) => console.log('  ' + path.relative(G.ROOT, f.file).split(path.sep).join('/') + '  ' + f.text));
  console.log(list.length ? 'TOKEN_TYPES_FAIL (' + list.length + ')' : 'TOKEN_TYPES_OK');
  process.exit(list.length ? 1 : 0);
}
