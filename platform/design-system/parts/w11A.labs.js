/* Plenix design system · library part w11A: the labs of wave 11, lane A. File, FileRow, the Auth frame and its sign-in
   form, SessionTimeout, RoleManager and ConnectedAccounts, each drawn in place with the markup the component renders, so
   every variant and state shows with the one --plx-comp-* token behind each value. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name, cls) { return DS.icon(name, cls); };
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDERS = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    var WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var btn = function (o) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--' + (o.variant || 'secondary') + (o.size ? ' plx-button--size-' + o.size : '') + (o.iconOnly ? ' plx-button--icon-only' : '') + ex(o.cls) + '"'
        + (o.label ? ' aria-label="' + o.label + '"' : '') + '>' + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + (o.text ? '<span class="plx-button__label">' + o.text + '</span>' : '') + '</button>';
    };
    var badge = function (tone, ic, text) { return '<span class="plx-badge plx-badge--' + tone + '">' + icon(ic, 'plx-badge__icon') + text + '</span>'; };
    var tile = function (ic) { return '<span class="plx-icon-tile plx-icon-tile--md plx-icon-tile--gray plx-connected-accounts__tile" aria-hidden="true">' + icon(ic, 'plx-icon--size-md plx-icon-tile__icon') + '</span>'; };
    var check = function (label, on) { return '<label class="plx-check"><input type="checkbox" tabindex="-1" class="plx-check__input"' + (on ? ' checked' : '') + (label ? '' : ' aria-label="Select"') + '>' + (label ? '<span class="plx-check__text"><span class="plx-check__label">' + label + '</span></span>' : '') + '</label>'; };
    var field = function (label, control, hint) {
      return '<div class="plx-field plx-field--stacked"><div class="plx-field__head"><label class="plx-field__label">' + label + '</label></div><div class="plx-field__control">' + control + '</div>'
        + (hint ? '<div class="plx-field__description">' + hint + '</div>' : '') + '</div>';
    };
    var input = function (type, value) { return '<input class="plx-input" tabindex="-1" type="' + type + '" value="' + (value || '') + '">'; };

    // ---- File (<File>): a line or a chip; a file or a folder; its type icon; its facts
    var FL = function (n) { return 'plx-comp-file-' + n; };
    var fileHtml = function (o, extraCls) {
      var dot = o.name.lastIndexOf('.'), folder = o.kind === 'folder';
      var base = !folder && dot > 0 ? o.name.slice(0, dot) : o.name, ext = !folder && dot > 0 ? o.name.slice(dot) : '';
      return '<span class="plx-file plx-file--' + (folder ? 'folder' : 'file') + ' plx-file--' + (o.chip ? 'chip' : 'line') + ex(extraCls) + '">'
        + '<span class="plx-file__icon" aria-hidden="true">' + icon(o.icon || (folder ? 'folder' : 'file-pdf')) + '</span><span class="plx-file__text">'
        + '<button type="button" tabindex="-1" class="plx-file__name' + (folder ? '' : ' plx-file__name--data') + ex(o.state) + '"><span class="plx-file__base">' + base + '</span>' + (ext ? '<span class="plx-file__ext">' + ext + '</span>' : '') + '</button>'
        + (o.facts ? '<span class="plx-file__meta"><span class="plx-file__facts">' + o.facts + '</span></span>' : '') + '</span></span>';
    };
    DS.registerLab('file', {
      name: 'File', title: 'Plenix file', file: 'platform/components/File/file.css', compPrefix: /^plx-comp-file-/,
      store: 'plenix-file-lab-tokens', sizes: [['default', 'Default', '.plx-file']],
      variants: [['file', 'File (default)'], ['folder', 'Folder'], ['line', 'Line (default)'], ['chip', 'Chip'], ['types', 'By type icon'], ['size', 'With size']],
      states: [['default', 'Default'], ['hover', 'Hover (a name that opens it)'], ['focus', 'Focus']],
      content: [['pdf', 'A PDF']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'file', state: 'default', content: 'pdf' },
      props: [
        { id: 'g', label: 'Gap (icon to text)', css: ['column-gap'], cat: 'space' },
        { id: 'is', label: 'Icon size', css: ['inline-size'], show: 'width', part: '.plx-file__icon .plx-icon', cat: 'icon' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-file__icon', cat: 'color' },
        { id: 'tg', label: 'Gap (name to facts)', css: ['column-gap'], part: '.plx-file__text', cat: 'space' },
        { id: 'nc', label: 'Name color', css: ['color'], part: '.plx-file__name', cat: 'color' },
        { id: 'nf', label: 'Name font', css: ['font-family'], part: '.plx-file__name', cat: 'font' },
        { id: 'ns', label: 'Name size', css: ['font-size'], part: '.plx-file__name', cat: 'font-size' },
        { id: 'nw', label: 'Name weight', css: ['font-weight'], part: '.plx-file__name', cat: 'font-weight' },
        { id: 'nl', label: 'Name line height', css: ['line-height'], part: '.plx-file__name', cat: 'line-height' },
        { id: 'nr', label: 'Name corners (hover fill, focus ring)', css: CORNERS, show: 'border-top-left-radius', part: '.plx-file__name', cat: 'radius' },
        { id: 'hb', label: 'Name hover fill', css: ['background-color'], part: '.plx-file__name', cat: 'color' },
        { id: 'oc', label: 'Focus ring color', css: ['outline-color'], part: '.plx-file__name', cat: 'color' },
        { id: 'ow', label: 'Focus ring width', css: ['outline-width'], part: '.plx-file__name', cat: 'border-width' },
        { id: 'oo', label: 'Focus ring offset', css: ['outline-offset'], part: '.plx-file__name', cat: 'space' },
        { id: 'mc', label: 'Facts color', css: ['color'], part: '.plx-file__meta', cat: 'color' },
        { id: 'mf', label: 'Facts font', css: ['font-family'], part: '.plx-file__facts', cat: 'font' },
        { id: 'ms', label: 'Facts size', css: ['font-size'], part: '.plx-file__meta', cat: 'font-size' },
        { id: 'ml', label: 'Facts line height', css: ['line-height'], part: '.plx-file__meta', cat: 'line-height' },
        { id: 'cb', label: 'Chip fill', css: ['background-color'], cat: 'color' },
        { id: 'cc', label: 'Chip border color', css: BORDERS, show: 'border-top-color', cat: 'color' },
        { id: 'cw', label: 'Chip border width', css: WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'cr', label: 'Chip corners', css: CORNERS, show: 'border-top-left-radius', cat: 'radius' },
        { id: 'ch', label: 'Chip least height', css: ['min-block-size'], show: 'min-height', cat: 'size' },
        { id: 'cp', label: 'Chip padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var folder = variant === 'folder', chip = variant === 'chip', facts = variant !== 'types';
        switch (id) {
          case 'g': return FL('gap');
          case 'is': return FL('icon-size');
          case 'ic': return FL(folder ? 'folder-icon-color' : 'icon-color');
          case 'tg': return facts ? FL('text-gap') : null;
          case 'nc': return FL('name-text');
          case 'nf': return FL(folder ? 'name-font-family' : 'name-data-font-family');
          case 'ns': return FL('name-font-size');
          case 'nw': return FL('name-font-weight');
          case 'nl': return FL('name-line-height');
          case 'nr': return FL('name-radius');
          case 'hb': return state === 'hover' ? FL('name-hover-background') : null;
          case 'oc': return state === 'focus' ? FL('focus-outline-color') : null;
          case 'ow': return state === 'focus' ? FL('focus-outline-width') : null;
          case 'oo': return state === 'focus' ? FL('focus-outline-offset') : null;
          case 'mc': return facts ? FL('meta-text') : null;
          case 'mf': return facts ? FL('meta-font-family') : null;
          case 'ms': return facts ? FL('meta-font-size') : null;
          case 'ml': return facts ? FL('meta-line-height') : null;
          case 'cb': return chip ? FL('chip-background') : null;
          case 'cc': return chip ? FL('chip-border-color') : null;
          case 'cw': return chip ? FL('chip-border-width') : null;
          case 'cr': return chip ? FL('chip-radius') : null;
          case 'ch': return chip ? FL('chip-min-height') : null;
          case 'cp': return chip ? FL('chip-padding-inline') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-chip-/.test(full) ? 'every file chip' : /folder/.test(full) ? 'every folder' : 'every file and folder'; }, every: 'every file and folder',
      html: function (variant, size, state, extraCls) {
        var st = state === 'hover' ? 'is-hover' : state === 'focus' ? 'ds-focus' : '';
        if (variant === 'folder') return '<div class="ds-w11a-lab">' + fileHtml({ kind: 'folder', name: 'Brand kit', facts: '24 items · Sep 28', state: st }, extraCls) + '</div>';
        if (variant === 'chip') return '<div class="ds-w11a-lab">' + fileHtml({ name: 'Vestry minutes.docx', icon: 'doc-text', chip: true, facts: '88 kB', state: st }, extraCls) + '</div>';
        if (variant === 'types') {
          return '<div class="ds-w11a-lab ds-w11a-stack">' + fileHtml({ name: 'Archive 1919.zip', icon: 'file-zip', state: st }, extraCls)
            + [['Cross 014.png', 'file-png'], ['Border 007.svg', 'file-svg'], ['Rota.xlsx', 'table'], ['theme.css', 'code']].map(function (f) { return fileHtml({ name: f[0], icon: f[1] }); }).join('') + '</div>';
        }
        return '<div class="ds-w11a-lab">' + fileHtml({ name: 'Letterhead 2026.pdf', facts: variant === 'size' ? '1.2 MB · Oct 14' : '1.2 MB', state: st }, extraCls) + '</div>';
      },
      labelSelector: '.plx-file__base',
      parts: { g: 'A', is: 'B', ic: 'B', tg: 'C', nc: 'C', nf: 'C', ns: 'C', nw: 'C', nl: 'C', nr: 'C', hb: 'C', oc: 'C', ow: 'C', oo: 'C', mc: 'D', mf: 'D', ms: 'D', ml: 'D', cb: 'A', cc: 'A', cw: 'A', cr: 'A', ch: 'A', cp: 'A' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-file__icon', side: 'left' }, C: { part: '.plx-file__name', side: 'bottom' }, D: { part: '.plx-file__meta', side: 'right' } },
      sections: [['File', ['g', 'is', 'ic', 'tg']], ['Name', ['nc', 'nf', 'ns', 'nw', 'nl', 'nr', 'hb', 'oc', 'ow', 'oo']], ['Facts', ['mc', 'mf', 'ms', 'ml']], ['Chip', ['cb', 'cc', 'cw', 'cr', 'ch', 'cp']]],
      matrixLabel: 'File by variant and state', matrixColumnWidth: '--plx-ref-size-360px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- File row (<FileRow>): the checkbox, the file, the cells, a transfer, the actions
    var FR = function (n) { return 'plx-comp-file-row-' + n; };
    var rowHtml = function (variant, state, extraCls, name) {
      var progress = variant === 'progress', failed = state === 'failed' && progress, actions = variant === 'actions';
      var cls = 'plx-file-row' + (progress ? ' plx-file-row--progress' : '') + (actions ? ' plx-file-row--actions' : '') + (variant === 'selected' ? ' is-selected' : '') + (failed ? ' is-error' : '') + (state === 'hover' ? ' is-hover' : '') + ex(extraCls);
      var body = failed ? '<span class="plx-file-row__error" role="alert">' + icon('alert', 'plx-file-row__error-icon') + '<span class="plx-file-row__error-text">The connection was lost.</span></span>'
        : progress ? '<span class="plx-file-row__progress"><div class="plx-progress-bar plx-progress-bar--sm plx-progress-bar--info plx-file-row__bar"><progress class="plx-progress-bar__track plx-progress-bar__meter" value="42" max="100" aria-label="Uploading ' + name + '"></progress></div><span class="plx-file-row__percent" aria-hidden="true">42%</span></span>'
          : '<span class="plx-file-row__cell plx-file-row__size">1.2 MB</span><time class="plx-file-row__cell plx-file-row__date">Oct 14, 2026</time><span class="plx-file-row__cell plx-file-row__owner">Maya Chen</span>';
      var tail = actions ? '<span class="plx-file-row__actions">' + btn({ variant: 'ghost', size: 'xs', iconOnly: true, icon: 'download-tray', label: 'Download ' + name }) + btn({ variant: 'ghost', size: 'xs', iconOnly: true, icon: 'more', label: 'More actions for ' + name }) + '</span>'
        : failed ? '<span class="plx-file-row__actions">' + btn({ size: 'xs', icon: 'refresh', text: 'Try again' }) + '</span>'
          : progress ? '<span class="plx-file-row__actions">' + btn({ variant: 'ghost', size: 'xs', text: 'Cancel' }) + '</span>' : '';
      return '<li class="' + cls + '"><span class="plx-file-row__select">' + check('', variant === 'selected') + '</span><span class="plx-file-row__file">'
        + '<span class="plx-file plx-file--file plx-file--line"><span class="plx-file__icon" aria-hidden="true">' + icon('file-pdf') + '</span><span class="plx-file__text"><button type="button" tabindex="-1" class="plx-file__name plx-file__name--data"><span class="plx-file__base">' + name.replace(/\.pdf$/, '') + '</span><span class="plx-file__ext">.pdf</span></button></span></span></span>'
        + body + tail + '</li>';
    };
    DS.registerLab('file-row', {
      name: 'File row', title: 'Plenix file row', file: 'platform/components/FileRow/file-row.css', compPrefix: /^plx-comp-file-row-/,
      store: 'plenix-file-row-lab-tokens', sizes: [['default', 'Default', '.plx-file-row']],
      variants: [['default', 'Default'], ['selected', 'Selected'], ['progress', 'With progress'], ['actions', 'With actions']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['failed', 'Failed (a transfer)']],
      content: [['pdf', 'A PDF']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'actions', state: 'default', content: 'pdf' },
      props: [
        { id: 'bg', label: 'Background', css: ['background-color'], cat: 'color' },
        { id: 'lc', label: 'Line color', css: ['border-bottom-color'], cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['border-bottom-width'], cat: 'border-width' },
        { id: 'g', label: 'Gap between parts', css: ['column-gap'], cat: 'space' },
        { id: 'mh', label: 'Least height', css: ['min-block-size'], show: 'min-height', cat: 'size' },
        { id: 'py', label: 'Padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
        { id: 'px', label: 'Padding left', css: ['padding-inline-start'], show: 'padding-left', cat: 'space' },
        { id: 'pe', label: 'Padding right (with actions)', css: ['padding-inline-end'], show: 'padding-right', cat: 'space' },
        { id: 'ct', label: 'Cell color', css: ['color'], part: '.plx-file-row__size', cat: 'color' },
        { id: 'cs', label: 'Cell size', css: ['font-size'], part: '.plx-file-row__size', cat: 'font-size' },
        { id: 'cl', label: 'Cell line height', css: ['line-height'], part: '.plx-file-row__size', cat: 'line-height' },
        { id: 'df', label: 'Data font (size, date, percent)', css: ['font-family'], part: '.plx-file-row__size', cat: 'font' },
        { id: 'sw', label: 'Size cell width', css: ['inline-size'], show: 'width', part: '.plx-file-row__size', cat: 'size' },
        { id: 'dw', label: 'Date cell width', css: ['inline-size'], show: 'width', part: '.plx-file-row__date', cat: 'size' },
        { id: 'ow', label: 'Owner cell width', css: ['inline-size'], show: 'width', part: '.plx-file-row__owner', cat: 'size' },
        { id: 'pg', label: 'Gap (bar to percent)', css: ['column-gap'], part: '.plx-file-row__progress', cat: 'space' },
        { id: 'pw', label: 'Bar width', css: ['inline-size'], show: 'width', part: '.plx-file-row__bar', cat: 'size' },
        { id: 'qw', label: 'Percent width', css: ['inline-size'], show: 'width', part: '.plx-file-row__percent', cat: 'size' },
        { id: 'et', label: 'Error color', css: ['color'], part: '.plx-file-row__error', cat: 'color' },
        { id: 'ei', label: 'Error icon size', css: ['inline-size'], show: 'width', part: '.plx-file-row__error-icon', cat: 'icon' },
        { id: 'ag', label: 'Gap between actions', css: ['column-gap'], part: '.plx-file-row__actions', cat: 'space' }
      ],
      token: function (id, size, variant, state) {
        var progress = variant === 'progress', failed = progress && state === 'failed', cells = !progress;
        switch (id) {
          case 'bg': return FR(variant === 'selected' ? 'selected-background' : state === 'hover' ? 'hover-background' : 'background');
          case 'lc': return FR('border-color');
          case 'lw': return FR('border-width');
          case 'g': return FR('gap');
          case 'mh': return FR('min-height');
          case 'py': return FR('padding-block');
          case 'px': return FR('padding-inline');
          case 'pe': return FR(variant === 'actions' ? 'actions-padding-inline-end' : 'padding-inline');
          case 'ct': return cells ? FR('cell-text') : null;
          case 'cs': return cells ? FR('cell-font-size') : null;
          case 'cl': return cells ? FR('cell-line-height') : null;
          case 'df': return cells ? FR('data-font-family') : null;
          case 'sw': return cells ? FR('size-width') : null;
          case 'dw': return cells ? FR('date-width') : null;
          case 'ow': return cells ? FR('owner-width') : null;
          case 'pg': return progress && !failed ? FR('progress-gap') : null;
          case 'pw': return progress && !failed ? FR('progress-width') : null;
          case 'qw': return progress && !failed ? FR('percent-width') : null;
          case 'et': return failed ? FR('error-text') : null;
          case 'ei': return failed ? FR('error-icon-size') : null;
          case 'ag': return variant === 'actions' || progress ? FR('actions-gap') : null;
          default: return null;
        }
      },
      reach: function () { return 'every file row'; }, every: 'every file row',
      html: function (variant, size, state, extraCls) {
        return '<div class="ds-w11a-lab ds-w11a-lab--wide"><ul class="plx-file-row-list" aria-label="Files">' + rowHtml(variant, state, extraCls, 'Letterhead 2026.pdf') + rowHtml('default', 'default', '', 'Minutes.pdf') + '</ul></div>';
      },
      labelSelector: '.plx-file__base',
      parts: { bg: 'A', lc: 'A', lw: 'A', g: 'A', mh: 'A', py: 'A', px: 'A', pe: 'A', ct: 'B', cs: 'B', cl: 'B', df: 'B', sw: 'B', dw: 'B', ow: 'B', pg: 'C', pw: 'C', qw: 'C', et: 'C', ei: 'C', ag: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-file-row__size', side: 'top' }, C: { part: '.plx-file-row__progress', side: 'bottom' }, D: { part: '.plx-file-row__actions', side: 'right' } },
      sections: [['Row', ['bg', 'lc', 'lw', 'g', 'mh', 'py', 'px', 'pe']], ['Cells', ['ct', 'cs', 'cl', 'df', 'sw', 'dw', 'ow']], ['Transfer', ['pg', 'pw', 'qw', 'et', 'ei']], ['Actions', ['ag']]],
      matrixLabel: 'File row by variant and state', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Variants and states · ' + HEAD
    });

    // ---- Sign in (<Auth> with <SignInForm>): the card, its title, the form, single sign-on and "or", the links
    var AU = function (n) { return 'plx-comp-auth-' + n; };
    DS.registerLab('sign-in', {
      name: 'Sign in', title: 'Plenix sign in', file: 'platform/patterns/Auth/auth.css', compPrefix: /^plx-comp-auth-/,
      store: 'plenix-auth-lab-tokens', sizes: [['default', 'Default', '.plx-auth']],
      variants: [['card', 'Card (default)'], ['page', 'Page'], ['sso', 'With single sign-on'], ['error', 'With an error']],
      states: [['default', 'Default']], content: [['signin', 'Sign in to Plenix']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'sso', state: 'default', content: 'signin' },
      props: [
        { id: 'pp', label: 'Page padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', cat: 'space' },
        { id: 'pi', label: 'Page padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-left', cat: 'space' },
        { id: 'cb', label: 'Card fill', css: ['background-color'], part: '.plx-auth__card', cat: 'color' },
        { id: 'cc', label: 'Card border color', css: BORDERS, show: 'border-top-color', part: '.plx-auth__card', cat: 'color' },
        { id: 'cw', label: 'Card border width', css: WIDTHS, show: 'border-top-width', part: '.plx-auth__card', cat: 'border-width' },
        { id: 'cr', label: 'Card corners', css: CORNERS, show: 'border-top-left-radius', part: '.plx-auth__card', cat: 'radius' },
        { id: 'cm', label: 'Card width', css: ['max-inline-size'], show: 'max-width', part: '.plx-auth__card', cat: 'size' },
        { id: 'cp', label: 'Card padding', css: ['padding-block-start'], show: 'padding-top', part: '.plx-auth__card', cat: 'space' },
        { id: 'cg', label: 'Gap (header, body, footer)', css: ['row-gap'], part: '.plx-auth__card', cat: 'space' },
        { id: 'hg', label: 'Gap (title to its line)', css: ['row-gap'], part: '.plx-auth__header', cat: 'space' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-auth__title', cat: 'color' },
        { id: 'tf', label: 'Title font', css: ['font-family'], part: '.plx-auth__title', cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: '.plx-auth__title', cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-auth__title', cat: 'font-weight' },
        { id: 'tl', label: 'Title line height', css: ['line-height'], part: '.plx-auth__title', cat: 'line-height' },
        { id: 'mt', label: 'Muted text (the line, notes, “or”)', css: ['color'], part: '.plx-auth__description', cat: 'color' },
        { id: 'xs', label: 'Line size', css: ['font-size'], part: '.plx-auth__description', cat: 'font-size' },
        { id: 'xl', label: 'Line height', css: ['line-height'], part: '.plx-auth__description', cat: 'line-height' },
        { id: 'fg', label: 'Gap (single sign-on, “or”, form, links)', css: ['row-gap'], part: '.plx-auth__flow', cat: 'space' },
        { id: 'og', label: 'Gap between fields', css: ['row-gap'], part: '.plx-auth__form', cat: 'space' },
        { id: 'lg', label: 'Gap between links', css: ['column-gap'], part: '.plx-auth__links', cat: 'space' },
        { id: 'rg', label: 'Gap (“or” to its lines)', css: ['column-gap'], part: '.plx-auth__or', cat: 'space' },
        { id: 'rc', label: '“Or” line color', css: ['border-top-color'], part: '.plx-auth__or', pseudo: '::before', cat: 'color' },
        { id: 'rs', label: '“Or” size', css: ['font-size'], part: '.plx-auth__or-text', cat: 'font-size' },
        { id: 'rl', label: '“Or” line height', css: ['line-height'], part: '.plx-auth__or-text', cat: 'line-height' }
      ],
      token: function (id, size, variant) {
        var page = variant === 'page', sso = variant === 'sso';
        var T = { cb: 'card-background', cc: 'card-border-color', cw: 'card-border-width', cr: 'card-radius', cm: 'card-max-width', cp: 'card-padding', cg: 'card-gap', hg: 'header-gap',
          tc: 'title-text', tf: 'title-font-family', ts: 'title-font-size', tw: 'title-font-weight', tl: 'title-line-height', mt: 'muted-text', xs: 'text-font-size', xl: 'text-line-height', fg: 'flow-gap', og: 'form-gap', lg: 'links-gap' };
        if (T[id]) return AU(T[id]);
        if (id === 'pp') return page ? AU('page-padding-block') : null;
        if (id === 'pi') return page ? AU('page-padding-inline') : null;
        if (id === 'rg') return sso ? AU('or-gap') : null;
        if (id === 'rc') return sso ? AU('or-line-color') : null;
        if (id === 'rs') return sso ? AU('small-font-size') : null;
        if (id === 'rl') return sso ? AU('small-line-height') : null;
        return null;
      },
      reach: function (full) { return /-page-/.test(full) ? 'every sign-in page' : 'every sign-in, sign-up, reset, two-step and recovery card'; }, every: 'every Auth card',
      html: function (variant, size, state, extraCls) {
        var sso = variant === 'sso' ? '<div class="plx-auth__sso" role="group" aria-label="Single sign-on">' + btn({ text: 'Continue with Google', cls: 'plx-auth__submit' }) + btn({ text: 'Continue with Microsoft', cls: 'plx-auth__submit' }) + '</div>'
          + '<div class="plx-auth__or"><span class="plx-auth__or-text">or</span></div>' : '';
        var err = variant === 'error' ? '<div class="plx-notice plx-notice--danger" role="alert">' + icon('alert') + '<div class="plx-notice__text">Email or password is incorrect. Check both and try again.</div></div>' : '';
        var pw = '<div class="plx-input-group">' + input('password', 'secret-words') + btn({ iconOnly: true, icon: 'visibility', label: 'Show password' }) + '</div>';
        return '<div class="ds-w11a-lab ds-w11a-lab--wide' + (variant === 'page' ? ' ds-w11a-page' : '') + '"><div class="plx-auth' + (variant === 'page' ? ' plx-auth--page' : '') + ex(extraCls) + '"><section class="plx-auth__card" aria-label="Sign in to Plenix">'
          + '<header class="plx-auth__header"><h1 class="plx-auth__title">Sign in to Plenix</h1><p class="plx-auth__description">Use your Plenix user name or email.</p></header>'
          + '<div class="plx-auth__body"><div class="plx-auth__flow">' + sso + '<form class="plx-form plx-form--one-column plx-auth__form" aria-label="Sign in">' + err
          + field('Email or user name', input('text', variant === 'error' ? 'maya@example.org' : '')) + field('Password', pw) + check('Keep me signed in')
          + btn({ variant: 'primary', text: 'Sign in', cls: 'plx-auth__submit' }) + '</form>'
          + '<div class="plx-auth__links">' + btn({ variant: 'ghost', size: 'sm', text: 'Forgot your password?' }) + btn({ variant: 'ghost', size: 'sm', text: 'Create an account' }) + '</div></div></div></section></div></div>';
      },
      labelSelector: '.plx-auth__title, .plx-auth__description',
      parts: { pp: 'A', pi: 'A', cb: 'B', cc: 'B', cw: 'B', cr: 'B', cm: 'B', cp: 'B', cg: 'B', hg: 'C', tc: 'C', tf: 'C', ts: 'C', tw: 'C', tl: 'C', mt: 'C', xs: 'C', xl: 'C', fg: 'D', og: 'D', lg: 'E', rg: 'F', rc: 'F', rs: 'F', rl: 'F' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-auth__card', side: 'left' }, C: { part: '.plx-auth__header', side: 'right' }, D: { part: '.plx-auth__form', side: 'left' }, E: { part: '.plx-auth__links', side: 'bottom' }, F: { part: '.plx-auth__or', side: 'right' } },
      sections: [['Page', ['pp', 'pi']], ['Card', ['cb', 'cc', 'cw', 'cr', 'cm', 'cp', 'cg']], ['Title', ['hg', 'tc', 'tf', 'ts', 'tw', 'tl', 'mt', 'xs', 'xl']], ['Form', ['fg', 'og', 'lg']], ['Or', ['rg', 'rc', 'rs', 'rl']]],
      matrixLabel: 'Sign in by variant', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Session timeout (<SessionTimeout>): the warning, the signed-out message, drawn in a dialog or in the page
    var ST = function (n) { return 'plx-comp-session-timeout-' + n; };
    DS.registerLab('session-timeout', {
      name: 'Session timeout', title: 'Plenix session timeout', file: 'platform/patterns/SessionTimeout/session-timeout.css', compPrefix: /^plx-comp-session-timeout-/,
      store: 'plenix-session-timeout-lab-tokens', sizes: [['default', 'Default', '.plx-session-timeout']],
      variants: [['warning', 'Warning with countdown'], ['signed-out', 'Signed out'], ['inline', 'On the page']],
      states: [['default', 'Default']], content: [['work', 'Your changes are saved']],
      labels: { size: 'Size', variant: 'Variant', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'warning', state: 'default', content: 'work' },
      props: [
        { id: 'tx', label: 'Text color', css: ['color'], part: '.plx-session-timeout__text', cat: 'color' },
        { id: 'ts', label: 'Text size', css: ['font-size'], part: '.plx-session-timeout__text', cat: 'font-size' },
        { id: 'tl', label: 'Text line height', css: ['line-height'], part: '.plx-session-timeout__text', cat: 'line-height' },
        { id: 'tf', label: 'Time font', css: ['font-family'], part: '.plx-session-timeout__time, .plx-session-timeout__inline-time', cat: 'font' },
        { id: 'tc', label: 'Time color', css: ['color'], part: '.plx-session-timeout__time, .plx-session-timeout__inline-time', cat: 'color' },
        { id: 'tw', label: 'Time weight', css: ['font-weight'], part: '.plx-session-timeout__time', cat: 'font-weight' },
        { id: 'mw', label: 'Width on the page', css: ['max-inline-size'], show: 'max-width', cat: 'size' },
        { id: 'ig', label: 'Gap on the page', css: ['row-gap'], cat: 'space' },
        { id: 'hc', label: 'Title color (page)', css: ['color'], part: '.plx-session-timeout__title', cat: 'color' },
        { id: 'hf', label: 'Title font (page)', css: ['font-family'], part: '.plx-session-timeout__title', cat: 'font' },
        { id: 'hs', label: 'Title size (page)', css: ['font-size'], part: '.plx-session-timeout__title', cat: 'font-size' },
        { id: 'hw', label: 'Title weight (page)', css: ['font-weight'], part: '.plx-session-timeout__title', cat: 'font-weight' },
        { id: 'hl', label: 'Title line height (page)', css: ['line-height'], part: '.plx-session-timeout__title', cat: 'line-height' },
        { id: 'bg', label: 'Gap between paragraphs (page)', css: ['row-gap'], part: '.plx-session-timeout__body', cat: 'space' },
        { id: 'ag', label: 'Gap between buttons (page)', css: ['column-gap'], part: '.plx-session-timeout__actions', cat: 'space' }
      ],
      token: function (id, size, variant) {
        var inline = variant === 'inline', out = variant === 'signed-out';
        switch (id) {
          case 'tx': return ST('text');
          case 'ts': return ST('font-size');
          case 'tl': return ST('line-height');
          case 'tf': return ST('time-font-family');
          case 'tc': return ST(out ? 'text' : 'time-text');
          case 'tw': return out ? null : ST('time-font-weight');
          case 'mw': return inline ? ST('inline-max-width') : null;
          case 'ig': return inline ? ST('inline-gap') : null;
          case 'hc': return inline ? ST('title-text') : null;
          case 'hf': return inline ? ST('title-font-family') : null;
          case 'hs': return inline ? ST('title-font-size') : null;
          case 'hw': return inline ? ST('title-font-weight') : null;
          case 'hl': return inline ? ST('title-line-height') : null;
          case 'bg': return inline ? ST('body-gap') : null;
          case 'ag': return inline ? ST('actions-gap') : null;
          default: return null;
        }
      },
      reach: function (full) { return /-(inline|title|body|actions)-/.test(full) ? 'every session message drawn in a page' : 'every session warning and signed-out message'; }, every: 'every session timeout',
      html: function (variant, size, state, extraCls) {
        var saved = '<p class="plx-session-timeout__text">Your changes are saved.</p>';
        var time = '<time class="plx-session-timeout__time" role="timer" datetime="PT105S">1:45</time>';
        if (variant === 'inline') {
          return '<div class="ds-w11a-lab"><section class="plx-session-timeout plx-session-timeout--warning plx-session-timeout--inline' + ex(extraCls) + '" aria-label="Your session is about to end">'
            + '<h2 class="plx-session-timeout__title">Your session is about to end</h2><div class="plx-session-timeout__body"><p class="plx-session-timeout__text">You’ll be signed out in ' + time + ' because you haven’t been active.</p>' + saved + '</div>'
            + '<div class="plx-session-timeout__actions">' + btn({ text: 'Sign out' }) + btn({ variant: 'primary', text: 'Stay signed in' }) + '</div></section></div>';
        }
        var out = variant === 'signed-out';
        var lead = out ? 'For your security, you were signed out after <span class="plx-session-timeout__inline-time">30</span> minutes without activity.' : 'You’ll be signed out in ' + time + ' because you haven’t been active.';
        return '<div class="ds-w11a-lab ds-w11a-dialog"><div role="alertdialog" aria-label="Session" class="plx-dialog plx-dialog--sm plx-session-timeout plx-session-timeout--' + variant + ex(extraCls) + '">'
          + '<div class="plx-dialog__header"><h2 class="plx-dialog__title">' + (out ? 'You were signed out' : 'Your session is about to end') + '</h2>' + (out ? '' : btn({ variant: 'ghost', iconOnly: true, icon: 'close', label: 'Close', cls: 'plx-dialog__close' })) + '</div>'
          + '<div class="plx-dialog__body"><p class="plx-dialog__description">' + lead + '</p>' + saved + '</div>'
          + '<div class="plx-dialog__footer">' + (out ? btn({ variant: 'primary', text: 'Sign in again' }) : btn({ text: 'Sign out' }) + btn({ variant: 'primary', text: 'Stay signed in' })) + '</div></div></div>';
      },
      labelSelector: '.plx-session-timeout__text, .plx-session-timeout__title',
      parts: { tx: 'A', ts: 'A', tl: 'A', tf: 'B', tc: 'B', tw: 'B', mw: 'C', ig: 'C', hc: 'D', hf: 'D', hs: 'D', hw: 'D', hl: 'D', bg: 'E', ag: 'F' },
      anchors: { A: { part: '.plx-session-timeout__text', side: 'right' }, B: { part: '.plx-session-timeout__time, .plx-session-timeout__inline-time', side: 'top' }, C: { part: null, side: 'left' }, D: { part: '.plx-session-timeout__title', side: 'top' }, E: { part: '.plx-session-timeout__body', side: 'left' }, F: { part: '.plx-session-timeout__actions', side: 'bottom' } },
      sections: [['Message', ['tx', 'ts', 'tl', 'tf', 'tc', 'tw']], ['On the page', ['mw', 'ig', 'hc', 'hf', 'hs', 'hw', 'hl', 'bg', 'ag']]],
      matrixLabel: 'Session timeout by variant', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Variants · ' + HEAD
    });

    // ---- Roles (<RoleManager>): the roles list and a role's detail
    var RM = function (n) { return 'plx-comp-role-manager-' + n; };
    var roleRow = function (name, about, n, kind, ic) {
      return '<li class="plx-resource-list__item is-interactive"><span class="plx-resource-list__media"><span class="plx-icon-tile plx-icon-tile--sm plx-icon-tile--gray" aria-hidden="true">' + icon(ic, 'plx-icon--size-sm plx-icon-tile__icon') + '</span></span>'
        + '<span class="plx-resource-list__text"><span class="plx-resource-list__name"><button type="button" tabindex="-1" class="plx-resource-list__opener">' + name + '</button></span><span class="plx-resource-list__description">' + about + '</span></span>'
        + '<span class="plx-resource-list__meta"><span class="plx-role-manager__meta"><span><span class="plx-text plx-text--data">' + n + '</span> members</span><span class="plx-role-manager__kind">' + kind + '</span></span></span></li>';
    };
    DS.registerLab('role-manager', {
      name: 'Roles', title: 'Plenix roles', file: 'platform/patterns/RoleManager/role-manager.css', compPrefix: /^plx-comp-role-manager-/,
      store: 'plenix-role-manager-lab-tokens', sizes: [['default', 'Default', '.plx-role-manager']],
      variants: [['list', 'Roles list'], ['detail', 'Role detail']],
      states: [['default', 'Default']], content: [['workspace', 'A workspace’s roles']],
      labels: { size: 'Size', variant: 'View', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'detail', state: 'default', content: 'workspace' },
      props: [
        { id: 'lg', label: 'Gap (bar to list)', css: ['row-gap'], part: '.plx-role-manager__list', cat: 'space' },
        { id: 'mg', label: 'Gap (count to kind)', css: ['column-gap'], part: '.plx-role-manager__meta', cat: 'space' },
        { id: 'mt', label: 'Muted text', css: ['color'], part: '.plx-role-manager__kind', cat: 'color' },
        { id: 'sg', label: 'Gap between sections', css: ['row-gap'], part: '.plx-role-manager__detail', cat: 'space' },
        { id: 'hg', label: 'Gap (title, role, actions)', css: ['column-gap'], part: '.plx-role-manager__header', cat: 'space' },
        { id: 'hr', label: 'Gap between header lines', css: ['row-gap'], part: '.plx-role-manager__header', cat: 'space' },
        { id: 'tc', label: 'Title color', css: ['color'], part: '.plx-role-manager__title', cat: 'color' },
        { id: 'tf', label: 'Title font', css: ['font-family'], part: '.plx-role-manager__title', cat: 'font' },
        { id: 'ts', label: 'Title size', css: ['font-size'], part: '.plx-role-manager__title', cat: 'font-size' },
        { id: 'tw', label: 'Title weight', css: ['font-weight'], part: '.plx-role-manager__title', cat: 'font-weight' },
        { id: 'tl', label: 'Title line height', css: ['line-height'], part: '.plx-role-manager__title', cat: 'line-height' },
        { id: 'ag', label: 'Gap between actions', css: ['column-gap'], part: '.plx-role-manager__actions', cat: 'space' },
        { id: 'dc', label: 'Description color', css: ['color'], part: '.plx-role-manager__description', cat: 'color' },
        { id: 'ds', label: 'Description size', css: ['font-size'], part: '.plx-role-manager__description', cat: 'font-size' },
        { id: 'dl', label: 'Description line height', css: ['line-height'], part: '.plx-role-manager__description', cat: 'line-height' },
        { id: 'ig', label: 'Gap inside a section', css: ['row-gap'], part: '.plx-role-manager__section', cat: 'space' },
        { id: 'sf', label: 'Section title font', css: ['font-family'], part: '.plx-role-manager__section-title', cat: 'font' },
        { id: 'ss', label: 'Section title size', css: ['font-size'], part: '.plx-role-manager__section-title', cat: 'font-size' },
        { id: 'sl', label: 'Section title line height', css: ['line-height'], part: '.plx-role-manager__section-title', cat: 'line-height' },
        { id: 'cw', label: 'Count weight', css: ['font-weight'], part: '.plx-role-manager__count', cat: 'font-weight' },
        { id: 'gg', label: 'Gap between permission groups', css: ['row-gap'], part: '.plx-role-manager__groups', cat: 'space' },
        { id: 'am', label: 'Add a member: greatest width', css: ['max-inline-size'], show: 'max-width', part: '.plx-role-manager__add', cat: 'size' }
      ],
      token: function (id, size, variant) {
        var list = variant === 'list';
        if (id === 'lg') return list ? RM('list-gap') : null;
        if (id === 'mg') return list ? RM('meta-gap') : null;
        if (id === 'mt') return list ? RM('muted-text') : null;
        if (list) return null;
        var T = { sg: 'section-gap', hg: 'header-gap', hr: 'header-row-gap', tc: 'title-text', tf: 'title-font-family', ts: 'title-font-size', tw: 'title-font-weight', tl: 'title-line-height', ag: 'actions-gap',
          dc: 'muted-text', ds: 'text-font-size', dl: 'text-line-height', ig: 'section-inner-gap', sf: 'section-title-font-family', ss: 'section-title-font-size', sl: 'section-title-line-height', cw: 'count-font-weight', gg: 'groups-gap', am: 'add-max-width' };
        return T[id] ? RM(T[id]) : null;
      },
      reach: function () { return 'every roles manager'; }, every: 'every roles manager',
      html: function (variant, size, state, extraCls) {
        if (variant === 'list') {
          return '<div class="ds-w11a-lab ds-w11a-lab--wide"><div class="plx-role-manager plx-role-manager--list' + ex(extraCls) + '"><div class="plx-role-manager__list"><div class="plx-role-manager__bar">' + btn({ icon: 'plus', text: 'Create role' }) + '</div>'
            + '<div class="plx-resource-list"><ul class="plx-resource-list__list" aria-label="Roles">' + roleRow('Owner', 'Can do everything, including members and billing.', 1, 'Built-in', 'settings-permissions')
            + roleRow('Editor', 'Can upload, edit and share assets.', 2, 'Built-in', 'pencil') + roleRow('Print vendor', 'Can download originals for print.', 1, 'Custom', 'person') + '</ul></div></div></div></div>';
        }
        var perm = function (label, on) { return check(label, on); };
        return '<div class="ds-w11a-lab ds-w11a-lab--wide"><div class="plx-role-manager plx-role-manager--detail' + ex(extraCls) + '"><div class="plx-role-manager__detail">'
          + '<div class="plx-role-manager__back">' + btn({ variant: 'ghost', size: 'sm', icon: 'arrow-left', text: 'All roles' }) + '</div>'
          + '<header class="plx-role-manager__header"><div class="plx-role-manager__heading"><h2 class="plx-role-manager__title" tabindex="-1">Print vendor</h2>'
          + '<span class="plx-tag plx-role-label" data-plx-role="custom">' + icon('person', 'plx-role-label__icon') + '<span class="plx-tag__label">Print vendor</span></span></div>'
          + '<div class="plx-role-manager__actions">' + btn({ size: 'sm', icon: 'ed-copy', text: 'Duplicate' }) + btn({ size: 'sm', variant: 'danger-secondary', icon: 'trash', text: 'Delete' }) + '</div>'
          + '<p class="plx-role-manager__description">Can download originals for print, nothing else.</p></header>'
          + '<section class="plx-role-manager__section" aria-label="Permissions"><h3 class="plx-role-manager__section-title">Permissions</h3><div class="plx-role-manager__groups">'
          + '<fieldset class="plx-fieldset plx-stack plx-stack--gap-xs"><legend class="plx-fieldset__legend">Assets</legend>' + perm('View assets', true) + perm('Download originals', true) + perm('Upload and edit') + '</fieldset>'
          + '<fieldset class="plx-fieldset plx-stack plx-stack--gap-xs"><legend class="plx-fieldset__legend">Collaboration</legend>' + perm('Comment') + perm('Share with people outside') + '</fieldset></div></section>'
          + '<section class="plx-role-manager__section" aria-label="Members"><h3 class="plx-role-manager__section-title">Members <span class="plx-role-manager__count"><span class="plx-text plx-text--data">1</span></span></h3>'
          + '<p class="plx-role-manager__note">Jonas Weber · jonas@print.example</p><div class="plx-role-manager__add">' + field('Add a member', input('text', '')) + '</div></section></div></div></div>';
      },
      labelSelector: '.plx-role-manager__title, .plx-resource-list__opener',
      parts: { lg: 'A', mg: 'B', mt: 'B', sg: 'A', hg: 'C', hr: 'C', tc: 'C', tf: 'C', ts: 'C', tw: 'C', tl: 'C', ag: 'C', dc: 'C', ds: 'C', dl: 'C', ig: 'D', sf: 'D', ss: 'D', sl: 'D', cw: 'D', gg: 'E', am: 'F' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-role-manager__meta', side: 'right' }, C: { part: '.plx-role-manager__header', side: 'top' }, D: { part: '.plx-role-manager__section-title', side: 'right' }, E: { part: '.plx-role-manager__groups', side: 'bottom' }, F: { part: '.plx-role-manager__add', side: 'right' } },
      sections: [['List', ['lg', 'mg', 'mt']], ['Detail', ['sg', 'hg', 'hr', 'tc', 'tf', 'ts', 'tw', 'tl', 'ag', 'dc', 'ds', 'dl']], ['Sections', ['ig', 'sf', 'ss', 'sl', 'cw', 'gg', 'am']]],
      matrixLabel: 'Roles by view', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Views · ' + HEAD
    });

    // ---- Account connection (<ConnectedAccounts>): a row per service in each status
    var CA = function (n) { return 'plx-comp-connected-accounts-' + n; };
    var account = function (status) {
      var B = { connect: ['neutral', 'link', 'Not connected'], connected: ['success', 'check', 'Connected'], error: ['negative', 'alert', 'Connection error'] }[status];
      var detail = status === 'connect' ? '' : '<p class="plx-connected-accounts__detail">As <span class="plx-text plx-text--data">maya@example.org</span>, since <time class="plx-connected-accounts__date">Oct 2, 2026</time></p>';
      var actions = status === 'connect' ? btn({ text: 'Connect' }) : status === 'error' ? btn({ variant: 'primary', text: 'Reconnect' }) + btn({ variant: 'ghost', text: 'Disconnect' }) : btn({ text: 'Disconnect' });
      return '<li class="plx-connected-accounts__item" data-plx-state="' + status + '">' + tile(status === 'error' ? 'mail' : 'folder') + '<div class="plx-connected-accounts__body"><div class="plx-connected-accounts__head">'
        + '<h3 class="plx-connected-accounts__service">' + (status === 'error' ? 'Mailchimp' : 'Google Drive') + '</h3>' + badge(B[0], B[1], B[2]) + '</div>'
        + '<p class="plx-connected-accounts__description">Open and save files from your Drive.</p>' + detail
        + (status === 'error' ? '<p class="plx-connected-accounts__error">Access expired on Oct 12. Reconnect to keep sending.</p>' : '') + '</div><div class="plx-connected-accounts__actions">' + actions + '</div></li>';
    };
    DS.registerLab('connected-accounts', {
      name: 'Account connection', title: 'Plenix account connection', file: 'platform/patterns/ConnectedAccounts/connected-accounts.css', compPrefix: /^plx-comp-connected-accounts-/,
      store: 'plenix-connected-accounts-lab-tokens', sizes: [['default', 'Default', '.plx-connected-accounts']],
      variants: [['connect', 'Connect'], ['connected', 'Connected'], ['error', 'Error']],
      states: [['default', 'Default']], content: [['drive', 'Google Drive']],
      labels: { size: 'Size', variant: 'Status', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'connected', state: 'default', content: 'drive' },
      props: [
        { id: 'lc', label: 'Line between rows', css: ['border-bottom-color'], part: '.plx-connected-accounts__item', cat: 'color' },
        { id: 'lw', label: 'Line width', css: ['border-bottom-width'], part: '.plx-connected-accounts__item', cat: 'border-width' },
        { id: 'py', label: 'Row padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: '.plx-connected-accounts__item', cat: 'space' },
        { id: 'g', label: 'Gap (tile, text, actions)', css: ['column-gap'], part: '.plx-connected-accounts__item', cat: 'space' },
        { id: 'rg', label: 'Gap when the actions wrap', css: ['row-gap'], part: '.plx-connected-accounts__item', cat: 'space' },
        { id: 'bm', label: 'Text least width', css: ['flex-basis'], part: '.plx-connected-accounts__body', cat: 'size' },
        { id: 'bg', label: 'Gap between lines', css: ['row-gap'], part: '.plx-connected-accounts__body', cat: 'space' },
        { id: 'hg', label: 'Gap (name to status)', css: ['column-gap'], part: '.plx-connected-accounts__head', cat: 'space' },
        { id: 'sc', label: 'Service color', css: ['color'], part: '.plx-connected-accounts__service', cat: 'color' },
        { id: 'sf', label: 'Service font', css: ['font-family'], part: '.plx-connected-accounts__service', cat: 'font' },
        { id: 'ss', label: 'Service size', css: ['font-size'], part: '.plx-connected-accounts__service', cat: 'font-size' },
        { id: 'sw', label: 'Service weight', css: ['font-weight'], part: '.plx-connected-accounts__service', cat: 'font-weight' },
        { id: 'sl', label: 'Service line height', css: ['line-height'], part: '.plx-connected-accounts__service', cat: 'line-height' },
        { id: 'dc', label: 'Purpose color', css: ['color'], part: '.plx-connected-accounts__description', cat: 'color' },
        { id: 'ds', label: 'Lines’ size', css: ['font-size'], part: '.plx-connected-accounts__description', cat: 'font-size' },
        { id: 'dl', label: 'Lines’ line height', css: ['line-height'], part: '.plx-connected-accounts__description', cat: 'line-height' },
        { id: 'ac', label: 'Account line color', css: ['color'], part: '.plx-connected-accounts__detail', cat: 'color' },
        { id: 'df', label: 'Date font', css: ['font-family'], part: '.plx-connected-accounts__date', cat: 'font' },
        { id: 'ec', label: 'Reason color', css: ['color'], part: '.plx-connected-accounts__error', cat: 'color' },
        { id: 'ag', label: 'Gap between actions', css: ['column-gap'], part: '.plx-connected-accounts__actions', cat: 'space' }
      ],
      token: function (id, size, variant) {
        var linked = variant !== 'connect';
        var T = { lc: 'border-color', lw: 'border-width', py: 'padding-block', g: 'gap', rg: 'row-gap', bm: 'body-min-width', bg: 'body-gap', hg: 'head-gap', sc: 'service-text', sf: 'service-font-family',
          ss: 'service-font-size', sw: 'service-font-weight', sl: 'service-line-height', dc: 'description-text', ds: 'detail-font-size', dl: 'detail-line-height', ag: 'actions-gap' };
        if (T[id]) return CA(T[id]);
        if (id === 'ac') return linked ? CA('detail-text') : null;
        if (id === 'df') return linked ? CA('data-font-family') : null;
        if (id === 'ec') return variant === 'error' ? CA('error-text') : null;
        return null;
      },
      reach: function () { return 'every connected account'; }, every: 'every connected account',
      html: function (variant, size, state, extraCls) {
        return '<div class="ds-w11a-lab ds-w11a-lab--wide"><ul class="plx-connected-accounts' + ex(extraCls) + '" aria-label="Connected accounts">' + account(variant) + account(variant === 'connected' ? 'connect' : 'connected') + '</ul></div>';
      },
      labelSelector: '.plx-connected-accounts__service',
      parts: { lc: 'A', lw: 'A', py: 'A', g: 'A', rg: 'A', bm: 'B', bg: 'B', hg: 'C', sc: 'C', sf: 'C', ss: 'C', sw: 'C', sl: 'C', dc: 'D', ds: 'D', dl: 'D', ac: 'D', df: 'D', ec: 'D', ag: 'E' },
      anchors: { A: { part: '.plx-connected-accounts__item', side: 'left' }, B: { part: '.plx-connected-accounts__body', side: 'bottom' }, C: { part: '.plx-connected-accounts__head', side: 'top' }, D: { part: '.plx-connected-accounts__description', side: 'left' }, E: { part: '.plx-connected-accounts__actions', side: 'right' } },
      sections: [['Row', ['lc', 'lw', 'py', 'g', 'rg']], ['Text', ['bm', 'bg', 'hg', 'sc', 'sf', 'ss', 'sw', 'sl', 'dc', 'ds', 'dl', 'ac', 'df', 'ec']], ['Actions', ['ag']]],
      matrixLabel: 'Account connection by status', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Statuses · ' + HEAD
    });
  })();
}
