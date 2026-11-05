/* Plenix design system · library part w02B: the type styles lab, and Text's lab (content-labs.js) with its new variants.
   Text gains two roles (display and lead) and three ways to overflow (two, three or four lines, with Show more) plus
   tabular figures; the Type styles lab draws the five type styles (display, lead, body, label, caption) with every
   overflow. Each value with the one token behind it; the roles Text already had keep the tokens content-labs.js names. */
if (window.DS && DS.registerLab && DS.labs && DS.labs.text) {
  (function () {
    var BASE = DS.labs.text;
    var TX = function (variant, n) { return 'plx-comp-text-' + variant + '-' + n; };
    // the new roles: which properties each sets, and the token suffix of each property
    var NEW = { display: 'fg ff fs fw lh', lead: 'fg ff fs lh' };
    var SUFFIX = { fg: 'text', ff: 'font-family', fs: 'font-size', fw: 'font-weight', lh: 'line-height' };
    var LONG = 'The quarterly brand review collects every logo, color and typeface decision made this quarter, with the files the press kit needs.';
    var OVERFLOW = [['lines-2', '2 lines'], ['lines-3', '3 lines'], ['lines-4', '4 lines'], ['expandable', 'Expandable (Show more)'], ['tabular', 'Tabular figures']];
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var token = function (id, size, variant, state, content) {
      if (NEW[variant]) return NEW[variant].split(' ').indexOf(id) >= 0 ? TX(variant, SUFFIX[id]) : null;
      return id === 'lh' ? null : BASE.token(id, size, variant, state, content);
    };
    // the markup Text renders for each overflow; the rest (one line, truncated) as content-labs.js draws it
    var html = function (variant, size, state, extraCls, ui) {
      var c = ui && ui.content, m = /^lines-(\d)$/.exec(c || '');
      if (m) return '<div class="ds-sample-text-frame"><p class="plx-text plx-text--' + variant + ' plx-text--lines-' + m[1] + ex(extraCls) + '">' + LONG + '</p></div>';
      if (c === 'expandable') {
        return '<div class="ds-sample-text-frame"><div class="plx-text-expand"><p class="plx-text plx-text--' + variant + ' plx-text--lines-3' + ex(extraCls) + '" id="ds-w02b-expand">' + LONG + '</p>'
          + '<button type="button" class="plx-button plx-button--secondary plx-button--size-2xs" aria-expanded="false" aria-controls="ds-w02b-expand"><span class="plx-button__label">Show more</span>'
          + '<span class="plx-button__icon">' + DS.icon('chevron-down') + '</span></button></div></div>';
      }
      if (c === 'tabular') return '<span class="plx-text plx-text--' + variant + ' plx-text--tabular' + ex(extraCls) + '">1,111.11 · 9,876.54</span>';
      return BASE.html(variant, size, state, extraCls, ui);
    };
    var props = BASE.props.concat([{ id: 'lh', label: 'Line height', css: ['line-height'], cat: 'line-height' }]);
    var parts = Object.assign({}, BASE.parts, { lh: 'A' });
    var sections = [['Text', ['fg', 'ff', 'fs', 'fw', 'lh']]];

    // Text: every role it had, display and lead, and the new overflows
    DS.registerLab('text', Object.assign({}, BASE, {
      variants: BASE.variants.concat([['display', 'Display'], ['lead', 'Lead']]),
      content: BASE.content.concat(OVERFLOW),
      token: token, html: html, props: props, parts: parts, sections: sections
    }));

    // Type styles: the five styles of the typography foundation, from the largest to the smallest, with every overflow
    DS.registerLab('type-styles', Object.assign({}, BASE, {
      name: 'Type styles', title: 'Plenix type styles', store: 'plenix-type-styles-lab-tokens',
      variants: [['display', 'Display'], ['lead', 'Lead'], ['body', 'Body (default)'], ['label', 'Label'], ['caption', 'Caption']],
      content: [['line', 'One line'], ['truncate', 'Truncate']].concat(OVERFLOW.map(function (o) { return o[0] === 'tabular' ? ['tabular', 'Tabular'] : o[0] === 'expandable' ? ['expandable', 'Expandable'] : o; })),
      labels: { size: 'Size', variant: 'Style', state: 'State', content: 'Overflow' },
      token: token, html: html, props: props, parts: parts, sections: sections,
      matrixLabel: 'Type values by style',
      statesHead: 'Styles · every value (click one to inspect it; the dashed outline marks the one shown below)'
    }));
  })();
}
