/* Plenix design system · w14B written guidance. */
DSParts.docs.push({
  "ai-label": {
    "purpose": "Identify generated content with the existing sparkle icon and readable text.",
    "anatomy": [
      "Sparkle icon",
      "Readable origin label",
      "Optional explanation disclosure"
    ],
    "behavior": {
      "pointer": "The explanation opens only when someone activates it. The label never suggests the content is correct or verified.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "generated-content": {
    "purpose": "Review generated content, give feedback and move between caller-owned versions.",
    "anatomy": [
      "AILabel",
      "Retained content",
      "Version pager",
      "Feedback and regenerate actions",
      "Recoverable error"
    ],
    "behavior": {
      "pointer": "Each action runs once and waits for its result. A failure keeps the content; switching versions cancels work that no longer applies. The caller supplies regenerated versions.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "prompt-history": {
    "purpose": "Find and reuse a saved prompt without implicitly sending it to a model.",
    "anatomy": [
      "Optional SearchField",
      "Prompt actions",
      "Data-font timestamps",
      "Empty or error message"
    ],
    "behavior": {
      "pointer": "Filtering never changes the history. Choosing a prompt calls the caller once; a failure keeps the prompt list.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "citation": {
    "purpose": "Show a numbered source reference with a real link and enough context to inspect it.",
    "anatomy": [
      "Numbered disclosure or source heading",
      "Source Link",
      "Author and excerpt"
    ],
    "behavior": {
      "pointer": "The marker opens a Popover with the source. Going to the source is a Link; a URL with an unsafe protocol is not interactive.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "suggested-action": {
    "purpose": "Offer an optional action that runs only when explicitly activated.",
    "anatomy": [
      "Sparkle action button",
      "Optional description",
      "Pending or error message"
    ],
    "behavior": {
      "pointer": "Wait for the caller and run once; on failure, show an error people can recover from, without suggesting the action was accepted.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "ai-search": {
    "purpose": "Place an identified generated answer and citations above normal search results.",
    "anatomy": [
      "Search form",
      "Optional semantic Switch",
      "Generated answer and sources",
      "Result Links"
    ],
    "behavior": {
      "pointer": "Only a submitted search runs. A new search cancels the old one and replaces its results. A failed search keeps the previous answer; turning semantic search on or off never runs a search by itself.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "recommendation": {
    "purpose": "Offer recommendations people browse themselves, with an explanation when one is available.",
    "anatomy": [
      "Named Carousel",
      "Recommendation content",
      "Optional reason Popover",
      "Explicit Link or action"
    ],
    "behavior": {
      "pointer": "It never moves on its own or opens a page when it appears. Reasons come from the caller; links are real links and behave as usual in the browser.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; AI actions remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; suggestions and citations have specific names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Existing content is retained after errors.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Regenerate, Helpful, Search and Open.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  }
});

DSParts.docs.push({
  "ai-visual-language": {
    "purpose": "Identify AI origin without creating a new color system or implying correctness.",
    "anatomy": [
      "Existing sparkle icon",
      "Readable origin label",
      "Optional explicit explanation"
    ],
    "behavior": {
      "pointer": "Origin text is static; an explanation uses the existing Popover.",
      "keyboard": "All interactive disclosures use Platform keyboard controls.",
      "focus": "Disclosures restore focus to their opener.",
      "responsive": "Labels wrap with the existing layout primitives.",
      "motion": "No new motion.",
      "loading": "Retain origin identification while caller work is pending.",
      "error": "Origin labels never replace an actionable error."
    },
    "a11y": {
      "name": "Readable labels identify origin; the sparkle is decorative.",
      "announce": "Do not announce a static origin label repeatedly.",
      "focus": "Static origin labels do not take focus.",
      "contrast": "Existing neutral component and theme roles only.",
      "motion": "No motion introduced."
    },
    "content": {
      "labels": "AI-generated identifies origin only.",
      "actions": "Use explicit task verbs for suggestions and regeneration.",
      "errors": "Keep previous content and describe recovery.",
      "localization": "The label and disclosure words are configurable through strings."
    }
  }
});
