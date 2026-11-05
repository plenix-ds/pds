/* Plenix design system · library part w01A (wave 1, lane A): the written sections of the formatting foundation and the
   live region, clipboard, hotkey and virtualization utilities. */
DSParts.docs.push({
  'numbers-and-units': {
    purpose: 'Counts, measurements, file sizes and durations read the same way on every page and in every language: the reader’s locale decides the separators, the decimal mark and the unit names, and one precision per column makes values easy to compare.',
    anatomy: ['Value — the number, with the locale’s grouping and decimal mark (required)', 'Unit — the short or long unit name from the locale (kB, km, min) (optional)', 'Precision — the decimals, fixed per context by the caller or by the Formats standard (required)', 'Sign — shown for changes when signed is set (optional)'],
    behavior: {
      pointer: 'Not applicable: formatting writes text, it is not an element. A compact value ("1.2K") carries its full value in a tooltip or title.',
      keyboard: 'Not applicable: formatting writes text.',
      focus: 'Not applicable: formatting writes text. A tooltip with a full value must be reachable by focus as well as by hover.',
      responsive: 'The same text at every width; where a column is narrow, formatCompact shortens the value and the full value stays one hover or focus away.',
      motion: 'None.',
      loading: 'Not applicable: values are formatted when they are drawn.',
      error: 'A value that is not a finite number gives an empty string, never "NaN".'
    },
    a11y: {
      name: 'Not applicable: formatted values are text.',
      announce: 'Screen readers read the locale’s own number; give the full value and the unit name (VisuallyHidden) wherever the visible value is abbreviated.',
      focus: 'Not applicable.',
      contrast: 'Values take the text roles of their place (Text variant="data" for technical values).',
      motion: 'None.'
    },
    content: {
      labels: 'Numerals, not words, for numbers in the interface. A space between a number and its unit, except for % and degrees (the locale decides).',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Never write a separator, a decimal mark or a unit name by hand: utils/format.ts takes them from the reader’s locale (the page’s lang, else the browser’s).'
    }
  },
  'date-and-time-formats': {
    purpose: 'Dates and times can never be misread: the month is a word, the order and the clock come from the reader’s locale, recent activity reads as relative time and scheduled events name their time zone.',
    anatomy: ['Date — day, month as a word and year, in the locale’s order (required)', 'Time — hours and minutes in the locale’s clock (optional)', 'Time zone — named for scheduled events and audit logs (optional)', 'Relative time — "5 minutes ago" for recent events, up to 7 days (optional)', 'Machine value — the ISO date in the time element’s dateTime (required)'],
    behavior: {
      pointer: 'A relative time shows the full date and time on hover (title or tooltip).',
      keyboard: 'Not applicable: dates are text. A tooltip with the full date is reachable by focus.',
      focus: 'Not applicable.',
      responsive: 'Narrow rows use the "short" style ("Mar 4"); records use "medium"; sentences and headers "long" or "full".',
      motion: 'None.',
      loading: 'Not applicable: dates are formatted when they are drawn.',
      error: 'A value that is not a valid date gives an empty string, never "Invalid Date".'
    },
    a11y: {
      name: 'Not applicable: dates are text.',
      announce: 'Every date is inside <time dateTime={dateTimeAttr(d)}>, so assistive technology has the exact value.',
      focus: 'Full dates in tooltips are reachable by focus.',
      contrast: 'Dates take the text roles of their place.',
      motion: 'None.'
    },
    content: {
      labels: 'Write the month as a word, never a number alone. "Today" and "Yesterday" only together with a time.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'formatDate, formatTime, formatDateTime, formatRelative and formatRange take the order, the clock and the words from the reader’s locale and time zone; pass timeZone where the event’s own zone matters.'
    }
  },
  'currency-and-percentages': {
    purpose: 'Money and ratios are written correctly for the reader and the currency, so amounts are never misread: the symbol, its place, the separators and the minor units all come from the locale and the currency.',
    anatomy: ['Amount — the value with the locale’s separators (required)', 'Currency — the symbol, or the ISO 4217 code where currencies mix (required for money)', 'Sign — plus or minus for changes (optional)', 'Percent — the percent sign in the locale’s place (required for ratios)'],
    behavior: {
      pointer: 'Not applicable: formatted values are text.',
      keyboard: 'Not applicable.',
      focus: 'Not applicable.',
      responsive: 'Amounts are right-aligned with tabular figures in tables and lists at every width.',
      motion: 'None.',
      loading: 'Not applicable.',
      error: 'A value that is not a finite number, or a missing currency, gives an empty string.'
    },
    a11y: {
      name: 'Not applicable.',
      announce: 'Screen readers read the currency and the sign from the formatted text; a change is never shown by color alone.',
      focus: 'Not applicable.',
      contrast: 'Gains and losses pair their color (success, danger roles) with the sign and a word or icon.',
      motion: 'None.'
    },
    content: {
      labels: 'Percentages with numerals and the percent sign. The ISO code (USD, EUR) when a symbol could be ambiguous.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'formatCurrency and formatPercent follow the reader’s locale; money keeps the currency’s minor units unless the context is approximate.'
    }
  },
  'names-addresses-and-phone-numbers': {
    purpose: 'Makes personal details work for people everywhere; phone numbers are stored in one international form.',
    anatomy: ['Name — the full name as entered, with an optional preferred name (required)', 'Address — lines in the country’s order: name, organization, street, locality, region, postal code, country (required)', 'Country — named in the reader’s language, shown when it is not the reader’s (optional)', 'Phone — country code and number, stored as E.164 (required)'],
    behavior: {
      pointer: 'Not applicable: formatted values are text.',
      keyboard: 'Not applicable.',
      focus: 'Not applicable.',
      responsive: 'Address lines stay lines; on narrow widths they wrap within a line rather than merge.',
      motion: 'None.',
      loading: 'Not applicable.',
      error: 'A phone number that is not E.164 is shown as it was stored. A country the Formats standard does not list takes the neutral address layout.'
    },
    a11y: {
      name: 'Every field that collects these details is labeled, with its autocomplete value (name, street-address, postal-code, country, tel).',
      announce: 'Not applicable: the values are text.',
      focus: 'Not applicable.',
      contrast: 'Values take the text roles of their place.',
      motion: 'None.'
    },
    content: {
      labels: 'Label fields plainly: "Full name", "Phone number". Mark optional fields as optional.',
      actions: 'Not applicable.',
      errors: 'Accept spaces, dashes and brackets in phone numbers and postal codes; never reject a name for its characters.',
      localization: 'Never assume a first-and-last name order or a middle name. The address layouts and phone groupings are in platform/standards/formats.json.'
    }
  },
  'live-regions': {
    purpose: 'People who use a screen reader hear about changes they cannot see happen (a save, a result count, an upload, an error) without losing their place.',
    anatomy: ['Region — an element with aria-live, role="status", role="log" or role="alert", present before its message (required)', 'Politeness — polite waits until the reader is idle; assertive interrupts (required)', 'Message — short plain text written into the region (required)'],
    behavior: {
      pointer: 'Not applicable: a live region is not interactive.',
      keyboard: 'Not applicable: focus never moves to a live region.',
      focus: 'Focus stays where it is; that is the point of a live region.',
      responsive: 'announce() uses visually hidden regions at every width; a visible LiveRegion follows its container.',
      motion: 'None.',
      loading: 'Progress is announced at its milestones (started, finished), not at every step.',
      error: 'Urgent errors use the assertive region (role="alert"); others the polite one.'
    },
    a11y: {
      name: 'Not applicable: regions are announced by their content.',
      announce: 'announce() clears the region, then writes the message after --plx-sys-live-region-delay, so a repeated message is read again and a burst is read once. Meets WCAG 2.2 SC 4.1.3 Status Messages.',
      focus: 'Never moves focus.',
      contrast: 'A visible region takes the text roles of its place.',
      motion: 'None.'
    },
    content: {
      labels: 'Messages that make sense heard alone: "12 results", "Saved", "Upload finished: 3 files".',
      actions: 'No controls inside a live region.',
      errors: 'Say what happened and what to do: "Couldn’t save. Check your connection and try again."',
      localization: 'Format counts with formatNumber; announce in the page’s language.'
    }
  },
  clipboard: {
    purpose: 'People copy IDs, paths, links, code and pictures in one press, and are told that it worked, or what to do when it did not.',
    anatomy: ['Copy button — beside the value, named for what it copies (required)', 'Value — the exact text, rich content or picture copied (required)', 'Confirmation — Copied on the button for --plx-sys-clipboard-feedback-duration, and an announcement (required)', 'Error — a message with a way forward (optional)'],
    behavior: {
      pointer: 'A press copies; the button shows Copied for two seconds, then returns.',
      keyboard: 'Enter or Space on the button copies, as any button.',
      focus: 'Focus stays on the button.',
      responsive: 'The same at every width.',
      motion: 'None of its own: the button changes its label and icon.',
      loading: 'Copying is immediate; there is no loading state.',
      error: 'When the browser refuses (an insecure page, no permission), text falls back to the copy command; if that fails too, the error says how to copy by hand.'
    },
    a11y: {
      name: 'The button names what it copies ("Copy file path").',
      announce: 'Copied is announced politely; a failure assertively (through announce).',
      focus: 'Focus never moves.',
      contrast: 'The button’s own roles.',
      motion: 'None.'
    },
    content: {
      labels: '"Copy …" as the action and "Copied" as the confirmation.',
      actions: 'Copy only on a person’s action.',
      errors: '"Couldn’t copy. Select the text and copy it by hand."',
      localization: 'Pass strings: { copied, failed } in the page’s language.'
    }
  },
  hotkey: {
    purpose: 'Keyboard shortcuts work the same everywhere: one way to bind them, clear rules for which one wins, and one list that the shortcuts dialog and the menus read.',
    anatomy: ['Binding — a key, a chord (Mod+K) or a sequence (G then I) (required)', 'Scope — the page or a region; the innermost region wins (optional)', 'Handler — the command it runs (required)', 'Label — what the command does, as in its menu item (required to be listed)', 'Registry — every labeled binding, for the shortcuts dialog (required)'],
    behavior: {
      pointer: 'Not applicable: shortcuts are keys. Every command they run is also reachable by pointer (a button or a menu item).',
      keyboard: 'Mod is Cmd on a Mac and Ctrl elsewhere. A key that starts a sequence waits --plx-sys-hotkey-sequence-timeout for the next. A matched shortcut prevents the browser’s own use of the key.',
      focus: 'A scoped binding fires only while focus is inside its region. Shortcuts are ignored while typing in a field, unless allowInFields.',
      responsive: 'On touch devices without a keyboard, shortcuts do nothing; the commands stay in buttons and menus.',
      motion: 'None.',
      loading: 'Not applicable.',
      error: 'Two bindings of the same keys in the same scope: the one registered first runs, and both show in the shortcuts list. Across nested scopes, the innermost scope that holds the focus wins.'
    },
    a11y: {
      name: 'The label is the command’s accessible name in the shortcuts dialog and beside its menu item.',
      announce: 'The command announces its own result (announce), not the shortcut.',
      focus: 'Never binds Tab, F6 or the keys assistive technology uses.',
      contrast: 'Kbd draws the keys in the data role.',
      motion: 'None.'
    },
    content: {
      labels: 'Keys as people read them: "Ctrl K", "⌘ K", "G then I" (hotkeyLabel).',
      actions: 'The same label in the registry and the menu item.',
      errors: 'Not applicable.',
      localization: 'Keys are matched by their key name, and by their physical key when Alt changes the character.'
    }
  },
  virtualization: {
    purpose: 'Long collections (asset grids, file lists, logs) stay fast and keep working with the keyboard and screen readers, however many items they hold.',
    anatomy: ['Viewport — the scroll container (required)', 'Window — the items in view plus overscan on each side (required)', 'Gaps — stand-ins for the items not rendered, sized by system/virtual.css (required)', 'Probe — one item’s size, measured from the item size token (required)', 'Sticky header — the header of the group in view, kept rendered (optional)'],
    behavior: {
      pointer: 'Scrolling renders the items that come into view; the scroll bar always has the length of the whole collection.',
      keyboard: 'The focused item stays rendered while it has focus, so arrow-key navigation can continue past the window.',
      focus: 'Focus is never lost when its item scrolls out of view.',
      responsive: 'The window follows the viewport’s size (ResizeObserver); a grid recounts its columns.',
      motion: 'None of its own; scrolling is the browser’s.',
      loading: 'Items render at once from memory; very large sets page from the server under the virtualizer.',
      error: 'Not applicable.'
    },
    a11y: {
      name: 'The container is named (aria-label) and has its list or grid role.',
      announce: 'Each item carries aria-posinset of aria-setsize, so screen readers read "12 of 4,000".',
      focus: 'The focused item stays in the page.',
      contrast: 'Items take their own roles; a sticky header takes --plx-sys-virtual-sticky-background.',
      motion: 'None.'
    },
    content: {
      labels: 'Show the total count in the header or the status bar.',
      actions: 'Not applicable.',
      errors: 'Not applicable.',
      localization: 'Horizontal strips follow the writing direction (scroll positions are read and set right to left in RTL pages).'
    }
  }
});
