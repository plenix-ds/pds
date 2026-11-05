/* Plenix design system · w11C written guidance. */
DSParts.docs.push({
  "import-dialog": {
    "purpose": "Lets people add content in bulk instead of creating it by hand.",
    "anatomy": [
      "Source mode tabs",
      "File picker and drop zone",
      "Pasted text or URL field",
      "Import action and recoverable error"
    ],
    "behavior": {
      "pointer": "A click on a tab picks the source; a file can be dropped or chosen with the button.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "The dialog returns focus to the button that opened it.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "The dialog is named by its title (Import); the source tabs and each field by their labels.",
      "announce": "Errors are announced as alerts.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Theme roles only, from the Dialog, Tabs, fields and Notice it is built from.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Short names for the sources (File, Paste data, URL); chosen file names use the data font.",
      "actions": "Import is the primary action and Cancel closes the dialog; both are disabled while an import runs.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word comes from strings: the title, the source names, Import, Cancel and the errors."
    }
  },
  "import-wizard": {
    "purpose": "Map source columns to target fields, review values and report the persisted result.",
    "anatomy": [
      "Source ImportDialog",
      "Target-to-source mapping fields",
      "Review DataGrid",
      "Completion status and row count"
    ],
    "behavior": {
      "pointer": "Every required mapping must be filled. Finish saves once and shows the results; a failed save keeps the mapping and the rows.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task labels; file names, row counts and keyboard bindings use the data font.",
      "actions": "Back and Next move between the steps, Finish imports once and Cancel closes the dialog; Done closes the results.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  },
  "export-dialog": {
    "purpose": "Lets people take data out of the app to use in other tools.",
    "anatomy": [
      "Format selector",
      "Selection or all-record scope",
      "Background option",
      "Queued or ready Badge and optional download Link"
    ],
    "behavior": {
      "pointer": "Choose format and scope, then press Export; while it runs, the dialog stays open.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "The dialog returns focus to the button that opened it.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "The dialog is named by its title (Export); the format and scope fields and the background option by their labels.",
      "announce": "Errors are announced as alerts; the queued or ready badge is a status, announced politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Short labels for the format, the scope and the background option; format names come from the app.",
      "actions": "Export is the primary action and Cancel closes the dialog; when the export is done, Done closes it and a Download link appears when the file is ready.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word comes from strings: the title, the field labels, Export, Cancel, Done and the errors."
    }
  },
  "access-request": {
    "purpose": "Request permission without implying that submission grants access.",
    "anatomy": [
      "Resource access explanation",
      "Optional request message",
      "Pending, approved or denied icon Badge",
      "Request or Open action"
    ],
    "behavior": {
      "pointer": "Shows Pending only after the request succeeds; if it fails, the message stays. Only the server can approve access.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task labels; file names, row counts and keyboard bindings use the data font.",
      "actions": "Request access sends the request; once access is approved, Open resource opens it.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  },
  "trial-upgrade": {
    "purpose": "Explain a trial and compare caller-supplied plans before an explicit upgrade.",
    "anatomy": [
      "Trial Banner",
      "ComparisonView of plan features",
      "Plan selector",
      "Upgrade confirmation and failure Notice"
    ],
    "behavior": {
      "pointer": "Opening the plans never buys one. Upgrade waits for the caller and keeps the selection if it fails. Prices and billing terms come from the application.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task labels; file names, row counts and keyboard bindings use the data font.",
      "actions": "Compare plans opens the plans; Upgrade buys the chosen plan and Cancel closes without buying.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  },
  "offboarding": {
    "purpose": "Let people preserve their data before a clearly confirmed account or subscription change.",
    "anatomy": [
      "Backup step with ExportDialog",
      "Optional reason",
      "Exact account-name confirmation for deletion",
      "Final explicit action"
    ],
    "behavior": {
      "pointer": "Deleting needs the exact account name. Exports and final actions are separate steps. Errors keep entered values, and duplicate requests are blocked.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task labels; file names, row counts and keyboard bindings use the data font.",
      "actions": "Export data is a separate step; the final button names what happens (Delete account or Cancel subscription), and Keep account leaves without a change.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  },
  "shortcuts-dialog": {
    "purpose": "Find enabled keyboard shortcuts from the live Platform registry.",
    "anatomy": [
      "Search field",
      "Named command groups",
      "Action labels and Kbd bindings",
      "Close action"
    ],
    "behavior": {
      "pointer": "The list scrolls; Close closes the dialog.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Each shortcut uses the same name as its menu item; keys show as the system names them (Ctrl on Windows, ⌘ on Mac).",
      "actions": "Close is the only action.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  },
  "import-dialog-pattern": {
    "purpose": "Choose a supported source before importing records.",
    "anatomy": [
      "Source mode tabs",
      "File picker and drop zone",
      "Pasted text or URL field",
      "Import action and recoverable error"
    ],
    "behavior": {
      "pointer": "Checks the source, waits for the caller’s reader and keeps the draft after an error. The component never fetches an arbitrary URL.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task labels; file names, row counts and keyboard bindings use the data font.",
      "actions": "Import is the primary action and Cancel closes the dialog; both are disabled while an import runs.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  },
  "export-dialog-pattern": {
    "purpose": "Export an explicit record scope and format, immediately or in the background.",
    "anatomy": [
      "Format selector",
      "Selection or all-record scope",
      "Background option",
      "Queued or ready Badge and optional download Link"
    ],
    "behavior": {
      "pointer": "Selection is unavailable when nothing is selected. Export waits for the caller and keeps the options on error; the component never makes up a download file.",
      "keyboard": "Native controls retain Tab, Enter and Space behavior. Modal dialogs support Escape and trap focus; pending requests cannot dismiss.",
      "focus": "Dialogs restore focus to the opener; wizard step changes focus the current heading.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Fields, modal dialogs, review grids and shortcut groups have explicit accessible names.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved; pending writes retain the current form.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task labels; file names, row counts and keyboard bindings use the data font.",
      "actions": "Export is the primary action and Cancel closes the dialog; Done closes it when the export is finished.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Built-in words come from strings. Source columns, plan terms and account names come from the caller."
    }
  }
});
