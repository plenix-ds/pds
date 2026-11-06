/* Plenix · w15A written guidance. */
DSParts.docs.push({
  "analytics-instrumentation": {
    "purpose": "Delivers events only with consent, with no vendor, network client, storage, session identity or personal-data collection.",
    "anatomy": [
      "AnalyticsProvider — an explicitly enabled boundary and application-owned onEvent sink",
      "useAnalytics — the closest provider’s scoped sender",
      "track(sink,name,properties,allowedProperties) — stateless event validation",
      "data-plx-track — a fixed event name on a command; clicks are delegated within the closest boundary"
    ],
    "behavior": {
      "pointer": "A delegated click sends only the fixed attribute name. Disabled controls and disabled nested providers are excluded.",
      "keyboard": "Native Enter and Space activation produce the same click once; key presses are never collected.",
      "focus": "Instrumentation never moves focus.",
      "responsive": "No visual presentation or breakpoint behavior.",
      "motion": "None.",
      "loading": "Disabled by default. Load a vendor only in the application after consent.",
      "error": "Provider sink failures call onError when supplied and never interrupt the action. Only allowlisted yes/no and number properties are sent; text is never sent."
    },
    "a11y": {
      "name": "Tracking attributes never replace visible or accessible control labels.",
      "announce": "No announcement for telemetry; the action owns its feedback.",
      "focus": "No extra Tab stops.",
      "contrast": "No presentation.",
      "motion": "None."
    },
    "content": {
      "labels": "Event names use a fixed lowercase identifier such as record.save, never user text.",
      "actions": "Call the hook sender for non-click events; avoid instrumenting the same activation twice.",
      "errors": "Do not forward exception messages, URLs or form values as event properties.",
      "localization": "Event names stay the same in every language."
    }
  },
  "angular-package": {
    "purpose": "Mounts the versioned CDN React components in standalone Angular components using an application-provided browser runtime.",
    "anatomy": [
      "Generated named Plx adapters and typed inputs from build-types.js",
      "A React host per adapter; destroy unmounts its root",
      "ControlValueAccessor integration for supported input controls"
    ],
    "behavior": {
      "pointer": "React owns the mounted control’s interaction; Angular inputs update its props.",
      "keyboard": "The existing control owns its key handling. Form controls report changes and touched state through Angular forms.",
      "focus": "Do not replace a focused root on every input change.",
      "responsive": "Load the matching Plenix CSS; the existing components own layout.",
      "motion": "Existing component behavior only.",
      "loading": "Initialize the documented runtime before mounting; the generated adapter needs Angular's JIT compiler. Browser-only CDN mounting is not server rendering.",
      "error": "Missing runtime or unsupported exports must fail clearly rather than mount a blank control."
    },
    "a11y": {
      "name": "Pass the underlying control label and described-by inputs.",
      "announce": "Underlying components own state announcements.",
      "focus": "Hosts add no keyboard stop.",
      "contrast": "Matching versioned stylesheet required.",
      "motion": "Underlying reduced-motion support remains active."
    },
    "content": {
      "labels": "Use the component’s documented inputs; projected HTML is not a React node.",
      "actions": "Outputs bridge callback payloads; form models use the supported accessor.",
      "errors": "Never mount inside an Angular-owned DOM subtree that React will replace.",
      "localization": "Pass strings as inputs."
    }
  },
  "figma-libraries": {
    "purpose": "Distributes existing Figma kit references, native designs and token variable data without writing to Figma or requiring a paid account feature.",
    "anatomy": [
      "mappings() — real node identifiers and their existing native-page associations",
      "variables() — current token records and selector values",
      "nativeDesigns() — read-only native design guidance",
      "JSON subpaths — portable data for offline tooling"
    ],
    "behavior": {
      "pointer": "Node URLs open the existing kit node itself; a matching name never implies a React association.",
      "keyboard": "Read-only JSON and Node helper functions have no UI behavior.",
      "focus": "No UI.",
      "responsive": "Not applicable to data files.",
      "motion": "None.",
      "loading": "Helpers read packaged local data; they make no network request.",
      "error": "API publishing and variable imports remain manual owner actions."
    },
    "a11y": {
      "name": "Mapping names preserve the source kit labels.",
      "announce": "No UI.",
      "focus": "No UI.",
      "contrast": "Variable exports preserve existing role values rather than inventing an accent.",
      "motion": "None."
    },
    "content": {
      "labels": "Keep real source IDs and page associations.",
      "actions": "Inspect exported data locally; nothing calls a Figma endpoint that changes data.",
      "errors": "Do not publish native-kit IDs as fabricated React Code Connect snippets.",
      "localization": "Source-kit node labels stay unchanged; application copy is separate."
    }
  },
  "listing-page": {
    "purpose": "Lets people scan, sort and act on many records of one kind: a title row with the page's actions, an optional command bar, and a DataGrid that fills the room left and scrolls inside.",
    "anatomy": [
      "Title row — the page title, its description and its actions (optional)",
      "Toolbar — a CommandBar above the grid (optional, `toolbar`)",
      "Grid — a DataGrid named by `label` (default: the title), filling the room left, with virtual rows (required)",
      "Detail — the chosen record in a SidePanel beside the list, titled by `detailTitle` (optional, `detail`)",
      "Empty state — shown when there are no rows, or your own (`empty`)"
    ],
    "behavior": {
      "pointer": "A click on a row runs the grid's `onRowClick`; with `detail` the chosen record opens in the side panel, and closing the panel runs `onDetailClose`.",
      "keyboard": "Tab enters the grid and the panel; each keeps its own keys (the grid's arrow keys, the panel's Escape).",
      "focus": "The grid and the panel keep their own focus behavior; the template moves no focus.",
      "responsive": "The grid fills the room left below the toolbar and scrolls inside, with no page controls unless `grid.mode` asks for them. The panel opens over the main region under 1024px.",
      "motion": "None of its own.",
      "loading": "The application supplies the rows and any pending state; with no rows the empty state shows.",
      "error": "The template never fetches: the application shows a failed load."
    },
    "a11y": {
      "name": "The page has one h1, its title; the grid is named by its label.",
      "announce": "The grid announces its rows, columns and sort; the panel is a named region.",
      "focus": "The grid is one Tab stop; the side panel follows it.",
      "contrast": "Existing text and surface roles only.",
      "motion": "Nothing to reduce."
    },
    "content": {
      "labels": "Title the page with the records it lists (\"Assets\"); name the grid the same way.",
      "actions": "Header actions are verbs (New asset); a row opens its record.",
      "errors": "Not applicable: the page has no error text of its own.",
      "localization": "The words (the empty state, the panel title) come from `strings` and can be replaced."
    }
  },
  "content-template": {
    "purpose": "Shows items people recognize by a picture or a title as cards in a grid, under a title row, so they can pick one to open.",
    "anatomy": [
      "Title row — the page title, its description and its actions (optional)",
      "Filter row — whatever the application puts above the cards as `children` (optional)",
      "Cards — FeatureCards in a ContentGrid, each opening a link or `onOpen` (required)",
      "Empty state — shown when there are no items, or your own (`empty`)"
    ],
    "behavior": {
      "pointer": "A card is one target: it follows its `href` or runs `onOpen`.",
      "keyboard": "Tab moves from card to card; Enter follows a link or runs the action.",
      "focus": "Each card shows the focus ring of its own component.",
      "responsive": "The grid follows the content grid: it fits as many cards as the main region allows.",
      "motion": "None of its own.",
      "loading": "The application supplies the items and any pending state.",
      "error": "The template never fetches: the application shows a failed load."
    },
    "a11y": {
      "name": "The page has one h1, its title; each card is named by its title.",
      "announce": "A card is announced as a link or a button with its title and description.",
      "focus": "Cards are Tab stops in reading order.",
      "contrast": "Existing text and surface roles only.",
      "motion": "Nothing to reduce."
    },
    "content": {
      "labels": "A card's title names the item; its line says what it is or does.",
      "actions": "Cards open items; the page's actions are verbs in the title row.",
      "errors": "Not applicable: the page has no error text of its own.",
      "localization": "The words come from `strings`; the grid uses logical properties and mirrors in right-to-left."
    }
  },
  "master-detail-workspace": {
    "purpose": "Shows a list and the selected item's details side by side, so people can move through the records of one list without leaving the page.",
    "anatomy": [
      "Pane — the list, in a SecondaryPane titled by `paneTitle` (required)",
      "Detail — the selected item's content in the main region (required)",
      "Back — on a phone the details open on their own screen, with Back to the list",
      "Shell — the header, the navigation pane and the footer around it (AppShell, page kind master-detail)"
    ],
    "behavior": {
      "pointer": "Choosing an item in the pane fills the detail; on a phone it opens the detail on its own screen, and Back (`onBack`) returns to the list.",
      "keyboard": "Tab moves from the pane to the detail; the pane's list keeps its own keys.",
      "focus": "The pane and the detail keep their own focus behavior; the template moves no focus.",
      "responsive": "Side by side on wide windows; on a phone one screen at a time, switched by `detailOpen`.",
      "motion": "None of its own.",
      "loading": "The application supplies the list and the detail and any pending state.",
      "error": "The template never fetches: the application shows a failed load."
    },
    "a11y": {
      "name": "The pane is a named region (its title); the page has one h1.",
      "announce": "The selected item and its detail are announced by their own components.",
      "focus": "Back is a button at the top of the detail screen on a phone.",
      "contrast": "Existing text and surface roles only.",
      "motion": "Nothing to reduce."
    },
    "content": {
      "labels": "The pane title names the list (\"Assets\"); the detail names the item.",
      "actions": "Back says Back; item actions are verbs.",
      "errors": "Not applicable: the page has no error text of its own.",
      "localization": "The words come from `strings`; the layout mirrors in right-to-left."
    }
  }
});
