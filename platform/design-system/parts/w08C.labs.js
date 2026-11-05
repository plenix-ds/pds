/* Plenix design system · library part w08C: the labs of wave 8, lane C. RoleLabel, SearchResult, SearchResultGroup,
   Timeline, ResourceList, and the expandable Card (the card lab of data-labs.js re-registered with its new variant, and
   the expandable card's own lab), each drawn in place with the markup the component renders, so every variant and state
   shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var hov = function (state) { return state === 'hover' ? ' is-hover' : ''; };
    var foc = function (state) { return state === 'focus' ? ' is-focus-visible' : ''; };
    var icon = function (name, size) { return DS.icon(name, size ? 'plx-icon--size-' + size : ''); };
    var thumb = function (name) { return '<span class="plx-thumbnail plx-thumbnail--icon" aria-hidden="true">' + icon(name, 'sm') + '</span>'; };
    var avatar = function (initials) { return '<span class="plx-avatar plx-avatar--md" data-plx-avatar="" aria-hidden="true">' + initials + '</span>'; };
    var data = function (v) { return '<span class="plx-text plx-text--data">' + v + '</span>'; };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];

    // ---- Role (<RoleLabel>, span.plx-tag.plx-role-label): the Tag's look with the role's icon before the name; the
    // built-in roles gray, a custom role in its category color (data-plx-category: the category's own tokens)
    var RL = function (n) { return 'plx-comp-role-label-' + n; }, TG = function (n) { return 'plx-comp-tag-' + n; };
    var ROLES = { owner: ['Owner', 'settings-permissions'], editor: ['Editor', 'pencil'], viewer: ['Viewer', 'visibility'], custom: ['Billing admin', 'person'] };
    DS.registerLab('role-label', {
      name: 'Role', title: 'Plenix role', file: 'platform/components/RoleLabel/role-label.css', compPrefix: /^plx-comp-(role-label|tag)-/,
      store: 'plenix-role-label-lab-tokens', sizes: [['default', 'Default', '.plx-role-label']],
      variants: [['owner', 'Owner'], ['editor', 'Editor'], ['viewer', 'Viewer'], ['custom', 'Custom (a category color)']],
      states: [['default', 'Default']], content: [['icon', 'Icon and name'], ['text', 'Name only']],
      labels: { size: 'Size', variant: 'Role', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'owner', state: 'default', content: 'icon' },
      props: [
        { id: 'bg', label: 'Background color', css: ['background-color'], cat: 'color' },
        { id: 'tc', label: 'Text color', css: ['color'], cat: 'color' },
        { id: 'bc', label: 'Border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'h', label: 'Height', css: ['min-block-size'], show: 'min-height', cat: 'size' },
        { id: 'px', label: 'Padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
        { id: 'ff', label: 'Font family', css: ['font-family'], cat: 'font' },
        { id: 'fs', label: 'Font size', css: ['font-size'], cat: 'font-size' },
        { id: 'fw', label: 'Font weight', css: ['font-weight'], cat: 'font-weight' },
        { id: 'gap', label: 'Space after the icon', css: ['column-gap'], cat: 'space' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-role-label__icon .plx-icon', cat: 'icon' }
      ],
      token: function (id, size, variant, state, content) {
        var gray = variant !== 'custom', withIcon = content !== 'text';
        if (id === 'gap') return withIcon ? RL('gap') : null;
        if (id === 'is') return withIcon ? RL('icon-size') : null;
        if (id === 'bg') return gray ? TG('background') : null;
        if (id === 'tc') return gray ? TG('text') : null;
        if (id === 'bc') return gray ? TG('border-color') : null;
        return { bw: TG('border-width'), rad: TG('radius'), h: TG('min-height'), px: TG('padding-inline'), ff: TG('font-family'), fs: TG('font-size'), fw: TG('font-weight') }[id] || null;
      },
      reach: function (full) { return /role-label/.test(full) ? 'every role label' : 'every tag, chip and role label'; }, every: 'every role label',
      html: function (variant, size, state, extraCls, ui) {
        var r = ROLES[variant] || ROLES.owner, withIcon = !ui || ui.content !== 'text';
        return '<span class="plx-tag plx-role-label' + ex(extraCls) + '" data-plx-role="' + variant + '"' + (variant === 'custom' ? ' data-plx-category="teal"' : '') + '>'
          + (withIcon ? '<span class="plx-role-label__icon" aria-hidden="true">' + icon(r[1]) + '</span>' : '') + '<span class="plx-tag__label">' + r[0] + '</span></span>';
      },
      labelSelector: '.plx-tag__label',
      parts: { bg: 'A', rad: 'A', bc: 'B', bw: 'B', h: 'C', px: 'C', tc: 'D', ff: 'D', fs: 'D', fw: 'D', gap: 'E', is: 'E' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'bottom' }, C: { part: null, side: 'left' }, D: { part: '.plx-tag__label', side: 'right' }, E: { part: '.plx-role-label__icon', side: 'top' } },
      sections: [['Label (the Tag)', ['bg', 'bc', 'bw', 'rad', 'h', 'px']], ['Name', ['tc', 'ff', 'fs', 'fw']], ['Icon', ['gap', 'is']]],
      matrixLabel: 'Role values by role and content', statesHead: 'Roles · ' + HEAD
    });

    // ---- Search result item (<SearchResult>, li.plx-search-result): two results in a list (the first is the specimen; the
    // second keeps the first from being the last row, which has no line under it)
    var SR = function (n) { return 'plx-comp-search-result-' + n; };
    var RES = {
      page: { lead: thumb('doc-text'), title: 'Cabinet quotes and layouts', q: ['Cabinet', ' quotes and layouts'], path: ['Projects', 'Kitchen renovation'], snippet: ['Three ', 'quotes', ' for the cabinets: the second covers the island.'], meta: 'Note · edited ' + data('10/12/2026') },
      file: { lead: thumb('file-pdf'), title: 'Cabinet quote.pdf', q: ['Cabinet ', 'quote', '.pdf'], path: ['Files', 'Kitchen renovation', 'Quotes'], snippet: ['The ', 'quote', ' for the upper and lower cabinets.'], meta: data('2.4 MB · 10/12/2026') },
      person: { lead: avatar('MC'), title: 'Maya Chen', q: ['', 'Maya', ' Chen'], snippet: ['Designer on Kitchen renovation and Brand kit.', '', ''], meta: data('maya@plenix.example') }
    };
    var match = function (parts, on) { return on ? parts[0] + (parts[1] ? '<strong class="plx-search-result__match">' + parts[1] + '</strong>' : '') + parts[2] : parts.join(''); };
    var resultHtml = function (key, opts) {
      var r = RES[key] || RES.page, o = opts || {}, hi = o.content === 'highlight', withPath = o.content === 'path' && r.path;
      var path = withPath ? '<span class="plx-search-result__path"><span class="plx-visually-hidden">In </span>' + r.path.map(function (p, i) {
        return (i ? '<span class="plx-search-result__separator" aria-hidden="true">' + icon('chevron-right') + '</span>' : '') + '<span class="plx-search-result__crumb">' + p + '</span>';
      }).join('') + '</span>' : '';
      return '<li class="plx-search-result is-interactive' + (o.state === 'selected' ? ' is-selected' : '') + hov(o.state) + ex(o.cls) + '">'
        + '<span class="plx-search-result__leading">' + r.lead + '</span><span class="plx-search-result__text">' + path
        + '<span class="plx-search-result__title"><a href="#" tabindex="-1" class="plx-search-result__opener' + foc(o.state) + '"' + (o.state === 'selected' ? ' aria-current="true"' : '') + '>' + (hi ? match(r.q, true) : r.title) + '</a></span>'
        + '<span class="plx-search-result__snippet">' + match(r.snippet, hi) + '</span><span class="plx-search-result__meta">' + r.meta + '</span></span></li>';
    };
    var TITLE = '.plx-search-result__title', SNIP = '.plx-search-result__snippet', META = '.plx-search-result__meta', PATH = '.plx-search-result__path';
    DS.registerLab('search-result', {
      name: 'Search result item', title: 'Plenix search result', file: 'platform/components/SearchResult/search-result.css', compPrefix: /^plx-comp-search-result-(?!group)/,
      store: 'plenix-search-result-lab-tokens', sizes: [['default', 'Default', '.plx-search-result']],
      variants: [['page', 'Page (default)'], ['file', 'File'], ['person', 'Person']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['selected', 'Selected']],
      content: [['plain', 'Title, snippet and meta'], ['highlight', 'With highlight'], ['path', 'With path']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'page', state: 'default', content: 'highlight' },
      props: [
        { id: 'gap', label: 'Space between picture, text and actions', css: ['column-gap'], cat: 'space' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
        { id: 'ip', label: 'Inset left & right (its fill)', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
        { id: 'lc', label: 'Line under it', css: ['border-bottom-color'], cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['border-bottom-width'], cat: 'border-width' },
        { id: 'hb', label: 'Hover fill', css: ['background-color'], cat: 'color' },
        { id: 'sb', label: 'Selected fill', css: ['background-color'], cat: 'color' },
        { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
        { id: 'fow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
        { id: 'rg', label: 'Space between the lines', css: ['row-gap'], part: '.plx-search-result__text', cat: 'space' },
        { id: 'pc', label: 'Path color', css: ['color'], part: PATH, cat: 'color' },
        { id: 'pfs', label: 'Path size', css: ['font-size'], part: PATH, cat: 'font-size' },
        { id: 'pg', label: 'Space around the chevrons', css: ['column-gap'], part: PATH, cat: 'space' },
        { id: 'ps', label: 'Chevron size', css: ['inline-size'], show: 'width', part: '.plx-search-result__separator .plx-icon', cat: 'icon' },
        { id: 'tc', label: 'Title color', css: ['color'], part: TITLE, cat: 'color' },
        { id: 'tfs', label: 'Title size', css: ['font-size'], part: TITLE, cat: 'font-size' },
        { id: 'tfw', label: 'Title weight', css: ['font-weight'], part: TITLE, cat: 'font-weight' },
        { id: 'mw', label: 'Match weight', css: ['font-weight'], part: '.plx-search-result__match', cat: 'font-weight' },
        { id: 'sc', label: 'Snippet color', css: ['color'], part: SNIP, cat: 'color' },
        { id: 'sfs', label: 'Snippet size', css: ['font-size'], part: SNIP, cat: 'font-size' },
        { id: 'mc', label: 'Meta color', css: ['color'], part: META, cat: 'color' },
        { id: 'mfs', label: 'Meta size', css: ['font-size'], part: META, cat: 'font-size' }
      ],
      token: function (id, size, variant, state, content) {
        var path = content === 'path' && variant !== 'person', hi = content === 'highlight';
        switch (id) {
          case 'hb': return state === 'hover' ? SR('hover-background') : null;
          case 'sb': return state === 'selected' ? SR('selected-background') : null;
          case 'fo': return state === 'focus' ? SR('focus-outline-color') : null;
          case 'fow': return state === 'focus' ? SR('focus-outline-width') : null;
          case 'pc': return path ? SR('path-text') : null;
          case 'pfs': return path ? SR('path-font-size') : null;
          case 'pg': return path ? SR('path-gap') : null;
          case 'ps': return path ? SR('separator-size') : null;
          case 'mw': return hi ? SR('match-font-weight') : null;
          default: return { gap: SR('gap'), py: SR('padding-block'), ip: SR('interactive-padding-inline'), lc: SR('border-bottom-color'), lw: SR('border-bottom-width'), rg: SR('text-row-gap'),
            tc: SR('title-text'), tfs: SR('title-font-size'), tfw: SR('title-font-weight'), sc: SR('snippet-text'), sfs: SR('snippet-font-size'), mc: SR('meta-text'), mfs: SR('meta-font-size') }[id] || null;
        }
      },
      reach: function (full) { return /-hover-|-selected-|-focus-/.test(full) ? 'every search result that opens' : 'every search result'; }, every: 'every search result',
      html: function (variant, size, state, extraCls, ui) {
        var content = (ui && ui.content) || 'highlight';
        return '<div class="ds-w08c-lab"><ul class="plx-search-result-group__list" aria-label="Search results">' + resultHtml(variant, { state: state, content: content, cls: extraCls })
          + resultHtml(variant === 'file' ? 'page' : 'file', { content: content }) + '</ul></div>';
      },
      labelSelector: TITLE,
      parts: { gap: 'A', py: 'A', ip: 'A', lc: 'B', lw: 'B', hb: 'C', sb: 'C', fo: 'C', fow: 'C', rg: 'D', pc: 'E', pfs: 'E', pg: 'E', ps: 'E', tc: 'F', tfs: 'F', tfw: 'F', mw: 'F', sc: 'G', sfs: 'G', mc: 'H', mfs: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: null, side: 'bottom' }, C: { part: null, side: 'right' }, D: { part: '.plx-search-result__text', side: 'left' }, E: { part: PATH, side: 'top' }, F: { part: TITLE, side: 'right' }, G: { part: SNIP, side: 'right' }, H: { part: META, side: 'bottom' } },
      sections: [['Row', ['gap', 'py', 'ip', 'lc', 'lw']], ['States', ['hb', 'sb', 'fo', 'fow']], ['Path', ['rg', 'pc', 'pfs', 'pg', 'ps']], ['Title', ['tc', 'tfs', 'tfw', 'mw']], ['Snippet and meta', ['sc', 'sfs', 'mc', 'mfs']]],
      matrixLabel: 'Search result values by kind and state', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Kinds and states · ' + HEAD
    });

    // ---- Search result groups (<SearchResultGroup>, div.plx-search-result-group): the heading with its count, the
    // results, and the footer (a link to all, a button that shows more, or nothing)
    var SG = function (n) { return 'plx-comp-search-result-group-' + n; };
    DS.registerLab('search-result-group', {
      name: 'Search result groups', title: 'Plenix search result group', file: 'platform/components/SearchResult/search-result.css', compPrefix: /^plx-comp-search-result-group-/,
      store: 'plenix-search-result-group-lab-tokens', sizes: [['default', 'Default', '.plx-search-result-group']],
      variants: [['link', 'A link to all (default)'], ['button', 'Show more in place'], ['none', 'Heading only']],
      states: [['default', 'Default']], content: [['files', 'Two files of twelve']],
      labels: { size: 'Size', variant: 'Footer', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'link', state: 'default', content: 'files' },
      props: [
        { id: 'gap', label: 'Space between heading, results and footer', css: ['row-gap'], cat: 'space' },
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-search-result-group__count', cat: 'color' },
        { id: 'cf', label: 'Count font (data)', css: ['font-family'], part: '.plx-search-result-group__count', cat: 'font' },
        { id: 'cm', label: 'Space before the count', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-search-result-group__count', cat: 'space' }
      ],
      token: function (id) { return { gap: SG('gap'), cc: SG('count-text'), cf: SG('count-font-family'), cm: SG('count-margin-inline-start') }[id] || null; },
      reach: function () { return 'every search result group'; }, every: 'every search result group',
      html: function (variant, size, state, extraCls) {
        var foot = variant === 'link' ? '<div class="plx-search-result-group__more"><a href="#" tabindex="-1" class="plx-link plx-link--standalone">Show all 12 files</a></div>'
          : variant === 'button' ? '<div class="plx-search-result-group__more"><button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-sm"><span class="plx-button__label">Show 10 more</span></button></div>' : '';
        return '<div class="ds-w08c-lab"><div class="plx-search-result-group' + ex(extraCls) + '"><h3 class="plx-section-heading plx-section-heading--level-3"><span class="plx-section-heading__label">Files'
          + '<span class="plx-count plx-count--plain plx-search-result-group__count">12</span></span></h3><ul class="plx-search-result-group__list">'
          + resultHtml('file', { content: 'highlight' }) + resultHtml('file', { content: 'path' }) + '</ul>' + foot + '</div></div>';
      },
      labelSelector: '.plx-section-heading__label',
      parts: { gap: 'A', cc: 'B', cf: 'B', cm: 'B' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-search-result-group__count', side: 'right' } },
      sections: [['Group', ['gap']], ['Count', ['cc', 'cf', 'cm']]],
      matrixLabel: 'Search result group values by footer', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Footers · ' + HEAD
    });

    // ---- Timeline (<Timeline>, ol.plx-timeline): three events (the line runs from the first two markers; the last has
    // none), vertical, horizontal, with icons or alternating
    var TL = function (n) { return 'plx-comp-timeline-' + n; };
    var EV = [['Oct 2, 2026', '2026-10-02', 'Project created', 'Maya Chen set up the project.', 'folder-add'], ['Oct 6, 2026', '2026-10-06', 'Quotes uploaded', 'Three cabinet quotes.', 'upload'],
      ['Oct 9, 2026', '2026-10-09', 'Quote approved', 'Luis Herrera approved the second quote.', 'circle-check']];
    var MARK = '.plx-timeline__marker', DOT = '.plx-timeline__dot', ITEM = '.plx-timeline__item', TIME = '.plx-timeline__time', TTL = '.plx-timeline__title', DESC = '.plx-timeline__description';
    DS.registerLab('timeline', {
      name: 'Timeline', title: 'Plenix timeline', file: 'platform/components/Timeline/timeline.css', compPrefix: /^plx-comp-timeline-/,
      store: 'plenix-timeline-lab-tokens', sizes: [['default', 'Default', '.plx-timeline']],
      variants: [['vertical', 'Vertical (default)'], ['horizontal', 'Horizontal'], ['icons', 'With icons'], ['alternate', 'Alternating']],
      states: [['default', 'Default'], ['focus', 'Focus (horizontal: the scrolling row)']], content: [['events', 'Three events']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'vertical', state: 'default', content: 'events' },
      props: [
        { id: 'ig', label: 'Space between events', css: ['padding-block-end'], show: 'padding-bottom', part: ITEM, cat: 'space' },
        { id: 'cg', label: 'Space between marker and content', css: ['column-gap'], part: ITEM, cat: 'space' },
        { id: 'hw', label: 'Event width (horizontal)', css: ['inline-size'], show: 'width', part: ITEM, cat: 'size' },
        { id: 'ms', label: 'Marker size', css: ['inline-size'], show: 'width', part: MARK, cat: 'size' },
        { id: 'mr', label: 'Marker corners', css: CORNERS, show: 'border-top-left-radius', part: DOT, cat: 'radius' },
        { id: 'ds', label: 'Circle size', css: ['inline-size'], show: 'width', part: DOT, cat: 'size' },
        { id: 'db', label: 'Circle fill', css: ['background-color'], part: DOT, cat: 'color' },
        { id: 'dbc', label: 'Circle ring color', css: BORDERS, show: 'border-top-color', part: DOT, cat: 'color' },
        { id: 'dbw', label: 'Circle ring width', css: WIDTHS, show: 'border-top-width', part: DOT, cat: 'border-width' },
        { id: 'ib', label: 'Icon circle fill', css: ['background-color'], part: MARK, cat: 'color' },
        { id: 'ibc', label: 'Icon circle border color', css: BORDERS, show: 'border-top-color', part: MARK, cat: 'color' },
        { id: 'ibw', label: 'Icon circle border width', css: WIDTHS, show: 'border-top-width', part: MARK, cat: 'border-width' },
        { id: 'ir', label: 'Icon circle corners', css: CORNERS, show: 'border-top-left-radius', part: MARK, cat: 'radius' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: MARK, cat: 'color' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: MARK + ' .plx-icon', cat: 'icon' },
        { id: 'lc', label: 'Line color', css: ['background-color'], part: ITEM, pseudo: '::before', cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['inline-size'], show: 'width', part: ITEM, pseudo: '::before', cat: 'border-width' },
        { id: 'lh', label: 'Line width (across)', css: ['block-size'], show: 'height', part: ITEM, pseudo: '::before', cat: 'border-width' },
        { id: 'rg', label: 'Space between the lines', css: ['row-gap'], part: '.plx-timeline__content', cat: 'space' },
        { id: 'tc', label: 'Time color', css: ['color'], part: TIME, cat: 'color' },
        { id: 'tf', label: 'Time font (data)', css: ['font-family'], part: TIME, cat: 'font' },
        { id: 'tfs', label: 'Time size', css: ['font-size'], part: TIME, cat: 'font-size' },
        { id: 'hg', label: 'Space before the badge', css: ['column-gap'], part: '.plx-timeline__heading', cat: 'space' },
        { id: 'ttc', label: 'Title color', css: ['color'], part: TTL, cat: 'color' },
        { id: 'ttfs', label: 'Title size', css: ['font-size'], part: TTL, cat: 'font-size' },
        { id: 'ttfw', label: 'Title weight', css: ['font-weight'], part: TTL, cat: 'font-weight' },
        { id: 'dc', label: 'Description color', css: ['color'], part: DESC, cat: 'color' },
        { id: 'dfs', label: 'Description size', css: ['font-size'], part: DESC, cat: 'font-size' },
        { id: 'fo', label: 'Focus ring color', css: ['outline-color'], cat: 'color' },
        { id: 'fow', label: 'Focus ring width', css: ['outline-width'], cat: 'border-width' },
        { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var across = variant === 'horizontal', icons = variant === 'icons';
        switch (id) {
          case 'ig': return across ? null : TL('item-gap');
          case 'hw': return across ? TL('horizontal-item-width') : null;
          case 'mr': return icons ? null : TL('marker-radius');
          case 'ds': return icons ? null : TL('dot-size');
          case 'db': return icons ? null : TL('dot-background');
          case 'dbc': return icons ? null : TL('dot-border-color');
          case 'dbw': return icons ? null : TL('dot-border-width');
          case 'ib': return icons ? TL('icon-marker-background') : null;
          case 'ibc': return icons ? TL('icon-marker-border-color') : null;
          case 'ibw': return icons ? TL('icon-marker-border-width') : null;
          case 'ir': return icons ? TL('marker-radius') : null;
          case 'ic': return icons ? TL('icon-color') : null;
          case 'is': return icons ? TL('icon-size') : null;
          case 'lw': return across ? null : TL('line-width');
          case 'lh': return across ? TL('line-width') : null;
          case 'fo': return across && state === 'focus' ? TL('focus-outline-color') : null;
          case 'fow': return across && state === 'focus' ? TL('focus-outline-width') : null;
          case 'fof': return across && state === 'focus' ? TL('focus-outline-offset') : null;
          default: return { cg: TL('column-gap'), ms: TL('marker-size'), lc: TL('line-color'), rg: TL('content-row-gap'), tc: TL('time-text'), tf: TL('time-font-family'), tfs: TL('time-font-size'), hg: TL('heading-gap'),
            ttc: TL('title-text'), ttfs: TL('title-font-size'), ttfw: TL('title-font-weight'), dc: TL('description-text'), dfs: TL('description-font-size') }[id] || null;
        }
      },
      reach: function (full) { return /horizontal|focus/.test(full) ? 'every horizontal timeline' : /icon/.test(full) ? 'every timeline with icons' : 'every timeline'; }, every: 'every timeline',
      html: function (variant, size, state, extraCls) {
        var across = variant === 'horizontal', icons = variant === 'icons';
        var cls = 'plx-timeline' + (across ? ' plx-timeline--horizontal' : '') + (variant === 'alternate' ? ' plx-timeline--alternate' : '') + (across ? foc(state) : '') + ex(extraCls);
        var items = EV.map(function (e, i) {
          return '<li class="plx-timeline__item"><span class="plx-timeline__marker' + (icons ? ' plx-timeline__marker--icon' : '') + '" aria-hidden="true">' + (icons ? icon(e[4]) : '<span class="plx-timeline__dot"></span>') + '</span>'
            + '<div class="plx-timeline__content"><time class="plx-timeline__time" datetime="' + e[1] + '">' + e[0] + '</time><div class="plx-timeline__heading"><span class="plx-timeline__title">' + e[2] + '</span>'
            + (i === 2 ? '<span class="plx-timeline__badge"><span class="plx-badge plx-badge--success">' + icon('check', null).replace('plx-icon ', 'plx-icon plx-badge__icon ') + 'Approved</span></span>' : '') + '</div>'
            + '<p class="plx-timeline__description">' + e[3] + '</p></div></li>';
        }).join('');
        return '<div class="ds-w08c-lab' + (across || variant === 'alternate' ? ' ds-w08c-lab--wide' : '') + '"><ol class="' + cls + '" aria-label="Project history"' + (across ? ' tabindex="-1"' : '') + '>' + items + '</ol></div>';
      },
      labelSelector: TTL,
      parts: { ig: 'A', cg: 'A', hw: 'A', ms: 'B', mr: 'B', ds: 'B', db: 'B', dbc: 'B', dbw: 'B', ib: 'B', ibc: 'B', ibw: 'B', ir: 'B', ic: 'B', is: 'B', lc: 'C', lw: 'C', lh: 'C', rg: 'D', tc: 'E', tf: 'E', tfs: 'E', hg: 'F', ttc: 'F', ttfs: 'F', ttfw: 'F', dc: 'G', dfs: 'G', fo: 'H', fow: 'H', fof: 'H' },
      anchors: { A: { part: ITEM, side: 'left' }, B: { part: MARK, side: 'left' }, C: { part: ITEM, side: 'bottom' }, D: { part: '.plx-timeline__content', side: 'right' }, E: { part: TIME, side: 'top' }, F: { part: TTL, side: 'right' }, G: { part: DESC, side: 'bottom' }, H: { part: null, side: 'right' } },
      sections: [['Events', ['ig', 'cg', 'hw']], ['Marker', ['ms', 'mr', 'ds', 'db', 'dbc', 'dbw', 'ib', 'ibc', 'ibw', 'ir', 'ic', 'is']], ['Line', ['lc', 'lw', 'lh']], ['Content', ['rg', 'tc', 'tf', 'tfs', 'hg', 'ttc', 'ttfs', 'ttfw', 'dc', 'dfs']], ['Focus', ['fo', 'fow', 'fof']]],
      matrixLabel: 'Timeline values by variant', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Resource list (<ResourceList>, div.plx-resource-list): the header (selectable), a group heading (grouped) and
    // three rows; the first row takes the state
    var RS = function (n) { return 'plx-comp-resource-list-' + n; };
    var ROWS = [['Kitchen renovation', 'Cabinet quotes and layouts', 'folder', 'Maya Chen', 'MC', '12', '10/12/2026'], ['Brand kit', 'Logos, colors and type', 'image-b', 'Luis Herrera', 'LH', '48', '10/09/2026'],
      ['Quarterly report', 'Figures and charts', 'doc-text', 'Ana Ruiz', 'AR', '7', '10/01/2026']];
    var rowHtml = function (r, i, variant, state) {
      var on = i === 0, sel = variant === 'selectable', avatarRow = variant === 'avatar', checked = sel && (on ? state === 'selected' : i === 1);
      var name = avatarRow ? r[3] : r[0], desc = avatarRow ? r[0] : r[1];
      return '<li class="plx-resource-list__item is-interactive' + (checked || (on && state === 'selected') ? ' is-selected' : '') + (on ? hov(state) : '') + '">'
        + (sel ? '<span class="plx-resource-list__select"><label class="plx-check"><input type="checkbox" tabindex="-1" class="plx-check__input" aria-label="Select ' + name + '"' + (checked ? ' checked' : '') + '></label></span>' : '')
        + '<span class="plx-resource-list__media">' + (avatarRow ? avatar(r[4]) : thumb(r[2])) + '</span>'
        + '<span class="plx-resource-list__text"><span class="plx-resource-list__name"><a href="#" tabindex="-1" class="plx-resource-list__opener' + (on ? foc(state) : '') + '">' + name + '</a></span>'
        + '<span class="plx-resource-list__description">' + desc + '</span></span>'
        + '<span class="plx-resource-list__meta">' + (variant === 'actions' || avatarRow ? data(r[6]) : data(r[5]) + ' files') + '</span>'
        + (variant === 'actions' ? '<span class="plx-resource-list__actions"><button type="button" tabindex="-1" class="plx-button plx-button--ghost plx-button--size-xs plx-button--icon-only" aria-label="More actions for ' + name + '">' + icon('more').replace('plx-icon ', 'plx-icon plx-button__icon ') + '</button></span>' : '')
        + '</li>';
    };
    var NAME = '.plx-resource-list__name', RDESC = '.plx-resource-list__description', RMETA = '.plx-resource-list__meta', RITEM = '.plx-resource-list__item', HEADER = '.plx-resource-list__header';
    DS.registerLab('resource-list', {
      name: 'Resource list', title: 'Plenix resource list', file: 'platform/patterns/ResourceList/resource-list.css', compPrefix: /^plx-comp-resource-list-/,
      store: 'plenix-resource-list-lab-tokens', sizes: [['default', 'Default', '.plx-resource-list']],
      variants: [['media', 'Media (thumbnails)'], ['avatar', 'Avatar'], ['selectable', 'Selectable'], ['actions', 'With actions'], ['grouped', 'Grouped']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['selected', 'Selected']], content: [['rows', 'Three records']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'selectable', state: 'default', content: 'rows' },
      props: [
        { id: 'gap', label: 'Space between bar, header and groups', css: ['row-gap'], cat: 'space' },
        { id: 'hh', label: 'Header height', css: ['min-block-size'], show: 'min-height', part: HEADER, cat: 'size' },
        { id: 'hlc', label: 'Line under the header', css: ['border-bottom-color'], part: HEADER, cat: 'color' },
        { id: 'hlw', label: 'Header line width', css: ['border-bottom-width'], part: HEADER, cat: 'border-width' },
        { id: 'cc', label: 'Count color', css: ['color'], part: '.plx-resource-list__count', cat: 'color' },
        { id: 'cfs', label: 'Count size', css: ['font-size'], part: '.plx-resource-list__count', cat: 'font-size' },
        { id: 'gg', label: 'Space under a group heading', css: ['row-gap'], part: '.plx-resource-list__group', cat: 'space' },
        { id: 'gcf', label: 'Group count font (data)', css: ['font-family'], part: '.plx-resource-list__group-count', cat: 'font' },
        { id: 'gcm', label: 'Space before the group count', css: ['margin-inline-start'], show: 'margin-left', part: '.plx-resource-list__group-count', cat: 'space' },
        { id: 'ig', label: 'Space between the row’s parts', css: ['column-gap'], part: RITEM, cat: 'space' },
        { id: 'ih', label: 'Row height (least)', css: ['min-block-size'], show: 'min-height', part: RITEM, cat: 'size' },
        { id: 'ipy', label: 'Row padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: RITEM, cat: 'space' },
        { id: 'ipx', label: 'Row inset left & right (its fill)', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', part: RITEM, cat: 'space' },
        { id: 'ilc', label: 'Line between rows', css: ['border-bottom-color'], part: RITEM, cat: 'color' },
        { id: 'ilw', label: 'Row line width', css: ['border-bottom-width'], part: RITEM, cat: 'border-width' },
        { id: 'hb', label: 'Hover fill', css: ['background-color'], part: RITEM, cat: 'color' },
        { id: 'sb', label: 'Selected fill', css: ['background-color'], part: RITEM, cat: 'color' },
        { id: 'fo', label: 'Focus ring color', css: ['outline-color'], part: RITEM, cat: 'color' },
        { id: 'fow', label: 'Focus ring width', css: ['outline-width'], part: RITEM, cat: 'border-width' },
        { id: 'nc', label: 'Name color', css: ['color'], part: NAME, cat: 'color' },
        { id: 'nfs', label: 'Name size', css: ['font-size'], part: NAME, cat: 'font-size' },
        { id: 'nfw', label: 'Name weight', css: ['font-weight'], part: NAME, cat: 'font-weight' },
        { id: 'dc', label: 'Description color', css: ['color'], part: RDESC, cat: 'color' },
        { id: 'dfs', label: 'Description size', css: ['font-size'], part: RDESC, cat: 'font-size' },
        { id: 'mc', label: 'Details color', css: ['color'], part: RMETA, cat: 'color' },
        { id: 'mfs', label: 'Details size', css: ['font-size'], part: RMETA, cat: 'font-size' },
        { id: 'ag', label: 'Space between actions', css: ['column-gap'], part: '.plx-resource-list__actions', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var sel = variant === 'selectable', grp = variant === 'grouped';
        switch (id) {
          case 'hh': return sel ? RS('header-min-height') : null;
          case 'hlc': return sel ? RS('header-border-bottom-color') : null;
          case 'hlw': return sel ? RS('header-border-bottom-width') : null;
          case 'cc': return sel ? RS('count-text') : null;
          case 'cfs': return sel ? RS('count-font-size') : null;
          case 'gg': return grp ? RS('group-gap') : null;
          case 'gcf': return grp ? RS('group-count-font-family') : null;
          case 'gcm': return grp ? RS('group-count-margin-inline-start') : null;
          case 'hb': return state === 'hover' ? RS('item-hover-background') : null;
          case 'sb': return state === 'selected' ? RS('item-selected-background') : null;
          case 'fo': return state === 'focus' ? RS('item-focus-outline-color') : null;
          case 'fow': return state === 'focus' ? RS('item-focus-outline-width') : null;
          case 'ag': return variant === 'actions' ? RS('actions-gap') : null;
          default: return { gap: RS('gap'), ig: RS('item-gap'), ih: RS('item-min-height'), ipy: RS('item-padding-block'), ipx: RS('item-interactive-padding-inline'), ilc: RS('item-border-bottom-color'), ilw: RS('item-border-bottom-width'),
            nc: RS('name-text'), nfs: RS('name-font-size'), nfw: RS('name-font-weight'), dc: RS('description-text'), dfs: RS('description-font-size'), mc: RS('meta-text'), mfs: RS('meta-font-size') }[id] || null;
        }
      },
      reach: function (full) { return /header|count-/.test(full) ? 'every selectable resource list' : /group/.test(full) ? 'every grouped resource list' : 'every resource list'; }, every: 'every resource list',
      html: function (variant, size, state, extraCls) {
        var sel = variant === 'selectable', rows = ROWS.map(function (r, i) { return rowHtml(r, i, variant, state); }).join('');
        var header = sel ? '<div class="plx-resource-list__header"><span class="plx-resource-list__select"><label class="plx-check"><input type="checkbox" tabindex="-1" class="plx-check__input" aria-label="Select all 3 projects"></label></span>'
          + '<span class="plx-resource-list__count">' + data(state === 'selected' ? '2' : '1') + ' of ' + data('3') + ' selected</span></div>' : '';
        var body = variant === 'grouped' ? '<div class="plx-resource-list__group"><h3 class="plx-section-heading plx-section-heading--level-3 plx-resource-list__heading"><span class="plx-section-heading__label">Work'
          + '<span class="plx-count plx-count--plain plx-resource-list__group-count">3</span></span></h3><ul class="plx-resource-list__list">' + rows + '</ul></div>'
          : '<ul class="plx-resource-list__list" aria-label="Projects">' + rows + '</ul>';
        return '<div class="ds-w08c-lab ds-w08c-lab--wide"><div class="plx-resource-list' + ex(extraCls) + '">' + header + body + '</div></div>';
      },
      labelSelector: NAME,
      parts: { gap: 'A', hh: 'B', hlc: 'B', hlw: 'B', cc: 'B', cfs: 'B', gg: 'C', gcf: 'C', gcm: 'C', ig: 'D', ih: 'D', ipy: 'D', ipx: 'D', ilc: 'D', ilw: 'D', hb: 'E', sb: 'E', fo: 'E', fow: 'E', nc: 'F', nfs: 'F', nfw: 'F', dc: 'G', dfs: 'G', mc: 'H', mfs: 'H', ag: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: HEADER, side: 'top' }, C: { part: '.plx-resource-list__group-count', side: 'top' }, D: { part: RITEM, side: 'left' }, E: { part: RITEM, side: 'right' }, F: { part: NAME, side: 'top' }, G: { part: RDESC, side: 'bottom' }, H: { part: RMETA, side: 'right' } },
      sections: [['List', ['gap']], ['Header', ['hh', 'hlc', 'hlw', 'cc', 'cfs']], ['Group', ['gg', 'gcf', 'gcm']], ['Row', ['ig', 'ih', 'ipy', 'ipx', 'ilc', 'ilw']], ['States', ['hb', 'sb', 'fo', 'fow']], ['Text', ['nc', 'nfs', 'nfw', 'dc', 'dfs']], ['Details and actions', ['mc', 'mfs', 'ag']]],
      matrixLabel: 'Resource list values by variant and state', matrixColumnWidth: '--plx-ref-size-600px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Expandable card (<Card expandable>): the card lab (data-labs.js) gains the Expandable variant, and the leaf has its
    // own lab: the toggle at the end of the header, open (the body under the meta) or closed (its summary)
    var CD = function (n) { return 'plx-comp-card-' + n; };
    var TOGGLE = '.plx-card__toggle';
    var TOGGLE_PROPS = [
      { id: 'tgh', label: 'Toggle height', css: ['block-size'], show: 'height', part: TOGGLE, cat: 'control-height' },
      { id: 'tgw', label: 'Toggle width', css: ['inline-size'], show: 'width', part: TOGGLE, cat: 'control-height' },
      { id: 'tgr', label: 'Toggle corners', css: CORNERS, show: 'border-top-left-radius', part: TOGGLE, cat: 'radius' },
      { id: 'tgc', label: 'Chevron color', css: ['color'], part: TOGGLE, cat: 'color' },
      { id: 'tghb', label: 'Toggle hover fill', css: ['background-color'], part: TOGGLE, cat: 'color' },
      { id: 'tgfo', label: 'Toggle focus ring color', css: ['outline-color'], part: TOGGLE, cat: 'color' },
      { id: 'tgfw', label: 'Toggle focus ring width', css: ['outline-width'], part: TOGGLE, cat: 'border-width' },
      { id: 'tgfof', label: 'Toggle focus ring offset', css: ['outline-offset'], part: TOGGLE, cat: 'space' }
    ];
    var toggleToken = function (id, state) {
      switch (id) {
        case 'tgh': return CD('toggle-height');
        case 'tgw': return CD('toggle-width');
        case 'tgr': return CD('toggle-radius');
        case 'tgc': return state === 'hover' ? CD('toggle-hover-text') : CD('toggle-text');
        case 'tghb': return state === 'hover' ? CD('toggle-hover-background') : null;
        case 'tgfo': return state === 'focus' ? CD('toggle-focus-outline-color') : null;
        case 'tgfw': return state === 'focus' ? CD('toggle-focus-outline-width') : null;
        case 'tgfof': return state === 'focus' ? CD('toggle-focus-outline-offset') : null;
        default: return null;
      }
    };
    var expandableHtml = function (state, extraCls, closed) {
      var sel = state === 'selected';
      return '<div class="ds-data-box ds-data-box--card"><article class="plx-card is-expandable' + (sel ? ' is-selected' : '') + (closed ? ' is-collapsed' : '') + ex(extraCls) + '">'
        + '<div class="plx-card__header"><h3 class="plx-card__title"><span class="plx-card__opener">Kitchen Renovation</span></h3>'
        + '<button type="button" tabindex="-1" class="plx-card__toggle' + hov(state) + foc(state) + '" aria-expanded="' + !closed + '" aria-label="' + (closed ? 'Expand' : 'Collapse') + ' Kitchen Renovation">' + icon('chevron-down') + '</button></div>'
        + '<div class="plx-card__meta">Personal · 12 files</div><div class="plx-card__body"' + (closed ? ' hidden' : '') + '>Cabinet quotes and layouts</div></article></div>';
    };
    var CARD = DS.labs && DS.labs.card;
    if (CARD) {
      var mine = function (id) { return TOGGLE_PROPS.some(function (p) { return p.id === id; }); };
      var token = function (id, size, variant, state, content) {
        if (variant === 'expandable') return mine(id) ? toggleToken(id, state) : CARD.token(id, size, 'static', state, content);
        return mine(id) ? null : CARD.token(id, size, variant, state, content);
      };
      var html = function (variant, size, state, extraCls, ui) { return variant === 'expandable' ? expandableHtml(state, extraCls, ui && ui.content === 'closed') : CARD.html(variant, size, state, extraCls, ui); };
      var parts = Object.assign({}, CARD.parts, { tgh: 'H', tgw: 'H', tgr: 'H', tgc: 'H', tghb: 'H', tgfo: 'H', tgfw: 'H', tgfof: 'H' });
      var anchors = Object.assign({}, CARD.anchors, { H: { part: TOGGLE, side: 'right' } });
      var reach = function (full) { return /card-toggle-/.test(full) ? 'every expandable card' : CARD.reach(full); };
      DS.registerLab('card', Object.assign({}, CARD, { variants: CARD.variants.concat([['expandable', 'Expandable']]), props: CARD.props.concat(TOGGLE_PROPS), token: token, html: html,
        parts: parts, anchors: anchors, sections: CARD.sections.concat([['Toggle (expandable)', ['tgh', 'tgw', 'tgr', 'tgc', 'tghb', 'tgfo', 'tgfw', 'tgfof']]]), reach: reach }));
      DS.registerLab('expandable-card', Object.assign({}, DS.labs.card, { name: 'Expandable card', title: 'Plenix expandable card', store: 'plenix-expandable-card-lab-tokens',
        variants: [['expandable', 'Expandable']], content: [['open', 'Open'], ['closed', 'Closed (its summary)']], labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
        defaults: { size: 'default', variant: 'expandable', state: 'default', content: 'open' }, every: 'every expandable card',
        matrixLabel: 'Expandable card values by state', statesHead: 'States · ' + HEAD }));
    }
  })();
}
