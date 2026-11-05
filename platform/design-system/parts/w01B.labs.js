/* Plenix design system · library part w01B: the Interaction states lab. Every treatment (the columns: rest, hover, focus,
   pressed, selected, dragged, disabled) on every surface (the "size": a surface, the accent, the inverse surface), each
   value with the one token behind it: the theme's state roles and the state tokens (semantic/state.tokens.json). */
if (window.DS && DS.registerLab) {
  (function () {
    var CORNER_COLORS = ['border-bottom-color', 'border-left-color', 'border-right-color', 'border-top-color'];
    var S = function (n) { return 'plx-sys-' + n; };
    var CLS = { hover: ' is-hover', focus: ' is-focus-visible', pressed: ' is-pressed', selected: ' is-selected', dragged: ' is-dragging' };
    // [surface][treatment] -> { prop: token }; a value not listed is not drawn by that treatment (or fixed: transparent, none)
    var MAP = {
      surface: {
        rest: {},
        hover: { bg: S('state-hover') },
        focus: { ol: S('focus-ring-color'), olw: S('focus-ring-width') },
        pressed: { bg: S('state-pressed') },
        selected: { bg: S('state-selected'), bd: S('state-selected-border'), fg: S('selected-content') },
        dragged: { bg: S('surface-raised'), sh: S('elevation-overlay-shadow'), op: S('state-dragged-opacity') },
        disabled: { fg: S('content-disabled') }
      },
      accent: {
        rest: { fg: S('accent-content-muted') },
        hover: { bg: S('accent-state-hover'), fg: S('accent-content') },
        focus: { ol: S('accent-content'), olw: S('focus-ring-width'), fg: S('accent-content-muted') },
        pressed: { bg: S('accent-state-pressed'), fg: S('accent-content') },
        selected: { bg: S('accent-state-hover'), bd: S('accent-content'), fg: S('accent-content') },
        dragged: { bg: S('accent-surface-raised'), fg: S('accent-content'), sh: S('elevation-overlay-shadow'), op: S('state-dragged-opacity') },
        disabled: { fg: S('accent-content-muted'), op: S('state-disabled-opacity') }
      },
      inverse: {
        rest: { fg: S('content-inverse'), op: S('state-inverse-rest-opacity') },
        hover: { fg: S('content-inverse'), op: S('state-inverse-active-opacity') },
        focus: { ol: S('focus-ring-color'), olw: S('focus-ring-width'), fg: S('content-inverse'), op: S('state-inverse-rest-opacity') },
        pressed: { fg: S('content-inverse'), op: S('state-inverse-active-opacity') },
        selected: { bd: S('content-inverse'), fg: S('content-inverse'), op: S('state-inverse-active-opacity') },
        dragged: { bg: S('surface-inverse'), fg: S('content-inverse'), sh: S('elevation-overlay-shadow'), op: S('state-dragged-opacity') },
        disabled: { fg: S('content-inverse'), op: S('state-disabled-opacity') }
      }
    };
    DS.registerLab('interaction-states', {
      name: 'Interaction states', title: 'Plenix interaction states', file: 'platform/system/interaction.css', compPrefix: /^plx-sys-state-/,
      store: 'plenix-interaction-states-lab-tokens',
      sizes: [['surface', 'On a surface', '.plx-state'], ['accent', 'On the accent', '.plx-state--accent'], ['inverse', 'On the inverse surface', '.plx-state--inverse']],
      variants: [['rest', 'Rest'], ['hover', 'Hover'], ['focus', 'Focus'], ['pressed', 'Pressed'], ['selected', 'Selected'], ['dragged', 'Dragged'], ['disabled', 'Disabled']],
      states: [['default', 'As drawn']], content: [['label', 'A label']],
      labels: { size: 'Surface', variant: 'Treatment', state: 'State', content: 'Content' },
      defaults: { size: 'surface', variant: 'hover', state: 'default', content: 'label' },
      props: [
        { id: 'bg', label: 'Fill', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'bd', label: 'Border color', css: CORNER_COLORS, show: 'border-top-color', cat: 'color' },
        { id: 'ol', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
        { id: 'olw', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
        { id: 'op', label: 'Opacity', css: ['opacity'], cat: 'opacity' },
        { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' }
      ],
      token: function (id, size, variant) { var m = (MAP[size] || {})[variant] || {}; return m[id] || null; },
      reach: function (full) { return /^plx-sys-state-/.test(full) ? 'every element in that state' : 'every element that uses this theme role'; },
      every: 'every element with the state treatment',
      html: function (variant, size, state, extraCls) {
        return '<div class="ds-state-frame ds-state-frame--' + size + '"><button type="button" class="plx-state' + (size === 'surface' ? '' : ' plx-state--' + size) + ' ds-state-specimen' + (CLS[variant] || '') + (extraCls ? ' ' + extraCls : '') + '"'
          + (variant === 'disabled' ? ' disabled' : '') + (variant === 'selected' ? ' aria-pressed="true"' : '') + '>Archive</button></div>';
      },
      labelSelector: null,
      parts: { bg: 'A', bd: 'A', op: 'A', sh: 'A', fg: 'B', ol: 'C', olw: 'C' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'bottom' } },
      sections: [['Treatment', ['bg', 'fg', 'bd', 'ol', 'olw', 'op', 'sh']]],
      matrixLabel: 'Interaction states by treatment',
      statesHead: 'Treatments · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });
  })();
}
