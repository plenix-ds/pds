// Plenix · the React components and their props, read for the framework bridges (vue, angular), and the React declarations
// they ship. Not a step of its own: build-packages.js runs only the files directly in build-packages.d/.
// A part typed from its header has `export declare const X: React.ComponentType<…>` and `export interface XProps` in
// index.d.ts. A part written in TypeScript is re-exported from tsc's types/ (D-0081, docs/adr/0011), its <Name>Props in a
// declaration there (a barrel can re-export it from another file, so every declaration is indexed).
const fs = require('fs'), path = require('path');

// { Name: props block }, each block in the header-typed form ("  name?: type;" lines, "[prop: string]" when the part
// takes its element's attributes)
function propBlocks(PKG, src) {
  const out = {};
  for (const m of src.matchAll(/export declare const (\w+): React\.ComponentType</g)) {
    const n = m[1], start = src.indexOf('export interface ' + n + 'Props');
    out[n] = start < 0 ? '' : src.slice(start, src.indexOf('\n}', start));
  }
  const props = {};
  const walk = (d) => {
    for (const f of fs.existsSync(d) ? fs.readdirSync(d) : []) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (f.endsWith('.d.ts')) {
        const t = fs.readFileSync(p, 'utf8');
        for (const m of t.matchAll(/export (?:type|interface) (\w+)Props\b/g)) {
          if (m[1] in props) continue;
          const e = t.indexOf('\n}', m.index);
          props[m[1]] = t.slice(m.index, e < 0 ? undefined : e);
        }
      }
    }
  };
  walk(path.join(PKG, 'react', 'types'));
  for (const m of src.matchAll(/export \{([^}]+)\} from "\.\/types\/[^"]+\.js"/g)) {
    for (const raw of m[1].split(',')) {
      const n = raw.trim().split(/\s+as\s+/).pop();
      if (!/^[A-Z]\w*$/.test(n) || n in out || !(n in props)) continue;
      const blk = props[n];
      out[n] = blk.split('\n').filter((l) => /^ {4}\w+\??: /.test(l)).map((l) => '  ' + l.slice(4).replace(/^(\w+)\??: /, '$1?: ')).join('\n')
        + (/HTMLAttributes|\[prop: string\]/.test(blk) ? '\n  [prop: string]' : '');
    }
  }
  return out;
}

// the React declarations a bridge's own index.d.ts imports (as ./react-props.js): index.d.ts, and the types/ folder its
// TypeScript parts are re-exported from, so "./types/…" resolves inside the bridge's package too
function shipProps({ PKG, copy, copyDir }, out) {
  copy(path.join(PKG, 'react', 'index.d.ts'), path.join(out, 'react-props.d.ts'));
  const types = path.join(PKG, 'react', 'types');
  if (fs.existsSync(types)) copyDir(types, path.join(out, 'types'));
}

module.exports = { propBlocks, shipProps };
