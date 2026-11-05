/* global DS */
/* Plenix master spec · the Button lab: the Button's description for the shared component lab (component-lab.js, batch 252).
   Draws the Platform Button (platform/components/Button: Button.tsx for the markup, button.css for the rules) in every
   variant and state, its anatomy, its attributes and the Edit dialog. button.css is built on component tokens
   (--plx-comp-button-*, batch 207): each size sets its own, the variants and states theirs; buttonToken names the one
   token behind each property. window.DSButtonLab stays as the Button's lab (window.DSLabs.button). */
(function () {
  var find = function (list, v) { return list.filter(function (o) { return o[0] === v; })[0]; };
  // the Button API (Button.tsx): size "md" is the default and adds no class; variant "secondary" is the default
  var SIZES = [['xs', 'Extra small', '.plx-button--size-xs'], ['sm', 'Small', '.plx-button--size-sm'], ['md', 'Medium', '.plx-button (default)'], ['lg', 'Large', '.plx-button--size-lg']];
  var VARIANTS = [['secondary', 'Secondary'], ['primary', 'Primary'], ['tertiary', 'Tertiary'], ['ghost', 'Ghost'], ['danger', 'Danger'], ['danger-secondary', 'Danger secondary']];
  var STATES = [['default', 'Default', ''], ['hover', 'Hover', ':hover'], ['pressed', 'Pressed', ':active'], ['selected', 'Selected', '.is-selected'], ['focus', 'Focus', ':focus-visible'], ['disabled', 'Disabled', ':disabled']];
  var CONTENT = [['text', 'Label'], ['icon', 'Icon and label (icon)'], ['caret', 'Opens a menu (caret)'], ['icon-only', 'Icon only (iconOnly)']];
  // every editable property: what it changes, where it is set and which tokens fit
  var PROPS = [
    { id: 'bg', label: 'Background color', css: ['background-color'], scope: 'look', cat: 'color', extra: ['transparent'] },
    { id: 'bc', label: 'Border color', css: ['border-bottom-color', 'border-left-color', 'border-right-color', 'border-top-color'], show: 'border-top-color', scope: 'look', cat: 'color', extra: ['transparent'] },
    { id: 'fg', label: 'Text color', css: ['color'], scope: 'look', cat: 'color' },
    { id: 'sh', label: 'Box shadow', css: ['box-shadow'], scope: 'look', cat: 'shadow', extra: ['none'] },
    { id: 'h', label: 'Minimum height', v: '--plx-comp-button-height', show: 'min-height', scope: 'size', cat: 'control-height' },
    { id: 'px', label: 'Padding left & right', v: '--plx-comp-button-padding', show: 'padding-left', scope: 'size', cat: 'space', extra: ['0'] },
    { id: 'gap', label: 'Gap (icon to label)', v: '--plx-comp-button-gap', show: 'column-gap', scope: 'size', cat: 'space', extra: ['0'] },
    { id: 'ic', label: 'Icon size', v: '--plx-comp-button-icon', scope: 'size', cat: 'icon' },
    { id: 'fs', label: 'Font size', v: '--plx-comp-button-font-size', show: 'font-size', scope: 'size', cat: 'font-size' },
    { id: 'fw', label: 'Font weight', v: '--plx-comp-button-font-weight', show: 'font-weight', scope: 'size', cat: 'font-weight' },
    { id: 'tx', label: 'Text color (secondary)', v: '--plx-comp-button-text', scope: 'size', cat: 'color' },
    { id: 'hb', label: 'Hover background (secondary, ghost)', v: '--plx-comp-button-hover-background', scope: 'size', cat: 'color', extra: ['transparent'] },
    { id: 'hbd', label: 'Hover border (secondary)', v: '--plx-comp-button-hover-border', scope: 'size', cat: 'color', extra: ['transparent'] },
    { id: 'sb', label: 'Selected border', v: '--plx-comp-button-selected-border', scope: 'size', cat: 'color' },
    { id: 'st', label: 'Selected text', v: '--plx-comp-button-selected-text', scope: 'size', cat: 'color' },
    { id: 'pr', label: 'Primary ring', v: '--plx-comp-button-primary-ring', scope: 'size', cat: 'shadow', extra: ['none'] },
    { id: 'bw', label: 'Border width', css: ['border-bottom-width', 'border-left-width', 'border-right-width', 'border-top-width'], show: 'border-top-width', scope: 'all', cat: 'border-width', extra: ['0'] },
    { id: 'bs', label: 'Border style', css: ['border-bottom-style', 'border-left-style', 'border-right-style', 'border-top-style'], show: 'border-top-style', scope: 'all', cat: 'border-style', extra: ['none'] },
    { id: 'rad', label: 'Corner radius', css: ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'], show: 'border-top-left-radius', scope: 'all', cat: 'radius', extra: ['0'] },
    { id: 'ff', label: 'Font family', css: ['font-family'], scope: 'all', cat: 'font' },
    { id: 'tt', label: 'Text transform', css: ['text-transform'], scope: 'all', cat: null, extra: ['none', 'uppercase', 'capitalize', 'lowercase'] },
    { id: 'm', label: 'Margin', css: ['margin-block-end', 'margin-block-start', 'margin-inline-end', 'margin-inline-start'], show: 'margin-top', scope: 'all', cat: 'space', extra: ['0'] }
  ];

  // the one Button token (--plx-comp-button-*, batch 207) that sets a property at a size, variant and state; null when the
  // property is fixed in button.css (border style, text transform, margin) or not drawn (no shadow)
  var buttonToken = DS.buttonToken = function (id, size, variant, state) {
    var sz = function (n) { return 'plx-comp-button-size-' + size + '-' + n; }, b = function (n) { return 'plx-comp-button-' + n; };
    var SIZE = { h: 'height', px: 'padding-inline', gap: 'gap', ic: 'icon-size', fs: 'font-size', fw: 'font-weight', tx: 'text', hb: 'hover-background', hbd: 'hover-border', sb: 'selected-border', st: 'selected-text', pr: 'primary-ring' };
    if (SIZE[id]) return sz(SIZE[id]);
    if (id === 'bw') return b('border-width');
    if (id === 'rad') return b('radius');
    if (id === 'ff') return b('font-family');
    if (id === 'sh') return variant === 'primary' && state !== 'disabled' ? sz('primary-ring') : null;
    if (['bg', 'bc', 'fg'].indexOf(id) < 0) return null;
    var part = { bg: 'background', bc: 'border', fg: 'text' }[id], quiet = variant === 'ghost';
    if (state === 'disabled') return id === 'fg' ? b('disabled-text') : b((quiet ? 'disabled-quiet-' : 'disabled-') + part);
    if (state === 'selected') {
      if (variant === 'danger-secondary') return b('danger-secondary-hover-' + part);
      return id === 'bg' ? b('selected-background') : sz('selected-' + part);
    }
    if (state === 'pressed') {   // a step darker than hover (batch 238): the fill and the colored variants' edge are their own tokens
      if (variant === 'secondary') return id === 'fg' ? b('secondary-hover-text') : id === 'bg' ? sz('pressed-background') : sz('hover-border');
      if (variant === 'ghost') return id === 'bg' ? sz('pressed-background') : b('ghost-hover-' + part);
      return id === 'fg' ? b(variant + '-hover-text') : b(variant + '-pressed-' + part);
    }
    if (state === 'hover') {
      if (variant === 'secondary') return id === 'fg' ? b('secondary-hover-text') : sz('hover-' + part);
      if (variant === 'ghost') return id === 'bg' ? sz('hover-background') : b('ghost-hover-' + part);
      return b(variant + '-hover-' + part);
    }
    if (variant === 'secondary') return id === 'fg' ? sz('text') : b('secondary-' + part);
    if (variant === 'danger-secondary' && id === 'bg') return b('secondary-background');
    return b(variant + '-' + part);
  };
  // which buttons a token reaches: the size tokens every button of that size, the variant tokens that variant, the rest every button
  function reachOf(full) {
    var m = /^plx-comp-button-size-([a-z0-9]+)-/.exec(full); if (m) return 'every ' + find(SIZES, m[1])[1].toLowerCase() + ' button';
    var v = VARIANTS.map(function (x) { return x[0]; }).sort(function (a, b) { return b.length - a.length; }).filter(function (x) { return full.indexOf('plx-comp-button-' + x + '-') === 0; })[0];
    if (v) return 'every ' + find(VARIANTS, v)[1].toLowerCase() + ' button' + (/-hover-/.test(full) ? ', on hover' : '');
    if (/-selected-/.test(full)) return 'every selected button';
    if (/-disabled-/.test(full)) return 'every disabled button';
    return 'every button';
  }
  // the markup Button.tsx renders: <button class="plx-button plx-button--{variant} [plx-button--size-{size}]
  // [plx-button--icon-only] [plx-button--caret] [is-selected]">, an icon span, a label span and a caret span
  var ui = {};
  var buttonHtml = function (variant, size, state, extraCls) {
    var c = ui.content, iconOnly = c === 'icon-only';
    var cls = ['plx-button', 'plx-button--' + variant, size !== 'md' ? 'plx-button--size-' + size : '', iconOnly ? 'plx-button--icon-only' : '', c === 'caret' ? 'plx-button--caret' : '',
      state === 'selected' ? 'is-selected' : '', state === 'hover' ? 'ds-hover' : state === 'pressed' ? 'ds-pressed' : state === 'focus' ? 'ds-focus' : '', extraCls || ''].filter(Boolean).join(' ');
    var icon = c === 'icon' || iconOnly ? '<span class="plx-button__icon">' + DS.icon('add') + '</span>' : '';
    var label = iconOnly ? '' : '<span class="plx-button__label">' + (c === 'caret' ? 'Menu' : 'Button') + '</span>';
    var caret = c === 'caret' ? '<span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span>' : '';
    return '<button type="button" class="' + cls + '"' + (iconOnly ? ' aria-label="Add"' : '') + (state === 'disabled' ? ' disabled' : '') + ' tabindex="-1">' + icon + label + caret + '</button>';
  };
  DS.registerLab('button', {
    name: 'Button', title: 'Plenix Button', file: 'platform/components/Button/button.css', compPrefix: /^plx-comp-button-/,
    store: 'plenix-button-lab-tokens', sizes: SIZES, variants: VARIANTS, states: STATES, content: CONTENT, props: PROPS,
    labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
    defaults: { size: 'md', variant: 'primary', state: 'default', content: 'text' },
    token: buttonToken, reach: reachOf, every: 'every button',
    html: function (variant, size, state, extraCls, now) { ui = now; return buttonHtml(variant, size, state, extraCls); },
    labelSelector: '.plx-button__label',
    parts: { bg: 'A', px: 'B', h: 'C', m: 'D', rad: 'E', bc: 'E', bw: 'E', bs: 'E', fg: 'F', fs: 'F', fw: 'F', ff: 'F', tt: 'F', sh: 'G', pr: 'G' },
    sections: [['Color', ['bg', 'bc', 'fg', 'tx', 'hb', 'hbd', 'sb', 'st']], ['Size and shape', ['h', 'rad', 'ic']], ['Typography', ['ff', 'fs', 'fw']],
      ['Border', ['bw']], ['Spacing', ['px', 'gap']], ['Effects', ['sh', 'pr']]],
    matrixLabel: 'Button variants by state',
    statesHead: 'States · every variant (click a button to inspect it; the dashed outline marks the one shown below)'
  });
  window.DSButtonLab = window.DSLabs.button;
})();
