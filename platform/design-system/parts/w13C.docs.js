/* Plenix · w13C written guidance. */
DSParts.docs.push({
  "mention-input": {
    "purpose": "Mention a directory entity in plain or formatted text; the mention stays tied to that entity, not just its name.",
    "anatomy": [
      "Named text editor",
      "Mention trigger or Add mention button",
      "EntityPicker or rich-text suggestion list"
    ],
    "behavior": {
      "pointer": "In plain text, choosing a suggestion replaces the query typed at the caret and returns focus to the text. In rich text, the existing editor engine inserts each mention as one unit.",
      "keyboard": "Typing @ opens the suggestions; Arrow Down moves into them, Enter chooses and Escape closes.",
      "focus": "Choosing a person returns focus to the text, after the mention.",
      "responsive": "The text box fills the width it is given.",
      "motion": "No motion of its own.",
      "loading": "Suggestions from the directory load as people type.",
      "error": "Closing the suggestions never loses typed text."
    },
    "a11y": {
      "name": "Name the text box (label); each mention is named by the person.",
      "announce": "The suggestion list announces the highlighted person.",
      "focus": "Native Tab order; Add mention opens the list for people who do not type @.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "People’s display names, with a detail such as their team when names match.",
      "actions": "Add mention.",
      "errors": "Not applicable: it shows no error text.",
      "localization": "Every built-in word can be translated through strings; people’s names come from the directory."
    }
  },
  "announcement": {
    "purpose": "Show an announcement, with explicit actions, in the existing surface that fits: a Banner, Card or Dialog.",
    "anatomy": [
      "Title and content",
      "Banner, Card or Dialog",
      "Optional actions",
      "Dismiss action and failure notice"
    ],
    "behavior": {
      "pointer": "It never expires on its own. Dismissing waits until the dismissal is saved; if saving fails, the announcement stays.",
      "keyboard": "Tab reaches the announcement’s actions and Dismiss announcement; the dialog form closes with Escape.",
      "focus": "The banner and the card never take focus; the dialog moves focus in and returns it when it closes.",
      "responsive": "The banner spans the width; its text and actions wrap.",
      "motion": "Nothing moves or closes on its own.",
      "loading": "Dismissing waits until the dismissal is saved and cannot be pressed twice.",
      "error": "If dismissing fails, the announcement stays and says why."
    },
    "a11y": {
      "name": "Each announcement is named by its title.",
      "announce": "A banner or card is not announced when it appears; a failed dismissal is.",
      "focus": "Focus moves only into the dialog form.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing appears or goes away without the person."
    },
    "content": {
      "labels": "Lead with what changes and when.",
      "actions": "Dismiss announcement, plus any actions the app adds.",
      "errors": "Say the announcement stays and invite another try: “Could not dismiss this announcement. Try again.”",
      "localization": "Every built-in word can be translated through strings; the announcement’s text comes from the app."
    }
  },
  "audit-log": {
    "purpose": "Read events that can never be changed (who acted, when, what they did and to what) and inspect what changed.",
    "anatomy": [
      "Audit DataGrid",
      "Actor Persona",
      "Timestamp Time",
      "Optional before-and-after Dialog DataGrid"
    ],
    "behavior": {
      "pointer": "The before-and-after differences open only on request. Values show as text; no event can be edited in the viewer.",
      "keyboard": "Tab moves through the View changes buttons; the changes dialog closes with Escape.",
      "focus": "Closing the changes dialog returns focus to its View changes button.",
      "responsive": "The table scrolls sideways on a narrow window.",
      "motion": "No motion of its own.",
      "loading": "No loading state of its own; the app supplies the events and pages them.",
      "error": "No error state: it only reads."
    },
    "a11y": {
      "name": "Name the table (label); the changes dialog is named by its event.",
      "announce": "Nothing is announced: the log does not change while it is read.",
      "focus": "Only View changes takes focus.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "Actor, Time, Action and Target; exact values under Before and After.",
      "actions": "None that change anything: it is read-only. View changes opens an event’s before and after values.",
      "errors": "Not applicable: it shows no error text.",
      "localization": "Every built-in word can be translated through strings; the events come from the app."
    }
  },
  "approval-workflow": {
    "purpose": "Collect authorized reviewer decisions in sequential or parallel stages.",
    "anatomy": [
      "Overall WorkflowStatus",
      "Sequential ProgressSteps",
      "Read-only ReviewFlow per stage",
      "Assigned reviewer comment and explicit decisions"
    ],
    "behavior": {
      "pointer": "A sequential stage waits until the stages before it are approved. Parallel reviewers act independently. Reject and Request changes need a reason. If saving fails, the comments are kept.",
      "keyboard": "Tab moves through the comment box and Approve, Request changes and Reject; Enter or Space decides.",
      "focus": "A failed decision keeps focus and the comment in place.",
      "responsive": "The stages stack; each reviewer’s row wraps.",
      "motion": "No motion of its own.",
      "loading": "While a decision is saving, its buttons are disabled, so it is sent once.",
      "error": "A failed decision keeps the comment and says “Could not save this decision. Your comment is still available.”"
    },
    "a11y": {
      "name": "The stages are a named list (Approval stages); each stage is named by its label.",
      "announce": "A recorded decision is announced; so is a failure.",
      "focus": "Native Tab order; only the assigned reviewer’s controls take focus.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "Name stages by who reviews (Design review, Legal review).",
      "actions": "Approve, Request changes, Reject.",
      "errors": "Keep the comment and invite another try.",
      "localization": "Every built-in word can be translated through strings; stage and reviewer names come from the app."
    }
  }
});
