/* Plenix · w12B written guidance. */
DSParts.docs.push({
  "asset-gallery": {
    "purpose": "Shows images in responsive columns or justified rows, with an optional full-screen preview.",
    "anatomy": [
      "ContentGrid layout",
      "Named MediaCards",
      "Optional MediaViewer"
    ],
    "behavior": {
      "pointer": "Card titles open the preview when it is enabled. MediaViewer provides keyboard navigation and returns focus.",
      "keyboard": "Tab moves between card titles; Enter opens the preview. In the preview, the arrow keys go to the previous and next picture and Escape closes it.",
      "focus": "Closing the preview returns focus to the card that opened it.",
      "responsive": "The grid adds or drops columns with the width; pictures keep their shape.",
      "motion": "Nothing moves on its own.",
      "loading": "Each card keeps its picture’s space while the picture loads.",
      "error": "A picture that fails to load shows its icon."
    },
    "a11y": {
      "name": "Name the gallery (label); give each picture alt text that says what it shows.",
      "announce": "Nothing of its own; opening the preview moves focus into it.",
      "focus": "Card titles are in Tab order; the preview holds focus while open and returns it when it closes.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing plays or moves unless the person starts it."
    },
    "content": {
      "labels": "Short picture titles; the meta line for type or size (SVG, 2 MB).",
      "actions": "Card titles open the preview; the preview has Previous, Next and Close.",
      "errors": "No error text of its own; an empty gallery says “No images”.",
      "localization": "The empty text and the preview’s name can be translated through strings; titles and alt text come from the app."
    }
  },
  "download-manager": {
    "purpose": "Lists download jobs, so people can retry, cancel or open their results, each by an explicit action.",
    "anatomy": [
      "Named panel or list",
      "FileRow per job",
      "Progress and status",
      "Retry, Cancel and ready file link"
    ],
    "behavior": {
      "pointer": "Showing it never starts a download. A job’s actions lock while it waits for the caller; its errors can be recovered from.",
      "keyboard": "Tab moves through each download’s Retry, Cancel and Download or file link; Enter or Space acts.",
      "focus": "Nothing moves focus; an action keeps the person on the same row.",
      "responsive": "Each row fills the width of the panel or list it sits in.",
      "motion": "No motion of its own.",
      "loading": "Each download shows its progress bar; while an action is pending, that row’s actions are locked so they run once.",
      "error": "A failed download says why and offers Retry."
    },
    "a11y": {
      "name": "The list is named (Downloads); each row by its file name.",
      "announce": "Each row’s status is a badge with an icon and a word: Queued, Downloading, Ready or Download failed.",
      "focus": "Every action is a button or link in Tab order.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing animates beyond the progress bar."
    },
    "content": {
      "labels": "File names as stored; the status words Queued, Downloading, Ready and Download failed.",
      "actions": "Retry, Cancel and Download (or the ready file’s link), one set per download.",
      "errors": "Say what failed and offer Retry: “Could not complete the download action. Try again.”",
      "localization": "Every built-in word can be translated through strings; file names come from the app."
    }
  },
  "media-player": {
    "purpose": "Lets people watch a video or listen to a recording, with a transcript they can jump through and speed control; videos also take captions.",
    "anatomy": [
      "Native video or audio control",
      "WebVTT caption tracks",
      "Playback speed",
      "Transcript toggle and timed segments",
      "Optional picture in picture"
    ],
    "behavior": {
      "pointer": "Nothing autoplays. Captions use the native controls. The transcript can seek only after the metadata has loaded; picture in picture (PiP) appears only in browsers that support it.",
      "keyboard": "The browser’s player keys work: Space plays and pauses, arrows seek. The speed list, Show transcript and each transcript line are reached with Tab.",
      "focus": "Nothing moves focus; choosing a transcript line moves the playback, not the focus.",
      "responsive": "The video scales to the width of its container and keeps its shape; the controls below it wrap.",
      "motion": "Nothing plays on its own.",
      "loading": "Transcript lines can jump only after the media’s details have loaded.",
      "error": "A file that can’t play says so under the player: “This media could not be played.”"
    },
    "a11y": {
      "name": "Name the media (label), such as the video’s title; each transcript line is named “Seek to” its time.",
      "announce": "Playback and picture-in-picture failures show as notices.",
      "focus": "Every control is in Tab order: the browser’s controls, the speed list, Show transcript and each transcript line.",
      "contrast": "Use existing theme roles.",
      "motion": "Playback starts only at user request."
    },
    "content": {
      "labels": "Name captions by language (English); transcript lines in plain text with their start time.",
      "actions": "Show transcript, Picture in picture and the Playback speed list.",
      "errors": "Say the media could not play: “This media could not be played.”",
      "localization": "Every built-in word can be translated through strings; captions and transcripts come from the app in each language."
    }
  },
  "metadata-editor": {
    "purpose": "Edits asset metadata with inline saves or in a validated form, with explicit field selection for bulk edits.",
    "anatomy": [
      "Schema-defined fields",
      "InlineEdit or form controls",
      "Bulk apply checkboxes",
      "Save, Reset and feedback"
    ],
    "behavior": {
      "pointer": "A bulk save sends only the checked fields. A failed validation or save keeps the draft; Reset guards unsaved edits.",
      "keyboard": "Tab moves through the fields and buttons; Enter saves an inline field and Escape cancels it.",
      "focus": "Focus stays on the field being edited; saving or failing does not move it.",
      "responsive": "Fields stack in one column on narrow screens.",
      "motion": "No motion of its own.",
      "loading": "While a save is pending, the form is busy and its buttons are disabled, so it saves once.",
      "error": "A field that can’t save keeps the typed value and says why under it; in a form, the message shows under the fields."
    },
    "a11y": {
      "name": "Every field has a visible label; in Bulk, each check box is named Apply with its field (Apply Title).",
      "announce": "Saved shows as a status badge; a failure as an error notice.",
      "focus": "Native Tab order; nothing moves focus.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "Field names people know (Title, Description), not schema keys.",
      "actions": "Save metadata and Reset in Form and Bulk; inline fields save one at a time.",
      "errors": "Say the change is kept: “Metadata could not be saved. Your changes are still available.”",
      "localization": "Every built-in word can be translated through strings; field names and values come from the app."
    }
  },
  "related-assets": {
    "purpose": "Shows related assets in a manual carousel or a responsive card grid.",
    "anatomy": [
      "Named collection",
      "MediaCards with real links or callbacks",
      "Manual carousel controls"
    ],
    "behavior": {
      "pointer": "The caller owns the recommendations. A title with a link navigates; a title with a callback opens a view. The carousel never autoplays.",
      "keyboard": "Each card title is a link; the strip’s Previous and Next are buttons.",
      "focus": "Nothing moves focus; a title opens its asset.",
      "responsive": "The strip shows two cards at a time; the grid adds columns with the width.",
      "motion": "The strip never moves on its own.",
      "loading": "No loading state of its own; the app supplies the assets.",
      "error": "No error state; with no assets it says “No related assets”."
    },
    "a11y": {
      "name": "Name the collection (label); give each picture alt text.",
      "announce": "Nothing of its own.",
      "focus": "Card titles and the strip’s buttons are in Tab order.",
      "contrast": "Use existing theme roles.",
      "motion": "Nothing moves unless the person moves it."
    },
    "content": {
      "labels": "Asset titles as people know them; the meta line for type or size.",
      "actions": "Card titles open the asset; the strip has Previous and Next.",
      "errors": "Not applicable: it shows no error text.",
      "localization": "The empty text and the strip’s buttons can be translated through strings; titles and alt text come from the app."
    }
  },
  "image-gallery": {
    "purpose": "Shows images in responsive columns or justified rows, with an optional full-screen preview.",
    "anatomy": [
      "ContentGrid layout",
      "Named MediaCards",
      "Optional MediaViewer"
    ],
    "behavior": {
      "pointer": "Card titles open the preview when it is enabled. MediaViewer provides keyboard navigation and returns focus.",
      "keyboard": "Use native Platform controls in source order. Media controls retain browser keyboard support.",
      "focus": "Preview restores focus to its opener. Form errors preserve the active editing context.",
      "responsive": "ContentGrid and Carousel adapt to available width; media stays inside its container.",
      "motion": "No autoplay. Existing components honor reduced motion.",
      "loading": "Display caller progress and prevent duplicate per-item requests.",
      "error": "Preserve input and offer explicit recovery."
    },
    "a11y": {
      "name": "Name every gallery, file list and media element. Images require meaningful alternatives.",
      "announce": "Announce errors and saved status; progress is exposed by FileRow.",
      "focus": "Use native Tab order, visible controls and focus return from MediaViewer.",
      "contrast": "Use existing theme roles.",
      "motion": "Playback starts only at user request."
    },
    "content": {
      "labels": "Use precise asset and field names.",
      "actions": "Use Save metadata, Reset, Cancel and Try again for their respective actions.",
      "errors": "Describe how to recover without discarding work.",
      "localization": "Built-in text is configurable through strings; filenames, captions and metadata belong to the caller."
    }
  },
  "video": {
    "purpose": "Play authorized audio and video with native controls, captions and a seekable transcript.",
    "anatomy": [
      "Native video or audio control",
      "WebVTT caption tracks",
      "Playback speed",
      "Transcript toggle and timed segments",
      "Optional picture in picture"
    ],
    "behavior": {
      "pointer": "Nothing autoplays. Captions use the native controls. The transcript can seek only after the metadata has loaded; picture in picture (PiP) appears only in browsers that support it.",
      "keyboard": "Use native Platform controls in source order. Media controls retain browser keyboard support.",
      "focus": "Preview restores focus to its opener. Form errors preserve the active editing context.",
      "responsive": "ContentGrid and Carousel adapt to available width; media stays inside its container.",
      "motion": "No autoplay. Existing components honor reduced motion.",
      "loading": "Display caller progress and prevent duplicate per-item requests.",
      "error": "Preserve input and offer explicit recovery."
    },
    "a11y": {
      "name": "Name every gallery, file list and media element. Images require meaningful alternatives.",
      "announce": "Announce errors and saved status; progress is exposed by FileRow.",
      "focus": "Use native Tab order, visible controls and focus return from MediaViewer.",
      "contrast": "Use existing theme roles.",
      "motion": "Playback starts only at user request."
    },
    "content": {
      "labels": "Use precise asset and field names.",
      "actions": "Use Save metadata, Reset, Cancel and Try again for their respective actions.",
      "errors": "Describe how to recover without discarding work.",
      "localization": "Built-in text is configurable through strings; filenames, captions and metadata belong to the caller."
    }
  },
  "audio": {
    "purpose": "Play authorized audio and video with native controls, captions and a seekable transcript.",
    "anatomy": [
      "Native audio control",
      "WebVTT caption tracks",
      "Playback speed",
      "Transcript toggle and timed segments"
    ],
    "behavior": {
      "pointer": "Nothing autoplays. Captions use the native controls. The transcript can seek only after the metadata has loaded; picture in picture (PiP) appears only in browsers that support it.",
      "keyboard": "Use native Platform controls in source order. Media controls retain browser keyboard support.",
      "focus": "Preview restores focus to its opener. Form errors preserve the active editing context.",
      "responsive": "ContentGrid and Carousel adapt to available width; media stays inside its container.",
      "motion": "No autoplay. Existing components honor reduced motion.",
      "loading": "Display caller progress and prevent duplicate per-item requests.",
      "error": "Preserve input and offer explicit recovery."
    },
    "a11y": {
      "name": "Name every gallery, file list and media element. Images require meaningful alternatives.",
      "announce": "Announce errors and saved status; progress is exposed by FileRow.",
      "focus": "Use native Tab order, visible controls and focus return from MediaViewer.",
      "contrast": "Use existing theme roles.",
      "motion": "Playback starts only at user request."
    },
    "content": {
      "labels": "Use precise asset and field names.",
      "actions": "Use Save metadata, Reset, Cancel and Try again for their respective actions.",
      "errors": "Describe how to recover without discarding work.",
      "localization": "Built-in text is configurable through strings; filenames, captions and metadata belong to the caller."
    }
  },
  "captions-transcripts": {
    "purpose": "Play authorized audio and video with native controls, captions and a seekable transcript.",
    "anatomy": [
      "Native video or audio control",
      "WebVTT caption tracks",
      "Playback speed",
      "Transcript toggle and timed segments",
      "Optional picture in picture"
    ],
    "behavior": {
      "pointer": "Nothing autoplays. Captions use the native controls. The transcript can seek only after the metadata has loaded; picture in picture (PiP) appears only in browsers that support it.",
      "keyboard": "The player keeps the browser’s keys for its controls. Tab reaches the playback speed, the Show transcript button and each line’s time button; Enter or Space on a time button jumps to that moment.",
      "focus": "Focus stays where it is while the media plays; after a jump it stays on the time button.",
      "responsive": "The player stays inside its container; transcript lines wrap.",
      "motion": "Nothing autoplays.",
      "loading": "The time buttons work once the media’s metadata has loaded.",
      "error": "When the media cannot play, a notice says so."
    },
    "a11y": {
      "name": "Name the player (label) and each caption track by its language; the Show transcript button opens the transcript list.",
      "announce": "A failure to play is announced.",
      "focus": "Tab reaches the player’s controls, the caption choice and each transcript line.",
      "contrast": "Use existing theme roles.",
      "motion": "Playback starts only at user request."
    },
    "content": {
      "labels": "Label each caption track with its language (English, Español).",
      "actions": "Each time button is named for the moment it jumps to (Seek to 1:05).",
      "errors": "Say that the media could not be played.",
      "localization": "Built-in text comes from strings; captions and transcripts belong to the caller, one caption track per language."
    }
  }
});
