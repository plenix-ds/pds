/* Plenix design system · collaboration guidance. */
DSParts.docs.push({
  "comment": {
    "purpose": "Lets people read a comment with its author and time, and edit, resolve or react to it when allowed.",
    "anatomy": [
      "Author — name and picture (Persona) with the time",
      "Badges — Edited and Resolved, when they apply",
      "Text — the comment as plain text, or a text box while editing",
      "Actions — Edit (own comments), Resolve or Reopen, and reactions"
    ],
    "behavior": {
      "pointer": "Edit opens the text in a box with Save and Cancel; Resolve and reactions act at once.",
      "keyboard": "Tab moves through the actions; Enter or Space presses them.",
      "focus": "A failed save keeps focus and the text in the box.",
      "responsive": "The author line and the actions wrap onto more lines.",
      "motion": "No motion of its own.",
      "loading": "While an action is saving, the comment is busy and its buttons are disabled, so it runs once.",
      "error": "A failed save keeps the edited text and says why under the box."
    },
    "a11y": {
      "name": "Each comment is an article; the edit box is labeled Comment.",
      "announce": "A failure is announced as an alert.",
      "focus": "Every action is a button in Tab order.",
      "contrast": "Existing theme roles; Edited and Resolved are badges with an icon and a word.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "People’s names as the app knows them.",
      "actions": "Edit, Save, Cancel, Resolve, Reopen and the reactions.",
      "errors": "Keep the text and invite another try: “Could not save. Try again.”",
      "localization": "Every built-in word can be translated through strings; names and comment text come from the app."
    }
  },
  "comment-thread": {
    "purpose": "Lets people follow a discussion, reply to it, and resolve it when it is done.",
    "anatomy": [
      "Heading — the thread’s title (Comments) with its Resolved badge",
      "Resolve thread or Reopen thread",
      "Comments, in order",
      "Reply box with Send reply, while the thread is open"
    ],
    "behavior": {
      "pointer": "Send reply posts nonblank text once and clears the box only after the reply is saved; a resolved thread has no Reply box.",
      "keyboard": "Tab moves through each comment’s actions, the Reply box and Send reply; Enter or Space presses a button.",
      "focus": "A failed reply keeps focus and the text in the Reply box.",
      "responsive": "Comments stack; their author lines and actions wrap.",
      "motion": "No motion of its own.",
      "loading": "While a reply or Resolve is saving, the thread is busy and its buttons are disabled.",
      "error": "A failed reply keeps its text and says why under the box."
    },
    "a11y": {
      "name": "The thread is named by its title; the reply box is labeled Reply.",
      "announce": "Failures are announced as alerts.",
      "focus": "Every action is in Tab order; resolving does not move focus.",
      "contrast": "Existing theme roles; Resolved is a badge with an icon and a word.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "A short title for the thread; people’s names as the app knows them.",
      "actions": "Send reply, Resolve thread and Reopen thread, plus each comment’s own actions.",
      "errors": "Keep the reply and invite another try: “Could not save. Try again.”",
      "localization": "Every built-in word can be translated through strings; names and comments come from the app."
    }
  },
  "image-annotation": {
    "purpose": "Lets people point at a place on a picture and discuss it in a comment thread.",
    "anatomy": [
      "The picture, with its pins or regions",
      "A list naming each annotation and its location",
      "The selected annotation’s comment thread",
      "Add annotation — its type, location and comment"
    ],
    "behavior": {
      "pointer": "Choosing a pin, a region or a list item opens its thread; Add annotation needs a location and a comment.",
      "keyboard": "Keyboard users reach annotations through the list beside the picture: Tab to one and press Enter to open its thread.",
      "focus": "A failed add keeps focus and the text in the form.",
      "responsive": "The list and the thread wrap beside or below the picture as space allows.",
      "motion": "No motion of its own.",
      "loading": "While an annotation or a reply is saving, its buttons are disabled.",
      "error": "A failed add or reply keeps the text and says why."
    },
    "a11y": {
      "name": "The picture has alt text; each annotation is named by its label and location.",
      "announce": "Failures are announced as alerts.",
      "focus": "Nothing needs a pointer: every annotation is also in the list.",
      "contrast": "Existing theme roles only.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "Name locations in words people see (Upper left, Heading).",
      "actions": "Add annotation and Send reply, plus Resolve thread in each thread.",
      "errors": "Keep the text and invite another try: “Could not save. Try again.”",
      "localization": "Every built-in word can be translated through strings; locations and comments come from the app."
    }
  },
  "presence-bar": {
    "purpose": "Lets people see who else is viewing or editing, and where each editor is working.",
    "anatomy": [
      "Avatars of who is here, with a count of the rest",
      "Mode badge — Viewing, Editing or Cursors",
      "A list of where each editor is working, with View person (Cursors list)"
    ],
    "behavior": {
      "pointer": "View person, in the cursor list, opens that person; nothing else is clickable.",
      "keyboard": "View person buttons are reached with Tab and pressed with Enter or Space.",
      "focus": "Nothing moves focus.",
      "responsive": "The avatars and the cursor list wrap onto more lines.",
      "motion": "No motion of its own.",
      "loading": "No loading state; the app supplies who is here.",
      "error": "No error state; with no one else here it says “No one else here”."
    },
    "a11y": {
      "name": "The bar is named by its mode (Viewing, Editing, Cursors); each View person button names the person.",
      "announce": "Nothing is announced when people come and go.",
      "focus": "Only View person buttons take focus.",
      "contrast": "Existing theme roles; the mode is a badge with an icon and a word.",
      "motion": "Nothing animates."
    },
    "content": {
      "labels": "People’s names as the app knows them; where they are, in the document’s own words (Heading, Footer).",
      "actions": "View person, in the cursor list only.",
      "errors": "Not applicable: it shows no error text.",
      "localization": "Every built-in word can be translated through strings; names and places come from the app."
    }
  },
  "comment-reply": {
    "purpose": "Follow a conversation and send replies without losing failed drafts.",
    "anatomy": [
      "Named content region",
      "Identity and context",
      "Explicit permitted actions"
    ],
    "behavior": {
      "pointer": "Select named actions; persistence callbacks own saved state.",
      "keyboard": "Platform buttons and fields support Tab, Enter and Space.",
      "focus": "Keep focus in context when a request fails.",
      "responsive": "Wrapping Inline and Stack layouts retain reading order.",
      "motion": "No additional animation.",
      "loading": "Pending requests prevent duplicates.",
      "error": "Preserve drafts and show an error beside the composer."
    },
    "a11y": {
      "name": "Author, image alternatives and controls have explicit names.",
      "announce": "Failures are announced as alerts.",
      "focus": "All actions are keyboard reachable.",
      "contrast": "Use existing component and Badge roles.",
      "motion": "Honor the Platform reduced motion preferences."
    },
    "content": {
      "labels": "Name people and locations in plain language.",
      "actions": "Explicit verbs: Edit, Resolve, Send reply and Add annotation.",
      "errors": "Explain recovery without losing the draft.",
      "localization": "Built-in words use strings; names and messages belong to the caller."
    }
  }
});
