/* Plenix design system · library part w10A: the labs of wave 10, lane A. RenameAction, SortableList, DragHandle,
   Resizable and the drop target (DropZone's lab re-registered with its new variant and state), each drawn in place with
   the markup the component renders, so every variant and state shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name, cls) { return DS.icon(name, cls); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var iconButton = function (name, label) { return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only" aria-label="' + label + '"><span class="plx-button__icon">' + icon(name) + '</span></button>'; };
    // the drag handle's markup (DragHandle): its orientation and state
    var handle = function (orientation, state, cls, name) {
      var st = { hover: ' is-hover', pressed: ' is-pressed', focus: ' is-focus-visible' }[state] || '';
      return '<button type="button" tabindex="-1" class="plx-drag-handle plx-drag-handle--' + orientation + st + ex(cls) + '" aria-label="Move ' + (name || 'Hero banner') + '"'
        + (state === 'picked' ? ' aria-pressed="true"' : '') + (state === 'disabled' ? ' disabled' : '') + ' data-plx-dnd-handle="">' + icon('drag', 'plx-drag-handle__icon') + '</button>';
    };

    // ---- Rename (<RenameAction>): inline (the name's InlineEdit) or the dialog's form
    var RA = function (n) { return 'plx-comp-rename-action-' + n; };
    DS.registerLab('rename-action', {
      name: 'Rename', title: 'Plenix rename', file: 'platform/patterns/RenameAction/rename-action.css', compPrefix: /^plx-comp-rename-action-/,
      store: 'plenix-rename-action-lab-tokens', sizes: [['default', 'Default', '.plx-rename-action']],
      variants: [['inline', 'Inline (default)'], ['dialog', 'Dialog']],
      states: [['default', 'Default']], content: [['file', 'A file name']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'inline', state: 'default', content: 'file' },
      props: [
        { id: 'w', label: 'Width (inline)', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'g', label: 'Space between the form’s parts (dialog)', css: ['row-gap'], part: '.plx-rename-action__form', cat: 'space' }
      ],
      token: function (id, size, variant) { return id === 'w' ? (variant === 'inline' ? RA('inline-width') : null) : variant === 'dialog' ? RA('form-gap') : null; },
      reach: function (full) { return /-form-/.test(full) ? 'every rename dialog' : 'every inline rename'; }, every: 'every rename',
      html: function (variant, size, state, extraCls) {
        if (variant === 'dialog') {
          return '<div class="ds-w10a-lab"><span class="plx-rename-action plx-rename-action--dialog' + ex(extraCls) + '"><form class="plx-rename-action__form" novalidate>'
            + '<div class="plx-field plx-field--stacked"><label class="plx-field__label" for="ds-w10a-rename">File name</label><input id="ds-w10a-rename" type="text" class="plx-input" tabindex="-1" value="Cross 014.png"></div>'
            + '<div class="plx-field plx-field--stacked"><span class="plx-field__label">Kept as it is</span><span class="plx-text plx-text--secondary">The extension .png</span></div></form></span></div>';
        }
        return '<div class="ds-w10a-lab"><span class="plx-rename-action plx-rename-action--inline' + ex(extraCls) + '"><div class="plx-inline-edit plx-inline-edit--text">'
          + '<button type="button" tabindex="-1" class="plx-inline-edit__read"><span class="plx-visually-hidden">File name, </span><span class="plx-inline-edit__value">Cross 014.png</span><span class="plx-visually-hidden">, edit</span>'
          + '<span class="plx-inline-edit__hint" aria-hidden="true">' + icon('pencil') + '</span></button></div></span></div>';
      },
      labelSelector: '.plx-inline-edit__value, .plx-field__label',
      parts: { w: 'A', g: 'B' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-rename-action__form', side: 'left' } },
      sections: [['Layout', ['w', 'g']]],
      matrixLabel: 'Rename by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Sortable list (<SortableList>): items with handles (and move buttons); a lifted or picked-up item
    var SL = function (n) { return 'plx-comp-sortable-list-' + n; };
    var STEPS = ['Upload the scans', 'Tag the pictures', 'Pick the cover', 'Write the captions'];
    var MOVING = '.plx-sortable-list__item[data-plx-dnd-state]';
    DS.registerLab('sortable-list', {
      name: 'Sortable list', title: 'Plenix sortable list', file: 'platform/patterns/SortableList/sortable-list.css', compPrefix: /^plx-comp-sortable-list-/,
      store: 'plenix-sortable-list-lab-tokens', sizes: [['default', 'Default', '.plx-sortable-list']],
      variants: [['vertical', 'Vertical (default)'], ['grid', 'Grid'], ['handles', 'Handles (default)'], ['buttons', 'With move buttons']],
      states: [['default', 'At rest'], ['dragging', 'An item dragged (the insertion line where it lands)'], ['picked', 'An item picked up with the keyboard']],
      content: [['steps', 'Four steps']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'vertical', state: 'dragging', content: 'steps' },
      props: [
        { id: 'g', label: 'Space between items', css: ['row-gap'], cat: 'space' },
        { id: 'bg', label: 'Item background', css: ['background-color'], part: '.plx-sortable-list__item', cat: 'color' },
        { id: 'bc', label: 'Item border color', css: BORDERS, show: 'border-top-color', part: '.plx-sortable-list__item', cat: 'color' },
        { id: 'bw', label: 'Item border width', css: WIDTHS, show: 'border-top-width', part: '.plx-sortable-list__item', cat: 'border-width' },
        { id: 'rad', label: 'Item corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-sortable-list__item', cat: 'radius' },
        { id: 'fg', label: 'Item text', css: ['color'], part: '.plx-sortable-list__item', cat: 'color' },
        { id: 'ig', label: 'Space in an item', css: ['column-gap'], part: '.plx-sortable-list__item', cat: 'space' },
        { id: 'mh', label: 'Item least height', css: ['min-block-size'], show: 'min-height', part: '.plx-sortable-list__item', cat: 'size' },
        { id: 'py', label: 'Item padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-sortable-list__item', cat: 'space' },
        { id: 'px', label: 'Item padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-sortable-list__item', cat: 'space' },
        { id: 'btg', label: 'Space between the move buttons', css: ['column-gap'], part: '.plx-sortable-list__buttons', cat: 'space' },
        { id: 'dbg', label: 'Moving item background', css: ['background-color'], part: MOVING, cat: 'color' },
        { id: 'dsh', label: 'Moving item shadow', css: ['box-shadow'], part: MOVING, cat: 'shadow' },
        { id: 'dop', label: 'Dragged item opacity', css: ['opacity'], part: MOVING, cat: 'opacity' }
      ],
      token: function (id, size, variant, state) {
        var moving = state === 'dragging' || state === 'picked';
        var T = { g: 'gap', bc: 'item-border-color', bw: 'item-border-width', rad: 'item-radius', fg: 'item-text', ig: 'item-gap', mh: 'item-min-height', py: 'item-padding-block', px: 'item-padding-inline' };
        if (T[id]) return SL(T[id]);
        if (id === 'bg') return SL('item-background');
        if (id === 'btg') return variant === 'buttons' ? SL('buttons-gap') : null;
        if (id === 'dbg') return moving ? SL('item-dragging-background') : null;
        if (id === 'dsh') return moving ? SL('item-dragging-shadow') : null;
        if (id === 'dop') return state === 'dragging' ? SL('item-dragging-opacity') : null;
        return null;
      },
      reach: function (full) { return /-dragging-/.test(full) ? 'every sortable item while it moves' : 'every sortable list'; }, every: 'every sortable list',
      html: function (variant, size, state, extraCls) {
        var grid = variant === 'grid', buttons = variant === 'buttons';
        var items = STEPS.map(function (name, i) {
          var st = i === 1 ? (state === 'dragging' ? ' data-plx-dnd-state="dragging"' : state === 'picked' ? ' data-plx-dnd-state="picked"' : '') : '';
          var drop = state === 'dragging' && i === 3 ? ' data-plx-drop="before"' : '';
          return '<li class="plx-sortable-list__item plx-dnd-item"' + st + drop + '>' + handle('vertical', i === 1 && state === 'picked' ? 'picked' : 'default', null, name)
            + '<div class="plx-sortable-list__content">' + name + '</div>'
            + (buttons ? '<span class="plx-sortable-list__buttons">' + iconButton('chevron-up', 'Move ' + name + ' up') + iconButton('chevron-down', 'Move ' + name + ' down') + '</span>' : '') + '</li>';
        }).join('');
        return '<div class="ds-w10a-lab"><ul class="plx-sortable-list plx-sortable-list--' + (grid ? 'grid' : 'vertical') + ' plx-sortable-list--handles' + (buttons ? ' plx-sortable-list--buttons' : '') + ex(extraCls)
          + '" aria-label="Steps" data-plx-dnd-orientation="' + (grid ? 'grid' : 'vertical') + '">' + items + '</ul></div>';
      },
      labelSelector: '.plx-sortable-list__content',
      parts: { g: 'A', bg: 'B', bc: 'B', bw: 'B', rad: 'B', mh: 'B', fg: 'C', ig: 'C', py: 'C', px: 'C', btg: 'D', dbg: 'E', dsh: 'E', dop: 'E' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-sortable-list__item', side: 'top' }, C: { part: '.plx-sortable-list__content', side: 'right' }, D: { part: '.plx-sortable-list__buttons', side: 'right' }, E: { part: MOVING, side: 'bottom' } },
      sections: [['List', ['g']], ['Item', ['bg', 'bc', 'bw', 'rad', 'fg', 'ig', 'mh', 'py', 'px', 'btg']], ['Moving', ['dbg', 'dsh', 'dop']]],
      matrixLabel: 'Sortable list by variant and state', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Drag handle (<DragHandle>): vertical or horizontal; at rest, hovered, pressed, focused, picked up, disabled
    var DH = function (n) { return 'plx-comp-drag-handle-' + n; };
    DS.registerLab('drag-handle', {
      name: 'Drag handle', title: 'Plenix drag handle', file: 'platform/components/DragHandle/drag-handle.css', compPrefix: /^plx-comp-drag-handle-/,
      store: 'plenix-drag-handle-lab-tokens', sizes: [['default', 'Default', '.plx-drag-handle']],
      variants: [['vertical', 'Vertical (default)'], ['horizontal', 'Horizontal']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['pressed', 'Pressed (held)'], ['focus', 'Focus'], ['picked', 'Picked up (aria-pressed)'], ['disabled', 'Disabled']],
      content: [['icon', 'The drag icon']],
      labels: { size: 'Size', variant: 'Orientation', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'vertical', state: 'picked', content: 'icon' },
      props: [
        { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-drag-handle__icon', cat: 'icon' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Icon color', css: ['color'], cat: 'color' },
        { id: 'oc', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
        { id: 'ow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
        { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        switch (id) {
          case 'w': case 'h': return DH('size');
          case 'is': return DH('icon-size');
          case 'rad': return DH('radius');
          case 'bg': return state === 'disabled' ? null : DH({ hover: 'hover-background', pressed: 'pressed-background', picked: 'picked-background' }[state] || 'background');
          case 'fg': return DH({ hover: 'hover-text', picked: 'picked-text', disabled: 'disabled-text' }[state] || 'text');
          case 'oc': return state === 'focus' ? DH('focus-outline-color') : null;
          case 'ow': return state === 'focus' ? DH('focus-outline-width') : null;
          case 'oo': return state === 'focus' ? DH('focus-outline-offset') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-picked-/.test(full) ? 'every drag handle whose item is picked up' : /focus-/.test(full) ? 'every focused drag handle' : 'every drag handle'; }, every: 'every drag handle',
      html: function (variant, size, state, extraCls) { return '<div class="ds-demo-row">' + handle(variant, state, extraCls) + '</div>'; },
      labelSelector: null,
      parts: { w: 'A', h: 'A', rad: 'A', bg: 'B', fg: 'C', is: 'C', oc: 'D', ow: 'D', oo: 'D' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'left' }, C: { part: '.plx-drag-handle__icon', side: 'right' }, D: { part: null, side: 'bottom' } },
      sections: [['Size', ['w', 'h', 'is', 'rad']], ['Colors', ['bg', 'fg']], ['Focus', ['oc', 'ow', 'oo']]],
      matrixLabel: 'Drag handle by orientation and state', matrixColumnWidth: '--plx-ref-size-200px', statesHead: 'Orientations and states · ' + HEAD
    });

    // ---- Resize (<Resizable>): the edges (and the corner), their line on hover and focus
    var RZ = function (n) { return 'plx-comp-resizable-' + n; };
    var EDGE_I = '.plx-resizable__edge--inline', EDGE_B = '.plx-resizable__edge--block';
    DS.registerLab('resizable', {
      name: 'Resize', title: 'Plenix resizable', file: 'platform/components/Resizable/resizable.css', compPrefix: /^plx-comp-resizable-/,
      store: 'plenix-resizable-lab-tokens', sizes: [['default', 'Default', '.plx-resizable']],
      variants: [['horizontal', 'Horizontal (default)'], ['vertical', 'Vertical'], ['both', 'Both'], ['steps', 'Snapped to size steps']],
      states: [['default', 'Default'], ['hover', 'Edge hovered'], ['focus', 'Edge focused']],
      content: [['box', 'A box with a label']],
      labels: { size: 'Size', variant: 'Axis', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'horizontal', state: 'focus', content: 'box' },
      props: [
        { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'ei', label: 'End edge hit area', css: ['inline-size'], show: 'width', part: EDGE_I, cat: 'size' },
        { id: 'eb', label: 'Bottom edge hit area', css: ['block-size'], show: 'height', part: EDGE_B, cat: 'size' },
        { id: 'li', label: 'End edge line width', css: ['inline-size'], show: 'width', part: EDGE_I, pseudo: '::after', cat: 'border-width' },
        { id: 'lb', label: 'Bottom edge line width', css: ['block-size'], show: 'height', part: EDGE_B, pseudo: '::after', cat: 'border-width' },
        { id: 'lc', label: 'Edge line color', css: ['background-color'], part: '.plx-resizable__edge', pseudo: '::after', cat: 'color' },
        { id: 'cs', label: 'Corner size', css: ['inline-size'], show: 'width', part: '.plx-resizable__corner', cat: 'size' },
      ],
      token: function (id, size, variant, state) {
        var w = variant !== 'vertical', hh = variant === 'vertical' || variant === 'both';
        switch (id) {
          case 'w': return w ? RZ('width') : null;
          case 'h': return hh ? RZ('height') : null;
          case 'ei': return w ? RZ('edge-size') : null;
          case 'eb': return hh ? RZ('edge-size') : null;
          case 'li': return w ? RZ('edge-line-width') : null;
          case 'lb': return hh ? RZ('edge-line-width') : null;
          case 'lc': return state === 'default' ? null : RZ('edge-hover-line-color');
          case 'cs': return variant === 'both' ? RZ('corner-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-edge-/.test(full) ? 'every resize edge' : /-menu-/.test(full) ? 'every size menu' : 'every resizable box'; }, every: 'every resizable box',
      html: function (variant, size, state, extraCls) {
        var w = variant !== 'vertical', hh = variant === 'vertical' || variant === 'both';
        var st = state === 'hover' ? ' is-hover' : state === 'focus' ? ' is-focus-visible' : '';
        // the first edge drawn carries the state (the end edge, or the bottom one when there is no end edge)
        var edge = function (which, first) {
          return '<div role="separator" tabindex="-1" aria-orientation="' + (which === 'inline' ? 'vertical' : 'horizontal') + '" aria-label="Preview ' + (which === 'inline' ? 'width' : 'height') + '" aria-valuenow="320" aria-valuemin="120" aria-valuemax="560" class="plx-resizable__edge plx-resizable__edge--' + which + (first ? st : '') + '"></div>';
        };
        return '<div class="ds-w10a-lab ds-w10a-lab--wide"><div class="plx-resizable plx-resizable--' + (variant === 'steps' ? 'horizontal plx-resizable--steps' : variant) + ex(extraCls) + ' ds-w10a-sized"'
          + (w ? ' data-plx-width=""' : '') + (hh ? ' data-plx-height=""' : '') + '><div class="plx-resizable__content"><div class="ds-w10a-sized__body"><span class="plx-text plx-text--label">Preview</span>'
          + '<span class="plx-text plx-text--secondary">' + (variant === 'steps' ? '240, 320 or 400px' : 'Drag an edge') + '</span></div></div>'
          + (w ? edge('inline', true) : '') + (hh ? edge('block', !w) : '') + (w && hh ? '<div class="plx-resizable__corner" aria-hidden="true"></div>' : '')
          + '</div></div>';
      },
      labelSelector: '.plx-text--label',
      parts: { w: 'A', h: 'A', ei: 'B', li: 'B', lc: 'B', eb: 'C', lb: 'C', cs: 'D', mi: 'E' },
      anchors: { A: { part: null, side: 'top' }, B: { part: EDGE_I, side: 'right' }, C: { part: EDGE_B, side: 'bottom' }, D: { part: '.plx-resizable__corner', side: 'bottom' } },
      sections: [['Size', ['w', 'h']], ['Edges', ['ei', 'eb', 'li', 'lb', 'lc', 'cs']]],
      matrixLabel: 'Resizable box by axis and state', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Axes and states · ' + HEAD
    });

    // ---- Drop target: DropZone's lab (more-labs.js) gains the data drop target and the refusing state; the Drop target
    // page has a lab of its own on the same spec
    var base = DS.labs['drop-zone'];
    if (base) {
      var REJECT = 'plx-comp-drop-zone-reject-border-color';
      var zone = Object.assign({}, base, {
        variants: base.variants.concat([['data', 'Data drop target']]),
        states: base.states.concat([['reject', 'Refusing (an item it does not take is over it)']]),
        token: function (id, size, variant, state, content) {
          var v = variant === 'data' ? 'page' : variant;
          if (variant === 'data' && state === 'focus') return null;   // a data target is not a button
          if (state === 'reject') return id === 'bc' && v === 'page' ? REJECT : base.token(id, size, v, 'default', content);
          return base.token(id, size, v, state, content);
        },
        reach: function (full) { return full === REJECT ? 'every drop zone that refuses what is over it' : base.reach(full); },
        html: function (variant, size, state, extraCls, ui) {
          var reject = state === 'reject';
          if (variant === 'data') {
            return '<div class="ds-more-frame"><div class="plx-drop-zone' + (state === 'active' ? ' is-active' : '') + (reject ? ' is-reject' : '') + ex(extraCls) + '">'
              + icon(reject ? 'do-not-disturb' : 'folder') + '<span>' + (reject ? 'Pictures takes images only' : 'Pictures') + '</span></div></div>';
          }
          if (reject) return variant === 'overlay' ? base.html(variant, size, 'default', extraCls, ui) : base.html(variant, size, 'default', 'is-reject' + ex(extraCls), ui);
          return base.html(variant, size, state, extraCls, ui);
        }
      });
      DS.registerLab('drop-zone', zone);
      DS.registerLab('drop-target', Object.assign({}, zone, {
        name: 'Drop target', title: 'Plenix drop target', store: 'plenix-drop-target-lab-tokens',
        variants: [['data', 'Data drop target'], ['page', 'In the page']],
        states: [['default', 'Idle'], ['active', 'Over, taken'], ['reject', 'Over, refused']],
        defaults: Object.assign({}, base.defaults, { variant: 'data', state: 'reject' }),
        every: 'every drop target', matrixLabel: 'Drop target by variant and state'
      }));
    }
  })();
}
