/* Plenix design system · w12C written guidance. */
DSParts.docs.push({
  "attachment-picker": {
    "purpose": "Lets people add files from their device to a message or record, check them, and take any back out before anything is sent.",
    "anatomy": [
      "File input — chooses files from the device (required)",
      "Selected files — rows (Inline) or removable chips (Chips); “No attachments.” when empty (required)",
      "Problem notice — shows when a file is the wrong type, too large, or one too many (optional)"
    ],
    "behavior": {
      "pointer": "Click the file input to choose files from the device; remove a file with Remove in its row menu (Inline) or the chip's remove button (Chips).",
      "keyboard": "All actions use native Platform keyboard controls. Modal dialogs support Escape and trap focus; file and version choices remain explicit.",
      "focus": "Dialogs restore focus to their opener; viewports support keyboard scrolling.",
      "responsive": "Use the responsive Platform Dialog, SidePanel and wrapping layout primitives.",
      "motion": "No new motion; inherited components honor reduced motion.",
      "loading": "Pending persistence prevents duplicate actions; callers retain draft data.",
      "error": "Failures remain visible and preserve editable values."
    },
    "a11y": {
      "name": "Forms, panels and controls have explicit names; file rows and page controls name their targets.",
      "announce": "Errors are alerts; progress and permission summaries announce changes politely.",
      "focus": "Native focus order is preserved. Cancel preserves saved files.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Use short task-oriented labels and named roles.",
      "actions": "Explicit verbs: Choose, Download, Preview, Restore and Remove.",
      "errors": "Keep the user in context and preserve their work.",
      "localization": "Every built-in word is configurable through strings; article and task content comes from the caller."
    }
  },
  "file-picker": {
    "purpose": "Choose existing files, assets or media within folders.",
    "anatomy": [
      "Named dialog",
      "Folder Tree",
      "Search field",
      "Selectable FileRows",
      "Explicit Choose action"
    ],
    "behavior": {
      "pointer": "The selection stays through filtering; media mode is limited to audio, images and video. Cancel never commits; the picker waits for the save before it closes.",
      "keyboard": "The dialog takes Tab, Enter and Escape; the folder tree moves with the arrow keys; Space ticks a file.",
      "focus": "Opening moves focus into the dialog; closing returns it to the button that opened it.",
      "responsive": "Folders, search and files stack in one column inside the dialog, which narrows with the window.",
      "motion": "No motion of its own.",
      "loading": "While Choose is pending, the list is locked and the dialog cannot be closed, so it runs once.",
      "error": "If choosing fails, the dialog stays open with the selection and says why."
    },
    "a11y": {
      "name": "The dialog is named by its title (Choose files); the folder tree, search field and file list have their own names.",
      "announce": "Errors show in a notice.",
      "focus": "Focus stays in the dialog while it is open.",
      "contrast": "Existing theme roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Folder and file names as stored; the title says what is being chosen.",
      "actions": "Choose and Cancel.",
      "errors": "Say it failed and keep the selection: “Files could not be chosen. Try again.”",
      "localization": "Every built-in word can be translated; file and folder names come from the app."
    }
  },
  "rendition-list": {
    "purpose": "Downloads one specific stored derivative, with its format and size in view.",
    "anatomy": [
      "Rendition name",
      "Format and byte size",
      "DataGrid or download menu"
    ],
    "behavior": {
      "pointer": "Downloads only the selected rendition. A pending download cannot be started again; links keep the browser’s native download behavior.",
      "keyboard": "Table: Tab reaches each Download button. Menu: Tab reaches the Renditions button; the arrow keys move through the menu and Enter downloads.",
      "focus": "Nothing moves focus; the menu returns focus to its button when it closes.",
      "responsive": "The table scrolls sideways on a narrow window; the menu takes only its button’s space.",
      "motion": "No motion of its own.",
      "loading": "A download in progress shows its progress and cannot be started again.",
      "error": "A download that fails says so and can be tried again."
    },
    "a11y": {
      "name": "The table and the menu are named Renditions; each Download names its file.",
      "announce": "Download progress shows on its button.",
      "focus": "Every Download is in Tab order.",
      "contrast": "Existing theme roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Name renditions by use and size (Web large); formats in capitals (JPEG, PNG).",
      "actions": "Download, one per rendition.",
      "errors": "Say the download failed and offer to try again.",
      "localization": "Every built-in word can be translated through strings; rendition names come from the app."
    }
  },
  "document-viewer": {
    "purpose": "Shows paginated PDFs, images and text without leaving the application.",
    "anatomy": [
      "Page navigation",
      "Stepped zoom",
      "Page thumbnails",
      "Named scroll viewport",
      "Accessible PDF text"
    ],
    "behavior": {
      "pointer": "Loads PDF.js from the release's vendor folder (vendor/pdfjs/, beside plenix.js on the CDN) and cancels rendering of outdated documents and canvases. Exposes the PDF text, scrolling by keyboard, and load errors people can recover from.",
      "keyboard": "Tab reaches Previous page, Next page, Zoom, the page thumbnails and the page itself, which scrolls with the arrow keys.",
      "focus": "Nothing moves focus; the page area takes focus so it can be scrolled.",
      "responsive": "The toolbar and thumbnails wrap onto more rows; the page scrolls inside its area.",
      "motion": "No motion of its own.",
      "loading": "A loading indicator shows until the first page is ready.",
      "error": "Each failure says what happened and offers Try again: the viewer could not start (engine), the document is missing, denied or blocked (access), the file is not a readable PDF (parse), or a page could not be drawn (render). onError({ reason, cause }) tells the app which. Until a document has pages, the page counter, page buttons and zoom are hidden."
    },
    "a11y": {
      "name": "Name the document (label); each page picture is named with its number.",
      "announce": "The page number (Page 2 / 5) and the loading text are status messages, read when they change.",
      "focus": "The page area is in Tab order so it can be scrolled by keyboard; the current thumbnail is marked.",
      "contrast": "Existing theme roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "The document’s name; the page as Page 2 / 5.",
      "actions": "Previous page, Next page, Zoom and Try again.",
      "errors": "One message per reason, never the document's address or the server's error: “The document viewer could not start. Try again later.”, “The document could not be opened. It may have moved, or you may not have access to it.”, “This file could not be read as a PDF.”, “This page could not be shown.” strings.failed replaces all four with an app's own wording.",
      "localization": "Every built-in word can be translated through strings; the document and its text come from the app."
    }
  },
  "version-history": {
    "purpose": "Inspect earlier versions and restore one only after explicit confirmation.",
    "anatomy": [
      "Timeline",
      "VersionLabel",
      "Optional preview",
      "Confirmed restore and result Badge"
    ],
    "behavior": {
      "pointer": "Previewing never changes saved data. A restore waits for confirmation, cannot run twice, and keeps the version if it fails.",
      "keyboard": "Tab reaches Preview and Restore on each version; the dialogs close with Escape.",
      "focus": "Closing a dialog returns focus to the button that opened it; after Restore, focus returns to the restored version.",
      "responsive": "The timeline fills its width; the dialogs narrow with the window.",
      "motion": "No motion of its own.",
      "loading": "While a restore is saving, the dialog cannot be closed and Restore runs once.",
      "error": "A failed restore keeps the dialog open and says why; nothing is changed."
    },
    "a11y": {
      "name": "The timeline is named Version history; each version by its number.",
      "announce": "Errors show in a notice; a finished restore shows a Version restored badge.",
      "focus": "Focus stays in each dialog while it is open.",
      "contrast": "Existing theme and Badge roles only.",
      "motion": "Reduced motion is inherited from the Platform."
    },
    "content": {
      "labels": "Version numbers, dates, authors and a short note for each version.",
      "actions": "Preview and Restore; the confirmation offers Restore and Cancel.",
      "errors": "Say nothing changed and invite another try: “The version could not be restored. Try again.”",
      "localization": "Every built-in word can be translated through strings; version notes come from the app."
    }
  }
});
