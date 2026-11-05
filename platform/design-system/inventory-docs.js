/* Plenix design system · the written sections of the built items (batch 208): purpose, anatomy, behavior,
   accessibility and content guidance, keyed by record id. Written from each item's code and the enterprise systems'
   common ground; spec.js fills the item pages from it (a record's own fields win). Edit here. */
window.DSDocs = {
 "design-tokens": {
  "purpose": "Design tokens give every visual value one name, so the whole product stays consistent and a value can change in one place. People see the same colors, sizes and spacing on every page, in light and dark mode and at every density.",
  "anatomy": [
   "Reference tokens — raw values named by kind and value, --plx-ref-{kind}-{value} (required)",
   "Semantic tokens — stable roles named for their intent, --plx-sys-* (required)",
   "Component tokens — aliases used only inside the owning component's stylesheet, --plx-comp-* (optional)",
   "Theme — resolves every color and elevation role for light and dark (required)",
   "Density and interaction contexts — re-declare the roles that depend on density or on touch and mobile (required)",
   "Token source — platform/tokens/*.tokens.json, from which build-tokens.js generates the token CSS (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: tokens are values, not interactive elements.",
   "keyboard": "Not applicable: tokens are values, not interactive elements.",
   "focus": "Not applicable: tokens hold the focus ring values (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset) but take no focus themselves.",
   "responsive": "Density roles are declared on :root and on every [data-plx-density] context, and touch and mobile override them, so a region can be denser than its page and the environment still wins. Spacing and control sizes are in rem, so they follow the person's font settings.",
   "motion": "None of its own; the motion tokens (--plx-ref-motion-duration-*, --plx-sys-motion-ease-standard) feed every transition.",
   "loading": "Not applicable: tokens are static values.",
   "error": "Not applicable: tokens have no state. Stylelint (npm run lint:css) fails the build when a stylesheet uses a raw value or a palette color directly, and node check-style.js when a file uses an undeclared token."
  },
  "a11y": {
   "name": "Not applicable: tokens are not rendered elements.",
   "announce": "Nothing: tokens are not rendered elements.",
   "focus": "Focus rings take --plx-sys-focus-ring-color and --plx-sys-focus-ring-offset; components set the ring width from a border-width token.",
   "contrast": "Contrast is decided once in the theme roles (content, surface, border) for each mode, so components that use roles stay readable in light and dark.",
   "motion": "Durations come from tokens, and system/motion.css sets every duration to zero when the person asks for reduced motion."
  },
  "content": {
   "labels": "Name a reference token by its value (--plx-ref-space-16px) and a semantic token by its intent (--plx-sys-space-inset-md). Use American English in names (color, gray).",
   "actions": "Not applicable: tokens have no actions.",
   "errors": "Not applicable: tokens show no error text.",
   "localization": "Use logical properties with spacing tokens (padding-inline-start) so right-to-left works. Sizes in rem follow the person's root font size."
  },
  "related": [
   "color",
   "typography",
   "spacing",
   "radius",
   "shadows",
   "themes"
  ]
 },
 "color": {
  "purpose": "Color separates surfaces, shows what can be acted on and signals status, from one palette that every page shares. Roles keep that meaning stable in light and dark mode.",
  "anatomy": [
   "Palette — every color defined once, --plx-ref-color-{family}-{shade} (gray, slate, blue, red, pink, magenta, brown, orange, yellow, green, teal, cyan, purple, black, white), and the 20 category colors with their 100, 300 and 700 soft shades (required). A shade's number places it by lightness between its neighbors: the owner's chat colors (issue 637) added blue 125 and blue 275, and the slate family (375, 900), a blue-gray between gray and blue",
   "Surface roles — canvas, default, raised, overlay, sunken, inverse (required)",
   "Content roles — default, muted, subtle, disabled, inverse, link (required)",
   "Border roles — default, subtle, strong (required)",
   "Action and accent roles — primary and danger actions, the accent surface and content (required)",
   "Feedback roles — neutral, info, success, warning, danger, each with solid, on-solid, soft and content; warning is orange, which replaces brown for statuses (required)",
   "Pill roles — the six status pill variants (--plx-sys-status-pill-{neutral|success|active|waiting|action-required|negative}-background, -border, -text) and the category pills (--plx-sys-category-{name}-soft, -soft-border, -on-soft) (required)",
   "State roles — hover, selected, focus ring (required)"
  ],
  "behavior": {
   "pointer": "Hover and selection take --plx-sys-state-hover and --plx-sys-state-selected; primary actions darken to --plx-sys-action-primary-background-hover.",
   "keyboard": "Not applicable: color is a foundation, not an element.",
   "focus": "Focus rings use --plx-sys-focus-ring-color: blue-400 in light, blue-300 in dark (at least 3:1 on the surfaces of each mode).",
   "responsive": "Not applicable: color does not change with width, density or input.",
   "motion": "None of its own; components that fade a color use the motion tokens.",
   "loading": "Not applicable: skeleton colors are their own roles (--plx-sys-skeleton-base, --plx-sys-skeleton-highlight).",
   "error": "Use the danger feedback roles (--plx-sys-feedback-danger-*) for errors and --plx-sys-action-danger-* for destructive actions. Always pair the color with text or an icon."
  },
  "a11y": {
   "name": "Not applicable: color is a foundation, not an element.",
   "announce": "Nothing: color is not announced, which is why it is never the only signal of a state.",
   "focus": "The focus ring is the blue --plx-sys-focus-ring-color, offset from the element by --plx-sys-focus-ring-offset.",
   "contrast": "Text uses content roles on surface roles: gray-900 on white and canvas in light, gray-200 on gray-800 and black in dark. In light mode, text, the tooltip, the toast, the status bar, the data-grid text and the scrim use gray-900, never pure black. Black stays only where a role needs it: the dark canvas and its sunken surface, media surfaces, the text on the light category colors, inverse text in dark mode, and shadows (black at low opacity). Feedback text uses the -content role on its -soft fill; text on a solid fill uses the -on-solid role. Every pill text passes AA on its background in both modes: the status pills 6.20 to 7.54:1 in light and 4.61 to 6.22:1 in dark, the category pills 7.33 to 8.21:1. Pill borders are decorative and the text carries the meaning, so the 3:1 non-text rule does not apply to them.",
   "motion": "Not applicable: color has no motion of its own."
  },
  "content": {
   "labels": "Name a color by what it does, not how it looks: say \"Error\" or \"Approved\", not \"Red\". Do not rely on color words in instructions.",
   "actions": "Not applicable: color has no actions.",
   "errors": "Not applicable: error wording belongs to the component; color only supports it.",
   "localization": "Color meanings differ between cultures, so always pair a status color with a text label that is translated."
  },
  "related": [
   "themes",
   "design-tokens",
   "opacity",
   "focus-ring"
  ]
 },
 "typography": {
  "purpose": "Typography makes interface text readable and shows its hierarchy. One sans family for the interface and one mono family for technical values keep pages consistent and let people tell data from prose.",
  "anatomy": [
   "Families — DM Sans (--plx-ref-font-sans) and Reddit Mono (--plx-ref-font-mono), each with system fallbacks (required)",
   "Font roles — body, heading, label (Sans); code (--plx-sys-font-code: code, token names, hex values, logs) and data (--plx-sys-font-data: IDs, file names and paths, versions, dates and times, sizes, counts, durations, measured percentages, coordinates) (Mono), each at the size and line height of the text beside it (required)",
   "Size scale — --plx-ref-font-size-09 to -20, in rem so text follows the person's font size (required)",
   "Weights — regular 400, medium 500, semibold 600, bold 700 (required)",
   "Line heights and letter spacing — none to relaxed; tight to widest (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: typography is a foundation, not an element.",
   "keyboard": "Not applicable: typography is a foundation, not an element.",
   "focus": "Not applicable: typography takes no focus.",
   "responsive": "Text sizes do not change with density or width; long text wraps inside its container. Inputs, buttons and selects inherit the page font (font-family: inherit).",
   "motion": "None of its own.",
   "loading": "Not applicable: the web-font stylesheet never delays the first paint (theme-boot.js switches it on), so text shows in the fallback font until DM Sans loads.",
   "error": "Not applicable: typography has no error state."
  },
  "a11y": {
   "name": "Not applicable: typography is a foundation, not an element.",
   "announce": "Nothing beyond the element that carries the text; use real headings (h1–h6) for structure.",
   "focus": "Not applicable: typography takes no focus.",
   "contrast": "Body text is 13px in --plx-sys-content-default on the canvas. Use muted and subtle content roles only for secondary text, never for required information.",
   "motion": "Not applicable: typography has no motion."
  },
  "content": {
   "labels": "Write sentence case. Use DM Sans for all interface text: body, headings, buttons, labels, menus, names, descriptions, statuses and what people type. Use Reddit Mono only where fixed width helps, by the kind of the value, not the element: code, token names, hex values and logs (the code role), and technical values: IDs, file names and paths, versions, dates and times, sizes, counts, durations, measured percentages and coordinates (the data role: a DataGrid or Table column of kind `data`, a PropertyList item marked `data`, Text variant `data`). This holds in table cells and property-list values too. Reddit Mono takes the size and line height of the text beside it, so the two share a baseline.",
   "actions": "Not applicable: typography has no actions.",
   "errors": "Not applicable: error text follows the component's rules.",
   "localization": "Leave room for text expansion and let labels wrap. DM Sans covers Latin scripts; other scripts fall back to the system font in the stack."
  },
  "related": [
   "text",
   "heading",
   "design-tokens",
   "density"
  ]
 },
 "spacing": {
  "purpose": "Spacing shows how things relate: related items sit closer than unrelated ones. A 4px base keeps every gap, inset and position on one grid.",
  "anatomy": [
   "Space scale — --plx-ref-space-4px to -64px in rem; no 1px or 2px step (required)",
   "Fixed roles — inline, stack, inset, cluster and layout, xs to 2xl (required)",
   "Density roles — component-gap, container-inset, pattern-stack, region-space, which change with density (required)",
   "Size scale — --plx-ref-size-* for dimensions, all multiples of 4px (required)",
   "Label heights — 16px and 20px for small non-interactive boxes (optional)",
   "Field and scroll widths — field-width, scroll-max and label-width roles (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: spacing is a foundation, not an element.",
   "keyboard": "Not applicable: spacing is a foundation, not an element.",
   "focus": "Not applicable: spacing takes no focus.",
   "responsive": "Density roles pick a different value from the scale per density (compact tighter, comfortable looser); they never multiply. Touch and mobile keep direct-touch targets apart.",
   "motion": "None of its own.",
   "loading": "Not applicable: spacing has no loading state.",
   "error": "Not applicable: spacing has no error state. Place an error closer to its control than the next field is."
  },
  "a11y": {
   "name": "Not applicable: spacing is a foundation, not an element.",
   "announce": "Nothing: spacing is not announced.",
   "focus": "Leave room for the focus ring: the ring sits --plx-sys-focus-ring-offset outside the element.",
   "contrast": "Not applicable: spacing carries no color.",
   "motion": "Not applicable: spacing has no motion."
  },
  "content": {
   "labels": "Name roles for the relationship (inset, inline, stack, cluster, region), not the value. Components own their inside; the parent owns the gap between siblings, and a reusable component sets no outer margin.",
   "actions": "Not applicable: spacing has no actions.",
   "errors": "Not applicable: spacing has no error text.",
   "localization": "Use logical properties (padding-inline-start, inset-block-end) in every rule so right-to-left mirrors correctly. Space values are in rem, so they follow the person's font size."
  },
  "related": [
   "control-heights",
   "density",
   "grid",
   "stack"
  ]
 },
 "control-heights": {
  "purpose": "Control heights make every control in a row line up and give each one a target that is easy to hit. The role a control plays decides its height, so emphasis never changes its size.",
  "anatomy": [
   "Height scale — 24, 28, 32, 36, 40, 44, 48, 52px (--plx-ref-control-size-*) (required)",
   "Height roles — inline, toolbar, standard, prominent, dialog, dialog-destructive (--plx-sys-control-height-*) (required)",
   "Role classes — .plx-control-inline-action, -toolbar, -standard, -dialog set the minimum height (optional)",
   "Grid icon — the icon square for each role (--plx-sys-control-icon-<role>) (required)",
   "Minimum target — --plx-sys-control-target-min, 24px for pointer and 44px for touch and mobile (required)"
  ],
  "behavior": {
   "pointer": "With a pointer, inline, toolbar and standard controls follow the density: 24px in compact, 28–32px in standard, 32–36px in comfortable. Hover never changes the height.",
   "keyboard": "Not applicable: control heights set size only; each control handles its own keys.",
   "focus": "Not applicable: control heights set size only; a 24px control still needs a visible focus ring.",
   "responsive": "Touch and mobile raise every role to 44px whatever the density. Text buttons use a minimum height so labels can wrap; icon-only buttons are square.",
   "motion": "None of its own; transitions are switched off for the frame in which the density changes.",
   "loading": "Not applicable: control heights set size only.",
   "error": "Not applicable: control heights set size only."
  },
  "a11y": {
   "name": "Not applicable: a height gives no name; every control, including a 24px one, needs one.",
   "announce": "Nothing: height is not announced.",
   "focus": "Keep a visible focus ring on every size. The ring sits --plx-sys-focus-ring-offset outside the control, so leave room between neighbors.",
   "contrast": "Not applicable: heights carry no color.",
   "motion": "Not applicable: heights have no motion."
  },
  "content": {
   "labels": "Keep labels short so a row of controls stays on one line in compact density. Do not shorten a label to fit a height; let it wrap.",
   "actions": "Not applicable: wording belongs to the control.",
   "errors": "Not applicable: control heights show no error text.",
   "localization": "Expanded translations wrap within the minimum height instead of overflowing. The icon-to-label gap is a logical gap, so it mirrors in right-to-left."
  },
  "related": [
   "spacing",
   "density",
   "device-behavior",
   "button"
  ]
 },
 "density": {
  "purpose": "Density lets people choose how much they see at once, from compact for dense desktop work to comfortable for easier scanning. The workspace keeps its columns, hierarchy and required information at every level.",
  "anatomy": [
   "Levels — Compact, Standard (the system default), Comfortable (required)",
   "Density attribute — data-plx-density on <html> or on a region (required)",
   "Policy — data-plx-density-policy on <html> or a region, the density a page asks for (optional)",
   "Saved view — data-plx-density-view names a view whose density is saved on its own (optional)",
   "useDensity hook — returns [density, setDensity] (optional)",
   "Display density menu — the menu group in AppHeader.Account when `density` is set (optional)"
  ],
  "behavior": {
   "pointer": "Choosing a level in the Display density menu saves it for every page through PlenixWorkspace.setDensity.",
   "keyboard": "Not applicable: the menu that changes density handles the keys; density itself handles none.",
   "focus": "A density change keeps focus, selection and every other state; nothing is re-rendered.",
   "responsive": "The first that applies wins: the person's choice, the saved view, the page or region policy, then standard. Touch and mobile raise targets to 44px whatever the density, and compact is not offered on a phone (it resolves to standard).",
   "motion": "Transitions are switched off for the frame in which the density changes, so a large table does not animate every row. The scroll position stays on the item at the top of each scrolled region.",
   "loading": "Not applicable: theme-boot.js sets the density before the page draws, so there is no loading state.",
   "error": "Not applicable: an unknown value is ignored and the next source applies. If storage is unavailable the choice is not saved."
  },
  "a11y": {
   "name": "The menu group is named Display density, and each choice is a menuitemradio named Compact, Standard or Comfortable.",
   "announce": "A change is announced through a polite live region (role=\"status\") as \"Display density: <level>\".",
   "focus": "Focus stays on the element that had it when the density changes.",
   "contrast": "Not applicable: density changes size and space, not color.",
   "motion": "Transitions are off during the change, and reduced motion removes the rest."
  },
  "content": {
   "labels": "Call the setting Display density and the levels Compact, Standard and Comfortable. Never name a level \"Default\".",
   "actions": "Not applicable: choosing a level applies it at once; there is no confirm action.",
   "errors": "Not applicable: density shows no error text.",
   "localization": "Translate the level names and their descriptions. Density changes only spacing and sizes, so translated layouts behave the same at every level."
  },
  "related": [
   "control-heights",
   "spacing",
   "device-behavior",
   "data-grid"
  ]
 },
 "border": {
  "purpose": "Borders separate regions and outline controls without moving anything on the grid. Dividers are drawn inside their box, so adding one never shifts the layout.",
  "anatomy": [
   "Widths — 1px, 2px, 3px, 4px (--plx-ref-border-width-*) (required)",
   "Styles — solid and dashed (--plx-ref-border-style-*) (required)",
   "Border color roles — --plx-sys-border-default, -subtle, -strong from the theme (required)",
   "Inset divider — an inset box-shadow one border-width wide (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: borders are a foundation, not an element.",
   "keyboard": "Not applicable: borders are a foundation, not an element.",
   "focus": "Focused and invalid fields change only their border color; they get no outer ring.",
   "responsive": "Not applicable: border widths do not change with width or density.",
   "motion": "None of its own.",
   "loading": "Not applicable: borders have no loading state.",
   "error": "An invalid field changes its border to the danger color; the message beside it carries the meaning."
  },
  "a11y": {
   "name": "Not applicable: borders are not rendered on their own.",
   "announce": "Nothing: borders are not announced.",
   "focus": "Button focus rings use a 2px outline (--plx-comp-button-focus-ring-width) in --plx-sys-focus-ring-color, offset by --plx-sys-focus-ring-offset.",
   "contrast": "Use --plx-sys-border-strong where a boundary must be seen to use the control; default and subtle borders are for separation only. In dark mode default and subtle are both gray-700.",
   "motion": "Not applicable: borders have no motion."
  },
  "content": {
   "labels": "Not applicable: borders have no text.",
   "actions": "Not applicable: borders have no actions.",
   "errors": "Not applicable: borders show no error text.",
   "localization": "Use logical sides (border-inline-start, inset shadows on the inline axis) so a one-sided divider mirrors in right-to-left."
  },
  "related": [
   "radius",
   "color",
   "divider",
   "focus-ring"
  ]
 },
 "radius": {
  "purpose": "Corner radius tells people what kind of thing they are looking at: a control, a card, a menu or a dialog. Roles keep the same kind of thing rounded the same way everywhere.",
  "anatomy": [
   "Value scale — 0, 2, 4, 6, 8, 12, 16px and pill (--plx-ref-radius-*) (required)",
   "Roles — detail, compact, control, media, surface, card, menu, dialog, avatar, each with its value in the name (required)",
   "Density role — --plx-sys-radius-control: 6px in standard and comfortable, 4px in compact (required)",
   "Derived radius — .plx-radius-concentric with --plx-sys-radius-outer and --plx-sys-radius-inset (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: radius is a foundation, not an element.",
   "keyboard": "Not applicable: radius is a foundation, not an element.",
   "focus": "An outline offset by --plx-sys-focus-ring-offset follows the element's corner, so the ring needs no radius token of its own.",
   "responsive": "Only --plx-sys-radius-control changes, with density. A surface inset inside another rounded surface derives its corner: outer minus the gap, never below 0.",
   "motion": "None of its own.",
   "loading": "Not applicable: radius has no loading state.",
   "error": "Not applicable: radius has no error state."
  },
  "a11y": {
   "name": "Not applicable: radius is a foundation, not an element.",
   "announce": "Nothing: radius is not announced.",
   "focus": "The focus ring follows the rounded corner, so it stays visible at every radius.",
   "contrast": "Not applicable: radius carries no color.",
   "motion": "Not applicable: radius has no motion."
  },
  "content": {
   "labels": "Name a role by its use and value (--plx-sys-radius-card-6px). Controls own their radius and never take it from their container. Menus use --plx-sys-radius-menu-6px. Avatars are rounded squares, never circles.",
   "actions": "Not applicable: radius has no actions.",
   "errors": "Not applicable: radius shows no error text.",
   "localization": "The concentric class sets all four corners, so it works the same in right-to-left."
  },
  "related": [
   "border",
   "control-heights",
   "card"
  ]
 },
 "shadows": {
  "purpose": "Shadows show that a surface sits above the page, such as a raised card or a dialog. They tell people what is on top and what they can interact with now.",
  "anatomy": [
   "Shadow recipes — sm, md, lg, card, raised, menu, modal (--plx-sys-shadow-*) (required)",
   "Ring recipes — ring, ring-subtle and underline-focus for drop targets and focus (optional)",
   "Elevation roles — --plx-sys-elevation-raised-shadow (card), -overlay-shadow (modal), -menu (none) (required)",
   "Shadow classes — .plx-shadow-* and the hover classes .plx-hover-shadow-card, -raised (optional)"
  ],
  "behavior": {
   "pointer": "Cards with .plx-hover-shadow-card or .plx-hover-shadow-raised lift on hover. A drop-target card shows the ring and the card shadow (.plx-shadow-card-ring).",
   "keyboard": "Not applicable: shadows are a foundation, not an element.",
   "focus": "Not applicable: focus uses the outline, not a shadow; --plx-sys-shadow-underline-focus is only for underline-style fields.",
   "responsive": "Not applicable: shadows do not change with width or density.",
   "motion": "None of its own: the hover classes switch the shadow without a transition.",
   "loading": "Not applicable: shadows have no loading state.",
   "error": "Not applicable: shadows have no error state."
  },
  "a11y": {
   "name": "Not applicable: shadows are not rendered on their own.",
   "announce": "Nothing: elevation is not announced; a dialog announces itself through its role.",
   "focus": "Not applicable: shadows are not focus indicators.",
   "contrast": "Each recipe includes a 1px edge (gray-200 in light, gray-700 in dark), so a raised surface keeps a visible boundary when the blur is faint. In dark mode the blur is black.",
   "motion": "Not applicable: shadows have no motion."
  },
  "content": {
   "labels": "Not applicable: shadows have no text.",
   "actions": "Not applicable: shadows have no actions.",
   "errors": "Not applicable: shadows show no error text.",
   "localization": "Shadows are centered (no x or y offset), so nothing changes for right-to-left."
  },
  "related": [
   "layers",
   "card",
   "dialog",
   "action-menu"
  ]
 },
 "opacity": {
  "purpose": "Opacity dims a whole element to show it is unavailable or sits behind something else. Colors themselves stay opaque, so text contrast stays predictable.",
  "anatomy": [
   "Steps — 30, 50 and 70 percent (--plx-ref-opacity-*) (required)",
   "Dimmed element — the control, veil or icon that takes the opacity (required)"
  ],
  "behavior": {
   "pointer": "Disabled checkboxes, switches, sliders, pagination pages and radio tiles use --plx-ref-opacity-50 and a not-allowed or default cursor.",
   "keyboard": "Not applicable: opacity changes appearance only; a disabled native control is skipped by Tab.",
   "focus": "Not applicable: opacity changes appearance only.",
   "responsive": "Not applicable: opacity does not change with width or density.",
   "motion": "None of its own; a component that fades uses the motion tokens.",
   "loading": "Not applicable: opacity has no loading state.",
   "error": "Not applicable: opacity has no error state."
  },
  "a11y": {
   "name": "Not applicable: opacity gives no name.",
   "announce": "Nothing: opacity is not announced; use the disabled attribute so the state is announced.",
   "focus": "Not applicable: opacity takes no focus.",
   "contrast": "Dimmed text falls below normal contrast, which WCAG allows only for disabled controls. Do not dim required information; use a content role instead.",
   "motion": "Not applicable: opacity has no motion of its own."
  },
  "content": {
   "labels": "Not applicable: opacity has no text.",
   "actions": "Explain why an action is unavailable when it is not obvious, instead of relying on the dimmed look.",
   "errors": "Not applicable: opacity shows no error text.",
   "localization": "Not applicable: opacity does not change between languages."
  },
  "related": [
   "color",
   "themes"
  ]
 },
 "icon": {
  "purpose": "Icons help people recognize actions and objects at a glance. Plenix uses one published set, so every icon looks the same weight and sits on the 4px grid.",
  "anatomy": [
   "Icon box — a span with .plx-icon, sized by a named size or its control's grid icon (required)",
   "Glyph — the Material Symbols Sharp drawing as an inline SVG in the current text color (fill: currentcolor), its path exactly as published, from the icon's module (both optical sizes, 20 and 24, outline and filled, in every module). The stylesheet shows the one the context calls for (inline paths paint about 200 times faster than masks). The drawing comes from a module (imported, or registered by a page's icon file) or, for a name with no module, its file loaded once; never from the stylesheet, so a bare class name (plx-icon plx-icon--<name>, no component) draws nothing: code that writes HTML uses iconMarkup (required)",
   "Filled version — the set's fill file, used for the current or selected state (optional)",
   "Accessible label — `label`, which makes the icon an image with a name (optional)"
  ],
  "behavior": {
   "pointer": "None of its own: the icon is not interactive; the control around it handles clicks.",
   "keyboard": "None: the icon takes no focus.",
   "focus": "Not applicable: the icon is never focusable.",
   "responsive": "Inside a control the icon takes the role's grid icon, which grows with density and touch. Comfortable density and the app header use the optical-size-24 files.",
   "motion": "None of its own.",
   "loading": "An imported or registered icon is in the bundle and draws at once; so does a Plenix name. Any other Material Symbols name loads its file once, on demand, from the library beside the bundle (the CDN’s /cdn/material/<commit>/; setIconLibrary(url) points elsewhere); its box keeps its size and stays empty until then, and development warns once that production should import or register it.",
   "error": "One name resolver (resolveIcon) accepts a Plenix name, its underscore spelling, or any Material Symbols name in dashes or underscores, any case, in the chosen library. A name it cannot resolve draws nothing (never a filled square) and warns once in the console with the closest names. Every loaded icon file and every module drawing is untrusted: it passes an allow-list (one svg holding one path; viewBox, d, transform and the fill and clip rules checked by grammar; a file over 32 KB or a path over 16 KB is refused unread). Anything else refuses the whole file: the icon draws nothing and development warns once with the reason. Nothing is inserted as HTML. An icon value that is not a module draws nothing and warns once."
  },
  "a11y": {
   "name": "With `label`, the icon gets role=\"img\" and aria-label. Without it the icon is aria-hidden, so the control must have its own name.",
   "announce": "A labeled icon is announced as an image with its label; an unlabeled one is not announced.",
   "focus": "Not applicable: the icon is never focusable.",
   "contrast": "The icon takes the current text color (currentcolor), so it follows the content role of its text in light and dark.",
   "motion": "Not applicable: icons have no motion."
  },
  "content": {
   "labels": "Give an icon that carries meaning on its own a short noun or verb label in sentence case (\"Favorite\", \"Delete\"). Leave decorative icons unlabeled.",
   "actions": "Use the same icon for the same action everywhere. A missing concept is listed for a decision, never drawn.",
   "errors": "Not applicable: icons show no error text.",
   "localization": "Translate the label. The icon files are not edited for right-to-left: every icon that points along the reading direction (a module marked mirrored, or a name whose symbol is one of them) gets plx-icon--mirrored, which the stylesheet mirrors in a right-to-left page. Check other direction icons such as arrows."
  }
 },
 "icon-inventory": {
  "purpose": "The icon inventory collects candidate icons for concepts the working set lacks or draws poorly, so the owner can compare them and decide. Each candidate is restyled to the Plenix icon standard and checked before it is listed; none reaches an application until the owner approves it.",
  "anatomy": [
   "Rules — what the inventory is and how an icon leaves it (required)",
   "Search field — a SearchField that filters the candidates by name, alias, keyword, category, library and state (required)",
   "Candidates — a Table with one row per candidate: its restyled drawings at 20 and 24 (outline and filled), names, library, license, state, sizes, check result, the working-set icon it would replace, and why (required)",
   "Libraries — a Table of every library considered: status, license, icon count, version, what it wraps and why (required)",
   "Gaps — concepts no open library draws, each with its reason (required)",
   "Data — platform/icons/inventory/inventory.js, generated by tools/icons/build-inventory.js from inventory.json and libraries.json, loaded only on this page (required)"
  ],
  "behavior": {
   "pointer": "Typing in the search field filters the candidates as you type; the clear button empties it.",
   "keyboard": "The search field keeps its own keys: Escape clears the text, as in the browser.",
   "focus": "Focus stays in the search field while typing.",
   "responsive": "The tables keep their columns and grow with their rows.",
   "motion": "None of its own.",
   "loading": "The data loads once when the page opens; the section stays empty until it arrives.",
   "error": "When the data file cannot be loaded, the section says so and names the file. A search that matches nothing shows a message that names the query."
  },
  "a11y": {
   "name": "The search field and each table have a label. Each drawing is an image named by its icon, size and version.",
   "announce": "The count line says how many candidates match the search.",
   "focus": "Not applicable: the drawings and badges take no focus.",
   "contrast": "Drawings take the current text color; states are badges with an icon and a word, never color alone.",
   "motion": "Not applicable: the page has no motion."
  },
  "content": {
   "labels": "Icon names are lowercase with dashes, as in the working set (save, git-branch).",
   "actions": "Not applicable: the page has no actions.",
   "errors": "Name the query when nothing matches; name the file when the data is missing.",
   "localization": "Icon names, keywords and library names are data and stay as written."
  }
 },
 "motion": {
  "purpose": "Motion shows people what changed and where something came from, such as a toast sliding in. It stays short and is removed when people ask for less motion.",
  "anatomy": [
   "Durations — instant 0.08s, quick 0.12s, fast 0.15s, base 0.2s, slow 0.25s (--plx-sys-motion-duration-*) (required)",
   "Loop durations — 0.7s, 1.1s, 1.4s for spinners and pulses (optional)",
   "Easing — standard and enter (--plx-sys-motion-ease-standard, --plx-sys-motion-ease-enter) (required)",
   "Enter scale — --plx-sys-motion-enter-scale (optional)",
   "Stagger delay — --plx-sys-motion-delay-stagger (optional)",
   "Keyframes — fade-up, spin, pulse, shimmer, toast-in, toast-out (required)",
   "Enter class — .plx-motion-enter, content that rises into place (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: motion is a foundation, not an element.",
   "keyboard": "Not applicable: motion is a foundation, not an element.",
   "focus": "Not applicable: motion takes no focus.",
   "responsive": "Transitions are switched off for the frame in which the density changes.",
   "motion": "Components use the duration and easing tokens for transitions; .plx-motion-enter runs motion-fade-up for the fast duration.",
   "loading": "Spinners, pulses and shimmers use the spin, pulse and shimmer keyframes with the loop durations.",
   "error": "Not applicable: motion has no error state."
  },
  "a11y": {
   "name": "Not applicable: motion is a foundation, not an element.",
   "announce": "Nothing: motion is not announced, so it never carries meaning that is not shown otherwise.",
   "focus": "Not applicable: motion takes no focus.",
   "contrast": "Not applicable: motion carries no color.",
   "motion": "With prefers-reduced-motion, every animation and transition takes zero time and runs once, and smooth scrolling is off. State changes still happen, and animations still end, so a toast still leaves."
  },
  "content": {
   "labels": "Name keyframes motion-[effect] or motion-[effect]-[direction].",
   "actions": "Not applicable: motion has no actions.",
   "errors": "Not applicable: motion shows no error text.",
   "localization": "The toast keyframes slide along the physical x axis, so they do not mirror for right-to-left."
  },
  "related": [
   "device-behavior",
   "toast",
   "expandable-section"
  ]
 },
 "layers": {
  "purpose": "Layers decide what sits on top when surfaces overlap, so a menu, dialog or toast is never hidden behind the page. Each stacking purpose has one level.",
  "anatomy": [
   "Levels — behind, base, raised, sticky, menu, overlay, modal, popover, toast, critical (--plx-sys-layer-*) (required)",
   "Stacked element — the component that sets z-index to a layer token (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: layers are a foundation, not an element.",
   "keyboard": "Not applicable: layers are a foundation, not an element.",
   "focus": "Not applicable: layers set stacking only; components such as Dialog manage focus.",
   "responsive": "Not applicable: layers do not change with width or density.",
   "motion": "None of its own.",
   "loading": "Not applicable: layers have no loading state.",
   "error": "Not applicable: layers have no error state."
  },
  "a11y": {
   "name": "Not applicable: layers are not rendered on their own.",
   "announce": "Nothing: stacking is not announced.",
   "focus": "Keep a focused element above anything that could cover it; the button group uses its own focus layer token for this.",
   "contrast": "Not applicable: layers carry no color.",
   "motion": "Not applicable: layers have no motion."
  },
  "content": {
   "labels": "Name a level for its purpose, never its number.",
   "actions": "Not applicable: layers have no actions.",
   "errors": "Not applicable: layers show no error text.",
   "localization": "Not applicable: stacking does not change between languages."
  },
  "related": [
   "shadows",
   "dialog",
   "tooltip",
   "overlay-manager"
  ]
 },
 "breakpoints": {
  "purpose": "Breakpoints are the widths where the layout changes, so pages stay usable from a phone to a wide monitor. The content grid follows the main region's own width.",
  "anatomy": [
   "Reference breakpoints — 600, 768, 840, 1024, 1440, 1920px (--plx-ref-breakpoint-*); the window classes are Narrow under 600, Medium 600–839, Wide from 840 (Platforms Standard 3.3) (required)",
   "Shell roles — --plx-sys-shell-rail-below (840px: Medium below it), --plx-sys-shell-inspector-overlay-below (1024px), --plx-sys-shell-phone-below (600px: Narrow below it); the safe areas --plx-sys-safe-area-top, -bottom, -start, -end (required)",
   "Content grid — 4, 8, 12, 16 columns by main-region width (.plx-page-grid) (required)",
   "Main-size label — data-plx-main-size (narrow, medium, wide: the window classes) on .plx-shell-main for script decisions (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: breakpoints are a foundation, not an element.",
   "keyboard": "Not applicable: breakpoints are a foundation, not an element.",
   "focus": "Not applicable: breakpoints take no focus.",
   "responsive": "The grid has 4 columns under 600px, 8 to 1023px, 12 to 1439px and 16 from 1440px, measured on the main region with container queries. Below 600px (Narrow) the shell becomes header, main and the bottom navigation bar. Side regions in a workspace composition hide below their usable width.",
   "motion": "None of its own.",
   "loading": "Not applicable: breakpoints have no loading state.",
   "error": "Not applicable: breakpoints have no error state."
  },
  "a11y": {
   "name": "Not applicable: breakpoints are not rendered.",
   "announce": "Nothing: layout changes are not announced.",
   "focus": "Keep side regions that leave the layout reachable by a drawer, overlay or button.",
   "contrast": "Not applicable: breakpoints carry no color.",
   "motion": "Not applicable: breakpoints have no motion."
  },
  "content": {
   "labels": "Name a breakpoint role for what changes (rail-below, inspector-overlay-below), not for a device.",
   "actions": "Not applicable: breakpoints have no actions.",
   "errors": "Not applicable: breakpoints show no error text.",
   "localization": "The grid uses logical page margins (padding-inline), so it mirrors in right-to-left. Longer translations may need wider spans at a breakpoint."
  },
  "related": [
   "application-shell",
   "grid",
   "device-behavior"
  ]
 },
 "device-behavior": {
  "purpose": "Device behavior adapts the Platform to how people work: mouse and keyboard, touch, or a phone. Targets, spacing and layout follow the input, independent of the chosen density.",
  "anatomy": [
   "Environments — pointer, touch, mobile on <html data-plx-interaction> (required)",
   "Detection — any coarse pointer is touch; a coarse pointer in a Narrow window (under 600px) is mobile (Platforms Standard 1.1) (required)",
   "Target minimum — --plx-sys-control-target-min, 24px pointer and 44px touch and mobile (required)",
   "Hover reveal — a part shown on hover reads --plx-sys-hover-reveal-opacity and --plx-sys-hover-reveal-visibility at rest: always shown on touch and mobile (optional)",
   "useInteraction hook — returns \"pointer\", \"touch\" or \"mobile\" (optional)"
  ],
  "behavior": {
   "pointer": "With a pointer, hover only enhances: nothing is found or operated by hover alone. On touch and mobile a part shown on hover is always visible: its rest look reads --plx-sys-hover-reveal-opacity and --plx-sys-hover-reveal-visibility.",
   "keyboard": "Not applicable: the environment handles no keys; pointer mode keeps visible focus and keyboard shortcuts.",
   "focus": "Not applicable: changing environment does not move focus.",
   "responsive": "Touch and mobile set every control role and table row to 44px whatever the density. Below 600px (Narrow) the shell collapses to header and main with the bottom navigation bar; a narrow desktop window keeps pointer-sized controls.",
   "motion": "None of its own.",
   "loading": "Not applicable: theme-boot.js sets the environment before the page draws and follows changes live, such as a laptop folded into a tablet.",
   "error": "Not applicable: without matchMedia the environment is pointer."
  },
  "a11y": {
   "name": "Not applicable: the environment is not rendered.",
   "announce": "Nothing: a change of environment is not announced.",
   "focus": "Focus rings stay visible in every environment.",
   "contrast": "Not applicable: the environment changes size, not color.",
   "motion": "Not applicable: the environment has no motion."
  },
  "content": {
   "labels": "Do not write labels that depend on the input, such as \"Click\" or \"Hover to see\"; write \"Select\" and show the information.",
   "actions": "Make every action reachable without hover.",
   "errors": "Not applicable: the environment shows no error text.",
   "localization": "Not applicable: environments do not change between languages."
  },
  "related": [
   "density",
   "control-heights",
   "breakpoints"
  ]
 },
 "themes": {
  "purpose": "Themes let people use Plenix in light or dark mode, and follow their system setting. Every color and shadow switches together, so components need no dark styles of their own.",
  "anatomy": [
   "Theme attribute — data-plx-theme=\"plenix\" on <html>, set by theme-boot.js when missing (required)",
   "Mode attribute — data-plx-mode=\"light | dark | system\" on <html>; light by default (required)",
   "Theme stylesheets — system/themes/<name>.css, one per theme in platform/standards/themes.json, generated from its light and dark token files (the default theme: default.css) (required)",
   "Color scheme — color-scheme light or dark, so native controls and scrollbars match (required)",
   "ThemeProvider — gives React the theme, density and interaction context; ThemeZone gives one region its own mode (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: themes are a foundation; the theme has no switch of its own in the Platform components.",
   "keyboard": "Not applicable: themes handle no keys.",
   "focus": "Not applicable: changing mode does not move focus.",
   "responsive": "With data-plx-mode=\"system\" the mode follows the prefers-color-scheme setting live.",
   "motion": "None of its own.",
   "loading": "Not applicable: theme-boot.js sets the mode in <head> before the page draws, so there is no flash of the wrong mode.",
   "error": "Not applicable: without the attributes the light values apply."
  },
  "a11y": {
   "name": "Not applicable: a theme is not rendered.",
   "announce": "Nothing: a mode change is not announced.",
   "focus": "The focus ring is blue: blue-400 in light, blue-300 in dark.",
   "contrast": "Light uses gray-900 and gray-700 text on white and gray-75; dark uses gray-200 and gray-300 text on gray-800 and black. Links switch from blue-400 to blue-200 in dark.",
   "motion": "Not applicable: mode changes are instant."
  },
  "content": {
   "labels": "Call the modes Light, Dark and System.",
   "actions": "Not applicable: themes have no actions.",
   "errors": "Not applicable: themes show no error text.",
   "localization": "Not applicable: themes do not change between languages."
  },
  "related": [
   "color",
   "design-tokens",
   "opacity"
  ]
 },
 "grid": {
  "purpose": "Gives every page the same column structure, so content lines up across applications at any window width. The shell owns the panes; the content grid lives only in the main region and follows that region's width.",
  "anatomy": [
   "Shell — .plx-shell: header across, then navigation, main region and inspector (required)",
   "Main region — .plx-shell-main: the container every grid decision is measured against; it carries the layout mode in data-plx-layout, set by AppShell's layout prop (fluid, contained, hybrid, multi-pane, focus; drawn by app-shell.css)",
   "Page grid — .plx-page-grid: 4, 8, 12 or 16 columns with a gutter and page margins (required)",
   "Spans — .plx-span-1 to .plx-span-16 and .plx-span-full; every child picks its span, never wider than the grid (optional)",
   "Bounded content — .plx-content-prose, -form, -detail, -editor, -workspace: readable maximum widths (optional)",
   "Compositions — .plx-workspace-4-8-4, -4-12, -12-4, -8-8, with the side regions .plx-workspace__start and .plx-workspace__end (optional)"
  ],
  "behavior": {
   "pointer": "None: the grid is a static arrangement.",
   "keyboard": "None: the grid adds no keys or Tab stops. Reading and Tab order follow the source order, so keep the source in the visual order.",
   "focus": "Not applicable: the grid holds no focusable parts of its own.",
   "responsive": "A container query on the main region sets the columns: under 600px 4, from 600px 8, from 1024px 12, from 1440px 16. Spans wider than the grid fall back to full width, and compositions drop their side regions below 1440px and 1024px. Density changes the gutters and margins, never the column count.",
   "motion": "None of its own.",
   "loading": "Not applicable: a layout has no loading state; the content inside shows its own.",
   "error": "Not applicable: a layout has no error state."
  },
  "a11y": {
   "name": "Not applicable: the grid is presentational and has no accessible name. Name the landmarks inside it (main, sections) instead.",
   "announce": "Nothing: the grid classes add no roles.",
   "focus": "The grid leaves focus order alone: source order is reading order. Never reorder content visually against the source.",
   "contrast": "Not applicable: the grid draws no text or boundaries.",
   "motion": "Not applicable: the grid does not animate."
  },
  "content": {
   "labels": "Not applicable: the grid has no text.",
   "actions": "Not applicable: the grid has no actions.",
   "errors": "Not applicable: the grid has no error text.",
   "localization": "Page margins use logical properties (padding-inline-start and -end), so they mirror in right-to-left. Column order follows the writing direction. Content that grows with longer translations should wrap inside its span, not widen it."
  }
 },
 "stack": {
  "purpose": "Lets applications arrange elements in a column (Stack) or a row (Inline) with spacing from the tokens, so no application needs margins, numbers or a stylesheet of its own.",
  "anatomy": [
   "Container — the element (`as`, a div by default), a flex column or row (required)",
   "Gap — the space between children from --plx-sys-space-stack-* or --plx-sys-space-inline-* (required; defaults md for Stack, sm for Inline)",
   "Inset — padding on every side from --plx-sys-space-inset-* (optional)",
   "Grow part — a child with `grow` that fills the rest of the row or column (optional)",
   "Scroll region — `scroll` or `maxHeight`, a part that scrolls its own content (optional)"
  ],
  "behavior": {
   "pointer": "None: Stack and Inline are static. A scrolling one scrolls with the wheel or touch like any overflow region.",
   "keyboard": "None of its own. Children keep their own keys; Tab order follows the source order.",
   "focus": "Stack and Inline never take or move focus.",
   "responsive": "Inline with `wrap` wraps onto more lines, its lines --plx-sys-space-stack-xs apart. `grow` parts can shrink below their content; `width` parts keep a fixed field width and do not shrink. `scroll` and `maxHeight` scroll vertically instead of growing.",
   "motion": "None of its own.",
   "loading": "Not applicable: a layout has no loading state.",
   "error": "Not applicable: a layout has no error state."
  },
  "a11y": {
   "name": "Not applicable by default: a div has no name. When `as` makes it a landmark or list (section, form, ul), name it with aria-label or a heading, which pass through as other props.",
   "announce": "Only the role of the element chosen with `as` (for example a list for ul, with its markers removed). A div announces nothing.",
   "focus": "No focus of its own. A scrolling Stack is not made focusable by the component; put focusable content inside it or add tabIndex when keyboard users must scroll it.",
   "contrast": "Not applicable: Stack and Inline draw no text, fill or border.",
   "motion": "Not applicable: they do not animate."
  },
  "content": {
   "labels": "Not applicable: Stack and Inline have no text of their own.",
   "actions": "Not applicable: they have no actions.",
   "errors": "Not applicable: they have no error text.",
   "localization": "Inset, indent and push use logical properties, so they mirror in right-to-left. Use `wrap` on rows of text or tags so longer translations go onto more lines instead of overflowing."
  }
 },
 "divider": {
  "purpose": "Separates groups of content that spacing and layout alone do not separate, with a thin rule in the divider color.",
  "anatomy": [
   "Rule — a div with role=\"separator\" and a 1px border in --plx-sys-border-divider (required)",
   "Orientation — horizontal (full width) or vertical (stretches to the row's height) (required; default horizontal)"
  ],
  "behavior": {
   "pointer": "None: the divider is static.",
   "keyboard": "None: the divider is not focusable.",
   "focus": "Not applicable: the divider never takes focus.",
   "responsive": "A horizontal divider takes the full inline size of its container. A vertical one stretches to the height of its row and does not shrink.",
   "motion": "None of its own.",
   "loading": "Not applicable: a divider has no loading state.",
   "error": "Not applicable: a divider has no error state."
  },
  "a11y": {
   "name": "None is needed. Do not label a divider; label the groups it separates.",
   "announce": "A separator with its orientation (aria-orientation). Some screen readers skip separators.",
   "focus": "Not in the Tab order.",
   "contrast": "The rule uses --plx-sys-border-divider in both themes. It is decorative; never let it be the only cue that two groups differ.",
   "motion": "Not applicable: the divider does not animate."
  },
  "content": {
   "labels": "Not applicable: the divider has no text.",
   "actions": "Not applicable: the divider has no actions.",
   "errors": "Not applicable: the divider has no error text.",
   "localization": "The vertical rule uses border-inline-start, so it sits correctly in right-to-left. Nothing else changes."
  }
 },
 "scroll-area": {
  "purpose": "Lets each region of the shell scroll on its own while keeping scroll bars out of sight until they are needed, so dense screens stay quiet without hiding position.",
  "anatomy": [
   "Scroll region — any element that overflows (for example Stack with `scroll` or `maxHeight`, or a pane) (required)",
   "Thumb — a thin bar in --plx-sys-scrollbar-thumb, shown on hover or while focus is inside (required)",
   "Track — always transparent; its space stays reserved (required)",
   "Scroll lock — data-plx-scroll-lock=\"locked\" on the page, set while a modal layer is open (optional)"
  ],
  "behavior": {
   "pointer": "Hovering a region shows its thumb; leaving hides it again. The wheel, trackpad and the thumb scroll it; touch devices show their own overlay bars while scrolling.",
   "keyboard": "Arrow keys, Page Up, Page Down, Home, End and Space scroll a focused region, as the browser provides. The thumb also shows while focus is inside the region.",
   "focus": "Scrolling never moves focus. A region with no focusable content needs tabIndex (as CodeBlock does) so keyboard users can reach and scroll it.",
   "responsive": "Regions scroll inside the fixed shell instead of the page scrolling behind it. The bar takes no extra space when it appears, so nothing shifts.",
   "motion": "None of its own: the thumb color switches on hover and focus without a transition.",
   "loading": "Not applicable: scrolling has no loading state.",
   "error": "Not applicable: scrolling has no error state."
  },
  "a11y": {
   "name": "Name a scroll region that is focusable (aria-label), so screen readers say what is being scrolled.",
   "announce": "Nothing: the scrolling rules add no roles or states.",
   "focus": "Showing the thumb on :focus-within keeps the position visible to keyboard users. The focus ring itself comes from the focused element.",
   "contrast": "The thumb uses --plx-sys-scrollbar-thumb, defined per theme for light and dark.",
   "motion": "Under reduced motion, smooth scrolling is turned off (scroll-behavior: auto, from system/motion.css)."
  },
  "content": {
   "labels": "Not applicable: scroll areas have no text of their own.",
   "actions": "Not applicable: scroll areas have no actions.",
   "errors": "Not applicable: scroll areas have no error text.",
   "localization": "The browser places the vertical bar on the correct side for the writing direction. Nothing else changes."
  },
  "related": [
   "application-shell",
   "secondary-pane",
   "data-grid"
  ]
 },
 "dashboard-grid": {
  "purpose": "Lets people arrange a dashboard's widgets in the order that suits them, by dragging a handle or with the arrow keys, while the page keeps the order.",
  "anatomy": [
   "Grid — a list (role=\"list\") named by `label`, with auto-fill or 2, 3 or 4 columns (required)",
   "Widget — a list item, usually a Panel from `renderItem`; `span` \"2\" makes it two columns wide (required)",
   "Handle — a move button, in the widget's top corner or placed in the Panel's actions by the renderer (optional; only with onReorder)",
   "Drop ring — a dashed focus-color outline on the widget under the pointer while dragging (optional)",
   "Status — a visually hidden live region that announces the new position (required)"
  ],
  "behavior": {
   "pointer": "Drag a widget's handle onto another widget to move it to that place; the dragged widget fades and the widget under the pointer shows the drop ring. A click on the handle, or Enter or Space, opens its menu: Move earlier, Move later, Move to the start, Move to the end; moves that cannot happen are turned off. Without `onReorder` there are no handles and nothing can be dragged.",
   "keyboard": "On a focused handle, Arrow Up or Arrow Left moves the widget one place earlier; Arrow Down or Arrow Right moves it one place later. Moves past the first or last place do nothing.",
   "focus": "Focus stays where the page's re-render leaves it; the grid does not move it after a move. Handles are native buttons in the Tab order.",
   "responsive": "With columns \"auto\" the grid fits as many columns of at least --plx-ref-size-280px as the width allows. Fixed 2, 3 or 4 columns shrink but do not reduce.",
   "motion": "None of its own: the dragging fade and drop ring switch on without a transition.",
   "loading": "Not applicable: the grid has no loading state; each widget shows its own.",
   "error": "Not applicable: the grid has no error state; a failed save is the page's to report."
  },
  "a11y": {
   "name": "The grid is named by `label`. Each handle is named \"Move [title] (arrow keys)\".",
   "announce": "A list with its items. After a move, the status region announces \"[title], position N of M\".",
   "focus": "Handles show the focus ring (--plx-sys-focus-ring-color, offset --plx-sys-focus-ring-offset, 2px).",
   "contrast": "The handle icon uses --plx-sys-content-muted, turning --plx-sys-content-default on hover over --plx-sys-state-hover. The drop ring uses the focus ring color in both themes.",
   "motion": "Nothing animates, so reduced motion changes nothing."
  },
  "content": {
   "labels": "Name the grid for the dashboard (\"Dashboard\"). Give every widget a short, unique noun title; it is used in the handle name and the announcement.",
   "actions": "Not applicable: the handle's name is fixed by the component.",
   "errors": "Not applicable: the grid shows no error text.",
   "localization": "The handle name and the announcement (\"Move\", \"position N of M\") are English strings in the component. The handle sits at the inline end, so it mirrors in right-to-left; Arrow Left still means earlier."
  }
 },
 "panel": {
  "purpose": "Groups related settings or facts under a title on a bordered surface, with room for actions and a footer, so a page reads as clear sections.",
  "anatomy": [
   "Section — a section landmark on --plx-sys-surface-default with a border (required)",
   "Header — the title (a heading, level 2 by default) and an optional description line (optional)",
   "Actions — controls at the end of the header (optional)",
   "Collapse toggle — a chevron button at the end of the header when `collapsible` (optional)",
   "Body — the content, padded unless `flush` (required)",
   "Footer — content below the body, aligned to the end (optional)"
  ],
  "behavior": {
   "pointer": "The panel itself is not clickable. On a collapsible panel, clicking the chevron opens or closes the body and footer.",
   "keyboard": "The collapse toggle is a native button: Enter and Space open or close it. Actions keep their own keys.",
   "focus": "Focus stays on the toggle after it opens or closes the panel. A closed panel's body is hidden, so its controls leave the Tab order.",
   "responsive": "The panel takes the width it is given and does not shrink below zero. The title area grows and the actions keep their size; place panels in the grid or a Stack.",
   "motion": "The chevron turns with --plx-sys-motion-duration-fast and --plx-sys-motion-ease-standard. The body appears and disappears without animation.",
   "loading": "No loading state of its own: show Loading or a skeleton in the body.",
   "error": "No error state of its own: show an inline message in the body."
  },
  "a11y": {
   "name": "The section landmark is named by its title (aria-labelledby). The toggle is named \"Collapse [title]\" or \"Expand [title]\".",
   "announce": "A region named by its title, then its heading. The toggle announces as a button with its expanded state (aria-expanded) and controls the body.",
   "focus": "The fold toggle shows the Plenix focus ring, like every control. Actions show their own rings.",
   "contrast": "The title uses --plx-sys-content-default, the description --plx-sys-content-muted, the borders --plx-sys-border-default and --plx-sys-border-divider, all defined for both themes.",
   "motion": "Under reduced motion the chevron turns instantly (system/motion.css sets transition durations to zero)."
  },
  "content": {
   "labels": "Title the panel with a short noun phrase in sentence case (\"Storage\"). Use the description for one line of context, not instructions.",
   "actions": "Use verbs for header actions (\"Edit\", \"Add member\"). Keep the footer for actions that apply to the whole panel.",
   "errors": "Not applicable: the panel shows no error text of its own.",
   "localization": "Padding and the footer alignment use logical properties, so they mirror in right-to-left. Long titles wrap; the toggle names are built from English words in the component."
  }
 },
 "responsive-grid": {
  "purpose": "Shows a collection of cards that fills the available width, adding columns as space allows while keeping each card at a usable minimum size.",
  "anatomy": [
   "Grid — a list (ul) named by `label` (required)",
   "Item — each child wrapped in a list item that stretches to the row's height (required)",
   "Card — the content of an item, usually Card or MediaCard (required)"
  ],
  "behavior": {
   "pointer": "None of its own: the cards inside handle clicks.",
   "keyboard": "None of its own: Tab moves through the cards' links and buttons in source order.",
   "focus": "The grid never takes or moves focus.",
   "responsive": "Columns auto-fill the width with cards at least 100, 140, 180 or 240px wide (`size` xs, sm, md, lg) and share the rest. The gap follows the density (--plx-sys-card-grid-gap).",
   "motion": "None of its own.",
   "loading": "No loading state of its own: show skeleton cards or Loading in its place.",
   "error": "No error state of its own: show a message in place of the grid."
  },
  "a11y": {
   "name": "The list is named by `label` (aria-label).",
   "announce": "A list with the number of items; null, undefined and false children are skipped, so the count is right.",
   "focus": "No focus ring of its own; interactive cards draw the focus ring around the whole card.",
   "contrast": "Not applicable: the grid draws no text or boundaries; the cards do.",
   "motion": "Not applicable: the grid does not animate."
  },
  "content": {
   "labels": "Name the list for what it holds, as a plural noun in sentence case (\"Assets\", \"Projects\").",
   "actions": "Not applicable: the grid has no actions.",
   "errors": "Not applicable: the grid has no error text.",
   "localization": "Columns follow the writing direction, so the first card is at the start in right-to-left too. Card text should wrap or truncate inside the card, not widen it."
  }
 },
 "text": {
  "purpose": "Sets every run of text in one of the system's text roles, so applications never choose a font, size, weight or color themselves.",
  "anatomy": [
   "Element — `as`, a span by default (p, div, h1–h4, dt, dd, label…) (required)",
   "Style — `variant`: body, secondary, caption, data, label, strong, heading, title, display, lead, eyebrow, accent, success, danger or link (required; default body)",
   "Truncation — `truncate`: one line cut with an ellipsis (optional)",
   "Lines — `lines`: at most 2, 3 or 4 lines, the last one cut with an ellipsis (optional)",
   "Show more — with `expandable` and `lines`, a Show more button under the text while it is cut; it reads Show less while the text is open (optional)",
   "Tabular figures — `tabular`: digits of equal width, so numbers line up down a column (optional)"
  ],
  "behavior": {
   "pointer": "Text is static; use Link or Button for anything clickable. Only the Show more button responds: it opens the rest of the text and folds it again.",
   "keyboard": "Text is not focusable. The Show more button is a Tab stop and works with Enter or Space.",
   "focus": "Text never takes focus; the Show more button shows the button focus ring.",
   "responsive": "Text wraps by default. With `truncate` it stays on one line and ends in an ellipsis; with `lines` it stops at that many lines. The Show more button shows only while the text is cut (or open), and the text is measured again when its width changes.",
   "motion": "None of its own.",
   "loading": "Not applicable: Text has no loading state.",
   "error": "Not applicable: the danger role colors text but is not an error state; error messages belong to the field or an inline message."
  },
  "a11y": {
   "name": "Text is content, read as written. A cut text stays whole in the page, so search, copy and screen readers get all of it.",
   "announce": "Only the role of the element chosen with `as` (a heading for h1–h4); the style does not change it, so use `as` for real headings. The Show more button says whether the text is open (aria-expanded) and points at it (aria-controls).",
   "focus": "Text is not in the Tab order; the Show more button is.",
   "contrast": "Styles use theme colors: --plx-sys-content-default, -muted (secondary), -subtle (caption), -link, the accent color and the feedback content colors, each defined for light and dark. Keep caption and secondary for supporting text, not for essential content.",
   "motion": "Not applicable: Text does not animate."
  },
  "content": {
   "labels": "Write in sentence case. Use secondary for hints; data for technical values (IDs, file names and paths, versions, dates and times, sizes, counts, durations: the data font, Reddit Mono, at the secondary size on its own and at the size of the text around it inside a sentence); title once per page; lead (15px) for the opening paragraph of a page or an empty state; display for one key figure or a sign-in or welcome heading. Eyebrow is uppercased by CSS; write it in sentence case.",
   "actions": "Only the Show more button, whose words are Show more and Show less.",
   "errors": "Not applicable: write error text in the field or message that owns it.",
   "localization": "Cut text loses more in longer languages: show the full text elsewhere (a tooltip, a detail view, or Show more). The Show more words come from `strings`. Format dates and numbers for the locale before passing them; the data style only sets the font."
  }
 },
 "heading": {
  "purpose": "Names a page or a section with a title at its level in the outline (Heading), or a group of content with a small uppercase label that can show or hide it (SectionHeading).",
  "anatomy": [
   "Heading — an h1–h6 element (level 3 by default) or a plain div when `level` is null (required)",
   "Label — the text, one line, cut with an ellipsis (required)",
   "Toggle — a button wrapping the label and a chevron when `collapsible` (optional)",
   "Chevron — a small drawn arrow that turns with the expanded state (optional)",
   "Actions — controls at the end of the heading (optional)"
  ],
  "behavior": {
   "pointer": "A collapsible heading runs `onToggle` when its label or chevron is clicked; hovering darkens the label. A plain heading is static.",
   "keyboard": "The toggle is a native button: Enter and Space run `onToggle`. Actions keep their own keys.",
   "focus": "Focus stays on the toggle after it is pressed. The component does not hide the body; the page does that with `controls` and its own state.",
   "responsive": "The label takes the remaining width and truncates to one line; actions keep their size.",
   "motion": "The chevron turns with --plx-sys-motion-duration-fast.",
   "loading": "Not applicable: a heading has no loading state.",
   "error": "Not applicable: a heading has no error state."
  },
  "a11y": {
   "name": "Its visible text. The toggle is named by the same text.",
   "announce": "A heading at its level. A collapsible one contains a button with aria-expanded and aria-controls pointing at the section body.",
   "focus": "No focus-visible style is defined for the toggle in section-heading.css; it relies on the browser's default ring.",
   "contrast": "The label is 11px bold in --plx-sys-content-muted (level 3, the default; level 4 and a plain label are 10px), turning --plx-sys-content-default on hover. The small size suits short group names only; long text is hard to read.",
   "motion": "Under reduced motion the chevron turns instantly."
  },
  "content": {
   "labels": "Use one to three words, a noun in sentence case (\"Recent\", \"Shared with me\"); the CSS uppercases it.",
   "actions": "Use icon buttons with clear names for heading actions (\"Add folder\").",
   "errors": "Not applicable: a heading has no error text.",
   "localization": "Scripts without case are not uppercased. Longer translations truncate, so keep labels short. The layout mirrors in right-to-left through flex and text-align: start."
  }
 },
 "list": {
  "purpose": "Shows short statements that people scan quickly, each led by an icon whose tone says what kind of statement it is (do, don't, feature, requirement).",
  "anatomy": [
   "List — a ul without markers, optionally named by `label` (required)",
   "Item — a li with the statement (required)",
   "Icon — a decorative icon in the item's tone, on the first line (optional)",
   "Number or letter — with `ordered`, an ol numbered (1, 2, 3) or lettered (a, b, c); variant=\"steps\" puts each number in a circle (optional)",
   "Tone — neutral, success, danger, info or warning, coloring the icon only (optional; default neutral)"
  ],
  "behavior": {
   "pointer": "None: List is static.",
   "keyboard": "None: List is not focusable; links inside keep their own keys.",
   "focus": "Not applicable: List never takes focus.",
   "responsive": "Statements wrap onto more lines; the icon stays on the first line.",
   "motion": "None of its own.",
   "loading": "Not applicable: List has no loading state.",
   "error": "Not applicable: List has no error state; the danger tone marks a don't, not an error."
  },
  "a11y": {
   "name": "Set `label` when no heading next to the list describes it; a nearby heading is enough.",
   "announce": "A list with its item count; each item reads its text. The icon is hidden from assistive technology.",
   "focus": "Not in the Tab order.",
   "contrast": "Text uses --plx-sys-content-default; icons use --plx-sys-content-muted or the feedback content colors, defined for both themes. The text must carry the meaning; never rely on the icon's color.",
   "motion": "Not applicable: List does not animate."
  },
  "content": {
   "labels": "Write each statement as one short sentence or phrase in sentence case. Start do items with a verb or the situation; start don't items with what to avoid.",
   "actions": "Not applicable: List has no actions.",
   "errors": "Not applicable: List has no error text.",
   "localization": "Statements wrap, so longer translations fit. The icon sits at the start and mirrors in right-to-left through the flex row."
  }
 },
 "code-block": {
  "purpose": "Shows code or a whole file in the code font with syntax colors and a Copy button, so people can read and reuse it exactly.",
  "anatomy": [
   "Block — a bordered container with surface corners (required)",
   "Head — the title (a file name or caption, in the data font) and the Copy button (optional)",
   "Copy button — a ghost xs Button that reads \"Copied\" with a check for a moment (optional; default shown)",
   "Code — a pre element in the code font on --plx-sys-surface-default, one Tab stop (required)",
   "Tokens — colored spans from the --plx-sys-code-* roles (optional; \"text\" is not colored)"
  ],
  "behavior": {
   "pointer": "Clicking Copy puts the code on the clipboard and shows \"Copied\" for 1.5 seconds. The code scrolls sideways, and with maxHeight \"tall\" also vertically.",
   "keyboard": "Tab reaches the Copy button, then the code region. Enter or Space on Copy copies; the arrow keys scroll the focused code.",
   "focus": "The code region is focusable (tabIndex 0) so keyboard users can scroll it; focus stays on Copy after copying.",
   "responsive": "Lines never wrap; the code scrolls sideways inside the block. The title truncates with an ellipsis.",
   "motion": "None of its own: the Copied label swaps without a transition.",
   "loading": "Not applicable: the code is passed in; the page shows Loading while it fetches a file.",
   "error": "No error state: if the clipboard is unavailable or refuses, nothing happens and no message is shown."
  },
  "a11y": {
   "name": "The code region is named by `label`, else the title, else \"Code\". The Copy button is named by its text.",
   "announce": "The code is read as text; syntax colors are not announced. The change to \"Copied\" is not in a live region, so it may not be announced.",
   "focus": "The code region shows an inset 2px ring in --plx-sys-focus-ring-color; Copy uses the Button ring.",
   "contrast": "Code uses --plx-sys-content-default on --plx-sys-surface-default, and the head --plx-sys-surface-raised; token colors come from the --plx-sys-code-* roles for each theme.",
   "motion": "Nothing animates, so reduced motion changes nothing."
  },
  "content": {
   "labels": "Use the file path or a short caption as the title. Pass a `label` when there is no title, describing what the code is (\"Usage example\").",
   "actions": "The button reads \"Copy\" and \"Copied\"; hide it with copy={false} when the code is not meant to be reused.",
   "errors": "Not applicable: the block shows no error text.",
   "localization": "Code is not translated and stays left-to-right. The \"Copy\", \"Copied\" and \"Code\" strings are English in the component."
  }
 },
 "keyboard-hint": {
  "purpose": "Shows the key or shortcut that triggers an action, next to that action, so people learn faster ways to work.",
  "anatomy": [
   "Key — a kbd element in the data font on a neutral fill, at the 16px label height (required)",
   "On-accent version — `onAccent` for the blue header (optional)"
  ],
  "behavior": {
   "pointer": "None: Kbd is static; the shortcut itself is handled by the page.",
   "keyboard": "None: Kbd only shows a shortcut. It does not register one.",
   "focus": "Not applicable: Kbd never takes focus.",
   "responsive": "The key never wraps (white-space: nowrap). Hide it in narrow places rather than letting it crowd the label.",
   "motion": "None of its own.",
   "loading": "Not applicable: Kbd has no loading state.",
   "error": "Not applicable: Kbd has no error state."
  },
  "a11y": {
   "name": "Its text, read as written.",
   "announce": "The key text. A nearby hint is not tied to the control, so when the shortcut matters, expose it on the control too (aria-keyshortcuts).",
   "focus": "Not in the Tab order.",
   "contrast": "Text uses --plx-sys-content-muted on --plx-sys-fill-neutral; the on-accent version uses --plx-sys-accent-content-muted on --plx-sys-accent-surface-raised.",
   "motion": "Not applicable: Kbd does not animate."
  },
  "content": {
   "labels": "Write keys as they appear on the keyboard, separated by spaces (\"Ctrl K\", \"/\").",
   "actions": "Not applicable: Kbd names keys, not actions.",
   "errors": "Not applicable: Kbd has no error text.",
   "localization": "Key names can change by platform (Ctrl or ⌘) and keyboard layout. Keep the hint at the end of its label so it mirrors with the row in right-to-left."
  }
 },
 "avatar": {
  "purpose": "Identifies a person at a glance with their picture or initials, in a rounded square beside their name.",
  "anatomy": [
   "Frame — a rounded square (never a circle) in a 1px media border; its corner and text size follow the size (required)",
   "Picture — the person's image from `src`, covering the frame (optional)",
   "Initials — first- and last-name letters from `name`, or `initials` when there is no name (optional)",
   "Gender icon — with no picture, `gender` shows the person-male or person-female icon on soft blue or soft pink instead of the initials (optional)",
   "Color — `color`, the person's own data color (its soft fill and text color), or `category`, a category color; otherwise white with gray-700 initials inside the 1px gray border (optional)",
   "Presence dot — `presence`: the person's availability at the bottom end corner (optional)"
  ],
  "behavior": {
   "pointer": "None: Avatar is static. Put it inside a button or link when it should open something.",
   "keyboard": "None: Avatar is not focusable.",
   "focus": "Not applicable: Avatar never takes focus.",
   "responsive": "It keeps its size and does not shrink in a row. Sizes are named: 2xs 20, xs 24, sm 28 (default), md 32, lg 40, xl 48, 2xl 64.",
   "motion": "None of its own.",
   "loading": "No loading state: the picture loads lazily, only when it comes near the view, and the frame shows its background until then.",
   "error": "A picture that fails to load falls back to the initials."
  },
  "a11y": {
   "name": "With `label` the avatar is an image (role=\"img\") named by it. Without `label` it is hidden from assistive technology, so the visible name must be nearby.",
   "announce": "With `label`: an image and the person's name. Without: nothing.",
   "focus": "Not in the Tab order.",
   "contrast": "Without a color of its own an avatar is white with gray-700 initials (about 10:1) in light, and gray-800 with gray-300 initials in dark, inside its 1px border-default border (--plx-sys-avatar-background and --plx-sys-avatar-content; owner, 2026-10-22). A person's own color uses that data color's soft fill with its text color; a category color uses black or white text.",
   "motion": "Not applicable: Avatar does not animate."
  },
  "content": {
   "labels": "Pass the full name; titles such as \"Fr.\" or \"Dr.\" and parenthesized parts are skipped. Use `label` only when no visible name is next to the avatar.",
   "actions": "Not applicable: Avatar has no actions.",
   "errors": "Not applicable: Avatar has no error text.",
   "localization": "Initials take only Latin letters and digits (A–Z, 0–9), so names in other scripts may give no initials; pass `src` or `initials` for them. Initials are always first then last name, whatever the culture's name order."
  }
 },
 "property-list": {
  "purpose": "Shows the facts about one record as label and value pairs, so people can read details, metadata or a settings summary quickly.",
  "anatomy": [
   "List — a description list (dl), in columns or stacked (required)",
   "Item — a label and value pair (required)",
   "Label — the term (dt), a label element when `htmlFor` names a control; cut with an ellipsis and shown in full in a tooltip when too long (required)",
   "Description — a line under the label (optional)",
   "Value — the definition (dd); with `data`, the data font (Reddit Mono) at the value size, on the same baseline as the label, keeping its own writing direction in a right-to-left page (Isolate dir=\"auto\"); a data value is text only: no links, controls or other parts inside it (required)"
  ],
  "behavior": {
   "pointer": "None of its own: controls placed in a value handle their own input.",
   "keyboard": "None of its own: Tab moves through any controls in the values.",
   "focus": "The list never takes or moves focus.",
   "responsive": "In columns the label column is at most 160px and the value takes the rest. Long values break anywhere rather than overflow. Use stacked in narrow places.",
   "motion": "None of its own.",
   "loading": "No loading state of its own: show Loading or skeleton values.",
   "error": "No error state of its own: an editable value shows its control's own invalid state."
  },
  "a11y": {
   "name": "Each value is named by its label through the dt/dd pairing. With `htmlFor`, the label also names the control.",
   "announce": "A description list with its terms and definitions, as the screen reader supports.",
   "focus": "No focus ring of its own; controls inside show theirs.",
   "contrast": "Labels use --plx-sys-content-muted and values --plx-sys-content-default, defined for both themes.",
   "motion": "Not applicable: the list does not animate."
  },
  "content": {
   "labels": "Write labels as short nouns in sentence case without colons (\"Size\", \"Created\"). Use `data` for IDs, file names, paths, versions, sizes, dates and counts; names, descriptions and statuses stay DM Sans. Name and value facts shown as reference (a component's details) belong in a Table; a PropertyList holds one item's own details in a panel, such as an inspector or a form's summary.",
   "actions": "Not applicable: put actions in the surrounding Panel, not in the list.",
   "errors": "Not applicable: the list has no error text of its own.",
   "localization": "The layout uses logical properties, so it mirrors in right-to-left. Format dates, sizes and numbers for the locale before passing them; longer labels need the stacked layout."
  }
 },
 "button": {
  "purpose": "Shows how important an action is: one primary per area, secondary by default, danger for destructive actions.",
  "anatomy": [
   "Container — a button, or a link styled as a button with `href` (required)",
   "Label — the text, cut with an ellipsis when too narrow (required unless icon-only)",
   "Icon — before (`icon`) or after (`iconEnd`) the label; a spinner replaces it while loading (optional)",
   "Caret — the thin outline chevron (expand_more) at the icon size, for a button that opens a menu: muted on the unfilled variants, the label's color on filled or disabled ones (`caret`; owner, 2026-10-14: it replaces the small filled triangle) (optional)",
   "Variant and size — secondary, primary, tertiary, ghost, danger or danger-secondary; 2xs, xs, sm, md or lg (required; defaults secondary, md)"
  ],
  "behavior": {
   "pointer": "Clicking runs `onClick`, unless disabled or loading. Hover changes the fill or border by variant; selected, pressed and expanded show the selected state.",
   "keyboard": "A native button: Enter and Space activate it. With `href` it is a link and activates with Enter.",
   "focus": "In the Tab order; a disabled button leaves it, a loading one stays focusable but inert. The button does not move focus itself.",
   "responsive": "Keeps its label on one line; a long label ends in an ellipsis. In a tight toolbar, use an icon-only button ([`iconOnly`](#development)) with a label.",
   "motion": "The caret turns when expanded, over --plx-sys-motion-duration-fast. The loading spinner turns.",
   "loading": "`loading` shows a spinner (named \"Working\") in place of the icon, keeps the width, sets aria-busy and aria-disabled, and ignores clicks.",
   "error": "Errors: a button has none; report a failed action with a message."
  },
  "a11y": {
   "name": "Its visible label. An icon-only button needs `label` (aria-label), else it falls back to string children.",
   "announce": "A button (or link) with its name, plus aria-expanded for menus, aria-pressed for toggles, and aria-disabled and aria-busy while disabled or loading.",
   "focus": "A 2px ring in --plx-sys-focus-ring-color at --plx-sys-focus-ring-offset (the button focus-ring tokens).",
   "contrast": "Each variant draws its fill, border and text from the --plx-comp-button-* tokens, set from theme roles for light and dark. Disabled buttons use the disabled tokens.",
   "motion": "Under reduced motion the caret turns instantly and animations end at once."
  },
  "content": {
   "labels": "Start with a verb and name the result, in sentence case, one to three words (\"Save\", \"Add member\"). Do not use \"Click here\" or \"OK\" alone.",
   "actions": "Name the specific action (\"Delete project\", not \"Yes\"). Add a caret only when the button opens a menu.",
   "errors": "Not applicable: buttons carry no error text.",
   "localization": "Labels grow in other languages and truncate rather than wrap, so leave room and avoid fixed widths. Icons before and after the label follow the row's direction in right-to-left."
  }
 },
 "button-group": {
  "purpose": "Joins related buttons into one named set (Import | Export), so people see that the actions belong together.",
  "anatomy": [
   "Group — a div with role=\"group\" named by `label` (required)",
   "Buttons — Button children, joined with square inner corners and shared borders (required)"
  ],
  "behavior": {
   "pointer": "Each button acts on its own; the group adds nothing to clicks.",
   "keyboard": "Each button is its own Tab stop with Enter and Space. The group adds no arrow-key movement.",
   "focus": "Tab moves through the buttons in order. The focused button rises above its neighbors so its ring is not covered.",
   "responsive": "An inline row that does not wrap: keep it to a few short labels, or use a menu in narrow spaces.",
   "motion": "None of its own.",
   "loading": "No loading state of its own: set `loading` on the button that is working.",
   "error": "Not applicable: a group has no error state."
  },
  "a11y": {
   "name": "The group is named by `label` (aria-label); each button by its own label.",
   "announce": "A group with its name, then each button as it is reached.",
   "focus": "Each button shows the Button focus ring, raised above its neighbors (--plx-comp-button-group-focus-layer).",
   "contrast": "As Button: the buttons keep their variant colors in both themes.",
   "motion": "Not applicable: the group does not animate."
  },
  "content": {
   "labels": "Name the group with a noun for the set (\"Transfer\"). Give the buttons parallel verb labels (\"Import\", \"Export\").",
   "actions": "Group only actions of the same kind and weight. For one choice from several, use SegmentedControl.",
   "errors": "Not applicable: a group has no error text.",
   "localization": "The joined corners and removed borders use physical sides (left and right), so in right-to-left the joins may not match the button order."
  }
 },
 "toolbar": {
  "purpose": "Puts a set of related controls on one row with a single name, so people reach the actions for one surface together and keyboard users move through them with arrow keys instead of many Tab stops.",
  "anatomy": [
   "Toolbar — the row element with role=\"toolbar\" and its accessible name (required)",
   "Group (Toolbar.Group) — a cluster of related controls with the control gap between them (optional)",
   "Spacer (Toolbar.Spacer) — pushes everything after it to the end of the row (optional)",
   "Controls — Buttons, inputs, selects or links; they take the toolbar control height (required)"
  ],
  "behavior": {
   "pointer": "Each control behaves as on its own; the toolbar adds no pointer behavior.",
   "keyboard": "Arrow Left and Arrow Right move to the previous and next visible, enabled control and wrap around; Home and End jump to the first and last. In a text input, Arrow Left and Right move the caret instead. The toolbar is one Tab stop: Tab enters at the control last used and leaves. A consumer `onKeyDown` that calls preventDefault turns off the toolbar's own key handling.",
   "focus": "Focus moves only on arrow, Home and End keys; nothing is trapped or restored. The toolbar is one Tab stop (the control last used); in a radio group inside it, only the checked option is reached.",
   "responsive": "The row and each group wrap onto more lines (flex-wrap), with the toolbar control gap as the row gap. Do not hide controls by width.",
   "motion": "None of its own.",
   "loading": "Not applicable: the toolbar has no loading state; show a disabled or busy state on the control that is working.",
   "error": "Not applicable: the toolbar has no error state; report errors with the page's feedback components."
  },
  "a11y": {
   "name": "Set `label`; it becomes aria-label on the toolbar. Always name it after what it acts on (\"Asset actions\").",
   "announce": "Announced as a toolbar with its name when focus enters it; each control announces its own role, name and state. The spacer is aria-hidden.",
   "focus": "Focus order follows the DOM order of the controls. Each control shows its own focus ring from the focus ring tokens (--plx-sys-focus-ring-color, offset and width).",
   "contrast": "The toolbar has no surface or border of its own; contrast comes from the controls' theme roles in light and dark.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Name the toolbar with a short noun phrase in sentence case (\"Asset actions\", \"Text formatting\"). Give icon-only buttons in it an accessible name and a tooltip.",
   "actions": "Use short verbs or verb plus noun for its buttons (\"Download\", \"Add tag\"). Put the most used actions first, and secondary ones after the spacer.",
   "errors": "Not applicable: the toolbar shows no error text.",
   "localization": "Labels grow in other languages; the row wraps rather than clipping. The layout uses logical properties and flex order, so it mirrors in right-to-left; Arrow Right still moves to the next control in DOM order."
  }
 },
 "action-bar": {
  "purpose": "Gives the row above a list or grid one consistent place for view options (the view switch, sort, size and export): view controls at the start, output actions at the end.",
  "anatomy": [
   "Toolbar — the DataToolbar root, a Toolbar with the data-toolbar class and its accessible name (required)",
   "Start group — controls at the start of the row, such as the view switch and sort (optional)",
   "Middle controls — any children, placed after the start group (optional)",
   "Spacer — pushes the end group to the end of the row (always present)",
   "End group — controls at the end of the row, such as size and export (optional)"
  ],
  "behavior": {
   "pointer": "Each control behaves as on its own; the data toolbar adds no pointer behavior.",
   "keyboard": "It is a Toolbar: Arrow Left and Right move between its controls and wrap, Home and End jump to the first and last, and in a text input Left and Right move the caret. Tab moves through the controls as usual.",
   "focus": "Focus moves only on arrow, Home and End keys; nothing is trapped or restored.",
   "responsive": "It fills the row width; when the controls do not fit, the Toolbar and its groups wrap onto more lines. It keeps the large stack space below it, above the data.",
   "motion": "None of its own.",
   "loading": "Not applicable: the data toolbar has no loading state; the data below it shows Loading.",
   "error": "Not applicable: the data toolbar has no error state."
  },
  "a11y": {
   "name": "Set `label`; it becomes the toolbar's aria-label (\"View options\").",
   "announce": "A toolbar with its name; each control announces its own role, name and state (a Segmented view switch announces the selected view).",
   "focus": "Focus order is the start group, the middle controls, then the end group. Each control shows its own focus ring from the focus ring tokens.",
   "contrast": "No surface of its own; contrast comes from the controls' theme roles in light and dark.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Name it for what it controls (\"View options\", \"Asset list options\"). Label sort and size controls with nouns (\"Sort by\", \"Size\").",
   "actions": "Use verbs for its buttons (\"Export\"). Keep actions on selected records out of it: those belong in the Bulk action bar.",
   "errors": "Not applicable: the data toolbar shows no error text.",
   "localization": "Labels grow in other languages; the row wraps. Start and end follow the reading direction because the layout uses flex order and logical properties."
  }
 },
 "page-actions": {
  "purpose": "Keeps the buttons that act on a whole page or form (Save, Cancel, Delete) in one place: on the right, the primary last, in view at the bottom while the page scrolls, so a long settings page never hides its Save.",
  "anatomy": [
   "Bar — a group (role=\"group\", named by label) with the page surface behind it and a divider above it: --plx-comp-action-bar-background, --plx-comp-action-bar-line (required)",
   "Buttons — the children, right-aligned, wrapping when narrow: --plx-comp-action-bar-gap (required)"
  ],
  "behavior": {
   "pointer": "Nothing of its own; the buttons act. It sticks to the bottom of the scrolling page while the content above it is longer than the screen.",
   "keyboard": "The buttons are in the Tab order in reading order: a destructive action first, the primary last.",
   "focus": "Focus is not moved to it.",
   "responsive": "Buttons wrap to a new line, still on the right, when the bar is narrow. A scrolling area sets --plx-comp-action-bar-stick to minus its bottom padding, so the stuck bar is flush with its bottom edge.",
   "motion": "None of its own.",
   "loading": "Show the action's own loading state on its button.",
   "error": "Errors show on the fields and in a Notice or a toast, not in the bar."
  },
  "a11y": {
   "name": "label names the group (\"Asset type actions\"); each button has its own name.",
   "announce": "A group of buttons; nothing is announced when it sticks.",
   "focus": "Buttons show the standard focus ring.",
   "contrast": "The bar uses the page surface and the divider role, defined for both themes.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Buttons say what they do (\"Save changes\", \"Delete group\"); one primary per bar, last.",
   "actions": "Put a destructive action first, away from the primary; confirm it in a dialog.",
   "errors": "Not applicable: the bar holds no messages.",
   "localization": "Logical properties: in right-to-left the bar is on the left, the primary still last in reading order."
  },
  "related": [
   "button",
   "settings-page",
   "bulk-action-bar"
  ]
 },
 "bulk-action-bar": {
  "purpose": "The selection bar for a page with no command bar: the commands that act on the selected records, Select all and Clear, and the count at the far end. Where there is a command bar, the selection's commands replace the page's actions in that bar; search and the filters stay, and the bar ends with \"× N selected\", which clears the selection.",
  "anatomy": [
   "Bar — the BulkActions root: a white framed bar like the command bar, never tinted by a selection (required)",
   "Commands — ghost Buttons with icon and label, or a menu button for a group of related commands (required)",
   "More — \"More actions\" (⋮): the commands that do not fit, folded in from the end, Delete last (only on overflow)",
   "Danger divider and danger commands — Delete and other destructive commands last, in the danger color (when any)",
   "Divider — before Select all and Clear (when there are commands)",
   "Select all and Clear — ghost text buttons, disabled with a tooltip saying why until they apply (when their handlers are given)",
   "Count — \"N selected\" at the far end, the number in Reddit Mono, no noun (required)"
  ],
  "behavior": {
   "pointer": "A command runs its onSelect; a command with items opens a Menu. Select all runs onSelectAll, Clear runs onClear. A disabled command shows its why-tooltip on hover.",
   "keyboard": "The bar is a Toolbar: one Tab stop; Arrow Left and Right move between its enabled controls, Home and End jump to the ends. Menus follow the Menu keys (Arrow keys, Home, End, Escape).",
   "focus": "The focus follows the reading order: the commands, More, the danger commands, Select all, Clear. Focus is never moved by a change of selection.",
   "responsive": "Follows the command bar’s button rule: icon and label while the bar fits on one line, then icons only (each with its tooltip), then the commands fold into More one at a time from the end, the danger commands last. Select all, Clear and the count stay.",
   "motion": "None of its own.",
   "loading": "Not applicable: show the progress of a running bulk command with the page’s feedback.",
   "error": "Not applicable: the bar has no error state."
  },
  "a11y": {
   "name": "The toolbar is named by label (default \"Selection actions\"); each command by its label (also when it shows only its icon).",
   "announce": "The count is a polite live region: \"2 selected\" is announced when the selection changes.",
   "focus": "Buttons show the button focus ring.",
   "contrast": "Default surface and border roles for the bar, button roles for the ghost buttons, the danger content role for a danger command, and the disabled role for disabled commands (their tooltips explain why).",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "The count reads \"N selected\" (strings.selected, a template with {n}). The noun and plural go in the tooltips (\"Select assets to download\").",
   "actions": "Short verbs (Download, Move, Delete), in order of use. Mark destructive commands danger; they go last. Mark one-record commands single: they are disabled while several are selected (\"Select one asset to rename\").",
   "errors": "Not applicable.",
   "localization": "Every word is in strings: selected, selectAll, clear, allSelected, nothingToClear, why, single, label and more. The layout uses logical properties for right-to-left."
  }
 },
 "action-menu": {
  "purpose": "Keeps a set of actions behind one button so the surface stays calm, and opens them as a list people can choose from with pointer or keyboard.",
  "anatomy": [
   "Trigger — the one Button that opens the menu, with aria-haspopup and aria-expanded (required)",
   "Menu — the bordered overlay list with role=\"menu\" (required)",
   "Menu item — an action with an optional icon, a danger style or a check (required)",
   "Group — a labeled set of items (MenuGroup) (optional)",
   "Divider — a line between items (MenuDivider) (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the trigger opens or closes the menu; clicking an item runs `onSelect` and closes the menu unless `keepOpen`. A click outside closes it. Disabled items do nothing.",
   "keyboard": "On the trigger, Enter, Space or Arrow Down opens on the first item and Arrow Up on the last. In the menu, Arrow Down and Up move and wrap, Home and End jump to the first and last enabled item, and Enter or Space choose. Escape closes and returns to the trigger; Tab closes and moves on.",
   "focus": "Opening moves focus to the first or last enabled item. Choosing an item returns focus to the trigger, as Escape does; an outside click closes the menu without moving focus back. Focus is not trapped.",
   "responsive": "The menu is 220 to 320px wide and opens below or above the trigger at its start or end edge (`placement`); near a window edge it flips to the other side. Long labels end with an ellipsis.",
   "motion": "None of its own: it appears and disappears without a transition.",
   "loading": "Not applicable: the menu has no loading state; items are passed in when it opens.",
   "error": "Not applicable: the menu has no error state."
  },
  "a11y": {
   "name": "The trigger is named by its own text or aria-label. The menu is named by `label`; groups are named by their label through aria-labelledby.",
   "announce": "The trigger announces a menu button and its expanded state. Items announce menuitem, or menuitemcheckbox with aria-checked when `checked` is set, and disabled items announce aria-disabled. Dividers announce as separators.",
   "focus": "Items show an inset outline from --plx-sys-focus-ring-color on keyboard focus, and the hover background on any focus. The trigger keeps the button focus ring.",
   "contrast": "The menu uses the overlay surface and the default border role, with no shadow drawn (border only). Danger items use the danger content role, disabled items the disabled content role, and group labels the muted content role.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Write items as short, sentence-case verbs or verb plus noun (\"Rename\", \"Move to folder\"). Group labels are nouns.",
   "actions": "Put destructive items last, after a divider, and mark them `danger`. Name the trigger for the set (\"Actions\", \"More\") and show its caret.",
   "errors": "Not applicable: menus show no error text.",
   "localization": "Labels grow in other languages and are truncated at the maximum width. Placement and padding use logical properties, so start and end follow the reading direction."
  }
 },
 "fieldset": {
  "purpose": "Groups two or more controls that answer one question under a single title, so people and assistive technology read them as one set.",
  "anatomy": [
   "Fieldset — the native <fieldset>, with no border or padding, stacking its children (required)",
   "Legend — the group title, in secondary text (required)",
   "Controls — the Fields, checkboxes or other controls in the group (required)"
  ],
  "behavior": {
   "pointer": "None of its own; the controls inside behave as usual.",
   "keyboard": "None of its own; the controls are reached with Tab as native elements.",
   "focus": "None of its own; it does not move or trap focus.",
   "responsive": "The controls stack vertically with the `gap` space (xs, sm or md) and shrink to the available width.",
   "motion": "None of its own.",
   "loading": "Not applicable: a fieldset only groups controls.",
   "error": "Not applicable: the fieldset has no invalid state; each Field inside shows its own error."
  },
  "a11y": {
   "name": "The `legend` names the group; screen readers read it when focus enters the first control.",
   "announce": "Announced as a group; each control announces its own role, name and state. `disabled` (a native fieldset attribute) disables every control inside.",
   "focus": "Focus order is the order of the controls; each control shows its own focus ring.",
   "contrast": "The legend uses the muted content role at 12px; keep it readable in both themes and add no colors.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Write the legend as a short noun phrase in sentence case (\"Export\", \"Size\"). Do not repeat it in each control's label.",
   "actions": "Not applicable: a fieldset has no actions.",
   "errors": "Not applicable: put error text on the Field that is wrong, not on the group.",
   "localization": "Legends wrap onto more lines when they grow. Margins and padding use logical properties, so it works right-to-left."
  }
 },
 "field": {
  "purpose": "Gives every input a visible label, help text and error message, connected to the control, so people know what to enter and what went wrong.",
  "anatomy": [
   "Label — the <label> tied to the control, with \" *\" when required (required)",
   "Info button — a small (i) button that shows and hides extra info (optional)",
   "Control — exactly one input, select, textarea or other control (required)",
   "Description — help text under the control, or under the label in the row layout (optional)",
   "Error — the error message under the control (optional)",
   "Info text — the extra info shown under the control when the (i) button is on (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the label focuses the control. Clicking the (i) button shows or hides the info text; its hit area extends beyond the 16px circle.",
   "keyboard": "The control and the (i) button are native elements reached with Tab; Enter or Space toggles the info text.",
   "focus": "Field does not move focus; showing the error or the info text leaves focus where it is.",
   "responsive": "Stacked puts the label above the control; inline puts it in a 160px label column beside the control (or the `labelWidth` size); row puts the label and description at the start and the control at the end. The layout does not change with width.",
   "motion": "None of its own.",
   "loading": "Not applicable: a field has no loading state.",
   "error": "`error` shows the message under the control in the danger content color and turns the control's border the danger color, with no outer ring. It also marks the control invalid (aria-invalid) unless the child sets `invalid` itself."
  },
  "a11y": {
   "name": "The visible `label` names the control through for and id; Field gives the child a generated id unless it has one. The (i) button is named by `infoLabel` (default \"About \" + the label).",
   "announce": "The description and error are linked through aria-describedby. The error has role=\"alert\", so it is announced when it appears. `required` sets the control required; the asterisk is aria-hidden. The (i) button announces its expanded state.",
   "focus": "The (i) button shows the focus ring tokens (--plx-sys-focus-ring-color and offset). A focused input changes only its border to the focus color.",
   "contrast": "The label uses the default content role, the description the subtle content role, the error and asterisk the danger content role, and the info text the muted role on the sunken surface. Do not show the error by color alone: always set the message.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Use a short noun in sentence case (\"File name\"), without a colon. Do not use a placeholder as the only label.",
   "actions": "Not applicable: a field has no actions of its own.",
   "errors": "Say what is wrong and how to fix it, in one sentence (\"Enter a name of 64 characters or fewer\"). Do not blame the person or show error codes.",
   "localization": "Labels grow in other languages; the stacked layout copes best, while the inline 160px label column may need a wider `labelWidth`. The grid and spacing use logical properties for right-to-left."
  }
 },
 "text-field": {
  "purpose": "Lets people type one line of text, such as a name or a code, at the standard control height.",
  "anatomy": [
   "Input — the native <input> with the control border and background (required)",
   "Placeholder — a hint shown while it is empty (optional)",
   "Field — the label, help and error around it (required in forms)"
  ],
  "behavior": {
   "pointer": "Clicking places the caret; hovering darkens the border to the strong border role.",
   "keyboard": "A native input reached with Tab; it handles typing and editing keys as the browser does.",
   "focus": "Focus changes only the border to the focus color; there is no outer ring.",
   "responsive": "It fills its container up to 600px wide. `width` (xs, sm, md, lg) sets a narrower fixed width from the field width tokens.",
   "motion": "None of its own.",
   "loading": "Not applicable: an input has no loading state.",
   "error": "`invalid` (set by Field's `error`) sets aria-invalid and turns the border to the danger color. Disabled uses the neutral fill and disabled text; read-only uses the sunken surface."
  },
  "a11y": {
   "name": "Name it with the label of the Field it sits in; Field connects them for you.",
   "announce": "An edit text with its name, description and error (aria-describedby), plus invalid and required states.",
   "focus": "Reached with Tab in DOM order; the focus border uses --plx-sys-focus-ring-color.",
   "contrast": "Text uses the default content role on the control background, the border the control border role, and the placeholder the field placeholder role; they hold in light and dark.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Label it in the Field, not in the placeholder. Use the placeholder only for an example of the format.",
   "actions": "Not applicable: an input has no actions.",
   "errors": "Write the error in the Field's `error`; say what to change (\"Enter a valid email address\").",
   "localization": "Size the field for the expected content, not the English example. Padding uses logical properties, so text starts on the right in right-to-left. Use `data` (Reddit Mono) only for codes, hex values and other technical values."
  }
 },
 "text-area": {
  "purpose": "Lets people write several lines of plain text, such as notes and descriptions.",
  "anatomy": [
   "Textarea — the native <textarea> with the control border and background (required)",
   "Resize handle — the native handle that resizes it vertically (always present)",
   "Field — the label, help and error around it (required in forms)"
  ],
  "behavior": {
   "pointer": "Clicking places the caret; dragging the handle resizes it vertically only. Hovering darkens the border.",
   "keyboard": "A native textarea reached with Tab; Enter adds a new line, and Tab leaves it.",
   "focus": "Focus changes only the border to the focus color; there is no outer ring.",
   "responsive": "It fills its container up to 600px wide and starts at `rows` lines (default 3), at least 60px high.",
   "motion": "None of its own.",
   "loading": "Not applicable: a textarea has no loading state.",
   "error": "`invalid` sets aria-invalid and the danger border. Disabled and read-only look as for Input."
  },
  "a11y": {
   "name": "Name it with the label of the Field it sits in.",
   "announce": "A multi-line edit text with its name, description, error, invalid and required states.",
   "focus": "Reached with Tab in DOM order; the focus border uses --plx-sys-focus-ring-color.",
   "contrast": "It uses the same roles as Input: default content on the control background with the control border.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Use a short noun label in sentence case (\"Notes\", \"Description\"). Mention a length limit in the description.",
   "actions": "Not applicable: a textarea has no actions.",
   "errors": "Say what to change (\"Shorten the description to 500 characters or fewer\").",
   "localization": "Text wraps inside; padding uses logical properties for right-to-left. The text uses the UI font, not Reddit Mono."
  }
 },
 "native-select": {
  "purpose": "Lets people pick one value from a short, known list with the platform's own select, at the standard control height.",
  "anatomy": [
   "Wrapper — the span that holds the select and the chevron (required)",
   "Select — the native <select> with the control border (required)",
   "Chevron — the arrow icon at the end, drawn with the keyboard-arrow-down glyph (always present)",
   "Options — from `options` or <option> children (required)"
  ],
  "behavior": {
   "pointer": "Clicking opens the browser's own option list; hovering darkens the border.",
   "keyboard": "A native select reached with Tab; the browser handles Arrow keys, typing to jump, and Enter, Space or Alt+Arrow Down to open.",
   "focus": "Focus changes only the border to the focus color; the browser's list returns focus to the select when it closes.",
   "responsive": "It fills its container up to 600px wide; the open list is the browser's own and fits the screen.",
   "motion": "None of its own.",
   "loading": "Not applicable: the select has no loading state.",
   "error": "`invalid` sets aria-invalid and the danger border. Options can be disabled one by one."
  },
  "a11y": {
   "name": "Name it with the label of the Field it sits in.",
   "announce": "Announced as a combo box or a popup button, depending on the browser, with its name, the selected option, and its invalid and required states.",
   "focus": "Reached with Tab in DOM order; the focus border uses --plx-sys-focus-ring-color.",
   "contrast": "The chevron uses the muted content role; the text and border use the same roles as Input.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Label it with a noun in the Field. Write options as short nouns in sentence case, in a logical order. A chosen value that is wholly a number, a date, a time, a size, a version, a file name or an ID (\"10\", \"Oct 25, 2026\") shows in the data font, like the numbers and dates around it; a word (\"Compact\", \"15 minutes\") keeps the interface font. `data` forces it: true the data font, false the interface font.",
   "actions": "Not applicable: options are values, not actions.",
   "errors": "Say what to choose (\"Choose a format\").",
   "localization": "The chevron sits at the inline end and padding uses logical properties, so it mirrors in right-to-left. Sort options for each language when the order is alphabetical."
  }
 },
 "checkbox": {
  "purpose": "Lets people turn one option on or off, or choose several options, with a native checkbox; it can also show that only part of a group is chosen.",
  "anatomy": [
   "Row — the <label> that holds the box and text; the whole row is the target (required)",
   "Box — the native checkbox, 16px, in the primary action color (required)",
   "Label — the text beside the box (optional, but name it another way when left out)",
   "Description — a second line under the label (optional)"
  ],
  "behavior": {
   "pointer": "Clicking anywhere on the row toggles the box. The row is at least the inline control height.",
   "keyboard": "A native checkbox reached with Tab; Space toggles it.",
   "focus": "Focus stays on the box; it does not move focus elsewhere.",
   "responsive": "The label and description wrap beside the box; the box stays aligned with the first line.",
   "motion": "None of its own.",
   "loading": "Not applicable: a checkbox has no loading state.",
   "error": "Checkbox has no invalid style of its own; disabled dims the row to 50% opacity. Show an error with a Field or the form's message."
  },
  "a11y": {
   "name": "The visible `label` names it (the input is inside the <label>). Without a label, pass aria-label.",
   "announce": "A checkbox that is checked, not checked, or mixed when `indeterminate` is set (the native indeterminate property). The description is not linked with aria-describedby.",
   "focus": "The box shows the focus ring tokens (--plx-sys-focus-ring-color, offset and width) on keyboard focus.",
   "contrast": "The box is the browser's own control, colored with accent-color from the primary action role; the label uses the default content role and the description the subtle content role.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Write the label as a positive statement in sentence case (\"Include subfolders\"), not a question or a negative.",
   "actions": "Not applicable: a checkbox records a choice; use Switch for a setting that takes effect at once.",
   "errors": "Say what is needed (\"Accept the terms to continue\") in the Field or form message.",
   "localization": "Labels wrap; gaps and margins use logical properties, so the box sits at the start in right-to-left."
  }
 },
 "radio-group": {
  "purpose": "Lets people choose exactly one option from a few, with all the options visible at once.",
  "anatomy": [
   "Group — the native <fieldset> with no border (required)",
   "Legend — the group title (optional, but name the group another way when left out)",
   "Radio — each native radio with its row label (required)",
   "Description — a second line under a radio's label (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a radio's row chooses it and runs `onChange` with its value.",
   "keyboard": "Native radios: Tab reaches the checked radio (or the first when none is checked), and the arrow keys move and choose within the group.",
   "focus": "The browser keeps one Tab stop for the group; focus moves with the arrow keys.",
   "responsive": "`layout` column stacks the options; row puts them side by side and wraps them.",
   "motion": "None of its own.",
   "loading": "Not applicable: a radio group has no loading state.",
   "error": "No invalid style of its own; disabled options dim to 50% opacity. Show an error with the form's message."
  },
  "a11y": {
   "name": "The `label` becomes the <legend> and names the group; each radio is named by its visible label.",
   "announce": "A radio button with its name, its selected state and its position in the group; the group name is read on entry. All radios share one generated `name` unless you pass one.",
   "focus": "The radio shows the focus ring tokens on keyboard focus.",
   "contrast": "The radios use accent-color from the primary action role; the legend uses the default content role and descriptions the subtle content role.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Write the legend as a short noun or question (\"Format\"). Write options as short, parallel nouns in sentence case.",
   "actions": "Not applicable: radios choose a value.",
   "errors": "Say what to choose (\"Choose a format\").",
   "localization": "Options grow and wrap in other languages; the row layout wraps. Spacing uses logical properties for right-to-left."
  }
 },
 "switch": {
  "purpose": "Turns a setting on or off at once, without a Save step.",
  "anatomy": [
   "Row — the <label> around the switch; the whole row is the target (required)",
   "Input — a native checkbox with role=\"switch\", invisible over the row (required)",
   "Track — the 36 by 20px pill that turns the primary color when on (required)",
   "Knob — the 16px circle that slides to the end when on (required)",
   "Label — the text beside it, or the accessible name when `labelHidden` (required)"
  ],
  "behavior": {
   "pointer": "Clicking anywhere on the row toggles it and runs `onChange`.",
   "keyboard": "A native checkbox reached with Tab; Space toggles it.",
   "focus": "Focus stays on the switch; the track shows the focus ring.",
   "responsive": "The row keeps its size; a long label wraps beside the track.",
   "motion": "The track color and the knob position change over --plx-sys-motion-duration-base with --plx-sys-motion-ease-standard.",
   "loading": "Not applicable: the switch has no loading state; if the setting saves slowly, show progress elsewhere.",
   "error": "No invalid style; disabled dims the track to 50% opacity. If saving fails, set it back and say why in a message."
  },
  "a11y": {
   "name": "The visible `label` names it; with `labelHidden`, the label becomes aria-label and is not shown.",
   "announce": "A switch that is on or off.",
   "focus": "The track shows the focus ring tokens (--plx-sys-focus-ring-color, offset and width) on keyboard focus.",
   "contrast": "Off uses the default border role for the track; on uses the primary action role. The knob uses the control background with a shadow. Do not rely on the color change alone: the knob position also changes.",
   "motion": "With reduced motion, the system sets transitions to 0s, so the switch changes at once."
  },
  "content": {
   "labels": "Name the setting, not the action, in sentence case (\"Notifications\", \"Show file extensions\"). Do not add \"On\" or \"Off\" text.",
   "actions": "Not applicable: the switch is the action; it takes effect at once.",
   "errors": "If the change fails, say what happened and what to do (\"Could not turn on notifications. Try again.\").",
   "localization": "Labels wrap in other languages. The knob starts at the inline start, but it moves with a physical translateX, so in right-to-left it slides the wrong way."
  }
 },
 "color-swatch": {
  "purpose": "Shows a color that comes from the data, such as a category's or a tag's color, and as a button lets people pick that color.",
  "anatomy": [
   "Swatch — a 16 or 20px chip filled with the data color, with the default border (required)",
   "Shape — square with 2px corners (default) or round (optional)",
   "Pressed mark — a 2px ring in the default content color around the chosen swatch (optional, with onClick)"
  ],
  "behavior": {
   "pointer": "Without `onClick` it is a decorative span. With `onClick` it is a button that picks the color; it has a pointer cursor.",
   "keyboard": "As a button it is reached with Tab and picked with Enter or Space. A row of swatches has no arrow-key handling of its own; put it in a Toolbar for that.",
   "focus": "As a button it shows the focus ring tokens; it does not move focus.",
   "responsive": "It keeps its size and does not shrink; lay several out in a wrapping row.",
   "motion": "None of its own.",
   "loading": "Not applicable: a swatch has no loading state.",
   "error": "Not applicable: a swatch has no error state; show a bad hex value on the hex Field."
  },
  "a11y": {
   "name": "As a button, set `label` (aria-label) to the color name (\"Blue\"). As a span it is aria-hidden, so put the name in text beside it.",
   "announce": "As a button, a toggle button with its name and pressed state (aria-pressed). As a span, nothing.",
   "focus": "The button shows --plx-sys-focus-ring-color at the focus ring offset and width.",
   "contrast": "The default border role outlines the chip, so light colors stay visible on light surfaces and dark ones on dark. Never use the color as the only sign of meaning: show the name too.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Name colors plainly in sentence case (\"Blue\", \"Dark green\"), not by hex value; show a hex value only in a Reddit Mono data field.",
   "actions": "Not applicable: picking a swatch is the action; say what it does in the surrounding label (\"Tag color\").",
   "errors": "Not applicable: the swatch shows no error text.",
   "localization": "Translate color names. The chip has no text, so it does not change for right-to-left."
  }
 },
 "drop-zone": {
  "purpose": "Shows where files can be dropped to upload them, and highlights while files are dragged over it; as an overlay it covers a page that accepts files dropped anywhere.",
  "anatomy": [
   "Zone — a dashed region on the sunken surface (required)",
   "Content — the text and icon inside, such as \"Drop files or click to choose\" (required)",
   "Active highlight — the selected state background and border while files are over it (when `active`)",
   "Overlay — a 2px selected border covering its positioned parent (when `overlay`)"
  ],
  "behavior": {
   "pointer": "The page handles dragenter, dragover and drop and sets `active`. With as=\"button\", clicking runs `onClick` (open the file picker). An overlay ignores the pointer so the drop reaches the page.",
   "keyboard": "As a button it is reached with Tab and activated with Enter or Space. As a div it has no keyboard access: always offer a button to choose files.",
   "focus": "It does not move or trap focus.",
   "responsive": "It fills its container width and centers its content; the overlay sits inset from its parent's edges.",
   "motion": "None of its own: the highlight changes at once.",
   "loading": "Not applicable: the zone has no loading state; show upload progress in the upload list.",
   "error": "Not applicable: the zone has no error state; say which files were refused in the upload dialog or a Toast."
  },
  "a11y": {
   "name": "As a button, its visible content names it. As a div it has no role or name.",
   "announce": "As a button, a button with its text. The active and overlay highlights are visual only and are not announced.",
   "focus": "Only the button version takes Tab focus; it then shows the standard focus ring. The plain drop area takes no focus.",
   "contrast": "The dashed border uses the strong border role on the sunken surface; active and overlay use the selected state background and the selected border role, which hold in light and dark.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Say what to do and what fits (\"Drop files or click to choose\", then accepted types and the size limit as a second line).",
   "actions": "Use \"click to choose\" only when it is a button. In an overlay, say what happens on drop (\"Drop to upload to Marketing\").",
   "errors": "Not applicable: the zone shows no error text.",
   "localization": "Text is centered and wraps; padding and the overlay inset use logical properties for right-to-left. Write sizes with the locale's number format."
  }
 },
 "choice-card": {
  "purpose": "Lets people choose one option when each option needs a description to decide, shown as bordered cards with a radio each (the Display density choice).",
  "anatomy": [
   "List — the native <fieldset> with no border, stacking the cards (required)",
   "Legend — the title of the list (optional, but name the group another way when left out)",
   "Card — a bordered <label> holding one radio and its text; the whole card is the target (required)",
   "Radio — the native radio at the start of the card (required)",
   "Label and description — the option name and its explanation (label required, description optional)"
  ],
  "behavior": {
   "pointer": "Clicking anywhere on a card chooses it and runs `onChange` with its value; hovering shows the hover background.",
   "keyboard": "Native radios: Tab reaches the chosen card's radio, and the arrow keys move and choose within the list.",
   "focus": "The browser keeps one Tab stop for the list; the focused card shows the focus ring around the whole card.",
   "responsive": "Cards stack in one column up to 560px wide; text wraps inside each card. An option with `hidden` is not shown.",
   "motion": "None of its own.",
   "loading": "Not applicable: a choice list has no loading state.",
   "error": "Not applicable: ChoiceList has no invalid or disabled state in the code."
  },
  "a11y": {
   "name": "`legend` names the group; each radio is named by the card's text, label and description together (the input is inside the <label>).",
   "announce": "A radio button with its name, selected state and position in the group.",
   "focus": "The card shows the focus ring tokens (--plx-sys-focus-ring-color, offset and width) when its radio has keyboard focus.",
   "contrast": "Cards use the control border role; the selected card uses the selected state background and the primary action role for its border. The label uses the default content role and the description the muted role.",
   "motion": "Nothing to reduce: it has no motion."
  },
  "content": {
   "labels": "Use a short noun for each option (\"Compact\", \"Standard\", \"Comfortable\"), in sentence case. Write the description as one sentence about what changes.",
   "actions": "Not applicable: cards choose a value.",
   "errors": "Not applicable: the list shows no error text.",
   "localization": "Descriptions grow in other languages and wrap in the card. Padding and gaps use logical properties, so the radio sits at the start in right-to-left."
  }
 },
 "segmented-control": {
  "purpose": "Lets people pick one of a few short options that take effect at once, such as a view, a size or a theme. All options stay visible, so the current choice is obvious.",
  "anatomy": [
   "Group — a radio group of joined segments: a 1px control-border edge around the group and between segments, the control radius on the outer corners, square joins, no gray track and no raised white thumb; look A (owner, 2026-10-14) (required)",
   "Option — a button with role radio at the button height (control-height-standard; control-height-toolbar for size sm), on control-background; text, an icon, or both (required, two to five)",
   "Selected option — the selected-state blue tint (--plx-sys-state-selected) with blue text and icon (--plx-sys-selected-content) (required)",
   "Option icon — an icon before the label; icon-only options need `ariaLabel` (optional)"
  ],
  "behavior": {
   "pointer": "Clicking an option chooses it and runs `onChange` with its value. Hovering an unselected option shows the hover state (state-hover) behind its text.",
   "keyboard": "Arrow Right or Arrow Down chooses the next option, Arrow Left or Arrow Up the previous one, wrapping around; Home and End choose the first and last. Arrows choose as they move, so the value changes with each key.",
   "focus": "Only the chosen option is in the Tab order (roving tabindex). Arrow keys move focus together with the choice.",
   "responsive": "It is an inline-flex row that does not wrap, and labels do not wrap. Keep labels short; use `size=\"sm\"` in tight toolbars.",
   "motion": "None of its own. The selected state changes instantly.",
   "loading": "Not applicable: the choice is local and applies at once.",
   "error": "Not applicable: one option is always chosen, so there is no invalid state."
  },
  "a11y": {
   "name": "The group takes its name from `label` (aria-label). Text options are named by their text; icon-only options use `ariaLabel`, or their value as a fallback.",
   "announce": "Announced as a radio group; each option as a radio with its checked state (aria-checked).",
   "focus": "The focused option shows the 2px focus ring in --plx-sys-focus-ring-color at --plx-sys-focus-ring-offset.",
   "contrast": "Unselected text uses content-default on control-background; the selected option uses selected-content on state-selected, a pair the contrast test measures in light and dark (CONTRAST_PAIRS: Text of a selected row or item). The group edge is control-border, 3:1 on the surface.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Use one or two words in sentence case, all of the same kind (sizes, views, modes). Use nouns or adjectives, not verbs.",
   "actions": "Not applicable: options set a value; they do not run commands.",
   "errors": "Not applicable: there is no error state.",
   "localization": "Labels do not wrap, so allow for 30–40% longer text or switch to Native select. The joins and corners are logical (they mirror right to left), but the arrow keys do not reverse in right-to-left layouts."
  }
 },
 "rating": {
  "purpose": "Lets people give an item a score from one to five stars, or shows a score as a read-only picture.",
  "anatomy": [
   "Group — a radio group of stars, or an image when `readOnly` (required)",
   "Star — a button with role radio, filled when it is at or below the value (required)",
   "Filled star — uses the rating-active role; empty stars use rating-inactive (required)"
  ],
  "behavior": {
   "pointer": "Clicking a star sets the rating to that star. Clicking the current star again clears the rating to 0.",
   "keyboard": "Arrow Right and Arrow Up raise the rating by one, up to `max`; Arrow Left and Arrow Down lower it, down to 1. Space or Enter on a star chooses it (native button), and on the current star clears it.",
   "focus": "One star is in the Tab order: the current one, or the first star when there is no rating. Arrow keys change the value but do not move focus to another star.",
   "responsive": "An inline-flex row of fixed-size targets; it does not wrap. Each interactive star is at least the inline control height square.",
   "motion": "None of its own.",
   "loading": "Not applicable: the value is set locally.",
   "error": "Not applicable: there is no invalid state. Put a required rating inside a Field to show its message."
  },
  "a11y": {
   "name": "The group is named by `label` (default \"Rating\"). Each star is named \"1 star\", \"2 stars\" and so on.",
   "announce": "Announced as a radio group with the chosen star checked. Read-only, it is an image announced as \"Rating: 3 of 5\".",
   "focus": "Stars use the native button focus style; the stylesheet sets no focus ring of its own.",
   "contrast": "Filled and empty stars use the rating-active and rating-inactive roles, defined for both themes. Do not rely on color alone to show a partial value; give the number nearby when it matters.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Name what is being rated in `label` (\"Image quality\"), in sentence case. Do not put numbers in the label.",
   "actions": "Not applicable: choosing a star is the action.",
   "errors": "Not applicable: there is no error text of its own.",
   "localization": "Star names (\"star\", \"stars\") and the read-only phrase \"of\" are hard-coded in English. Arrow keys do not reverse in right-to-left layouts."
  }
 },
 "combobox": {
  "purpose": "Lets people choose one or several values from a long list by typing to filter it, and optionally create a value that is not there.",
  "anatomy": [
   "Field — the bordered input area (.plx-input) with role combobox (required)",
   "Chevron — the down arrow at the field's end, decorative (required)",
   "Tags — chosen values as removable Tags before the text, with `multiple` (optional)",
   "List — the listbox below the field, a menu surface (required while open)",
   "Group heading — options with a `group` listed under it (optional)",
   "Create option — \"Create “text”\" when `creatable` and nothing matches exactly (optional)",
   "Empty text — `emptyText`, default \"No matches\" (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the field focuses it and opens the list; clicking an option chooses it. A single choice closes the list; with `multiple` the option toggles and the list stays open. A click outside closes the list.",
   "keyboard": "Arrow Down opens the list, then moves down; Arrow Up moves up. Enter chooses the active option, Escape closes the list. Backspace in an empty multiple field removes the last value.",
   "focus": "Focus stays in the input; the active option is shown with aria-activedescendant. A Tag's remove button is its own Tab stop.",
   "responsive": "The field fills its container up to 600px; with `multiple` the tags wrap onto more lines. The list matches the field's width and scrolls after 220px.",
   "motion": "None of its own. The list appears and disappears instantly.",
   "loading": "No loading state of its own. Load options before opening, or show the empty text until they arrive.",
   "error": "`invalid` sets aria-invalid on the field, which turns its border to the danger color. Put the message in a Field."
  },
  "a11y": {
   "name": "Inside a Field, the Field's label names it through `id`. Without a Field, give `label` (aria-label).",
   "announce": "Announced as a combobox with its expanded state and list autocomplete. Options are announced with their selected state; with `multiple` the listbox is multiselectable.",
   "focus": "The field's border turns to --plx-sys-focus-ring-color while focus is inside; there is no outer ring. The active option uses the state-selected background.",
   "contrast": "Text uses content-default; placeholder uses field-placeholder; chosen options and Create use content-link. The list uses surface-overlay with a border-default line in both themes.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Use a short noun in sentence case (\"Owner\", \"Tags\"). Use the placeholder only as a hint, never as the label. A chosen value that is wholly a number, a date, a time, a size, a version, a file name or an ID (\"10\", \"Oct 25, 2026\") shows in the data font, like the numbers and dates around it; a word (\"Compact\", \"15 minutes\") keeps the interface font. `data` forces it: true the data font, false the interface font.",
   "actions": "The create option reads \"Create “text”\" with the typed text; keep the typed value as written.",
   "errors": "Say what to do: \"Choose an owner\", not \"Invalid value\". Show it in the Field under the combobox.",
   "localization": "Filtering is a case-insensitive substring match on labels; it is not accent-aware. Positions use logical properties, so the chevron and list follow right-to-left layouts."
  }
 },
 "creatable-select": {
  "purpose": "Lets people add free-form tags to a record by typing a word and pressing Enter at the end of a tag list.",
  "anatomy": [
   "Tag list — TagList, a wrapping row; a group when it has a `label` (required)",
   "Tags — the existing Tags, each with an optional × remove button (required)",
   "Add field — TagInput, a text field like every other, at the end of the list (required)",
   "Remove button — a 16px × with a 24px target, from `onRemove` (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the input places the cursor in it. Clicking a tag's × runs its `onRemove`.",
   "keyboard": "TagInput is a native text input reached with Tab. It handles no keys itself: the page adds the tag on Enter through `onKeyDown`.",
   "focus": "Focus stays in the input after a tag is added, because the page only updates the list. Each remove button is its own Tab stop.",
   "responsive": "The list wraps onto more lines. The input is a fixed narrow width at the end of the last line.",
   "motion": "None of its own.",
   "loading": "Not applicable: tags are added locally.",
   "error": "No invalid state of its own. Reject duplicates or bad values in the page's handler and show the message in a Field."
  },
  "a11y": {
   "name": "TagInput has no built-in label. Give it `aria-label` (\"Add a tag\"); a placeholder alone is not a name.",
   "announce": "The input is a text field. Remove buttons are named \"Remove\" plus the tag text. Adding a tag announces nothing unless the page adds a live region.",
   "focus": "The add field shows the field's focused border, like every field; the remove button uses the native focus style.",
   "contrast": "Tags use fill-neutral-content on fill-neutral; the input text uses content-default and its placeholder content-subtle, in both themes.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Use a placeholder such as \"Add a tag\". Write tags as short lowercase or sentence-case keywords.",
   "actions": "Not applicable: Enter adds the tag; there is no button.",
   "errors": "Say the problem and fix in one line: \"That tag is already added.\"",
   "localization": "Tags do not wrap inside themselves; long translated tags widen the row. Spacing uses logical properties for right-to-left layouts."
  }
 },
 "search-input": {
  "purpose": "Lets people type a query to find things, with a clear button and an optional shortcut hint and loading spinner.",
  "anatomy": [
   "Search region — the wrapper with role search (required)",
   "Search icon — a magnifier at the start, decorative (required)",
   "Input — a search-type input at the toolbar control height (required)",
   "Clear button — \"Clear search\", shown while there is text and `onClear` is given (optional)",
   "Shortcut hint — a Kbd such as \"Ctrl K\", shown while the field is empty (optional)",
   "Spinner — replaces the icon while `loading` (optional)",
   "Search button — in a narrow command bar (collapsed): an icon-only ghost button in the field's place, tinted while there is text; it opens the field across the bar (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the field places the cursor. Collapsed, the search button opens the field across the bar, focused. Clicking the clear button runs `onClear`. Hovering the clear button shows the hover state.",
   "keyboard": "A native search input reached with Tab; it adds no key handling. The shortcut hint only shows a key; the page binds it (AppHeader binds Ctrl K).",
   "focus": "The clear button is a separate Tab stop after the input. Clearing does not move focus back to the input.",
   "responsive": "The width rule (owner, 2026-10-14): in a bar the search comes first on the find side at one fixed width (width=\"bar\", 240px, --plx-comp-search-bar-width), never squeezed to an odd width; inside a panel, a dialog or a menu it fills it (width=\"fill\"); elsewhere it fills its container (width=\"auto\"). In a narrow command bar it collapses to its search button (collapsed); the opened field spans the bar, × clears it, Escape closes it and returns focus to the button, and leaving it empty closes it too. Filled like every field (light gray), outlined, the height of the buttons beside it.",
   "motion": "None of its own; the spinner spins with the shared motion-spin animation.",
   "loading": "`loading` shows a small Spinner in place of the search icon. It sits in an aria-hidden slot, so it is not announced.",
   "error": "Not applicable: search has no invalid state. Show \"No results\" in the results area."
  },
  "a11y": {
   "name": "`label` names the input (default \"Search\"). The clear button is named \"Clear search\".",
   "announce": "Announced as a search landmark and a search field. Loading is not announced; announce result counts from the results area.",
   "focus": "The focused input changes only its border to --plx-sys-focus-ring-color; there is no outer ring. The clear button shows the 2px focus ring.",
   "contrast": "On page surfaces it uses content-default on the field background with the field border, like every field. `onAccent` switches to the accent-field roles for the blue header.",
   "motion": "The spinner stops under reduced motion (the shared rule sets one zero-length iteration)."
  },
  "content": {
   "labels": "Keep the placeholder to \"Search\" or \"Search assets\". Do not write instructions in it.",
   "actions": "Not applicable: search runs as people type or on Enter, as the page decides.",
   "errors": "Not applicable: write empty results as \"No results for “query”\" in the results area.",
   "localization": "Icon and button positions use logical properties, so they swap in right-to-left layouts. Show shortcut hints with the platform's key names (Cmd on Mac)."
  }
 },
 "slider": {
  "purpose": "Lets people pick a value from a range by dragging, when the approximate position matters more than the exact number.",
  "anatomy": [
   "Label — the visible label above the track (required)",
   "Value — an output showing the value and `unit` (required)",
   "Track and thumb — a native range input in the primary action color (required)"
  ],
  "behavior": {
   "pointer": "Dragging or clicking the track changes the value; `onChange` follows every move. Letting go runs `onCommit`.",
   "keyboard": "It is a native range input: arrow keys step by `step`, Page Up and Page Down jump, Home and End go to `min` and `max`. Releasing one of these keys runs `onCommit`.",
   "focus": "One Tab stop, the input. Focus is not moved or trapped.",
   "responsive": "The track fills the container's width; the label and value share the row above it.",
   "motion": "None of its own.",
   "loading": "Not applicable: the value is local.",
   "error": "Not applicable: a range input cannot hold an out-of-range value. `disabled` dims it to 50% opacity."
  },
  "a11y": {
   "name": "The visible `label` is tied to the input with htmlFor.",
   "announce": "Announced as a slider with its value; aria-valuetext adds the unit (\"40%\").",
   "focus": "The input shows the 2px focus ring in --plx-sys-focus-ring-color at --plx-sys-focus-ring-offset.",
   "contrast": "The label uses content-default and the value content-muted; the track uses accent-color from action-primary-background in both themes.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Name the setting in sentence case (\"Brightness\"). Put the unit in `unit`, not in the label.",
   "actions": "Not applicable: dragging is the action.",
   "errors": "Not applicable: there is no error state.",
   "localization": "The value is shown as the raw number plus `unit`; it is not locale-formatted. The value uses the data font (Reddit Mono) as a technical value."
  }
 },
 "application-header": {
  "purpose": "Gives every Plenix application the same top bar for switching applications, pinned applications, search, the application's one action and the account.",
  "anatomy": [
   "Header name — \"Plenix\" over the application's name with a chevron; the Product switcher (required)",
   "Header links — pinned applications as icon links with tooltips (optional)",
   "Search — an icon that opens a SearchField, always first on the right (optional)",
   "Action — the application's one labeled button, AppHeader.Action (optional)",
   "Utilities — other icon buttons, then the Account menu last (required)"
  ],
  "behavior": {
   "pointer": "The header name opens the Product switcher. The search icon opens the field to its left; the Close search button closes it. Header links open their application.",
   "keyboard": "Ctrl K (Cmd K) opens search from anywhere on the page; Escape closes it. Other parts are native links and buttons reached with Tab.",
   "focus": "Opening search moves focus into its field; closing it returns focus to the search button. An empty field closes when focus leaves it.",
   "responsive": "Below 840px (Medium and Narrow) the header links leave the header (the switcher still lists them) and the open search field spans the bar.",
   "motion": "None of its own; header link tooltips fade with the Tooltip transition.",
   "loading": "Not applicable: the header has no loading state; the SearchField in it can show `loading`.",
   "error": "Not applicable: the header holds no input that can be invalid."
  },
  "a11y": {
   "name": "The header is a banner landmark. The header links are a navigation named by `navLabel` (default \"Pinned applications\"); each icon link is named by its `label`.",
   "announce": "The current application's link has aria-current=\"page\". The search button has aria-expanded and aria-keyshortcuts \"Control+K Meta+K\".",
   "focus": "Header items show the 2px focus ring; on the accent tone the ring uses --plx-sys-accent-content so it shows on blue.",
   "contrast": "`tone` (accent, frost, plain) sets the bar's colors and everything inside it; on accent, text and icons use the accent-content role.",
   "motion": "Tooltip fades are cut to zero under reduced motion."
  },
  "content": {
   "labels": "Header link labels are application names. Give a count inside the label when there is one (\"Projects, 3\").",
   "actions": "Give the action a verb (\"Upload\"). Use one action per application; settings belong in the Account menu.",
   "errors": "Not applicable: the header shows no errors.",
   "localization": "The application name truncates with an ellipsis; the action button has a fixed width, so keep its label short. The layout uses logical properties for right-to-left."
  }
 },
 "product-switcher": {
  "purpose": "Lets people move between Plenix applications and choose which ones are pinned to the header.",
  "anatomy": [
   "Trigger — the header name (\"Plenix\" over the application's name with a chevron), or an Applications icon button (required)",
   "Panel — a dialog under the trigger (required while open)",
   "Pinned section — \"Pinned to the header\" tiles on the sunken surface (optional)",
   "All applications — every application as a three-column icon grid (required)",
   "Tile — an icon and name link to the application (required)",
   "Pin button — pins or unpins the application to the header (required)"
  ],
  "behavior": {
   "pointer": "Clicking the trigger opens or closes the panel. Clicking a tile opens the application and closes the panel. The pin button shows on hover or focus and stays shown while pinned.",
   "keyboard": "Escape closes the panel and returns focus to the trigger. Tiles and pin buttons are native links and buttons reached with Tab.",
   "focus": "Opening moves focus to the first link in the panel. Focus is not trapped; a click outside closes the panel without moving focus back.",
   "responsive": "The panel opens from the start edge under the header name. The grid stays at three columns; names wrap anywhere.",
   "motion": "None of its own.",
   "loading": "Not applicable: the list of applications is static.",
   "error": "Not applicable: there is no input."
  },
  "a11y": {
   "name": "The brand trigger is named \"Plenix [application], switch application\"; the icon trigger \"Applications\". The panel is a dialog named \"Applications\".",
   "announce": "The trigger has aria-haspopup=\"dialog\" and aria-expanded. The current application has aria-current=\"page\"; pin buttons are toggles (aria-pressed) named \"Pin [app] to the header\" or \"Unpin [app] from the header\".",
   "focus": "Tiles, pin buttons and the trigger show a 2px ring drawn inside (negative offset) in --plx-sys-focus-ring-color.",
   "contrast": "The panel uses surface-overlay; tile icons use content-link; the current tile uses state-selected. Pinned pins use content-link.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Tiles use the application's name as listed in PLENIX_APPS. Section headings are fixed: \"Pinned to the header\" and \"All applications\".",
   "actions": "Pin labels are generated: \"Pin [app] to the header\" or \"Unpin [app] from the header\".",
   "errors": "Not applicable: there is no error state.",
   "localization": "Names wrap anywhere inside the tile. Headings and pin labels are hard-coded English. The panel uses logical insets for right-to-left."
  }
 },
 "account-menu": {
  "purpose": "Shows who is signed in and gives them My Account, Settings and the display density in one place.",
  "anatomy": [
   "Trigger — the avatar in the header, or an \"avatar | name\" ghost button in the NavPane footer (required)",
   "Identity group — the name and email at the top of the menu (required)",
   "My Account and Settings — menu items shown when the page gives them (optional)",
   "Display density — Compact, Standard and Comfortable as checked menu items with icons (optional)",
   "Extra items — further items after a divider, such as Sign out (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the trigger opens the Menu below the avatar (header) or above the row (pane). Choosing an item runs it and closes the menu; a click outside closes it.",
   "keyboard": "It is a Menu: Enter, Space or Arrow Down opens on the first item, Arrow Up on the last. Arrows, Home and End move; Escape closes and returns focus; Tab closes and moves on.",
   "focus": "Opening moves focus to the first item. Choosing an item or Escape returns focus to the trigger.",
   "responsive": "The header placement anchors to the end (bottom-end); the pane placement opens upward from the start (top-start).",
   "motion": "None of its own.",
   "loading": "Not applicable: the name, email and picture come from the session.",
   "error": "Not applicable: there is no input."
  },
  "a11y": {
   "name": "The trigger is named \"Account and settings for [name]\"; the menu is named \"Account\". It has no tooltip, so it does not cover the open menu.",
   "announce": "Announced as a menu button and a menu. The open place (My Account or Settings) has aria-current=\"page\"; density items are menuitemradio with the current one checked.",
   "focus": "Menu items use the Menu focus style; the header trigger uses the header item focus ring.",
   "contrast": "The menu uses the Menu's overlay surface and content roles in both themes; on the accent header the avatar ring follows the header tone.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Items are fixed: \"My Account\", \"Settings\", \"Display density\" with Compact, Standard and Comfortable. Never call a density \"Default\".",
   "actions": "Name extra items with a verb (\"Sign out\").",
   "errors": "Not applicable: there is no error state.",
   "localization": "The name and email can be long; plan for wrapping in the identity group. The trigger label is built in English (\"Account and settings for\")."
  }
 },
 "side-navigation": {
  "purpose": "Gives every page the same left pane for moving around inside an application, collapsible to a rail; on medium windows it opens over the page, and on a phone it becomes a bottom bar and a screen of its own, never a drawer.",
  "anatomy": [
   "Title row — the title, the pane's small icon actions, then Collapse at the end facing the main region (required)",
   "Second row — `header`, the pane's own shortcuts under the title (optional)",
   "Body — the scrolling content, usually NavList groups (required)",
   "Footer — a row pinned to the bottom: settings or the way back (required on every page)",
   "Splitter — the resize handle on the pane's edge (inline mode)",
   "Rail — a ToolRail with Expand first, a divider, then `rail` items (collapsed and small screens)"
  ],
  "behavior": {
   "pointer": "Collapse turns the pane into a rail; Expand opens it again. Dragging the splitter resizes it between 140 and 320px. At Medium (600–839px) Expand opens the expanded rail over the main region, and a click on the scrim closes it; at Narrow (under 600px) the destinations are a bottom navigation bar and Browse opens the pane as a screen of its own.",
   "keyboard": "Ctrl+[ collapses or expands it (AppShell). The splitter is focusable: Arrow Left and Right resize by the splitter step, Home and End go to the minimum and maximum. Escape closes the overlay.",
   "focus": "Focus is not moved into the overlay or the pane's screen, and not trapped; Escape closes it. The rail is a vertical toolbar with arrow key movement.",
   "responsive": "Wide: inline beside the main area at --plx-sys-shell-nav-width: 240px under 1440px, 272px at 1440–1919px, 320px at 1920px and wider; collapsed, a rail. Medium (600–839px): a rail whose expanded rail opens over the main region. Narrow (under 600px): a bottom navigation bar of the page's destinations (or a parent row) and the pane as a screen of its own, never a drawer (Platforms Standard 4.1).",
   "motion": "None of its own; the AppShell's scrim fades its background with --plx-sys-motion-duration-fast.",
   "loading": "No loading state of its own; the body shows the page's own loading content.",
   "error": "Not applicable: the pane holds no input."
  },
  "a11y": {
   "name": "`label` names the navigation landmark, the rail and the splitter (\"Resize …\"). Use `as=\"div\"` when a NavList brings its own landmark.",
   "announce": "Announced as a navigation landmark. The splitter is a vertical separator with aria-valuenow, aria-valuemin and aria-valuemax.",
   "focus": "The Collapse button and rail items show the 2px focus ring in --plx-sys-focus-ring-color.",
   "contrast": "The pane uses --plx-comp-nav-pane-background with a border-default edge line and a border-divider footer line, in both themes.",
   "motion": "The scrim fade is cut to zero under reduced motion."
  },
  "content": {
   "labels": "Use the application's or the page's name as the title (\"Asset Manager\"). Keep the title short; it truncates with an ellipsis.",
   "actions": "Use small icon buttons with clear names (\"Filter\", \"New\"). Put shortcuts in the second row, never in the title row.",
   "errors": "Not applicable: the pane shows no errors.",
   "localization": "The layout uses logical properties; `collapseAt=\"start\"` is only for a pane on the right. The Collapse and Expand labels (\"Collapse sidebar\", \"Expand sidebar\") are hard-coded English."
  }
 },
 "breadcrumbs": {
  "purpose": "Shows where the page sits in a hierarchy and lets people go back up a level in one click.",
  "anatomy": [
   "Navigation — a nav landmark around an ordered list (required)",
   "Link — each level above the current page, a link in the link color (required)",
   "Plain level — a level without `href`, in muted text (optional)",
   "Separator — a › drawn by CSS between items (required)",
   "Current page — the last item, plain text in the default color (required)"
  ],
  "behavior": {
   "pointer": "Clicking a link goes to that level and runs its `onClick`. Hovering a link underlines it.",
   "keyboard": "Links are native and reached with Tab; it adds no key handling. The current page is not a stop.",
   "focus": "Focus is not moved or trapped.",
   "responsive": "The row wraps onto more lines when it is too long. It does not collapse middle levels.",
   "motion": "None of its own.",
   "loading": "Not applicable: the trail is static text.",
   "error": "Not applicable: there is no input."
  },
  "a11y": {
   "name": "The nav is named by `label` (default \"Breadcrumb\").",
   "announce": "Announced as a navigation landmark with a list; the last item has aria-current=\"page\".",
   "focus": "Links show the 2px focus ring in --plx-sys-focus-ring-color.",
   "contrast": "Links use content-link, the current page content-default, plain levels content-muted, and separators content-subtle, in both themes.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Use each page's own title, in sentence case, as it appears in its header. Do not add \"Home\" unless it is a real page.",
   "actions": "Not applicable: each level is a place, not an action.",
   "errors": "Not applicable: there is no error state.",
   "localization": "Spacing is logical, but the › separator is a fixed character and does not flip in right-to-left layouts. Translated titles lengthen the row; it wraps."
  }
 },
 "navigation-menu": {
  "purpose": "Lists the places in a side navigation, such as folders or settings sections, with counts, collapsible groups and pins.",
  "anatomy": [
   "Navigation — a nav landmark named by `label` (required)",
   "Group heading — a CollapsibleSection header with a chevron, or a plain label (optional)",
   "Row — a link (`href`) or a button with an icon, the name and a count \"(326)\" (required)",
   "Subgroup row — a button with a chevron that folds nested rows (optional)",
   "Pin button — shown on hover or focus, kept while pinned (optional)",
   "Row actions — other controls beside the row, such as Remove (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a row runs `onSelect(id)`; a row with `href` also follows the link. Clicking a group heading or subgroup row folds or opens its rows. Hovering a pinnable row shows its pin button.",
   "keyboard": "Rows, subgroup rows and pin buttons are native links and buttons reached with Tab, activated with Enter (and Space for buttons). It adds no arrow key handling.",
   "focus": "Focus is not moved or trapped. A subgroup holding the current item opens when that item becomes current.",
   "responsive": "Names truncate with an ellipsis to fit the pane's width; the count follows the name. Group headings: Every foldable section heading (CollapsibleSection, NavList groups included) wraps to two balanced lines, then the second line ends in an ellipsis, and the full text shows in a Tooltip on hover and on keyboard focus while it is cut. One line is 32px tall, two lines 40px. A plain heading that takes no focus (a static NavList heading) shows the full text on hover only. Screen readers always get the full text.",
   "motion": "Group heading chevrons rotate with --plx-sys-motion-duration-base and --plx-sys-motion-ease-standard (CollapsibleSection).",
   "loading": "No loading state of its own; the page shows Loading in the pane.",
   "error": "Not applicable: there is no input."
  },
  "a11y": {
   "name": "The nav is named by `label`; each group list by its heading. Pin buttons are named \"Pin [name]\" or \"Unpin [name]\".",
   "announce": "The current row has aria-current=\"page\". Subgroup rows have aria-expanded; pin buttons are toggles (aria-pressed).",
   "focus": "Rows and pin buttons show a 2px ring drawn inside the row (negative offset) in --plx-sys-focus-ring-color.",
   "contrast": "The current row uses selected-content on state-selected; muted rows use content-subtle; pinned pins use content-link.",
   "motion": "The chevron rotation is cut to zero under reduced motion."
  },
  "content": {
   "labels": "Name each place with a short noun in sentence case (\"Branding\"). Group headings name the kind of place.",
   "actions": "Not applicable for rows: they are places. Put actions such as Remove in `actions`, never inside the row.",
   "errors": "Not applicable: there is no error state.",
   "localization": "Numeric counts are formatted with toLocaleString('en-US'), so they use US grouping in every language. Names truncate, so check long translations."
  }
 },
 "navigation-rail": {
  "purpose": "Shows a pane's items as a narrow column of icon buttons when it is collapsed, or holds an editor's tools beside a canvas.",
  "anatomy": [
   "Rail — a vertical toolbar on the raised surface with an edge line (required)",
   "Item — an icon-only button with a tooltip at its end side (required)",
   "Pressed item — a toggle in the selected state, from `pressed` (optional)",
   "Label — the name under the icon with `showLabels` (optional)",
   "Divider — a separator line between sets of items (optional)"
  ],
  "behavior": {
   "pointer": "Clicking an item runs its `onClick`. Hovering an item shows its tooltip and the hover state.",
   "keyboard": "Arrow Up and Arrow Down move between enabled items, wrapping; Home and End go to the first and last. Disabled items are skipped.",
   "focus": "Every enabled item stays in the Tab order; arrow keys only move focus. Focus is not trapped.",
   "responsive": "A fixed-width column; it does not scroll or collapse further. Keep it to about eight items.",
   "motion": "None of its own; tooltips fade with the Tooltip transition.",
   "loading": "Not applicable: items are static buttons.",
   "error": "Not applicable: there is no input."
  },
  "a11y": {
   "name": "The rail is named by `label`. Each item is named by its `label` (aria-label, or visible text with `showLabels`).",
   "announce": "Announced as a vertical toolbar. Items with `pressed` are toggle buttons with aria-pressed; dividers are separators.",
   "focus": "Items show the 2px focus ring in --plx-sys-focus-ring-color at --plx-sys-focus-ring-offset.",
   "contrast": "Pressed items use selected-content on state-selected; disabled items use content-disabled. The editor page sets dark mode on its container.",
   "motion": "Tooltip fades are cut to zero under reduced motion."
  },
  "content": {
   "labels": "Use one or two words in sentence case; use the tool's or place's name (\"Crop\", \"Files\").",
   "actions": "Name tools by what they do or are (\"Crop\"); the pane's Expand item is \"Expand sidebar\".",
   "errors": "Not applicable: there is no error state.",
   "localization": "Labels under icons with `showLabels` sit in a fixed 52px width, so keep them short. Tooltips sit at the end side and follow right-to-left."
  }
 },
 "tree-view": {
  "purpose": "Lets people browse and choose from nested folders or categories, opening and closing levels as they go.",
  "anatomy": [
   "Tree — the list with role tree (required)",
   "Item — a treeitem row with its level indent (required)",
   "Chevron — opens or closes an item with children; empty for leaves (required)",
   "Icon — an icon before the label (optional)",
   "Label — the item's name, truncated with an ellipsis (required)",
   "Meta — extra content at the row's end, such as a count (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a row selects it. Clicking the chevron opens or closes the item without selecting it.",
   "keyboard": "Arrow Up and Down move through visible items. Arrow Right opens an item, then goes to its first child; Arrow Left closes it, then goes to the parent. Home and End go to the first and last visible item; Enter or Space selects.",
   "focus": "The tree is one Tab stop (roving tabindex): the focused, selected or first item. Arrow keys move focus without selecting.",
   "responsive": "Each level indents by 16px; labels truncate with an ellipsis and meta keeps its width.",
   "motion": "The chevron rotates with --plx-sys-motion-duration-fast.",
   "loading": "No loading state of its own; children must be in `nodes` before they open.",
   "error": "Not applicable: there is no input."
  },
  "a11y": {
   "name": "The tree is named by `label`; each item by its text.",
   "announce": "Announced as a tree; items as treeitems with aria-level, aria-expanded (for parents) and aria-selected.",
   "focus": "The focused row shows a 2px ring drawn inside (negative offset) in --plx-sys-focus-ring-color.",
   "contrast": "The selected row uses selected-content on state-selected; the chevron and meta use content-muted.",
   "motion": "The chevron rotation is cut to zero under reduced motion."
  },
  "content": {
   "labels": "Use the folder or category name as people know it. Keep names short; they truncate.",
   "actions": "Not applicable: rows are choices, not actions.",
   "errors": "Not applicable: there is no error state.",
   "localization": "The indent uses logical padding, so it follows right-to-left. Arrow Right and Left do not reverse in right-to-left layouts. Meta uses the data font (Reddit Mono) for numbers."
  }
 },
 "tabs": {
  "purpose": "Lets people switch between peer views of one object in place, such as an asset's Info and History.",
  "anatomy": [
   "Tab list — the row of tabs with role tablist (required)",
   "Tab — a button with an optional icon, the label and an optional Count (required)",
   "Selected tab — the open folder tab joined to the panel, with no line beneath it (required)",
   "Panel — the bordered tabpanel under the tabs (required; the page can render it with `idBase`)"
  ],
  "behavior": {
   "pointer": "Clicking a tab selects it and shows its panel. Disabled tabs cannot be chosen.",
   "keyboard": "Arrow Right and Down select the next enabled tab, Arrow Left and Up the previous, wrapping. Home and End select the first and last. Selection follows focus.",
   "focus": "Only the selected tab is in the Tab order; the panel is the next Tab stop (tabIndex 0).",
   "responsive": "The tab list scrolls sideways when it does not fit, with its scrollbar hidden. It does not wrap or collapse into a menu.",
   "motion": "None of its own; panels switch instantly.",
   "loading": "No loading state of its own; show Loading inside the panel.",
   "error": "Not applicable: tabs are not inputs. Mark a tab whose panel has errors with its count, not a new color."
  },
  "a11y": {
   "name": "The tab list is named by `label`. Each panel is labeled by its tab (aria-labelledby).",
   "announce": "Announced as a tab list; tabs with aria-selected and aria-controls; panels as tabpanels. Only the selected panel's content is rendered.",
   "focus": "Tabs show a 2px ring drawn inside; the panel shows the 2px ring at --plx-sys-focus-ring-offset.",
   "contrast": "Tab text and the selected tab use the content and surface roles of the contained variant, defined for both themes.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Use one or two nouns in sentence case (\"Info\", \"Versions\"). Do not use verbs; tabs are views, not steps.",
   "actions": "Not applicable: tabs switch views; put actions inside the panel.",
   "errors": "Not applicable: write errors inside the panel.",
   "localization": "Long translations make the list scroll sideways; keep labels short. Arrow Right always moves to the next tab in source order, also in right-to-left layouts."
  }
 },
 "pagination": {
  "purpose": "Lets people move through pages of results and choose how many items each page shows.",
  "anatomy": [
   "Summary — \"1–30 of 120\", shown with `total` (optional)",
   "Previous and Next — ‹ and › step buttons (required)",
   "Page buttons — the first, last, current and neighboring pages (required)",
   "Gap — \"…\" between non-adjacent pages, decorative (optional)",
   "Per page — a labeled native select, shown with `perPageOptions` and `onPerPageChange` (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a page button, Previous or Next runs `onPageChange`. Previous is disabled on the first page and Next on the last.",
   "keyboard": "Buttons and the select are native and reached with Tab. It adds no key handling.",
   "focus": "Focus is not moved after a page change. If the page re-renders its results, keep focus where it was or move it to the results.",
   "responsive": "The summary, the page buttons and the per-page choice wrap onto more lines, and the page buttons wrap within their row.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; the results area shows Loading.",
   "error": "Not applicable: page numbers are always in range."
  },
  "a11y": {
   "name": "The nav is named by `label` (default \"Pages\"). Buttons are named \"Previous page\", \"Next page\" and \"Page 3\".",
   "announce": "Announced as a navigation landmark; the current page has aria-current=\"page\". Disabled steps are announced as dimmed.",
   "focus": "Buttons use the native focus style; the stylesheet sets hover and current states.",
   "contrast": "The current page uses action-primary on its background; other buttons use control-background with a control-border line; disabled buttons drop to 50% opacity.",
   "motion": "No motion to reduce."
  },
  "content": {
   "labels": "Keep \"Per page\" and the summary format \"1–30 of 120\".",
   "actions": "Not applicable: the step buttons are symbols with fixed accessible names.",
   "errors": "Not applicable: there is no error state.",
   "localization": "\"of\", \"Per page\" and the button names are hard-coded English, and numbers are not locale-formatted. The ‹ and › symbols do not flip in right-to-left layouts."
  }
 },
 "filter-bar": {
  "purpose": "Lets people narrow a list or grid by a few attributes without leaving it.",
  "anatomy": [
   "Row — a group named by `label` (required)",
   "Filter button — a small Button with a caret that shows the filter name, or its value when set (required)",
   "Filter menu — the choices as checkbox menu items, each with an optional count (required)",
   "More filters — a menu holding the filters that do not fit, grouped by filter (optional, appears on overflow)",
   "Clear all — a ghost button shown when any filter is set and `onClearAll` is given (optional)",
   "Actions — controls at the end of the row, such as a sort menu or a view switch (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a filter button opens its menu; choosing an option toggles it. A multiple filter keeps its menu open while choosing; a single filter closes it, and choosing the set option again clears it.",
   "keyboard": "Each filter button is a Menu trigger: Enter, Space or Arrow Down opens it on the first item, Arrow Up on the last. Arrow keys, Home and End move between items; Escape closes and returns focus to the button; Tab closes and moves on.",
   "focus": "Focus moves into the menu when it opens and returns to the filter button when it closes (except Tab, which moves on). Nothing is trapped.",
   "responsive": "The row stays one line. Filters that do not fit are measured and moved into More filters; the actions keep their width at the end.",
   "motion": "None of its own; the Button caret turns with its own token (--plx-comp-button-caret-duration).",
   "loading": "Not applicable: the filters and their counts come from the page; it shows no loading state.",
   "error": "Not applicable: choosing a filter cannot fail on its own; show a failed result in the results area."
  },
  "a11y": {
   "name": "The row is a group named by `label` (default \"Filters\"). Each menu is named by its filter label; More filters by \"More filters\".",
   "announce": "Filter buttons are menu buttons; options are checkbox menu items that announce checked or not checked. A set filter's value is part of its button text (\"Type: PNG\", \"Type · 2\").",
   "focus": "Tab order is the filter buttons, More filters, Clear all, then the actions. Buttons show the focus ring (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset).",
   "contrast": "Set filters use the Button selected state; option counts use --plx-sys-content-muted, which themes resolve for light and dark.",
   "motion": "The caret turn is cut to zero duration under prefers-reduced-motion (system/motion.css)."
  },
  "content": {
   "labels": "Name each filter with a short noun in sentence case (\"Type\", \"Owner\", \"Date added\"). Write options as the values people see in the data.",
   "actions": "Keep \"Clear all\" and \"More filters\" as written. Do not add a separate Apply button; filters apply on choice.",
   "errors": "Not applicable: the filter bar shows no error text.",
   "localization": "Labels grow in other languages, so more filters move into More filters; do not shorten labels to fit. The CSS uses logical properties, so the row mirrors in right-to-left. Format option counts for the locale."
  }
 },
 "search-workspace": {
  "purpose": "Gives the main work area an advanced search: the query, filters, active filters as chips, a result count and the results. The application header and panes stay, so search feels like browsing with stronger filtering.",
  "anatomy": [
   "Title row — the h2 title, the live result count, Save search and extra controls (required)",
   "Search field — a SearchField inside a search landmark (required)",
   "Filter bar — the FilterBar for `filters` (optional)",
   "Active filters — a group of removable selected Chips plus a Clear all ghost button (optional, shown when filters are set)",
   "Result bar — the result count, a Grid / Table SegmentedControl and a Sort menu (required; switches optional)",
   "Results — the children, or an inline EmptyState when the count is 0 (required)"
  ],
  "behavior": {
   "pointer": "Typing in the field updates the query as you type. Clicking × on a chip removes that one filter value; Clear all runs `onClearAll`.",
   "keyboard": "The search field, FilterBar menus, chips, SegmentedControl and Sort menu each keep their own keys. Enter in the field keeps focus there.",
   "focus": "Focus is not moved on its own; it stays in the field while typing and in the control that was used.",
   "responsive": "The title row wraps. The search field is at most 720px wide (--plx-ref-size-720px) and fills narrower space; chips wrap; the filter bar moves extra filters into More filters.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; the capability shows loading in the results.",
   "error": "No error state of its own. With no results it shows an inline EmptyState: \"Nothing matches “query” with these filters.\""
  },
  "a11y": {
   "name": "The section is named by its title (aria-labelledby). The field is named \"Search \" plus the plural noun; the active filters group is \"Active filters\".",
   "announce": "The count in the title row is a polite live region, so new result counts are announced. Chips announce pressed; each × is named \"Remove \" plus the chip text.",
   "focus": "Tab order follows the layout: title row controls, search field, filters, chips, result bar, results. Every control uses the system focus ring.",
   "contrast": "The title uses --plx-sys-content-default; counts use --plx-sys-content-muted; the result bar line is --plx-sys-border-divider.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Use \"Search\" before a query and \"Search results\" after, or the saved search's name. Give `noun` as the singular word for one result (\"asset\"), and `plural` when adding \"s\" is wrong.",
   "actions": "Keep \"Save search\" and \"Clear all\". Chip text is \"Filter: Value\".",
   "errors": "Keep the empty text factual and name the query; do not blame the person.",
   "localization": "Counts are formatted with en-US grouping and the plural is noun + \"s\"; other languages need a translated noun and plural. Layout uses logical properties and mirrors in right-to-left."
  }
 },
 "badge": {
  "purpose": "Lets people scan a workflow status at a glance (Approved, Failed). Every pill in filter values, tables, tags and statuses is soft, from its assigned color family: a shade-100 background, a 1px shade-300 border, dark text from the same family (700, or 800 for red) and 4px corners (owner, 2026-10-14).",
  "anatomy": [
   "Label — a span with bold text, a 1px border and 4px corners (--plx-sys-radius-pill-4px) (required)",
   "Icon — `icon`, the status icon before the text, in the text color; decorative (required for a status)",
   "Variant (tone) — neutral (default; gray), success (green), active (blue), waiting (yellow), action-required (orange) or negative (red); the old names info, warning and danger draw active, waiting and negative (required, default neutral)",
   "Style — soft only: every pill is soft; variant=\"solid\" or \"soft\" is accepted and ignored (not applicable)",
   "Size — md (20px) or sm (16px, for counts) (optional)"
  ],
  "behavior": {
   "pointer": "None: it is text and does not respond to clicks.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not focusable.",
   "responsive": "It does not wrap (white-space: nowrap); keep the text short.",
   "motion": "None of its own.",
   "loading": "Not applicable: it shows a value the page already has.",
   "error": "Not applicable: use the negative variant to show a failed status."
  },
  "a11y": {
   "name": "Its visible text. Other props, including aria-*, pass through to the span.",
   "announce": "Read as plain text; the tone color is not announced, so the text must carry the meaning.",
   "focus": "Not in the focus order.",
   "contrast": "Each variant pairs --plx-sys-status-pill-{variant}-text with --plx-sys-status-pill-{variant}-background (CONTRAST_PAIRS). Light: neutral 6.41, success 6.92, active 6.20, waiting 6.37, action required 6.26, negative 7.54 : 1. Dark (the soft-on-dark pattern: a gray-700 fill, a gray-800 border and the family's light shade as text): neutral 4.61, success 6.22, active 5.20, waiting 5.39, action required 4.95, negative 6.01 : 1. The border is decorative.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "One or two words in sentence case: an adjective or past participle (\"Approved\", \"Changes requested\"). Pick the variant by meaning: Approved is success; Draft and Archived are neutral. A descriptive label (Client, Internal, Print) is a Tag in a category color, not a badge. Do not rely on color alone.",
   "actions": "Not applicable: a badge is not an action; use Chip for something clickable.",
   "errors": "Not applicable: say what failed (\"Failed\") and explain it nearby.",
   "localization": "Translated words can be longer and do not wrap; leave room. Padding uses logical properties."
  }
 },
 "tag": {
  "purpose": "Labels a record with keywords or categories, and lets people remove or rename a tag in place when editing is allowed.",
  "anatomy": [
   "Tag — a pill with the tag text: gray (fill-neutral), or with `category` the category's soft pill (background shade 100, a 1px shade-300 border, shade-700 text, 4px corners; owner, 2026-10-14) (required)",
   "Remove button — a × button, a 24px target in a 16px box, shown with `onRemove` (optional)",
   "Rename button and field — the text becomes a button that turns into an inline field, with `onRename` (optional)",
   "TagList — the wrapping row that holds tags, a group when it has `label` (optional)",
   "TagInput — the \"add a tag\" field at the end of a TagList (optional)"
  ],
  "behavior": {
   "pointer": "Clicking × runs `onRemove`. With `onRename`, clicking the text turns it into a field; clicking away keeps the new text.",
   "keyboard": "× and the rename button are native buttons (Enter, Space). In the rename field Enter keeps the new text and Escape cancels. TagInput keys are handled by the page.",
   "focus": "The rename field takes focus when it opens. After renaming or removing, focus is not moved by the tag; the page decides.",
   "responsive": "Tags do not wrap inside; TagList wraps tags onto new rows.",
   "motion": "None of its own.",
   "loading": "Not applicable: tags show values the page already has.",
   "error": "Not applicable: an empty or unchanged rename is ignored; the page validates other input."
  },
  "a11y": {
   "name": "The tag's text. × is named by `removeLabel` (default \"Remove \" plus the text); rename by `renameLabel` (default \"Rename \" plus the text). TagList is named by `label`.",
   "announce": "TagList with a label is a group; the tags inside are text and buttons. Nothing else is announced.",
   "focus": "Tab reaches each rename and remove button in order. The rename button shows the focus ring; TagInput and the rename field show the field’s focused border, like every field.",
   "contrast": "Tags use --plx-sys-fill-neutral with --plx-sys-fill-neutral-content; × uses --plx-sys-content-subtle and turns --plx-sys-feedback-danger-content on hover.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Keep tags to one or two words, as the data spells them; do not add punctuation.",
   "actions": "Keep the default \"Remove …\" and \"Rename …\" names, or give the same pattern with a clearer noun.",
   "errors": "Not applicable: show any rule (such as a duplicate tag) as field help next to TagInput.",
   "localization": "Tags do not wrap internally; longer translations make rows wrap sooner. The CSS uses logical properties, so the × sits at the inline end in right-to-left."
  }
 },
 "chip": {
  "purpose": "A tag-shaped toggle: people turn an option or filter on and off, or remove an active filter, in one place.",
  "anatomy": [
   "Chip — a gray rounded toggle button with its text (required)",
   "Selected state — filled with the primary action color (optional)",
   "Remove button — a × button, a 24px target, shown with `onRemove` (optional)",
   "TagList — the wrapping row that holds chips (optional)"
  ],
  "behavior": {
   "pointer": "Clicking the chip runs `onClick`; the page flips `selected`. Hover fills it with --plx-sys-fill-neutral-hover. Clicking × runs `onRemove`.",
   "keyboard": "The chip and its × are native buttons: Tab reaches them, Enter and Space activate them.",
   "focus": "Focus stays on the chip after toggling. When × removes the chip, the page must move focus to a sensible place.",
   "responsive": "Chips do not wrap inside; TagList and the active-filter row wrap them.",
   "motion": "None of its own.",
   "loading": "Not applicable: a chip has no loading state.",
   "error": "Not applicable: a chip has no error state."
  },
  "a11y": {
   "name": "Its visible text. × is named by `removeLabel` (default \"Remove \" plus the text).",
   "announce": "A toggle button that announces pressed or not pressed (aria-pressed from `selected`).",
   "focus": "Each chip and its × are separate Tab stops and use the system focus ring.",
   "contrast": "Unselected uses --plx-sys-fill-neutral and --plx-sys-fill-neutral-content; selected uses --plx-sys-action-primary-background and --plx-sys-action-primary-content.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Short sentence-case nouns (\"Favorites\"); for an active filter, \"Filter: Value\" (\"Type: PNG\").",
   "actions": "Name × as \"Remove \" plus the chip text.",
   "errors": "Not applicable: a chip shows no error text.",
   "localization": "Translated text can be longer and does not wrap; let the row wrap. Logical properties keep × at the inline end in right-to-left."
  }
 },
 "counter": {
  "purpose": "Shows a number on its own, such as the items in a folder or unread notifications, capped so large counts stay small.",
  "anatomy": [
   "Number — the value with tabular figures (required)",
   "Variant — plain muted text, or a 16px soft count pill (light fill, a border two shades darker, dark text) with 4px corners (optional, default plain)",
   "Tone — the pill color: neutral, info, success, warning (yellow) or danger (optional, default danger)",
   "Cap — above `max` the count shows max + \"+\" (optional)"
  ],
  "behavior": {
   "pointer": "None: it is text.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not focusable.",
   "responsive": "It does not wrap; `max` keeps the pill small.",
   "motion": "None of its own.",
   "loading": "Not applicable: with no value nothing renders.",
   "error": "Not applicable: it has no error state."
  },
  "a11y": {
   "name": "The number, or `label` as aria-label when the number alone is unclear (\"3 unread notifications\").",
   "announce": "Read as text; the tone is not announced. A changing count is not a live region.",
   "focus": "Not in the focus order.",
   "contrast": "Plain uses its muted text role; the pill is a soft status pill (shade-100 fill, shade-300 border, the status pill text role), at least 4.5:1 in both themes.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "When the count sits on an icon, give `label` as a full phrase with the noun (\"12 unread messages\").",
   "actions": "Not applicable: a count is not an action.",
   "errors": "Not applicable: use Badge for a status.",
   "localization": "The value is shown as given; format it for the locale before passing it. The \"+\" after `max` is fixed."
  }
 },
 "metric": {
  "purpose": "Leads a page or dashboard with its key figures: a large number over what it counts, with an optional change since the last period.",
  "anatomy": [
   "Value — the formatted figure in the heading font with tabular numbers (required)",
   "Unit — a smaller unit after the figure (optional)",
   "Change — the change since the last period, colored good, bad or neutral (optional)",
   "Label — what the figure counts (required)",
   "Description — one short line under the label (optional)",
   "Metric.Group — a list that lays several metrics out in a row, divided (optional)"
  ],
  "behavior": {
   "pointer": "None: it is display only.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not focusable.",
   "responsive": "A group wraps onto new rows; the figure, unit and change wrap within a metric.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; the page shows loading (a skeleton) until values arrive.",
   "error": "Not applicable: show a missing figure as a dash and explain it nearby."
  },
  "a11y": {
   "name": "Read as its text: value, unit, change, label. Metric.Group is a list named by `label`.",
   "announce": "Metric.Group announces a list with its item count; each metric is a list item. The change tone is color only, so include the sign in the text.",
   "focus": "Not in the focus order.",
   "contrast": "Value uses --plx-sys-content-default; label and unit --plx-sys-content-muted; change uses --plx-sys-feedback-success-content or --plx-sys-feedback-danger-content.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Label with a short noun phrase in sentence case (\"Assets added\"). Pass the value already formatted.",
   "actions": "Not applicable: a metric has no actions.",
   "errors": "Not applicable: a metric has no error text.",
   "localization": "Format numbers, percents and signs for the locale before passing them. The group's dividers use logical properties and mirror in right-to-left."
  }
 },
 "interactive-list": {
  "purpose": "Makes a whole list row, tile or cell one button, for content a Button's single label cannot hold, such as a row that opens a record.",
  "anatomy": [
   "Button — a native button reset to a full-width block (required)",
   "Content — any layout: an avatar, two lines of text, a time (required)",
   "State fill — hover (--plx-sys-state-hover) and selected (--plx-sys-state-selected) (optional)"
  ],
  "behavior": {
   "pointer": "Clicking runs `onClick`. Hover fills the row unless `hover` is false.",
   "keyboard": "A native button: Tab reaches it, Enter and Space activate it.",
   "focus": "Focus stays on the row after activation; opening a record elsewhere does not move it.",
   "responsive": "It fills its column; the content's layout decides how it adapts.",
   "motion": "The background fades with --plx-sys-motion-duration-fast and --plx-sys-motion-ease-standard.",
   "loading": "Not applicable: it shows content the page already has.",
   "error": "Not applicable: it has no error state; a disabled row uses --plx-sys-content-disabled."
  },
  "a11y": {
   "name": "Its text content, or aria-label passed through.",
   "announce": "A button. `selected` adds aria-current=\"true\"; `current` sets another value (\"date\"); `pressed` makes it a toggle; `expanded` announces expanded or collapsed.",
   "focus": "One Tab stop per row, with an inset 2px focus ring (--plx-sys-focus-ring-color).",
   "contrast": "Only state fills are drawn; text keeps its parent color, so put readable roles on the content.",
   "motion": "The fade is cut to zero duration under prefers-reduced-motion."
  },
  "content": {
   "labels": "Lead with the record's name; keep secondary text short.",
   "actions": "Do not put other buttons inside it; a row with several actions should be a plain item with its actions beside it.",
   "errors": "Not applicable: it has no error text.",
   "localization": "Content aligns to the start (text-align: start), so it mirrors in right-to-left."
  }
 },
 "activity-stream": {
  "purpose": "Lists things that happened or arrived, such as messages, versions or notifications, with who or what, when, and what is unread.",
  "anatomy": [
   "List — a ul named by `label` (required)",
   "Unread dot — an 8px dot with hidden \"Unread\" text (optional)",
   "Leading — an avatar or icon (optional)",
   "Title and meta — the title, which opens the item, and a muted line beside it (required; meta optional)",
   "Time — a time element in the data font (optional)",
   "Actions — controls at the row's end (optional)"
  ],
  "behavior": {
   "pointer": "With `onOpen` or `href`, the title's target covers the row: clicking anywhere opens the item, and hover fills the row. Actions stay clickable above it.",
   "keyboard": "The title is a native button (`onOpen`) or link (`href`): Tab reaches it, Enter opens it (Space too for a button). Actions are their own Tab stops.",
   "focus": "One Tab stop per row plus its actions; the row draws the focus ring when its title has focus.",
   "responsive": "Title and meta truncate with an ellipsis; the title takes at most 60% of the text width. Time and actions keep their width.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; the page shows loading in place of the list.",
   "error": "Not applicable: it has no error state; show an empty or failed list with EmptyState."
  },
  "a11y": {
   "name": "The list is named by `label`; each row by its title text.",
   "announce": "A list with its item count. Unread rows include hidden \"Unread\" text; the selected row has aria-current=\"true\".",
   "focus": "Rows show an inset 2px ring (--plx-sys-focus-ring-color) around the whole row.",
   "contrast": "Title uses --plx-sys-content-default; meta and time --plx-sys-content-muted; the unread dot --plx-sys-action-primary-background.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Title with the person or item name; meta with the subject or what changed. Show time short (\"10:24 AM\") and give `dateTime` in ISO form.",
   "actions": "Use icon buttons with clear names (\"Archive\", \"Mark as read\").",
   "errors": "Not applicable: it has no error text.",
   "localization": "Format the time for the locale. Padding and the row layout use logical properties and mirror in right-to-left."
  }
 },
 "card": {
  "purpose": "Shows one object in a collection, such as a project or a note, with its meta and actions, and can open it.",
  "anatomy": [
   "Card — an article on the raised surface with a 12px radius (required)",
   "Title — a heading (h3 by default) that is the card's link or button with `href` or `onOpen` (required)",
   "Actions — controls at the end of the header (optional)",
   "Meta — a muted line of details (optional)",
   "Body — any content (optional)",
   "Accent — a 3px start edge in a data color (optional)"
  ],
  "behavior": {
   "pointer": "With `href` or `onOpen`, the title's target covers the card: clicking anywhere opens it and hover raises the shadow (--plx-sys-shadow-md). Actions stay clickable above it.",
   "keyboard": "The title is a native link or button: Tab reaches it, Enter opens it. Actions are separate Tab stops.",
   "focus": "One Tab stop per card plus its actions; the whole card shows the focus ring when the title has focus.",
   "responsive": "The title truncates with an ellipsis; the card fills its grid column.",
   "motion": "Border and shadow change with --plx-sys-motion-duration-fast and --plx-sys-motion-ease-standard.",
   "loading": "No loading state of its own; the page shows skeletons until cards arrive.",
   "error": "Not applicable: it has no error state."
  },
  "a11y": {
   "name": "The title, as a heading with a link or button inside.",
   "announce": "An article with a heading, so cards can be reached by heading. The selected state is visual only; no ARIA state is set.",
   "focus": "The ring (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset) is drawn around the card.",
   "contrast": "Surface --plx-sys-surface-raised with --plx-sys-border-default; selected uses --plx-sys-selected-border and a subtle ring.",
   "motion": "The transition is cut to zero duration under prefers-reduced-motion."
  },
  "content": {
   "labels": "Use the object's own name as the title; keep meta to counts and facts (\"12 assets\").",
   "actions": "Use verbs for actions (\"Share\", \"Delete\"); put several in a menu.",
   "errors": "Not applicable: it has no error text.",
   "localization": "Titles truncate, so give the full name elsewhere (a tooltip or the details). The accent edge is on the inline start and mirrors in right-to-left."
  }
 },
 "radio-tiles": {
  "purpose": "Lets people choose one of a few options when seeing each option helps, such as a layout or a style.",
  "anatomy": [
   "Fieldset and legend — the group and what is being chosen (required; legend can be visually hidden)",
   "Tile — a label wrapping a visually hidden native radio (required)",
   "Preview — a decorative picture of the option (optional)",
   "Label and description — the option's name and one short line (label required)",
   "Check — a check icon on the chosen tile (shown when chosen)"
  ],
  "behavior": {
   "pointer": "Clicking a tile chooses it and runs `onChange`. Hover darkens the border; disabled tiles do not respond.",
   "keyboard": "A native radio group: Tab moves into it, the arrow keys move the choice, Space chooses.",
   "focus": "Focus is on the chosen radio within the group; the tile shows the focus ring.",
   "responsive": "Tiles sit in an auto-fill grid with a minimum width by `size` (120, 160 or 240px) and wrap onto new rows.",
   "motion": "None of its own.",
   "loading": "Not applicable: options are given by the page.",
   "error": "No error state of its own; show any requirement as text near the legend."
  },
  "a11y": {
   "name": "The group is named by `legend`; each radio by its label and description.",
   "announce": "A radio group; each option announces checked or not checked and its position. The preview and check are aria-hidden.",
   "focus": "The focus ring (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset) is drawn around the tile.",
   "contrast": "Tiles use --plx-sys-surface-default and --plx-sys-border-default; the chosen tile uses --plx-sys-state-selected with an --plx-sys-action-primary-background border.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Legend as a noun phrase (\"Header style\"); option labels one or two words; descriptions one short line.",
   "actions": "Not applicable: choosing is the action.",
   "errors": "Not applicable: it shows no error text.",
   "localization": "Tiles grow in height for longer text. The grid and padding use logical properties and mirror in right-to-left."
  }
 },
 "thumbnail": {
  "purpose": "Shows a small picture of a file or asset next to its name, so people recognize it in a table or list.",
  "anatomy": [
   "Picture — a 28px rounded image, loaded lazily (optional)",
   "Icon — a decorative icon on the sunken surface when there is no picture (default \"document\")"
  ],
  "behavior": {
   "pointer": "None: it is display only.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not focusable.",
   "responsive": "A fixed 28px square that does not shrink; the picture is cropped to fill (object-fit: cover).",
   "motion": "None of its own.",
   "loading": "The image loads lazily; until then the sunken surface shows.",
   "error": "No error state: a picture that fails to load shows the icon instead, as when there is none."
  },
  "a11y": {
   "name": "`alt`, empty by default because the name sits beside it.",
   "announce": "Nothing by default: the image has empty alt and the icon is aria-hidden.",
   "focus": "Not in the focus order.",
   "contrast": "The icon uses --plx-sys-content-muted on --plx-sys-surface-sunken.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Leave `alt` empty when the name is next to it; give it only when the picture carries meaning the name does not.",
   "actions": "Not applicable: it is not an action.",
   "errors": "Not applicable: it shows no error text.",
   "localization": "Nothing changes."
  }
 },
 "preview": {
  "purpose": "Shows the large picture of the item an inspector is about, or a placeholder with its icon and count, and can open the item.",
  "anatomy": [
   "Surface — the sunken, rounded area, at least 140px tall, content centered (required)",
   "Picture or placeholder — the children (required)",
   "Top-start mark — a small mark such as the type (optional)",
   "Bottom-end mark — a small mark such as an expand icon (optional)"
  ],
  "behavior": {
   "pointer": "With `as=\"button\"` clicking runs `onClick` (for example, opens the media viewer) and the cursor is zoom-in. As a div it does nothing.",
   "keyboard": "As a button it is native: Tab reaches it, Enter and Space activate it.",
   "focus": "As a button it is one Tab stop and shows the focus ring; focus is not moved on its own.",
   "responsive": "It fills its width; the height grows with its content from 140px.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; show the placeholder until the picture is ready.",
   "error": "Not applicable: show the placeholder when there is no picture."
  },
  "a11y": {
   "name": "As a button, give it aria-label (\"Open hero.jpg\"), because the picture usually has empty alt.",
   "announce": "A button when `as=\"button\"`; otherwise nothing beyond its content.",
   "focus": "The focus ring uses --plx-sys-focus-ring-color and --plx-sys-focus-ring-offset.",
   "contrast": "Placeholder content uses --plx-sys-content-subtle on --plx-sys-surface-sunken.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Keep corner marks short: a type (\"PNG\") or an icon.",
   "actions": "Name the button for what it opens (\"Open in viewer\").",
   "errors": "Not applicable: it shows no error text.",
   "localization": "The corners use logical insets (top-start, bottom-end) and mirror in right-to-left."
  },
  "states": [
   [
    "Rest",
    "The sunken surface, rounded, its content centered",
    "Always"
   ],
   [
    "Focus",
    "The focus ring (--plx-sys-focus-ring-color, 2px, offset)",
    "as=\"button\", reached with the keyboard"
   ]
  ]
 },
 "calendar-view": {
  "purpose": "Shows a week or a day of a calendar: days as columns, hours as rows, today marked, and events placed by their start and end.",
  "anatomy": [
   "Grid — a group named by `label` (required)",
   "Day headers — DateBadges with weekday and number, sticky at the top (required)",
   "Hour column — the hour labels, hidden from assistive technology (required)",
   "Day column — a group named by its date, with hour slots (required)",
   "Event — an EventChip placed by start and end, a button with `onClick` (optional)",
   "Today — the day column on --plx-sys-state-selected (optional)"
  ],
  "behavior": {
   "pointer": "Clicking an event with `onClick` opens it. Empty slots do nothing.",
   "keyboard": "Events with `onClick` are native buttons: Tab reaches them, Enter and Space open them. There is no arrow-key movement between days or hours.",
   "focus": "Tab moves through the event buttons in day order; focus is not moved on its own.",
   "responsive": "Day columns share the width (minmax(0, 1fr)); the grid scrolls vertically inside its box and the day headers stay in view.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; the page shows loading until events arrive.",
   "error": "Not applicable: it has no error state."
  },
  "a11y": {
   "name": "The grid by `label` (\"Week of October 5\"); each day column by its weekday and day; events by their time and title.",
   "announce": "Groups for the grid and each day. Today's DateBadge carries hidden \"Today\". Hour labels and slots are aria-hidden.",
   "focus": "Event buttons show the system focus ring.",
   "contrast": "Lines use --plx-sys-border-divider; hour labels --plx-sys-content-muted in the data font; event colors come from the data on an EventChip's soft surface.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Label the grid with the period (\"Week of October 5\"). Use short weekday names. Event titles are the event's name; show the time as given (\"10:00\").",
   "actions": "Not applicable: the grid has no actions of its own.",
   "errors": "Not applicable: it shows no error text.",
   "localization": "Pass `hourLabel` for local time formats (the default is \"9:00\") and localized weekday names. Insets and lines use logical properties, so columns mirror in right-to-left."
  }
 },
 "media-card": {
  "purpose": "Shows a file or asset with its picture or icon, name and technical meta, and lets people select several for bulk actions.",
  "anatomy": [
   "Media — the image (lazy) or an icon on the sunken surface, in a 4/3, 1/1 or 16/9 shape (required)",
   "Badge — a mark over the bottom-end corner of the media (optional)",
   "Selection box — a checkbox in the top-start corner, with `onSelectChange` (optional)",
   "Title — the asset name, the tile's link or button with `href` or `onOpen` (required)",
   "Meta — size, type or date in the data font (optional)",
   "Actions — controls beside the title (optional)"
  ],
  "behavior": {
   "pointer": "With `href` or `onOpen`, clicking anywhere opens the asset. The selection box appears on hover, focus, when selected, and always while `selecting`; clicking it runs `onSelectChange`.",
   "keyboard": "The selection box is a native checkbox (Space). The title is a native link or button (Enter). Actions are their own Tab stops.",
   "focus": "Tab reaches the checkbox, then the title, then actions; the whole tile shows the ring when the title has focus. Focusing the tile reveals the selection box.",
   "responsive": "The tile fills its grid column; the media keeps its aspect ratio; title and meta truncate with an ellipsis.",
   "motion": "None of its own.",
   "loading": "Images load lazily; the sunken surface shows until they arrive.",
   "error": "Not applicable: it has no error state."
  },
  "a11y": {
   "name": "The title. The checkbox is named by `selectLabel` (default \"Select \" plus the title); the image by `alt`, empty by default.",
   "announce": "An article; the checkbox announces checked or not checked.",
   "focus": "The ring (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset) surrounds the tile.",
   "contrast": "Surface --plx-sys-surface-raised with --plx-sys-border-default; selected uses --plx-sys-selected-border; meta --plx-sys-content-muted.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Use the file name as the title; meta as short technical data (\"2.4 MB · JPG\").",
   "actions": "Name the checkbox \"Select \" plus the file name.",
   "errors": "Not applicable: it shows no error text.",
   "localization": "Format sizes and dates for the locale. The selection box and badge use logical insets and mirror in right-to-left."
  }
 },
 "table": {
  "purpose": "Lets people read information in rows and columns: tokens, attributes, props, specifications, a record's facts, a comparison. It looks like a Data grid (the same header, lines, type, row heights and frame, from its own tokens), with nothing to operate.",
  "anatomy": [
   "Frame — the bordered box, 8px corners: --plx-sys-table-surface, --plx-sys-table-border, --plx-comp-table-radius (required)",
   "Header row — the Data grid’s silver band (gray 50 to gray 200) with a gray 400 line under it, 28px tall at Compact (32 Standard, 40 Comfortable), 12px semibold titles (optional: headerVisible={false} hides it for a name/value table, whose first column names each row).",
   "Rows and cells — the Data grid's rows, lines and padding: --plx-sys-table-row-height, --plx-sys-table-line, --plx-comp-table-cell-padding-inline (required)",
   "Kinds — name (medium), data (data font, smaller, muted), wrap (long text grows the row), center, icon (optional)",
   "Row header — rowLabel: the first column names each row, shaded like the header (optional)",
   "Empty message — empty (shown when there are no rows)"
  ],
  "behavior": {
   "pointer": "Nothing reacts: no row hover, no sorting, no menus, no selection, no resizing or moving. Links and buttons placed in cells work as themselves.",
   "keyboard": "The table body is one Tab stop (it scrolls); links and buttons in cells are reached with Tab.",
   "focus": "Focus is not moved.",
   "responsive": "It scrolls sideways inside its frame; row height and text size follow the density.",
   "motion": "None.",
   "loading": "Every row is drawn as the table renders; nothing loads separately.",
   "error": "With no rows it shows its empty message."
  },
  "a11y": {
   "name": "label names the table (required).",
   "announce": "A table of rows, column headers and cells (role table), read like any table; the first column’s cells are row headers when it names each row.",
   "focus": "Only the scrolling body and controls inside cells take focus.",
   "contrast": "Text --plx-sys-table-text on --plx-sys-table-surface; technical values --plx-sys-table-text-muted.",
   "motion": "Nothing animates."
  },
  "content": {
   "labels": "Column titles are short nouns in sentence case. Mark names kind \"name\" and technical values kind \"data\"; let long text wrap.",
   "actions": "None: if people act on the rows, it is a Data grid.",
   "errors": "Write the empty message as a plain fact.",
   "localization": "Format dates, sizes and numbers for the locale in the data; wrapping text grows the row instead of being cut."
  },
  "related": [
   "data-grid",
   "property-list"
  ]
 },
 "data-grid": {
  "purpose": "Lets people compare records by column and work with them. A React grid on TanStack Table and TanStack Virtual (bundled) in the Plenix table style, drawn only with tokens: TanStack does the sorting, filtering, filter lists (faceting), grouping and group summaries (aggregation), selection, pinning, column sizing, order and visibility, and the window of rows; Plenix draws it. A static table (facts, props, documentation) is a Table, the same look with nothing to operate.",
  "anatomy": [
   "Frame — the grid's bordered box, 8px corners: --plx-sys-data-grid-surface, --plx-sys-data-grid-border, --plx-comp-data-grid-radius (required)",
   "Header row — a silver band, gray 50 at the top to gray 200 at the bottom, a gray 400 line under it; 28px tall at Compact, 32px at Standard, 40px at Comfortable (Windows Explorer’s header; owner, 2026-10-23), the titles unchanged; with Wrap headers two lines tall: --plx-comp-data-grid-header-background-image, --plx-comp-data-grid-header-edge, --plx-comp-data-grid-header-height, --plx-comp-data-grid-header-wrap-height (required)",
   "Column title — 12px semibold, after the column type's icon (text, number, currency, date, select, checkbox, file, image, link, person, long text; hidden in Compact, where the header row is 28px); a name cut with an ellipsis shows in full in its tooltip: --plx-comp-data-grid-header-font-size, --plx-comp-data-grid-header-font-weight, --plx-sys-data-grid-text, --plx-comp-data-grid-header-type-icon-size, --plx-comp-data-grid-header-type-icon-gap (required)",
   "Options button — at a header’s end edge while the header is hovered: the header’s height, a gray 400 line before it, the thin chevron (always the chevron), gray 200 under the pointer; it opens the column menu (headerMenu, default on; owner, 2026-10-23, Windows Explorer): --plx-comp-data-grid-header-edge, --plx-comp-data-grid-menu-button-padding-inline",
   "No view button — the row height lives only in the page's View menu (the command bar's ViewMenu sets rowHeight); viewMenu (default off) is kept only for a table with no command bar",
   "Header column line — a line between titles, the full height of the header, gray 300; while the pointer is over the header every line shows in gray 350, and the column under the pointer deepens (gray 100 to gray 300) with both its edges in gray 400 (owner, 2026-10-23, H3): --plx-sys-data-grid-header-line, --plx-comp-data-grid-header-hover-line, --plx-comp-data-grid-header-hover-edge, --plx-comp-data-grid-header-hover-background-image (required)",
   "Active filter — a funnel after the title while the column is filtered, in the accent color; it opens the filter box (Filter by this field in the column menu starts one): --plx-comp-data-grid-header-icon-size, --plx-comp-data-grid-filtered-text (filtered columns)",
   "Column edge — drag it to resize; the resize cursor is the only cue, no mark is drawn (owner, 2026-10-23, Windows Explorer) (resizable columns)",
   "Row — no zebra, a soft line under each row: --plx-sys-data-grid-surface, --plx-sys-data-grid-line; its height is the table's row height step (--plx-comp-data-grid-record-height): Short is the density's row height (28 / 32 / 40; 44 on touch and mobile), Medium 56px, Tall 88px, Extra tall 128px (--plx-comp-data-grid-row-height-medium, -tall, -extra-tall) (required)",
   "Cell padding — Short rows: content in the middle of the row. Taller rows: content from the top, P above it and at least P below it, where P is a Short row's own padding, (the density row height − the text line height) / 2 (6px in Standard): --plx-comp-data-grid-cell-padding-block, --plx-comp-data-grid-text-line-height (required)",
   "Row states — hovered: gray 100, its lines (top, bottom, between cells) gray 300, so they stay visible (R2); selected: blue 100, its lines blue-gray 250 and a 3px blue 600 bar at its start; selected and hovered: blue 200 (S2; owner, 2026-10-23); pinned and row-header cells take the same colors, so the row reads as one band: --plx-sys-data-grid-row-hover, --plx-comp-data-grid-row-hover-line, --plx-sys-data-grid-row-selected, --plx-comp-data-grid-row-selected-line, --plx-comp-data-grid-row-selected-bar, --plx-comp-data-grid-row-selected-bar-width, --plx-sys-data-grid-row-selected-hover (required)",
   "Cell — text 13px (Compact 12px), padding 8px each side, a soft column line the full height of the row: --plx-comp-data-grid-font-size (--plx-sys-data-grid-font-size), --plx-comp-data-grid-cell-padding-inline, --plx-sys-data-grid-line, --plx-comp-data-grid-column-line-inset (required)",
   "Name cell (kind \"name\") — the row's name in medium weight: --plx-comp-data-grid-name-font-weight (optional)",
   "Technical value (kind \"data\") — IDs, file names, paths, versions, dates, sizes, counts: the data font (Reddit Mono) at the table's size and line height, on the row's baseline: --plx-comp-data-grid-data-font-family, --plx-comp-data-grid-data-font-size, --plx-sys-data-grid-text-muted (optional)",
   "Long text (kind \"wrap\") — never grows the row: one line in a Short row, the lines that fit in a taller one, ending in an ellipsis (the static Table's wrapping rows grow): --plx-comp-data-grid-text-line-height (optional)",
   "Checkbox column (selectable) — 36px, pinned, select all in its header; the mark 16px in the accent color: --plx-comp-data-grid-lead-column-width, --plx-comp-data-grid-mark-size, --plx-sys-data-grid-accent (optional)",
   "Icon column (kind \"icon\") — a mark at the start of the row (an attachment), as wide as the checkbox column, its icon in the header: --plx-comp-data-grid-lead-column-width, --plx-sys-data-grid-text-muted (optional)",
   "Row header (rowLabel) — the first column names each row: shaded like the header, pinned with the columns before it, a soft edge where the other columns pass under it; the selected row's name in --plx-sys-data-grid-row-selected-text (optional)",
   "Row actions (kind \"actions\") — buttons at the end of the row, shown while the row is hovered or selected (optional)",
   "Tree control and branch (tree, children in children) — a 14px bordered box with − or +, the branch line in the header line color: --plx-comp-data-grid-tree-control-size, --plx-comp-data-grid-tree-control-radius, --plx-comp-data-grid-tree-indent (optional)",
   "Group header row (groupBy) — the density row height + 16px at every row height step, the neutral sunken surface; in the first column a chevron, the grouped-by field as an eyebrow, the value as its column draws it and the record count at its end in the data font; the other columns empty, their lines continuing; no row numbers; nested levels indented one step: --plx-comp-data-grid-group-header-height, --plx-comp-data-grid-group-background, --plx-comp-data-grid-group-indent, --plx-comp-data-grid-group-chevron-size (optional)",
   "Group gap — a 24px band between groups, lines above and below, open or closed: --plx-comp-data-grid-group-gap (grouped)",
   "Grouped-by column — its header and its cells tinted with the neutral sunken surface: --plx-comp-data-grid-grouped-column-background (grouped)",
   "Group summary and add row (optional per table, off by default) — a column's summary in each group header (sum, count, average, min, max; the value in the data font), and a + one Short row tall at the end of each group (onAddToGroup) (grouped)",
   "Editing cell — an inset 2px outline in the accent color; a failed value in the danger color: --plx-comp-data-grid-editing-outline-width, --plx-sys-data-grid-accent, --plx-sys-data-grid-danger (editable columns)",
   "Menus — 8px corners, soft shadow, 13px items with an icon. The column menu (the options button): the application’s field actions (columnMenu: duplicate, insert left or right, copy link, description, permissions), sort in the type’s words (A → Z, 1 → 9, Oldest → newest, Unchecked → checked), Filter by this field, Group by this field or Don’t group by this field. The header’s right-click menu (Windows Explorer): Size column to fit, Size all columns to fit, every column with a check (a pinned column stays shown), More… for the Manage columns dialog. The row menu on a row’s button or right-click: --plx-sys-data-grid-menu-shadow",
   "Filter box — a popover under the funnel: the field (a text input, or the list of the column’s values from TanStack’s faceting) above Clear filter, both inside the box (columns with filter)",
   "Empty message — what shows when no row matches, muted, medium: --plx-comp-data-grid-placeholder-font-size, --plx-comp-data-grid-placeholder-font-weight (shown when empty)",
   "Footer (mode \"pages\" or \"load-more\") — under the grid, a row's line above it: the range or the count in the data font, the rows-per-page Select and Pagination, or Load more: --plx-comp-data-grid-footer-* (those modes)"
  ],
  "behavior": {
   "pointer": "Click a header’s title to sort ascending, again for descending, again to clear; no arrow is drawn (aria-sort carries the order; owner, 2026-10-23). Hovering a header shows its options button at the end edge; it opens the column menu. Right-click a header for the column chooser (size to fit, the columns with checks, More…). The row height is set in the command bar’s View menu (rowHeight); the command bar’s Filter, Sort, Group and Columns drive the grid through filter, sort, groupBy, columnOrder and hiddenColumns. A group header’s chevron opens and closes the group; a record of a multi-value column shows in the group of each of its values. Drag a header to move a column (movableColumns), or its edge to resize it. Double-click an editable cell to edit it. Click a row’s checkbox to toggle it, Shift + click for a range, or the header checkbox to select all. A plain click (or Enter) on a row, not on its checkbox, selects only that row, as in a file manager, also after Select all; Ctrl or ⌘ + click toggles the row and Shift + click extends from the anchor. With a rowClick handler, a click on the row opens it, and the open row is marked: it carries aria-current=\"true\" and, in a grid without selection, the selected look (the fill and the start bar); openKey controls it (null: no row is open). Outside a pane, a table that fills the window ends at the page’s bottom padding: its height leaves room for the grid’s footer and its containers’ end margin, padding and border, so only the table scrolls, never the page.",
   "keyboard": "The grid body is one Tab stop; with a rowClick handler each row is a Tab stop and Enter does what a click does. A column header with a menu is a Tab stop: Shift + F10 or the Menu key opens the column menu, the arrow keys (Home, End) move through it, Enter chooses, Escape closes it and returns to the header. A group header row is a Tab stop: Enter or Space opens or closes it, Arrow Right opens, Arrow Left closes, Arrow Down and Arrow Up move to the next and previous group header. Checkboxes, buttons and links in cells are native controls. In an editor, Enter saves and Escape cancels. The filter popup takes focus; Enter applies. The footer's controls (the rows-per-page Select, the page buttons, Load more) follow the grid in the Tab order; Load more is the keyboard way to more rows, and when the last rows come its focus goes to the grid body.",
   "focus": "Focus stays where it was used. The filter popup and menus return focus when they close.",
   "responsive": "Under 600px (narrowAt) the grid becomes a list of its key columns (keyColumns); inside a SplitView, or with narrow=\"table\", it scrolls sideways inside its frame instead; pinned columns (frozen, rowLabel, the checkbox column) and a group header's first cell stay in view. Two settings (owner, 2026-10-14): the app's density (Compact, Standard, Comfortable) and each table's row height (Short, Medium, Tall, Extra tall). Text size and the Short row height follow the density, including a density region's; the other steps are the same at every density. When the density changes, column widths are measured again (never the rows), so text is never cut off; a width the column sets or the person chose is kept. With height, the grid scrolls inside and rows render as they come into view (long lists). A grid built in a hidden place (a closed tab) is drawn when it is shown.",
   "motion": "The options button and row actions fade in over --plx-comp-data-grid-duration (0.12s); nothing moves with reduced motion.",
   "loading": "The grid is part of the Platform bundle: it draws with the page, nothing loads separately. Many rows (the mode prop; owner, 2026-10-14): \"fill\" (the default) fills the room left on screen and draws only the rows in view; \"pages\" shows pages of rows with the range, the rows-per-page choice and Pagination under the grid; \"load-more\" shows the first rows and more as the person reaches the bottom or presses Load more. Pages and load-more take rows from the browser or from a server (fetchRows({ page, size, sort, filters, search }) → { rows, total }, sorted and filtered there); a server that fails shows the error state with Retry.",
   "error": "With no rows, or none that match the filters, the grid shows its empty message (empty, default \"Nothing to show\"). An editor's failed validation outlines the cell in the danger color."
  },
  "a11y": {
   "name": "label names the grid (aria-label); it is required. Checkboxes are named \"Select row N\"; an icon column's header is an image named by its title.",
   "announce": "An ARIA grid: rows, column headers (aria-sort on the sorted one) and cells. A group header is a row named \"Box + cask, group, 5 records\" with aria-expanded and aria-level; opening or closing it is announced politely (\"…, expanded\"). Group headers kept at the top as stand-ins are hidden from assistive technology. Badges and icons in cells keep their own names. A grid that draws only some rows (fill, load-more) or one page carries aria-rowcount and each row its aria-rowindex; the rows that load more are announced politely (\"50 more rows loaded, 150 of 560\").",
   "focus": "The grid body shows the focus ring inset when it has focus; rows that open show the ring of the row. The open row is announced as current (aria-current=\"true\").",
   "contrast": "Text --plx-sys-data-grid-text on --plx-sys-data-grid-surface; technical values and counts --plx-sys-data-grid-text-muted; selected rows keep their text readable in light and dark. Change roles only in the token files, never in a page.",
   "motion": "Only fades; under prefers-reduced-motion they do not animate."
  },
  "content": {
   "labels": "Column titles are short nouns in sentence case (\"Name\", \"Date added\"). Mark the row's name kind \"name\" and technical values kind \"data\". Align numbers to the end (align \"right\"; number, currency and size columns align to the end by themselves). Give a column its type (type: \"number\", \"currency\", \"date\", \"select\", \"checkbox\", \"file\", \"image\", \"link\", \"person\", \"long-text\"; text by default) for its header icon and its sort words.",
   "actions": "Row actions go in a kind \"actions\" column or the row menu; bulk actions in BulkActions above the grid; the row that opens shows its details beside it.",
   "errors": "Write the empty message as a plain fact (\"No assets yet\"); show load failures outside the grid.",
   "localization": "Format dates, sizes and numbers for the locale in the data or a formatter. Taller rows give translations more lines; a Short row ends long text in an ellipsis. Every word the grid writes (menus, the view menu, group rows, the filter popup, the footer) is in its strings, which the strings prop replaces."
  },
  "related": [
   "bulk-selection",
   "bulk-action-bar",
   "pagination",
   "empty-state",
   "property-list"
  ]
 },
 "notice": {
  "purpose": "Shows a short message in its tone where the person is reading, so they see a warning or a fact before they act.",
  "anatomy": [
   "Container — the soft tone surface with the tone's content color (required)",
   "Icon — the tone's icon, or the one given with `icon` (required)",
   "Text — the message, from the children (required)"
  ],
  "behavior": {
   "pointer": "Static. Links or buttons in the text keep their own behavior.",
   "keyboard": "No keys of its own; Tab reaches the controls inside it.",
   "focus": "Do not move focus to it, including when it appears.",
   "responsive": "It fills its container and the text wraps (the text column can shrink to zero). The icon stays at the start of the first line.",
   "motion": "None of its own.",
   "loading": "Not applicable: it shows a message that is already known.",
   "error": "The danger tone is the error variant: the danger soft surface and content color, with the alert icon."
  },
  "a11y": {
   "name": "It has no name of its own; screen readers read its text. Do not rely on the icon or the color to carry the meaning.",
   "announce": "A danger notice has role=\"alert\", so it is announced when it appears. Other tones are read in place, with no live region.",
   "focus": "It is not in the focus order. Controls inside it show the standard focus ring (--plx-sys-focus-ring-color).",
   "contrast": "Each tone pairs a soft surface with its content role (--plx-sys-feedback-*-soft with --plx-sys-feedback-*-content), which keeps text readable in light and dark. Do not change one without the other.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Write one or two short sentences in sentence case. Lead with the fact or the consequence (\"This folder is shared with 3 people.\").",
   "actions": "Not applicable: it has no actions of its own. If the person must act, put the action on the page or the dialog footer.",
   "errors": "In the danger tone, say what is wrong and what to do next, in plain words. Do not blame the person or use codes alone.",
   "localization": "Text wraps, so expansion only adds lines. The CSS uses logical properties, so the icon sits at the start in right-to-left."
  }
 },
 "toast": {
  "purpose": "Tells the person, briefly and without interrupting, the outcome of something that just happened (saved, failed). It leaves by itself, except the danger toast.",
  "anatomy": [
   "Region — the fixed stack at the end corner of the screen, rendered in a portal (required)",
   "Toast — the surface with a tone-colored start border (required)",
   "Icon — the tone's icon (required)",
   "Message — the text passed to `toast.show` (required)",
   "Dismiss button — the close icon button (required)"
  ],
  "behavior": {
   "pointer": "Dismiss removes the toast. Clicks pass through the region; only the toasts themselves catch them.",
   "keyboard": "Tab reaches Dismiss, a native button. There are no shortcut keys.",
   "focus": "Focus does not move to a toast when it appears and is not restored when it leaves. A danger toast stays until dismissed, so a keyboard user can reach it.",
   "responsive": "Each toast is between 280px and 400px wide (size tokens); the message wraps. New toasts stack at the end of the column.",
   "motion": "It slides in from the end with motion-toast-in and out with motion-toast-out (--plx-sys-motion-duration-slow, --plx-sys-motion-ease-standard). Info, success and warning leave after the provider `duration` (default 4000 ms).",
   "loading": "Not applicable: it reports an outcome. Show progress with Spinner or ProgressBar where the work happens.",
   "error": "The danger tone: a danger start border and the alert icon. It stays until dismissed unless a `duration` is given."
  },
  "a11y": {
   "name": "The message text is the content; the Dismiss button is named \"Dismiss\" (aria-label).",
   "announce": "Each toast is announced once when it appears, through announce(): its text and its action's label (\"Asset moved to Crosses. Undo\"), politely, and at once (assertive) for a danger toast. Toasts that appear together are all read, in order. The toast region is not a live region, so its buttons are never read as part of a message.",
   "focus": "Only the Dismiss button is focusable; it shows the focus ring (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset).",
   "contrast": "Text uses --plx-sys-toast-content on --plx-sys-toast-background, and the tone border uses the feedback solid roles, in light and dark.",
   "motion": "With reduced motion, the slide runs at zero duration, so the toast appears and leaves instantly; it still leaves."
  },
  "content": {
   "labels": "Write a short sentence-case outcome, often a past-tense verb (\"Saved\", \"3 assets moved\"). Keep it to one line where possible.",
   "actions": "Not applicable: a toast has only Dismiss. Do not put something the person must act on in a toast; use a Dialog or a Notice.",
   "errors": "Say what failed and, if it helps, what to try (\"Couldn't save. Check your connection.\"). Use the danger tone so it stays.",
   "localization": "The message wraps within the 400px maximum. The region sits at the inline end, but the slide keyframes use translateX, which does not mirror in right-to-left."
  }
 },
 "notification-center": {
  "purpose": "Lets the signed-in person see what is new and open it.",
  "anatomy": [
   "List — an ActivityList named by `label` (required)",
   "Notification — an ActivityList item with text and time (required)",
   "Unread mark — the unread dot and a bold title (optional)",
   "Empty state — \"No notifications\" when the list is empty (optional)",
   "Footer — Mark all read and, with `onViewAll`, View all (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a notification's title opens it and marks it read. Mark all read clears every unread mark; View all runs `onViewAll`.",
   "keyboard": "Each title is a native button and each footer action a Button, reached with Tab. There are no shortcut keys.",
   "focus": "Focus stays on the activated control. Nothing is moved or trapped.",
   "responsive": "A notification's text wraps to at most two lines instead of being cut. Use `limit` to show the first few in a small section.",
   "motion": "None of its own.",
   "loading": "No loading state of its own; it reads the session's notifications (or `items`). The page shows Loading while the session loads.",
   "error": "Not applicable: it has no error state. Reads are saved to the session when no `items` are given."
  },
  "a11y": {
   "name": "The list is named by `label` (default \"Notifications\", aria-label). Each notification is named by its text.",
   "announce": "Screen readers hear a list with items; an unread item adds \"Unread\" (visually hidden text). Read changes are not announced.",
   "focus": "Titles and footer buttons follow reading order and show the standard focus ring.",
   "contrast": "It uses ActivityList's text and dot roles and the divider role (--plx-sys-border-divider) above the footer, which hold in light and dark.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Write each notification as one sentence in sentence case that names who did what (\"Maya shared Brand kit with you\"). Show the time as relative or short.",
   "actions": "Keep the built-in labels Mark all read and View all. Do not add a bell or a header badge: notifications live in the page.",
   "errors": "Not applicable: it shows no errors.",
   "localization": "Text wraps to two lines, so long translations are clamped, not cut mid-line. Format times for the locale; the layout uses logical properties."
  }
 },
 "status-dot": {
  "purpose": "Marks a state (active, paused, priority) with a small tone dot. It is a quick visual cue next to a status in words.",
  "anatomy": [
   "Dot — a 6px round mark in the tone's solid color (required)",
   "Label — the state in words, visually hidden, from `label` (optional)"
  ],
  "behavior": {
   "pointer": "None: it is static.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not applicable: it takes no focus.",
   "responsive": "It keeps its 6px size and never shrinks in a flex row.",
   "motion": "None of its own.",
   "loading": "Not applicable: it shows a known state.",
   "error": "Use the danger tone for a failed or critical state; it has no other error behavior."
  },
  "a11y": {
   "name": "With `label`, the label is read through visually hidden text. Without it, the dot is aria-hidden and silent.",
   "announce": "Only the label text, as plain text; there is no role or live region.",
   "focus": "It is not in the focus order.",
   "contrast": "The dot uses the feedback solid roles (--plx-sys-feedback-*-solid). Color alone is not enough: show the status in words nearby.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Write the state as one or two words in sentence case (\"Active\", \"Paused\"). Match the visible status text.",
   "actions": "Not applicable: it has no actions.",
   "errors": "Not applicable: it shows no error text.",
   "localization": "Translate the label. The dot itself needs no change."
  }
 },
 "spinner": {
  "purpose": "Tells the person to wait while something loads for an unknown time, without promising how long.",
  "anatomy": [
   "Ring — a turning circle in the primary action color with one open side (required)",
   "Label — visually hidden text, default \"Loading\" (required)"
  ],
  "behavior": {
   "pointer": "None: it is static.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not applicable: it takes no focus.",
   "responsive": "It keeps its size (`sm` 12px, `md` 16px, `lg` 24px) and does not shrink in a flex row.",
   "motion": "It turns continuously with motion-spin at --plx-sys-motion-duration-loop-fast, linear.",
   "loading": "It is the loading state. Remove it when the content arrives.",
   "error": "Not applicable: replace it with an error message when loading fails."
  },
  "a11y": {
   "name": "From `label` (default \"Loading\"), as visually hidden text.",
   "announce": "It has role=\"status\", so its label is announced politely when it appears.",
   "focus": "It is not in the focus order.",
   "contrast": "The ring uses --plx-sys-action-primary-background, which keeps a visible boundary on the page surface in light and dark.",
   "motion": "With reduced motion, the turn runs once at zero duration, so the ring is shown still."
  },
  "content": {
   "labels": "Name what is happening with a short verb phrase in sentence case (\"Saving\", \"Loading assets\"). Keep the default only when nothing more specific fits.",
   "actions": "Not applicable: it has no actions.",
   "errors": "Not applicable: show failures with a Notice or Toast.",
   "localization": "Translate the label. The ring needs no change for right-to-left."
  }
 },
 "progress-bar": {
  "purpose": "Lets the person see how much of a task or a quantity is left. It is determinate with a `value` and indeterminate without one.",
  "anatomy": [
   "Label — what is progressing, above the track unless `labelHidden` (required)",
   "Value — the percent at the end of the label row, with `showValue` (optional)",
   "Track — the neutral bar, 8px (`md`) or 4px (`sm`) (required)",
   "Fill — the done part, in the tone or a data `color` (required)"
  ],
  "behavior": {
   "pointer": "None: it is static.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not applicable: it takes no focus.",
   "responsive": "It fills its container's width; the fill is a percent of the track. A long label shares the row with the value and can shrink.",
   "motion": "The fill width changes over --plx-sys-motion-duration-base with --plx-sys-motion-ease-standard. When indeterminate, a third of the track runs from start to end over --plx-sys-motion-duration-loop-slow.",
   "loading": "Leave out `value` while the amount is unknown; the bar runs indeterminate.",
   "error": "No error state of its own. Use the danger tone for a quantity in trouble, and say what failed in text nearby."
  },
  "a11y": {
   "name": "From `label`: aria-labelledby the visible label, or aria-label when `labelHidden`.",
   "announce": "The track has role=\"progressbar\" with aria-valuenow, aria-valuemin and aria-valuemax; an indeterminate bar has no values. Updates are not announced as a live region.",
   "focus": "It is not in the focus order.",
   "contrast": "The track uses --plx-sys-fill-neutral; the fill uses the feedback solid roles. A data `color` is not checked for contrast, so keep the label and value visible.",
   "motion": "With reduced motion, the fill change and the indeterminate run go to zero duration; the indeterminate fill is shown still."
  },
  "content": {
   "labels": "Name the task or the quantity in sentence case (\"Uploading 3 files\", \"Tasks done\"). Do not repeat the percent in the label.",
   "actions": "Not applicable: put Cancel or Retry beside it, not inside it.",
   "errors": "Not applicable: show the failure as a Notice or Toast and stop the bar.",
   "localization": "The value uses the data font with tabular figures. The percent sign is fixed in the code; the indeterminate keyframes use translateX, which does not mirror in right-to-left."
  }
 },
 "skeleton": {
  "purpose": "Holds the place and shape of content that is loading, so the layout does not jump when it arrives.",
  "anatomy": [
   "Block — a rounded placeholder in the skeleton base color, sized by `width` and `height` tokens (required)",
   "Shimmer — the highlight band that moves across the block (required)"
  ],
  "behavior": {
   "pointer": "None: it is static.",
   "keyboard": "None: it is not focusable.",
   "focus": "Not applicable: it takes no focus.",
   "responsive": "It is a block; without `width` it sizes to its container. Pass size tokens, never raw values.",
   "motion": "A shimmer runs left to right with motion-shimmer-forward at --plx-sys-motion-duration-loop-slow.",
   "loading": "It is the loading state. Replace it with the content; use Spinner when the shape is unknown.",
   "error": "Not applicable: replace it with an error message when loading fails."
  },
  "a11y": {
   "name": "None: it is aria-hidden.",
   "announce": "Nothing. Announce the loading once for the region (for example with a Spinner label).",
   "focus": "It is not in the focus order.",
   "contrast": "It uses --plx-sys-skeleton-base and --plx-sys-skeleton-highlight, tuned for light and dark.",
   "motion": "With reduced motion, the shimmer runs once at zero duration, so the block is shown still."
  },
  "content": {
   "labels": "Not applicable: it has no text.",
   "actions": "Not applicable: it has no actions.",
   "errors": "Not applicable: it shows no errors.",
   "localization": "Size blocks for the longest likely text. The shimmer direction is fixed left to right."
  }
 },
 "empty-state": {
  "purpose": "Tells the person why a region has nothing to show and what to do next, so an empty view is not a dead end.",
  "anatomy": [
   "Icon — a 24px icon or mark, hidden from assistive technology (optional)",
   "Title — the main line (optional)",
   "Text — the explanation, from the children (optional)",
   "Action — a button, such as Upload (optional)"
  ],
  "behavior": {
   "pointer": "Nothing of its own; the action button keeps its own behavior.",
   "keyboard": "Nothing of its own; the action is reached with Tab.",
   "focus": "Do not move focus to it or to its action when it appears.",
   "responsive": "It centers its column; the text is at most 400px wide and wraps. `inline` fits inside a list or table area; `page` fills a whole view with layout padding.",
   "motion": "None of its own.",
   "loading": "Not applicable: show Skeleton or Spinner while loading, then the empty state only when the result is empty.",
   "error": "For content that could not load, use tone=\"error\": name the problem and give the one action that recovers (Retry); it is announced as an alert. An error in one field stays at the field."
  },
  "a11y": {
   "name": "It has no name of its own; the title and text are read in place.",
   "announce": "The error tone is a live alert (role=\"alert\"), read when it appears; warning and success are a status (role=\"status\"), read when the reader is idle; the neutral tone is not announced. The title is not a heading.",
   "focus": "Only the action is focusable, with the standard focus ring.",
   "contrast": "Text uses --plx-sys-content-subtle and the title --plx-sys-content-default; the icon uses --plx-sys-content-disabled because it is decorative.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Write the title as a short sentence-case statement (\"No assets yet\", \"No results\"). In the text, say why it is empty and what to do.",
   "actions": "Name the action with a verb that adds or changes something (\"Upload\", \"Clear filters\").",
   "errors": "For content that could not load, the title names the problem (\"The assets could not load\") and the action recovers (\"Retry\").",
   "localization": "Text wraps within 400px and is centered, so it reads the same in right-to-left."
  }
 },
 "dialog": {
  "purpose": "Opens a modal layer for a focused task that needs the person's full attention, then returns them to where they were.",
  "anatomy": [
   "Veil — the scrim behind the dialog (required)",
   "Header — a filled band with the optional icon, the title and the close button (required)",
   "Title — the dialog's name, an h2 (required)",
   "Body — the description and content, scrolling when tall (required)",
   "Footer — a filled band with the actions (optional)"
  ],
  "behavior": {
   "pointer": "The close button and a click on the veil run `onClose`. With `dismissible={false}` the veil does nothing and there is no close button.",
   "keyboard": "Escape runs `onClose` unless `dismissible` is false; it closes only the topmost layer. Tab and Shift+Tab cycle inside the dialog.",
   "focus": "Focus moves to `initialFocus`, else the first control in the body, else the first footer action. Focus is trapped inside and returns to the opener on close.",
   "responsive": "It is centered with the layout inset on every side and as wide as its `size` allows (sm 400px to xl 900px; full fills the layer). The body scrolls; the footer actions wrap.",
   "motion": "The dialog pops in and its backdrop fades in (the quick duration); with reduced motion both appear at once.",
   "loading": "No loading state of its own. Show Spinner or Skeleton in the body, or a loading state on the footer action.",
   "error": "No error state of its own. Show a Notice in the body or field errors in the form."
  },
  "a11y": {
   "name": "aria-labelledby the title; aria-describedby the description when given. The close button is named by `closeLabel` (default \"Close\").",
   "announce": "role=\"dialog\" with aria-modal=\"true\", announced with its title and description when focus moves in.",
   "focus": "Controls show the focus ring; the dialog surface itself shows none when it holds focus.",
   "contrast": "The bands use --plx-sys-surface-dialog-chrome with --plx-sys-content-dialog-chrome and --plx-sys-border-dialog-chrome dividers; the body uses --plx-sys-surface-overlay. These hold in light and dark.",
   "motion": "With reduced motion the dialog and its backdrop appear at once."
  },
  "content": {
   "labels": "Write the title in sentence case as the task (\"Rename asset\"). Keep the description to one or two sentences.",
   "actions": "Name footer actions with verbs that say what happens (\"Rename\", \"Save\"); put Cancel before the primary action.",
   "errors": "Say what is wrong next to the field, or in a Notice at the top of the body, and keep the dialog open.",
   "localization": "The title truncates with an ellipsis on one line, so keep it short. The layout uses logical properties: the close button and actions sit at the inline end in right-to-left."
  }
 },
 "confirmation-dialog": {
  "purpose": "Asks the person to confirm a destructive or irreversible action before it happens, naming the action on its button.",
  "anatomy": [
   "Title — the question (required)",
   "Message — the explanation of the consequences (optional)",
   "Body content — more content from the children (optional)",
   "Cancel button — from `cancelLabel`, default \"Cancel\" (required)",
   "Confirm button — from `confirmLabel`; danger when `destructive` (required)"
  ],
  "behavior": {
   "pointer": "Confirm runs `onConfirm`. Cancel, the close button and a click on the veil run `onCancel`.",
   "keyboard": "Escape runs `onCancel`. Tab and Shift+Tab cycle inside; Enter or Space activate the focused button.",
   "focus": "A destructive dialog starts on Cancel; otherwise focus goes to the first control in the body or the first footer action. Focus is trapped and returns to the opener.",
   "responsive": "It is always the small size (at most 400px) and centered with the layout inset; the footer buttons wrap.",
   "motion": "None of its own.",
   "loading": "No loading state of its own. Keep the dialog open and show a loading state on the confirm action if the work takes time.",
   "error": "No error state of its own. If the action fails, say so in a Notice or Toast."
  },
  "a11y": {
   "name": "aria-labelledby the title; aria-describedby the message.",
   "announce": "role=\"alertdialog\" with aria-modal=\"true\", so the question and message are read as an alert when it opens.",
   "focus": "Focus stays inside; buttons show the standard focus ring.",
   "contrast": "It uses the Dialog chrome roles; the destructive confirm uses the danger button roles, readable in light and dark.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Write the title as a question that names the action and the count (\"Delete 3 assets?\"). In the message, state what cannot be undone.",
   "actions": "Name the confirm button with the action verb (\"Delete\"), never \"Yes\" or \"OK\". Keep Cancel as the other choice.",
   "errors": "Not applicable: it asks before acting. Report a failure after the action with a Toast or Notice.",
   "localization": "Expect longer verbs; the footer wraps. The layout mirrors in right-to-left through logical properties."
  }
 },
 "side-drawer": {
  "purpose": "Opens a modal layer docked to a side for a temporary task, such as filters, while the page stays in view behind it.",
  "anatomy": [
   "Veil — the scrim over the page (required)",
   "Header — a filled band with the title and the close button (required)",
   "Body — the content, scrolling when tall (required)",
   "Footer — a filled band with the actions (optional)"
  ],
  "behavior": {
   "pointer": "The close button and a click on the veil run `onClose`, unless `dismissible` is false.",
   "keyboard": "Escape runs `onClose` unless `dismissible` is false. Tab and Shift+Tab cycle inside the drawer.",
   "focus": "Focus moves to `initialFocus`, else the first control in the body, else the first footer action. It is trapped and returns to the opener.",
   "responsive": "It is full height, docked to the inline end (or start with `side=\"start\"`), at most 320px, 400px or 560px wide by `size`. The body scrolls.",
   "motion": "It slides in from its edge (the start edge with side=\"start\", mirrored in right-to-left); with reduced motion it appears in place.",
   "loading": "No loading state of its own. Show Spinner or Skeleton in the body.",
   "error": "No error state of its own. Show a Notice or field errors in the body."
  },
  "a11y": {
   "name": "aria-labelledby the title; aria-describedby the description when given. The close button is named by `closeLabel`.",
   "announce": "role=\"dialog\" with aria-modal=\"true\", announced with its title when focus moves in.",
   "focus": "Controls show the standard focus ring.",
   "contrast": "It uses the Dialog chrome and overlay surface roles, readable in light and dark.",
   "motion": "With reduced motion it appears in place, without sliding."
  },
  "content": {
   "labels": "Write the title as a short noun phrase in sentence case (\"Filters\", \"Details\").",
   "actions": "Use verbs for footer actions (\"Apply\", \"Clear\").",
   "errors": "Place errors next to the field that caused them.",
   "localization": "The side is logical: `end` docks to the left in right-to-left. The title truncates on one line."
  }
 },
 "sheet": {
  "purpose": "Holds a short, self-contained task or the details of a selection over the screen, then returns the person to the same place.",
  "anatomy": [
   "Scrim — the veil over the screen behind it (required)",
   "Grabber — a bar at the top of the bottom sheet; a button that changes its height (required at Narrow)",
   "Header — Cancel on the leading edge, the title, Done on the trailing edge; or the title and Close (required)",
   "Body — the content, scrolling when tall (required)",
   "Footer — more actions pinned to the bottom (optional)"
  ],
  "behavior": {
   "pointer": "Cancel, Close and a click on the scrim run `onClose`; Done runs `onDone`. Pressing the grabber moves between the medium and large heights; dragging it up opens the large height, dragging it down returns to the medium height or closes the sheet.",
   "keyboard": "Escape runs `onClose` unless `dismissible` is false. Tab and Shift+Tab cycle inside the sheet. Enter or Space on the grabber changes the height.",
   "focus": "Focus moves to `initialFocus`, else the first control in the body, else the first footer action. It is trapped and returns to the opener.",
   "responsive": "Narrow (under 600px): a bottom sheet at the medium height (about half the window) or the large height. Medium (600–839px): a side sheet, the Drawer. Wide: a dialog, unless the caller shows a pane there (SidePanel). Set `form` to keep one form at every size.",
   "motion": "The bottom sheet rises and fades in at --plx-sys-motion-duration-base.",
   "loading": "No loading state of its own. Show Spinner or Skeleton in the body.",
   "error": "No error state of its own. Show a Notice or field errors in the body."
  },
  "a11y": {
   "name": "aria-labelledby the title; aria-describedby the description when given. Close is named by `closeLabel`; the grabber by its action (Expand sheet, Shrink sheet).",
   "announce": "role=\"dialog\" with aria-modal=\"true\", announced with its title when focus moves in.",
   "focus": "Controls show the standard focus ring; the grabber shows it around its target.",
   "contrast": "It uses the overlay surface and the dialog chrome border roles, readable in light and dark; the grabber bar uses the strong border role.",
   "motion": "With reduced motion the sheet appears without rising."
  },
  "content": {
   "labels": "Write the title as a short noun phrase or the task in sentence case (\"Rename collection\", \"Details\").",
   "actions": "Show Cancel and Done (or Save, Add), or Back in a multi-step flow, never all three. Only one sheet shows at a time.",
   "errors": "Place errors next to the field that caused them; keep Done available and say what to fix.",
   "localization": "Cancel and Done follow the reading direction: Cancel on the leading edge. The title truncates on one line."
  }
 },
 "tooltip": {
  "purpose": "Shows the name of a control, usually an icon-only one, on hover and on keyboard focus.",
  "anatomy": [
   "Trigger — the one control it wraps (required)",
   "Bubble — the text in a dark surface with an arrow (required)"
  ],
  "behavior": {
   "pointer": "It shows when the pointer enters the trigger and hides when it leaves. The bubble ignores the pointer.",
   "keyboard": "It shows when the trigger gets focus and hides on blur. Escape hides it.",
   "focus": "Focus stays on the trigger; the bubble is never focusable.",
   "responsive": "The bubble is one line (no wrapping), placed below, above or at the inline end by `placement`. Keep the text short so it fits.",
   "motion": "It fades in and out (opacity) at --plx-sys-motion-duration-fast.",
   "loading": "Not applicable: it shows static text.",
   "error": "Not applicable: do not use it for error text."
  },
  "a11y": {
   "name": "It does not name the control: the trigger needs its own label. The tooltip text describes it.",
   "announce": "role=\"tooltip\"; the trigger is aria-describedby the tooltip, added to any description it already has.",
   "focus": "The trigger keeps its own focus ring.",
   "contrast": "It uses --plx-sys-tooltip-background with --plx-sys-tooltip-content, readable in light and dark.",
   "motion": "With reduced motion, the fade runs at zero duration, so it appears instantly."
  },
  "content": {
   "labels": "Write the control's name in sentence case, a few words (\"Upload files\"). Match the control's own label.",
   "actions": "Not applicable: it must not contain links or buttons. Put interactive content in a popover or on the page.",
   "errors": "Not applicable: show errors on the page.",
   "localization": "It does not wrap, so allow for longer text. The `end` placement uses logical properties; `top` and `bottom` center with translateX."
  }
 },
 "expandable-section": {
  "purpose": "Lets the person show or hide a section of content under an accent uppercase title, so long panels stay scannable.",
  "anatomy": [
   "Heading — the h3 (or `headingLevel`) row with a divider beneath (required)",
   "Toggle — the button with the optional icon, the title and the chevron (required)",
   "Chevron — at the end; points down while open (required)",
   "Actions — controls beside the header, outside its button (optional)",
   "Body — the content, hidden while collapsed (required)"
  ],
  "behavior": {
   "pointer": "Clicking the header toggles the body and runs `onToggle(next)`. Actions beside it work on their own.",
   "keyboard": "The toggle is a native button: Tab reaches it, Enter and Space toggle it.",
   "focus": "Focus stays on the toggle after it expands or collapses.",
   "responsive": "The actions keep their width. Every foldable section heading (CollapsibleSection, NavList groups included) wraps to two balanced lines, then the second line ends in an ellipsis, and the full text shows in a Tooltip on hover and on keyboard focus while it is cut. One line is 32px tall, two lines 40px. A plain heading that takes no focus (a static NavList heading) shows the full text on hover only. Screen readers always get the full text.",
   "motion": "The chevron turns at --plx-sys-motion-duration-base with --plx-sys-motion-ease-standard. The body opens and closes without animation.",
   "loading": "Not applicable: put a loading state inside the body.",
   "error": "Not applicable: it has no error state of its own."
  },
  "a11y": {
   "name": "The toggle is named by the title text; the icon and chevron are aria-hidden.",
   "announce": "A button with aria-expanded inside a heading, pointing at the body (aria-controls). Collapsed, the body is hidden and left out of the accessibility tree.",
   "focus": "The toggle shows an inset focus ring (--plx-sys-focus-ring-color).",
   "contrast": "The title uses --plx-sys-content-link; the divider uses --plx-sys-border-default, in light and dark.",
   "motion": "With reduced motion, the chevron turns instantly."
  },
  "content": {
   "labels": "Write the title as a short noun phrase in sentence case (\"Collections\"); CSS shows it in uppercase. Do not type it in capitals.",
   "actions": "Keep header actions to one or two icon buttons, each with its own label.",
   "errors": "Not applicable: it has no error text.",
   "localization": "The uppercase transform is CSS, so translations are written normally. The chevron sits at the inline end in right-to-left."
  }
 },
 "media-lightbox": {
  "purpose": "Shows an asset large, one at a time, with previous and next and its details, without leaving the page.",
  "anatomy": [
   "Viewer — the full-screen media surface (required)",
   "Counter — \"2 of 5\" at the top start (required)",
   "Close button — at the top end (required)",
   "Previous and Next buttons — at the sides, with more than one item (optional)",
   "Image — the shown item, scaled to fit (required)",
   "Caption — title and technical meta values (optional)",
   "Actions — extra controls under the image (optional)"
  ],
  "behavior": {
   "pointer": "Close runs `onClose`; Previous and Next change the item and wrap past the ends. There is no veil to click.",
   "keyboard": "Arrow Left and Arrow Right go to the previous and next item (with more than one). Escape runs `onClose`; Tab cycles inside.",
   "focus": "Focus moves to the first control in the viewer, is trapped inside and returns to the opener on close.",
   "responsive": "It fills the screen; the image scales to fit with object-fit contain. Side controls keep room on each side, and the meta values wrap.",
   "motion": "None of its own.",
   "loading": "No loading state of its own: the image loads in place. With no items nothing renders.",
   "error": "No error state of its own: a broken image shows its alt text."
  },
  "a11y": {
   "name": "From `label` (default \"Preview\"), as aria-label. Each image uses its `alt`; buttons are named Close preview, Previous and Next.",
   "announce": "role=\"dialog\" with aria-modal=\"true\", described by the counter.",
   "focus": "Controls show the focus ring (--plx-sys-focus-ring-color, --plx-sys-focus-ring-offset).",
   "contrast": "It uses the media roles (--plx-sys-surface-media, --plx-sys-content-on-media, --plx-sys-content-on-media-muted, --plx-sys-border-media), which stay dark in both themes.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Give every item meaningful `alt` text. Keep `meta` to short technical values (\"JPG\", \"2.4 MB\"); they use the data font.",
   "actions": "Name extra actions with verbs (\"Download\", \"Open in editor\"). Do not edit in the viewer.",
   "errors": "Not applicable: it shows no error text.",
   "localization": "The counter is built as \"N of M\" in English in the code. The arrow keys are not swapped in right-to-left."
  }
 },
 "bulk-selection": {
  "purpose": "Lets the person select many records and act on all of them at once, with the count always in view.",
  "anatomy": [
   "Selection checkbox — on each Table row or MediaCard (required)",
   "Select all rows — the DataGrid header checkbox (selectable), mixed when some are selected (optional)",
   "Bulk action bar — BulkActions, shown while anything is selected, only on a page without a command bar; under a command bar the selection’s commands replace the page’s actions, search and the filters stay, and the bar ends with “× N selected” (optional)",
   "Selection summary — the count, Select all and Clear selection (required)",
   "Actions — buttons or menu buttons; those that do not fit move into More (required)"
  ],
  "behavior": {
   "pointer": "Clicking a checkbox selects or clears its record. The MediaCard box shows on hover, focus and selection, and always while anything is selected. Select all selects every record, not only the page; Clear selection clears it.",
   "keyboard": "Checkboxes and buttons are native and reached with Tab; Space toggles a checkbox. Menus in the bar use Menu's keys.",
   "focus": "Focus stays on the control used. The bar appears without taking focus, and goes away when the count reaches 0.",
   "responsive": "Actions that do not fit move into a More menu; a menu button's items appear there as a group.",
   "motion": "None of its own.",
   "loading": "No loading state of its own. Show the action's progress with a Toast or ProgressBar.",
   "error": "No error state of its own. Disable single-only actions while several are selected, and confirm destructive bulk actions with the count."
  },
  "a11y": {
   "name": "The bar is a toolbar named by `label` (default \"Selection actions\"). Row boxes are \"Select row N\" and card boxes \"Select\" plus the title.",
   "announce": "The count (\"3 assets selected\") is in a polite live region. The header checkbox reports mixed when only some rows are selected.",
   "focus": "Checkboxes, then the bar's controls in order; all show the standard focus ring.",
   "contrast": "The bar uses --plx-sys-state-selected with --plx-sys-selected-border, readable in light and dark.",
   "motion": "Nothing to reduce: it does not animate."
  },
  "content": {
   "labels": "Pass the record's noun and plural so the count reads naturally (\"1 asset\", \"3 assets selected\").",
   "actions": "Name actions with verbs (\"Download\", \"Move\"). Confirm destructive ones with the count in the question (\"Delete 2 categories?\").",
   "errors": "If an action fails for some records, say how many and which, in a Toast or Notice.",
   "localization": "The count sentence is built from `noun` and `plural` in English word order; languages with other plural rules need their own words. The bar uses logical properties."
  }
 },
 "filter-and-sort-workflow": {
  "purpose": "Lets people narrow a large collection to the records they need and put them in a useful order, without leaving the page. It uses the command bar’s Filter, Sort, Group, Columns and View buttons over one list or grid, with Pagination below.",
  "anatomy": [
   "Command bar — the bar over the collection: the search, Filter and the app’s quick filters on its find side, Sort, Group, Columns and View on its view side (required)",
   "Filter — the Filter button and its panel of conditions; with conditions it takes the tint and a count badge (required)",
   "Quick filters — the app’s own shortcuts beside Filter: Category, Type, Tags, Date (optional)",
   "Sort — the Sort button and its panel (required)",
   "Group, Columns and View — each its own button and panel on the view side (optional)",
   "Count — the collection’s count at the end of the bar, updated with every change (optional)",
   "Results — the list, the Platform data grid or a ContentGrid of cards (required)",
   "Pagination — page buttons, the summary (\"1–30 of 120\") and the per-page choice (optional)"
  ],
  "behavior": {
   "pointer": "A find or view button opens its panel under it; changes apply at once, and a click outside or Escape closes the panel. Set filters show in the Filter button (its tint and count badge), never as chips under the bar; only the Search workspace repeats them as chips.",
   "keyboard": "The command bar is a toolbar with one Tab stop: Arrow Left and Right move between its buttons, Home and End jump to the ends. Enter or Space opens a panel; focus moves to its first row and returns to the button when Escape closes it.",
   "focus": "Focus returns to the button when its panel closes. Focus stays where it was when the results update; nothing moves it to the results.",
   "responsive": "Filter, Sort, Group, Columns and View keep their own buttons at every width; on a short bar they show icons only, each with its tooltip. Pagination keeps its own layout.",
   "motion": "None of its own; panels open as popovers.",
   "loading": "Not applicable: no loading state of its own; the page shows Loading or Skeleton in the results while it fetches.",
   "error": "Not applicable: an unfinished condition does not filter. When nothing matches, show an EmptyState in the results."
  },
  "a11y": {
   "name": "The command bar is a toolbar named by its label (\"Assets\"); each panel is a dialog named by its button (Filter, Sort); a count on a button is in its name (\"Filter, 2\"). Pagination is a navigation named \"Pages\" by default.",
   "announce": "Panel rows announce each move (\"Name moved to position 2 of 3\"). Pagination marks the current page with aria-current=\"page\".",
   "focus": "Tab order: the command bar as one stop, then the results, then Pagination. Every button shows the 2px focus ring in --plx-sys-focus-ring-color.",
   "contrast": "Buttons on the bar use the button roles; an active Filter’s tint uses the selected roles, defined for light and dark. The count uses --plx-sys-content-muted in the data font.",
   "motion": "Nothing to reduce."
  },
  "content": {
   "labels": "The buttons read Filter, Sort, Group, Columns and View and are never reworded: their state is the tint and the count badge. Fields keep the names the collection uses (\"Type\", \"Owner\", \"Date added\").",
   "actions": "Do not add an Apply button: filters and sorts apply as they change.",
   "errors": "Not applicable: there is no error text. For an empty result, say what matched nothing (\"Nothing matches these filters.\").",
   "localization": "Every word is in strings; the bar uses logical properties and mirrors in right-to-left. Format counts with the locale’s number format."
  }
 },
 "search-workflow": {
  "purpose": "Lets people find records by text from anywhere in an application, then refine the results without losing the shell. Search starts in the AppHeader and continues in the SearchWorkspace in the main region.",
  "anatomy": [
   "Header search button — the search icon furthest left of the header utilities, with the Ctrl K / Cmd K shortcut (required)",
   "Header search field — a SearchField on the accent header that opens to the left of the button, with Close search (required)",
   "Search workspace title row — the title (\"Search\", \"Search results\" or a saved search's name), the result count and Save search (required; Save search optional)",
   "Query field — a SearchField in a search landmark, applied as people type (required)",
   "Filters and active chips — a FilterBar, then removable Chips for set filters with Clear all (optional)",
   "Results bar — the results count, the Grid / Table switch and the Sort menu (optional controls)",
   "Results — the cards or the Platform data grid, or an inline EmptyState (required)"
  ],
  "behavior": {
   "pointer": "Clicking the header search icon opens the field; Close search closes it, and an empty field closes when focus leaves it. In the workspace, removing a chip clears that filter value and Clear all clears them all.",
   "keyboard": "Ctrl K (Cmd K) opens the header search from anywhere on the page; Escape closes it. Enter in the header field opens the Search workspace with the query kept. The workspace query applies as people type; Enter keeps focus in the field.",
   "focus": "Opening the header search moves focus into its field; closing with Escape or Close search returns focus to the search button. Opening the workspace does not move focus by itself.",
   "responsive": "The workspace title row and the active chips wrap onto more lines. The shell (header, navigation pane, inspector) stays, and only the main region changes.",
   "motion": "None of its own.",
   "loading": "The SearchWorkspace has no loading state of its own. A capability that fetches can use SearchField `loading` (a spinner in place of the icon) and Skeleton rows, as the suite's search screen does.",
   "error": "Not applicable: there is no invalid query. With 0 results the workspace says \"Nothing matches \"<query>\"\" (adding \"with these filters\" when filters are set) or \"Nothing matches these filters.\""
  },
  "a11y": {
   "name": "The header button is named \"Search\" (aria-expanded, aria-controls, aria-keyshortcuts \"Control+K Meta+K\"); the open field sits in role=\"search\". The workspace is a section named by its h2 title; its field is named \"Search <plural noun>\"; the chip group is \"Active filters\".",
   "announce": "The workspace count line (\"128 assets\") is aria-live polite, so result changes are announced. Each chip's remove button says \"Remove <filter>: <value>\".",
   "focus": "Tab order in the workspace: title row controls, the query field, the filters, the chips and Clear all, the view and sort controls, then the results. Controls show the 2px --plx-sys-focus-ring-color ring; the search field changes only its border color.",
   "contrast": "The header field uses the onAccent SearchField roles for the accent header; the count uses the muted content role. Both themes define these roles.",
   "motion": "Under prefers-reduced-motion every transition runs at zero duration."
  },
  "content": {
   "labels": "Keep the placeholder short and verb-led (\"Search…\", or a hint of what can be found). Set `noun` and `plural` to the capability's word for a result (\"asset\", \"assets\").",
   "actions": "Use \"Save search\" only where the capability keeps saved searches. Use the saved search's own name as the workspace title when it is reopened.",
   "errors": "Not applicable: empty results are an EmptyState, not an error. Repeat the query in the message and point to the filters.",
   "localization": "The count is formatted with toLocaleString('en-US') and the plural is noun + \"s\" unless `plural` is given; translations need a real plural form and the right locale. The empty-state sentence is built in code; translate it as a whole. Logical properties mirror the layout in right-to-left."
  }
 },
 "columns": {
  "purpose": "Puts two or three peer groups side by side at equal width inside a dialog or a page, optionally divided, such as the upload dialog's three steps.",
  "anatomy": [
   "Row — the `plx-columns` grid, 2 or 3 equal tracks (required)",
   "Column — each child is one column, usually a Stack (required)",
   "Divider — a 1px --plx-sys-border-divider line on the inline-start edge of every column after the first, with inset padding, when `divided` (optional)"
  ],
  "behavior": {
   "pointer": "None of its own: it is a static layout.",
   "keyboard": "None of its own: focus moves through the columns' content in source order with Tab.",
   "focus": "Not moved or trapped; reading and Tab order go column by column.",
   "responsive": "Columns stay side by side unless collapseBelow is set; then they stack into one column under 600px (medium) or 840px (wide), measured on the main region. Each track is minmax(0, 1fr), so content shrinks and wraps inside its column.",
   "motion": "None of its own.",
   "loading": "Not applicable: a layout has no loading state; the content inside shows its own.",
   "error": "Not applicable: a layout has no error state."
  },
  "a11y": {
   "name": "None: it is a plain div with no role. Give each column its own heading when the columns are separate steps or groups.",
   "announce": "Nothing beyond its content; it adds no role.",
   "focus": "Focus order follows the source: all of the first column, then the next. Keep the visual order and the source order the same.",
   "contrast": "The divider uses --plx-sys-border-divider, defined for light and dark; it separates and is not the only cue for grouping.",
   "motion": "None of its own."
  },
  "content": {
   "labels": "Give each column a short sentence-case heading; for steps, number them in the heading (\"1. Choose files\").",
   "actions": "Not applicable: it holds no actions of its own; put a dialog's actions in its footer, not in a column.",
   "errors": "Not applicable: it has no error text.",
   "localization": "The divider sits on the inline-start edge and the padding uses logical properties, so the row mirrors in right-to-left. Text expansion wraps inside each column."
  }
 },
 "application-shell": {
  "purpose": "Gives every Plenix application the same frame: the header across the top, the navigation pane, the main region and the inspector between them, and the footer across the bottom. Pages fill only the main region.",
  "anatomy": [
   "Skip link — \"Skip to main content\", the first Tab stop, shown on focus (required)",
   "Header — the AppHeader across the full width (required)",
   "Navigation area — a NavPane given as `sideNav` or handed in through SideNavPortal; resizable, collapses to a rail (optional)",
   "Main region — the main landmark (`mainId`, default \"main\") that fills the rest and holds PageContent (required)",
   "Inspector — a SidePanel given as `panel` (optional)",
   "Footer — the StatusBar across the full width (optional)"
  ],
  "behavior": {
   "pointer": "Dragging the splitter on the navigation's edge resizes it between its min and max width tokens, one grid line (4px) at a time, and it stays on the grid when let go; it is never wider than 90% of the window (--plx-sys-shell-pane-window-share). The width is remembered per monitor (named by its physical size; a stored size within 10px is the same monitor). A double-click on the edge folds the pane to its rail. The pane's Collapse and Expand buttons fold it to a rail and back; at Medium (600–839px) Expand opens it over the main region and a click on the scrim closes it; at Narrow it is a screen of its own, opened from the bottom bar or the parent row.",
   "keyboard": "Ctrl+[ (Cmd+[) collapses and expands the navigation from anywhere. The splitter is a separator: Arrow Left / Right move it by --plx-sys-shell-splitter-step, Home and End jump to the limits, Enter collapses. Escape closes the overlay navigation.",
   "focus": "The skip link moves focus to the main region (tabIndex -1, no outline of its own). The shell does not trap focus; the overlay navigation is a non-modal layer.",
   "responsive": "Below --plx-sys-shell-rail-below (840px, Medium) the navigation is a rail that opens as an overlay; below --plx-sys-shell-phone-below (600px, Narrow) a bottom navigation bar with the pane as its own screen; below --plx-sys-shell-inspector-overlay-below (1024px) the inspector collapses and opens over the main region, and below 600px (Narrow) it opens as a bottom sheet. Overlays stay between the header and the footer; the main region and PageContent scroll on their own.",
   "motion": "The splitter's line fades in on hover and focus with --plx-sys-motion-duration-fast; the shell has no other motion.",
   "loading": "Not applicable: the shell has no loading state; the page shows Loading in the main region.",
   "error": "Not applicable: the shell has no error state; pages show their own Notice or EmptyState."
  },
  "a11y": {
   "name": "The landmarks name themselves: banner (AppHeader), navigation (NavPane), main, complementary (SidePanel by its title) and contentinfo (StatusBar). The splitter is named by its `label`.",
   "announce": "The splitter announces as a vertical separator with aria-valuenow, aria-valuemin and aria-valuemax. Nothing else beyond the landmarks.",
   "focus": "Order: skip link, header, navigation, main, inspector, footer. The skip link has a --plx-sys-focus-ring-color border; the splitter shows a 2px line in that color on focus-visible.",
   "contrast": "The scrim uses --plx-sys-scrim at 50% opacity; the skip link uses --plx-sys-surface-overlay with --plx-sys-content-link. Both themes define these roles.",
   "motion": "Under prefers-reduced-motion the splitter transition runs at zero duration."
  },
  "content": {
   "labels": "Name the main region's page with one h1. Keep landmark labels short nouns (\"Settings sections\", \"Details\").",
   "actions": "Not applicable: the shell holds no actions; the AppHeader action and the page's own buttons do.",
   "errors": "Not applicable: the shell has no error text.",
   "localization": "The skip link text \"Skip to main content\" is fixed in code and needs translating. The layout uses logical properties; the splitter's arrow keys follow physical Left and Right, which should be checked in right-to-left."
  }
 },
 "secondary-pane": {
  "purpose": "Gives the main region a second, narrower column for navigation or tools, such as the asset browser's Files pane or a list of conversations, beside the content that it drives.",
  "anatomy": [
   "Pane — an aside on the page surface with a divider on its content side (required)",
   "Header row — icon, title, `actions` and, when `collapsible`, the Collapse button (required; icon and actions optional)",
   "Body — the content, which scrolls on its own (required)",
   "Resize edge — a PanelSplitter on the content-side edge when `resizable` (optional)",
   "Rail — when folded, a ToolRail with Expand and the `rail` items (optional, with `collapsible`)"
  ],
  "behavior": {
   "pointer": "Collapse folds the pane to a rail; Expand on the rail opens it again. Dragging the resize edge changes the width between the sm width and --plx-comp-secondary-pane-width-max; a double click on the edge folds the pane when it is collapsible.",
   "keyboard": "The resize edge is a separator: Arrow Left / Right change the width by --plx-sys-shell-splitter-step, Home and End jump to the smallest and largest width, Enter folds the pane when collapsible. The rail is a vertical toolbar: Arrow Up / Down, Home and End move between items.",
   "focus": "Focus is not moved when the pane folds or unfolds; the Collapse and Expand buttons replace each other. Nothing is trapped.",
   "responsive": "The pane takes its width token by window width: under 1440px sm 180px, md 220px, lg 280px; at 1440–1919px 220, 260, 320px; at 1920px and wider 260, 320, 400px. Dragged, it stops at --plx-comp-secondary-pane-width-max (400px) and at 90% of the window. It does not collapse on its own at narrow widths. Use `collapsible` where space is tight.",
   "motion": "None of its own; the splitter line fades with --plx-sys-motion-duration-fast.",
   "loading": "Not applicable: no loading state of its own; put a Skeleton or Loading in the body.",
   "error": "Not applicable: no error state of its own; show an EmptyState or Notice in the body."
  },
  "a11y": {
   "name": "The aside is named by `label`, or the `title` by default. Collapse and Expand are named \"Collapse <name>\" and \"Expand <name>\"; the edge is \"Resize <name>\".",
   "announce": "A complementary landmark; the resize edge announces as a vertical separator with its current, minimum and maximum width.",
   "focus": "Tab order: the header actions, Collapse, the body, then the resize edge. Buttons show the 2px --plx-sys-focus-ring-color ring; the edge shows a 2px line in that color.",
   "contrast": "The divider uses --plx-sys-border-default on --plx-sys-surface-default, defined for light and dark.",
   "motion": "Under prefers-reduced-motion the splitter transition runs at zero duration."
  },
  "content": {
   "labels": "Use a short noun in sentence case for the title (\"Files\", \"Messages\"); it also names the landmark and the Collapse, Expand and Resize controls.",
   "actions": "Keep header actions to one or two icon buttons with verb labels (\"New note\").",
   "errors": "Not applicable: it has no error text of its own.",
   "localization": "\"Collapse\", \"Expand\" and \"Resize\" are composed with the name in code. Borders and padding use logical properties and `side` maps to start or end, so the pane mirrors in right-to-left; the panel icons are fixed left/right glyphs."
  }
 },
 "inspector-region": {
  "purpose": "Shows the details of the chosen record beside the main region, so people can read or edit it without leaving the list. It is the SidePanel given to the AppShell's `panel`.",
  "anatomy": [
   "Panel — an aside at --plx-comp-side-panel-width-default (240px under 1440px, 320px at 1440–1919px, 400px at 1920px and wider) with an inset divider on its start edge (required)",
   "Collapse button — first in the header row, shown when `onOpenChange` is given (optional)",
   "Header — icon, the h2 title and `actions` (required; icon and actions optional)",
   "Body — the details, scrolling on its own (required)",
   "Footer — a row pinned to the bottom with the panel's actions (Save, Cancel) at --plx-comp-pane-footer-height (optional)",
   "Rail — when collapsed, a ToolRail with Expand panel (optional, with `onOpenChange`)"
  ],
  "behavior": {
   "pointer": "Collapse folds the panel to its rail; Expand panel opens it again. Below 1024px the open panel lies over the main region with a scrim, and a click on the scrim closes it.",
   "keyboard": "While the panel is an overlay, Escape closes it; as a layer, it closes only when it is the topmost one. Otherwise it handles no keys; the rail moves with Arrow Up / Down.",
   "focus": "Focus is not moved into the panel when it opens and is not trapped; the overlay is a non-modal layer. Focus is not restored when it closes.",
   "responsive": "Docked at its width token from 1024px up. Below --plx-sys-shell-inspector-overlay-below, an open docked panel collapses to its rail; Expand opens it as an overlay between the header and the footer, no wider than the region minus --plx-sys-space-layout-xl.",
   "motion": "None of its own.",
   "loading": "Not applicable: no loading state of its own; put Skeleton or Loading in the body.",
   "error": "Not applicable: no error state of its own; show a Notice or field errors in the body."
  },
  "a11y": {
   "name": "The aside is named by `label`, the title, or \"Panel\". The Collapse button is \"Collapse panel\" (or `collapseLabel`); the rail is \"<name> pane\" with \"Expand panel\".",
   "announce": "A complementary landmark with an h2 title. Nothing else is announced when it opens or closes.",
   "focus": "It comes after the main region in Tab order. Controls show the 2px --plx-sys-focus-ring-color ring.",
   "contrast": "It uses --plx-sys-surface-default with a --plx-sys-border-default edge; the overlay adds --plx-sys-elevation-overlay-shadow and the --plx-sys-scrim. The title uses --plx-sys-content-default and the icon --plx-sys-content-muted in both themes.",
   "motion": "None of its own."
  },
  "content": {
   "labels": "Use the record's name as the title, or a short noun (“Details”). Keep it short; a long name wraps onto more lines and is never cut.",
   "actions": "Put the record's commit actions in the footer at its end, the primary action last (“Cancel”, “Save”). Put lighter tools in the header `actions`.",
   "errors": "Not applicable: the panel has no error text; field errors follow the Field rules.",
   "localization": "\"Collapse panel\" and \"Expand panel\" are English defaults; pass `collapseLabel` for the Collapse button. The panel uses logical insets and sits on the inline-end side; the panel-right icons do not flip in right-to-left."
  }
 },
 "status-region": {
  "purpose": "Shows facts about the whole application, such as library size or sync, in a thin line at the foot of the window, where they are always in view and never in the way.",
  "anatomy": [
   "Bar — a footer on the inverse status-bar surface with a top edge, --plx-ref-size-40px tall (required)",
   "Start facts — the `start` group at the start of the line (required)",
   "End facts — the `end` group, pushed to the end of the line (optional)"
  ],
  "behavior": {
   "pointer": "None of its own: it is a display line.",
   "keyboard": "None: it holds facts, not controls.",
   "focus": "Not focusable; nothing in it should be.",
   "responsive": "It spans the full width under both side areas. The start group can shrink; the line does not wrap, so keep facts short.",
   "motion": "None of its own.",
   "loading": "Not applicable: no loading state; show the fact once it is known, or a short text such as \"Syncing…\".",
   "error": "Not applicable: no error state; report failures with a Notice or a Toast, not in the bar."
  },
  "a11y": {
   "name": "It is a footer, so it is the contentinfo landmark at the page level; it has no label of its own.",
   "announce": "Nothing beyond its role and text; changes are not announced. Do not use it for messages people must hear.",
   "focus": "Not in the Tab order.",
   "contrast": "It uses --plx-sys-status-bar-background (gray 900 in light, black in dark) with --plx-sys-status-bar-content (gray 300) in both themes; the edge is gray 300 in light and gray 700 in dark. Keep text at that content role.",
   "motion": "None of its own."
  },
  "content": {
   "labels": "Write facts as short noun phrases with their value (\"12,480 assets\", \"Synced 2 min ago\"). Use Reddit Mono only for technical values such as sizes or IDs.",
   "actions": "Not applicable: do not put actions in the status bar.",
   "errors": "Not applicable: it shows no errors.",
   "localization": "Format numbers, sizes and times for the locale. Padding and the end group's margin use logical properties, so the start and end swap in right-to-left."
  }
 },
 "record-page": {
  "purpose": "Gives a record or page a clear title block (title, description, meta and actions) over its body, with an optional aside of facts or related items.",
  "anatomy": [
   "Header — RecordPage.Header: the title block, also used alone (required)",
   "Media — a thumbnail, avatar or icon before the text (optional)",
   "Title — the heading at `headingLevel` (default h1), 20px at lg or 15px at md (required)",
   "Description and meta — a paragraph under the title, then a wrapping line of badges or technical values (optional)",
   "Actions — controls at the end of the header (optional)",
   "Body — the record's panels and tables, stacked (required)",
   "Aside — a column on the end side at the inspector width (optional)"
  ],
  "behavior": {
   "pointer": "None of its own; its actions and body controls behave as themselves.",
   "keyboard": "None of its own; Tab reaches the header actions, then the body, then the aside.",
   "focus": "Not moved or trapped.",
   "responsive": "The title wraps anywhere (overflow-wrap anywhere) rather than overflow, and the meta wraps. The header actions do not shrink and the aside keeps --plx-sys-panel-inspector-width beside the body, so on narrow screens prefer no aside. An EntityHeader has two columns with a divider: the divider starts at 63% of the width and moves toward the end when the title needs the room; the aside keeps at least 220px (--plx-comp-entity-header-aside-min-width), and past that the title wraps (a long word breaks inside the card) and the actions fold into More. Under 640px of the header's own width the aside moves under the main column; the tiles wrap.",
   "motion": "None of its own.",
   "loading": "Not applicable: no loading state of its own; show Skeleton or Loading in the body.",
   "error": "Not applicable: no error state; show a Notice in the body when the record cannot load."
  },
  "a11y": {
   "name": "The title is a real heading; set `headingLevel` so each page has one h1 and panels follow it. The aside is a complementary landmark without a label; name it if a page has more than one.",
   "announce": "Nothing beyond the heading and its content.",
   "focus": "Order: header actions, body, aside. Controls show the 2px --plx-sys-focus-ring-color ring.",
   "contrast": "The title uses --plx-sys-content-default and the description --plx-sys-content-muted. The card surface uses --plx-sys-surface-default with a --plx-sys-header-card-tint gradient and --plx-sys-header-card-media-content for the media, defined in both themes.",
   "motion": "None of its own."
  },
  "content": {
   "labels": "Use the record's own name as the title. Keep the description to one or two sentences in sentence case. Use Reddit Mono only for technical values in the meta. In an EntityHeader fact, the dates, times and numbers of a value are set in the data font and its words in the normal font on their own; data: true sets the whole value in the data font, data: false none of it. The bold dates and numbers of a Streamlined subtitle take the data font too.",
   "actions": "Use one primary action at most, with a verb label (\"Edit\", \"Share\"). Put less frequent actions in a Menu.",
   "errors": "Not applicable: it has no error text.",
   "localization": "The header and the aside use logical properties, so actions and the aside move to the start side in right-to-left."
  }
 },
 "settings-page": {
  "purpose": "Lets people find and change settings one at a time: sections of rows with a label, a description and the control, with the sections listed in a navigation pane.",
  "anatomy": [
   "Frame — SettingsLayout: the navigation beside the content (required)",
   "Navigation — `nav` (a NavList) drawn in a NavPane (optional)",
   "Section — SettingsSection: always a card with its title as an h2 (sentence case, the level 2 heading size), an optional description and the rows; static, or collapsible (required)",
   "Collapse toggle — on a collapsible section, the whole header row is one button inside the h2, with a chevron at the end that points down when open (optional)",
   "Row — SettingsRow: label and description at the start, the control at the end, divided from the next (required)",
   "Actions — the section's buttons in an ActionBar under its rows (optional)"
  ],
  "behavior": {
   "pointer": "A click anywhere on a collapsible section's header opens or closes it; each control works as itself.",
   "keyboard": "Tab moves through the navigation, then each section: a collapsible header is one stop, and Enter or Space opens or closes it; then each row's control in order.",
   "focus": "Not moved or trapped. Choosing a section in the navigation is the page's job.",
   "responsive": "It responds to its own width: below 37.5rem, the navigation stacks above the content with a bottom border, the side padding shrinks, and inline Fields put their label above the control. The content is at most --plx-ref-size-900px wide and scrolls on its own.",
   "motion": "The chevron turns when a collapsible section opens or closes (--plx-comp-settings-section-chevron-duration); with reduced motion it turns at once.",
   "loading": "Not applicable: no loading state of its own; the page shows Loading or Skeleton rows.",
   "error": "Not applicable here: errors belong to the controls; use Field rows (`layout` inline or row) for their error text."
  },
  "a11y": {
   "name": "A section is a section landmark named by its title (aria-labelledby); a collapsible section's header button carries aria-expanded and aria-controls (its rows) and is described by the description. A row's label is a label element for its control when `htmlFor` is given; otherwise give the control the row's label as its accessible name.",
   "announce": "Nothing beyond the section names, the labels and each control's own role and state.",
   "focus": "Order: navigation, then the rows top to bottom, then the section actions. Controls show the 2px --plx-sys-focus-ring-color ring; fields change only their border color.",
   "contrast": "Titles and labels use --plx-sys-content-default; descriptions --plx-sys-content-muted; the card border --plx-sys-border-default; row dividers --plx-sys-border-divider. All are defined for light and dark.",
   "motion": "None of its own."
  },
  "content": {
   "labels": "Write row labels as short nouns in sentence case (\"Date format\"), with the effect in one sentence in the description. Section titles are short nouns in sentence case, not uppercased.",
   "actions": "Use section actions only for a group that saves together (\"Save\", \"Cancel\"); otherwise a row's control applies on change.",
   "errors": "Say what is wrong and how to fix it, next to the control, through its Field.",
   "localization": "Rows use logical properties, so the control moves to the start side in right-to-left. Longer labels wrap; the container query stacks the frame on narrow widths."
  }
 },
 "listing-page": {
  "purpose": "Shows the records of one kind as a list, one per row, with the title and page actions above and facts in the footer.",
  "anatomy": [
   "Title row — the page title and the page’s actions (required)",
   "Command bar — the collection’s commands, search, Filter, Sort and View over the list (optional)",
   "Record list — one row per record in the Platform data grid; with none, an EmptyState (“No records yet”) (required)",
   "Status footer — facts about the list, such as the count and the sync state (optional)",
   "Inspector — a SidePanel with the open record’s details (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a row opens that record in the inspector and marks it current; clicking it again closes the inspector.",
   "keyboard": "The title row’s actions are buttons reached with Tab; the rows and their controls follow the data grid’s keys. Escape closes the inspector when it is over the list.",
   "focus": "Opening a record keeps focus on its row; nothing moves it into the inspector.",
   "responsive": "The page content scrolls on its own and the list follows the data grid’s scrolling. Below 1024px the inspector opens over the list.",
   "motion": "None of its own.",
   "loading": "No loading state in the template: show Skeleton rows in place of the records while they load.",
   "error": "No error state in the template: show a Notice above the list when the records cannot load."
  },
  "a11y": {
   "name": "The page has one h1, its title; the data grid is named by its label.",
   "announce": "The open row is the data grid’s selected row; nothing else is announced by the template.",
   "focus": "Order: the title row’s actions, the command bar, the records, then the inspector. Controls show the 2px --plx-sys-focus-ring-color ring.",
   "contrast": "Rows use the data grid’s line roles; all text uses the theme’s content roles in light and dark.",
   "motion": "Nothing to reduce."
  },
  "content": {
   "labels": "Title the page with the plural noun (“Files”, “Tasks”). Column headers are short nouns in sentence case.",
   "actions": "Page actions are a verb with the noun (“Upload”, “Add task”); at most one is primary.",
   "errors": "When records cannot load, say so and what to do (“Files could not load. Try again.”).",
   "localization": "Format sizes and dates for the locale and show them in Reddit Mono. The layout uses logical properties and mirrors in right-to-left."
  }
 },
 "content-template": {
  "purpose": "A page of cards with a filter row for managing a collection of content.",
  "anatomy": [
   "Title row — the h1 title and the primary action (required)",
   "Filter row — selectable Chips (or a FilterBar) that narrow the cards (optional)",
   "Card grid — a ContentGrid list of Cards; the minimum card width comes from `size` (required)",
   "Inspector — a SidePanel with the open item's details (optional)"
  ],
  "behavior": {
   "pointer": "Clicking a filter chip shows only that group's cards. Clicking a card opens it in the SidePanel and marks it selected; clicking it again closes the panel (Bookmarks).",
   "keyboard": "Chips and card openers are reached with Tab and activate with Enter or Space as buttons. Escape closes the panel when it is an overlay.",
   "focus": "Focus stays on the card when the panel opens; it is not moved.",
   "responsive": "ContentGrid fills the width with as many columns as fit at the card minimum (100, 140, 180 or 240px); the gap follows --plx-sys-card-grid-gap by density. The chip row wraps.",
   "motion": "The page content rises into place once with plx-motion-enter (motion-fade-up, --plx-sys-motion-duration-fast).",
   "loading": "No loading state in the template; show Skeleton cards while items load.",
   "error": "No error state in the template; show a Notice when items cannot load, and an EmptyState when a filter leaves none."
  },
  "a11y": {
   "name": "The grid is a list named by its `label` (\"Bookmarks\"); each card is a list item named by its title.",
   "announce": "The list announces its item count; a selected chip and a selected card announce their selected state. Filtering is not announced.",
   "focus": "Order: title row action, filter chips, cards row by row, then the inspector. Cards show the 2px --plx-sys-focus-ring-color outline.",
   "contrast": "Cards use the surface and border roles; selected states use the selected roles, defined for light and dark.",
   "motion": "Under prefers-reduced-motion the entry animation runs at zero duration."
  },
  "content": {
   "labels": "Title the page with the plural noun. Card titles are the item's own name; keep meta to one line (a URL, a date in Reddit Mono).",
   "actions": "Use one primary action (\"Add\"); put item actions in the inspector, not on every card.",
   "errors": "When items cannot load, say so in one sentence and offer a retry.",
   "localization": "Card widths are minimums, so longer text wraps inside cards. The grid and chips use logical properties and flow right-to-left."
  }
 },
 "master-detail-workspace": {
  "purpose": "Lets people move between the records of one list and read or edit one at a time: the list in a SecondaryPane on the left of the main region, the selected record filling the rest.",
  "anatomy": [
   "List pane — a SecondaryPane (md or lg width) with the list's title and a New action (required)",
   "Rows — RowButtons with the record's name, preview and technical values, the selected one marked (required)",
   "Detail — PageContent or a Stack with the selected record: a heading or RecordPage.Header and its content (required)",
   "Empty detail — an EmptyState (\"Select a note to read\") when nothing is selected (required)"
  ],
  "behavior": {
   "pointer": "Clicking a row selects it and shows that record in the detail area.",
   "keyboard": "Each row is a button reached with Tab and chosen with Enter or Space. The pane's own resize edge and Collapse follow SecondaryPane when enabled.",
   "focus": "Choosing a row does not move focus into the detail; focus stays on the row.",
   "responsive": "The list pane keeps its width and its body scrolls on its own; the detail scrolls beside it. The pane does not collapse by itself on narrow screens.",
   "motion": "The Notes detail rises into place with plx-motion-enter when a record opens.",
   "loading": "No loading state in the template; show Skeleton rows in the pane and Loading in the detail.",
   "error": "No error state in the template; show a Notice in the detail when a record cannot load."
  },
  "a11y": {
   "name": "The pane is a complementary landmark named by its title (\"Messages\", \"Notes\"); icon-only actions carry a label (\"New note\").",
   "announce": "Rows announce their selected state; unread counts carry their own label (\"3 unread\").",
   "focus": "Order: pane actions, the rows, then the detail. Rows and buttons show the 2px --plx-sys-focus-ring-color ring.",
   "contrast": "Rows use the RowButton selected roles; previews use the secondary content role; all are defined in both themes.",
   "motion": "Under prefers-reduced-motion the entry animation runs at zero duration."
  },
  "content": {
   "labels": "Title the pane with the plural noun. Keep a row to the name, one line of preview and one line of technical values (date, folder in Reddit Mono); truncate the rest.",
   "actions": "Name the add action with a verb and the noun (\"New note\", \"New contact\").",
   "errors": "When a record cannot load, say which and offer a retry in the detail.",
   "localization": "Truncated previews hide more of longer languages. The pane sits on the start side and mirrors in right-to-left. Format dates for the locale."
  }
 },
 "dam-template": {
  "purpose": "Shows how a data-management capability is put together in Plenix, so a new one starts from a working, consistent screen instead of a blank page.",
  "anatomy": [
   "Application header — AppHeader with search, applications and account (required)",
   "Navigation pane — NavPane with categories, collections and saved searches; collapses to a ToolRail (required)",
   "Main region — DataToolbar, ContentGrid or Table, and Pagination; SearchWorkspace for advanced search (required)",
   "Inspector — SidePanel with the selected item's details and Save and Cancel (optional)",
   "Status bar — StatusBar across the bottom (required)"
  ],
  "behavior": {
   "pointer": "Selecting an item in the grid or table shows it in the inspector. The navigation pane resizes with its splitter and collapses with its own button.",
   "keyboard": "A skip link is the first Tab stop. Ctrl+[ collapses the navigation to a rail. Each component keeps its own keys.",
   "focus": "Focus moves with Tab through header, navigation, main region and inspector. Overlay drawers on narrow screens close with Escape through the layer utility.",
   "responsive": "From AppShell: below 840px the navigation becomes a rail and opens over the main region, below 600px a bottom navigation bar; the inspector collapses to a rail. The main region scrolls itself.",
   "motion": "None of its own; the shell and components use the motion tokens.",
   "loading": "No template-level loading state; each region shows Skeleton or Spinner while it fetches.",
   "error": "No template-level error state; forms in the inspector show field errors and the page shows a Notice for failures."
  },
  "a11y": {
   "name": "Landmarks come from AppShell (header, navigation, main, complementary, footer). Panes are named by their headings.",
   "announce": "Nothing beyond each region's landmark and its components' roles; the search count is a polite live region.",
   "focus": "The skip link targets the main region (mainId). Every control shows the focus ring in --plx-sys-focus-ring-color.",
   "contrast": "All surfaces, text and borders come from --plx-sys- roles that switch between light and dark themes.",
   "motion": "The global reduced-motion rule in system/motion.css stops animations and transitions."
  },
  "content": {
   "labels": "Use sentence case nouns for navigation items and column headers. Keep inspector field labels short.",
   "actions": "Use verbs: Save, Cancel, Upload, Download. One primary action per region.",
   "errors": "Say what went wrong and how to fix it, next to the field or in a Notice.",
   "localization": "The shell uses logical properties, so it mirrors for right-to-left. Leave room for longer labels in the toolbar and navigation."
  },
  "avoid": [
   "A workspace that brings several applications together: use the Dashboard template",
   "One record's own page: use Object / record page"
  ]
 },
 "typing-indicator": {
  "purpose": "Gives people a live conversation in the product: they read the thread, see when the other side is writing, and reply without leaving the page.",
  "anatomy": [
   "Header — Chat.Header with title, optional meta line, optional Avatar and actions (optional)",
   "Thread — Chat.Thread, a scrolling log of messages, oldest first (required)",
   "Message — Chat.Message bubble with author, body and a footer line (\"Sent <time>\", the read time and the status); mine on the end side, in the outgoing fill and outline (required)",
   "Avatar — the sender's photo or initials on the bubble's top corner, crossing the border, in the bubble's own outline color; start side for theirs, end side for yours, mirrored in right to left (optional)",
   "Run — Chat.Group, one sender's messages in a row with the photo and the name once (optional)",
   "Date line — Chat.Divider, a date or the New messages line above the first unread message (optional)",
   "Attachments — Chat.Attachments and Chat.Attachment: a picture (opens the viewer; a card when it does not load), a row of pictures, a file card with a bordered icon and Download (optional)",
   "Voice message — Chat.Voice: Play and Pause, a bar waveform with the played part in the accent color, the time and the speed (optional)",
   "Typing dots — Chat.Typing, three pulsing dots with a hidden label (optional)",
   "Composer — Chat.Composer, one outlined box (the input's 1px border and radius; the focus turns the border) holding the files waiting as cards, a text area with no border of its own that starts at two lines and grows, and a row of tools, each icon-only control a bordered button: Attach and Image (with `onAttach`) and Emoji at the start; Listening, the microphone (where the browser has speech recognition), the record control (a disabled placeholder until voice messages are built, issue 654) and Send at the end (required)"
  ],
  "behavior": {
   "pointer": "Clicking Send sends the message and the ready files. Send is disabled while there is nothing to send, while a file uploads or while the composer is disabled. Attach and Image open the file chooser; a pasted or dropped file is attached too. The microphone dictates into the box with \"Listening…\" and Stop; Stop, the microphone again, Send or typing in the box ends it, and typing keeps the text as typed. The thread scrolls on its own.",
   "keyboard": "In the composer, Enter sends and Shift+Enter starts a new line (`sendOn=\"mod-enter\"` sends with Ctrl or Command+Enter); Enter while composing in an input method does not send. Everything else is reached with Tab as native elements.",
   "focus": "Focus stays in the composer after sending; the code does not move it. Nothing is trapped.",
   "responsive": "Messages take at most 80% of the thread width; long words break (overflow-wrap anywhere). The header text truncates within its space (min-inline-size 0).",
   "motion": "The typing dots pulse one after another (motion-pulse, --plx-sys-motion-duration-loop-base, staggered by --plx-sys-motion-delay-stagger).",
   "loading": "Not applicable: the typing dots show the other side is writing; loading older messages is up to the application.",
   "error": "A file that failed shows an error badge with Retry; a blocked or stopped microphone says so under the text area. A failed send is the application's: it shows a Notice or Toast."
  },
  "a11y": {
   "name": "The thread uses `label` (default \"Conversation\"). The composer field uses `label` (default \"Message\"). The typing dots use `label` (default \"Typing\") as hidden text.",
   "announce": "The thread is role=\"log\" with aria-live polite, so new messages are announced. A status with no visible word is named for assistive technology. A picture is a button named \"Open image\"; Download is named with the file; the voice seek bar is a range slider named \"Voice message position\". Your own messages are announced with a hidden \"You\". The typing dots are role=\"status\", so their label is announced. \"Listening…\" and a microphone problem are announced once each.",
   "focus": "Focus order: header actions, thread content, composer field, the tools (Attach, Image, Emoji, the microphone), Send. The field and Send show their own focus ring, from the focus ring tokens.",
   "contrast": "Messages use the message color roles (--plx-sys-message-*): theirs in the incoming fill and outline, yours in the outgoing ones, the text in the message text color; each has its own dark value (in dark mode both are grays, yours the lighter). The bubble outline separates the bubble from the thread in light and dark. The footer is the smallest text, in the secondary gray: check it on both themes. A status is never color alone: the word and the icon say it.",
   "motion": "With reduced motion the dots stand still (the global rule in system/motion.css)."
  },
  "content": {
   "labels": "Header title is the person or group name. Typing label names who is writing (\"Maya is typing\"). Placeholder default is \"Write a message\".",
   "actions": "Keep \"Send\" as the action; change it only through `sendLabel`.",
   "errors": "Say the message was not sent and offer to try again; keep the text in the composer.",
   "localization": "Pass `time` as shown in the person's locale and `dateTime` as a machine date. Bubbles use logical properties, so mine sit on the end side in right-to-left too."
  }
 },
 "focus-ring": {
  "purpose": "Shows keyboard users exactly where they are on the page, so they can operate everything without a mouse.",
  "anatomy": [
   "Ring — a solid outline in --plx-sys-focus-ring-color (required)",
   "Width — a 2px border-width token, such as --plx-comp-button-focus-ring-width (required)",
   "Offset — --plx-sys-focus-ring-offset (2px) between the element and the ring (required)",
   "Field variant — a focused field shows no outer ring; only its border changes to the focus color (required)"
  ],
  "behavior": {
   "pointer": "A mouse click shows no ring: the ring appears only with :focus-visible.",
   "keyboard": "Tab and arrow-key focus show the ring. Composite widgets (toolbars, menus, tabs, trees, segmented controls) use roving focus: one Tab stop, arrow keys inside.",
   "focus": "The ring follows focus and never moves it. It follows the element's corners: its radius is the element's radius plus 2px.",
   "responsive": "Not applicable: the ring does not change with width.",
   "motion": "None of its own; the ring appears at once.",
   "loading": "Not applicable: a visual indicator, not a data surface.",
   "error": "An invalid field shows the danger border, not the ring; focus changes only its border color."
  },
  "a11y": {
   "name": "Not applicable: the ring is not announced.",
   "announce": "Nothing; it is a visual indicator for WCAG 2.4.7 Focus Visible.",
   "focus": "Each component defines its own :focus-visible rule with the focus ring tokens; there is no global rule in base.css. Never remove the outline without this replacement.",
   "contrast": "--plx-sys-focus-ring-color points to --plx-ref-color-blue-400 in both the light and dark Plenix theme; the 2px offset keeps it clear of the element's own fill.",
   "motion": "Nothing to reduce."
  },
  "content": {
   "labels": "Not applicable: no text.",
   "actions": "Not applicable: no actions.",
   "errors": "Not applicable: no error text.",
   "localization": "Not applicable: the outline is direction-neutral."
  }
 },
 "visually-hidden": {
  "purpose": "Gives screen reader users text that sighted people do not need, such as the name of an icon-only button or the rest of a short label.",
  "anatomy": [
   "Element — a span by default, or the element named by `as` (required)",
   "Hidden text — the children, clipped out of view (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: it is not visible and takes no clicks.",
   "keyboard": "Not applicable: it is not focusable. Do not put focusable content inside it.",
   "focus": "It never receives focus and does not change focus.",
   "responsive": "It takes no room at any width: a 1px box (--plx-comp-visually-hidden-size), absolutely positioned, clipped (clip-path inset 50%) and pulled back by its own size, so texts appended to the end of the page (the announcer regions, the drag-and-drop instructions) never make the page taller than the window or give it a scroll bar. It stays where it sits, so a hidden input still scrolls its control into view when focused.",
   "motion": "None of its own.",
   "loading": "Not applicable: static text.",
   "error": "Not applicable: static text."
  },
  "a11y": {
   "name": "Its text becomes part of its parent's accessible name, for example the name of an icon-only button.",
   "announce": "Screen readers read its text in place. Put it inside a role=\"status\" region when it must be announced on change (Chat.Typing does this).",
   "focus": "Never focusable; it is not a skip link.",
   "contrast": "Not applicable: nothing is drawn.",
   "motion": "Nothing to reduce."
  },
  "content": {
   "labels": "Write the words a sighted person would get from the icon or layout (\"Delete\", \"You\"). Keep it short and do not repeat visible text.",
   "actions": "Not applicable: it holds text, not actions.",
   "errors": "Not applicable: show errors visibly, not only to screen readers.",
   "localization": "Translate it like any visible string; it is often forgotten because it is not seen."
  }
 },
 "overlay-manager": {
  "purpose": "Makes every overlay behave the same: Escape closes the one on top, and modal ones keep keyboard focus inside and give it back when they close.",
  "anatomy": [
   "Layer stack — a shared list of open layers; the last is the top (required)",
   "Escape handler — `onEscape`, run only for the top layer (optional)",
   "Modal trap — Tab and Shift+Tab cycle within the layer when `modal` is true (optional)",
   "Initial focus — `initialFocus`, a ref or a function returning the element; else the first focusable element, else the layer root (optional)",
   "Scroll lock — a modal layer (a dialog) takes the shared scroll lock (lockScroll), which sets data-plx-scroll-lock=\"locked\" on the html element while open; useScrollLock does the same for a component (optional)"
  ],
  "behavior": {
   "pointer": "None of its own; outside clicks are handled by each overlay.",
   "keyboard": "Escape runs the top layer's onEscape only, so a menu inside a dialog closes first. In a modal layer Tab wraps from last to first and Shift+Tab from first to last; focus outside the layer is pulled back in.",
   "focus": "A modal layer moves focus in when it opens and returns it to the element that was focused before it opened, if that element is still in the page.",
   "responsive": "Not applicable: behavior only.",
   "motion": "None of its own.",
   "loading": "Not applicable: behavior only.",
   "error": "Not applicable: behavior only."
  },
  "a11y": {
   "name": "Not applicable: the overlay component names itself (for example Dialog's title).",
   "announce": "Nothing; roles such as dialog or menu come from the overlay component.",
   "focus": "Implements the WAI-ARIA modal dialog focus rules: focus moves in, is contained, and is restored. Focusable means enabled, visible, and not inside [hidden].",
   "contrast": "Not applicable: nothing is drawn.",
   "motion": "Not applicable: no animation."
  },
  "content": {
   "labels": "Not applicable: no text.",
   "actions": "Not applicable: no actions.",
   "errors": "Not applicable: no error text.",
   "localization": "Not applicable: no text."
  }
 },
 "react": {
  "purpose": "Gives every Plenix application the same components from one public package, so behavior and look stay identical across applications.",
  "anatomy": [
   "Component folder — a .jsx and a kebab-case .css under platform/components or platform/patterns (required)",
   "Header comment — Summary, Usage, Props, Behavior and Notes; it is the component's documentation (required)",
   "Export — a line in platform/index.js; only exports are public (required)",
   "Build — node build-app.js writes platform/dist/platform.js (window.Plenix) and each application's app.js (required)",
   "Inventory record — the item's page in the design system (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: an implementation standard.",
   "keyboard": "Not applicable: each component documents its keys in its header comment.",
   "focus": "Not applicable: overlays share focus behavior through utils/layer.ts.",
   "responsive": "Not applicable: components read breakpoints from tokens with below() and useMedia.",
   "motion": "Not applicable: motion is in CSS with motion tokens.",
   "loading": "Not applicable: an implementation standard.",
   "error": "Not applicable: build and lint errors come from build-app.js, check-system.js, check-style.js and Stylelint."
  },
  "a11y": {
   "name": "Each component takes its name from props such as `label`; document them in the header comment.",
   "announce": "Each component sets its roles and live regions in its JSX.",
   "focus": "Overlays use useLayer; composite widgets use roving focus.",
   "contrast": "Components take colors from --plx-sys- and --plx-comp- roles only.",
   "motion": "The global reduced-motion rule in system/motion.css covers every component."
  },
  "content": {
   "labels": "Write header comments in plain American English; name props for what they mean.",
   "actions": "Not applicable: an implementation standard.",
   "errors": "Not applicable: an implementation standard.",
   "localization": "Components take their visible strings as props with English defaults, so applications can translate them."
  }
 },
 "css-architecture": {
  "purpose": "Keeps every application drawn from one stylesheet and one set of tokens, so a change in one place reaches every screen and nothing drifts.",
  "anatomy": [
   "platform.css — the only stylesheet applications load (required)",
   "Tokens — reference, semantic and component token stylesheets generated from tokens/*.tokens.json (required)",
   "System layers — base, spacing, radius, motion, density, interaction, table, scrolling (required)",
   "Component and pattern stylesheets — one per folder, imported by platform.css (required)",
   "Utilities — system/utilities.css, imported last; plx-u-<property>-<token> for layout only (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: an implementation standard.",
   "keyboard": "Not applicable: an implementation standard.",
   "focus": "Focus styles live in each component's stylesheet with the focus ring tokens.",
   "responsive": "Use logical properties (inline/block) and breakpoint tokens; system/interaction.css sets pointer, touch and mobile environments.",
   "motion": "Motion comes from motion tokens; system/motion.css holds the reduced-motion rule.",
   "loading": "Not applicable: an implementation standard.",
   "error": "Stylelint fails on raw hex, raw values, palette colors and non-plx classes in stylesheets; check-style.js on unknown tokens and inline styles; check-system.js on missing imports."
  },
  "a11y": {
   "name": "Not applicable: an implementation standard.",
   "announce": "Not applicable: an implementation standard.",
   "focus": "Do not write outline: none without a focus-visible replacement.",
   "contrast": "Colors come only from theme roles (--plx-sys-, --plx-comp-), never the palette, so light and dark stay readable.",
   "motion": "Transitions and animations use tokens and are stopped by the reduced-motion rule."
  },
  "content": {
   "labels": "Name classes plx-block, plx-block__element, plx-block--modifier and is-state. Use American spelling in class and token names.",
   "actions": "Not applicable: an implementation standard.",
   "errors": "Not applicable: an implementation standard.",
   "localization": "Use logical properties so layouts mirror for right-to-left."
  }
 },
 "state-management": {
  "purpose": "Keeps who is signed in, their notifications and their pinned applications in one place, so every application shows the same person and the same state.",
  "anatomy": [
   "SessionProvider — wraps the application root or a React island once (required)",
   "useSession() — returns account, notifications, setNotifications, pinnedApps and setPinnedApps (required)",
   "DEMO_SESSION — the sample session used until the back end supplies one (optional)",
   "PLENIX_APPS — the list of Plenix applications, with appById and appHref (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: state only.",
   "keyboard": "Not applicable: state only.",
   "focus": "Not applicable: state only.",
   "responsive": "Not applicable: state only.",
   "motion": "Not applicable: state only.",
   "loading": "No loading state: without a session the demo session is used.",
   "error": "If localStorage is not available the pins are kept for the visit only; no error is shown."
  },
  "a11y": {
   "name": "Not applicable: no UI.",
   "announce": "Not applicable: no UI.",
   "focus": "Not applicable: no UI.",
   "contrast": "Not applicable: no UI.",
   "motion": "Not applicable: no UI."
  },
  "content": {
   "labels": "Not applicable: no text of its own.",
   "actions": "Not applicable: no actions.",
   "errors": "Not applicable: no error text.",
   "localization": "Notification text and times arrive as strings; supply them localized from the back end."
  }
 },
 "testing": {
  "purpose": "Catches any change that breaks the system's rules before it is logged, so both applications keep to one Platform.",
  "anatomy": [
   "System and style lint — node check-system.js, node check-style.js and npm run lint:css in Plenix/ (required)",
   "Rules — tokens, hex, font-size, classes, imports, legacy, embedded, icon-size, defined, inline-style, generated, palette, raw-value, palette-class, audit, media (required)",
   "Runtime audit — platform/dev/style-audit.js, loaded by every page, rejects inline styles at run time (required)",
   "Browser checks — the suites for both applications, the radius audit and the icon-grid audit (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: a command.",
   "keyboard": "Not applicable: a command.",
   "focus": "Not applicable: a command.",
   "responsive": "Not applicable: a command.",
   "motion": "Not applicable: a command.",
   "loading": "Not applicable: the command runs once and exits.",
   "error": "It exits with 1 and lists every finding when a rule is broken, the first 25 per rule; --all lists every finding."
  },
  "a11y": {
   "name": "Not applicable: no UI.",
   "announce": "Not applicable: no UI.",
   "focus": "Not applicable: no UI.",
   "contrast": "The palette rule keeps colors on theme roles, which is what keeps contrast right in both themes.",
   "motion": "Not applicable: no UI."
  },
  "content": {
   "labels": "Findings name the rule, the file and line, and the text.",
   "actions": "Fix the cause; do not skip a failing rule.",
   "errors": "Not applicable: the rule names are fixed.",
   "localization": "Not applicable: a developer tool."
  }
 },
 "component-lifecycle": {
  "purpose": "Tells people whether an item is safe to build with, still changing, or on its way out.",
  "anatomy": [
   "Status — Proposed, Experimental, Active, Mature, Legacy, Deprecated or Archived (required)",
   "Owner — who decides on the item (required)",
   "Review date — when the record was last reviewed (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: a governance rule.",
   "keyboard": "Not applicable: a governance rule.",
   "focus": "Not applicable: a governance rule.",
   "responsive": "Not applicable: a governance rule.",
   "motion": "Not applicable: a governance rule.",
   "loading": "Not applicable: a governance rule.",
   "error": "Not applicable: a governance rule."
  },
  "a11y": {
   "name": "Not applicable: a governance rule.",
   "announce": "Not applicable: a governance rule.",
   "focus": "Not applicable: a governance rule.",
   "contrast": "Not applicable: a governance rule.",
   "motion": "Not applicable: a governance rule."
  },
  "content": {
   "labels": "Use the seven status names exactly as written.",
   "actions": "When deprecating, name the replacement and the removal plan.",
   "errors": "Not applicable: a governance rule.",
   "localization": "Not applicable: internal documentation."
  },
  "avoid": [
   "An app's own screens: the lifecycle is for Platform items, not the pages of an app"
  ]
 },
 "contribution-model": {
  "purpose": "Keeps the inventory free of duplicates, so each problem has one canonical item and people find it.",
  "anatomy": [
   "Search — check canonical names and aliases first (required)",
   "Classify — new component, variant, composite, pattern or implementation detail (required)",
   "Home — one canonical place, aliases and source mappings (required)",
   "Requirements — accessibility and responsive behavior, related items (required)",
   "Ownership — a lifecycle status and an owner (required)"
  ],
  "behavior": {
   "pointer": "Not applicable: a governance rule.",
   "keyboard": "Not applicable: a governance rule.",
   "focus": "Not applicable: a governance rule.",
   "responsive": "Not applicable: a governance rule.",
   "motion": "Not applicable: a governance rule.",
   "loading": "Not applicable: a governance rule.",
   "error": "Not applicable: a governance rule."
  },
  "a11y": {
   "name": "Not applicable: a governance rule.",
   "announce": "Not applicable: a governance rule.",
   "focus": "Not applicable: a governance rule.",
   "contrast": "Not applicable: a governance rule.",
   "motion": "Not applicable: a governance rule."
  },
  "content": {
   "labels": "Use the canonical naming rules in STANDARD.md; put other names in aliases.",
   "actions": "Not applicable: a governance rule.",
   "errors": "Not applicable: a governance rule.",
   "localization": "Not applicable: internal documentation."
  },
  "avoid": [
   "A change of a value only (a color, radius or density): edit its token, do not add an item"
  ]
 },
 "changelog": {
  "purpose": "Records what changed, why and how it was proven, so anyone can trace a change back to its request.",
  "anatomy": [
   "Batch entry — a numbered batch file in Plenix - DAM/audit/batches/ (required)",
   "Request — the owner's request or approval (required)",
   "Change — what changed (required)",
   "Verification — how it was verified (required)",
   "Before copies — NN-before/ folders with the changed files (optional)"
  ],
  "behavior": {
   "pointer": "Not applicable: a governance record.",
   "keyboard": "Not applicable: a governance record.",
   "focus": "Not applicable: a governance record.",
   "responsive": "Not applicable: a governance record.",
   "motion": "Not applicable: a governance record.",
   "loading": "Not applicable: a governance record.",
   "error": "Not applicable: a governance record."
  },
  "a11y": {
   "name": "Not applicable: a governance record.",
   "announce": "Not applicable: a governance record.",
   "focus": "Not applicable: a governance record.",
   "contrast": "Not applicable: a governance record.",
   "motion": "Not applicable: a governance record."
  },
  "content": {
   "labels": "Title each entry with its batch number and a short summary.",
   "actions": "Write changes as plain past-tense facts with counts.",
   "errors": "Not applicable: a governance record.",
   "localization": "Not applicable: internal documentation."
  },
  "use": [
   "Finding when and why a Platform item changed, and how the change was verified",
   "Writing up a change: one batch per request, with what changed and its proof"
  ],
  "avoid": [
   "Release notes for projects that use the packages: use the GitHub release of that version"
  ]
 }
};
// the library parts' written sections (spec-parts.js, built by build-spec-parts.js from parts/*.docs.js; library plan, wave 0)
(window.DSParts ? window.DSParts.docs : []).forEach(function (d) { Object.assign(window.DSDocs, d); });
// a thin record (a leaf answered by an existing item, a duplicate) with docsFrom: '<id>' shows that record's written sections
(window.DSInventory || []).forEach(function (r) { if (r.docsFrom && !window.DSDocs[r.id] && window.DSDocs[r.docsFrom]) window.DSDocs[r.id] = window.DSDocs[r.docsFrom]; });
