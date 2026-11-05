/* Plenix design system · library part w00C: the written sections of the color group pages (the color groups, owner
   2026-10-13). A group is a set of roles, so the sections it shares with every other group (behavior, focus, motion) are
   written once below; each group adds its purpose, anatomy, contrast and content guidance. */
(function () {
  var NA = 'Not applicable: colors are values, not interactive elements.';
  var behavior = function (extra) {
    return Object.assign({
      pointer: NA, keyboard: NA,
      focus: 'Not applicable: the focus indicator is the Interactive role focus-ring-color, whatever the group of the element.',
      responsive: 'The same at every window size and density. The roles switch with the mode (light or dark) on <html> or on a themed region.',
      motion: 'None of their own: a change of color follows the element’s transition.',
      loading: 'Not applicable: a loading region shows the skeleton roles.',
      error: 'Not applicable: an error is shown with the Semantic danger roles and words.'
    }, extra || {});
  };
  var a11y = function (contrast) {
    return { name: 'Not applicable: a color has no name; the element it colors is named in words.', announce: 'Nothing: color is never announced; the state or meaning is in the text.',
      focus: 'Not applicable.', contrast: contrast, motion: 'Not applicable.' };
  };
  var content = function (labels) {
    return { labels: labels, actions: 'Not applicable.', errors: 'Not applicable.', localization: 'Colors carry no text; the meaning of a color is written next to it, in the reader’s language.' };
  };
  var groupRow = 'Group — the role’s $extensions.plenix.group in the token source; exactly one (check-style rule color-groups) (required)';
  var modes = 'Light and dark values — each role points to a palette color in each mode (platform/tokens/theme-default.light/.dark.tokens.json) (required)';

  DSParts.docs.push({
    'color-neutral': {
      purpose: 'Most of an interface is gray: the canvas, surfaces, text, edges and quiet controls. The gray ramp gives each of those a step. The neutral fill gives secondary buttons, chips and tags one gray that works in light and dark mode, so the colored roles stand out where they mean something.',
      anatomy: ['The gray ramp — --plx-ref-color-white, gray-75 to gray-950 and black: the palette’s Gray family (required)', 'The neutral fill — fill-neutral, its hover, pressed, border and content roles (required)', groupRow, modes],
      behavior: behavior({ pointer: 'The neutral fill darkens under the pointer (fill-neutral-hover) and when pressed (fill-neutral-pressed).' }),
      a11y: a11y('fill-neutral-content on fill-neutral meets the text rule (4.5:1) in light and dark (Contrast rules).'),
      content: content('Name a neutral control by what it does; its gray says nothing on its own.')
    },
    'color-brand': {
      purpose: 'People recognize Plenix by its blue. One brand role carries that blue to the logo, the brand mark, product tiles and the header band, so the brand looks the same on every page and in both modes. The brand can change in one place without touching the action or information colors that share its value today.',
      anatomy: ['brand-primary — the brand blue, blue-400 in light and dark (required)', 'brand-on-primary — text and icons on the brand blue, white (required)', groupRow, modes],
      behavior: behavior(),
      a11y: a11y('brand-on-primary on brand-primary meets the text rule (4.8:1) in both modes. The brand mark itself is a logo: WCAG exempts logotypes from the contrast minimums, but text set in the brand blue still meets the text rule.'),
      content: content('The product name next to the mark is written in the content color, not in the brand blue.')
    },
    'color-accent': {
      purpose: 'The application header is the one band of strong color on every page. The accent roles color that band and everything placed on it, so the header’s search, buttons and menus stay readable on it and the rest of the page keeps the neutral surfaces.',
      anatomy: ['Accent surface — accent-surface (the header band) and accent-surface-raised (required)', 'On the accent — accent-content, accent-content-muted, accent-border, accent-edge (required)', 'Fields and states on the accent — accent-field-*, accent-state-hover, accent-state-pressed (optional)', 'Frost — frost-surface, frost-border, frost-field-background, frost-state-selected: the light header tone (optional)', groupRow, modes],
      behavior: behavior({ pointer: 'Items on the accent take accent-state-hover under the pointer and accent-state-pressed when pressed.' }),
      a11y: a11y('accent-content on accent-surface meets the text rule in light and dark (Contrast rules).'),
      content: content('Text on the accent is short: the application name, a search placeholder, action labels.')
    },
    'color-semantic': {
      purpose: 'Messages tell people something happened: it worked, it needs attention, it failed. The semantic tones give each kind of message one color family, with solids, soft fills and the text on each, so the same kind of message looks the same everywhere and is readable in both modes.',
      anatomy: ['Tones — neutral, info, success, warning (orange: action or correction required; orange replaces brown for statuses, owner 2026-10-14), danger (required)', 'Solid — feedback-<tone>-solid with feedback-<tone>-on-solid, the badge fill (-solid-label) and edge (-solid-border) (required)', 'Soft — feedback-<tone>-soft, its edge (-soft-border) and the text on it (-content) (required)', groupRow, modes],
      behavior: behavior(),
      a11y: a11y('Text on the soft fills and on the solids meets the text rule; the solids meet 3:1 on the surface as marks (Contrast rules). The tone is never the only signal: an icon or words say it.'),
      content: content('Say what happened and what to do next; the tone sets the weight, the words carry the meaning.')
    },
    'color-surface': {
      purpose: 'Surfaces tell people what belongs together and what is on top. The surface roles set the canvas, the panels and cards on it, and the menus and dialogs above them, in light and dark mode, so layers read the same in every application.',
      anatomy: ['Canvas — surface-canvas, the page (required)', 'Surfaces — surface-default, surface-raised, surface-overlay, surface-sunken, surface-inverse (required)', 'Special surfaces — surface-dialog-chrome, surface-media, surface-media-raised, the scrim, read-only-background, virtual-sticky-background (optional)', groupRow, modes],
      behavior: behavior(),
      a11y: a11y('The Text roles meet the text rule on every surface they are used on (Contrast rules, measured in both modes).'),
      content: content('Not applicable: surfaces hold content; they carry none.')
    },
    'color-text': {
      purpose: 'Text has to be read. The text roles give body text, secondary text, links and the text on special surfaces one color each, and each meets the contrast rules on its surfaces. Hierarchy comes from size, weight and position, not from fading text away.',
      anatomy: ['Body — content-default, content-muted, content-subtle (required)', 'States — content-disabled, content-inverse (required)', 'Links — content-link, content-link-visited (required)', 'On special surfaces — content-dialog-chrome, content-on-media, content-on-media-muted (optional)', 'Fields — field-placeholder, read-only-content (optional)', groupRow, modes],
      behavior: behavior({ pointer: 'Links keep their color under the pointer; their underline marks them (Link).' }),
      a11y: a11y('Every text role meets 4.5:1 on its surfaces in light and dark (Contrast rules). Disabled text is exempt and carries no meaning of its own.'),
      content: content('Muted text is for metadata and descriptions, never for the only copy of something people need.')
    },
    'color-border': {
      purpose: 'Edges show where a card ends and where a control can be used. The border roles give separators, card edges and control edges each their weight, so a control is always seen (3:1) and decoration stays quiet.',
      anatomy: ['Edges — border-default, border-subtle, border-strong (required)', 'Dividers — border-divider between list items, border-separator (gray 250) between the groups of a menu (optional)', 'Special edges — border-dialog-chrome, border-media, read-only-border (optional)', groupRow, modes],
      behavior: behavior(),
      a11y: a11y('Edges that identify a control (border-strong, the control edge) meet the non-text rule (3:1) on their surface (Contrast rules).'),
      content: content('Not applicable.')
    },
    'color-interactive': {
      purpose: 'People need to see what they can act on, where focus is and what they picked. The interactive roles color actions, states and controls the same way in every component, so hover, pressed, selected and focus look alike across the system.',
      anatomy: ['Actions — action-primary-*, action-danger-* with their hover and pressed values (required)', 'States — state-hover, state-pressed, state-selected, state-selected-pressed and their edges (required)', 'Focus — focus-ring-color (required)', 'Controls — control-background, control-border (required)', 'Selection — selected-border, selected-content (optional)', groupRow, modes],
      behavior: behavior({ pointer: 'Hover and pressed roles apply while the pointer is over or pressing an interactive element; selected roles while it is selected.', focus: 'focus-ring-color draws every focus indicator; a focused field changes only its border color.' }),
      a11y: a11y('Button labels meet the text rule on their fills; the focus color and control edges meet 3:1 (Contrast rules).'),
      content: content('Action labels are verbs; the danger color is for destructive actions only, with words that say what is lost.')
    },
    'color-status': {
      purpose: 'People check at a glance whether someone is available and where work stands. The status roles give presence and workflow states one color each, kept apart from message colors, so a green dot always means the same thing and is seen in both modes.',
      anatomy: ['Presence — status-online, status-away, status-busy, status-dnd, status-offline (required)', 'Workflow — status-done, status-in-progress, status-blocked, status-not-started (required)', groupRow, modes],
      behavior: behavior(),
      a11y: a11y('Each status role meets the non-text rule (3:1) on surface-default in light and dark (Contrast rules); the state is also given in words.'),
      content: content('Name the state in words (“Away”, “Blocked”) next to the dot or as its label.')
    }
  });
})();
