/* Plenix design system · W15B page-action positioning over existing tokens. */
if (window.DS && DS.registerLab) {
  var lab = { name: 'Page actions bar', title: 'Page actions bar', file: 'platform/patterns/ActionBar/action-bar.css', compPrefix: /^plx-comp-action-bar-/,
    store: 'plenix-w15b-page-actions', sizes: [['default', 'Default', '.plx-action-bar']], variants: [['sticky', 'Sticky bottom'], ['static', 'Embedded']],
    states: [['default', 'Default']], content: [['actions', 'Cancel and save']], labels: { size: 'Size', variant: 'Position', state: 'State', content: 'Actions' },
    defaults: { size: 'default', variant: 'sticky', state: 'default', content: 'actions' },
    props: [{ id: 'gap', label: 'Action gap', css: ['column-gap'], cat: 'space' }, { id: 'background', label: 'Surface', css: ['background-color'], cat: 'color' }],
    token: function (id) { return 'plx-comp-action-bar-' + (id === 'gap' ? 'gap' : 'background'); }, every: 'Inspect each existing role.',
    html: function (variant, size, state, extra) { return '<div class="plx-action-bar' + (variant === 'static' ? ' plx-action-bar--static' : '') + (extra ? ' ' + extra : '') + '" role="group" aria-label="Profile actions"><button type="button" class="plx-button plx-button--secondary plx-button--size-md"><span class="plx-button__label">Cancel</span></button><button type="button" class="plx-button plx-button--primary plx-button--size-md"><span class="plx-button__label">Save changes</span></button></div>'; } };
  DS.registerLab('page-actions', lab);
}
