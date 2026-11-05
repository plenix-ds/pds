/* Plenix design system · the Web item page template (owner, 2026-10-21): the sections every Web item page shows, in this
   order, with the fixed rows, columns and parts inside each, and the variant block every variant uses. The one source:
   spec.js orders and titles its sections from it, STANDARD.md §7 states it, check-spec.js checks both against it.
   iOS and Android pages keep their own list until #221.
   shown: 'always' (every item page; "Not written yet" when empty) or 'when' (only where `when` applies).
   rows: a Name/Value table's row names. columns: a table's columns. parts: fixed sub-parts, in order. */
window.DSPageTemplate = {
  sections: [
    { key: 'purpose', title: 'Overview and Purpose', shown: 'always', rows: ['Overview', 'Purpose'], optionalRows: ['Common ground', 'Sources', 'Used by'] },
    { key: 'guide', title: 'Usage', shown: 'always', parts: ['When to use', 'When not to use'] },
    { key: 'exh', title: 'Variants', shown: 'always', block: 'variant', note: 'Base, then each variant, each in the variant block. Base holds what every variant shares; a variant shows only what it changes.' },
    { key: 'lab', title: 'Lab', shown: 'when', when: 'the item has a lab', rows: ['Every variant in every state', 'The drawing and Edit'] },
    { key: 'states', title: 'States', shown: 'when', when: 'an interactive item', columns: ['State', 'Looks', 'Set by', 'Changes'],
      stateList: ['Default', 'Hover', 'Focus', 'Active', 'Selected', 'Disabled', 'Read-only', 'Loading', 'Error', 'Success'] },
    { key: 'anat', title: 'Anatomy', shown: 'always', rows: ['Parts (required, optional, slots)', 'Block', 'Elements', 'Variants (modifiers)', 'States (classes)', 'States (pseudo-classes, attributes)'], codeRows: ['Block', 'Elements', 'Variants (modifiers)', 'States (classes)', 'States (pseudo-classes, attributes)'] },
    { key: 'behavior', title: 'Behavior', shown: 'always', rows: ['Mouse and touch', 'Keyboard', 'Focus', 'Responsive', 'Density', 'Motion', 'Loading', 'Error'] },
    { key: 'a11y', title: 'Accessibility', shown: 'always', rows: ['Semantic role', 'ARIA attributes', 'Accessible name', 'Screen-reader announcements', 'Focus management', 'Contrast', 'Reduced motion', 'Every control'] },
    { key: 'content', title: 'Content guidance', shown: 'always', rows: ['Labels', 'Action copy', 'Error messages', 'Localization'] },
    { key: 'spec', title: 'Specification', shown: 'when', when: 'a foundation, or an item with rules of its own', note: 'The item’s own rules, tables and values; its own parts sit inside this section.' },
    { key: 'api', title: 'Development and API', shown: 'when', when: 'a component with a source file', parts: ['Code usage', 'Props', 'Code behavior', 'Notes'], propsColumns: ['Prop', 'Type', 'Default', 'Description'] },
    { key: 'impl', title: 'Implementation', shown: 'always', rows: ['React', 'HTML / CSS', 'Vue, Angular, Web components, native'], tabs: ['Use in code', 'JSX', 'CSS', 'Classes', 'Tokens'] },
    { key: 'platforms', title: 'Platforms', shown: 'when', when: 'the item has counterparts on iOS or Android', parts: ['Counterparts on the other platforms', 'Functional equivalent', 'Platform specification', 'Apple iOS kit in Figma'] },
    { key: 'assets', title: 'Design assets', shown: 'always', rows: ['Token references', 'Icon references', 'Template references'] },
    { key: 'rel', title: 'Related items', shown: 'always' },
    { key: 'map', title: 'Source-system mappings', shown: 'always', columns: ['Source system', 'Source component', 'Match type', 'Notes'] },
    { key: 'details', title: 'Details and Lifecycle', shown: 'always', rows: ['Canonical name', 'Canonical ID', 'Category', 'Aliases', 'Plenix', 'Component level', 'Interaction', 'Scope', 'Status', 'Owner', 'Last reviewed', 'Version'], optionalRows: ['Also answers'] }
  ],
  // the variant block: Base and every variant, the same fields in the same order (owner, 2026-10-21)
  variant: [
    { key: 'figma', title: 'Figma design', holds: 'The variant’s own Figma node and its link; "Not in Figma yet" until it exists' },
    { key: 'styles', title: 'Styles', holds: 'Its modifier class and the tokens it sets (component tokens, by role)' },
    { key: 'attributes', title: 'Attributes', holds: 'The props and values that select it, and the props it adds' },
    { key: 'states', title: 'States', holds: 'The states it adds or changes (State, Looks, Set by, Changes)' },
    { key: 'behavior', title: 'Behavior', holds: 'What it does differently: mouse and touch, keyboard, focus, responsive, density, motion' },
    { key: 'a11y', title: 'Accessibility', holds: 'What changes for assistive technology, if anything' },
    { key: 'example', title: 'Example', holds: 'The live drawing' }
  ]
};
