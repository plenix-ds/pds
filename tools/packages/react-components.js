// Plenix · tools/packages/react-components.js: the React components of the published declarations, for the Angular, Vue and web-component bridges (issue 871).
// The bridges need each component's name, its props and which of them are booleans. They used to read `export declare const X: React.ComponentType<` and
// `export interface XProps` lines that build-types.js wrote for parts documented in JavaScript header comments; the parts are TypeScript now and the
// declarations re-export them from ./types/, so the names and props are read from the declarations with the TypeScript compiler.
// Usage: const { names, booleans, props } = require('./react-components.js')(path.join(PKG, 'react', 'index.d.ts'));
// Returns: names: the bridged components (bridge-components.json: the 18 the bridges shipped in 0.91.0) that the declarations export as callable values, in the order of the file;
//   props[name]: { keys: its prop names, booleans: those typed boolean, open: it also takes anything ([prop: string]: any) };  booleans[name]: props[name].booleans
const path = require('path');
const ts = require('typescript');

const BRIDGED = require('./bridge-components.json');   // the components the bridges ship (the 18 of 0.91.0); widening the list is a decision for G3

module.exports = function reactComponents(file) {
  const program = ts.createProgram([file], { noEmit: true, skipLibCheck: true, jsx: ts.JsxEmit.Preserve, moduleResolution: ts.ModuleResolutionKind.Bundler, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, types: [], strict: false });
  const checker = program.getTypeChecker(), source = program.getSourceFile(path.resolve(file));
  if (!source) throw new Error('react-components: cannot read ' + file);
  const symbol = checker.getSymbolAtLocation(source);
  if (!symbol) throw new Error('react-components: ' + file + ' exports nothing');
  const names = [], props = {}, booleans = {};
  for (const exported of checker.getExportsOfModule(symbol)) {
    const name = exported.getName();
    if (!BRIDGED.includes(name)) continue;   // a component, not a constant (DATA_COLORS) or a hook
    const resolved = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (!(resolved.flags & (ts.SymbolFlags.Value))) continue;
    const decl = resolved.valueDeclaration || (resolved.declarations || [])[0];
    if (!decl) continue;
    const type = checker.getTypeOfSymbolAtLocation(resolved, decl);
    const signature = type.getCallSignatures()[0];
    if (!signature || !signature.parameters.length) continue;
    const param = signature.parameters[0], propsType = checker.getTypeOfSymbolAtLocation(param, decl);
    const apparent = checker.getApparentType(propsType);
    const keys = [], bools = [];
    for (const prop of apparent.getProperties()) {
      const key = prop.getName(), valueType = checker.getTypeOfSymbolAtLocation(prop, decl);
      if (!/^[A-Za-z_$][\w$]*$/.test(key)) continue;
      // Plenix's own props, not the element attributes it inherits from @types/react
      if ((prop.declarations || []).every((d) => /node_modules/.test(d.getSourceFile().fileName))) continue;
      keys.push(key);
      const parts = valueType.isUnion() ? valueType.types.filter((t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null))) : [valueType];
      if (parts.length && parts.every((t) => t.flags & ts.TypeFlags.BooleanLike)) bools.push(key);
    }
    const open = true;   // as before: every component also takes the element's own attributes and events (the bridges add their default keys)
    names.push(name); props[name] = { keys, booleans: bools, open }; booleans[name] = bools;
  }
  const missing = BRIDGED.filter((n) => !names.includes(n));
  if (missing.length) throw new Error('react-components: not found in ' + file + ': ' + missing.join(', '));
  return { names, props, booleans };
};
