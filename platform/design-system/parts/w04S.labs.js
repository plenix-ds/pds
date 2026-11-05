/* Plenix design system · library part w04S (the settings cards, 2026-10-13): the lab of the settings page's section card
   (<SettingsSection>, section.plx-settings__section). Two kinds: static (the title, a description, the rows) and
   collapsible (the whole header is a button inside the h2 that opens and closes the rows; the chevron points down when
   open). Each value with the one --plx-comp-settings-* token behind it; the markup is what SettingsSection renders. */
if (window.DS && DS.registerLab) {
  (function () {
    var CORNERS = ['border-bottom-left-radius', 'border-bottom-right-radius', 'border-top-left-radius', 'border-top-right-radius'];
    var BORDER_COLORS = ['border-bottom-color', 'border-left-color', 'border-right-color', 'border-top-color'];
    var BORDER_WIDTHS = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'];
    var HEAD = 'every value (click one to inspect it; the dashed outline marks the one shown below)';
    var ex = function (extraCls) { return extraCls ? ' ' + extraCls : ''; };
    var T = function (n) { return 'plx-comp-settings-' + n; };
    var HEADER = '.plx-settings__section-header', TITLE = '.plx-settings__section-title', DESC = '.plx-settings__section-description';
    var TOGGLE = '.plx-settings__section-toggle', CHEVRON = '.plx-settings__section-chevron', ROW = '.plx-settings__row';
    var LABEL = '.plx-settings__row-label', RDESC = '.plx-settings__row-description';
    var SWITCH = function (label) { return '<label class="plx-switch"><input type="checkbox" role="switch" class="plx-switch__input" checked aria-label="' + label + '" tabindex="-1"><span class="plx-switch__track" aria-hidden="true"></span></label>'; };
    var row = function (label, desc) {
      return '<div class="plx-settings__row"><div class="plx-settings__row-text"><div class="plx-settings__row-label">' + label + '</div>'
        + (desc ? '<div class="plx-settings__row-description">' + desc + '</div>' : '') + '</div><div class="plx-settings__row-control">' + SWITCH(label) + '</div></div>';
    };

    DS.registerLab('settings-page', {
      name: 'Settings section', title: 'Plenix settings section', file: 'platform/patterns/SettingsLayout/settings-layout.css', compPrefix: /^plx-comp-settings-/,
      store: 'plenix-settings-section-lab-tokens', sizes: [['default', 'Default', '.plx-settings__section']],
      variants: [['static', 'Static (default)'], ['collapsible', 'Collapsible']],
      states: [['default', 'Default'], ['hover', 'Hover'], ['focus', 'Focus'], ['collapsed', 'Collapsed']],
      content: [['rows', 'Title, description and rows']],
      labels: { size: 'Size', variant: 'Kind', state: 'State', content: 'Content' },
      defaults: { size: 'default', variant: 'static', state: 'default', content: 'rows' },
      props: [
        { id: 'bg', label: 'Card background', css: ['background-color'], cat: 'color' },
        { id: 'bc', label: 'Card border color', css: BORDER_COLORS, show: 'border-top-color', cat: 'color' },
        { id: 'bw', label: 'Card border width', css: BORDER_WIDTHS, show: 'border-top-width', cat: 'border-width' },
        { id: 'rad', label: 'Card corner radius', css: CORNERS, show: 'border-top-left-radius', cat: 'radius', extra: ['0'] },
        { id: 'px', label: 'Card padding left & right', css: ['padding-inline-start', 'padding-inline-end'], show: 'padding-right', cat: 'space', extra: ['0'] },
        { id: 'pb', label: 'Card padding bottom', css: ['padding-block-end'], show: 'padding-bottom', cat: 'space', extra: ['0'] },
        { id: 'hp', label: 'Header padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: HEADER, cat: 'space', extra: ['0'] },
        { id: 'hbc', label: 'Header divider color', css: ['border-bottom-color'], part: HEADER, cat: 'color' },
        { id: 'hbw', label: 'Header divider width', css: ['border-bottom-width'], part: HEADER, cat: 'border-width' },
        { id: 'tc', label: 'Title color', css: ['color'], part: TITLE, cat: 'color' },
        { id: 'tff', label: 'Title font', css: ['font-family'], part: TITLE, cat: 'font' },
        { id: 'tfs', label: 'Title font size', css: ['font-size'], part: TITLE, cat: 'font-size' },
        { id: 'tfw', label: 'Title font weight', css: ['font-weight'], part: TITLE, cat: 'font-weight' },
        { id: 'dc', label: 'Description color', css: ['color'], part: DESC, cat: 'color' },
        { id: 'dfs', label: 'Description font size', css: ['font-size'], part: DESC, cat: 'font-size' },
        { id: 'dmt', label: 'Space above the description', css: ['margin-block-start'], show: 'margin-top', part: DESC, cat: 'space', extra: ['0'] },
        { id: 'th', label: 'Header button least height', css: ['min-block-size'], show: 'min-height', part: TOGGLE, cat: 'control-height' },
        { id: 'tg', label: 'Gap (title to chevron)', css: ['column-gap'], part: TOGGLE, cat: 'space', extra: ['0'] },
        { id: 'cc', label: 'Chevron color', css: ['color'], part: CHEVRON, cat: 'color' },
        { id: 'fo', label: 'Focus ring color', css: ['outline-color'], part: TOGGLE, cat: 'color' },
        { id: 'fow', label: 'Focus ring width', css: ['outline-width'], part: TOGGLE, cat: 'border-width' },
        { id: 'fof', label: 'Focus ring offset', css: ['outline-offset'], part: TOGGLE, cat: 'space' },
        { id: 'rp', label: 'Row padding top & bottom', css: ['padding-block-start', 'padding-block-end'], show: 'padding-top', part: ROW, cat: 'space', extra: ['0'] },
        { id: 'rgap', label: 'Row gap (label to control)', css: ['column-gap'], part: ROW, cat: 'space', extra: ['0'] },
        { id: 'rbc', label: 'Row divider color', css: ['border-bottom-color'], part: ROW, cat: 'color' },
        { id: 'rbw', label: 'Row divider width', css: ['border-bottom-width'], part: ROW, cat: 'border-width' },
        { id: 'lc', label: 'Row label color', css: ['color'], part: LABEL, cat: 'color' },
        { id: 'lfs', label: 'Row label font size', css: ['font-size'], part: LABEL, cat: 'font-size' },
        { id: 'lfw', label: 'Row label font weight', css: ['font-weight'], part: LABEL, cat: 'font-weight' },
        { id: 'rdc', label: 'Row description color', css: ['color'], part: RDESC, cat: 'color' },
        { id: 'rdfs', label: 'Row description font size', css: ['font-size'], part: RDESC, cat: 'font-size' }
      ],
      token: function (id, size, variant, state) {
        var coll = variant === 'collapsible', open = !(coll && state === 'collapsed');
        switch (id) {
          case 'bg': return T('section-card-background');
          case 'bc': return T('section-card-border-color');
          case 'bw': return T('section-card-border-width');
          case 'rad': return T('section-card-radius');
          case 'px': return T('section-card-padding-inline');
          case 'pb': return open ? T('section-card-padding-block') : null;
          case 'hp': return coll ? null : T('section-header-padding-block');
          case 'hbc': return open ? T('section-header-border-bottom-color') : null;
          case 'hbw': return open ? T('section-header-border-bottom-width') : null;
          case 'tc': return T('section-title-text');
          case 'tff': return T('section-title-font-family');
          case 'tfs': return T('section-title-font-size');
          case 'tfw': return T('section-title-font-weight');
          case 'dc': return T('section-description-text');
          case 'dfs': return T('section-description-font-size');
          case 'dmt': return T('section-description-margin-block-start');
          case 'th': return coll ? T('section-toggle-min-height') : null;
          case 'tg': return coll ? T('section-toggle-gap') : null;
          case 'cc': return coll ? (state === 'hover' ? T('section-toggle-hover-text') : T('section-chevron-text')) : null;
          case 'fo': return coll && state === 'focus' ? T('section-toggle-focus-outline-color') : null;
          case 'fow': return coll && state === 'focus' ? T('section-toggle-focus-outline-width') : null;
          case 'fof': return coll && state === 'focus' ? T('section-toggle-focus-outline-offset') : null;
          case 'rp': return open ? T('row-padding-block') : null;
          case 'rgap': return open ? T('row-gap') : null;
          case 'rbc': return open ? T('row-border-bottom-color') : null;
          case 'rbw': return open ? T('row-border-bottom-width') : null;
          case 'lc': return open ? T('row-label-text') : null;
          case 'lfs': return open ? T('row-label-font-size') : null;
          case 'lfw': return open ? T('row-label-font-weight') : null;
          case 'rdc': return open ? T('row-description-text') : null;
          case 'rdfs': return open ? T('row-description-font-size') : null;
          default: return null;
        }
      },
      reach: function (full) {
        if (/settings-section-(toggle|chevron)-/.test(full)) return 'every collapsible settings section';
        if (/settings-row-/.test(full)) return 'every settings row';
        return 'every settings section';
      },
      every: 'every settings section',
      html: function (variant, size, state, extraCls) {
        var coll = variant === 'collapsible', open = !(coll && state === 'collapsed');
        var title = coll
          ? '<button type="button" tabindex="-1" class="plx-settings__section-toggle' + (state === 'hover' ? ' is-hover' : '') + (state === 'focus' ? ' is-focus-visible' : '') + '" aria-expanded="' + open + '">'
            + '<span class="plx-settings__section-label">Behavior</span>' + DS.icon('chevron-down', 'plx-settings__section-chevron') + '</button>'
          : '<span>Behavior</span>';
        return '<div class="ds-w04s-frame"><section class="plx-settings__section' + (coll ? ' plx-settings__section--collapsible' : '') + (open ? '' : ' is-collapsed') + ex(extraCls) + '">'
          + '<div class="plx-settings__section-header"><h2 class="plx-settings__section-title">' + title + '</h2>'
          + '<p class="plx-settings__section-description">How the applications move and respond.</p></div>'
          + '<div class="plx-settings__section-body"' + (open ? '' : ' hidden') + '><div class="plx-settings__rows">'
          + row('Animations', 'Turn off for reduced motion') + row('Sounds') + '</div></div></section></div>';
      },
      labelSelector: TITLE,
      parts: { bg: 'A', rad: 'A', bc: 'B', bw: 'B', px: 'C', pb: 'C', hp: 'D', hbc: 'D', hbw: 'D', tc: 'E', tff: 'E', tfs: 'E', tfw: 'E', dc: 'F', dfs: 'F', dmt: 'F',
        th: 'G', tg: 'G', cc: 'G', fo: 'G', fow: 'G', fof: 'G', rp: 'H', rgap: 'H', rbc: 'H', rbw: 'H', lc: 'I', lfs: 'I', lfw: 'I', rdc: 'J', rdfs: 'J' },
      anchors: { A: { part: null, side: 'top' }, B: { part: null, side: 'left' }, C: { part: null, side: 'bottom' }, D: { part: HEADER, side: 'left' }, E: { part: TITLE, side: 'top' },
        F: { part: DESC, side: 'right' }, G: { part: CHEVRON, side: 'right' }, H: { part: ROW, side: 'right' }, I: { part: LABEL, side: 'left' }, J: { part: RDESC, side: 'bottom' } },
      sections: [['Card', ['bg', 'bc', 'bw', 'rad', 'px', 'pb']], ['Header', ['hp', 'hbc', 'hbw']], ['Title', ['tc', 'tff', 'tfs', 'tfw']], ['Description', ['dc', 'dfs', 'dmt']],
        ['Collapse toggle', ['th', 'tg', 'cc', 'fo', 'fow', 'fof']], ['Rows', ['rp', 'rgap', 'rbc', 'rbw', 'lc', 'lfs', 'lfw', 'rdc', 'rdfs']]],
      matrixLabel: 'Settings section values by kind and state',
      statesHead: 'Kinds and states · ' + HEAD
    });
  })();
}
