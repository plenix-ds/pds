/* Plenix design system · w10C: workflow guidance. */
DSParts.docs.push({
  "wizard": {
    "purpose": "Guide a task through named steps without losing earlier edits.",
    "anatomy": [
      "ProgressSteps",
      "step heading and fields",
      "validation notice",
      "Back and Next or Finish."
    ],
    "behavior": {
      "pointer": "Next checks the current step. Finish checks every step, then waits for the save. Back keeps entered values.",
      "keyboard": "Native controls retain their Tab, Enter and Space behavior. Modal layers trap focus and support Escape when not saving.",
      "focus": "On a step change, focus moves to the step’s heading. An invalid submission keeps the current step open.",
      "responsive": "Regions wrap with the Platform layout primitives; fields fill the available width.",
      "motion": "No additional animation; inherited Platform transitions respect reduced motion.",
      "loading": "Pending persistence blocks duplicate actions and announces its busy or save state.",
      "error": "Inline errors preserve values and offer another attempt."
    },
    "a11y": {
      "name": "Each form or dialog has a visible title or an accessible label. Fields use connected labels.",
      "announce": "Failures use an alert Notice; save states use a status Badge with text and an icon.",
      "focus": "All actions are keyboard controls; no status depends on color alone.",
      "contrast": "Only existing Platform surface, text, border and status roles.",
      "motion": "No workflow depends on animation."
    },
    "content": {
      "labels": "Short names for fields and steps; technical values use the data font.",
      "actions": "Explicit verbs: Next, Finish, Save copy, Resume draft, Discard draft, Archive and Restore.",
      "errors": "Explain the failure without clearing entered values.",
      "localization": "All component text is supplied through strings; field and step text belongs to the caller."
    }
  },
  "wizard-dialog": {
    "purpose": "Keeps a short stepped task in a modal layer.",
    "anatomy": [
      "Dialog header — the title and Close (required)",
      "Step indicator — the steps and where the person is (required)",
      "Step content — the current step’s heading and fields (required)",
      "Actions — Cancel, Back, Next, then Finish on the last step (required)",
      "Unsaved-changes check — closing asks before losing work"
    ],
    "behavior": {
      "pointer": "Next checks the current step before the next one opens; Back keeps the values entered. Finish checks every step, then waits for the save; the caller closes the dialog when it succeeds. Close, Escape, a click on the veil and Cancel ask first when values would be lost.",
      "keyboard": "Tab moves through the dialog’s controls and stays inside it; Enter and Space press buttons. Escape closes as Close does, and does nothing while Finish is saving.",
      "focus": "On each step change, focus moves to the new step’s heading. A step that fails its check stays open. Closing returns focus to the button that opened it.",
      "responsive": "The dialog keeps one size from step to step (Medium, Large or Full screen); the fields fill its width.",
      "motion": "None of its own; it opens as a dialog does.",
      "loading": "While Finish saves, the actions cannot be pressed again and the dialog cannot close.",
      "error": "A step that fails its check shows the error and keeps every value; a failed save keeps the values for another try."
    },
    "a11y": {
      "name": "The dialog is named by its title; each field has its own label.",
      "announce": "The new step’s heading is read when focus moves to it; a failed check or save is announced as an alert.",
      "focus": "Focus stays inside the dialog while it is open (a modal layer) and returns to its opener.",
      "contrast": "Only the Platform’s surface, text, border and status roles; the steps say their state in words, never by color alone.",
      "motion": "Nothing to reduce."
    },
    "content": {
      "labels": "Name the steps with short nouns (Details, Options, Review).",
      "actions": "Cancel, Back, Next, and Finish on the last step, or the outcome (Create record).",
      "errors": "Say what to fix on the step, without clearing the values.",
      "localization": "Every built-in word comes from strings; step names and fields are the caller’s."
    }
  },
  "form-flow": {
    "purpose": "Create or update a record with a consistent save and cancel contract.",
    "anatomy": [
      "Form fields",
      "error Notice",
      "actions",
      "optional Dialog or Drawer."
    ],
    "behavior": {
      "pointer": "Saving checks the fields, waits for the save, then marks the form clean and shows a Toast. A failed save keeps every value.",
      "keyboard": "Native controls retain their Tab, Enter and Space behavior. Modal layers trap focus and support Escape when not saving.",
      "focus": "Controls keep focus through inline failures. Modal layers restore focus to the opener.",
      "responsive": "Regions wrap with the Platform layout primitives; fields fill the available width.",
      "motion": "No additional animation; inherited Platform transitions respect reduced motion.",
      "loading": "Pending persistence blocks duplicate actions and announces its busy or save state.",
      "error": "Inline errors preserve values and offer another attempt."
    },
    "a11y": {
      "name": "Each form or dialog has a visible title or an accessible label. Fields use connected labels.",
      "announce": "Failures use an alert Notice; save states use a status Badge with text and an icon.",
      "focus": "All actions are keyboard controls; no status depends on color alone.",
      "contrast": "Only existing Platform surface, text, border and status roles.",
      "motion": "No workflow depends on animation."
    },
    "content": {
      "labels": "Short names for fields and steps; technical values use the data font.",
      "actions": "Explicit verbs: Next, Finish, Save copy, Resume draft, Discard draft, Archive and Restore.",
      "errors": "Explain the failure without clearing entered values.",
      "localization": "All component text is supplied through strings; field and step text belongs to the caller."
    }
  },
  "autosave": {
    "purpose": "Saves private edits without a save action.",
    "anatomy": [
      "SaveStatus: an icon Badge, with a Retry action when a save fails."
    ],
    "behavior": {
      "pointer": "Saves once edits pause, one write at a time. While offline it keeps pending work and retries on reconnect. The initial value counts as saved.",
      "keyboard": "Native controls retain their Tab, Enter and Space behavior. Modal layers trap focus and support Escape when not saving.",
      "focus": "Controls keep focus through inline failures. Modal layers restore focus to the opener.",
      "responsive": "Regions wrap with the Platform layout primitives; fields fill the available width.",
      "motion": "No additional animation; inherited Platform transitions respect reduced motion.",
      "loading": "Pending persistence blocks duplicate actions and announces its busy or save state.",
      "error": "Inline errors preserve values and offer another attempt."
    },
    "a11y": {
      "name": "Each form or dialog has a visible title or an accessible label. Fields use connected labels.",
      "announce": "Failures use an alert Notice; save states use a status Badge with text and an icon.",
      "focus": "All actions are keyboard controls; no status depends on color alone.",
      "contrast": "Only existing Platform surface, text, border and status roles.",
      "motion": "No workflow depends on animation."
    },
    "content": {
      "labels": "Short names for fields and steps; technical values use the data font.",
      "actions": "Explicit verbs: Next, Finish, Save copy, Resume draft, Discard draft, Archive and Restore.",
      "errors": "Explain the failure without clearing entered values.",
      "localization": "All component text is supplied through strings; field and step text belongs to the caller."
    }
  },
  "draft-state": {
    "purpose": "Make unfinished work discoverable and safe to resume or discard.",
    "anatomy": [
      "Draft icon Badge",
      "optional VersionLabel and save status",
      "resume and discard actions."
    ],
    "behavior": {
      "pointer": "Resume hands over to the caller. Discard asks for confirmation as a destructive action and waits until the removal succeeds.",
      "keyboard": "Native controls retain their Tab, Enter and Space behavior. Modal layers trap focus and support Escape when not saving.",
      "focus": "Controls keep focus through inline failures. Modal layers restore focus to the opener.",
      "responsive": "Regions wrap with the Platform layout primitives; fields fill the available width.",
      "motion": "No additional animation; inherited Platform transitions respect reduced motion.",
      "loading": "Pending persistence blocks duplicate actions and announces its busy or save state.",
      "error": "Inline errors preserve values and offer another attempt."
    },
    "a11y": {
      "name": "Each form or dialog has a visible title or an accessible label. Fields use connected labels.",
      "announce": "Failures use an alert Notice; save states use a status Badge with text and an icon.",
      "focus": "All actions are keyboard controls; no status depends on color alone.",
      "contrast": "Only existing Platform surface, text, border and status roles.",
      "motion": "No workflow depends on animation."
    },
    "content": {
      "labels": "Short names for fields and steps; technical values use the data font.",
      "actions": "Explicit verbs: Next, Finish, Save copy, Resume draft, Discard draft, Archive and Restore.",
      "errors": "Explain the failure without clearing entered values.",
      "localization": "All component text is supplied through strings; field and step text belongs to the caller."
    }
  },
  "save-as": {
    "purpose": "Save a separate copy with an explicit name, destination and format.",
    "anatomy": [
      "Name Field",
      "TreeSelect location",
      "optional format Select",
      "error Notice and actions."
    ],
    "behavior": {
      "pointer": "Needs a name and a destination. It waits for the save; if the save fails, entered values stay.",
      "keyboard": "Native controls retain their Tab, Enter and Space behavior. Modal layers trap focus and support Escape when not saving.",
      "focus": "Controls keep focus through inline failures. Modal layers restore focus to the opener.",
      "responsive": "Regions wrap with the Platform layout primitives; fields fill the available width.",
      "motion": "No additional animation; inherited Platform transitions respect reduced motion.",
      "loading": "Pending persistence blocks duplicate actions and announces its busy or save state.",
      "error": "Inline errors preserve values and offer another attempt."
    },
    "a11y": {
      "name": "Each form or dialog has a visible title or an accessible label. Fields use connected labels.",
      "announce": "Failures use an alert Notice; save states use a status Badge with text and an icon.",
      "focus": "All actions are keyboard controls; no status depends on color alone.",
      "contrast": "Only existing Platform surface, text, border and status roles.",
      "motion": "No workflow depends on animation."
    },
    "content": {
      "labels": "Short names for fields and steps; technical values use the data font.",
      "actions": "Explicit verbs: Next, Finish, Save copy, Resume draft, Discard draft, Archive and Restore.",
      "errors": "Explain the failure without clearing entered values.",
      "localization": "All component text is supplied through strings; field and step text belongs to the caller."
    }
  },
  "archive-restore": {
    "purpose": "Takes a record out of active use, with a clear way to restore it.",
    "anatomy": [
      "Archive action",
      "archived Banner with icon Badge",
      "Restore action and error Notice."
    ],
    "behavior": {
      "pointer": "The caller changes the controlled archived state only after the save succeeds; a failed save keeps the current state.",
      "keyboard": "Native controls retain their Tab, Enter and Space behavior. Modal layers trap focus and support Escape when not saving.",
      "focus": "Controls keep focus through inline failures. Modal layers restore focus to the opener.",
      "responsive": "Regions wrap with the Platform layout primitives; fields fill the available width.",
      "motion": "No additional animation; inherited Platform transitions respect reduced motion.",
      "loading": "Pending persistence blocks duplicate actions and announces its busy or save state.",
      "error": "Inline errors preserve values and offer another attempt."
    },
    "a11y": {
      "name": "Each form or dialog has a visible title or an accessible label. Fields use connected labels.",
      "announce": "Failures use an alert Notice; save states use a status Badge with text and an icon.",
      "focus": "All actions are keyboard controls; no status depends on color alone.",
      "contrast": "Only existing Platform surface, text, border and status roles.",
      "motion": "No workflow depends on animation."
    },
    "content": {
      "labels": "Short names for fields and steps; technical values use the data font.",
      "actions": "Explicit verbs: Next, Finish, Save copy, Resume draft, Discard draft, Archive and Restore.",
      "errors": "Explain the failure without clearing entered values.",
      "localization": "All component text is supplied through strings; field and step text belongs to the caller."
    }
  }
});
