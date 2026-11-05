/* Plenix design system · W15B written guidance. */
DSParts.docs.push({
  "content-style": {
    "purpose": "Apply the existing sentence-case and American English house rules to static component strings and design-system guidance.",
    "anatomy": [
      "Rules — capitalization, inclusive language, terminology, action labels, text alternatives (required)",
      "Word list — terminology.md and the glossary in standards/content/rules.json (required)",
      "Language — American English (required)"
    ],
    "behavior": {
      "pointer": "Not applicable: these are rules for words, not a control.",
      "keyboard": "Not applicable: these are rules for words, not a control.",
      "focus": "Not applicable: the rules move no focus.",
      "responsive": "Write the shortest text that says it, so labels fit narrow screens; longer text wraps.",
      "motion": "Not applicable.",
      "loading": "Say what is loading, in sentence case.",
      "error": "node check-copy.js reports British spellings, words the glossary replaces, missing image alternatives and labels that may not be sentence case; fix them before committing."
    },
    "a11y": {
      "name": "Every meaningful image has a text alternative; a decorative one has an empty alt attribute.",
      "announce": "Text read aloud follows the same rules: sentence case, plain words, the action named.",
      "focus": "Not applicable: the rules move no focus.",
      "contrast": "Not applicable: the rules cover words; their colors come from the text roles.",
      "motion": "Not applicable."
    },
    "content": {
      "labels": "American English and sentence case; retain proper product names.",
      "actions": "Use a specific verb and name the result.",
      "errors": "State the source finding and how to correct it.",
      "localization": "Keep caller strings separate from code; preserve logical order."
    }
  },
  "platform-implementation": {
    "purpose": "Implement the existing Plenix Platforms Standard using the platform-owned layout, navigation, tokens and accessibility rules.",
    "anatomy": [
      "Window classes — Narrow (under 600px), Medium (600–839px) and Wide (840px and up) (required)",
      "Values per platform — web, iOS 44pt and Android 48dp, each under the web token name (required)",
      "Where the iOS and Android guidelines win — at mobile widths a conflict follows the Human Interface Guidelines or Material 3 (required)"
    ],
    "behavior": {
      "pointer": "Does not apply: a standard has no screen of its own.",
      "keyboard": "Does not apply.",
      "focus": "Does not apply.",
      "responsive": "Screens follow the window classes: the navigation, the panes and the targets change at 600px and 840px.",
      "motion": "Does not apply.",
      "loading": "Does not apply.",
      "error": "Does not apply: check a screen with build-app, check-system, check-spec and the navigation tests."
    },
    "a11y": {
      "name": "Does not apply.",
      "announce": "Does not apply.",
      "focus": "Does not apply.",
      "contrast": "Does not apply.",
      "motion": "Does not apply."
    },
    "content": {
      "labels": "Native screens keep the platform’s own names.",
      "actions": "Does not apply.",
      "errors": "Does not apply.",
      "localization": "Layouts use logical properties on every platform, so they mirror in right-to-left."
    }
  },
  "accessibility-testing": {
    "purpose": "Run the existing automated checks together with a manual keyboard and screen-reader review, with explicit evidence for the changed screens.",
    "anatomy": [
      "Automatic checks — the system check (node check-system.js) and the page tests, such as tests/a11y.test.js, tests/keyboard.test.js, tests/contrast.test.js and tests/semantic-html.test.js (required)",
      "Checks by hand — keyboard only, a screen reader, zoom to 400% (required)",
      "Findings — what each check finds and what it misses (required)"
    ],
    "behavior": {
      "pointer": "Every action that works with a pointer must also work from the keyboard; test both.",
      "keyboard": "Tab through each changed screen: every control is reached in reading order, Enter and Space act, Escape closes overlays.",
      "focus": "The focus ring shows on every control, and focus returns to the opener when an overlay closes.",
      "responsive": "Zoom to 400% and narrow the window to 320px: content reflows without scrolling sideways.",
      "motion": "Turn on reduced motion and check that movement stops or becomes a fade.",
      "loading": "The checks report their own progress; a failing check stops the change.",
      "error": "Fix each finding before the pull request; write down what the checks could not test."
    },
    "a11y": {
      "name": "With a screen reader, check that every control is read with its name, role and state.",
      "announce": "Check that status messages and errors are announced without moving focus.",
      "focus": "Check focus in every interactive state.",
      "contrast": "The tests measure the theme’s text and surface pairs; check text on pictures by hand.",
      "motion": "Check every changed screen with reduced motion on."
    },
    "content": {
      "labels": "Name each finding by its screen, its control and the rule it breaks.",
      "actions": "Say what to change to fix it.",
      "errors": "Say which check failed and what it found.",
      "localization": "Check one right-to-left page and one long translation where the layout depends on text."
    }
  },
  "browser-support": {
    "purpose": "Document the browser targets (the last two versions of Chrome, Edge, Firefox, Safari and iOS Safari) and the fallbacks for missing features, without blocking anyone by browser name.",
    "anatomy": [
      "Targets — the last two versions of Chrome, Edge, Firefox, Safari and iOS Safari (required)",
      "Feature checks — browserSupport() tests each browser feature the Platform uses (required)",
      "Fallbacks — what each missing feature falls back to (required)",
      "Policy file — standards/browsers.json (required)"
    ],
    "behavior": {
      "pointer": "Does not apply: a policy has no screen.",
      "keyboard": "Does not apply.",
      "focus": "Does not apply.",
      "responsive": "Does not apply.",
      "motion": "Does not apply.",
      "loading": "Does not apply.",
      "error": "A missing feature uses its fallback; nobody is blocked by browser name."
    },
    "a11y": {
      "name": "Does not apply.",
      "announce": "Does not apply.",
      "focus": "Does not apply.",
      "contrast": "Does not apply.",
      "motion": "Does not apply."
    },
    "content": {
      "labels": "Name browsers as their makers do (Chrome, Edge, Firefox, Safari).",
      "actions": "Does not apply.",
      "errors": "Does not apply.",
      "localization": "Does not apply."
    }
  },
  "package-vue": {
    "purpose": "Mount the existing React components from a Vue 3 host, keeping Plenix behavior and the versioned CDN runtime.",
    "anatomy": [
      "@plenix-ds/vue — the Vue 3 bridges (required)",
      "Peers — Vue 3, and React, ReactDOM, plenix.js and plenix.css of the same version from the CDN (required)",
      "Components — typed props, event adapters and v-model bindings for each React component (required)"
    ],
    "behavior": {
      "pointer": "Each component behaves as its React original; Vue passes its props and receives its events.",
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
      "labels": "As the React component.",
      "actions": "Does not apply.",
      "errors": "Does not apply.",
      "localization": "Pass translated words through each component’s strings prop, as in React."
    }
  },
  "package-lint": {
    "purpose": "Use installable ESLint and Stylelint adapters for the same source rules that check the Platform.",
    "anatomy": [
      "@plenix-ds/lint — the check-system rules for ESLint and Stylelint (required)",
      "Rules — the same source rules that check the Platform (required)",
      "Findings — each at its file and source position (required)"
    ],
    "behavior": {
      "pointer": "Does not apply: a lint tool has no screen.",
      "keyboard": "Does not apply.",
      "focus": "Does not apply.",
      "responsive": "Does not apply.",
      "motion": "Does not apply.",
      "loading": "Does not apply.",
      "error": "A broken rule fails the lint run and names the file and position; nothing is fixed automatically."
    },
    "a11y": {
      "name": "Does not apply.",
      "announce": "Does not apply.",
      "focus": "Does not apply.",
      "contrast": "Does not apply.",
      "motion": "Does not apply."
    },
    "content": {
      "labels": "Findings name the rule, the file and the position.",
      "actions": "Fix the cause; design choices go to the owner’s review.",
      "errors": "Does not apply.",
      "localization": "Does not apply."
    }
  }
});
