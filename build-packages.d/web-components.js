// Plenix · generated package source. Edit this build step; build-packages.js clears release/packages/ before invoking it.
const SOURCE = String.raw`
// @plenix-ds/web-components: React-backed custom elements, with explicitly injected peers and shadow styles.
export const elementNames = __ELEMENTS__;
const ENV = ['lang', 'dir', 'data-plx-theme', 'data-plx-mode', 'data-plx-density', 'data-plx-density-policy', 'data-plx-interaction'];
const BOOLEAN = new Set(['disabled', 'checked', 'required', 'readonly', 'multiple', 'open', 'loading', 'selected', 'pressed', 'expanded', 'truncate']);
const NUMERIC = new Set(['count', 'page', 'page-count', 'max', 'min', 'step', 'lines', 'value-as-number']);
const EVENTS = ['onClick', 'onChange', 'onSelect', 'onClose', 'onOpenChange', 'onValueChange'];
const tagName = (name) => 'plx-' + name.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const propName = (name) => /^(aria|data)-/.test(name) ? name : name === 'readonly' ? 'readOnly' : name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const defaults = () => ({ React: globalThis.React, ReactDOM: globalThis.ReactDOM, Plenix: globalThis.Plenix });

export function defineElement(name, Component, options = {}) {
  const runtime = Object.assign(defaults(), options);
  const { React, ReactDOM } = runtime;
  if (!React || !ReactDOM || !ReactDOM.createRoot || !ReactDOM.flushSync) throw new Error('Plenix elements require React 18, ReactDOM.createRoot and ReactDOM.flushSync.');
  const registry = options.registry || globalThis.customElements;
  if (!registry) throw new Error('Custom elements are not available in this environment.');
  const tag = name.startsWith('plx-') ? name : tagName(name);
  if (registry.get(tag)) return registry.get(tag);
  if (!Component) throw new Error('A Plenix React component is required for ' + tag + '.');
  const formControl = !!options.formControl;
  class PlenixElement extends HTMLElement {
    static formAssociated = formControl;
    constructor() {
      super();
      this._props = {};
      this._inherited = new Map();
      this.attachShadow({ mode: 'open', delegatesFocus: true });
      this._mount = this.ownerDocument.createElement('div'); this._mount.className = 'plx-web-component';
      const stylesheet = this.ownerDocument.createElement('link');
      stylesheet.rel = 'stylesheet'; stylesheet.href = options.styleURL || new URL('./plenix-shadow.css', import.meta.url).href;
      this.shadowRoot.append(stylesheet, this._mount);
      this._internals = formControl && this.attachInternals ? this.attachInternals() : null;
      this._attrs = new MutationObserver(() => { this._syncEnvironment(); this._render(); });
      this._environment = new MutationObserver(() => this._syncEnvironment());
    }
    get props() { return Object.assign({}, this._props); }
    set props(value) { this._props = Object.assign({}, value); this._render(); }
    get value() { return this._props.value !== undefined ? this._props.value : this.getAttribute('value') || ''; }
    set value(value) { this._props.value = value; this._render(); }
    get checked() { return this._props.checked !== undefined ? this._props.checked : this.hasAttribute('checked') && this.getAttribute('checked') !== 'false'; }
    set checked(value) { this._props.checked = !!value; this._render(); }
    get disabled() { return this._props.disabled !== undefined ? this._props.disabled : this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false'; }
    set disabled(value) { this._props.disabled = !!value; this._render(); }
    get form() { return this._internals ? this._internals.form : null; }
    get name() { return this.getAttribute('name') || ''; }
    get type() { return tag; }
    get validity() { return this._internals && this._internals.validity; }
    get validationMessage() { return this._internals ? this._internals.validationMessage : ''; }
    checkValidity() { return this._internals ? this._internals.checkValidity() : true; }
    reportValidity() { return this._internals ? this._internals.reportValidity() : true; }
    connectedCallback() {
      // Properties assigned before registration must pass through their upgraded setters.
      ['props', 'value', 'checked', 'disabled'].forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this, key)) { const value = this[key]; delete this[key]; this[key] = value; }
      });
      if (!this._root) this._root = ReactDOM.createRoot(this._mount);
      this._attrs.observe(this, { attributes: true, childList: true });
      this._environment.observe(this.ownerDocument.documentElement, { subtree: true, attributes: true, attributeFilter: ENV });
      this._syncEnvironment(); this._render();
      if (!this._initial) this._initial = { value: this.value, checked: this.checked };
    }
    disconnectedCallback() {
      this._attrs.disconnect(); this._environment.disconnect();
      queueMicrotask(() => { if (!this.isConnected && this._root) { this._root.unmount(); this._root = null; } });
    }
    formDisabledCallback(disabled) { this._formDisabled = disabled; this._render(); }
    formResetCallback() { this._props.value = this._initial.value; this._props.checked = this._initial.checked; this._render(); }
    formStateRestoreCallback(state) { if (options.checked) this.checked = state !== null && state !== ''; else this.value = state || ''; }
    _syncEnvironment() {
      let changed = false;
      ENV.forEach((name) => {
        const current = this.getAttribute(name), inherited = this._inherited.get(name);
        if (current !== null && current !== inherited) return; // an explicit host setting wins
        const ancestor = this.parentElement && this.parentElement.closest('[' + name + ']');
        const value = ancestor ? ancestor.getAttribute(name) : null;
        if (value !== current) { if (value === null) this.removeAttribute(name); else this.setAttribute(name, value); changed = true; }
        if (value === null) this._inherited.delete(name); else this._inherited.set(name, value);
      });
      if (changed) this._render();
    }
    _readProps() {
      const props = {};
      [...this.attributes].forEach(({ name, value }) => {
        if (name === 'class' || name === 'style' || name === 'slot' || ENV.includes(name)) return;
        props[propName(name)] = BOOLEAN.has(name) ? value !== 'false' : NUMERIC.has(name) && value !== '' ? Number(value) : value;
      });
      return Object.assign(props, this._props, this._formDisabled ? { disabled: true } : {});
    }
    _render() {
      if (!this._root || !this.isConnected) return;
      const props = this._readProps();
      if (formControl) { if (props.value === undefined) props.value = this.value; if (options.checked && props.checked === undefined) props.checked = this.checked; }
      EVENTS.forEach((handler) => {
        const callback = props[handler], eventName = 'plx-' + handler.slice(2).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        props[handler] = (...args) => {
          const event = args[0], target = event && event.target;
          const detail = target ? { value: target.value, checked: target.checked, originalEvent: event.nativeEvent || event } : { value: event, args };
          if (handler === 'onChange' || handler === 'onValueChange') {
            if (options.checked && target) this._props.checked = !!target.checked;
            else this._props.value = detail.value;
            queueMicrotask(() => this._render());
          }
          if (typeof callback === 'function') callback(...args);
          const accepted = this.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true, cancelable: true }));
          if (!accepted && event && event.preventDefault) event.preventDefault();
          this._syncForm();
        };
      });
      const children = props.children === undefined ? (this.hasChildNodes() ? React.createElement('slot') : undefined) : props.children;
      ReactDOM.flushSync(() => this._root.render(React.createElement(Component, props, children)));
      this._syncForm();
    }
    _syncForm() {
      if (!this._internals) return;
      const props = this._readProps();
      const value = options.checked && this._props.value === undefined && !this.hasAttribute('value') ? 'on' : this.value;
      this._internals.setFormValue(props.disabled || (options.checked && !this.checked) ? null : String(value == null ? '' : value));
      const control = this.shadowRoot.querySelector('input, textarea, select');
      if (control && control.validity) {
        const flags = {};
        ['badInput', 'customError', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing'].forEach((key) => { if (control.validity[key]) flags[key] = true; });
        this._internals.setValidity(flags, control.validationMessage || '', control);
      }
    }
  }
  registry.define(tag, PlenixElement);
  return PlenixElement;
}

export function defineElements(options = {}) {
  const runtime = Object.assign(defaults(), options), P = runtime.Plenix;
  if (!P) throw new Error('Pass the @plenix-ds/react exports as Plenix, or load the browser global first.');
  const controls = new Set(['Input', 'Textarea', 'Select', 'Checkbox', 'Switch', 'NumberInput']);
  return Object.fromEntries(elementNames.filter((name) => P[name]).map((name) => [name, defineElement(name, P[name], Object.assign({}, runtime,
    { formControl: controls.has(name), checked: name === 'Checkbox' || name === 'Switch' }))]));
}
`;

