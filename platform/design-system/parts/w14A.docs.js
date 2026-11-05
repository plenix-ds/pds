/* Plenix design system · w14A written guidance. */
DSParts.docs.push({
  "prompt-input": {
    "purpose": "Write, attach context and choose an available model before explicitly sending a prompt.",
    "anatomy": [
      "Visible Field label",
      "Input or Textarea",
      "Optional local FileInput",
      "Model chip menu",
      "Send or Stop action",
      "Retained error"
    ],
    "behavior": {
      "pointer": "Enter sends once; Shift+Enter starts a new line; typing through an input method (IME) never sends. A failed request keeps the draft; Stop asks the caller to cancel the request.",
      "keyboard": "Enter sends; Shift+Enter adds a line; input-method (composition) keys never send. The model menu uses the arrow keys and Escape.",
      "focus": "Focus stays in the box after sending.",
      "responsive": "The box fills its width; the model chip and attachments wrap onto more lines.",
      "motion": "No motion of its own.",
      "loading": "Show caller-owned processing, prevent duplicate sends and expose Stop while streaming.",
      "error": "Retain the failed draft or partial answer and explain recovery in readable text."
    },
    "a11y": {
      "name": "Visible field and region names are configurable with strings.",
      "announce": "A failed request’s error stays in view beside the box.",
      "focus": "The box, Attach, the model chip and Send or Stop are in Tab order.",
      "contrast": "Use existing component roles and readable sparkle identification; no AI color.",
      "motion": "No new animation."
    },
    "content": {
      "labels": "Use specific prompt, source and action labels. Never promise correctness.",
      "actions": "Send, Stop, Attach and the model chip; nothing is sent until Send.",
      "errors": "Retain the draft and invite another attempt.",
      "localization": "Provide all visible words through strings and nested component strings."
    }
  },
  "streaming-text": {
    "purpose": "Read a response as plain text while it streams in, without a screen reader announcing every token.",
    "anatomy": [
      "Status Badge with icon",
      "Retained response text",
      "Persistent completion LiveRegion"
    ],
    "behavior": {
      "pointer": "Only changes of state are announced: tokens arrive silently, and finishing or stopping announces the response, which stays on screen. Content is plain text, never model HTML.",
      "keyboard": "None: it has no controls and does not take focus.",
      "focus": "It never moves focus.",
      "responsive": "The text wraps to the width it is given.",
      "motion": "StreamingText has no animation or cursor motion, including when reduced motion is requested.",
      "loading": "While streaming, a Streaming badge shows and the text arrives without announcements.",
      "error": "Stopping keeps the partial answer on screen with a Stopped badge."
    },
    "a11y": {
      "name": "The response region is named (label).",
      "announce": "Do not announce every streamed token. Announce completion or stop through a persistent LiveRegion.",
      "focus": "Not in the Tab order.",
      "contrast": "Use existing component roles and readable sparkle identification; no AI color.",
      "motion": "No new animation."
    },
    "content": {
      "labels": "The status words Streaming, Done and Stopped; never promise correctness.",
      "actions": "None: it only shows text. Stop belongs to the prompt input.",
      "errors": "Not applicable: a stopped answer stays as it is.",
      "localization": "Every built-in word can be translated through strings; the answer comes from the app."
    }
  },
  "ai-chat": {
    "purpose": "Have a conversation clearly marked as AI, keeping review, citations and the history the caller owns.",
    "anatomy": [
      "Chat header with AILabel",
      "Keyboard reachable Chat thread",
      "GeneratedContent and StreamingText",
      "Citation source links",
      "Optional RefineMenu and PromptSuggestions",
      "PromptInput and AIDisclaimer"
    ],
    "behavior": {
      "pointer": "A suggestion fills the draft and focuses it without sending. The caller owns each response and how it is delivered. Source links go to their pages; feedback, regenerate and refine run only when chosen.",
      "keyboard": "Existing controls support Enter and Space. Source links navigate normally. Escape dismisses overlays.",
      "focus": "Keep focus on the composer after sending. Suggestions focus it without submitting.",
      "responsive": "The thread fills its panel or page; the composer’s controls wrap.",
      "motion": "StreamingText has no animation or cursor motion, including when reduced motion is requested.",
      "loading": "Show caller-owned processing, prevent duplicate sends and expose Stop while streaming.",
      "error": "Retain the failed draft or partial answer and explain recovery in readable text."
    },
    "a11y": {
      "name": "Visible field and region names are configurable with strings.",
      "announce": "Do not announce every streamed token. Announce completion or stop through a persistent LiveRegion.",
      "focus": "The thread is named and scrolls with the keyboard; focus stays in the composer after sending.",
      "contrast": "Use existing component roles and readable sparkle identification; no AI color.",
      "motion": "No new animation."
    },
    "content": {
      "labels": "Use specific prompt, source and action labels. Never promise correctness.",
      "actions": "Send, stop, regenerate and refine only after an explicit request.",
      "errors": "Retain the draft and invite another attempt.",
      "localization": "Provide all visible words through strings and nested component strings."
    }
  },
  "assistant-panel": {
    "purpose": "Bring an AI conversation beside the current work, in an existing inspector (SidePanel) or a responsive overlay (Sheet).",
    "anatomy": [
      "SidePanel or Sheet",
      "Named header and dismissal",
      "Caller-supplied context",
      "AIChat"
    ],
    "behavior": {
      "pointer": "The inspector uses SidePanel and adapts with it; the overlay uses Sheet, which holds the focus and restores it. Closing reports the closed state; it never sends anything or silently cancels a request in progress.",
      "keyboard": "Existing controls support Enter and Space. Source links navigate normally. Escape dismisses overlays.",
      "focus": "Sheet contains focus and restores it to the opener. Inspector stays in normal page order.",
      "responsive": "As an inspector it follows the side panel’s window sizes; as an overlay it is a sheet that fits the window.",
      "motion": "StreamingText has no animation or cursor motion, including when reduced motion is requested.",
      "loading": "Show caller-owned processing, prevent duplicate sends and expose Stop while streaming.",
      "error": "Retain the failed draft or partial answer and explain recovery in readable text."
    },
    "a11y": {
      "name": "Visible field and region names are configurable with strings.",
      "announce": "Do not announce every streamed token. Announce completion or stop through a persistent LiveRegion.",
      "focus": "The overlay holds focus and returns it to its opener; the inspector stays in page order.",
      "contrast": "Use existing component roles and readable sparkle identification; no AI color.",
      "motion": "No new animation."
    },
    "content": {
      "labels": "Use specific prompt, source and action labels. Never promise correctness.",
      "actions": "Send, stop, regenerate and refine only after an explicit request.",
      "errors": "Retain the draft and invite another attempt.",
      "localization": "Provide all visible words through strings and nested component strings."
    }
  }
});
