/* Plenix design system · library part w10B: the labs of wave 10, lane B. DeleteFlow, DuplicateAction, Publish, ReviewFlow
   and AssignControl, each drawn with the markup the pattern renders, so every value shows with the one --plx-comp-* token
   behind it. The forms that run at once (Undo, Move to trash, Copy of the name) show their toast: Toast's own tokens. */
if (window.DS && DS.registerLab) {
  (function () {
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (c) { return c ? ' ' + c : ''; };
    var icon = function (name, cls) { return DS.icon(name, cls); };
    var btn = function (o) {
      return '<button type="button" tabindex="-1" class="plx-button plx-button--' + (o.variant || 'secondary') + (o.size ? ' plx-button--size-' + o.size : '') + ex(o.cls) + '">'
        + (o.icon ? '<span class="plx-button__icon">' + icon(o.icon) + '</span>' : '') + '<span class="plx-button__label">' + o.text + '</span></button>';
    };
    var STATUS = { draft: ['neutral', 'pencil', 'Draft'], 'in-review': ['active', 'doc-search', 'In review'], approved: ['success', 'circle-check', 'Approved'],
      'changes-requested': ['action-required', 'alert', 'Changes requested'], rejected: ['negative', 'close', 'Rejected'], published: ['success', 'visibility', 'Published'], scheduled: ['waiting', 'schedule', 'Scheduled'] };
    var badge = function (s) { var b = STATUS[s]; return '<span class="plx-badge plx-badge--' + b[0] + ' plx-workflow-status">' + icon(b[1], 'plx-badge__icon') + b[2] + '</span>'; };
    var field = function (label, control, o) {
      o = o || {};
      return '<div class="plx-field plx-field--stacked' + (o.error ? ' is-invalid' : '') + '"><div class="plx-field__head"><label class="plx-field__label">' + label + '</label></div><div class="plx-field__control">' + control
        + (o.description ? '<div class="plx-field__description">' + o.description + '</div>' : '') + (o.error ? '<div class="plx-field__error" role="alert">' + o.error + '</div>' : '') + '</div></div>';
    };
    var avatar = function (name, size) { var i = name.split(' ').map(function (w) { return w.charAt(0); }).join('').slice(0, 2); return '<span class="plx-avatar plx-avatar--' + size + ' plx-persona__avatar" aria-hidden="true">' + i + '</span>'; };
    var persona = function (name, size, secondary) {
      return '<div class="plx-persona plx-persona--' + size + '">' + avatar(name, size) + '<div class="plx-persona__text"><div class="plx-persona__primary"><span class="plx-persona__name">' + name + '</span></div>'
        + (secondary ? '<div class="plx-persona__secondary">' + secondary + '</div>' : '') + '</div></div>';
    };
    var toast = function (message, action, extraCls) {
      return '<div role="status" class="plx-toast plx-toast--info' + ex(extraCls) + '"><span class="plx-toast__icon">' + icon('circle-info') + '</span><span class="plx-toast__message">' + message + '</span>'
        + (action ? btn({ size: 'xs', text: action, cls: 'plx-toast__action' }) : '') + '<button type="button" tabindex="-1" class="plx-toast__close" aria-label="Dismiss">' + icon('close') + '</button></div>';
    };
    var data = function (text) { return '<span class="plx-text plx-text--data">' + text + '</span>'; };

    // ---- DeleteFlow (<DeleteFlow>): the confirmation's names and the type-to-confirm field; Undo and Move to trash: the toast
    var DF = function (n) { return 'plx-comp-delete-flow-' + n; };
    var NAMES = ['Easter', 'Advent', 'Weddings', 'Funerals', 'Choir'];
    DS.registerLab('delete-flow', {
      name: 'Delete flow', title: 'Plenix delete flow', file: 'platform/patterns/DeleteFlow/delete-flow.css', compPrefix: /^plx-comp-delete-flow-/,
      store: 'plenix-delete-flow-lab-tokens', sizes: [['default', 'Default', '.plx-delete-flow']],
      variants: [['confirm', 'Confirm (default)'], ['type', 'Type to confirm'], ['undo', 'Undo'], ['trash', 'Move to trash']],
      states: [['default', 'Default']],
      content: [['many', 'Several items'], ['one', 'One item']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Items' },
      defaults: { size: 'default', variant: 'confirm', state: 'default', content: 'many' },
      props: [
        { id: 'g', label: 'Gap (names to field)', css: ['row-gap'], cat: 'space' },
        { id: 'ng', label: 'Gap between names', css: ['row-gap'], part: '.plx-delete-flow__names', cat: 'space' },
        { id: 'nt', label: 'Name color', css: ['color'], part: '.plx-delete-flow__name', cat: 'color' },
        { id: 'nfs', label: 'Name size', css: ['font-size'], part: '.plx-delete-flow__name', cat: 'font-size' },
        { id: 'nfw', label: 'Name weight', css: ['font-weight'], part: '.plx-delete-flow__name', cat: 'font-weight' },
        { id: 'nlh', label: 'Name line height', css: ['line-height'], part: '.plx-delete-flow__name', cat: 'line-height' },
        { id: 'mt', label: '“And N more” color', css: ['color'], part: '.plx-delete-flow__more', cat: 'color' },
        { id: 'mfs', label: '“And N more” size', css: ['font-size'], part: '.plx-delete-flow__more', cat: 'font-size' }
      ],
      token: function (id, size, variant, state, content) {
        if (variant === 'undo' || variant === 'trash') return null;
        var many = content !== 'one';
        switch (id) {
          case 'g': return DF(variant === 'type' ? 'type-gap' : 'gap');
          case 'ng': return many ? DF('names-gap') : null;
          case 'nt': return many ? DF('name-text') : null;
          case 'nfs': return many ? DF('name-font-size') : null;
          case 'nfw': return many ? DF('name-font-weight') : null;
          case 'nlh': return many ? DF('name-line-height') : null;
          case 'mt': return many ? DF('more-text') : null;
          case 'mfs': return many ? DF('more-font-size') : null;
          default: return null;
        }
      },
      reach: function (full) { return /type-gap/.test(full) ? 'every type-to-confirm delete' : 'every delete confirmation'; },
      every: 'every delete confirmation',
      html: function (variant, size, state, extraCls, ui) {
        var many = !ui || ui.content !== 'one';
        if (variant === 'undo') return toast(many ? '7 categories deleted' : '“Easter” deleted', 'Undo', extraCls);
        if (variant === 'trash') return toast((many ? '7 categories moved to the trash.' : '“Easter” moved to the trash.') + ' Restore ' + (many ? 'them' : 'it') + ' from the trash within 30 days.', 'Undo', extraCls);
        var names = many ? '<ul class="plx-delete-flow__names" aria-label="Deleted">' + NAMES.map(function (n) { return '<li class="plx-delete-flow__name">' + n + '</li>'; }).join('') + '<li class="plx-delete-flow__more">and 2 more</li></ul>' : '';
        var typed = variant === 'type' ? field('Type ' + data(many ? 'delete 7 categories' : 'Easter') + ' to confirm', '<input class="plx-input" tabindex="-1" value="">') : '';
        return '<form class="plx-delete-flow' + (variant === 'type' ? ' plx-delete-flow--type' : '') + ex(extraCls) + '">' + names + typed + '</form>';
      },
      labelSelector: '.plx-delete-flow__name',
      parts: { g: 'A', ng: 'B', nt: 'C', nfs: 'C', nfw: 'C', nlh: 'C', mt: 'D', mfs: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-delete-flow__names', side: 'left' }, C: { part: '.plx-delete-flow__name', side: 'right' }, D: { part: '.plx-delete-flow__more', side: 'right' } },
      sections: [['Content', ['g']], ['Names', ['ng', 'nt', 'nfs', 'nfw', 'nlh', 'mt', 'mfs']]],
      matrixLabel: 'Delete flow by form', matrixColumnWidth: '--plx-ref-size-360px', statesHead: 'Forms · ' + HEAD
    });

    // ---- DuplicateAction (<DuplicateAction>): the rename dialog's content; Copy of the name: its toast
    var DA = function (n) { return 'plx-comp-duplicate-action-' + n; };
    var check = function (label, on) { return '<label class="plx-check"><input type="checkbox" tabindex="-1" class="plx-check__input"' + (on ? ' checked' : '') + '><span class="plx-check__text"><span class="plx-check__label">' + label + '</span></span></label>'; };
    DS.registerLab('duplicate-action', {
      name: 'Duplicate', title: 'Plenix duplicate action', file: 'platform/patterns/DuplicateAction/duplicate-action.css', compPrefix: /^plx-comp-duplicate-action-/,
      store: 'plenix-duplicate-action-lab-tokens', sizes: [['default', 'Default', '.plx-duplicate-action']],
      variants: [['copy', 'Copy of the name (default)'], ['rename', 'Then rename']],
      states: [['default', 'Default']],
      content: [['name', 'Name only'], ['options', 'With what to copy']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'rename', state: 'default', content: 'name' },
      props: [
        { id: 'g', label: 'Gap (field, source, options)', css: ['row-gap'], cat: 'space' },
        { id: 'sg', label: 'Gap (icon to source)', css: ['column-gap'], part: '.plx-duplicate-action__source', cat: 'space' },
        { id: 'st', label: 'Source color', css: ['color'], part: '.plx-duplicate-action__source', cat: 'color' },
        { id: 'sfs', label: 'Source size', css: ['font-size'], part: '.plx-duplicate-action__source', cat: 'font-size' },
        { id: 'slh', label: 'Source line height', css: ['line-height'], part: '.plx-duplicate-action__source', cat: 'line-height' },
        { id: 'ib', label: 'Icon box height', css: ['block-size'], show: 'height', part: '.plx-duplicate-action__icon', cat: 'size' },
        { id: 'ic', label: 'Icon color', css: ['color'], part: '.plx-duplicate-action__icon', cat: 'color' }
      ],
      token: function (id, size, variant, state, content) {
        if (variant === 'copy') return null;
        switch (id) {
          case 'g': return DA(content === 'options' ? 'options-gap' : 'gap');
          case 'sg': return DA('source-gap');
          case 'st': return DA('source-text');
          case 'sfs': return DA('source-font-size');
          case 'slh': case 'ib': return DA('source-line-height');
          case 'ic': return DA('icon-text');
          default: return null;
        }
      },
      reach: function () { return 'every duplicate dialog'; },
      every: 'every duplicate dialog',
      html: function (variant, size, state, extraCls, ui) {
        if (variant === 'copy') return toast('Duplicated as “Copy of Easter banner”', 'Undo', extraCls);
        var options = ui && ui.content === 'options';
        return '<form class="plx-duplicate-action' + (options ? ' plx-duplicate-action--options' : '') + ex(extraCls) + '">' + field('Name', '<input class="plx-input" tabindex="-1" value="Copy of Easter banner">')
          + '<p class="plx-duplicate-action__source"><span class="plx-duplicate-action__icon" aria-hidden="true">' + icon('ed-copy') + '</span><span class="plx-duplicate-action__from">From “Easter banner” · PNG · 2.4 MB</span></p>'
          + (options ? '<fieldset class="plx-fieldset plx-stack plx-stack--gap-xs"><legend class="plx-fieldset__legend">Also copy</legend>' + check('Tags', true) + check('Comments') + check('Sharing and members') + '</fieldset>' : '') + '</form>';
      },
      labelSelector: '.plx-duplicate-action__from',
      parts: { g: 'A', sg: 'B', st: 'B', sfs: 'B', slh: 'B', ib: 'C', ic: 'C' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-duplicate-action__source', side: 'right' }, C: { part: '.plx-duplicate-action__icon', side: 'left' } },
      sections: [['Content', ['g']], ['Source line', ['sg', 'st', 'sfs', 'slh', 'ib', 'ic']]],
      matrixLabel: 'Duplicate by form', matrixColumnWidth: '--plx-ref-size-360px', statesHead: 'Forms · ' + HEAD
    });

    // ---- Publish (<Publish>): the status (badge and line) and the actions
    var PB = function (n) { return 'plx-comp-publish-' + n; };
    DS.registerLab('publish', {
      name: 'Publish', title: 'Plenix publish', file: 'platform/patterns/Publish/publish.css', compPrefix: /^plx-comp-publish-/,
      store: 'plenix-publish-lab-tokens', sizes: [['default', 'Default', '.plx-publish']],
      variants: [['draft', 'Publish now (default)'], ['scheduled', 'Schedule'], ['published', 'Unpublish'], ['status', 'Status only']],
      states: [['default', 'Default']],
      content: [['by', 'With who'], ['plain', 'Without who']],
      labels: { size: 'Size', variant: 'State', state: 'State', content: 'Status line' },
      defaults: { size: 'default', variant: 'draft', state: 'default', content: 'by' },
      props: [
        { id: 'g', label: 'Gap (status to actions)', css: ['column-gap'], cat: 'space' },
        { id: 'rg', label: 'Gap between wrapped lines', css: ['row-gap'], cat: 'space' },
        { id: 'sg', label: 'Gap (badge to line)', css: ['column-gap'], part: '.plx-publish__status', cat: 'space' },
        { id: 'dt', label: 'Line color', css: ['color'], part: '.plx-publish__detail', cat: 'color' },
        { id: 'dfs', label: 'Line size', css: ['font-size'], part: '.plx-publish__detail', cat: 'font-size' },
        { id: 'dlh', label: 'Line height', css: ['line-height'], part: '.plx-publish__detail', cat: 'line-height' },
        { id: 'ag', label: 'Gap between actions', css: ['column-gap'], part: '.plx-publish__actions', cat: 'space' }
      ],
      token: function (id, size, variant) {
        switch (id) {
          case 'g': return PB('gap');
          case 'rg': return PB('row-gap');
          case 'sg': return PB('status-gap');
          case 'dt': return PB('detail-text');
          case 'dfs': return PB('detail-font-size');
          case 'dlh': return PB('detail-line-height');
          case 'ag': return variant === 'status' ? null : PB('actions-gap');
          default: return null;
        }
      },
      reach: function () { return 'every publish row'; },
      every: 'every publish row',
      html: function (variant, size, state, extraCls, ui) {
        var by = !ui || ui.content !== 'plain';
        var line = variant === 'draft' ? 'Not published'
          : variant === 'scheduled' ? 'Publishes ' + data('Oct 20, 2026, 9:00 AM') + (by ? ', scheduled by Maya Chen' : '')
            : 'Published ' + data('Oct 15, 2026, 10:24 AM') + (by ? ' by Maya Chen' : '');
        var status = variant === 'draft' ? 'draft' : variant === 'scheduled' ? 'scheduled' : 'published';
        var actions = variant === 'draft' ? btn({ icon: 'schedule', text: 'Schedule' }) + btn({ variant: 'primary', text: 'Publish' })
          : variant === 'scheduled' ? btn({ text: 'Cancel schedule' }) + btn({ variant: 'primary', text: 'Publish now' })
            : variant === 'published' ? btn({ text: 'Unpublish' }) : '';
        return '<div class="plx-publish' + (variant === 'status' ? ' plx-publish--read-only' : '') + ex(extraCls) + '"><div class="plx-publish__status">' + badge(status) + '<span class="plx-publish__detail">' + line + '</span></div>'
          + (actions ? '<div class="plx-publish__actions" role="group" aria-label="Publishing">' + actions + '</div>' : '') + '</div>';
      },
      labelSelector: '.plx-publish__detail',
      parts: { g: 'A', rg: 'A', sg: 'B', dt: 'C', dfs: 'C', dlh: 'C', ag: 'D' },
      anchors: { A: { part: null, side: 'top' }, B: { part: '.plx-publish__status', side: 'left' }, C: { part: '.plx-publish__detail', side: 'bottom' }, D: { part: '.plx-publish__actions', side: 'right' } },
      sections: [['Row', ['g', 'rg']], ['Status', ['sg', 'dt', 'dfs', 'dlh']], ['Actions', ['ag']]],
      matrixLabel: 'Publish by state', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'States · ' + HEAD
    });

    // ---- ReviewFlow (<ReviewFlow>): the head, the reviewers, the comment and decisions, the history label
    var RF = function (n) { return 'plx-comp-review-flow-' + n; };
    DS.registerLab('review-flow', {
      name: 'Review flow', title: 'Plenix review flow', file: 'platform/patterns/ReviewFlow/review-flow.css', compPrefix: /^plx-comp-review-flow-/,
      store: 'plenix-review-flow-lab-tokens', sizes: [['default', 'Default', '.plx-review-flow']],
      variants: [['panel', 'Review panel (default)'], ['human', 'Human review'], ['approved', 'Approve'], ['rejected', 'Reject with reason'], ['changes', 'Request changes']],
      states: [['default', 'Default']],
      content: [['reviewers', 'With reviewers'], ['plain', 'Decisions only']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'panel', state: 'default', content: 'reviewers' },
      props: [
        { id: 'g', label: 'Gap between parts', css: ['row-gap'], cat: 'space' },
        { id: 'hg', label: 'Gap (title to status)', css: ['column-gap'], part: '.plx-review-flow__head', cat: 'space' },
        { id: 'tt', label: 'Title color', css: ['color'], part: '.plx-review-flow__title', cat: 'color' },
        { id: 'tfs', label: 'Title size', css: ['font-size'], part: '.plx-review-flow__title', cat: 'font-size' },
        { id: 'tfw', label: 'Title weight', css: ['font-weight'], part: '.plx-review-flow__title', cat: 'font-weight' },
        { id: 'tlh', label: 'Title line height', css: ['line-height'], part: '.plx-review-flow__title', cat: 'line-height' },
        { id: 'dt', label: 'Detail color', css: ['color'], part: '.plx-review-flow__detail', cat: 'color' },
        { id: 'dfs', label: 'Detail size', css: ['font-size'], part: '.plx-review-flow__detail', cat: 'font-size' },
        { id: 'sg', label: 'Gap (label to content)', css: ['row-gap'], part: '.plx-review-flow__section', cat: 'space' },
        { id: 'lt', label: 'Section label color', css: ['color'], part: '.plx-review-flow__label', cat: 'color' },
        { id: 'lfs', label: 'Section label size', css: ['font-size'], part: '.plx-review-flow__label', cat: 'font-size' },
        { id: 'lfw', label: 'Section label weight', css: ['font-weight'], part: '.plx-review-flow__label', cat: 'font-weight' },
        { id: 'rg', label: 'Gap between reviewers', css: ['row-gap'], part: '.plx-review-flow__reviewers', cat: 'space' },
        { id: 'rh', label: 'Reviewer row height', css: ['min-block-size'], show: 'min-height', part: '.plx-review-flow__reviewer', cat: 'size' },
        { id: 'wt', label: 'Waiting color', css: ['color'], part: '.plx-review-flow__waiting', cat: 'color' },
        { id: 'cg', label: 'Gap (comment to decisions)', css: ['row-gap'], part: '.plx-review-flow__decide', cat: 'space' },
        { id: 'ag', label: 'Gap between decisions', css: ['column-gap'], part: '.plx-review-flow__actions', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var rev = content !== 'plain';
        switch (id) {
          case 'g': return RF('gap');
          case 'hg': return RF('head-gap');
          case 'tt': return RF('title-text');
          case 'tfs': return RF('title-font-size');
          case 'tfw': return RF('title-font-weight');
          case 'tlh': return RF('title-line-height');
          case 'dt': return RF('detail-text');
          case 'dfs': return RF('detail-font-size');
          case 'sg': case 'lt': case 'lfs': case 'lfw': case 'rg': case 'rh': return rev ? RF({ sg: 'section-gap', lt: 'label-text', lfs: 'label-font-size', lfw: 'label-font-weight', rg: 'reviewers-gap', rh: 'reviewer-min-height' }[id]) : null;
          case 'wt': return rev && variant !== 'approved' ? RF('waiting-text') : null;
          case 'cg': return RF('section-gap');
          case 'ag': return RF('actions-gap');
          default: return null;
        }
      },
      reach: function () { return 'every review panel'; },
      every: 'every review panel',
      html: function (variant, size, state, extraCls, ui) {
        var rev = !ui || ui.content !== 'plain';
        var status = { panel: 'in-review', human: 'in-review', approved: 'approved', rejected: 'rejected', changes: 'changes-requested' }[variant];
        var human = variant === 'human';
        var second = variant === 'approved' ? badge('approved') : '<span class="plx-review-flow__waiting">Waiting</span>';
        var reviewers = rev ? '<div class="plx-review-flow__section"><p class="plx-review-flow__label">Reviewers</p><ul class="plx-review-flow__reviewers">'
          + '<li class="plx-review-flow__reviewer">' + persona('Maya Chen', 'xs') + badge('approved') + '</li><li class="plx-review-flow__reviewer">' + persona('Alex Kim', 'xs') + second + '</li></ul></div>' : '';
        var err = variant === 'rejected' || variant === 'changes' ? 'Say why, so the author knows what to change.' : '';
        return '<section class="plx-review-flow' + (human ? ' plx-review-flow--human' : '') + ex(extraCls) + '"><div class="plx-review-flow__head"><div class="plx-review-flow__heading"><h3 class="plx-review-flow__title">' + (human ? 'Summary of the vestry minutes' : 'Easter banner, north aisle') + '</h3>'
          + '<span class="plx-review-flow__detail">' + (human ? 'Generated from Minutes, October.pdf' : 'Submitted by Jordan Avery') + '</span></div>' + badge(status) + '</div>'
          + (human ? '<div class="plx-notice plx-notice--info">' + icon('sparkle') + '<div class="plx-notice__text">Generated content. A person checks it before it is used.</div></div>' : '')
          + reviewers + '<div class="plx-review-flow__decide">' + field('Comment', '<textarea class="plx-input plx-input--textarea" tabindex="-1" rows="3"></textarea>', { description: 'Needed to reject or request changes.', error: err })
          + '<div class="plx-review-flow__actions" role="group" aria-label="Review decisions">' + btn({ variant: 'danger-secondary', text: 'Reject' }) + btn({ text: 'Request changes' }) + btn({ variant: 'primary', text: 'Approve' }) + '</div></div></section>';
      },
      labelSelector: '.plx-review-flow__title',
      parts: { g: 'A', hg: 'B', tt: 'C', tfs: 'C', tfw: 'C', tlh: 'C', dt: 'D', dfs: 'D', sg: 'E', lt: 'E', lfs: 'E', lfw: 'E', rg: 'F', rh: 'F', wt: 'F', cg: 'G', ag: 'H' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-review-flow__head', side: 'top' }, C: { part: '.plx-review-flow__title', side: 'left' }, D: { part: '.plx-review-flow__detail', side: 'left' },
        E: { part: '.plx-review-flow__label', side: 'left' }, F: { part: '.plx-review-flow__reviewers', side: 'right' }, G: { part: '.plx-review-flow__decide', side: 'left' }, H: { part: '.plx-review-flow__actions', side: 'bottom' } },
      sections: [['Head', ['g', 'hg', 'tt', 'tfs', 'tfw', 'tlh', 'dt', 'dfs']], ['Reviewers', ['sg', 'lt', 'lfs', 'lfw', 'rg', 'rh', 'wt']], ['Decisions', ['cg', 'ag']]],
      matrixLabel: 'Review flow by form', matrixColumnWidth: '--plx-ref-size-400px', statesHead: 'Forms · ' + HEAD
    });

    // ---- AssignControl (<AssignControl>): the row (picker or assignee or delegate) and its actions
    var AC = function (n) { return 'plx-comp-assign-control-' + n; };
    var picker = '<div class="plx-entity-picker plx-entity-picker--people"><div class="plx-entity-picker__field plx-input"><input class="plx-entity-picker__input" tabindex="-1" role="combobox" aria-expanded="false" aria-label="Assignee" placeholder="Search by name or email"></div></div>';
    DS.registerLab('assign-control', {
      name: 'Assign', title: 'Plenix assign control', file: 'platform/patterns/AssignControl/assign-control.css', compPrefix: /^plx-comp-assign-control-/,
      store: 'plenix-assign-control-lab-tokens', sizes: [['default', 'Default', '.plx-assign-control']],
      variants: [['assign', 'Assign (default)'], ['reassign', 'Reassign'], ['delegate', 'Delegate with dates']],
      states: [['default', 'Default']],
      content: [['set', 'Someone chosen'], ['empty', 'Nobody yet']],
      labels: { size: 'Size', variant: 'Form', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'assign', state: 'default', content: 'set' },
      props: [
        { id: 'g', label: 'Gap (who to actions)', css: ['column-gap'], cat: 'space' },
        { id: 'rg', label: 'Gap between wrapped lines', css: ['row-gap'], cat: 'space' },
        { id: 'h', label: 'Row height', css: ['min-block-size'], show: 'min-height', cat: 'control-height' },
        { id: 'pw', label: 'Picker least width', css: ['min-inline-size'], show: 'min-width', part: '.plx-assign-control__picker', cat: 'size' },
        { id: 'et', label: 'Not delegated color', css: ['color'], part: '.plx-assign-control__empty', cat: 'color' },
        { id: 'efs', label: 'Not delegated size', css: ['font-size'], part: '.plx-assign-control__empty', cat: 'font-size' },
        { id: 'dt', label: 'Dates color', css: ['color'], part: '.plx-assign-control__dates', cat: 'color' },
        { id: 'ag', label: 'Gap between actions', css: ['column-gap'], part: '.plx-assign-control__actions', cat: 'space' }
      ],
      token: function (id, size, variant, state, content) {
        var set = content !== 'empty';
        var pick = variant === 'assign' || (variant === 'reassign' && !set);
        switch (id) {
          case 'g': return AC('gap');
          case 'rg': return AC('row-gap');
          case 'h': return variant === 'reassign' && set ? AC('assigned-min-height') : AC('min-height');
          case 'pw': return pick ? AC('picker-min-width') : null;
          case 'et': return variant === 'delegate' && !set ? AC('empty-text') : null;
          case 'efs': return variant === 'delegate' && !set ? AC('empty-font-size') : null;
          case 'dt': return variant === 'delegate' && set ? AC('dates-text') : null;
          case 'ag': return AC('actions-gap');
          default: return null;
        }
      },
      reach: function (full) { return /assigned-min-height/.test(full) ? 'every assign row with an assignee' : 'every assign row'; },
      every: 'every assign row',
      html: function (variant, size, state, extraCls, ui) {
        var set = !ui || ui.content !== 'empty';
        var cls = 'plx-assign-control' + ex(extraCls);
        if (variant === 'delegate') {
          return '<div class="' + cls + ' plx-assign-control--delegate" role="group" aria-label="Approvals"><div class="plx-assign-control__who">'
            + (set ? persona('Alex Kim', 'sm', '<span class="plx-assign-control__dates">' + data('Oct 20 – 27, 2026') + '</span>') : '<span class="plx-assign-control__empty">Not delegated</span>') + '</div>'
            + '<div class="plx-assign-control__actions">' + (set ? btn({ variant: 'ghost', size: 'sm', icon: 'pencil', text: 'Change' }) + btn({ variant: 'ghost', size: 'sm', text: 'End delegation' }) : btn({ variant: 'ghost', size: 'sm', icon: 'forward', text: 'Delegate' })) + '</div></div>';
        }
        if (variant === 'reassign' && set) {
          return '<div class="' + cls + ' plx-assign-control--assigned" role="group" aria-label="Assignee"><div class="plx-assign-control__who">' + persona('Maya Chen', 'sm', 'Designer · Brand team') + '</div>'
            + '<div class="plx-assign-control__actions">' + btn({ variant: 'ghost', size: 'sm', icon: 'person', text: 'Reassign' }) + btn({ variant: 'ghost', size: 'sm', text: 'Unassign' }) + '</div></div>';
        }
        return '<div class="' + cls + '" role="group" aria-label="Assignee"><div class="plx-assign-control__picker">' + picker + '</div><div class="plx-assign-control__actions">'
          + (variant === 'reassign' ? btn({ variant: 'ghost', size: 'sm', text: 'Cancel' }) : btn({ variant: 'ghost', size: 'sm', icon: 'person', text: 'Assign to me' })) + '</div></div>';
      },
      labelSelector: '.plx-assign-control__actions',
      parts: { g: 'A', rg: 'A', h: 'A', pw: 'B', et: 'C', efs: 'C', dt: 'C', ag: 'D' },
      anchors: { A: { part: null, side: 'left' }, B: { part: '.plx-assign-control__picker', side: 'bottom' }, C: { part: '.plx-assign-control__who', side: 'bottom' }, D: { part: '.plx-assign-control__actions', side: 'right' } },
      sections: [['Row', ['g', 'rg', 'h']], ['Who', ['pw', 'et', 'efs', 'dt']], ['Actions', ['ag']]],
      matrixLabel: 'Assign by form', matrixColumnWidth: '--plx-ref-size-560px', statesHead: 'Forms · ' + HEAD
    });
  })();
}