module.exports = function buildWebComponents(ctx) {
  const fs = require('fs'), path = require('path');
  const { PKG, VERSION, SCOPE, SITE, REPO, write, json } = ctx, dest = path.join(PKG, 'web-components');
  const names = require('../tools/packages/react-components.js')(path.join(PKG, 'react', 'index.d.ts')).names.filter((name) => !/(Provider|Context)$/.test(name));
  const runtime = SOURCE.replace('__ELEMENTS__', JSON.stringify(names));
  write(path.join(dest, 'index.js'), runtime);
  const css = fs.readFileSync(path.join(PKG, 'styles', 'plenix.min.css'), 'utf8').replace(/(?::root|(?<![\w-])html)((?:\[[^\]]+\])*)/g, (match, attrs) => attrs ? ':host(' + attrs + ')' : ':host');
  write(path.join(dest, 'plenix-shadow.css'), css.replace(/^(@layer [^;]+;)/, '$1@layer plx.components{:host{display:contents}.plx-web-component{display:contents}}'));
  ctx.copyDir(path.join(PKG, 'styles', 'fonts'), path.join(dest, 'fonts')); ctx.copy(path.join(PKG, 'styles', 'fonts.css'), path.join(dest, 'fonts.css'));
  write(path.join(dest, 'index.d.ts'), 'import type * as React from "react";\nexport interface PlenixElement extends HTMLElement { props: Record<string, unknown>; value: unknown; checked: boolean; disabled: boolean; checkValidity(): boolean; reportValidity(): boolean; }\nexport interface ElementOptions { React?: typeof React; ReactDOM?: { createRoot: Function; flushSync: Function }; Plenix?: Record<string, unknown>; registry?: CustomElementRegistry; styleURL?: string; formControl?: boolean; checked?: boolean; }\nexport declare const elementNames: string[];\nexport declare function defineElement(name: string, component: React.ElementType, options?: ElementOptions): CustomElementConstructor;\nexport declare function defineElements(options?: ElementOptions): Record<string, CustomElementConstructor>;\n');
  json(path.join(dest, 'package.json'), { name: SCOPE + '/web-components', version: VERSION, type: 'module', description: 'Plenix React custom elements with shadow styles and form-associated controls.', license: 'UNLICENSED', main: 'index.js', types: 'index.d.ts',
    exports: { '.': { types: './index.d.ts', import: './index.js' }, './plenix-shadow.css': './plenix-shadow.css', './fonts.css': './fonts.css', './fonts/*': './fonts/*', './package.json': './package.json' },
    peerDependencies: { react: '>=18.2.0 <19', 'react-dom': '>=18.2.0 <19', [SCOPE + '/react']: VERSION }, sideEffects: ['*.css'], repository: { type: 'git', url: REPO }, publishConfig: { registry: 'https://npm.pkg.github.com', access: 'restricted' } });
  write(path.join(dest, 'README.md'), '# ' + SCOPE + '/web-components\n\nImport defineElements, React, Plenix, createRoot from react-dom/client, and flushSync from react-dom; pass { React, ReactDOM: { createRoot, flushSync }, Plenix }. Alternatively load the React/ReactDOM/Plenix browser globals first. Call defineElements() once; every generated component name is exported as elementNames. No runtime CDN download is hidden in registration.\n\nExample: defineElements({ React, ReactDOM, Plenix }); then use <plx-button variant="primary">Save</plx-button>. Complex data and callbacks go through element.props = { label: "Reports", data, columns }; primitive attributes use kebab case. Listen for plx-click, plx-change, plx-select, plx-close, plx-open-change and plx-value-change; events bubble and cross the shadow boundary. detail.value and detail.checked carry form changes.\n\nThe open shadow root loads plenix-shadow.css beside this module (override styleURL when bundling). It contains the complete bundled component styles and host-scoped token/theme selectors, including data-URL icon assets. Load fonts.css once in the document for its hosted DM Sans and Reddit Mono faces. The host inherits and follows its nearest theme, density, mode, lang and dir; explicit host attributes win.\n\nInput, Textarea, Select, Checkbox, Switch and NumberInput use ElementInternals where available, support form submission, reset, disabled fieldsets and native validation. In older browsers use the same plx-change events to synchronize a hidden native input. Properties set before upgrade are preserved, roots are released when disconnected, and moved elements retain their state.\n\nOverlays that portal outside the shadow root (Dialog, menus and drawers) also require the normal @plenix-ds/styles/plenix.css in the document. The package does not inject global styles automatically. Existing Platform overlay focus behavior remains unchanged; test the chosen overlay in the host application.\n\nUse defineElement("plx-custom", Plenix.Button, options) for a custom registration. All visual roles remain the Platform roles. Version ' + VERSION + '.\n');
  // the package sizes, as plain build output: the build never runs a test (#466; the tests run only when the owner starts them,
  // HANDOFF.md "No tests"). tests/perf.test.js holds the size budgets and tests/w15c-packages.test.js the package checks.
  const zlib = require('zlib');
  const sizes = ['react/dist/index.js', 'styles/plenix.min.css', 'web-components/plenix-shadow.css', 'web-components/index.js', 'mcp/server.cjs']
    .filter((f) => fs.existsSync(path.join(PKG, f)))
    .map((f) => { const b = fs.readFileSync(path.join(PKG, f)); return { file: f, raw: b.length, gzip: zlib.gzipSync(b, { level: 9 }).length }; });
  console.log('PACKAGE_SIZES ' + sizes.map((r) => r.file + ':' + r.raw + ' raw/' + r.gzip + ' gzip').join(', '));
  return names.length + ' custom elements; shadow CSS; form controls; package sizes printed';
};
