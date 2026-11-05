/* Plenix · W15C implementation and content guidance. */
DSParts.docs.push({
  "internationalization": {
    "purpose": "Keep complete messages, plural rules, direction and formatting consistent within a locale region.",
    "anatomy": [
      "LocaleProvider — the region's locale, catalogs, fallback, time zone, direction and digits (required)",
      "Catalog — messages by locale, flat dot keys or nested sections; plural messages are objects of Intl plural categories with optional exact counts (\"=0\") (required)",
      "Built-in words — i18n/en.js holds every word a Platform component shows or announces, one section per component; i18n/ar.js is the same sections in Arabic (required). The CDN and the suite have Arabic built in; an npm app turns it on with one line at its start: import '@plenix-ds/react/i18n/ar'. Without it, an Arabic page falls back to English for Plenix's own words",
      "useStrings(section, strings) — a component's words: the application's catalog, the built-in language, then English, with the strings prop on top (required)",
      "useLocale and createTranslator — t, strings, plural and the bound format helpers, inside and outside React (optional)"
    ],
    "behavior": {
      "pointer": "Changing one region’s locale leaves the other regions unchanged. A message is looked up in the exact locale, its language, the fallback locale, then English; for each, the application's catalog comes before Plenix's built-in words. A missing message returns its key. Catalog values are plain text: {name} placeholders are filled as text and no HTML is parsed.",
      "keyboard": "Use native keyboard controls and the inherited Platform focus behavior; preserve the current control during updates.",
      "focus": "Keep focus visible and restore it after modal tasks. Every scrollable code region has a keyboard target.",
      "responsive": "Compose with the existing Stack, Field and DataGrid primitives; content reflows with the available width.",
      "motion": "No new animation or motion requirements.",
      "loading": "Keep meaningful content and explain pending work instead of clearing the region.",
      "error": "Preserve drafts or source data; name the failed operation and a useful recovery action."
    },
    "a11y": {
      "name": "Give each field, action, region and table a meaningful accessible name.",
      "announce": "Use status text or a Badge with an icon for results, and Notice for errors.",
      "focus": "All interactive controls support Tab and their native activation keys.",
      "contrast": "Use only existing Platform text, surface, border and status roles.",
      "motion": "Respect inherited reduced-motion behavior."
    },
    "content": {
      "labels": "Translate complete messages; leave technical values to the bound Intl formatters.",
      "actions": "Use explicit action verbs and complete messages.",
      "errors": "Explain what failed and how to recover without blaming the person.",
      "localization": "Use catalog keys, Intl formatting and strings props; technical values use Reddit Mono. The built-in Arabic is the owner-approved wording of the Arabic chain: whole sentences per count with the Arabic number forms (\"حذف عنصرين؟\", not \"حذف 2 عناصر؟\"), never a count joined to a word. With digits \"auto\" an Arabic locale writes Arabic-Indic digits; emails and web addresses keep Latin digits."
    }
  },
  "design-principles": {
    "purpose": "Make each task clear, predictable and recoverable with the existing Platform roles.",
    "anatomy": [
      "Use heading levels, Field, Text, Button, Notice, Badge and EmptyState for the live examples."
    ],
    "behavior": {
      "pointer": "The specimen changes local example state only. Real applications supply persistence and recovery.",
      "keyboard": "Use native keyboard controls and the inherited Platform focus behavior; preserve the current control during updates.",
      "focus": "Keep focus visible and restore it after modal tasks. Every scrollable code region has a keyboard target.",
      "responsive": "Compose with the existing Stack, Field and DataGrid primitives; content reflows with the available width.",
      "motion": "No new animation or motion requirements.",
      "loading": "Keep meaningful content and explain pending work instead of clearing the region.",
      "error": "Preserve drafts or source data; name the failed operation and a useful recovery action."
    },
    "a11y": {
      "name": "Give each field, action, region and table a meaningful accessible name.",
      "announce": "Use status text or a Badge with an icon for results, and Notice for errors.",
      "focus": "All interactive controls support Tab and their native activation keys.",
      "contrast": "Use only existing Platform text, surface, border and status roles.",
      "motion": "Respect inherited reduced-motion behavior."
    },
    "content": {
      "labels": "Use direct American English and sentence case. Preserve entered values after a failure.",
      "actions": "Use explicit action verbs and complete messages.",
      "errors": "Explain what failed and how to recover without blaming the person.",
      "localization": "Use catalog keys, Intl formatting and strings props; technical values use Reddit Mono."
    }
  },
  "lifecycle-journeys": {
    "purpose": "Connect first use, regular use, plan changes and leaving into one understandable journey.",
    "anatomy": [
      "A stage selector and links to the existing Onboarding, TrialUpgrade and Offboarding patterns."
    ],
    "behavior": {
      "pointer": "Stage choices reveal relevant guidance; a link opens the related pattern.",
      "keyboard": "Use native keyboard controls and the inherited Platform focus behavior; preserve the current control during updates.",
      "focus": "Keep focus visible and restore it after modal tasks.",
      "responsive": "Compose with the existing Stack, Field and DataGrid primitives; content reflows with the available width.",
      "motion": "No new animation or motion requirements.",
      "loading": "Keep meaningful content and explain pending work instead of clearing the region.",
      "error": "Preserve drafts or source data; name the failed operation and a useful recovery action."
    },
    "a11y": {
      "name": "Give each field, action, region and table a meaningful accessible name.",
      "announce": "Use status text or a Badge with an icon for results, and Notice for errors.",
      "focus": "All interactive controls support Tab and their native activation keys.",
      "contrast": "Use only existing Platform text, surface, border and status roles.",
      "motion": "Respect inherited reduced-motion behavior."
    },
    "content": {
      "labels": "Explain the next useful result, keep teaching optional, and state export or account consequences clearly.",
      "actions": "Use explicit action verbs and complete messages.",
      "errors": "Explain what failed and how to recover without blaming the person.",
      "localization": "Use catalog keys, Intl formatting and strings props; technical values use Reddit Mono."
    }
  },
  "wcag-guidance": {
    "purpose": "Review the accessibility rules attached to the actual component records.",
    "anatomy": [
      "Use a named SearchField and a paged DataGrid generated from the records and written accessibility sections."
    ],
    "behavior": {
      "pointer": "Searching narrows the catalog table; pages keep the full guidance available without rendering every row.",
      "keyboard": "Use native keyboard controls and the inherited Platform focus behavior; preserve the current control during updates.",
      "focus": "Keep focus visible and restore it after modal tasks. Every scrollable code region has a keyboard target.",
      "responsive": "Compose with the existing Stack, Field and DataGrid primitives; content reflows with the available width.",
      "motion": "No new animation or motion requirements.",
      "loading": "Keep meaningful content and explain pending work instead of clearing the region.",
      "error": "Preserve drafts or source data; name the failed operation and a useful recovery action."
    },
    "a11y": {
      "name": "Give each field, action, region and table a meaningful accessible name.",
      "announce": "Use status text or a Badge with an icon for results, and Notice for errors.",
      "focus": "All interactive controls support Tab and their native activation keys.",
      "contrast": "Use only existing Platform text, surface, border and status roles.",
      "motion": "Respect inherited reduced-motion behavior."
    },
    "content": {
      "labels": "Use the table as review evidence, then check the complete experience; it is not a conformance certificate.",
      "actions": "Use explicit action verbs and complete messages.",
      "errors": "Explain what failed and how to recover without blaming the person.",
      "localization": "Use catalog keys, Intl formatting and strings props; technical values use Reddit Mono.",
      "guidance": "Review the accessibility rules attached to the actual component records."
    }
  },
  "performance-budget": {
    "purpose": "Prevent unnoticed JavaScript or CSS growth in the actual package outputs.",
    "anatomy": [
      "Measure raw bytes and gzip bytes after packages are built; fail the existing package-build CI step on a limit."
    ],
    "behavior": {
      "pointer": "Does not apply (a build check has no screen).",
      "keyboard": "Does not apply.",
      "focus": "Does not apply.",
      "responsive": "Does not apply.",
      "motion": "Does not apply.",
      "loading": "Does not apply.",
      "error": "The build measures each file against its budget and fails, naming the file, when one is missing or over budget."
    },
    "a11y": {
      "name": "Does not apply.",
      "announce": "Does not apply.",
      "focus": "Does not apply.",
      "contrast": "Does not apply.",
      "motion": "Does not apply."
    },
    "content": {
      "labels": "Report the artifact, measured bytes and limit. Review a budget change with the owner before raising it.",
      "actions": "Does not apply.",
      "errors": "The failure names the file, its measured bytes and its limit.",
      "localization": "Does not apply."
    }
  },
  "web-components": {
    "purpose": "Use the React Platform from custom-element consumers with explicit peers and correctly scoped styles.",
    "anatomy": [
      "Register plx-* hosts, an open shadow root, a React mount, shadow token CSS, event bridges and optional ElementInternals."
    ],
    "behavior": {
      "pointer": "As the React component inside each element. Properties update it; form-associated elements take part in submit and reset. Removing an element releases its root; moving it keeps it.",
      "keyboard": "As the React component.",
      "focus": "As the React component.",
      "responsive": "As the React component.",
      "motion": "As the React component.",
      "loading": "Does not apply.",
      "error": "Does not apply."
    },
    "a11y": {
      "name": "As the React component.",
      "announce": "As the React component.",
      "focus": "As the React component.",
      "contrast": "As the React component.",
      "motion": "As the React component."
    },
    "content": {
      "labels": "Keep meaningful labels, pass complex values as properties and document the global stylesheet needed by portalled overlays.",
      "actions": "Does not apply.",
      "errors": "Does not apply.",
      "localization": "Pass translated words as properties, as in React."
    }
  },
  "design-system-mcp": {
    "purpose": "Give coding tools read-only access to actual tokens, records, exports and usage guidance.",
    "anatomy": [
      "Use a JSON-RPC stdio server, four schema-validated tools, four resources, fixed API endpoints and a versioned offline snapshot."
    ],
    "behavior": {
      "pointer": "Does not apply (a server has no screen).",
      "keyboard": "Does not apply.",
      "focus": "Does not apply.",
      "responsive": "Does not apply.",
      "motion": "Does not apply.",
      "loading": "Without the live API it answers from the bundled offline snapshot, and each answer says which source it used.",
      "error": "Initialize first; arguments are checked. Protocol errors are kept apart from tool and data failures."
    },
    "a11y": {
      "name": "Does not apply.",
      "announce": "Does not apply.",
      "focus": "Does not apply.",
      "contrast": "Does not apply.",
      "motion": "Does not apply."
    },
    "content": {
      "labels": "Treat catalog text as untrusted data. State missing usage rather than inventing an API or implying write access.",
      "actions": "Does not apply: the tools only read.",
      "errors": "A failed call names the tool and what failed.",
      "localization": "Does not apply."
    }
  }
});
