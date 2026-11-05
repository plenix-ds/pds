/* Plenix design system · library part w02C: the written sections of the press, focus, selection, gesture, read-only and
   semantic HTML foundations */
DSParts.docs.push({
  'pressable': {
    purpose: 'Lets a custom surface answer a mouse, a finger, a pen, the keyboard and a screen reader the way a native button does, so custom controls behave and feel like the rest of the Platform.',
    anatomy: [
      'Element — a native button where possible; otherwise an element with a widget role, tabIndex 0 and a name (required)',
      'pressProps — the pointer, key and click handlers the hook gives, spread on the element (required)',
      'pressed — true while a press is held: the element takes is-pressed (system/interaction.css) (optional)',
      'onPress — the action, once per press, with its pointerType: mouse, touch, pen, keyboard or virtual (required)',
      'onPressStart, onPressEnd, onPressChange — the press beginning, ending (made or canceled) and its state (optional)'
    ],
    behavior: {
      pointer: 'Only the primary button presses. The press is made on release over the element; sliding off before release cancels it, sliding back on while held presses it again.',
      keyboard: 'Enter presses when it goes down and does not repeat while held (a link keeps Enter for itself); Space presses when it comes up; Escape or leaving the element while Space is held cancels.',
      focus: 'The hook does not move focus. A press made with the keyboard may move focus into what it opens; a pointer press leaves focus where the browser puts it.',
      responsive: 'The same on every window size and input environment; touch and mobile give the element its 44px target through the control roles (Device behavior).',
      motion: 'The pressed treatment comes from system/interaction.css and system/motion.css (a small press scale on buttons, the pressed fill on rows); reduced motion removes the scale.',
      loading: 'A surface that starts work shows its busy state itself; while it is busy, pass disabled so a second press does nothing.',
      error: 'Not applicable: the press reports; the action handles its own errors.'
    },
    a11y: {
      name: 'The element’s own: visible text, or aria-label when it shows only an icon. The hook adds no name.',
      announce: 'Nothing of its own: a toggle announces through aria-pressed, an expander through aria-expanded.',
      focus: 'A custom surface is a Tab stop (tabIndex 0) with the focus treatment; a native button already is.',
      contrast: 'The pressed and selected treatments meet 3:1 against the surface (Contrast rules, non-text).',
      motion: 'Presses never depend on motion; reduced motion keeps the color change and drops the scale.'
    },
    content: {
      labels: 'Verb first for actions (“Archive”), the state’s name for toggles (“Pin”, with aria-pressed).',
      actions: 'One action per surface; a second action is its own control, not a double-click or a long press alone.',
      errors: 'Not applicable.',
      localization: 'Keys are the same in every language; the label is translated with the strings of the component that uses the hook.'
    }
  },
  'focusable': {
    purpose: 'Lets keyboard users see where they are and move through a page in useful steps: custom elements get the Tab stop and focus-visible behavior of native controls, and Tab moves between groups instead of through every option.',
    anatomy: [
      'Focus target — the element that takes focus: a Tab stop (tabIndex 0) or a focus target only (tabIndex -1) (required)',
      'focusVisible — true when the focus came from the keyboard: the element takes is-focus-visible, the focus treatment (optional)',
      'Focus group — the container (with its role: listbox, grid, radiogroup, toolbar) and groupProps (onKeyDown, onFocus) (optional)',
      'Items — the group’s focusable descendants; the current one has tabIndex 0, the others -1 (roving focus, utils/roving.ts) (optional)',
      'Orientation — horizontal (Left and Right in reading order), vertical (Up and Down) or both (optional)'
    ],
    behavior: {
      pointer: 'A click focuses the element without the focus treatment (not focus-visible); a text field shows its caret and its focus border either way.',
      keyboard: 'Tab enters a focus group on the item used last (else the first) and leaves it in one step; the arrows move to the next and previous item, Home and End to the first and last, wrapping unless loop is false. In a text field Left and Right move the caret.',
      focus: 'focusVisible follows the browser’s :focus-visible. Hidden items are skipped. The focus treatment is the system’s: a ring on controls, the border color on fields.',
      responsive: 'The same at every window size; a focus group in a grid that reflows keeps its reading order.',
      motion: 'None: focus moves at once.',
      loading: 'Items that load later join the group on the next render; the current item stays current.',
      error: 'Not applicable.'
    },
    a11y: {
      name: 'Every focusable element and every group has a name (its text, aria-label or aria-labelledby).',
      announce: 'Screen readers read the item, its role and its position in the group; nothing extra is announced.',
      focus: 'Focus is always visible for the keyboard (WCAG 2.2, 2.4.7) and never hidden behind a sticky header or an overlay (2.4.11).',
      contrast: 'The focus treatment meets 3:1 against what is around it (1.4.11).',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Name a group by what it holds (“Folders”), not by how it works (“Use the arrows”).',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'In right-to-left pages Left and Right follow the reading order: Right moves back, Left forward.'
    }
  },
  'selectable': {
    purpose: 'Lets people pick items to act on together, the same way in lists, tile grids and tables.',
    anatomy: [
      'Items — the keys of the collection, in their order (the order a range follows) (required)',
      'Mode — single (choosing one replaces the other) or multiple (required)',
      'Selected keys — controlled (selected and onChange) or uncontrolled (defaultSelected) (required)',
      'Anchor — the item chosen last without Shift: where a range starts (optional)',
      'Select all — a checkbox from allSelected and someSelected (its mixed state) and toggleAll (optional)',
      'Count — the number selected, for a selection summary and its bulk actions (optional)'
    ],
    behavior: {
      pointer: 'With behavior "toggle" a click adds or removes an item (a list with checkboxes); with "replace" a click selects only that item, Ctrl or ⌘ adds or removes it, Shift extends from the anchor (a file manager).',
      keyboard: 'The component maps its keys to the model: Space toggles the focused item, Shift with an arrow extends, Ctrl or ⌘ A selects all, Escape clears. Focus moves with useFocusGroup.',
      focus: 'Selection and focus are separate: moving focus does not select (except in a single-selection list that selects on focus, which says so).',
      responsive: 'The same at every window size; on touch a long press may start selecting, and then a tap toggles.',
      motion: 'None of its own.',
      loading: 'Items that load later can be selected as they arrive; select all covers the items loaded and says so (“All 50 on this page”).',
      error: 'Keys that leave the collection stay selected until the next change, then are dropped; tell people when filtered items stay selected.'
    },
    a11y: {
      name: 'The collection has a name; each item is named by its own content.',
      announce: 'aria-selected on options, rows and tiles, aria-checked on checkboxes; announce bulk changes (“12 selected”) with announce().',
      focus: 'The focused item shows the focus treatment whether or not it is selected.',
      contrast: 'The selected treatment meets 3:1 and comes with a check, never color alone (Use of color).',
      motion: 'Not applicable.'
    },
    content: {
      labels: '“Select all”, with the scope when it is not clear (“Select all 240 files”); the count as “3 selected”.',
      actions: 'Bulk actions name what they do to the selection (“Move 3 files”).',
      errors: 'Not applicable.',
      localization: 'Counts go through formatNumber; plural forms come from the strings of the component.'
    }
  },
  'single-selection': {
    purpose: 'For choices with exactly one answer (a format, a folder, a plan): shows every option, makes the choice exclusive and keeps it visible, with the control that fits the number of options and how much each one needs to say.',
    anatomy: [
      'Group label — the question the choice answers (a legend or the listbox’s name) (required)',
      'Options — the exclusive choices, each with its control or its row (required)',
      'Selection indicator — the filled radio, the tile’s check or the row’s check and selected fill (required)',
      'Helper or error text — guidance and validation under the group (optional)'
    ],
    behavior: {
      pointer: 'Clicking an option chooses it and clears the one before; the whole label, tile or row is the target.',
      keyboard: 'Tab enters the group on the chosen option, and Tab leaves. The arrows move: a radio group chooses as it moves; a listbox moves focus, and Space or Enter chooses.',
      focus: 'One Tab stop for the group (radio groups natively, listboxes with useFocusGroup).',
      responsive: 'A RadioGroup may lay out in a row on Wide windows and stacks on Narrow ones; tiles wrap.',
      motion: 'None beyond the selected treatment’s color change.',
      loading: 'Options that load show a skeleton; the default is chosen once they are there.',
      error: 'A required choice left empty shows its error under the group and moves focus to it on submit.'
    },
    a11y: {
      name: 'The group is named by its label (fieldset legend, or aria-label on the listbox).',
      announce: 'The chosen option is read with its position (“PNG, 1 of 3, selected”).',
      focus: 'Arrow keys move within the group; targets are at least 24 by 24 CSS pixels.',
      contrast: 'The selected indicator meets 3:1 and is a shape (a dot, a check), not only a color.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'The group label as a short question or noun phrase (“Format”); option labels short, parallel and without end punctuation.',
      actions: 'Not applicable: choosing is the action; a separate button applies it when the choice has consequences.',
      errors: '“Choose a format”: say what to do.',
      localization: 'Order options by meaning or frequency, not alphabetically, unless the list is long.'
    }
  },
  'gesture-interaction': {
    purpose: 'On touch screens people expect to swipe, pinch, pull and long press. Gestures are direct and quick but invisible, so in Plenix every gesture is a shortcut for an action that is also a visible control.',
    anatomy: [
      'Gesture surface — the element that takes the gesture, with touch-action from system/gesture.css (required)',
      'Trigger — the pointers’ movement: a tap, a hold, a pan, two fingers apart or together (required)',
      'Feedback — the element following the finger, or a commit point shown before release (required)',
      'Threshold — the slop, swipe distance, fling velocity, long-press delay or pull distance that commits it (required)',
      'Alternative — the button or menu item that does the same thing, with the same name (required)'
    ],
    behavior: {
      pointer: 'A gesture starts on pointer down and commits on release, so moving back before lifting cancels it. The mouse works as one finger; pinch needs two pointers.',
      keyboard: 'Gestures have no keys: the alternative control is the keyboard path.',
      focus: 'Gestures do not move focus; the alternative control is in the Tab order.',
      responsive: 'Swipe, pull and pinch appear in the touch and mobile environments. On a pointer device the controls lead, and the gestures still work with a mouse or a trackpad.',
      motion: 'While the finger moves the element follows one to one; on release it settles or springs back (Gesture motion). Reduced motion settles at once.',
      loading: 'Pull to refresh shows the refresh in progress where the pull was, then the content updates.',
      error: 'A gesture that cannot be completed springs back; a destructive one (swipe to delete) offers Undo.'
    },
    a11y: {
      name: 'The alternative control is named with the gesture’s verb (“Archive”, “Refresh”, “Zoom in”).',
      announce: 'The result is announced like the control’s (a toast or the live region), not the gesture.',
      focus: 'Not applicable to the gesture; the alternative is focusable.',
      contrast: 'The commit feedback meets 3:1 against the surface.',
      motion: 'Path and multipoint gestures have a single-pointer alternative (WCAG 2.2, 2.5.1); dragging has a non-dragging one (2.5.7).'
    },
    content: {
      labels: 'Mention a gesture only in help or onboarding, by its result (“Swipe left to archive”).',
      actions: 'The gesture and its control do the same thing with the same name.',
      errors: 'Not applicable.',
      localization: 'Swipes follow the reading direction: a swipe toward the start of the line archives (left in left-to-right text, right in right-to-left text).'
    }
  },
  'gesture-motion': {
    purpose: 'Keeps an element under the finger and lands it where people expect, so direct manipulation feels direct, with tokens shared by every component that moves under a finger.',
    anatomy: [
      'Tracking — the element follows the finger one to one, with no easing (required)',
      'Thresholds — --plx-sys-gesture-slop, -swipe-distance, -fling-velocity, -long-press-delay, -pull-distance (required)',
      'Release — the settle: --plx-sys-gesture-settle-duration and -settle-easing (.plx-gesture-settle) (required)',
      'Fling — the coast after a fast release: --plx-sys-gesture-fling-decay and flingDistance (optional)',
      'Pull resistance and pinch limit — --plx-sys-gesture-pull-resistance and -pinch-max-scale (optional)'
    ],
    behavior: {
      pointer: 'Tracking starts once the pointer passes the slop; under it the press stays a tap or a long press.',
      keyboard: 'Not applicable: keyboard actions move things at once, without gesture motion.',
      focus: 'Not applicable.',
      responsive: 'The same tokens in every environment; their values may change with the interaction context (touch, mobile) through the token sets.',
      motion: 'Follow while held; settle with an ease-out and no overshoot when released; a fling coasts on the decay rate. Reduced motion skips the settle and the coast (the element is placed at once).',
      loading: 'Not applicable.',
      error: 'A canceled gesture springs back to where it started.'
    },
    a11y: {
      name: 'Not applicable: tokens and motion carry no name.',
      announce: 'Not applicable.',
      focus: 'Not applicable.',
      contrast: 'Not applicable.',
      motion: 'People who ask for reduced motion get no settle or coast (system/motion.css sets every duration to 0); nothing depends on seeing the motion.'
    },
    content: {
      labels: 'Not applicable.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Horizontal motion mirrors in right-to-left layouts: a settle toward the end goes left.'
    }
  },
  'read-only-state': {
    purpose: 'Some values can be seen but not changed: an ID the system assigned, a setting an administrator controls, a record that is locked after approval. The read-only state keeps them fully legible, focusable and copyable, unlike disabled, and makes it plain that they cannot be edited.',
    anatomy: [
      'Region — <ReadOnly> (div, section, form or fieldset) with data-plx-readonly="true" (optional: a single field uses its own readOnly)',
      'Reason — the lock icon and a short sentence, tied to the region as its description (optional)',
      'Value — the control’s value at full content contrast on the sunken surface with a quiet border (required)',
      'Field label — unchanged: it still names the value (required)'
    ],
    behavior: {
      pointer: 'Text can be selected and copied; checkboxes, switches, radios, selects and sliders do not change on a click; the pointer is the arrow, not the hand.',
      keyboard: 'Every control stays in the Tab order; typing, Space, Enter and the arrow keys do not change values; copying (Ctrl or ⌘ C) works. A form inside does not submit.',
      focus: 'Read-only controls take focus and show the focus treatment, so people can reach and read them with the keyboard and a screen reader.',
      responsive: 'The same at every window size.',
      motion: 'None.',
      loading: 'A region that is loading shows its skeleton; it becomes read-only when its content is there.',
      error: 'Not applicable: a read-only value is not validated.'
    },
    a11y: {
      name: 'Each control keeps its label; the reason is the region’s description (aria-describedby).',
      announce: 'Screen readers read “read only” from readonly on text fields and aria-readonly on the roles that carry it.',
      focus: 'In the Tab order, unlike disabled controls.',
      contrast: 'The value keeps 4.5:1: read-only is not exempt from contrast as disabled is.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Keep the field’s label; show the full value, never a placeholder.',
      actions: 'Hide the actions that would change the region (Save, Delete); keep the ones that only read (Copy, Download, Open).',
      errors: 'Not applicable.',
      localization: 'The reason is a short sentence in sentence case (“Set by your administrator”), translated with the page.'
    }
  },
  'semantic-html': {
    purpose: 'Native elements bring their role, their states and their keyboard behavior for free. Using the element that matches what the interface does (a button for an action, a link for a destination, landmarks and headings for structure) makes pages work with the keyboard, screen readers and browser features without extra code. ARIA is kept for the few widgets HTML does not have.',
    anatomy: [
      'Landmarks — header (banner), nav, main, aside, footer: AppShell renders them (required)',
      'Headings — one level 1 heading per page, then sections in order (required)',
      'Controls — button, a with href, input, select, textarea: Button, Link, the form components (required)',
      'Lists and tables — ul and ol for statements (List), DataGrid and Table for rows of fields (optional)',
      'Rule — check-system.rules/semantic-html.js: no clickable element without meaning or role, no anchor that acts without href (required)'
    ],
    behavior: {
      pointer: 'Native buttons and links answer the pointer as browsers expect: middle-click opens a link in a new tab, a button never does.',
      keyboard: 'Native controls are Tab stops with their keys (Enter and Space on buttons, Enter on links); a custom widget with a role brings its own keys (Focusable, Pressable).',
      focus: 'Elements without meaning are never focusable unless they are a widget with a role, or a scroll area with a name.',
      responsive: 'The same structure at every window size: a layout change never changes the order of landmarks or headings.',
      motion: 'Not applicable.',
      loading: 'A region that is loading keeps its landmark and heading; aria-busy marks it while it fills.',
      error: 'node check-system.js reports every case the overview lists, with the file and line.'
    },
    a11y: {
      name: 'Every landmark used twice has a name (two nav regions: “Main”, “Folders”).',
      announce: 'Roles and states come from the elements; ARIA fills only what HTML cannot say.',
      focus: 'The Tab order follows the source order of the page.',
      contrast: 'Not applicable.',
      motion: 'Not applicable.'
    },
    content: {
      labels: 'Headings describe the section they introduce; link text names its destination, never “Click here”.',
      actions: 'Buttons say what they do (“Archive”), links where they go (“Release notes”).',
      errors: 'Not applicable.',
      localization: 'The page’s lang attribute names its language; parts in another language carry their own lang.'
    }
  }
});
