/* Plenix design system · library part w13A: the labs of wave 13, lane A. ProductCard, ProductOptions and the Commerce
   templates' regions, each drawn in place with the markup the code renders, so every value shows with the one
   --plx-comp-* token behind it. The Badges, Rating, RadioTiles, ColorSwatch, NumberInput, Panel and Button inside are
   their components' (their labs have their values). */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name, cls) { return DS.icon(name, cls); };
    var CORNERS = ['border-start-start-radius', 'border-start-end-radius', 'border-end-start-radius', 'border-end-end-radius'];
    var BORDERS = ['border-block-start-color', 'border-block-end-color', 'border-inline-start-color', 'border-inline-end-color'];
    var WIDTHS = ['border-block-start-width', 'border-block-end-width', 'border-inline-start-width', 'border-inline-end-width'];
    var btn = function (o) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--' + (o.variant || 'secondary') + (o.size ? ' plx-button--size-' + o.size : '') + (o.iconOnly ? ' plx-button--icon-only' : '') + ex(o.cls) + '"'
        + (o.label ? ' aria-label="' + o.label + '"' : '') + (o.disabled ? ' disabled' : '') + '>' + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + (o.text ? '<span class="plx-button__label">' + o.text + '</span>' : '') + '</button>';
    };
    var badge = function (tone, ic, text) { return '<span class="plx-badge plx-badge--' + tone + '">' + (ic ? icon(ic, 'plx-badge__icon') : '') + text + '</span>'; };
    var data = function (t, cls) { return '<span class="plx-text plx-text--data' + ex(cls) + '">' + t + '</span>'; };
    var stars = function (n) { var s = ''; for (var i = 1; i <= 5; i++) s += '<span class="plx-rating__star' + (i <= n ? ' plx-rating__star--on' : '') + '" aria-hidden="true">★</span>'; return '<span class="plx-rating plx-rating--read-only" role="img" aria-label="Rating: ' + n + ' of 5">' + s + '</span>'; };

    // ---- ProductCard (<ProductCard>): the card's surface, the body, the name, the price, the old price, the list's picture column
    var PC = function (n) { return 'plx-comp-product-card-' + n; };
    DS.registerLab('product-card', {
      name: 'Product card', title: 'Plenix product card', file: 'platform/patterns/ProductCard/product-card.css', compPrefix: /^plx-comp-product-card-/,
      store: 'plenix-product-card-lab-tokens', sizes: [['default', 'Default', '.plx-product-card']],
      variants: [['grid', 'Grid (default)'], ['list', 'List'], ['sale', 'Sale'], ['out-of-stock', 'Out of stock']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus (the name)']], content: [['product', 'A product with its rating']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'sale', state: 'default', content: 'product' },
      props: [
        { id: 'bg', label: 'Surface', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'r', label: 'Corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'sh', label: 'Hover shadow', css: ['box-shadow'], cat: 'shadow' },
        { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
        { id: 'fw', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
        { id: 'mb', label: 'Picture fill', css: ['background-color'], part: '.plx-product-card__media', cat: 'color' },
        { id: 'pc', label: 'Picture icon color', css: ['color'], part: '.plx-product-card__placeholder', cat: 'color' },
        { id: 'pb', label: 'Body space (block)', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-product-card__body', cat: 'space' },
        { id: 'pi', label: 'Body space (inline)', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: '.plx-product-card__body', cat: 'space' },
        { id: 'rg', label: 'Space between lines', css: ['row-gap'], part: '.plx-product-card__body', cat: 'space' },
        { id: 'bgp', label: 'Gap between Badges', css: ['column-gap'], part: '.plx-product-card__badges', cat: 'space' },
        { id: 'tc', label: 'Name color', css: ['color'], part: '.plx-product-card__title', cat: 'color' },
        { id: 'ts', label: 'Name size', css: ['font-size'], part: '.plx-product-card__title', cat: 'font-size' },
        { id: 'tw', label: 'Name weight', css: ['font-weight'], part: '.plx-product-card__title', cat: 'font-weight' },
        { id: 'tl', label: 'Name line height', css: ['line-height'], part: '.plx-product-card__title', cat: 'line-height' },
        { id: 'prg', label: 'Gap (price to old price)', css: ['column-gap'], part: '.plx-product-card__prices', cat: 'space' },
        { id: 'prc', label: 'Price color', css: ['color'], part: '.plx-product-card__price', cat: 'color' },
        { id: 'prf', label: 'Price font (data)', css: ['font-family'], part: '.plx-product-card__price', cat: 'font' },
        { id: 'prs', label: 'Price size', css: ['font-size'], part: '.plx-product-card__price', cat: 'font-size' },
        { id: 'prw', label: 'Price weight', css: ['font-weight'], part: '.plx-product-card__price', cat: 'font-weight' },
        { id: 'prl', label: 'Price line height', css: ['line-height'], part: '.plx-product-card__price', cat: 'line-height' },
        { id: 'cmc', label: 'Old price color', css: ['color'], part: '.plx-product-card__compare', cat: 'color' },
        { id: 'cms', label: 'Old price size', css: ['font-size'], part: '.plx-product-card__compare', cat: 'font-size' },
        { id: 'rtg', label: 'Gap (stars to count)', css: ['column-gap'], part: '.plx-product-card__rating', cat: 'space' },
        { id: 'ap', label: 'Space above the action', css: ['padding-block-start'], show: 'padding-top', part: '.plx-product-card__actions', cat: 'space' },
        { id: 'lw', label: 'Picture column (list)', css: ['inline-size'], show: 'width', part: '.plx-product-card__media', cat: 'size' }
      ],
      token: function (id, size, variant, state) {
        var sale = variant === 'sale', badges = sale || variant === 'out-of-stock';
        switch (id) {
          case 'bg': return PC('background');
          case 'bc': return PC('border-color');
          case 'bw': return PC('border-width');
          case 'r': return PC('radius');
          case 'sh': return state === 'hover' ? PC('hover-shadow') : null;
          case 'fo': return state === 'focus' ? PC('focus-outline-color') : null;
          case 'fw': return state === 'focus' ? PC('focus-outline-width') : null;
          case 'mb': return PC('media-background');
          case 'pc': return PC('placeholder-text');
          case 'pb': return PC('padding-block');
          case 'pi': return PC('padding-inline');
          case 'rg': return PC('row-gap');
          case 'bgp': return badges ? PC('badges-gap') : null;
          case 'tc': return PC('title-text');
          case 'ts': return PC('title-font-size');
          case 'tw': return PC('title-font-weight');
          case 'tl': return PC('title-line-height');
          case 'prg': return sale ? PC('prices-gap') : null;
          case 'prc': return PC('price-text');
          case 'prf': return PC('price-font-family');
          case 'prs': return PC('price-font-size');
          case 'prw': return PC('price-font-weight');
          case 'prl': return PC('price-line-height');
          case 'cmc': return sale ? PC('compare-text') : null;
          case 'cms': return sale ? PC('compare-font-size') : null;
          case 'rtg': return PC('rating-gap');
          case 'ap': return variant === 'list' ? null : PC('actions-padding-block-start');
          case 'lw': return variant === 'list' ? PC('list-media-width') : null;
          default: return null;
        }
      },
      reach: function (full) { return /list-media/.test(full) ? 'every product card in a list' : /compare|prices-gap/.test(full) ? 'every product card on sale' : 'every product card'; }, every: 'every product card',
      html: function (variant, size, state, extraCls) {
        var sale = variant === 'sale', out = variant === 'out-of-stock', list = variant === 'list';
        var cls = 'plx-product-card plx-product-card--' + (list ? 'list' : 'grid') + (sale ? ' plx-product-card--sale' : '') + (out ? ' plx-product-card--out-of-stock' : '') + ' plx-product-card--interactive'
          + (state === 'hover' ? ' is-hover' : '') + (state === 'focus' ? ' is-focus-visible' : '');
        var name = sale ? 'Prayer rope, 100 knots' : out ? 'Icon print, Saint Mark' : list ? 'Psalter, pocket edition' : 'Beeswax taper, 12 in';
        var price = sale ? '$24.00' : out ? '$45.00' : list ? '$19.00' : '$18.00';
        return '<div class="ds-w13a-lab' + (list ? ' ds-w13a-lab--wide' : ' ds-w13a-lab--card') + '"><article class="' + cls + ex(extraCls) + '">'
          + '<div class="plx-product-card__media"><span class="plx-product-card__placeholder plx-ratio-1-1" aria-hidden="true">' + icon('image-b') + '</span></div>'
          + '<div class="plx-product-card__body">'
          + (sale ? '<div class="plx-product-card__badges">' + badge('active', 'tags', 'Sale') + '</div>' : out ? '<div class="plx-product-card__badges">' + badge('negative', 'do-not-disturb', 'Out of stock') + '</div>' : '')
          + '<span class="plx-text plx-text--secondary plx-product-card__meta">' + (sale ? 'Wool, hand tied' : out ? 'Printed on wood' : 'Monastery candles') + '</span>'
          + '<h3 class="plx-product-card__title"><a class="plx-product-card__opener" href="#p" tabindex="-1">' + name + '</a></h3>'
          + '<span class="plx-product-card__prices"><span class="plx-product-card__price">' + price + '</span>' + (sale ? '<s class="plx-product-card__compare">$32.00</s>' : '') + '</span>'
          + '<span class="plx-product-card__rating">' + stars(4) + data(sale ? '64 reviews' : '38 reviews', 'plx-product-card__reviews') + '</span>'
          + '<div class="plx-product-card__actions">' + btn({ size: 'xs', icon: 'plus', text: 'Add to cart', disabled: out }) + '</div>'
          + '</div></article></div>';
      },
      labelSelector: '.plx-product-card__opener',
      parts: { bg: 'A', bc: 'A', bw: 'A', r: 'A', sh: 'A', fo: 'A', fw: 'A', mb: 'B', pc: 'B', lw: 'B', pb: 'C', pi: 'C', rg: 'C', bgp: 'D', tc: 'E', ts: 'E', tw: 'E', tl: 'E', prg: 'F', prc: 'F', prf: 'F', prs: 'F', prw: 'F', prl: 'F', cmc: 'G', cms: 'G', rtg: 'H', ap: 'I' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-product-card__media', side: 'top' }, C: { part: '.plx-product-card__body', side: 'right' }, D: { part: '.plx-product-card__badges', side: 'right' },
        E: { part: '.plx-product-card__title', side: 'right' }, F: { part: '.plx-product-card__price', side: 'left' }, G: { part: '.plx-product-card__compare', side: 'right' }, H: { part: '.plx-product-card__rating', side: 'right' }, I: { part: '.plx-product-card__actions', side: 'bottom' } },
      sections: [['Card', ['bg', 'bc', 'bw', 'r', 'sh', 'fo', 'fw']], ['Picture', ['mb', 'pc', 'lw']], ['Body', ['pb', 'pi', 'rg', 'bgp', 'ap']], ['Name', ['tc', 'ts', 'tw', 'tl']],
        ['Price', ['prg', 'prc', 'prf', 'prs', 'prw', 'prl', 'cmc', 'cms']], ['Rating', ['rtg']]],
      matrixLabel: 'Product card values by variant and state', matrixColumnWidth: '--plx-ref-size-280px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- ProductOptions (<ProductOptions>): the space between options, the option's name and chosen value, the size tiles'
    // width, the swatches' gap, the dimmed swatch, the error line
    var PO = function (n) { return 'plx-comp-product-options-' + n; };
    var tile = function (v, on, off, note) {
      return '<label class="plx-radio-tile' + (on ? ' is-selected' : '') + (off ? ' is-disabled' : '') + '"><input class="plx-radio-tile__input plx-visually-hidden" type="radio" tabindex="-1" name="ds-w13a-size"' + (on ? ' checked' : '') + (off ? ' disabled' : '') + '>'
        + '<span class="plx-radio-tile__text"><span class="plx-radio-tile__label">' + v + '</span>' + (note ? '<span class="plx-radio-tile__description">' + note + '</span>' : '') + '</span>'
        + '<span class="plx-radio-tile__check" aria-hidden="true">' + (on ? icon('check', 'plx-icon--size-sm') : '') + '</span></label>';
    };
    var legend = function (label, chosen) { return '<span class="plx-product-options__legend-text"><span class="plx-product-options__label">' + label + ':</span><span class="plx-product-options__chosen">' + chosen + '</span></span>'; };
    var swatch = function (cat, label, on, off) {
      return '<span class="plx-product-options__swatch' + (off ? ' is-unavailable' : '') + '"><button type="button" tabindex="-1" class="plx-color-swatch plx-color-swatch--md" data-plx-category="' + cat + '" aria-pressed="' + !!on + '" aria-label="' + label + (off ? ', out of stock' : '') + '"' + (off ? ' aria-disabled="true"' : '') + '></button></span>';
    };
    var quantity = function () {
      var NIL = DS.labs && DS.labs['number-input'];
      return '<div class="plx-product-options__option plx-product-options__option--quantity"><div class="plx-field"><label class="plx-field__label">Quantity</label>' + (NIL ? NIL.html('quantity', 'full', 'default', '') : '') + '</div></div>';
    };
    DS.registerLab('product-options', {
      name: 'Product options', title: 'Plenix product options', file: 'platform/components/ProductOptions/product-options.css', compPrefix: /^plx-comp-product-options-/,
      store: 'plenix-product-options-lab-tokens', sizes: [['default', 'Default', '.plx-product-options']],
      variants: [['buttons', 'Size buttons'], ['swatches', 'Color swatches'], ['quantity', 'Quantity']],
      states: [['default', 'Default'], ['error', 'Error (nothing chosen)']], content: [['choices', 'A product’s choices, one out of stock']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'swatches', state: 'default', content: 'choices' },
      props: [
        { id: 'g', label: 'Space between options', css: ['row-gap'], cat: 'space' },
        { id: 'og', label: 'Space inside an option', css: ['row-gap'], part: '.plx-product-options__option', cat: 'space' },
        { id: 'lc', label: 'Name color', css: ['color'], part: '.plx-product-options__legend', cat: 'color' },
        { id: 'lf', label: 'Name font', css: ['font-family'], part: '.plx-product-options__legend', cat: 'font' },
        { id: 'ls', label: 'Name size', css: ['font-size'], part: '.plx-product-options__legend', cat: 'font-size' },
        { id: 'll', label: 'Name line height', css: ['line-height'], part: '.plx-product-options__legend', cat: 'line-height' },
        { id: 'lg', label: 'Gap (name to value)', css: ['column-gap'], part: '.plx-product-options__legend-text', cat: 'space' },
        { id: 'lw', label: 'Name weight', css: ['font-weight'], part: '.plx-product-options__label', cat: 'font-weight' },
        { id: 'cc', label: 'Chosen value color', css: ['color'], part: '.plx-product-options__chosen', cat: 'color' },
        { id: 'cw', label: 'Chosen value weight', css: ['font-weight'], part: '.plx-product-options__chosen', cat: 'font-weight' },
        { id: 'sg', label: 'Gap between swatches', css: ['column-gap'], part: '.plx-product-options__swatches', cat: 'space' },
        { id: 'uo', label: 'Out of stock swatch opacity', css: ['opacity'], part: '.plx-product-options__swatch.is-unavailable', cat: 'opacity' },
        { id: 'ec', label: 'Error color', css: ['color'], part: '.plx-product-options__error', cat: 'color' },
        { id: 'es', label: 'Error size', css: ['font-size'], part: '.plx-product-options__error', cat: 'font-size' },
        { id: 'eg', label: 'Gap (icon to error)', css: ['column-gap'], part: '.plx-product-options__error', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var sw = variant === 'swatches', bt = variant === 'buttons', err = state === 'error' && variant !== 'quantity';
        switch (id) {
          case 'g': return PO('gap');
          case 'og': return PO('option-gap');
          case 'lc': return sw ? PO('legend-text') : null;
          case 'lf': return sw ? PO('legend-font-family') : null;
          case 'ls': return sw ? PO('legend-font-size') : null;
          case 'll': return sw ? PO('legend-line-height') : null;
          case 'lg': return sw || bt ? PO('legend-gap') : null;
          case 'lw': return sw || bt ? PO('label-font-weight') : null;
          case 'cc': return sw || bt ? PO('chosen-text') : null;
          case 'cw': return sw || bt ? PO('chosen-font-weight') : null;
          case 'sg': return sw ? PO('swatch-gap') : null;
          case 'uo': return sw ? PO('unavailable-opacity') : null;
          case 'ec': return err ? PO('error-text') : null;
          case 'es': return err ? PO('error-font-size') : null;
          case 'eg': return err ? PO('error-gap') : null;
          default: return null;
        }
      },
      reach: function (full) { return /size-min/.test(full) ? 'every product’s size buttons' : /swatch|unavailable/.test(full) ? 'every product’s color swatches' : 'every product option'; }, every: 'every product option',
      html: function (variant, size, state, extraCls) {
        var err = state === 'error', body;
        var error = function (t) { return err ? '<span class="plx-product-options__error">' + icon('alert', 'plx-icon--size-sm') + t + '</span>' : ''; };
        if (variant === 'buttons') {
          body = '<div class="plx-product-options__option plx-product-options__option--buttons' + (err ? ' is-invalid' : '') + '"><fieldset class="plx-radio-tiles plx-radio-tiles--sm plx-product-options__sizes"><legend class="plx-radio-tiles__legend">' + legend('Size', err ? 'None chosen' : 'M') + '</legend>'
            + '<div class="plx-radio-tiles__grid">' + tile('S') + tile('M', !err) + tile('L') + tile('XL', false, true, 'Back in November') + '</div></fieldset>'
            + '<span class="plx-product-options__guide"><a class="plx-link" href="#size-guide" tabindex="-1">Size guide</a></span>' + error('Choose a size.') + '</div>';
        } else if (variant === 'swatches') {
          body = '<div class="plx-product-options__option plx-product-options__option--swatches' + (err ? ' is-invalid' : '') + '"><span class="plx-product-options__legend">' + legend('Color', err ? 'None chosen' : 'Navy') + '</span>'
            + '<div role="group" aria-label="Color" class="plx-product-options__swatches">' + swatch('navy', 'Navy', !err) + swatch('maroon', 'Maroon') + swatch('olive', 'Olive', false, true) + swatch('beige', 'Beige') + '</div>' + error('Choose a color.') + '</div>';
        } else body = quantity();
        return '<div class="ds-w13a-lab"><div class="plx-product-options' + ex(extraCls) + '">' + body + '</div></div>';
      },
      labelSelector: '.plx-product-options__chosen',
      parts: { g: 'A', og: 'B', lc: 'C', lf: 'C', ls: 'C', ll: 'C', lg: 'C', lw: 'C', cc: 'D', cw: 'D', sg: 'F', uo: 'G', ec: 'H', es: 'H', eg: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-product-options__option', side: 'right' }, C: { part: '.plx-product-options__label', side: 'top' }, D: { part: '.plx-product-options__chosen', side: 'right' },
        F: { part: '.plx-product-options__swatches', side: 'bottom' }, G: { part: '.plx-product-options__swatch.is-unavailable', side: 'top' }, H: { part: '.plx-product-options__error', side: 'bottom' } },
      sections: [['Options', ['g', 'og']], ['Name and chosen value', ['lc', 'lf', 'ls', 'll', 'lg', 'lw', 'cc', 'cw']], ['Color swatches', ['sg', 'uo']], ['Error', ['ec', 'es', 'eg']]],
      matrixLabel: 'Product options values by kind and state', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Kinds and states · ' + HEAD
    });

    // ---- the Commerce templates (<ProductDiscovery> … <Returns>): region placement only: the page's gaps, the titles, the
    // two columns, the lines, the summary's rows, the field pairs
    var CM = function (n) { return 'plx-comp-commerce-' + n; };
    var TEMPLATES = [['product-discovery', 'Product discovery'], ['product-listing', 'Product listing'], ['product-detail', 'Product detail'], ['cart', 'Cart'], ['checkout', 'Checkout'], ['payment', 'Payment'],
      ['order-confirmation', 'Order confirmation'], ['order-management', 'Order management'], ['subscription-management', 'Subscription management'], ['returns', 'Returns']];
    var stub = function (t) { return '<div class="ds-w13a-stub">' + t + '</div>'; };
    var head = function (title, focus, extra) { return '<header class="plx-commerce__head"><h1 class="plx-commerce__title' + (focus ? ' ds-focus' : '') + '" tabindex="-1">' + title + '</h1>' + (extra || '') + '</header>'; };
    var lineHtml = function (name, opts, price, qty, total, pic) {
      return '<li class="plx-commerce-line"><span class="plx-commerce-line__media">' + (pic ? '<span class="plx-image plx-image--cover plx-ratio-1-1">' + '</span>' : '<span class="plx-commerce-line__placeholder plx-ratio-1-1" aria-hidden="true">' + icon('image-b') + '</span>') + '</span>'
        + '<span class="plx-commerce-line__text"><span class="plx-commerce-line__title">' + name + '</span><span class="plx-text plx-text--secondary">' + opts + '</span><span class="plx-product-card__prices plx-product-card__prices--sm plx-commerce-line__unit"><span class="plx-product-card__price">' + price + '</span></span></span>'
        + '<span class="plx-commerce-line__quantity">' + data('Qty ' + qty) + '</span><span class="plx-commerce-line__total">' + total + '</span></li>';
    };
    var lines = '<ul class="plx-commerce-lines" aria-label="Items">' + lineHtml('Choir robe', 'Size M · Navy', '$84.00', 1, '$84.00') + lineHtml('Prayer rope, 100 knots', 'Black wool', '$24.00', 2, '$48.00') + '</ul>';
    var summary = function () {
      var r = function (label, value, total) { return '<div class="plx-commerce-summary__row' + (total ? ' plx-commerce-summary__row--total' : '') + '"><dt class="plx-commerce-summary__label">' + label + '</dt><dd class="plx-commerce-summary__value">' + value + '</dd></div>'; };
      return '<section class="plx-panel plx-commerce-summary" aria-label="Order summary"><div class="plx-panel__header"><div class="plx-panel__heading"><h2 class="plx-panel__title">Order summary</h2></div></div><div class="plx-panel__body">'
        + '<dl class="plx-commerce-summary__totals">' + r('Subtotal', '$132.00') + r('Estimated shipping', '$6.00') + r('Estimated tax', '$9.57') + r('Total', '$147.57', true) + '</dl></div></section>';
    };
    var columns = function (main) { return '<div class="plx-commerce__columns"><div class="plx-commerce__main">' + main + '</div><aside class="plx-commerce__aside" aria-label="Summary">' + summary() + '</aside></div>'; };
    var pair = '<div class="plx-commerce__pair">' + stub('Expiry date') + stub('Security code') + '</div>';
    var section = function (title, body) { return '<section class="plx-commerce__section"><h2 class="plx-commerce__subtitle">' + title + '</h2>' + body + '</section>'; };
    var WITH = {   // the parts each template draws
      head: ['product-discovery', 'product-listing', 'cart', 'order-confirmation'], section: ['product-discovery', 'order-confirmation'], columns: ['cart', 'checkout', 'order-confirmation', 'returns'],
      lines: ['cart', 'order-confirmation'], pair: ['checkout', 'payment'], product: ['product-detail'], actions: ['subscription-management'], returnables: ['returns'] };
    var has = function (part, variant) { return WITH[part].indexOf(variant) >= 0; };
    DS.registerLab('commerce', {
      name: 'Commerce templates', title: 'Plenix commerce templates', file: 'platform/templates/Commerce/commerce.css', compPrefix: /^plx-comp-commerce-/,
      store: 'plenix-commerce-lab-tokens', sizes: [['wide', 'Wide (two columns)', '.plx-commerce']],
      variants: TEMPLATES, states: [['default', 'Default'], ['focus', 'Focus (the confirmation’s heading)']], content: [['sample', 'The sample shop']],
      labels: { size: 'Width', variant: 'Template', state: 'State', content: 'Content' },
      defaults: { size: 'wide', variant: 'cart', state: 'default', content: 'sample' },
      props: [
        { id: 'g', label: 'Space between the parts', css: ['row-gap'], cat: 'space' },
        { id: 'hg', label: 'Space under the title', css: ['row-gap'], part: '.plx-commerce__head', cat: 'space' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-commerce__title', cat: 'color' },
        { id: 'tf', label: 'Title font', css: ['font-family'], part: '.plx-commerce__title', cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: '.plx-commerce__title', cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-commerce__title', cat: 'font-weight' },
        { id: 'fo', label: 'Title focus ring', css: ['outline-color'], part: '.plx-commerce__title', cat: 'color' },
        { id: 'sg', label: 'Space inside a section', css: ['row-gap'], part: '.plx-commerce__section', cat: 'space' },
        { id: 'ss', label: 'Section title size', css: ['font-size'], part: '.plx-commerce__subtitle', cat: 'font-size' },
        { id: 'sw', label: 'Section title weight', css: ['font-weight'], part: '.plx-commerce__subtitle', cat: 'font-weight' },
        { id: 'sl', label: 'Section title line height', css: ['line-height'], part: '.plx-commerce__subtitle', cat: 'line-height' },
        { id: 'cg', label: 'Gap between the columns', css: ['column-gap'], part: '.plx-commerce__columns', cat: 'space' },
        { id: 'aw', label: 'Summary column width', css: ['inline-size'], show: 'width', part: '.plx-commerce__aside', cat: 'size' },
        { id: 'pg', label: 'Gap (pictures to buying column)', css: ['column-gap'], part: '.plx-commerce__product', cat: 'space' },
        { id: 'bg', label: 'Space in the buying column', css: ['row-gap'], part: '.plx-commerce__buy', cat: 'space' },
        { id: 'lb', label: 'Line divider color', css: ['border-block-end-color'], show: 'border-bottom-color', part: '.plx-commerce-line', cat: 'color' },
        { id: 'lbw', label: 'Line divider width', css: ['border-block-end-width'], show: 'border-bottom-width', part: '.plx-commerce-line', cat: 'border-width' },
        { id: 'lg', label: 'Gap between a line’s columns', css: ['column-gap'], part: '.plx-commerce-line', cat: 'space' },
        { id: 'lp', label: 'Line space (block)', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-commerce-line', cat: 'space' },
        { id: 'lm', label: 'Line picture width', css: ['inline-size'], show: 'width', part: '.plx-commerce-line__media', cat: 'size' },
        { id: 'lt', label: 'Line text gap', css: ['row-gap'], part: '.plx-commerce-line__text', cat: 'space' },
        { id: 'lw', label: 'Line total least width', css: ['min-inline-size'], show: 'min-width', part: '.plx-commerce-line__total', cat: 'size' },
        { id: 'ltf', label: 'Line total font (data)', css: ['font-family'], part: '.plx-commerce-line__total', cat: 'font' },
        { id: 'ltw', label: 'Line total weight', css: ['font-weight'], part: '.plx-commerce-line__total', cat: 'font-weight' },
        { id: 'phb', label: 'Line picture fill', css: ['background-color'], part: '.plx-commerce-line__placeholder', cat: 'color' },
        { id: 'smg', label: 'Space between summary rows', css: ['row-gap'], part: '.plx-commerce-summary__totals', cat: 'space' },
        { id: 'smc', label: 'Summary row name color', css: ['color'], part: '.plx-commerce-summary__label', cat: 'color' },
        { id: 'smf', label: 'Summary amount font (data)', css: ['font-family'], part: '.plx-commerce-summary__value', cat: 'font' },
        { id: 'stw', label: 'Total weight', css: ['font-weight'], part: '.plx-commerce-summary__row--total', cat: 'font-weight' },
        { id: 'ig', label: 'Gap between things side by side', css: ['column-gap'], part: '.plx-commerce__pair, .plx-commerce__row-actions', cat: 'space' },
        { id: 'rg', label: 'Space between returnable items', css: ['row-gap'], part: '.plx-commerce__returnables', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var conf = variant === 'order-confirmation';
        switch (id) {
          case 'g': return CM('gap');
          case 'hg': return has('head', variant) ? CM('head-gap') : null;
          case 'tc': return has('head', variant) ? CM('title-text') : null;
          case 'tf': return has('head', variant) ? CM('title-font-family') : null;
          case 'ts': return has('head', variant) ? CM('title-font-size') : null;
          case 'tw': return has('head', variant) ? CM('title-font-weight') : null;
          case 'fo': return conf && state === 'focus' ? CM('focus-outline-color') : null;
          case 'sg': return has('section', variant) ? CM('section-gap') : null;
          case 'ss': return has('section', variant) ? CM('subtitle-font-size') : null;
          case 'sw': return has('section', variant) ? CM('subtitle-font-weight') : null;
          case 'sl': return has('section', variant) ? CM('subtitle-line-height') : null;
          case 'cg': return has('columns', variant) ? CM('columns-gap') : null;
          case 'aw': return has('columns', variant) ? CM('aside-width') : null;
          case 'pg': return has('product', variant) ? CM('columns-gap') : null;
          case 'bg': return has('product', variant) ? CM('section-gap') : null;
          case 'lb': return has('lines', variant) ? CM('line-border-color') : null;
          case 'lbw': return has('lines', variant) ? CM('line-border-width') : null;
          case 'lg': return has('lines', variant) ? CM('line-gap') : null;
          case 'lp': return has('lines', variant) ? CM('line-padding-block') : null;
          case 'lm': return has('lines', variant) ? CM('line-media-width') : null;
          case 'lt': return has('lines', variant) ? CM('line-text-gap') : null;
          case 'lw': return has('lines', variant) ? CM('line-total-width') : null;
          case 'ltf': return has('lines', variant) ? CM('line-total-font-family') : null;
          case 'ltw': return has('lines', variant) ? CM('line-total-font-weight') : null;
          case 'phb': return has('lines', variant) ? CM('placeholder-background') : null;
          case 'smg': return has('columns', variant) ? CM('summary-gap') : null;
          case 'smc': return has('columns', variant) ? CM('summary-label-text') : null;
          case 'smf': return has('columns', variant) ? CM('summary-value-font-family') : null;
          case 'stw': return has('columns', variant) ? CM('total-font-weight') : null;
          case 'ig': return has('pair', variant) || has('actions', variant) ? CM('inline-gap') : null;
          case 'rg': return has('returnables', variant) ? CM('section-gap') : null;
          default: return null;
        }
      },
      reach: function (full) { return /line|placeholder/.test(full) ? 'every cart and order line' : /summary|total/.test(full) ? 'every order summary' : 'every commerce page'; }, every: 'every commerce page',
      html: function (variant, size, state, extraCls) {
        var body;
        switch (variant) {
          case 'product-discovery': body = head('Shop', false, '<div class="plx-commerce__search">' + stub('Search the shop') + '</div>') + section('Shop by category', stub('Category cards')) + section('Recommended for you', stub('A carousel of product cards')); break;
          case 'product-listing': body = head('Candles and incense', false, '<p class="plx-text plx-text--secondary">Beeswax, oil and incense.</p>') + stub('The command bar: search, Filter, Category, Sort, View, the count') + stub('Product cards in a content grid'); break;
          case 'product-detail': body = '<div class="plx-commerce__product"><div class="plx-commerce__gallery">' + stub('The pictures') + '</div><div class="plx-commerce__buy">' + stub('Choir robe') + stub('$84.00 · In stock') + stub('Product options') + stub('Add to cart') + '</div></div>' + stub('Description, details, delivery'); break;
          case 'cart': body = head('Cart', false, data('3 items')) + columns(lines); break;
          case 'checkout': body = columns(stub('Contact · Delivery · Payment · Review') + pair); break;
          case 'payment': body = '<div class="plx-commerce__payment">' + stub('Card number') + pair + stub('Name on card') + '</div>'; break;
          case 'order-confirmation': body = head('Thank you. Your order is placed.', state === 'focus') + columns(section('What happens next', stub('A timeline')) + lines); break;
          case 'order-management': body = stub('The command bar: search, Filter, Status, the count') + stub('The orders in the data grid'); break;
          case 'subscription-management': body = stub('Your plan') + stub('Change plan') + '<span class="plx-commerce__row-actions">' + btn({ text: 'Pause subscription' }) + btn({ variant: 'danger-secondary', text: 'Cancel subscription' }) + '</span>'; break;
          default: body = columns('<ul class="plx-commerce__returnables" aria-label="Items"><li class="plx-commerce__returnable">' + stub('Choir robe') + '</li><li class="plx-commerce__returnable">' + stub('Prayer rope, 33 knots') + '</li></ul>');
        }
        return '<div class="ds-w13a-lab ds-w13a-lab--page"><div class="plx-commerce' + ex(extraCls) + '">' + body + '</div></div>';
      },
      labelSelector: '.plx-commerce__title',
      parts: { g: 'A', hg: 'B', tc: 'B', tf: 'B', ts: 'B', tw: 'B', fo: 'B', sg: 'C', ss: 'C', sw: 'C', sl: 'C', cg: 'D', aw: 'E', pg: 'D', bg: 'D', lb: 'F', lbw: 'F', lg: 'F', lp: 'F', lm: 'F', lt: 'F', lw: 'F', ltf: 'F', ltw: 'F', phb: 'F', smg: 'G', smc: 'G', smf: 'G', stw: 'G', ig: 'H', rg: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-commerce__title', side: 'top' }, C: { part: '.plx-commerce__section', side: 'left' }, D: { part: '.plx-commerce__columns, .plx-commerce__product', side: 'top' },
        E: { part: '.plx-commerce__aside', side: 'right' }, F: { part: '.plx-commerce-line', side: 'left' }, G: { part: '.plx-commerce-summary__totals', side: 'right' }, H: { part: '.plx-commerce__pair, .plx-commerce__row-actions, .plx-commerce__returnables', side: 'bottom' } },
      sections: [['Page', ['g', 'hg', 'tc', 'tf', 'ts', 'tw', 'fo']], ['Sections', ['sg', 'ss', 'sw', 'sl']], ['Columns', ['cg', 'aw', 'pg', 'bg']], ['Lines', ['lb', 'lbw', 'lg', 'lp', 'lm', 'lt', 'lw', 'ltf', 'ltw', 'phb']],
        ['Order summary', ['smg', 'smc', 'smf', 'stw']], ['Side by side', ['ig', 'rg']]],
      matrixLabel: 'Commerce template values by template', matrixColumnWidth: '--plx-ref-size-900px', statesHead: 'Templates · ' + HEAD
    });
  })();
}
