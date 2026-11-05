/* Plenix design system · library part w05A: the labs of wave 5, lane A. Popover, ContextualHelp, TeachingBubble,
   Popconfirm and MegaMenu, each drawn in place (not opened over the page) with the markup the component renders, so
   every size and variant shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var STATIC = [['default', 'Default']];
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var icon = function (name) { return DS.icon(name); };
    var BTN = function (variant, label) { return '<button type="button" tabindex="-1" class="plx-button plx-button--' + variant + '"><span class="plx-button__label">' + label + '</span></button>'; };
    var CLOSE = function (cls) { return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only ' + cls + '" aria-label="Close"><span class="plx-button__icon">' + icon('close') + '</span></button>'; };
    var LINK = function (label, kind) { return '<a href="#lab" tabindex="-1" class="plx-link plx-link--' + (kind || 'standalone') + '">' + label + '</a>'; };
    // a popover as Popover renders it, at rest in the page: its side and alignment, its classes, its parts
    // the arrow takes its side and alignment as its own classes (as Popover.tsx gives them)
    var arrowCls = function (side, align) { return 'plx-popover__arrow plx-popover__arrow--' + side + ' plx-popover__arrow--' + (side === 'top' || side === 'bottom' ? 'inline-' + (align || 'center') : 'block-' + ({ top: 'start', bottom: 'end' }[align] || 'center')); };
    var panel = function (cls, side, align, parts) {
      return '<div class="plx-popover ' + cls + '" data-plx-popover-side="' + side + '" data-plx-popover-align="' + align + '">' + parts.split('class="plx-popover__arrow"').join('class="' + arrowCls(side, align) + '"') + '</div>';
    };
    var body = function (inner) { return '<div class="plx-popover__body">' + inner + '</div>'; };
    // room above a specimen for the arrow, which stands outside the popover's edge
    var room = function (inner) { return '<div class="ds-w05a-room">' + inner + '</div>'; };

    // ---- Popover (<Popover>, div.plx-popover): four sizes, plain, with header and footer, with arrow
    var PO = function (n) { return 'plx-comp-popover-' + n; };
    DS.registerLab('popover', {
      name: 'Popover', title: 'Plenix popover', file: 'platform/components/Popover/popover.css', compPrefix: /^plx-comp-popover-/,
      store: 'plenix-popover-lab-tokens',
      sizes: [['sm', 'Sm (240px)', '.plx-popover--sm'], ['md', 'Md (320px, default)', '.plx-popover--md'], ['lg', 'Lg (400px)', '.plx-popover--lg'], ['auto', 'Auto (content width)', '.plx-popover--auto']],
      variants: [['plain', 'Click (default)'], ['header', 'With header and footer'], ['arrow', 'With arrow']], states: STATIC,
      content: [['text', 'A sentence']],
      labels: { size: 'Size', variant: 'Parts', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'header', state: 'default', content: 'text' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'fg', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: ['border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color'], show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: ['border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width'], show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'sh', label: 'Shadow', css: ['box-shadow'], cat: 'shadow' },
        { id: 'pad', label: 'Padding', css: ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], show: 'padding-top', cat: 'space' },
        { id: 'w', label: 'Width', css: ['inline-size'], show: 'width', cat: 'size' },
        { id: 'fs', label: 'Text size', css: ['font-size'], cat: 'font-size' },
        { id: 'tfg', label: 'Title color', css: ['color'], part: '.plx-popover__title', cat: 'color' },
        { id: 'tfs', label: 'Title size', css: ['font-size'], part: '.plx-popover__title', cat: 'font-size' },
        { id: 'tfw', label: 'Title weight', css: ['font-weight'], part: '.plx-popover__title', cat: 'font-weight' },
        { id: 'hgap', label: 'Header gap', css: ['column-gap'], part: '.plx-popover__header', cat: 'space' },
        { id: 'hmb', label: 'Space under the header', css: ['margin-bottom'], part: '.plx-popover__header', cat: 'space' },
        { id: 'hh', label: 'Header minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-popover__header', cat: 'control-height' },
        { id: 'fgap', label: 'Footer gap', css: ['column-gap'], part: '.plx-popover__footer', cat: 'space' },
        { id: 'fmt', label: 'Space above the footer', css: ['margin-top'], part: '.plx-popover__footer', cat: 'space' },
        { id: 'ac', label: 'Arrow outline', css: ['border-bottom-color'], part: '.plx-popover__arrow', cat: 'color' },
        { id: 'as', label: 'Arrow size', css: ['border-left-width', 'border-right-width', 'border-bottom-width'], show: 'border-bottom-width', part: '.plx-popover__arrow', cat: 'size' },
        { id: 'ai', label: 'Arrow inset from the corner', css: ['left'], part: '.plx-popover__arrow', cat: 'space' }
      ],
      token: function (id, size, variant) {
        var head = variant === 'header', arrow = variant === 'arrow';
        switch (id) {
          case 'bg': return PO('background');
          case 'fg': return PO('text');
          case 'bc': return PO('border-color');
          case 'bw': return PO('border-width');
          case 'rad': return PO('radius');
          case 'sh': return PO('shadow');
          case 'pad': return PO('padding');
          case 'w': return size === 'auto' ? null : PO(size + '-width');
          case 'fs': return PO('font-size');
          case 'tfg': return head ? PO('title-text') : null;
          case 'tfs': return head ? PO('title-font-size') : null;
          case 'tfw': return head ? PO('title-font-weight') : null;
          case 'hgap': return head ? PO('header-gap') : null;
          case 'hmb': return head ? PO('header-margin-block-end') : null;
          case 'hh': return head ? PO('header-min-height') : null;
          case 'fgap': return head ? PO('footer-gap') : null;
          case 'fmt': return head ? PO('footer-margin-block-start') : null;
          case 'ac': return arrow ? PO('arrow-border-color') : null;
          case 'as': return arrow ? PO('arrow-size') : null;
          case 'ai': return arrow ? PO('arrow-inset') : null;
          default: return null;
        }
      },
      reach: function (full) { var m = /popover-(sm|md|lg)-width/.exec(full); return m ? 'every ' + m[1].toUpperCase() + ' popover' : /arrow/.test(full) ? 'every popover arrow' : 'every popover, contextual help, popconfirm, teaching bubble and mega menu panel'; },
      every: 'every popover',
      html: function (variant, size, state, extraCls) {
        var head = variant === 'header', arrow = variant === 'arrow';
        var parts = (arrow ? '<span class="plx-popover__arrow" aria-hidden="true"></span>' : '')
          + (head ? '<div class="plx-popover__header"><h2 class="plx-popover__title">Share</h2>' + CLOSE('plx-popover__close') + '</div>' : '')
          + body(head ? 'Send a view-only link to people outside the team.' : 'Shows the assets that match every choice.')
          + (head ? '<div class="plx-popover__footer">' + BTN('secondary', 'Cancel') + BTN('primary', 'Send') + '</div>' : '');
        return room(panel('plx-popover--' + size + (arrow ? ' plx-popover--arrow' : '') + ex(extraCls), 'bottom', 'start', parts));
      },
      labelSelector: '.plx-popover__body',
      parts: { bg: 'A', fg: 'A', bc: 'A', bw: 'A', rad: 'A', sh: 'A', pad: 'A', w: 'A', fs: 'A', tfg: 'B', tfs: 'B', tfw: 'B', hgap: 'B', hmb: 'B', hh: 'B', fgap: 'C', fmt: 'C', ac: 'D', as: 'D', ai: 'D' },
      anchors: { A: { part: null, side: 'right' }, B: { part: '.plx-popover__header', side: 'top' }, C: { part: '.plx-popover__footer', side: 'bottom' }, D: { part: '.plx-popover__arrow', side: 'top' } },
      sections: [['Surface', ['bg', 'fg', 'bc', 'bw', 'rad', 'sh', 'pad', 'w', 'fs']], ['Header', ['tfg', 'tfs', 'tfw', 'hgap', 'hmb', 'hh']], ['Footer', ['fgap', 'fmt']], ['Arrow', ['ac', 'as', 'ai']]],
      matrixLabel: 'Popover values by parts', matrixColumnWidth: '--plx-ref-size-100u',
      statesHead: 'Parts · ' + HEAD
    });

    // ---- Contextual help (<ContextualHelp>): the popover's body (info, with a link) and the inline tip
    var CH = function (n) { return 'plx-comp-contextual-help-' + n; };
    DS.registerLab('contextual-help', {
      name: 'Contextual help', title: 'Plenix contextual help', file: 'platform/components/ContextualHelp/contextual-help.css', compPrefix: /^plx-comp-contextual-help-/,
      store: 'plenix-contextual-help-lab-tokens', sizes: [['default', 'Default', '.plx-contextual-help']],
      variants: [['info', 'Info (default)'], ['link', 'With a link'], ['inline', 'Inline tip']], states: STATIC,
      content: [['retention', 'Retention']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'inline', state: 'default', content: 'retention' },
      props: [
        { id: 'mt', label: 'Space above the link', css: ['margin-top'], part: '.plx-contextual-help__more', cat: 'space' },
        { id: 'fg', label: 'Tip text color', css: ['color'], cat: 'color' },
        { id: 'gap', label: 'Gap after the icon', css: ['column-gap'], cat: 'space' },
        { id: 'fs', label: 'Tip text size', css: ['font-size'], cat: 'font-size' },
        { id: 'lh', label: 'Tip line height', css: ['line-height'], cat: 'line-height' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-contextual-help__icon', cat: 'color' },
        { id: 'ib', label: 'Icon box height (one line)', css: ['block-size'], show: 'height', part: '.plx-contextual-help__icon', cat: 'size' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-contextual-help__title', cat: 'color' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-contextual-help__title', cat: 'font-weight' }
      ],
      token: function (id, size, variant) {
        var tip = variant === 'inline';
        switch (id) {
          case 'mt': return variant === 'link' ? CH('link-margin-block-start') : null;
          case 'fg': return tip ? CH('inline-text') : null;
          case 'gap': return tip ? CH('inline-gap') : null;
          case 'fs': return tip ? CH('inline-font-size') : null;
          case 'lh': return tip ? CH('inline-line-height') : null;
          case 'ic': return tip ? CH('inline-icon-color') : null;
          case 'ib': return tip ? CH('inline-line-height') : null;
          case 'tc': return tip ? CH('inline-title-text') : null;
          case 'tw': return tip ? CH('inline-title-font-weight') : null;
          default: return null;
        }
      },
      reach: function (full) { return /inline/.test(full) ? 'every inline tip' : 'every contextual help popover'; },
      every: 'every contextual help',
      html: function (variant, size, state, extraCls) {
        var text = 'Deleted files stay in the trash for 30 days, then they are gone.';
        if (variant === 'inline') {
          return '<div class="plx-contextual-help plx-contextual-help--inline' + ex(extraCls) + '"><span class="plx-contextual-help__icon" aria-hidden="true">' + DS.icon('info-circle', 'plx-icon--size-sm') + '</span>'
            + '<p class="plx-contextual-help__tip"><strong class="plx-contextual-help__title">Tip</strong> ' + text + '</p></div>';
        }
        var more = variant === 'link' ? '<p class="plx-contextual-help__more">' + LINK('About retention') + '</p>' : '';
        return '<span class="plx-contextual-help plx-contextual-help--info' + ex(extraCls) + '">'
          + panel('plx-popover--sm', 'bottom', 'start', '<div class="plx-popover__header"><h2 class="plx-popover__title">Retention</h2></div>' + body('<p class="plx-contextual-help__text">' + text + '</p>' + more)) + '</span>';
      },
      labelSelector: '.plx-contextual-help__tip',
      parts: { mt: 'A', fg: 'B', gap: 'B', fs: 'B', lh: 'B', ic: 'C', ib: 'C', tc: 'D', tw: 'D' },
      anchors: { A: { part: '.plx-contextual-help__more', side: 'bottom' }, B: { part: null, side: 'right' }, C: { part: '.plx-contextual-help__icon', side: 'left' }, D: { part: '.plx-contextual-help__title', side: 'top' } },
      sections: [['Popover', ['mt']], ['Inline tip', ['fg', 'gap', 'fs', 'lh']], ['Icon', ['ic', 'ib']], ['Title', ['tc', 'tw']]],
      matrixLabel: 'Contextual help values by variant', matrixColumnWidth: '--plx-ref-size-75u',
      statesHead: 'Variants · ' + HEAD
    });

    // ---- Teaching bubble (<TeachingBubble>, a Popover with its arrow): default, picture, steps, two actions; md or wide
    var TB = function (n) { return 'plx-comp-teaching-bubble-' + n; };
    DS.registerLab('teaching-bubble', {
      name: 'Teaching bubble', title: 'Plenix teaching bubble', file: 'platform/components/TeachingBubble/teaching-bubble.css', compPrefix: /^plx-comp-teaching-bubble-/,
      store: 'plenix-teaching-bubble-lab-tokens', sizes: [['md', 'Default (320px)', '.plx-popover--md'], ['wide', 'Wide (400px)', '.plx-teaching-bubble--wide']],
      variants: [['default', 'Title and text (default)'], ['media', 'With picture'], ['steps', 'With steps (2 of 3)'], ['actions', 'Primary and secondary actions']], states: STATIC,
      content: [['filters', 'Saved filters']],
      labels: { size: 'Width', variant: 'Content', state: 'State', content: 'Content' },
      defaults: { size: 'md', variant: 'steps', state: 'default', content: 'filters' },
      props: [
        { id: 'bg', label: 'Surface color (the brand blue)', css: ['background-color'], cat: 'color' },
        { id: 'txt', label: 'Text color (the color on the brand)', css: ['color'], cat: 'color' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-teaching-bubble__title', cat: 'color' },
        { id: 'tf', label: 'Title face', css: ['font-family'], part: '.plx-teaching-bubble__title', cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: '.plx-teaching-bubble__title', cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-teaching-bubble__title', cat: 'font-weight' },
        { id: 'tl', label: 'Title line height', css: ['line-height'], part: '.plx-teaching-bubble__title', cat: 'line-height' },
        { id: 'hg', label: 'Header gap', css: ['column-gap'], part: '.plx-teaching-bubble__header', cat: 'space' },
        { id: 'hh', label: 'Header minimum height', css: ['min-block-size'], show: 'min-height', part: '.plx-teaching-bubble__header', cat: 'control-height' },
        { id: 'xm', label: 'Space above the text', css: ['margin-top'], part: '.plx-teaching-bubble__text', cat: 'space' },
        { id: 'mm', label: 'Space under the picture', css: ['margin-bottom'], part: '.plx-teaching-bubble__media', cat: 'space' },
        { id: 'fg', label: 'Footer gap', css: ['column-gap'], part: '.plx-teaching-bubble__footer', cat: 'space' },
        { id: 'fm', label: 'Space above the footer', css: ['margin-top'], part: '.plx-teaching-bubble__footer', cat: 'space' },
        { id: 'sc', label: 'Step count color', css: ['color'], part: '.plx-teaching-bubble__step', cat: 'color' },
        { id: 'ss', label: 'Step count size', css: ['font-size'], part: '.plx-teaching-bubble__step', cat: 'font-size' },
        { id: 'af', label: 'Primary action fill', css: ['background-color'], part: '.plx-teaching-bubble__actions .plx-button--primary', cat: 'color' },
        { id: 'at', label: 'Primary action label', css: ['color'], part: '.plx-teaching-bubble__actions .plx-button--primary', cat: 'color' },
        { id: 'so', label: 'Secondary action outline', css: ['border-top-color'], part: '.plx-teaching-bubble__actions .plx-button--secondary', cat: 'color' },
        { id: 'st', label: 'Secondary action label', css: ['color'], part: '.plx-teaching-bubble__actions .plx-button--secondary', cat: 'color' }
      ],
      token: function (id, size, variant) {
        var foot = variant !== 'media';
        switch (id) {
          case 'bg': return TB('background');
          case 'txt': return TB('text');
          case 'af': return foot ? 'plx-comp-button-on-inverse-action-fill' : null; // the bubble's buttons take Button's on-inverse look (SurfaceContext)
          case 'at': return foot ? 'plx-comp-button-on-inverse-action-text' : null;
          case 'so': return variant === 'steps' || variant === 'actions' ? 'plx-comp-button-on-inverse-action-outline' : null;
          case 'st': return variant === 'steps' || variant === 'actions' ? 'plx-comp-button-on-inverse-text' : null;
          case 'tc': return TB('title-text');
          case 'tf': return TB('title-font-family');
          case 'ts': return TB('title-font-size');
          case 'tw': return TB('title-font-weight');
          case 'tl': return TB('title-line-height');
          case 'hg': return TB('header-gap');
          case 'hh': return TB('header-min-height');
          case 'xm': return TB('text-margin-block-start');
          case 'mm': return variant === 'media' ? TB('media-margin-block-end') : null;
          case 'fg': return foot ? TB('footer-gap') : null;
          case 'fm': return foot ? TB('footer-margin-block-start') : null;
          case 'sc': return variant === 'steps' ? TB('step-text') : null;
          case 'ss': return variant === 'steps' ? TB('step-font-size') : null;
          default: return null;
        }
      },
      reach: function () { return 'every teaching bubble and coach mark'; },
      every: 'every teaching bubble',
      html: function (variant, size, state, extraCls) {
        var media = variant === 'media' ? '<div class="plx-teaching-bubble__media"><img class="ds-w05a-media" src="../../dam/assets/thumb-21.svg" alt=""></div>' : '';
        var steps = variant === 'steps';
        var footer = variant === 'media' ? '' : '<div class="plx-teaching-bubble__footer">'
          + (steps ? '<span class="plx-teaching-bubble__step"><span class="plx-text plx-text--data">2</span> of <span class="plx-text plx-text--data">3</span></span>' : '')
          + '<span class="plx-teaching-bubble__actions">' + (steps ? BTN('secondary plx-button--on-inverse', 'Back') : variant === 'actions' ? BTN('secondary plx-button--on-inverse', 'Not now') : '')
          + BTN('primary plx-button--on-inverse', steps ? 'Next' : variant === 'actions' ? 'Try it' : 'Got it') + '</span></div>';
        var parts = '<span class="plx-popover__arrow" aria-hidden="true"></span><div class="plx-popover__body">' + media
          + '<div class="plx-teaching-bubble__header"><h2 class="plx-teaching-bubble__title">Saved filters</h2>' + CLOSE('plx-teaching-bubble__close') + '</div>'
          + '<p class="plx-teaching-bubble__text">Save a set of filters and open it from here next time.</p>' + footer + '</div>';
        // the bubble is an inverse surface: its buttons take Button's inverse look (plx-button--on-inverse, as SurfaceContext gives it)
        return room(panel((size === 'wide' ? 'plx-popover--lg plx-teaching-bubble--wide' : 'plx-popover--md') + ' plx-popover--arrow plx-teaching-bubble' + ex(extraCls), 'bottom', 'center', parts.split('class="plx-button ').join('class="plx-button plx-button--on-inverse ')));
      },
      labelSelector: '.plx-teaching-bubble__title',
      parts: { bg: 'G', txt: 'G', tc: 'A', tf: 'A', ts: 'A', tw: 'A', tl: 'A', hg: 'B', hh: 'B', xm: 'C', mm: 'D', fg: 'E', fm: 'E', sc: 'F', ss: 'F', af: 'H', at: 'H', so: 'H', st: 'H' },
      anchors: { A: { part: '.plx-teaching-bubble__title', side: 'top' }, B: { part: '.plx-teaching-bubble__header', side: 'right' }, C: { part: '.plx-teaching-bubble__text', side: 'left' },
        D: { part: '.plx-teaching-bubble__media', side: 'right' }, E: { part: '.plx-teaching-bubble__footer', side: 'bottom' }, F: { part: '.plx-teaching-bubble__step', side: 'left' },
        G: { part: null, side: 'right' }, H: { part: '.plx-teaching-bubble__actions', side: 'bottom' } },
      sections: [['Surface', ['bg', 'txt']], ['Title', ['tc', 'tf', 'ts', 'tw', 'tl']], ['Header and text', ['hg', 'hh', 'xm', 'mm']], ['Footer', ['fg', 'fm', 'sc', 'ss']], ['Actions on the blue', ['af', 'at', 'so', 'st']]],
      matrixLabel: 'Teaching bubble values by content', matrixColumnWidth: '--plx-ref-size-100u',
      statesHead: 'Content · ' + HEAD
    });

    // ---- Popconfirm (<Popconfirm>, a Popover of size sm): default and destructive
    var PC = function (n) { return 'plx-comp-popconfirm-' + n; };
    DS.registerLab('popconfirm', {
      name: 'Popconfirm', title: 'Plenix popconfirm', file: 'platform/patterns/Popconfirm/popconfirm.css', compPrefix: /^plx-comp-popconfirm-/,
      store: 'plenix-popconfirm-lab-tokens', sizes: [['sm', 'Default (240px)', '.plx-popover--sm']],
      variants: [['default', 'Default'], ['danger', 'Destructive']], states: STATIC, content: [['question', 'A question and a sentence']],
      labels: { size: 'Size', variant: 'Tone', state: 'State', content: 'Content' },
      defaults: { size: 'sm', variant: 'danger', state: 'default', content: 'question' },
      props: [
        { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-popconfirm__description', cat: 'color' },
        { id: 'ds', label: 'Description size', css: ['font-size'], part: '.plx-popconfirm__description', cat: 'font-size' },
        { id: 'dl', label: 'Description line height', css: ['line-height'], part: '.plx-popconfirm__description', cat: 'line-height' }
      ],
      token: function (id) {
        switch (id) {
          case 'dc': return PC('description-text');
          case 'ds': return PC('description-font-size');
          case 'dl': return PC('description-line-height');
          default: return null;
        }
      },
      reach: function () { return 'every popconfirm'; },
      every: 'every popconfirm',
      html: function (variant, size, state, extraCls) {
        var d = variant === 'danger';
        return panel('plx-popover--sm plx-popconfirm' + (d ? ' plx-popconfirm--danger' : '') + ex(extraCls), 'bottom', 'start',
          '<div class="plx-popover__header"><h2 class="plx-popover__title">' + (d ? 'Remove this tag?' : 'Publish 3 changes?') + '</h2></div>'
          + body('<p class="plx-popconfirm__description">' + (d ? 'The 12 assets keep their other tags.' : 'People with the link see them at once.') + '</p>')
          + '<div class="plx-popover__footer">' + BTN('secondary', 'Cancel') + BTN(d ? 'danger' : 'primary', d ? 'Remove' : 'Publish') + '</div>');
      },
      labelSelector: '.plx-popconfirm__description',
      parts: { dc: 'A', ds: 'A', dl: 'A' },
      anchors: { A: { part: '.plx-popconfirm__description', side: 'right' } },
      sections: [['Description', ['dc', 'ds', 'dl']]],
      matrixLabel: 'Popconfirm values by tone', matrixColumnWidth: '--plx-ref-size-70u',
      statesHead: 'Tones · ' + HEAD
    });

    // ---- Mega menu (<MegaMenu>): the panel's columns (with a featured area) and the accordion
    var MM = function (n) { return 'plx-comp-mega-menu-' + n; };
    var GROUPS = [['Start', [['Upload files', 'Add files to a project'], ['Organize', 'Folders, tags and boards']]], ['Share', [['Links', 'Send a view-only link'], ['People', 'Invite members']]], ['Manage', [['Storage', ''], ['Permissions', '']]]];
    var columns = function (featured) {
      return '<div class="plx-mega-menu__columns">' + GROUPS.map(function (g, i) {
        return '<section class="plx-mega-menu__group" aria-labelledby="ds-w05a-mm' + i + '"><h2 id="ds-w05a-mm' + i + '" class="plx-mega-menu__heading">' + g[0] + '</h2><ul class="plx-mega-menu__links">'
          + g[1].map(function (l) { return '<li class="plx-mega-menu__item">' + LINK(l[0]) + (l[1] ? '<p class="plx-mega-menu__description">' + l[1] + '</p>' : '') + '</li>'; }).join('') + '</ul></section>';
      }).join('') + (featured ? '<div class="plx-mega-menu__feature"><p class="plx-text plx-text--label">New: boards</p><p class="plx-text plx-text--body">Review assets together.</p>' + LINK('Open boards') + '</div>' : '') + '</div>';
    };
    DS.registerLab('navigation-menu', {
      name: 'Mega menu', title: 'Plenix mega menu', file: 'platform/components/MegaMenu/mega-menu.css', compPrefix: /^plx-comp-mega-menu-/,
      store: 'plenix-mega-menu-lab-tokens', sizes: [['default', 'Default', '.plx-mega-menu']],
      variants: [['columns', 'Columns (default)'], ['featured', 'With featured'], ['accordion', 'Mobile accordion']], states: STATIC, content: [['guides', 'Guides']],
      labels: { size: 'Size', variant: 'Layout', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'featured', state: 'default', content: 'guides' },
      props: [
        { id: 'cg', label: 'Column gap', css: ['column-gap'], part: '.plx-mega-menu__columns', cat: 'space' },
        { id: 'rg', label: 'Row gap (wrapped columns)', css: ['row-gap'], part: '.plx-mega-menu__columns', cat: 'space' },
        { id: 'cw', label: 'Column width', css: ['inline-size'], show: 'width', part: '.plx-mega-menu__group', cat: 'size' },
        { id: 'hc', label: 'Heading color', css: ['color'], part: '.plx-mega-menu__heading', cat: 'color' },
        { id: 'hs', label: 'Heading size', css: ['font-size'], part: '.plx-mega-menu__heading', cat: 'font-size' },
        { id: 'hw', label: 'Heading weight', css: ['font-weight'], part: '.plx-mega-menu__heading', cat: 'font-weight' },
        { id: 'hl', label: 'Heading line height', css: ['line-height'], part: '.plx-mega-menu__heading', cat: 'line-height' },
        { id: 'hm', label: 'Space under a heading', css: ['margin-bottom'], part: '.plx-mega-menu__heading', cat: 'space' },
        { id: 'lg', label: 'Gap between links', css: ['row-gap'], part: '.plx-mega-menu__links', cat: 'space' },
        { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-mega-menu__description', cat: 'color' },
        { id: 'ds', label: 'Description size', css: ['font-size'], part: '.plx-mega-menu__description', cat: 'font-size' },
        { id: 'fb', label: 'Featured background', css: ['background-color'], part: '.plx-mega-menu__feature', cat: 'color' },
        { id: 'fr', label: 'Featured radius', css: CORNERS, show: 'border-top-left-radius', part: '.plx-mega-menu__feature', cat: 'radius' },
        { id: 'fp', label: 'Featured padding', css: ['padding-top', 'padding-bottom', 'padding-left', 'padding-right'], show: 'padding-top', part: '.plx-mega-menu__feature', cat: 'space' },
        { id: 'fw', label: 'Featured width', css: ['inline-size'], show: 'width', part: '.plx-mega-menu__feature', cat: 'size' },
        { id: 'sm', label: 'Space above the groups (accordion)', css: ['margin-top'], part: '.plx-mega-menu__sections', cat: 'space' }
      ],
      token: function (id, size, variant) {
        var cols = variant !== 'accordion';
        switch (id) {
          case 'cg': return cols ? MM('column-gap') : null;
          case 'rg': return cols ? MM('row-gap') : null;
          case 'cw': return cols ? MM('column-width') : null;
          case 'hc': return cols ? MM('heading-text') : null;
          case 'hs': return cols ? MM('heading-font-size') : null;
          case 'hw': return cols ? MM('heading-font-weight') : null;
          case 'hl': return cols ? MM('heading-line-height') : null;
          case 'hm': return cols ? MM('heading-margin-block-end') : null;
          case 'lg': return cols ? MM('link-gap') : null;
          case 'dc': return cols ? MM('description-text') : null;
          case 'ds': return cols ? MM('description-font-size') : null;
          case 'fb': return variant === 'featured' ? MM('feature-background') : null;
          case 'fr': return variant === 'featured' ? MM('feature-radius') : null;
          case 'fp': return variant === 'featured' ? MM('feature-padding') : null;
          case 'fw': return variant === 'featured' ? MM('feature-width') : null;
          case 'sm': return variant === 'accordion' ? MM('sections-margin-block-start') : null;
          default: return null;
        }
      },
      reach: function (full) { return /feature/.test(full) ? 'every featured area' : /sections/.test(full) ? 'every mega menu accordion' : 'every mega menu panel'; },
      every: 'every mega menu',
      html: function (variant, size, state, extraCls) {
        var trigger = function (open) {
          return '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--caret' + (open ? ' is-selected' : '') + ' plx-mega-menu__toggle" aria-expanded="' + open + '"><span class="plx-button__label">Guides</span><span class="plx-button__caret" aria-hidden="true">' + DS.icon('chevron-down') + '</span></button>';
        };
        if (variant === 'accordion') {
          var groups = GROUPS.map(function (g) {
            return '<section class="plx-collapsible-section plx-nav-list__group"><div class="plx-collapsible-section__heading"><button type="button" tabindex="-1" class="plx-collapsible-section__toggle" aria-expanded="false">'
              + '<span class="plx-collapsible-section__title">' + g[0] + '</span><span class="plx-collapsible-section__chevron" aria-hidden="true">' + icon('chevron-down') + '</span></button></div></section>';
          }).join('');
          return '<div class="ds-w05a-narrow"><div class="plx-mega-menu plx-mega-menu--accordion' + ex(extraCls) + '">' + trigger(true) + '<div class="plx-mega-menu__sections"><nav aria-label="Guides" class="plx-nav-list">' + groups + '</nav></div></div></div>';
        }
        return '<div class="plx-mega-menu plx-mega-menu--columns' + (variant === 'featured' ? ' plx-mega-menu--featured' : '') + ex(extraCls) + '"><div class="ds-w05a-stack">' + trigger(true)
          + panel('plx-popover--auto plx-mega-menu__panel', 'bottom', 'start', body(columns(variant === 'featured'))) + '</div></div>';
      },
      labelSelector: '.plx-mega-menu__heading',
      parts: { cg: 'A', rg: 'A', cw: 'B', hc: 'C', hs: 'C', hw: 'C', hl: 'C', hm: 'C', lg: 'D', dc: 'E', ds: 'E', fb: 'F', fr: 'F', fp: 'F', fw: 'F', sm: 'G' },
      anchors: { A: { part: '.plx-mega-menu__columns', side: 'bottom' }, B: { part: '.plx-mega-menu__group', side: 'top' }, C: { part: '.plx-mega-menu__heading', side: 'left' },
        D: { part: '.plx-mega-menu__links', side: 'left' }, E: { part: '.plx-mega-menu__description', side: 'right' }, F: { part: '.plx-mega-menu__feature', side: 'right' }, G: { part: '.plx-mega-menu__sections', side: 'left' } },
      sections: [['Columns', ['cg', 'rg', 'cw']], ['Group', ['hc', 'hs', 'hw', 'hl', 'hm', 'lg', 'dc', 'ds']], ['Featured area', ['fb', 'fr', 'fp', 'fw']], ['Accordion', ['sm']]],
      matrixLabel: 'Mega menu values by layout', matrixColumnWidth: '--plx-ref-size-180u',
      statesHead: 'Layouts · ' + HEAD
    });
  })();
}
