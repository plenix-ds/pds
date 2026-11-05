/* Plenix design system · library part w03A: the labs of IconTile, Pictogram and Preview's ratios and fits (the Aspect ratio
   page). Preview's lab (more-labs.js) is registered again with the ratios as sizes and the fits as content, and the Aspect
   ratio page has a lab of its own on the same spec, opening on 4:3. Each value with the one token behind it: the
   components' own token files (platform/tokens/components/icon-tile, pictogram, preview). */
if (window.DS && DS.registerLab) {
  (function () {
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var STATIC = [['default', 'Default']];
    var ex = function (c) { return c ? ' ' + c : ''; };

    // ---- IconTile (<IconTile>, span.plx-icon-tile): every hue and tone at every size, outline and filled
    var IT = function (n) { return 'plx-comp-icon-tile-' + n; };
    var TONE = { neutral: 1, info: 1, success: 1, warning: 1, danger: 1 };
    DS.registerLab('icon-tile', {
      name: 'Icon tile', title: 'Plenix icon tile', file: 'platform/components/IconTile/icon-tile.css', compPrefix: /^plx-comp-icon-tile-/,
      store: 'plenix-icon-tile-lab-tokens', sizes: [['sm', 'SM (32px)', '.plx-icon-tile'], ['md', 'MD (40px, default)', '.plx-icon-tile'], ['lg', 'LG (48px)', '.plx-icon-tile']],
      variants: [['gray', 'Gray (default)'], ['blue', 'Blue'], ['green', 'Green'], ['purple', 'Purple'], ['red', 'Red'], ['brown', 'Brown'], ['surface', 'Surface'],
        ['neutral', 'Neutral'], ['info', 'Info'], ['success', 'Success'], ['warning', 'Warning'], ['danger', 'Danger']],
      states: STATIC,
      content: [['outline', 'Outline icon'], ['filled', 'Filled']],
      labels: { size: 'Size', variant: 'Hue or tone', state: 'State', content: 'Icon' },
      defaults: { size: 'md', variant: 'gray', state: 'default', content: 'outline' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: ['border-top-color'], cat: 'color' },
        { id: 'bw', label: 'Border width', css: ['border-top-width'], cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'h', label: 'Height', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'fg', label: 'Icon color', css: ['color'], cat: 'color' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-icon-tile>.plx-icon', cat: 'icon' }
      ],
      token: function (id, size, variant) {
        switch (id) {
          case 'bg': return IT(variant + '-background');
          case 'bc': return TONE[variant] ? IT(variant + '-border-color') : IT('border-color');
          case 'bw': return IT('border-width');
          case 'rad': return IT(size + '-radius');
          case 'w': case 'h': return IT(size + '-size');
          case 'fg': return IT(variant + '-text');
          case 'is': return 'plx-comp-icon-size-' + size; // IconTile draws Icon at its named size (Icon size={size})
          default: return null;
        }
      },
      reach: function (full) { return /-(sm|md|lg)-/.test(full) ? 'every icon tile of that size' : /-border-(width|color)$/.test(full) ? 'every icon tile in a hue' : 'every icon tile in that hue or tone'; },
      every: 'every icon tile',
      html: function (variant, size, state, extraCls, ui) {
        var filled = ui && ui.content === 'filled';
        return '<span class="plx-icon-tile plx-icon-tile--' + size + ' plx-icon-tile--' + variant + ex(extraCls) + '" aria-hidden="true">'
          + DS.icon('briefcase', 'plx-icon--size-' + size + (filled ? ' plx-icon--filled' : '')) + '</span>';
      },
      labelSelector: null,
      parts: { bg: 'A', bc: 'A', bw: 'A', rad: 'A', w: 'A', h: 'A', fg: 'B', is: 'B' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-icon-tile>.plx-icon', side: 'right' } },
      sections: [['Tile', ['bg', 'bc', 'bw', 'rad', 'w', 'h']], ['Icon', ['fg', 'is']]],
      matrixLabel: 'Icon tile values by hue, tone and size',
      statesHead: 'Hues and tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- Pictogram (<Pictogram>, span.plx-pictogram): three sizes, outline and two-tone
    var PG = function (n) { return 'plx-comp-pictogram-' + n; };
    DS.registerLab('pictogram', {
      name: 'Pictogram', title: 'Plenix pictogram', file: 'platform/components/Pictogram/pictogram.css', compPrefix: /^plx-comp-pictogram-/,
      store: 'plenix-pictogram-lab-tokens', sizes: [['48', '48', '.plx-pictogram'], ['64', '64 (default)', '.plx-pictogram'], ['96', '96', '.plx-pictogram']],
      variants: [['outline', 'Outline (default)'], ['two-tone', 'Two-tone (filled + tint)']],
      states: STATIC,
      content: [['symbol', 'A symbol (folder-open)']],
      labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Symbol' },
      defaults: { size: '64', variant: 'outline', state: 'default', content: 'symbol' },
      props: [
        { id: 'bg', label: 'Frame color', css: ['background-color'], cat: 'color' },
        { id: 'rad', label: 'Frame corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'w', label: 'Frame width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'h', label: 'Frame height', css: ['block-size'], show: 'height', cat: 'size' },
        { id: 'fg', label: 'Symbol color', css: ['color'], cat: 'color' },
        { id: 'is', label: 'Symbol size', css: ['inline-size'], show: 'width', part: '.plx-pictogram>.plx-icon', cat: 'size' }
      ],
      token: function (id, size, variant) {
        var two = variant === 'two-tone';
        switch (id) {
          case 'bg': return PG(two ? 'two-tone-background' : 'background');
          case 'rad': return PG('radius');
          case 'w': case 'h': return PG(size + '-size');
          case 'fg': return PG(two ? 'two-tone-text' : 'text');
          case 'is': return PG(size + '-icon-size');
          default: return null;
        }
      },
      reach: function (full) { return /-(48|64|96)-/.test(full) ? 'every pictogram of that size' : /two-tone/.test(full) ? 'every two-tone pictogram' : 'every pictogram'; },
      every: 'every pictogram',
      html: function (variant, size, state, extraCls) {
        var two = variant === 'two-tone';
        return '<span class="plx-pictogram plx-pictogram--' + size + (two ? ' plx-pictogram--two-tone' : '') + ex(extraCls) + '" data-plx-icon-optical="24" aria-hidden="true">'
          + DS.icon('folder-open', two ? 'plx-icon--filled' : '') + '</span>';
      },
      labelSelector: null,
      parts: { bg: 'A', rad: 'A', w: 'A', h: 'A', fg: 'B', is: 'B' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-pictogram>.plx-icon', side: 'right' } },
      sections: [['Frame', ['bg', 'rad', 'w', 'h']], ['Symbol', ['fg', 'is']]],
      matrixLabel: 'Pictogram values by size and tone',
      statesHead: 'Tones · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- Preview's ratios and fits: the Preview lab again, with the scale as sizes and cover / contain as content
    var base = DS.labs.preview;
    if (!base) return;
    var RATIOS = [['4-3', '4:3 (default)'], ['1-1', '1:1'], ['3-2', '3:2'], ['16-9', '16:9'], ['21-9', '21:9'], ['3-4', '3:4 (portrait)'], ['9-16', '9:16 (portrait)']];
    var FIT = { cover: 1, contain: 1 };
    var fitSpec = function (sizes, defaults) {
      return Object.assign({}, base, {
        sizes: sizes,
        content: base.content.concat([['cover', 'Cover'], ['contain', 'Contain']]),
        defaults: Object.assign({}, base.defaults, defaults),
        token: function (id, size, variant, state, content) {
          if (FIT[content] && (id === 'mw' || id === 'mh')) return null;   // a fitted picture fills the frame (100%)
          return base.token(id, size, variant, state, FIT[content] ? 'picture' : content);
        },
        html: function (variant, size, state, extraCls, ui) {
          var content = ui && ui.content, fit = FIT[content];
          var out = base.html(variant, size, state, extraCls, Object.assign({}, ui, { content: fit ? 'picture' : content }));
          if (size !== 'default') out = out.replace('data-plx-aspect="4/3"', 'data-plx-ratio="' + size + '"');
          return fit ? out.replace('class="plx-preview', 'class="plx-preview plx-preview--' + content) : out;
        }
      });
    };
    DS.registerLab('preview', fitSpec(base.sizes.concat(RATIOS), {}));
    DS.registerLab('aspect-ratio', Object.assign(fitSpec(RATIOS, { size: '4-3' }), { name: 'Aspect ratio', title: 'Plenix preview ratios', store: 'plenix-aspect-ratio-lab-tokens', matrixLabel: 'Preview values by ratio, element and state' }));
  })();
}
