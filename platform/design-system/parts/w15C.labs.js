/* Plenix · w15C has no new visual styling primitives; the locale lab reuses the Text body roles. */
if (window.DS && DS.registerLab && DS.labs && DS.labs.text) {
  (function () {
    var base = DS.labs.text;
    DS.registerLab('internationalization', Object.assign({}, base, {
      name: 'Internationalization', title: 'Localized text roles', file: 'platform/components/Text/text.css', store: 'plenix-w15c-locale-lab',
      variants: [['body', 'Body']], states: [['default', 'Default']], sizes: [['default', 'Default', '.plx-text']],
      content: [['provider', 'LocaleProvider'], ['catalog', 'Message catalog'], ['plural', 'Plural rules'], ['strings', 'Strings props']],
      defaults: { size: 'default', variant: 'body', state: 'default', content: 'provider' },
      html: function (variant, size, state, extra, ui) {
        var labels = { provider: 'A scoped locale', catalog: 'Save', plural: '2 items selected', strings: 'Show more' };
        return '<span class="plx-text plx-text--body' + (extra ? ' ' + extra : '') + '">' + labels[(ui || {}).content || 'provider'] + '</span>';
      }
    }));
  })();
}
