/* global DS */
/* Plenix master spec · the more labs (Every Variant, batch 333): color swatch, drop zone, rating, combobox, search input,
   empty state, preview, chat and the bulk action bar. Each description for the shared component lab (component-lab.js)
   names the component's sizes, its variants (the matrix columns), its states (the rows), its content, every property the
   lab reads with the one --plx-comp-* token that sets it, and the markup the component renders. A token a variant class
   sets locally on the element (the swatch's tone, the preview's aspect) is the component's data, not a lab property. */
(function () {
  var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
  var BORDER_COLOR = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
  var BORDER_WIDTH = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
  var STATIC = [['default', 'Default']];
  var cls = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
  // the focus ring every control draws (outline color, offset, width) on a part, from one token family
  var ring = function (part) { return [
    { id: 'oc', label: 'Focus ring color', css: ['outline-color'], part: part, cat: 'color' },
    { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], part: part, cat: 'space' },
    { id: 'ow', label: 'Focus ring width', css: ['outline-width'], part: part, cat: 'border-width' }
  ]; };
  var ringToken = function (id, prefix) { return { oc: prefix + 'focus-outline-color', oo: prefix + 'focus-outline-offset', ow: prefix + 'focus-outline-width' }[id] || null; };

  // ---- Color swatch (<ColorSwatch>, span or button.plx-color-swatch): a data color in a square or round box, or a system
  // surface it previews, in two sizes; as a button of the color picker it shows selected and focus
  var CS = function (n) { return 'plx-comp-color-swatch-' + n; };
  DS.registerLab('color-swatch', {
    name: 'Color swatch', title: 'Plenix color swatch', file: 'platform/components/ColorSwatch/color-swatch.css', compPrefix: /^plx-comp-color-swatch-/,
    store: 'plenix-color-swatch-lab-tokens',
    sizes: [['md', 'MD (20px)', '.plx-color-swatch--md'], ['sm', 'SM (16px)', '.plx-color-swatch--sm']],
    variants: [['square', 'Square'], ['round', 'Round'], ['accent', 'Accent tone'], ['surface', 'Surface tone'], ['frost', 'Frost tone']],
    states: [['default', 'Default'], ['selected', 'Selected (in a picker)'], ['focus', 'Focus']],
    content: [['blue', 'A data color (blue)']],
    labels: { size: 'Size', variant: 'Shape and tone', state: 'State', content: 'Color' },
    defaults: { size: 'md', variant: 'square', state: 'default', content: 'blue' },
    props: [
      { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'icon' },
      { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'icon' },
      { id: 'bc', label: 'Border color', css: BORDER_COLOR, show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTH, show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'sh', label: 'Selected ring', css: ['box-shadow'], cat: 'shadow' }
    ].concat(ring(null)),
    token: function (id, size, variant, state) {
      switch (id) {
        case 'w': return CS(size + '-width');
        case 'h': return CS(size + '-height');
        case 'bc': return CS('border-color');
        case 'bw': return CS('border-width');
        case 'rad': return CS(variant === 'round' ? 'round-radius' : 'radius');
        case 'sh': return state === 'selected' ? CS('pressed-shadow') : null;
        default: return state === 'focus' ? ringToken(id, CS('')) : null;
      }
    },
    reach: function (full) { return /-sm-/.test(full) ? 'every small swatch' : /-md-/.test(full) ? 'every medium swatch' : /round-/.test(full) ? 'every round swatch' : /pressed-|focus-/.test(full) ? 'every swatch button' : 'every swatch'; },
    every: 'every swatch',
    html: function (variant, size, state, extraCls) {
      var tone = /^(accent|surface|frost)$/.test(variant);
      return '<button type="button" tabindex="-1" class="plx-color-swatch plx-color-swatch--' + size + (variant === 'round' ? ' plx-color-swatch--round' : '') + (tone ? ' plx-color-swatch--' + variant : '')
        + (state === 'focus' ? ' is-focus-visible' : '') + cls(extraCls) + '"' + (tone ? '' : ' data-plx-color="blue"') + ' aria-pressed="' + (state === 'selected') + '" aria-label="' + (tone ? variant : 'Blue') + '"></button>';
    },
    labelSelector: null,
    parts: { w: 'A', h: 'A', bc: 'B', bw: 'B', rad: 'B', sh: 'C', oc: 'C', oo: 'C', ow: 'C' },
    anchors: { A: { part: null, side: 'right' }, B: { part: null, side: 'top' }, C: { part: null, side: 'bottom' } },
    sections: [['Size', ['w', 'h']], ['Frame', ['bc', 'bw', 'rad']], ['Selected and focus', ['sh', 'oc', 'oo', 'ow']]],
    matrixLabel: 'Color swatch values by shape, tone and state',
    statesHead: 'Shapes, tones and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Drop zone (<DropZone>, div or button.plx-drop-zone): a dashed area in the page, or the overlay that covers its
  // container while files are dragged over it (.ds-more-overlay is that container)
  var DZ = function (n) { return 'plx-comp-drop-zone-' + n; };
  DS.registerLab('drop-zone', {
    name: 'Drop zone', title: 'Plenix drop zone', file: 'platform/components/DropZone/drop-zone.css', compPrefix: /^plx-comp-drop-zone-/,
    store: 'plenix-drop-zone-lab-tokens', sizes: [['default', 'Default', '.plx-drop-zone']],
    variants: [['page', 'In the page'], ['overlay', 'Overlay']],
    states: [['default', 'Default'], ['active', 'Files dragged over it'], ['focus', 'Focus (as a button)']],
    content: [['text', 'An icon and a line of text']],
    labels: { size: 'Size', variant: 'Placement', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'page', state: 'default', content: 'text' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: BORDER_COLOR, show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTH, show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'gap', label: 'Gap (icon to text)', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'inset', label: 'Inset from its container', css: ['inset'], show: 'top', cat: 'space', extra: ['0'] }
    ].concat(ring(null)),
    token: function (id, size, variant, state) {
      var over = variant === 'overlay', active = !over && state === 'active';
      switch (id) {
        case 'bg': return DZ(over ? 'overlay-background' : active ? 'active-background' : 'background');
        case 'bc': return DZ(over ? 'overlay-border-color' : active ? 'active-border-color' : 'border-color');
        case 'bw': return DZ(over ? 'overlay-border-width' : 'border-width');
        case 'rad': return DZ('radius');
        case 'fg': return over ? DZ('overlay-text') : null;
        case 'py': return DZ('padding-block');
        case 'px': return DZ('padding-inline');
        case 'gap': return DZ('row-gap');
        case 'inset': return over ? DZ('overlay-inset') : null;
        default: return !over && state === 'focus' ? ringToken(id, DZ('')) : null;
      }
    },
    reach: function (full) { return /-overlay-/.test(full) ? 'every drop zone overlay' : /-active-/.test(full) ? 'every drop zone while files are dragged over it' : /focus-/.test(full) ? 'every drop zone button' : 'every drop zone'; },
    every: 'every drop zone',
    html: function (variant, size, state, extraCls) {
      var body = DS.icon('upload') + '<span>Drop files or click to choose</span>';
      if (variant === 'overlay') return '<div class="ds-more-frame ds-more-overlay"><div class="plx-drop-zone plx-drop-zone--overlay' + cls(extraCls) + '">' + body + '</div></div>';
      return '<div class="ds-more-frame"><button type="button" tabindex="-1" class="plx-drop-zone' + (state === 'active' ? ' is-active' : '') + (state === 'focus' ? ' ds-focus' : '') + cls(extraCls) + '">' + body + '</button></div>';
    },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', bc: 'B', bw: 'B', py: 'C', px: 'C', gap: 'C', inset: 'C', fg: 'D', oc: 'E', oo: 'E', ow: 'E' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'right' }, C: { part: null, side: 'left' }, D: { part: '.plx-icon', side: 'top' }, E: { part: null, side: 'bottom' } },
    sections: [['Surface', ['bg', 'rad']], ['Border', ['bc', 'bw']], ['Spacing', ['py', 'px', 'gap', 'inset']], ['Text', ['fg']], ['Focus', ['oc', 'oo', 'ow']]],
    matrixLabel: 'Drop zone values by placement and state',
    statesHead: 'Placements and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Rating (<Rating>, span.plx-rating: five stars, the chosen ones on): editable (each star a radio button) or read-only
  var RT = function (n) { return 'plx-comp-rating-' + n; };
  var STAR_ON = '.plx-rating__star--on', STAR_OFF = '.plx-rating__star:not(.plx-rating__star--on)', STAR_FOCUS = '.plx-rating__star.ds-focus';
  DS.registerLab('rating', {
    name: 'Rating', title: 'Plenix rating', file: 'platform/components/Rating/rating.css', compPrefix: /^plx-comp-rating-/,
    store: 'plenix-rating-lab-tokens', sizes: [['default', 'Default', '.plx-rating']],
    variants: [['editable', 'Editable'], ['read-only', 'Read-only']],
    states: [['default', 'Default'], ['focus', 'Focus (a star)']],
    content: [['three', 'Three of five']],
    labels: { size: 'Size', variant: 'Mode', state: 'State', content: 'Value' },
    defaults: { size: 'default', variant: 'editable', state: 'default', content: 'three' },
    props: [
      { id: 'gap', label: 'Gap between stars', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'on', label: 'Star color (chosen)', css: ['color'], part: STAR_ON, cat: 'color' },
      { id: 'off', label: 'Star color (not chosen)', css: ['color'], part: STAR_OFF, cat: 'color' },
      { id: 'fs', label: 'Star size', css: ['font-size'], part: '.plx-rating__star', cat: 'font-size' },
      { id: 'lh', label: 'Star line height', css: ['line-height'], part: '.plx-rating__star', cat: 'line-height' },
      { id: 'mh', label: 'Star target height', css: ['min-block-size'], show: 'min-height', part: '.plx-rating__star', cat: 'control-height' },
      { id: 'mw', label: 'Star target width', css: ['min-inline-size'], show: 'min-width', part: '.plx-rating__star', cat: 'control-height' }
    ].concat(ring(STAR_FOCUS)),
    token: function (id, size, variant, state) {
      var edit = variant === 'editable';
      switch (id) {
        case 'gap': return RT('gap');
        case 'on': return RT('star-on-text');
        case 'off': return RT('star-text');
        case 'fs': return RT('star-font-size');
        case 'lh': return RT('star-line-height');
        case 'mh': return edit ? RT('star-min-height') : null;
        case 'mw': return edit ? RT('star-min-width') : null;
        default: return edit && state === 'focus' ? ringToken(id, RT('star-')) : null;
      }
    },
    reach: function (full) { return /min-|focus-/.test(full) ? 'every editable rating' : 'every rating'; },
    every: 'every rating',
    html: function (variant, size, state, extraCls) {
      var stars = [1, 2, 3, 4, 5];
      if (variant === 'read-only') return '<span class="plx-rating plx-rating--read-only' + cls(extraCls) + '" role="img" aria-label="Rating: 3 of 5">'
        + stars.map(function (n) { return '<span class="plx-rating__star' + (n <= 3 ? ' plx-rating__star--on' : '') + '" aria-hidden="true">★</span>'; }).join('') + '</span>';
      return '<span class="plx-rating' + cls(extraCls) + '" role="radiogroup" aria-label="Rating">'
        + stars.map(function (n) { return '<button type="button" tabindex="-1" role="radio" aria-checked="' + (n === 3) + '" aria-label="' + n + (n === 1 ? ' star' : ' stars') + '" class="plx-rating__star' + (n <= 3 ? ' plx-rating__star--on' : '') + (n === 3 && state === 'focus' ? ' ds-focus' : '') + '">★</button>'; }).join('') + '</span>';
    },
    labelSelector: null,
    parts: { gap: 'A', on: 'B', fs: 'B', lh: 'B', mh: 'B', mw: 'B', off: 'C', oc: 'D', oo: 'D', ow: 'D' },
    anchors: { A: { part: null, side: 'top' }, B: { part: STAR_ON, side: 'left' }, C: { part: STAR_OFF, side: 'right' }, D: { part: STAR_FOCUS, side: 'bottom' } },
    sections: [['Stars', ['gap', 'on', 'off', 'fs', 'lh']], ['Target', ['mh', 'mw']], ['Focus', ['oc', 'oo', 'ow']]],
    matrixLabel: 'Rating values by mode and state',
    statesHead: 'Modes and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Combobox (<Combobox>, div.plx-combobox: a field that filters a list): one choice, or several (tags) with create.
  // Drawn open in place (the list is absolute under the field): .ds-more-combobox gives it room.
  var CB = function (n) { return 'plx-comp-combobox-' + n; };
  var FIELD = '.plx-combobox__field', INPUT = '.plx-combobox__input', CHEV = '.plx-combobox__chevron', LIST = '.plx-combobox__list';
  var OPTION = '.plx-combobox__option:not(.is-selected):not(.plx-combobox__create)', ACTIVE = '.plx-combobox__option.is-active', SELECTED = '.plx-combobox__option.is-selected';
  var CREATE = '.plx-combobox__create', EMPTY = '.plx-combobox__empty', GROUP = '.plx-combobox__group';
  // the parts of the open list, and their tokens: drawn only while the list is open
  var LIST_TOKENS = {
    lbg: 'list-background', lbc: 'list-border-color', lbw: 'list-border-width', lrad: 'list-radius', lsh: 'list-shadow', lmt: 'list-margin-block-start',
    lmh: 'list-max-height', lpy: 'list-padding-block', lpx: 'list-padding-inline'
  };
  var GROUP_TOKENS = {   // the grouped options (content: groups)
    orad: 'option-radius', ofg: 'option-text', ofs: 'option-font-size', oh: 'option-min-height', opx: 'option-padding-inline', abg: 'option-active-background',
    sfg: 'option-selected-text', sfw: 'option-selected-font-weight', gfg: 'group-text', gff: 'group-font-family', gfs: 'group-font-size', gfw: 'group-font-weight',
    gpt: 'group-padding-block-start', gpb: 'group-padding-block-end', gpx: 'group-padding-inline'
  };
  var CREATE_TOKENS = { crfg: 'create-text', crfw: 'create-font-weight' };   // several: the create option
  var EMPTY_TOKENS = { efg: 'empty-text', efs: 'empty-font-size', epy: 'empty-padding-block', epx: 'empty-padding-inline' };   // one choice, nothing matches
  var FIELD_TOKENS = {
    maxw: 'max-width', fgap: 'field-gap', frg: 'field-row-gap', fpe: 'field-padding-inline-end', ib: 'input-flex-basis', ih: 'input-min-height',
    iph: 'input-placeholder-text', cbg: 'chevron-background', cw: 'chevron-width', ch: 'chevron-height', ci: 'chevron-inset-inline-end'
  };
  DS.registerLab('combobox', {
    name: 'Combobox', title: 'Plenix combobox', file: 'platform/components/Combobox/combobox.css', compPrefix: /^plx-comp-combobox-/,
    store: 'plenix-combobox-lab-tokens', sizes: [['default', 'Default', '.plx-combobox']],
    variants: [['single', 'One choice'], ['multiple', 'Several, with create']],
    states: [['default', 'Open (the list showing)'], ['closed', 'Closed'], ['disabled', 'Disabled']],
    content: [['groups', 'Options under group headings'], ['empty', 'Nothing matches']],
    labels: { size: 'Size', variant: 'Selection', state: 'State', content: 'Options' },
    defaults: { size: 'default', variant: 'single', state: 'default', content: 'groups' },
    props: [
      { id: 'maxw', label: 'Maximum width', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
      { id: 'fgap', label: 'Field gap (tags and text)', css: ['column-gap'], part: FIELD, cat: 'space', extra: ['0'] },
      { id: 'frg', label: 'Field row gap (wrapped tags)', css: ['row-gap'], part: FIELD, cat: 'space', extra: ['0'] },
      { id: 'fpe', label: 'Field padding right (room for the chevron)', css: ['padding-inline-end'], show: 'padding-right', part: FIELD, cat: 'space' },
      { id: 'mpb', label: 'Field padding top & bottom (several)', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: FIELD, cat: 'space' },
      { id: 'mpl', label: 'Field padding left (several)', css: ['padding-inline-start'], show: 'padding-left', part: FIELD, cat: 'space' },
      { id: 'dbg', label: 'Disabled field background', css: ['background-color'], part: FIELD, cat: 'color' },
      { id: 'dfg', label: 'Disabled field text color', css: ['color'], part: FIELD, cat: 'color' },
      { id: 'ib', label: 'Text input basis', css: ['flex-basis'], part: INPUT, cat: 'size' },
      { id: 'ih', label: 'Text input minimum height', css: ['min-block-size'], show: 'min-height', part: INPUT, cat: 'control-height' },
      { id: 'iph', label: 'Placeholder color', css: ['color'], part: INPUT, pseudo: '::placeholder', cat: 'color' },
      { id: 'cbg', label: 'Chevron color', css: ['color'], part: CHEV, cat: 'color' },
      { id: 'cw', label: 'Chevron width', css: ['inline-size'], show: 'width', part: CHEV, cat: 'icon' },
      { id: 'ch', label: 'Chevron height', css: ['block-size'], show: 'height', part: CHEV, cat: 'icon' },
      { id: 'ci', label: 'Chevron inset right', css: ['inset-inline-end'], show: 'right', part: CHEV, cat: 'space' },
      { id: 'lbg', label: 'List background', css: ['background-color'], part: LIST, cat: 'color' },
      { id: 'lbc', label: 'List border color', css: BORDER_COLOR, show: 'border-top-color', part: LIST, cat: 'color' },
      { id: 'lbw', label: 'List border width', css: BORDER_WIDTH, show: 'border-top-width', part: LIST, cat: 'border-width' },
      { id: 'lrad', label: 'List corner radius', css: CORNERS, show: 'border-top-left-radius', part: LIST, cat: 'radius' },
      { id: 'lsh', label: 'List shadow', css: ['box-shadow'], part: LIST, cat: 'shadow' },
      { id: 'lmt', label: 'List distance from the field', css: ['margin-block-start'], show: 'margin-top', part: LIST, cat: 'space', extra: ['0'] },
      { id: 'lmh', label: 'List maximum height', css: ['max-block-size'], show: 'max-height', part: LIST, cat: 'size' },
      { id: 'lpy', label: 'List padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: LIST, cat: 'space', extra: ['0'] },
      { id: 'lpx', label: 'List padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: LIST, cat: 'space', extra: ['0'] },
      { id: 'orad', label: 'Option corner radius', css: CORNERS, show: 'border-top-left-radius', part: OPTION, cat: 'radius' },
      { id: 'ofg', label: 'Option text color', css: ['color'], part: OPTION, cat: 'color' },
      { id: 'ofs', label: 'Option font size', css: ['font-size'], part: OPTION, cat: 'font-size' },
      { id: 'oh', label: 'Option minimum height', css: ['min-block-size'], show: 'min-height', part: OPTION, cat: 'control-height' },
      { id: 'opx', label: 'Option padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: OPTION, cat: 'space' },
      { id: 'abg', label: 'Active option background', css: ['background-color'], part: ACTIVE, cat: 'color' },
      { id: 'sfg', label: 'Chosen option text color', css: ['color'], part: SELECTED, cat: 'color' },
      { id: 'sfw', label: 'Chosen option font weight', css: ['font-weight'], part: SELECTED, cat: 'font-weight' },
      { id: 'crfg', label: 'Create option text color', css: ['color'], part: CREATE, cat: 'color' },
      { id: 'crfw', label: 'Create option font weight', css: ['font-weight'], part: CREATE, cat: 'font-weight' },
      { id: 'efg', label: 'No matches text color', css: ['color'], part: EMPTY, cat: 'color' },
      { id: 'efs', label: 'No matches font size', css: ['font-size'], part: EMPTY, cat: 'font-size' },
      { id: 'epy', label: 'No matches padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: EMPTY, cat: 'space' },
      { id: 'epx', label: 'No matches padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: EMPTY, cat: 'space' },
      { id: 'gfg', label: 'Group heading color', css: ['color'], part: GROUP, cat: 'color' },
      { id: 'gff', label: 'Group heading font family', css: ['font-family'], part: GROUP, cat: 'font' },
      { id: 'gfs', label: 'Group heading font size', css: ['font-size'], part: GROUP, cat: 'font-size' },
      { id: 'gfw', label: 'Group heading font weight', css: ['font-weight'], part: GROUP, cat: 'font-weight' },
      { id: 'gpt', label: 'Group heading padding top', css: ['padding-block-start'], show: 'padding-top', part: GROUP, cat: 'space' },
      { id: 'gpb', label: 'Group heading padding bottom', css: ['padding-block-end'], show: 'padding-bottom', part: GROUP, cat: 'space' },
      { id: 'gpx', label: 'Group heading padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: GROUP, cat: 'space' }
    ],
    token: function (id, size, variant, state, content) {
      var multi = variant === 'multiple', open = state === 'default', groups = content === 'groups';
      if (FIELD_TOKENS[id]) return CB(FIELD_TOKENS[id]);
      if (id === 'mpb') return multi ? CB('multiple-field-padding-block') : null;
      if (id === 'mpl') return multi ? CB('multiple-field-padding-inline-start') : null;
      if (id === 'dbg') return state === 'disabled' ? 'plx-comp-input-disabled-background' : null; // the field is an Input: its disabled look is Input's
      if (id === 'dfg') return state === 'disabled' ? 'plx-comp-input-disabled-text' : null;
      if (!open) return null;
      if (LIST_TOKENS[id]) return CB(LIST_TOKENS[id]);
      if (GROUP_TOKENS[id]) return groups ? CB(GROUP_TOKENS[id]) : null;
      if (CREATE_TOKENS[id]) return multi ? CB(CREATE_TOKENS[id]) : null;
      if (EMPTY_TOKENS[id]) return !groups && !multi ? CB(EMPTY_TOKENS[id]) : null;
      return null;
    },
    reach: function (full) { return /multiple-|create-/.test(full) ? 'every combobox that takes several' : /disabled-/.test(full) ? 'every disabled combobox' : /group-/.test(full) ? 'every group heading in a combobox list' : 'every combobox'; },
    every: 'every combobox',
    html: function (variant, size, state, extraCls, ui) {
      var multi = variant === 'multiple', open = state === 'default', groups = !ui || ui.content !== 'empty';
      var tag = function (t) { return '<span class="plx-tag"><span class="plx-tag__label">' + t + '</span><button type="button" tabindex="-1" class="plx-tag__remove" aria-label="Remove ' + t + '"><span aria-hidden="true">×</span></button></span>'; };
      var text = multi ? (groups ? 'Go' : 'Gold leaf') : (groups ? 'Ra' : 'Zed');
      var opt = function (label, c, sel) { return '<li role="option" aria-selected="' + !!sel + '" class="plx-combobox__option' + c + '">' + label + '</li>'; };
      var head = function (label) { return '<li class="plx-combobox__group" role="presentation">' + label + '</li>'; };
      var items = multi
        ? (groups ? head('Colors') + opt('Gold', ' is-active') + opt('Golden hour', '') + head('Seasons') + opt('Autumn gold', ' is-selected', true) : '') + opt('Create “' + text + '”', ' plx-combobox__create' + (groups ? '' : ' is-active'))
        : (groups ? head('People') + opt('Jordan Avery', ' is-active') + opt('Rachel Ng', ' is-selected', true) + head('Teams') + opt('Rights team', '') : '<li class="plx-combobox__empty" role="presentation">No matches</li>');
      return '<div class="ds-more-combobox' + (open ? ' ds-more-combobox--open' : '') + '"><div class="plx-combobox' + (multi ? ' plx-combobox--multiple' : '') + (open ? ' is-open' : '') + (state === 'disabled' ? ' is-disabled' : '') + cls(extraCls) + '">'
        + '<div class="plx-combobox__field plx-input' + (state === 'disabled' ? ' is-disabled' : '') + '">' + (multi ? tag('Autumn gold') : '')
        + '<input class="plx-combobox__input" role="combobox" tabindex="-1" aria-label="' + (multi ? 'Tags' : 'Owner') + '" aria-expanded="' + open + '" aria-autocomplete="list" placeholder="' + (multi ? 'Add a tag' : 'Choose an owner') + '" value="' + (open ? text : '') + '"' + (state === 'disabled' ? ' disabled' : '') + '>'
        + '<span class="plx-combobox__chevron" aria-hidden="true">' + DS.icon('select-chevron') + '</span></div>'
        + (open ? '<ul class="plx-combobox__list" role="listbox"' + (multi ? ' aria-multiselectable="true"' : '') + ' aria-label="Options">' + items + '</ul>' : '') + '</div></div>';
    },
    labelSelector: INPUT,
    parts: { maxw: 'A', fgap: 'A', frg: 'A', fpe: 'A', mpb: 'A', mpl: 'A', dbg: 'A', dfg: 'A', ib: 'B', ih: 'B', iph: 'B', cbg: 'C', cw: 'C', ch: 'C', ci: 'C',
      lbg: 'D', lbc: 'D', lbw: 'D', lrad: 'D', lsh: 'D', lmt: 'D', lmh: 'D', lpy: 'D', lpx: 'D', orad: 'E', ofg: 'E', ofs: 'E', oh: 'E', opx: 'E', abg: 'F', sfg: 'G', sfw: 'G',
      crfg: 'H', crfw: 'H', efg: 'H', efs: 'H', epy: 'H', epx: 'H', gfg: 'I', gff: 'I', gfs: 'I', gfw: 'I', gpt: 'I', gpb: 'I', gpx: 'I' },
    anchors: { A: { part: FIELD, side: 'left' }, B: { part: INPUT, side: 'top' }, C: { part: CHEV, side: 'right' }, D: { part: LIST, side: 'right' }, E: { part: OPTION, side: 'right' },
      F: { part: ACTIVE, side: 'right' }, G: { part: SELECTED, side: 'right' }, H: { part: CREATE + ', ' + EMPTY, side: 'left' }, I: { part: GROUP, side: 'left' } },
    sections: [['Field', ['maxw', 'fgap', 'frg', 'fpe', 'mpb', 'mpl', 'dbg', 'dfg']], ['Text input', ['ib', 'ih', 'iph']], ['Chevron', ['cbg', 'cw', 'ch', 'ci']],
      ['List', ['lbg', 'lbc', 'lbw', 'lrad', 'lsh', 'lmt', 'lmh', 'lpy', 'lpx']], ['Options', ['orad', 'ofg', 'ofs', 'oh', 'opx', 'abg', 'sfg', 'sfw']],
      ['Create and no matches', ['crfg', 'crfw', 'efg', 'efs', 'epy', 'epx']], ['Group headings', ['gfg', 'gff', 'gfs', 'gfw', 'gpt', 'gpb', 'gpx']]],
    matrixLabel: 'Combobox values by selection and state',
    statesHead: 'Selections and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Search input (<SearchField>, div.plx-search: the icon, the input, the clear button or the shortcut) on the page or
  // on the accent header (.ds-more-accent draws the header's surface behind it)
  var SR = function (n) { return 'plx-comp-search-' + n; };
  var S_INPUT = '.plx-search__input', S_ICON = '.plx-search__icon', S_CLEAR = '.plx-search__clear', S_KBD = '.plx-search__kbd';
  DS.registerLab('search-input', {
    name: 'Search input', title: 'Plenix search input', file: 'platform/components/SearchField/search-field.css', compPrefix: /^plx-comp-search-(input|icon|clear|kbd|on-accent)-/,
    store: 'plenix-search-input-lab-tokens', sizes: [['default', 'Default', '.plx-search']],
    variants: [['page', 'On the page'], ['accent', 'On the accent header']],
    states: [['default', 'Default'], ['focus', 'Focus (the input)'], ['clear-hover', 'Hover (the clear button)'], ['clear-focus', 'Focus (the clear button)']],
    content: [['query', 'A query (with clear)'], ['empty', 'Empty (with its shortcut)']],
    labels: { size: 'Size', variant: 'Placement', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'page', state: 'default', content: 'query' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], part: S_INPUT, cat: 'color' },
      { id: 'bc', label: 'Border color', css: BORDER_COLOR, show: 'border-top-color', part: S_INPUT, cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTH, show: 'border-top-width', part: S_INPUT, cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', part: S_INPUT, cat: 'radius' },
      { id: 'fg', label: 'Text color', css: ['color'], part: S_INPUT, cat: 'color' },
      { id: 'ff', label: 'Font family', css: ['font-family'], part: S_INPUT, cat: 'font' },
      { id: 'fs', label: 'Font size', css: ['font-size'], part: S_INPUT, cat: 'font-size' },
      { id: 'h', label: 'Minimum height', css: ['min-block-size'], show: 'min-height', part: S_INPUT, cat: 'control-height' },
      { id: 'pis', label: 'Padding left (room for the icon)', css: ['padding-inline-start'], show: 'padding-left', part: S_INPUT, cat: 'space' },
      { id: 'pie', label: 'Padding right (room for clear)', css: ['padding-inline-end'], show: 'padding-right', part: S_INPUT, cat: 'space' },
      { id: 'ph', label: 'Placeholder color', css: ['color'], part: S_INPUT, pseudo: '::placeholder', cat: 'color' },
      { id: 'ic', label: 'Icon color', css: ['color'], part: S_ICON, cat: 'color' },
      { id: 'ii', label: 'Icon inset left', css: ['inset-inline-start'], show: 'left', part: S_ICON, cat: 'space' },
      { id: 'cc', label: 'Clear button color', css: ['color'], part: S_CLEAR, cat: 'color' },
      { id: 'cbg', label: 'Clear button hover background', css: ['background-color'], part: S_CLEAR, cat: 'color' },
      { id: 'cw', label: 'Clear button width', css: ['inline-size'], show: 'width', part: S_CLEAR, cat: 'control-height' },
      { id: 'ch', label: 'Clear button height', css: ['block-size'], show: 'height', part: S_CLEAR, cat: 'control-height' },
      { id: 'crad', label: 'Clear button corner radius', css: CORNERS, show: 'border-top-left-radius', part: S_CLEAR, cat: 'radius' },
      { id: 'ci', label: 'Clear button inset right', css: ['inset-inline-end'], show: 'right', part: S_CLEAR, cat: 'space' },
      { id: 'ki', label: 'Shortcut inset right', css: ['inset-inline-end'], show: 'right', part: S_KBD, cat: 'space' }
    ].concat(ring(S_CLEAR)),
    token: function (id, size, variant, state, content) {
      var acc = variant === 'accent', query = content === 'query';
      switch (id) {
        case 'bg': return acc ? SR('on-accent-input-background') : SR('input-background');
        case 'bc': return acc ? SR('on-accent-input-border-color') : state === 'focus' ? SR('input-focus-border-color') : SR('input-border-color');
        case 'bw': return SR('input-border-width');
        case 'rad': return SR('input-radius');
        case 'fg': return acc ? SR('on-accent-input-text') : SR('input-text');
        case 'ff': return SR('input-font-family');
        case 'fs': return SR('input-font-size');
        case 'h': return SR('input-min-height');
        case 'pis': return SR('input-padding-inline-start');
        case 'pie': return SR('input-padding-inline-end');
        case 'ph': return acc ? SR('on-accent-input-placeholder-text') : SR('input-placeholder-text');
        case 'ic': return acc ? SR('on-accent-icon-text') : SR('icon-text');
        case 'ii': return SR('icon-inset-inline-start');
        case 'cc': return !query ? null : acc ? SR('on-accent-icon-text') : state === 'clear-hover' ? SR('clear-hover-text') : SR('clear-text');
        case 'cbg': return query && state === 'clear-hover' ? SR('clear-hover-background') : null;
        case 'cw': return query ? SR('clear-width') : null;
        case 'ch': return query ? SR('clear-height') : null;
        case 'crad': return query ? SR('clear-radius') : null;
        case 'ci': return query ? SR('clear-inset-inline-end') : null;
        case 'ki': return query ? null : SR('kbd-inset-inline-end');
        default: return query && state === 'clear-focus' ? ringToken(id, SR('clear-')) : null;
      }
    },
    reach: function (full) { return /on-accent-/.test(full) ? 'every search input on the accent header' : /clear-/.test(full) ? 'the clear button of every search input' : 'every search input'; },
    every: 'every search input',
    html: function (variant, size, state, extraCls, ui) {
      var acc = variant === 'accent', query = !ui || ui.content !== 'empty';
      var field = '<div class="plx-search' + (acc ? ' plx-search--on-accent' : '') + cls(extraCls) + '" role="search">'
        + '<span class="plx-search__icon" aria-hidden="true">' + DS.icon('search') + '</span>'
        + '<input type="search" tabindex="-1" class="plx-search__input' + (state === 'focus' ? ' is-focused' : '') + '" aria-label="Search" placeholder="Search assets" value="' + (query ? 'sunset' : '') + '">'
        + (query ? '<button type="button" tabindex="-1" class="plx-search__clear' + (state === 'clear-hover' ? ' is-hover' : state === 'clear-focus' ? ' is-focus-visible' : '') + '" aria-label="Clear search">' + DS.icon('close') + '</button>'
          : '<span class="plx-search__kbd"><kbd class="plx-kbd' + (acc ? ' plx-kbd--on-accent' : '') + '">Ctrl K</kbd></span>') + '</div>';
      return '<div class="ds-more-frame' + (acc ? ' ds-more-accent' : '') + '">' + field + '</div>';
    },
    labelSelector: S_INPUT,
    parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', h: 'A', pis: 'A', pie: 'A', fg: 'B', ff: 'B', fs: 'B', ph: 'B', ic: 'C', ii: 'C', cc: 'D', cbg: 'D', cw: 'D', ch: 'D', crad: 'D', ci: 'D', oc: 'D', oo: 'D', ow: 'D', ki: 'E' },
    anchors: { A: { part: S_INPUT, side: 'top' }, B: { part: S_INPUT, side: 'bottom' }, C: { part: S_ICON, side: 'left' }, D: { part: S_CLEAR, side: 'right' }, E: { part: S_KBD, side: 'right' } },
    sections: [['Field', ['bg', 'bc', 'bw', 'rad', 'h', 'pis', 'pie']], ['Text', ['fg', 'ff', 'fs', 'ph']], ['Icon', ['ic', 'ii']], ['Clear button', ['cc', 'cbg', 'cw', 'ch', 'crad', 'ci', 'oc', 'oo', 'ow']], ['Shortcut', ['ki']]],
    matrixLabel: 'Search input values by placement and state',
    statesHead: 'Placements and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Empty state (<EmptyState>, div.plx-empty-state: an icon, a title, a line of text and an action) inline or for the page
  var ES = function (n) { return 'plx-comp-empty-state-' + n; };
  DS.registerLab('empty-state', {
    name: 'Empty state', title: 'Plenix empty state', file: 'platform/components/EmptyState/empty-state.css', compPrefix: /^plx-comp-empty-state-/,
    store: 'plenix-empty-state-lab-tokens',
    sizes: [['inline', 'Inline (in a list or panel)', '.plx-empty-state--inline'], ['page', 'Page (the whole main region)', '.plx-empty-state--page']],
    variants: [['full', 'Icon, title, text and action'], ['text', 'Text only'], ['error', 'Error: what failed and the one action that recovers']],
    states: STATIC, content: [['assets', 'No assets yet']],
    labels: { size: 'Size', variant: 'Parts and tone', state: 'State', content: 'Content' },
    defaults: { size: 'inline', variant: 'full', state: 'default', content: 'assets' },
    props: [
      { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
      { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
      { id: 'gap', label: 'Gap between parts', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'icfg', label: 'Icon color', css: ['color'], part: '.plx-empty-state__icon', cat: 'color' },
      { id: 'icfs', label: 'Icon box font size', css: ['font-size'], part: '.plx-empty-state__icon', cat: 'font-size' },
      { id: 'iclh', label: 'Icon box line height', css: ['line-height'], part: '.plx-empty-state__icon', cat: 'line-height' },
      { id: 'tfg', label: 'Title color', css: ['color'], part: '.plx-empty-state__title', cat: 'color' },
      { id: 'tfs', label: 'Title font size', css: ['font-size'], part: '.plx-empty-state__title', cat: 'font-size' },
      { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-empty-state__title', cat: 'font-weight' },
      { id: 'mw', label: 'Text maximum width', css: ['max-inline-size'], show: 'max-width', part: '.plx-empty-state__text', cat: 'size' },
      { id: 'am', label: 'Action distance above', css: ['margin-block-start'], show: 'margin-top', part: '.plx-empty-state__action', cat: 'space', extra: ['0'] }
    ],
    token: function (id, size, variant) {
      var full = variant === 'full' || variant === 'error';
      switch (id) {
        case 'fg': return ES('text');
        case 'fs': return ES(size + '-font-size');
        case 'gap': return ES('row-gap');
        case 'py': return ES(size + '-padding-block');
        case 'px': return ES(size + '-padding-inline');
        case 'icfg': return variant === 'error' ? ES('error-icon-text') : full ? ES('icon-text') : null;
        case 'icfs': return full ? ES('icon-font-size') : null;
        case 'iclh': return full ? ES('icon-line-height') : null;
        case 'tfg': return full ? ES('title-text') : null;
        case 'tfs': return full ? ES('title-font-size') : null;
        case 'tfw': return full ? ES('title-font-weight') : null;
        case 'mw': return ES('text-max-width');
        case 'am': return full ? ES('action-margin-block-start') : null;
        default: return null;
      }
    },
    reach: function (full) { return /-inline-(font|padding)/.test(full) ? 'every inline empty state' : /-page-/.test(full) ? 'every page empty state' : /-error-/.test(full) ? 'every error empty state' : 'every empty state'; },
    every: 'every empty state',
    html: function (variant, size, state, extraCls) {
      if (variant === 'error') {
        // the error tone (platforms.md 5.5): the problem named, the icon in the danger color, one action that recovers
        return '<div class="plx-empty-state plx-empty-state--' + size + ' plx-empty-state--error' + cls(extraCls) + '">'
          + '<div class="plx-empty-state__icon" aria-hidden="true">' + DS.icon('warning') + '</div><div class="plx-empty-state__title">The assets could not load</div>'
          + '<div class="plx-empty-state__text">The server did not answer.</div>'
          + '<div class="plx-empty-state__action"><button type="button" tabindex="-1" class="plx-button plx-button--secondary"><span class="plx-button__label">Retry</span></button></div></div>';
      }
      var full = variant === 'full';
      return '<div class="plx-empty-state plx-empty-state--' + size + cls(extraCls) + '">'
        + (full ? '<div class="plx-empty-state__icon" aria-hidden="true">' + DS.icon('folder') + '</div><div class="plx-empty-state__title">No assets yet</div>' : '')
        + '<div class="plx-empty-state__text">Upload files to start.</div>'
        + (full ? '<div class="plx-empty-state__action"><button type="button" tabindex="-1" class="plx-button plx-button--primary"><span class="plx-button__label">Upload</span></button></div>' : '') + '</div>';
    },
    labelSelector: '.plx-empty-state__text',
    parts: { fg: 'A', fs: 'A', mw: 'A', gap: 'B', py: 'B', px: 'B', icfg: 'C', icfs: 'C', iclh: 'C', tfg: 'D', tfs: 'D', tfw: 'D', am: 'E' },
    anchors: { A: { part: '.plx-empty-state__text', side: 'right' }, B: { part: null, side: 'left' }, C: { part: '.plx-empty-state__icon', side: 'right' }, D: { part: '.plx-empty-state__title', side: 'right' }, E: { part: '.plx-empty-state__action', side: 'right' } },
    sections: [['Region', ['fg', 'fs', 'gap', 'py', 'px']], ['Icon', ['icfg', 'icfs', 'iclh']], ['Title', ['tfg', 'tfs', 'tfw']], ['Text and action', ['mw', 'am']]],
    matrixLabel: 'Empty state values by size and parts',
    statesHead: 'Parts · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Preview (<Preview>, div or button.plx-preview: a sunken box at an aspect ratio with the asset's picture, and marks
  // in its corners). .ds-more-frame gives it a width; .ds-more-media stands in for the thumbnail.
  var PV = function (n) { return 'plx-comp-preview-' + n; };
  var TOP_START = '.plx-preview__corner--top-start', BOTTOM_END = '.plx-preview__corner--bottom-end';
  DS.registerLab('preview', {
    name: 'Preview', title: 'Plenix preview', file: 'platform/components/Preview/preview.css', compPrefix: /^plx-comp-preview-/,
    store: 'plenix-preview-lab-tokens', sizes: [['default', 'Default (4/3)', '.plx-preview']],
    variants: [['display', 'A display'], ['button', 'A button (opens it)']],
    states: [['default', 'Default'], ['hover', 'Hover (a button)'], ['focus', 'Focus (a button)']],
    content: [['picture', 'A thumbnail with corner marks'], ['icon', 'An icon only']],
    labels: { size: 'Size', variant: 'Element', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'display', state: 'default', content: 'picture' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'fg', label: 'Text and icon color', css: ['color'], cat: 'color' },
      { id: 'gap', label: 'Gap between parts', css: ['row-gap'], cat: 'space', extra: ['0'] },
      { id: 'mw', label: 'Picture width', css: ['inline-size'], show: 'width', part: '.plx-preview__media', cat: 'size' },
      { id: 'mh', label: 'Picture height', css: ['block-size'], show: 'height', part: '.plx-preview__media', cat: 'size' },
      { id: 'tst', label: 'Top corner mark inset top', css: ['inset-block-start'], show: 'top', part: TOP_START, cat: 'space' },
      { id: 'tsl', label: 'Top corner mark inset left', css: ['inset-inline-start'], show: 'left', part: TOP_START, cat: 'space' },
      { id: 'beb', label: 'Bottom corner mark inset bottom', css: ['inset-block-end'], show: 'bottom', part: BOTTOM_END, cat: 'space' },
      { id: 'ber', label: 'Bottom corner mark inset right', css: ['inset-inline-end'], show: 'right', part: BOTTOM_END, cat: 'space' }
    ].concat(ring(null)),
    token: function (id, size, variant, state, content) {
      var btn = variant === 'button', pic = content === 'picture';
      switch (id) {
        case 'bg': return btn && state === 'hover' ? PV('button-hover-background') : PV('background');
        case 'rad': return PV('radius');
        case 'fg': return PV('text');
        case 'gap': return PV('row-gap');
        case 'mw': return pic ? PV('media-width') : null;
        case 'mh': return pic ? PV('media-height') : null;
        case 'tst': return pic ? PV('corner-top-start-inset-block-start') : null;
        case 'tsl': return pic ? PV('corner-top-start-inset-inline-start') : null;
        case 'beb': return pic ? PV('corner-bottom-end-inset-block-end') : null;
        case 'ber': return pic ? PV('corner-bottom-end-inset-inline-end') : null;
        default: return btn && state === 'focus' ? ringToken(id, PV('button-')) : null;
      }
    },
    reach: function (full) { return /-button-/.test(full) ? 'every preview that opens' : /-corner--/.test(full) ? 'the corner marks of every preview' : 'every preview'; },
    every: 'every preview',
    html: function (variant, size, state, extraCls, ui) {
      var btn = variant === 'button', pic = !ui || ui.content !== 'icon';
      var inner = pic ? '<span class="plx-preview__media ds-more-media" aria-hidden="true"></span>'
        + '<span class="plx-preview__corner plx-preview__corner--top-start"><span class="plx-tag"><span class="plx-tag__label">PNG</span></span></span>'
        + '<span class="plx-preview__corner plx-preview__corner--bottom-end">' + DS.icon('expand') + '</span>'
        : DS.icon('image-b') + '<span>No preview</span>';
      var c = 'plx-preview' + (btn ? ' plx-preview--button' + (state === 'hover' ? ' ds-hover' : state === 'focus' ? ' is-focus-visible' : '') : '') + cls(extraCls);
      return '<div class="ds-more-frame">' + (btn ? '<button type="button" tabindex="-1" aria-label="Open sunset.png" class="' + c + '" data-plx-aspect="4/3">' + inner + '</button>' : '<div class="' + c + '" data-plx-aspect="4/3">' + inner + '</div>') + '</div>';
    },
    labelSelector: null,
    parts: { bg: 'A', rad: 'A', fg: 'B', gap: 'B', mw: 'B', mh: 'B', tst: 'C', tsl: 'C', beb: 'D', ber: 'D', oc: 'E', oo: 'E', ow: 'E' },
    anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-preview__media, .plx-icon', side: 'left' }, C: { part: TOP_START, side: 'left' }, D: { part: BOTTOM_END, side: 'right' }, E: { part: null, side: 'bottom' } },
    sections: [['Surface', ['bg', 'rad', 'fg', 'gap']], ['Picture', ['mw', 'mh']], ['Corner marks', ['tst', 'tsl', 'beb', 'ber']], ['Focus', ['oc', 'oo', 'ow']]],
    matrixLabel: 'Preview values by element and state',
    statesHead: 'Elements and states · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Chat (<Chat>: its messages, theirs and mine, in the thread, and the typing dots) (record typing-indicator).
  // Drawn in a thread (.plx-chat__thread) inside .ds-more-frame--chat, which gives it a width.
  var CT = function (n) { return 'plx-comp-chat-' + n; };
  var BUBBLE = '.plx-chat__bubble', DOT = 'span[aria-hidden]';
  DS.registerLab('typing-indicator', {
    name: 'Chat', title: 'Plenix chat', file: 'platform/components/Chat/chat.css', compPrefix: /^plx-comp-chat-/,
    store: 'plenix-chat-lab-tokens', sizes: [['default', 'Default', '.plx-chat__message']],
    variants: [['theirs', 'Theirs'], ['mine', 'Mine'], ['typing', 'Typing']],
    states: STATIC, content: [['message', 'A message with its author and time']],
    labels: { size: 'Size', variant: 'Message', state: 'State', content: 'Content' },
    defaults: { size: 'default', variant: 'theirs', state: 'default', content: 'message' },
    props: [
      { id: 'tbg', label: 'Thread background', css: ['background-color'], host: 'parent', cat: 'color' },
      { id: 'mg', label: 'Gap (avatar to bubble)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'bg', label: 'Bubble background', css: ['background-color'], part: BUBBLE, cat: 'color' },
      { id: 'bc', label: 'Bubble border color', css: BORDER_COLOR, show: 'border-top-color', part: BUBBLE, cat: 'color' },
      { id: 'bw', label: 'Bubble border width', css: BORDER_WIDTH, show: 'border-top-width', part: BUBBLE, cat: 'border-width' },
      { id: 'rad', label: 'Bubble corner radius', css: CORNERS, show: 'border-top-left-radius', part: BUBBLE, cat: 'radius' },
      { id: 'fg', label: 'Bubble text color', css: ['color'], part: BUBBLE, cat: 'color' },
      { id: 'fs', label: 'Bubble font size', css: ['font-size'], part: BUBBLE, cat: 'font-size' },
      { id: 'py', label: 'Bubble padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: BUBBLE, cat: 'space' },
      { id: 'px', label: 'Bubble padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: BUBBLE, cat: 'space' },
      { id: 'rg', label: 'Bubble row gap (meta to text)', css: ['row-gap'], part: BUBBLE, cat: 'space' },
      { id: 'meg', label: 'Meta gap (author to time)', css: ['column-gap'], part: '.plx-chat__meta', cat: 'space' },
      { id: 'mefs', label: 'Meta font size', css: ['font-size'], part: '.plx-chat__meta', cat: 'font-size' },
      { id: 'afw', label: 'Author font weight', css: ['font-weight'], part: '.plx-chat__author', cat: 'font-weight' },
      { id: 'tff', label: 'Time font family', css: ['font-family'], part: '.plx-chat__time', cat: 'font' },
      { id: 'top', label: 'Time opacity (theirs)', css: ['opacity'], part: '.plx-chat__time', cat: 'opacity' },
      { id: 'dg', label: 'Gap between dots', css: ['column-gap'], cat: 'space' },
      { id: 'dbg', label: 'Dot color', css: ['background-color'], part: DOT, cat: 'color' },
      { id: 'dw', label: 'Dot width', css: ['inline-size'], show: 'width', part: DOT, cat: 'icon' },
      { id: 'dh', label: 'Dot height', css: ['block-size'], show: 'height', part: DOT, cat: 'icon' },
      { id: 'drad', label: 'Dot corner radius', css: CORNERS, show: 'border-top-left-radius', part: DOT, cat: 'radius' }
    ],
    token: function (id, size, variant) {
      var mine = variant === 'mine';
      if (variant === 'typing') return { tbg: CT('thread-background'), dg: CT('typing-gap'), dbg: CT('typing-dot-background'), dw: CT('typing-dot-width'), dh: CT('typing-dot-height'), drad: CT('typing-dot-radius') }[id] || null;
      switch (id) {
        case 'tbg': return CT('thread-background');
        case 'mg': return CT('message-gap');
        case 'bg': return CT(mine ? 'message-mine-bubble-background' : 'bubble-background');
        case 'bc': return CT(mine ? 'message-mine-bubble-border-color' : 'bubble-border-color');
        case 'bw': return CT('bubble-border-width');
        case 'rad': return CT('bubble-radius');
        case 'fg': return CT(mine ? 'message-mine-bubble-text' : 'bubble-text');
        case 'fs': return CT('bubble-font-size');
        case 'py': return CT('bubble-padding-block');
        case 'px': return CT('bubble-padding-inline');
        case 'rg': return CT('bubble-row-gap');
        case 'meg': return CT('meta-gap');
        case 'mefs': return CT('meta-font-size');
        case 'afw': return mine ? null : CT('author-font-weight');
        case 'tff': return CT('time-font-family');
        case 'top': return mine ? null : CT('message-others-time-opacity');
        default: return null;
      }
    },
    reach: function (full) { return /--mine-/.test(full) ? 'every message of yours' : /typing-/.test(full) ? 'every typing indicator' : /thread-/.test(full) ? 'every chat thread' : 'every chat message'; },
    every: 'every chat message',
    html: function (variant, size, state, extraCls) {
      var mine = variant === 'mine', body;
      if (variant === 'typing') body = '<span class="plx-chat__typing' + cls(extraCls) + '" role="status"><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span><span class="plx-visually-hidden">Typing</span></span>';
      else body = '<div class="plx-chat__message' + (mine ? ' plx-chat__message--mine' : '') + cls(extraCls) + '"><div class="plx-chat__bubble"><div class="plx-chat__meta">'
        + (mine ? '<span class="plx-visually-hidden">You</span>' : '<span class="plx-chat__author">Rachel Ng</span>') + '<time class="plx-chat__time" datetime="2026-10-10T09:41">09:41</time></div>'
        + '<div class="plx-chat__body">' + (mine ? 'Sent the final cut.' : 'Can you check the new cover?') + '</div></div></div>';
      return '<div class="ds-more-frame ds-more-frame--chat"><div class="plx-chat__thread" role="log" aria-label="Conversation">' + body + '</div></div>';
    },
    labelSelector: '.plx-chat__body',
    parts: { tbg: 'A', mg: 'A', bg: 'B', bc: 'B', bw: 'B', rad: 'B', py: 'B', px: 'B', rg: 'B', fg: 'C', fs: 'C', meg: 'D', mefs: 'D', afw: 'D', tff: 'D', top: 'D', dg: 'E', dbg: 'E', dw: 'E', dh: 'E', drad: 'E' },
    anchors: { A: { part: null, side: 'left' }, B: { part: BUBBLE, side: 'top' }, C: { part: '.plx-chat__body', side: 'bottom' }, D: { part: '.plx-chat__meta', side: 'right' }, E: { part: null, side: 'right' } },
    sections: [['Thread', ['tbg', 'mg']], ['Bubble', ['bg', 'bc', 'bw', 'rad', 'py', 'px', 'rg']], ['Text', ['fg', 'fs']], ['Author and time', ['meg', 'mefs', 'afw', 'tff', 'top']], ['Typing dots', ['dg', 'dbg', 'dw', 'dh', 'drad']]],
    matrixLabel: 'Chat values by message',
    statesHead: 'Messages · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });

  // ---- Bulk action bar (<BulkActions>, div.plx-bulk-actions: the selection summary, a divider and the actions) with
  // something selected, or with nothing selected (always shown, neutral, its actions disabled)
  var BA = function (n) { return 'plx-comp-bulk-actions-' + n; }, SS = function (n) { return 'plx-comp-selection-summary-' + n; };
  var DIV = '.plx-bulk-actions__divider', BLIST = '.plx-bulk-actions__list', COUNT = '.plx-selection-summary__count';
  DS.registerLab('bulk-action-bar', {
    name: 'Bulk action bar', title: 'Plenix bulk action bar', file: 'platform/patterns/BulkActions/bulk-actions.css', compPrefix: /^plx-comp-(bulk-actions|selection-summary)-/,
    store: 'plenix-bulk-action-bar-lab-tokens', sizes: [['default', 'Default', '.plx-bulk-actions']],
    variants: [['selected', 'Something selected'], ['empty', 'Nothing selected']],
    states: STATIC, content: [['actions', 'Three actions and More']],
    labels: { size: 'Size', variant: 'Selection', state: 'State', content: 'Actions' },
    defaults: { size: 'default', variant: 'selected', state: 'default', content: 'actions' },
    props: [
      { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
      { id: 'bc', label: 'Border color', css: BORDER_COLOR, show: 'border-top-color', cat: 'color' },
      { id: 'bw', label: 'Border width', css: BORDER_WIDTH, show: 'border-top-width', cat: 'border-width' },
      { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
      { id: 'gap', label: 'Gap (summary, divider, actions)', css: ['column-gap'], cat: 'space', extra: ['0'] },
      { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
      { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space', extra: ['0'] },
      { id: 'sg', label: 'Summary gap', css: ['column-gap'], part: '.plx-selection-summary', cat: 'space' },
      { id: 'cfg', label: 'Count color', css: ['color'], part: COUNT, cat: 'color' },
      { id: 'cfs', label: 'Count font size', css: ['font-size'], part: COUNT, cat: 'font-size' },
      { id: 'cfw', label: 'Count font weight', css: ['font-weight'], part: COUNT, cat: 'font-weight' },
      { id: 'dh', label: 'Divider height', css: ['block-size'], show: 'height', part: DIV, cat: 'icon' },
      { id: 'dc', label: 'Divider color', css: ['border-inline-start-color'], show: 'border-left-color', part: DIV, cat: 'color' },
      { id: 'dw', label: 'Divider width', css: ['border-inline-start-width'], show: 'border-left-width', part: DIV, cat: 'border-width' },
      { id: 'lh', label: 'Actions row height', css: ['block-size'], show: 'height', part: BLIST, cat: 'control-height' },
      { id: 'lg', label: 'Gap between actions', css: ['column-gap'], part: BLIST, cat: 'space' },
      { id: 'lrg', label: 'Actions row gap (wrapped)', css: ['row-gap'], part: BLIST, cat: 'space' }
    ],
    token: function (id, size, variant) {
      var empty = variant === 'empty';
      switch (id) {
        case 'bg': return BA(empty ? 'empty-background' : 'background');
        case 'bc': return BA(empty ? 'empty-border-color' : 'border-color');
        case 'bw': return BA('border-width');
        case 'rad': return BA('radius');
        case 'gap': return BA('gap');
        case 'py': return BA('padding-block');
        case 'px': return BA('padding-inline');
        case 'sg': return SS('gap');
        case 'cfg': return empty ? BA('empty-selection-summary-count-text') : SS('count-text');
        case 'cfs': return SS('count-font-size');
        case 'cfw': return empty ? BA('empty-selection-summary-count-font-weight') : SS('count-font-weight');
        case 'dh': return BA('divider-height');
        case 'dc': return BA(empty ? 'empty-divider-border-inline-start-color' : 'divider-border-inline-start-color');
        case 'dw': return BA('divider-border-inline-start-width');
        case 'lh': return BA('list-height');
        case 'lg': return BA('list-gap');
        case 'lrg': return BA('list-row-gap');
        default: return null;
      }
    },
    reach: function (full) { return /-empty-/.test(full) ? 'every bulk action bar with nothing selected' : /selection-summary-/.test(full) ? 'every selection summary' : 'every bulk action bar'; },
    every: 'every bulk action bar',
    html: function (variant, size, state, extraCls) {
      var empty = variant === 'empty', dis = empty ? ' disabled' : '';
      var b = function (label, v, more) { return '<span class="plx-bulk-actions__slot"><button type="button" tabindex="-1" class="plx-button plx-button--' + v + ' plx-button--size-sm' + (more ? ' plx-button--caret' : '') + '"' + dis + '><span class="plx-button__label">' + label + '</span>' + (more ? '<span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span>' : '') + '</button></span>'; };
      return '<div class="ds-more-frame ds-more-frame--wide"><div role="toolbar" aria-label="Selection actions" class="plx-bulk-actions' + (empty ? ' plx-bulk-actions--empty' : '') + cls(extraCls) + '">'
        + '<div class="plx-selection-summary"><span class="plx-selection-summary__count">' + (empty ? 'No assets selected' : '3 assets selected') + '</span>'
        + '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm"><span class="plx-button__label">Select all 120</span></button>'
        + (empty ? '' : '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm"><span class="plx-button__label">Clear selection</span></button>') + '</div>'
        + '<span class="plx-bulk-actions__divider" aria-hidden="true"></span><div class="plx-bulk-actions__list">'
        + b('Download', 'secondary') + b('Move', 'secondary') + b('Delete', 'danger-secondary') + b('More', 'secondary', true) + '</div></div></div>';
    },
    labelSelector: COUNT,
    parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', gap: 'B', py: 'B', px: 'B', sg: 'C', cfg: 'C', cfs: 'C', cfw: 'C', dh: 'D', dc: 'D', dw: 'D', lh: 'E', lg: 'E', lrg: 'E' },
    anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'left' }, C: { part: COUNT, side: 'bottom' }, D: { part: DIV, side: 'top' }, E: { part: BLIST, side: 'bottom' } },
    sections: [['Bar', ['bg', 'bc', 'bw', 'rad']], ['Spacing', ['gap', 'py', 'px']], ['Selection summary', ['sg', 'cfg', 'cfs', 'cfw']], ['Divider', ['dh', 'dc', 'dw']], ['Actions', ['lh', 'lg', 'lrg']]],
    matrixLabel: 'Bulk action bar values by selection',
    statesHead: 'Selections · every value (click one to inspect it; the dashed outline marks the one shown below)'
  });
})();
