/* Plenix design system · library part w04A: the labs of Barcode, the section message (Notice's lab registered again with
   the title, actions and dismiss button as content), the Error state (EmptyState's lab registered again with the warning
   and success tones and the system-state kinds as variants; the Error state page has a lab of its own on the same spec,
   opening on the error tone) and the Retry pattern. Each value with the one token behind it: the components' own token
   files (platform/tokens/components/barcode, notice, empty-state, retry) and components.tokens.json. */
if (window.DS && DS.registerLab) {
  (function () {
    var STATIC = [['default', 'Default']];
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name) { return DS.icon(name); };
    var button = function (label, cls, iconName) {
      return '<button type="button" tabindex="-1" class="plx-button ' + cls + '">' + (iconName ? '<span class="plx-button__icon">' + icon(iconName) + '</span>' : '')
        + (label ? '<span class="plx-button__label">' + label + '</span>' : '') + '</button>';
    };
    var DISMISS = '<button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only plx-notice__dismiss" aria-label="Dismiss"><span class="plx-button__icon">' + icon('close') + '</span></button>';

    // ---- Barcode (<Barcode>, div.plx-barcode: the SVG bars on the white plate in both themes, the value under them in the data font)
    var BC = function (n) { return 'plx-comp-barcode-' + n; };
    var SAMPLE = { code128: 'PLX-2026-0042', ean13: '400638133393', upca: '03600029145' };
    DS.registerLab('barcode', {
      name: 'Barcode', title: 'Plenix barcode', file: 'platform/components/Barcode/barcode.css', compPrefix: /^plx-comp-barcode-/,
      store: 'plenix-barcode-lab-tokens', sizes: [['sm', 'Sm (48px)', '.plx-barcode--sm'], ['md', 'Md (64px, default)', '.plx-barcode--md'], ['lg', 'Lg (96px)', '.plx-barcode--lg']],
      variants: [['code128', 'Code 128 (default)'], ['ean13', 'EAN-13'], ['upca', 'UPC-A']],
      states: STATIC,
      content: [['text', 'With human-readable text (default)'], ['bars', 'Bars only']],
      labels: { size: 'Size', variant: 'Format', state: 'State', content: 'Text' },
      defaults: { size: 'md', variant: 'code128', state: 'default', content: 'text' },
      props: [
        { id: 'bg', label: 'Plate color', css: ['background-color'], cat: 'color' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space', extra: ['0'] },
        { id: 'gap', label: 'Gap (bars to text)', css: ['row-gap'], cat: 'space', extra: ['0'] },
        { id: 'h', label: 'Bar height', css: ['block-size'], show: 'height', part: '.plx-barcode__svg', cat: 'size' },
        { id: 'bar', label: 'Bar color', css: ['fill'], part: '.plx-barcode__bars', cat: 'color' },
        { id: 'qz', label: 'Quiet zone color', css: ['fill'], part: '.plx-barcode__background', cat: 'color' },
        { id: 'tfg', label: 'Text color', css: ['color'], part: '.plx-barcode__text', cat: 'color' },
        { id: 'tff', label: 'Text font', css: ['font-family'], part: '.plx-barcode__text', cat: 'font' },
        { id: 'tfs', label: 'Text font size', css: ['font-size'], part: '.plx-barcode__text', cat: 'font-size' },
        { id: 'tlh', label: 'Text line height', css: ['line-height'], part: '.plx-barcode__text', cat: 'line-height' }
      ],
      token: function (id, size, variant, state, content) {
        var text = content !== 'bars';
        switch (id) {
          case 'bg': case 'qz': return BC('background');
          case 'py': return BC('padding-block');
          case 'gap': return text ? BC('row-gap') : null;
          case 'h': return BC(size + '-height');
          case 'bar': return BC('bar');
          case 'tfg': return text ? BC('text') : null;
          case 'tff': return text ? BC('font-family') : null;
          case 'tfs': return text ? BC('font-size') : null;
          case 'tlh': return text ? BC('line-height') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-(sm|md|lg)-height$/.test(full) ? 'every barcode of that size' : 'every barcode'; },
      every: 'every barcode',
      html: function (variant, size, state, extraCls, ui) {
        var P = window.Plenix || {};
        var code = P.encodeBarcode ? P.encodeBarcode(SAMPLE[variant], variant) : null;
        var q = P.BARCODE_QUIET_ZONE || 10, H = 32;
        var width = code ? code.modules + q * 2 : 1;
        var d = code ? code.bars.map(function (b) { return 'M' + (b[0] + q) + ' 0h' + b[1] + 'v' + H + 'h-' + b[1] + 'z'; }).join('') : '';
        return '<div class="plx-barcode plx-barcode--' + size + ex(extraCls) + '" role="img" aria-label="Barcode">'
          + '<svg class="plx-barcode__svg" viewBox="0 0 ' + width + ' ' + H + '" shape-rendering="crispEdges" aria-hidden="true" focusable="false">'
          + '<rect class="plx-barcode__background" x="0" y="0" width="' + width + '" height="' + H + '"></rect><path class="plx-barcode__bars" d="' + d + '"></path></svg>'
          + (ui && ui.content === 'bars' || !code ? '' : '<span class="plx-barcode__text" aria-hidden="true">' + code.text + '</span>') + '</div>';
      },
      labelSelector: '.plx-barcode__text',
      parts: { bg: 'A', py: 'A', gap: 'A', h: 'B', bar: 'B', qz: 'B', tfg: 'C', tff: 'C', tfs: 'C', tlh: 'C' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-barcode__svg', side: 'top' }, C: { part: '.plx-barcode__text', side: 'bottom' } },
      sections: [['Plate', ['bg', 'py', 'gap']], ['Bars', ['h', 'bar', 'qz']], ['Text', ['tfg', 'tff', 'tfs', 'tlh']]],
      matrixLabel: 'Barcode values by size and format',
      statesHead: 'Formats · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });

    // ---- the section message: Notice's lab with a title, actions and a dismiss button as content
    var notice = DS.labs.notice;
    if (notice) {
      var NT = function (n) { return 'plx-comp-notice-' + n; };
      var NOTICE_ICON = { info: 'info-circle', success: 'circle-check', warning: 'warning', danger: 'alert' };
      var SECTION = { title: 1, actions: 1, dismiss: 1 };
      var sectionSpec = function (base, contentFirst) {
        var parts = [['title', 'With title'], ['actions', 'With actions'], ['dismiss', 'Dismissible']];
        return Object.assign({}, base, {
          content: contentFirst ? parts.concat(base.content) : base.content.concat(parts),
          props: base.props.concat([
            { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: '.plx-notice__title', cat: 'font-weight' },
            { id: 'bgap', label: 'Gap (title, text, actions)', css: ['row-gap'], part: '.plx-notice__body', cat: 'space', extra: ['0'] },
            { id: 'agap', label: 'Gap between actions', css: ['column-gap'], part: '.plx-notice__actions', cat: 'space', extra: ['0'] },
            { id: 'am', label: 'Actions distance above', css: ['margin-block-start'], show: 'margin-top', part: '.plx-notice__actions', cat: 'space', extra: ['0'] }
          ]),
          token: function (id, size, variant, state, content) {
            var sec = SECTION[content], acts = content === 'actions';
            switch (id) {
              case 'tfw': case 'bgap': return sec ? NT(id === 'tfw' ? 'title-font-weight' : 'body-row-gap') : null;
              case 'agap': return acts ? NT('actions-gap') : null;
              case 'am': return acts ? NT('actions-margin-block-start') : null;
              default: return base.token(id, size, variant, state, content);
            }
          },
          reach: function (full) { return /notice-(title|body|actions)-/.test(full) ? 'every section message' : base.reach(full); },
          html: function (variant, size, state, extraCls, ui) {
            var content = ui && ui.content;
            if (!SECTION[content]) return base.html(variant, size, state, extraCls, ui);
            var acts = content === 'actions' ? '<div class="plx-notice__actions">' + button('Try again', 'plx-button--secondary plx-button--size-xs', 'refresh')
              + button('Details', 'plx-button--ghost plx-button--size-xs') + '</div>' : '';
            return '<div class="plx-notice plx-notice--' + variant + ex(extraCls) + '">' + icon(NOTICE_ICON[variant])
              + '<div class="plx-notice__body"><div class="plx-notice__title">The sync stopped</div><div class="plx-notice__text">The server did not answer.</div>' + acts + '</div>'
              + (content === 'dismiss' ? DISMISS : '') + '</div>';
          },
          parts: Object.assign({}, base.parts, { tfw: 'E', bgap: 'F', agap: 'G', am: 'G' }),
          anchors: Object.assign({}, base.anchors, { E: { part: '.plx-notice__title', side: 'right' }, F: { part: '.plx-notice__body', side: 'left' }, G: { part: '.plx-notice__actions', side: 'bottom' } }),
          sections: base.sections.concat([['Section message', ['tfw', 'bgap', 'agap', 'am']]])
        });
      };
      DS.registerLab('notice', sectionSpec(notice, false));
      DS.registerLab('section-message', Object.assign(sectionSpec(notice, true), { name: 'Section message', title: 'Plenix section message', store: 'plenix-section-message-lab-tokens',
        defaults: Object.assign({}, notice.defaults, { variant: 'danger', content: 'title' }), matrixLabel: 'Section message values by tone' }));
    }

    // ---- the Error state: EmptyState's lab with the warning and success tones and the kinds as variants
    var empty = DS.labs['empty-state'];
    if (empty) {
      var ES = function (n) { return 'plx-comp-empty-state-' + n; };
      // variant -> [tone, icon, title, text, action]
      var MORE = {
        warning: ['warning', 'warning', 'Showing saved results', 'The search service is slow.', 'Refresh'],
        success: ['success', 'circle-check', 'Import finished', 'All assets are in the library.', null],
        offline: ['warning', 'wifi-off', 'You’re offline', 'Check your connection. This page updates when you’re back online.', 'Try again'],
        degraded: ['warning', 'cloud-off', 'Some features aren’t working', 'A service is slow or not responding, so what you see may be out of date.', 'Try again'],
        'permission-denied': ['neutral', 'lock', 'You don’t have access', 'Ask the owner to share it with you.', 'Request access'],
        'not-found': ['neutral', 'doc-search', 'This page doesn’t exist', 'It may have been moved or deleted. Check the address or go back.', 'Go back'],
        maintenance: ['neutral', 'settings-maintenance', 'Down for maintenance', 'This service is being updated. Try again in a few minutes.', null],
        completion: ['success', 'circle-check', 'All done', 'There’s nothing left to do here.', null]
      };
      var MORE_VARIANTS = [['warning', 'Warning'], ['success', 'Success'], ['offline', 'Offline'], ['degraded', 'Degraded'], ['permission-denied', 'Permission denied'],
        ['not-found', 'Not found'], ['maintenance', 'Maintenance'], ['completion', 'Completion']];
      var stateSpec = function (variants, defaults) {
        return Object.assign({}, empty, {
          variants: variants,
          labels: Object.assign({}, empty.labels, { variant: 'Parts, tone and kind' }),
          defaults: Object.assign({}, empty.defaults, defaults || {}),
          token: function (id, size, variant, state, content) {
            var m = MORE[variant];
            if (!m) return empty.token(id, size, variant, state, content);
            if (id === 'icfg') return m[0] === 'neutral' ? ES('icon-text') : ES(m[0] + '-icon-text');
            if (id === 'am' && !m[4]) return null;
            return empty.token(id, size, 'full', state, content);
          },
          reach: function (full) { var r = /-(warning|success)-/.exec(full); return r ? 'every ' + r[1] + ' empty state' : empty.reach(full); },
          html: function (variant, size, state, extraCls, ui) {
            var m = MORE[variant];
            if (!m) return empty.html(variant, size, state, extraCls, ui);
            return '<div class="plx-empty-state plx-empty-state--' + size + (m[0] === 'neutral' ? '' : ' plx-empty-state--' + m[0]) + ex(extraCls) + '">'
              + '<div class="plx-empty-state__icon" aria-hidden="true">' + icon(m[1]) + '</div><div class="plx-empty-state__title">' + m[2] + '</div>'
              + '<div class="plx-empty-state__text">' + m[3] + '</div>'
              + (m[4] ? '<div class="plx-empty-state__action">' + button(m[4], 'plx-button--secondary') + '</div>' : '') + '</div>';
          }
        });
      };
      DS.registerLab('empty-state', stateSpec(empty.variants.concat(MORE_VARIANTS)));
      DS.registerLab('error-state', Object.assign(stateSpec([['error', 'Error: what failed and the one action that recovers']].concat(MORE_VARIANTS), { variant: 'error' }),
        { name: 'Error state', title: 'Plenix error state', store: 'plenix-error-state-lab-tokens', matrixLabel: 'Error state values by size, tone and kind' }));
    }

    // ---- Retry (<RetryNotice>, the danger section message with .plx-retry__status: the wait and the attempt)
    var RT = function (n) { return 'plx-comp-retry-' + n; };
    var dataText = function (t) { return '<span class="plx-text plx-text--data">' + t + '</span>'; };
    DS.registerLab('retry-pattern', {
      name: 'Retry', title: 'Plenix retry', file: 'platform/patterns/Retry/retry.css', compPrefix: /^plx-comp-retry-/,
      store: 'plenix-retry-lab-tokens', sizes: [['default', 'Default', '.plx-retry']],
      variants: [['manual', 'Inline retry (manual)'], ['auto', 'Automatic with backoff'], ['count', 'Retry count']],
      states: STATIC,
      content: [['failed', 'After a failed attempt']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'auto', state: 'default', content: 'failed' },
      props: [
        { id: 'gap', label: 'Gap (wait to attempt)', css: ['column-gap'], part: '.plx-retry__status', cat: 'space', extra: ['0'] },
        { id: 'mt', label: 'Status line distance above', css: ['margin-block-start'], show: 'margin-top', part: '.plx-retry__status', cat: 'space', extra: ['0'] }
      ],
      token: function (id, size, variant) {
        if (variant === 'manual') return null;
        return id === 'gap' ? RT('status-gap') : id === 'mt' ? RT('status-margin-block-start') : null;
      },
      reach: function () { return 'every retry notice'; },
      every: 'every retry notice',
      html: function (variant, size, state, extraCls) {
        var status = variant === 'manual' ? '' : '<span class="plx-retry__status"><span class="plx-retry__wait">Retrying in ' + dataText('4 sec') + '</span>'
          + (variant === 'count' ? '<span class="plx-retry__count">Attempt ' + dataText('2') + ' of ' + dataText('3') + '</span>' : '') + '</span>';
        return '<div class="plx-notice plx-notice--danger plx-retry' + ex(extraCls) + '">' + icon('alert')
          + '<div class="plx-notice__body"><div class="plx-notice__title">The comments could not load</div><div class="plx-notice__text">The server did not answer.' + status + '</div>'
          + '<div class="plx-notice__actions">' + button(variant === 'manual' ? 'Retry' : 'Retry now', 'plx-button--secondary plx-button--size-xs', 'refresh') + '</div></div></div>';
      },
      labelSelector: '.plx-notice__title',
      parts: { gap: 'A', mt: 'A' },
      anchors: { A: { part: '.plx-retry__status', side: 'bottom' } },
      sections: [['Status line', ['gap', 'mt']]],
      matrixLabel: 'Retry values by kind',
      statesHead: 'Kinds · every value (click one to inspect it; the dashed outline marks the one shown below)'
    });
  })();
}
