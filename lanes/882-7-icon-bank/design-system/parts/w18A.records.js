/* Plenix design system · library part w18A: How to add an icon (the Iconography page). Every icon in an application, the
   Asset Manager or this design system comes from the icon bank (platform/icons/: map.json over library/, and custom/), drawn
   by the Icon component. The page says how a new one gets into the bank, by concept or by SVG, and that a custom icon
   follows the same rules as the 4,150 symbols of the library. */
DSParts.records.push(function (H) {
  var h = H.h, P = H.P, box = H.box, M = H.record('icon');
  if (!M) return [];
  var table = function (label, cols, rows) {
    return h(P.Table, { label: label, data: rows.map(function (x, i) { return Object.assign({ id: i + 1 }, x); }),
      columns: cols.map(function (c, i) { return Object.assign({ title: c[0], field: c[1], kind: c[2] || 'wrap' }, i === 0 ? { rowLabel: true, width: '--plx-ref-size-240px' } : {}); }) });
  };
  return [{
    id: 'foundations-how-to-add-an-icon', sec: 'foundations', sub: 'Iconography', leaf: 'How to add an icon', title: 'How to add an icon',
    plenix: M.plenix, src: M.src, also: M.also, css: M.css, blocks: M.blocks, level: M.level, interaction: M.interaction, icon: M.icon || H.iconOf('icon'), variantClasses: [],
    related: ['icon', 'icon-inventory', 'foundations-icon-modules-and-delivery'],
    text: 'Every icon is drawn from the icon bank by the Icon component: never an inline drawing, never a hand-made icon component. A new icon gets into the bank one of two ways. Name the concept, and Plenix shows two or three matching symbols from the 4,150 in platform/icons/library/; the one chosen is added to platform/icons/map.json, unedited. Or give an SVG: tools/icons/check-icon.js tests it against platform/standards/icons.md, and an SVG that passes goes into platform/icons/custom/ as the same four files. A custom icon follows the same rules as a library symbol.',
    use: ['Name the concept when no icon exists yet ("a receipt"): choose from the two or three symbols shown', 'Give an SVG only when the library has no symbol for the concept', 'One name per symbol: a symbol already in map.json keeps its Plenix name'],
    avoid: ['Drawing an icon inline (an svg element or a path in a component): the check-system rule icon-bank fails it', 'Editing a library file, or redrawing, re-padding or re-weighting a symbol', 'Mixing in another icon set without an owner decision'],
    examples: [['The two ways in', function () { return box(null, table('How to add an icon', [['Way', 'way'], ['Steps', 'steps']], [
      { way: 'Name a concept', steps: '1. Say the concept (a receipt, a handshake). 2. Plenix shows two or three matching symbols from the 4,150 in platform/icons/library/. 3. You choose one. 4. Its Plenix name (the symbol with dashes) is added to platform/icons/map.json, and the symbol\'s four files are used unedited. 5. node build-app.js writes the icon names, the stylesheet and the page icon files.' },
      { way: 'Give an SVG', steps: '1. Give the SVG. 2. node tools/icons/check-icon.js <file.svg> tests it against platform/standards/icons.md (the canvas, the two optical sizes, the line weights, the corners); a failing file lists what to fix. 3. A file that passes goes into platform/icons/custom/ as the same four files (<name>.svg, <name>-fill.svg, <name>-24.svg, <name>-24-fill.svg). 4. It is listed in platform/icons/custom/README.md with the owner\'s decision, then node build-app.js.' },
      { way: 'The same rules', steps: 'A custom icon is built to the same guidance as a library symbol: one color, the Plenix canvas (viewBox 0 -960 960 960), outline and filled, optical sizes 20 and 24. It is used by its Plenix name, like any other: <Icon name="receipt-long" />.' },
      { way: 'What is checked', steps: 'check-system: icon-names (a name must be in map.json) and icon-bank (applications, the Asset Manager and this design system draw no inline svg; allowed are a component\'s own drawing with its plx- class, charts, the brand logo and the Icon component itself).' }])); }]]
  }];
});
