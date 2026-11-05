/* Plenix design system · library part w07K: the written sections of the Command bar and its find-and-view panels (the
   owner's decisions of 2026-10-14). Each rule is stated as the standard. */
DSParts.docs.push({
  'command-bar': {
    purpose: 'Puts a collection’s commands, its search and its view settings in one fixed place above it, in the same order on every page, so people find them without looking: actions at the start, find and view at the end. When rows are selected the same bar swaps to the selection’s commands, so the table never moves.',
    anatomy: [
      'Bar — one white framed bar (3A) of one height: the default surface, the default border, 8px corners; fixed at the top of the content while the content scrolls (required)',
      'Actions — the page’s commands at the start: ghost Buttons with icon and label, a menu button for a group (New), the danger commands last after a divider (with actions)',
      'More — "More actions" (⋮): the actions that do not fit, from the end, the danger commands last; shown only on real overflow',
      'Search — CommandBarSearch, after the actions and a divider, one fixed width (240px); narrow: its icon in the same place (with find and view)',
      'Filter and quick filters — FilterPanel, then the app’s own QuickFilters (Category, Type, Tags, Date) (with find and view)',
      'View controls — SortPanel, GroupPanel, ColumnsMenu, ViewMenu: each its own button, never merged (with find and view)',
      'Count — the collection’s count at the end ("24 assets"), in the data font, muted (optional)',
      'End controls — Export and the like, at the very end (optional)',
      'Selection — while rows are selected: the selection’s commands in place of the actions, search and filters (Delete last), and "× N selected" at the end in place of the count, which clears the selection (with selectable rows)'
    ],
    behavior: {
      pointer: 'A command runs, or opens its menu; a find or view button opens its panel (a popover) under it; a click outside or Escape closes it.',
      keyboard: 'The bar is a Toolbar with one Tab stop: Arrow Left and Right move between its controls in reading order, and Home and End jump to the ends. Enter or Space opens a panel or menu; focus moves to the panel’s first row (else its Add button) and returns to the button when Escape closes it. In a panel, Alt + Arrow Up / Down moves the focused row. While rows are selected, Escape in the bar or "× N selected" clears the selection and brings the normal bar back.',
      focus: 'The focus follows the reading order. The bar never moves the focus by itself (the swap leaves it on the table); a panel returns it to its button; Sort, Group, Columns and View stay mounted through the swap.',
      responsive: 'The button rule, measured step by step: icon and label while every bar fits on one line; then icons only, each with its tooltip; then the search becomes its icon (it opens the field across the bar, × clears it, Escape closes it and focus returns); then the actions fold into More one at a time from the end, the danger commands last. Filter, Sort, Group, Columns and View keep their own buttons at every width. While the search is open across the bar, the bar holds its step.',
      motion: 'None of its own; panels and menus open as popovers.',
      loading: 'Not applicable: the collection shows its own loading state.',
      error: 'Not applicable: a command reports its result with the page’s feedback (a toast).'
    },
    a11y: {
      name: 'The bar is a toolbar named by label ("Assets"; "Assets actions" while rows are selected); every icon-only button keeps its name and has a tooltip; a count on a button is in its name ("Filter, 2"); "× N selected" is named "2 selected, clear the selection".',
      announce: 'The swap is announced ("2 selected. Selection actions available.", "Selection cleared."); the panels announce each row move ("Name moved to position 2 of 3").',
      focus: 'Buttons show the button focus ring; panel rows the focus ring; the search field changes only its border color.',
      contrast: 'Ghost buttons on the white bar use the button roles; disabled commands use the disabled role and explain themselves in their tooltips; the danger color for Delete meets the text contrast.',
      motion: 'Nothing to reduce.'
    },
    content: {
      labels: 'Commands are short verbs (New, Upload, Download, Delete). The find and view buttons read Filter, Sort, Group, Columns and View and are never reworded: their state is the tint and the count badge.',
      actions: 'Actions share the one bar with find and view; when they do not fit they become icons, then fold into More from the end. No primary by default; a page may mark one. Destructive commands are marked danger: they go last.',
      errors: 'A disabled command says why in its tooltip: "Select assets to download".',
      localization: 'Every word is in strings; the layout uses logical properties and the bar mirrors right to left. Longer words step the bar down sooner.'
    }
  },
  'filter-panel': {
    purpose: 'Lets people keep only the records that meet conditions on their fields, with every possibility in one place.',
    anatomy: [
      'Filter button — the filter icon and "Filter"; tinted with a count badge while conditions apply (required)',
      'Panel head — "Filter", its info button, and "In this view, show records" (required)',
      'Conditions — in one frame: the join (Where; and / or; the same word after), the field with its type icon, the operator in the field type’s words, the value, remove and the handle (required)',
      'Value — a text, a number, a date, "the past week…", or the chosen options as pills in their category colors (per condition)',
      'Condition group — a nested frame on the sunken surface, one level deep, with its own Add condition (optional)',
      'Add condition and Add condition group — ghost buttons under the conditions (required)'
    ],
    behavior: {
      pointer: 'The button opens the panel; changes apply at once. Drag a row by its handle to move it.',
      keyboard: 'The panel opens with the focus on the first row’s field (else Add condition). Tab moves through a row’s controls; Alt + Arrow Up / Down on a focused row moves it; the handle’s menu has Move up and Move down. Escape closes the panel.',
      focus: 'The focus returns to the Filter button when the panel closes.',
      responsive: 'The panel is at least 400px wide; narrow, the Filter button is its icon with the count.',
      motion: 'None.',
      loading: 'Not applicable.',
      error: 'A condition left unfinished does not filter.'
    },
    a11y: {
      name: 'The panel is a dialog named Filter; each picker names its role and value ("Field: Name"); remove buttons name what they remove.',
      announce: 'Each row move is announced politely.',
      focus: 'Rows take the focus ring; fields change only their border color.',
      contrast: 'Pills use the category colors with their on-colors.',
      motion: 'Nothing to reduce.'
    },
    content: {
      labels: 'Field names as the collection shows them; operators in plain words (contains, is any of, is before).',
      actions: 'Add condition; Add condition group.',
      errors: 'None: an unfinished condition is ignored.',
      localization: 'Every word is in strings.'
    }
  },
  'sort-panel': {
    purpose: 'Lets people order a collection by one field, then another.',
    anatomy: ['Sort button — the sort icon and "Sort"; tinted with a count badge while levels apply (required)', 'Panel head — "Sort by", or "Sort within groups by" while grouped, and its info button (required)', 'Levels — each a field with its type icon, a direction in the field type’s words, remove (×) and the handle (required)', 'Add a sort / Add another sort — a ghost button (required)'],
    behavior: { pointer: 'The button opens the panel; changes apply at once.', keyboard: 'The focus starts on the first level (else the Add button); Alt + Arrow Up / Down moves a focused level; Escape closes the panel.', focus: 'The focus returns to the Sort button.', responsive: 'Narrow, the button is its icon with the count.', motion: 'None.', loading: 'Not applicable.', error: 'Not applicable.' },
    a11y: { name: 'A dialog named Sort; the pickers name their role and value.', announce: 'Level moves are announced.', focus: 'Rows take the focus ring.', contrast: 'The button roles.', motion: 'Nothing to reduce.' },
    content: { labels: 'Directions in the type’s words: A → Z, 1 → 9, Oldest → newest, First → Last.', actions: 'Add another sort.', errors: 'Not applicable.', localization: 'Every word is in strings.' }
  },
  'group-panel': {
    purpose: 'Gathers the records that share a value under one header, and splits each group again by a subgroup.',
    anatomy: ['Group button — the group-by icon (stacked rows) and "Group"; tinted with a count badge while grouped (required)', 'Panel head — "Group by", its info button, Collapse all and Expand all (required)', 'Levels — each a field, its order, the … menu (Hide empty groups), remove and the handle (required)', 'Add group / Add subgroup — a ghost button (required)'],
    behavior: { pointer: 'The button opens the panel; changes apply at once; Collapse all and Expand all close and open every group of the table.', keyboard: 'As in the Sort panel; Alt + Arrow Up / Down moves a level.', focus: 'The focus returns to the Group button.', responsive: 'Narrow, the button is its icon with the count.', motion: 'None.', loading: 'Not applicable.', error: 'Not applicable.' },
    a11y: { name: 'A dialog named Group.', announce: 'Level moves are announced; the table announces each group it opens or closes.', focus: 'Rows take the focus ring.', contrast: 'The button roles.', motion: 'Nothing to reduce.' },
    content: { labels: 'The group order in the field type’s words.', actions: 'Add subgroup; Collapse all; Expand all.', errors: 'Not applicable.', localization: 'Every word is in strings.' }
  },
  'columns-menu': {
    purpose: 'Lets people choose which columns show, in which order, and which column comes first.',
    anatomy: ['Columns button — the fields icon, "Columns" and the chevron; tinted with the count of hidden columns (required)', 'First column select — names the first column, above the list in the dropdown and in the dialog (required)', 'Rows — a handle that opens a menu with Move up and Move down, a checkbox (shown), and the first column’s pin (required)', 'Manage columns dialog — the First column select, a find field filling the dialog, Show all, Hide all and the same rows; Cancel and Apply (optional)'],
    behavior: { pointer: 'Drag a row (in Firefox, start the drag from the row, not the handle), or open the handle’s menu for Move up and Move down; the dropdown applies at once, the dialog on Apply.', keyboard: 'Tab reaches each row and its handle; Alt + Arrow Up / Down moves the focused row; the First column select moves a column to the top.', focus: 'After a move the focus stays on the row.', responsive: 'The dialog for long lists.', motion: 'None.', loading: 'Not applicable.', error: 'The first column cannot be hidden.' },
    a11y: { name: 'Each row is named with its column and its place; the handle’s button and its menu name their column.', announce: 'Each change is announced ("Size hidden", "Category is the first column").', focus: 'Rows take the focus ring.', contrast: 'The muted pin and handle meet the non-text contrast.', motion: 'Nothing to reduce.' },
    content: { labels: 'The columns’ own names.', actions: 'First column; Move up; Move down; Show all; Hide all; Apply.', errors: 'Not applicable.', localization: 'Every word is in strings.' }
  },
  'quick-filter': {
    purpose: 'Gives an app’s most asked questions (Category, Type, Tags, Date) a button of their own beside Filter.',
    anatomy: ['Button — the field’s icon, its name and the chevron; tinted with a count badge while it filters (required)', 'Find field — fills the panel (list kind)', 'Checklist — each value a checkbox with its pill (list kind)', 'Presets and range — Any time, Last 7 days, Last 30 days, This year, Custom range; From and To (date kind)', 'Clear — in the footer, disabled while nothing is chosen (required)'],
    behavior: { pointer: 'The button opens the panel; each choice applies at once.', keyboard: 'The focus starts in the find field (or the presets); Tab and Space choose; Escape closes.', focus: 'The focus returns to the button.', responsive: 'Narrow, the button is its icon with the count.', motion: 'None.', loading: 'Not applicable.', error: 'Not applicable.' },
    a11y: { name: 'A dialog named by the button’s label; checkboxes by their values.', announce: 'The collection’s count changes with the choice.', focus: 'Fields change only their border color.', contrast: 'Pills use the category colors with their on-colors.', motion: 'Nothing to reduce.' },
    content: { labels: 'The field’s name (Category, Type, Tags, Date).', actions: 'Clear.', errors: 'Not applicable.', localization: 'Every word is in strings; the presets too.' }
  }
});
