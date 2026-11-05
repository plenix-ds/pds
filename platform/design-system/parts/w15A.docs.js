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
    "purpose": "Provides a reusable implementation using existing Platform roles and controls.",
    "anatomy": [
      "Header — the page purpose or implementation contract",
      "Content — live composition or source example",
      "Application handlers — data, navigation and persistence stay with the application"
    ],
    "behavior": {
      "pointer": "Existing controls preserve their own activation contract.",
      "keyboard": "Tab follows the controls; Enter activates an action or link.",
      "focus": "Controls retain existing focus behavior; route changes are owned by the application.",
      "responsive": "Shell and SecondaryPane use the existing responsive layout standard.",
      "motion": "No new motion.",
      "loading": "Applications supply pending state to their controls.",
      "error": "Forms preserve values after a rejected save; error pages explain the recovery action."
    },
    "a11y": {
      "name": "Give every landmark, control and field a meaningful name.",
      "announce": "Save and event feedback uses polite status text.",
      "focus": "No automatic focus theft in embedded examples.",
      "contrast": "Existing text and surface roles only.",
      "motion": "No additional motion."
    },
    "content": {
      "labels": "Use task-specific American English and sentence case.",
      "actions": "Use verbs for commands and real hrefs for navigation.",
      "errors": "Describe the recovery action without exposing personal data.",
      "localization": "Pass strings and localized application content."
    }
  },
  "content-template": {
    "purpose": "Provides a reusable implementation using existing Platform roles and controls.",
    "anatomy": [
      "Header — the page purpose or implementation contract",
      "Content — live composition or source example",
      "Application handlers — data, navigation and persistence stay with the application"
    ],
    "behavior": {
      "pointer": "Existing controls preserve their own activation contract.",
      "keyboard": "Tab follows the controls; Enter activates an action or link.",
      "focus": "Controls retain existing focus behavior; route changes are owned by the application.",
      "responsive": "Shell and SecondaryPane use the existing responsive layout standard.",
      "motion": "No new motion.",
      "loading": "Applications supply pending state to their controls.",
      "error": "Forms preserve values after a rejected save; error pages explain the recovery action."
    },
    "a11y": {
      "name": "Give every landmark, control and field a meaningful name.",
      "announce": "Save and event feedback uses polite status text.",
      "focus": "No automatic focus theft in embedded examples.",
      "contrast": "Existing text and surface roles only.",
      "motion": "No additional motion."
    },
    "content": {
      "labels": "Use task-specific American English and sentence case.",
      "actions": "Use verbs for commands and real hrefs for navigation.",
      "errors": "Describe the recovery action without exposing personal data.",
      "localization": "Pass strings and localized application content."
    }
  },
  "master-detail-workspace": {
    "purpose": "Provides a reusable implementation using existing Platform roles and controls.",
    "anatomy": [
      "Header — the page purpose or implementation contract",
      "Content — live composition or source example",
      "Application handlers — data, navigation and persistence stay with the application"
    ],
    "behavior": {
      "pointer": "Existing controls preserve their own activation contract.",
      "keyboard": "Tab follows the controls; Enter activates an action or link.",
      "focus": "Controls retain existing focus behavior; route changes are owned by the application.",
      "responsive": "Shell and SecondaryPane use the existing responsive layout standard.",
      "motion": "No new motion.",
      "loading": "Applications supply pending state to their controls.",
      "error": "Forms preserve values after a rejected save; error pages explain the recovery action."
    },
    "a11y": {
      "name": "Give every landmark, control and field a meaningful name.",
      "announce": "Save and event feedback uses polite status text.",
      "focus": "No automatic focus theft in embedded examples.",
      "contrast": "Existing text and surface roles only.",
      "motion": "No additional motion."
    },
    "content": {
      "labels": "Use task-specific American English and sentence case.",
      "actions": "Use verbs for commands and real hrefs for navigation.",
      "errors": "Describe the recovery action without exposing personal data.",
      "localization": "Pass strings and localized application content."
    }
  }
});
