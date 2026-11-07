// Plenix · Vue package generator. The CDN React components remain the implementation.
const fs = require('fs'), path = require('path');
function runtime(Vue) {
  let configured;
  const model = { Checkbox: 'checked', Switch: 'checked', Radio: 'checked', Input: 'value', Textarea: 'value', Select: 'value', SearchField: 'value', Slider: 'value', NumberInput: 'value', Combobox: 'value', OtpInput: 'value', Rating: 'value', RadioGroup: 'value', ChoiceList: 'value', DatePicker: 'value', TimePicker: 'value', Calendar: 'value' };
  function configurePlenix(value) { configured = value; }
  function resolve(value) {
    const result = value || configured || { React: globalThis.React, ReactDOM: globalThis.ReactDOM, Plenix: globalThis.Plenix };
    if (!result.React || !result.ReactDOM || !result.ReactDOM.createRoot || !result.Plenix) throw new Error('Plenix Vue needs the CDN React, ReactDOM.createRoot and Plenix globals, or configurePlenix(runtime).');
    return result;
  }
  function component(name, supplied) {
    return Vue.defineComponent({
      name: 'Plx' + name, inheritAttrs: false,
      props: { modelValue: { default: undefined } }, emits: ['update:modelValue'],
      setup(props, { attrs, slots, emit, expose }) {
        const host = Vue.shallowRef(null), owner = Vue.getCurrentInstance();
        let root, runtime, mounted = false;
        const Bridge = Vue.defineComponent({ name: 'PlenixVueSlot', props: ['revision'], setup() { return () => slots.default ? slots.default() : null; } });
        function SlotHost() {
          const target = runtime.React.useRef(null);
          runtime.React.useLayoutEffect(() => {
            const node = Vue.createVNode(Bridge, { revision: {} }); node.appContext = Object.assign({}, owner.appContext, { provides: owner.provides });
            Vue.render(node, target.current);
          });
          runtime.React.useLayoutEffect(() => () => { if (target.current) Vue.render(null, target.current); }, []);
          return runtime.React.createElement('span', { ref: target, className: 'plx-vue-slot' });
        }
        function update() {
          if (!mounted) return;
          const target = runtime.Plenix[name];
          if (!target) throw new Error('The loaded Plenix CDN does not export ' + name + '. Use matching package and CDN versions.');
                    const passed = {};
          const booleanProps = new Set(['disabled', 'checked', 'multiple', 'readOnly', 'required', 'autoFocus', 'hidden', 'open', 'selected', 'indeterminate', ...(COMPONENT_BOOLEANS[name] || [])]);
          for (const [key, value] of Object.entries(attrs)) {
            const prop = /^(data|aria)-/.test(key) ? key : key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            passed[prop] = value === '' && booleanProps.has(prop) ? true : value;
          }
          const field = name === 'Combobox' && passed.multiple ? 'values' : model[name];
          if (passed.class !== undefined) { passed.className = [passed.className, passed.class].filter(Boolean).join(' '); delete passed.class; }
          if (field && ['modelValue', 'model-value', 'onUpdate:modelValue'].some((key) => Object.prototype.hasOwnProperty.call(owner.vnode.props || {}, key))) {
            passed[field] = props.modelValue;
            const callback = passed.onChange;
            passed.onChange = (...args) => {
              const value = args[0], next = value && value.target ? value.target[field] : value;
              emit('update:modelValue', next);
              for (const listener of Array.isArray(callback) ? callback : [callback]) if (typeof listener === 'function') listener(...args);
            };
          }
          const children = slots.default ? runtime.React.createElement(SlotHost) : passed.children;
          root.render(runtime.React.createElement(target, passed, children));
        }
        Vue.onMounted(() => { runtime = resolve(supplied); root = runtime.ReactDOM.createRoot(host.value); mounted = true; update(); });
        Vue.onUpdated(update);
        Vue.onBeforeUnmount(() => { mounted = false; if (root) root.unmount(); });
        expose({ host });
        return () => Vue.h('div', { ref: host, class: 'plx-vue-host' });
      },
    });
  }
  function createVueComponents(value) { return Object.fromEntries(COMPONENT_NAMES.map((name) => [name, component(name, value)])); }
  const components = createVueComponents();
  const PlenixVue = { install(app, options = {}) { if (options.runtime) configurePlenix(options.runtime); for (const [name, wrapper] of Object.entries(components)) app.component((options.prefix === undefined ? 'Plx' : options.prefix) + name, wrapper); } };
  return { configurePlenix, createVueComponents, PlenixVue, components };
}
const { propBlocks, shipProps } = require('./lib/react-props.js');
module.exports = function buildVue(ctx) {
  const { ROOT, PKG, VERSION, SCOPE, SITE, REPO, write, json, copy } = ctx;
  const out = path.join(PKG, 'vue'), types = path.join(PKG, 'react', 'index.d.ts');
  if (!fs.existsSync(types)) throw new Error('Build the React types before the Vue package.');
  const source = fs.readFileSync(types, 'utf8');
  // the components and their props: header-typed ones and those written in TypeScript (build-packages.d/lib/react-props.js)
  const blocks = propBlocks(PKG, source), names = Object.keys(blocks);
  if (!names.length) throw new Error('No React component types found for the Vue bridge.');
  const booleans = {};
  for (const name of names) booleans[name] = [...blocks[name].matchAll(/([A-Za-z0-9_]+)[?]: boolean;/g)].map((prop) => prop[1]);
  const body = 'import * as Vue from "vue";\nconst COMPONENT_NAMES = ' + JSON.stringify(names) + ';\nconst COMPONENT_BOOLEANS = ' + JSON.stringify(booleans) + ';\nconst bridge = (' + runtime.toString() + ')(Vue);\n';
  write(path.join(out, 'index.mjs'), body + 'export const { configurePlenix, createVueComponents, PlenixVue } = bridge;\n' + names.map((name) => 'export const ' + name + ' = bridge.components.' + name + ';').join('\n') + '\nexport default PlenixVue;\n');
  write(path.join(out, 'bridge.css'), '.plx-vue-host, .plx-vue-slot { display: contents; }\n');
  shipProps(ctx, out);
  const header = 'import type * as Vue from "vue";\nimport type * as React from "react";\nimport type * as Props from "./react-props.js";\nexport interface PlenixRuntime { React: typeof React; ReactDOM: { createRoot(host: Element): { render(node: React.ReactNode): void; unmount(): void } }; Plenix: Record<string, React.ElementType> }\nexport interface VueOptions { runtime?: PlenixRuntime; prefix?: string }\ntype ModelProps = { modelValue?: unknown; "onUpdate:modelValue"?: (value: any) => void };\n';
  write(path.join(out, 'index.d.ts'), header + names.map((name) => 'export declare const ' + name + ': Vue.DefineComponent<Props.' + name + 'Props & ModelProps>;').join('\n') + '\nexport declare function configurePlenix(runtime: PlenixRuntime): void;\nexport declare function createVueComponents(runtime?: PlenixRuntime): { ' + names.map((name) => name + ': typeof ' + name).join('; ') + ' };\nexport declare const PlenixVue: Vue.Plugin<[VueOptions?]>;\nexport default PlenixVue;\n');
  json(path.join(out, 'package.json'), { name: SCOPE + '/vue', version: VERSION, description: 'Vue 3 bridges for the Plenix CDN React components', license: 'UNLICENSED', homepage: SITE + '/', repository: { type: 'git', url: 'git+' + REPO + '.git', directory: 'packages/vue' }, publishConfig: { registry: 'https://npm.pkg.github.com', access: 'restricted' }, type: 'module', main: './index.mjs', types: './index.d.ts', exports: { '.': { types: './index.d.ts', import: './index.mjs' }, './bridge.css': './bridge.css' }, files: ['*.mjs', '*.d.ts', '*.css', 'README.md', 'example', 'types'], sideEffects: ['*.css'], peerDependencies: { vue: '^3.3.0', '@types/react': '>=18 <20' } });
  write(path.join(out, 'README.md'), '# ' + SCOPE + '/vue\n\nLoad matching-version React, ReactDOM and Plenix CDN scripts and the Plenix styles first. Import "@plenix-ds/vue/bridge.css". Register `app.use(PlenixVue)` for Plx-prefixed names, or import named wrappers. `configurePlenix({ React, ReactDOM, Plenix })` supports explicit runtimes. Nothing is downloaded automatically.\n\n```vue\n<script setup>\nimport { Input, Button } from "@plenix-ds/vue";\nimport { ref } from "vue";\nconst name = ref("");\n</script>\n<template><Input v-model="name" /><Button>Save</Button></template>\n```\n\nInput, Textarea, Select, SearchField, Slider, NumberInput, OtpInput, Rating, RadioGroup, ChoiceList, Calendar, DatePicker and TimePicker bind modelValue to value. Combobox binds value, or values when multiple; Checkbox, Radio and Switch bind checked. onChange is preserved. Other components use the React prop contract unchanged. Default Vue slots are mounted through a React host, retaining Vue reactivity and app injection context. Named/render-prop slots are not converted: pass a React render function as the corresponding prop. Children requiring a specific HTML parent (for example raw option/tr/td) should use the component data props instead.\n\nThe wrapper is client-mounted; the server renders an empty host. Components and React roots unmount with their Vue owners. Props are generated from build-types.js via the React package declarations; React types are type-only, with no bundled second React runtime.\n');
  write(path.join(out, 'example', 'main.mjs'), `// Bundle with esbuild or another Vue-aware ES module bundler; load the matching CDN runtime first.
import { createApp, h, ref } from 'vue';
import { Stack, Field, Input, Button, Text, configurePlenix } from '../index.mjs';
import '../bridge.css';
export function mountExample(host, runtime) {
  if (runtime) configurePlenix(runtime);
  const app = createApp({
    setup() {
      const name = ref(''), saved = ref('');
      return () => h(Stack, { gap: 'sm' }, { default: () => [
        h(Field, { label: 'Project name' }, { default: () => h(Input, { modelValue: name.value, 'onUpdate:modelValue': (value) => { name.value = value; } }) }),
        h(Button, { onClick: () => { saved.value = name.value; } }, { default: () => 'Save project' }),
        saved.value ? h(Text, { role: 'status' }, { default: () => 'Saved ' + saved.value }) : null,
      ] });
    },
  });
  app.mount(host);
  return app;
}
const host = typeof document === 'undefined' ? null : document.querySelector('[data-plx-vue-example]');
if (host) mountExample(host);
`);
  write(path.join(out, 'example', 'README.md'), '# Vue example\n\nWith Vue and esbuild installed, run `esbuild main.mjs --bundle --format=esm --outfile=app.js` in this directory. Serve index.html over HTTP. The page loads the matching-version Plenix styles and React CDN runtime; app.js bundles the installed Vue peer. Type a project name and choose Save project. The status text updates through the Vue slot bridge. No package publication is needed.\n');
  write(path.join(out, 'example', 'index.html'), '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Plenix Vue example</title><link rel="stylesheet" href="' + SITE + '/cdn/' + VERSION + '/plenix.css"><link rel="stylesheet" href="./app.css"></head><body><main data-plx-vue-example></main><script src="' + SITE + '/cdn/' + VERSION + '/vendor/react.production.min.js"></script><script src="' + SITE + '/cdn/' + VERSION + '/vendor/react-dom.production.min.js"></script><script src="' + SITE + '/cdn/' + VERSION + '/plenix.js"></script><script type="module" src="./app.js"></script></body></html>\n');
  return 'vue: ' + names.length + ' typed CDN component bridges';
};
