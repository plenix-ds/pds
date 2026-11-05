/* Plenix design system · w11B written guidance. */
var docs = {
  "share-dialog": {
    "purpose": "Manages explicit access to a record: for people, and through existing share links.",
    "anatomy": [
      "People picker and role selector",
      "Current grants with role controls",
      "Restricted link and copy action",
      "Save and Cancel actions"
    ],
    "behavior": {
      "pointer": "Adds people without duplicates and edits their roles; it waits for the save to finish and keeps the access draft if the save fails. Copy and Web Share never change permissions.",
      "keyboard": "The dialog takes Tab, Enter and Escape; the People and Link tabs move with the arrow keys; each person’s role is a dropdown list.",
      "focus": "Opening moves focus into the dialog; closing returns it to the button that opened it.",
      "responsive": "The dialog narrows with the window; each person’s row wraps onto more lines.",
      "motion": "No motion of its own.",
      "loading": "While a save is pending, the controls are disabled and the dialog cannot be closed, so Save access runs once.",
      "error": "A failed save keeps the access changes and says why under the tabs; closing with unsaved changes asks first."
    },
    "a11y": {
      "name": "The dialog is named by its title; each person’s role list is named with the person (“Role: Maya Chen”).",
      "announce": "A failed save or share shows as an error notice.",
      "focus": "Focus stays inside the dialog while it is open and returns to its opener when it closes.",
      "contrast": "Existing theme roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Name roles by what they allow (Viewer, Editor); say who a link works for (Only people with access, Anyone with the link can view).",
      "actions": "Add person, Remove, Copy link, Share using device, Save access and Cancel.",
      "errors": "Say what failed and keep the changes: “Could not share. Try again.”",
      "localization": "Every built-in word can be translated through strings; people’s names and role names come from the app."
    }
  },
  "permissions-editor": {
    "purpose": "Inspect and edit a capabilities matrix for roles or individual people.",
    "anatomy": [
      "Capability rows and subject columns",
      "Named permission checkboxes",
      "Subject selector",
      "PermissionSummary and optional save action"
    ],
    "behavior": {
      "pointer": "Updates are controlled and immutable and leave locked subjects unchanged. Save waits for the save to finish; if it fails, the current draft stays.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; tours remain non-modal.",
      "focus": "Dialogs restore focus to their opener; teaching bubbles focus actions only after the user starts a tour.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; matrix checkboxes include both row and subject.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Optional education can be dismissed.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Share, Save permissions, Resume tour, Dismiss checklist and Back to articles.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "tour": {
    "purpose": "Explain a few controls with a voluntary sequence of contextual steps.",
    "anatomy": [
      "Persistent target controls",
      "One active TeachingBubble",
      "Step count",
      "Next, Back, Skip and Resume actions"
    ],
    "behavior": {
      "pointer": "Only the current bubble opens. Skip and Escape close it without clearing the remembered step. Resume uses the persisted index; Finish reports completion.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; tours remain non-modal.",
      "focus": "Dialogs restore focus to their opener; teaching bubbles focus actions only after the user starts a tour.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; matrix checkboxes include both row and subject.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Optional education can be dismissed.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Share, Save permissions, Resume tour, Dismiss checklist and Back to articles.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "checklist": {
    "purpose": "Show a short set of setup tasks and the progress already made.",
    "anatomy": [
      "Task group title",
      "Progress bar and technical count",
      "Labeled native checkboxes",
      "Optional collapse and dismiss actions"
    ],
    "behavior": {
      "pointer": "Count only known completed tasks. Disabled tasks remain unchanged. Collapsing preserves completion, and dismissal belongs to the caller.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; tours remain non-modal.",
      "focus": "Dialogs restore focus to their opener; teaching bubbles focus actions only after the user starts a tour.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; matrix checkboxes include both row and subject.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Optional education can be dismissed.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Share, Save permissions, Resume tour, Dismiss checklist and Back to articles.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "onboarding": {
    "purpose": "Offer an optional welcome and reusable setup tasks without blocking product access.",
    "anatomy": [
      "Dismissible welcome Dialog",
      "Setup Checklist",
      "User-started Tour"
    ],
    "behavior": {
      "pointer": "Skipping welcome keeps the setup checklist available. The tour starts only after an explicit action. Callbacks let the application retain seen and completion state.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; tours remain non-modal.",
      "focus": "Dialogs restore focus to their opener; teaching bubbles focus actions only after the user starts a tour.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; matrix checkboxes include both row and subject.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Optional education can be dismissed.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Share, Save permissions, Resume tour, Dismiss checklist and Back to articles.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "feature-intro": {
    "purpose": "Introduce one new feature without turning education into an interruption.",
    "anatomy": [
      "Feature control or label",
      "New icon Badge",
      "Optional TeachingBubble",
      "Requested what-is-new Dialog"
    ],
    "behavior": {
      "pointer": "Show an informational New badge, open details on request, and report dismissal without disabling the feature.",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; tours remain non-modal.",
      "focus": "Dialogs restore focus to their opener; teaching bubbles focus actions only after the user starts a tour.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; matrix checkboxes include both row and subject.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Optional education can be dismissed.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Share, Save permissions, Resume tour, Dismiss checklist and Back to articles.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "help-panel": {
    "purpose": "Lets people search and read help articles beside their task, without leaving it.",
    "anatomy": [
      "Panel — the inspector SidePanel, titled Help, with its collapse button (required)",
      "Search field — “Search help”, matching article titles and summaries (required)",
      "Results — each article’s title as a button, its summary under it; “No matching articles” when none match (required)",
      "Article — Back to articles, the article’s title as a heading, its content, and a Read full article link when there is one (when an article is open)"
    ],
    "behavior": {
      "pointer": "Typing narrows the results by title and summary. A result opens its article; Back to articles returns to the results, the search kept. Read full article is a link to the whole article.",
      "keyboard": "Tab moves through the search field, the results and the article’s controls; Enter or Space opens a result or goes back; Enter follows Read full article.",
      "focus": "The panel moves focus nowhere on its own.",
      "responsive": "As the inspector: beside the main region on wide windows, over it on narrower ones; its content scrolls on its own.",
      "motion": "None of its own.",
      "loading": "Not applicable: the articles come from the caller.",
      "error": "Not applicable: a search that matches nothing shows “No matching articles”."
    },
    "a11y": {
      "name": "The panel is named by its title (Help); the search field by its label, “Search help”.",
      "announce": "An open article starts with its title as a heading; “No matching articles” is shown as an empty state.",
      "focus": "Every button and link shows the system focus ring; the search field changes its border color.",
      "contrast": "The panel uses the inspector’s surface and text roles in light and dark.",
      "motion": "Nothing to reduce."
    },
    "content": {
      "labels": "Article titles name the task (“Create a record”); summaries add one sentence.",
      "actions": "Back to articles, and the Read full article link.",
      "errors": "Not applicable: there is no error text.",
      "localization": "Every built-in word comes from strings; article titles, summaries and content are the caller’s."
    }
  }
};
// The alias shares workflow text; its platform comparison uses the same dialog primitive.
docs.walkthrough = docs.tour;
DSParts.docs.push(docs);
