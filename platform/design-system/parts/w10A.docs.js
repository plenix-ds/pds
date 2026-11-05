/* Plenix design system · library part w10A (wave 10, lane A): the written sections of Rename, Sortable list, Drag
   handle, Drop target, Resize, Drag and drop, Reposition, Accessible drag and drop and the drag-and-drop engine. */
DSParts.docs.push({
  'rename-action': {
    purpose: 'Lets people correct and organize the names of what they own without leaving their place.',
    anatomy: ['Trigger — the name itself (inline: a button that turns into the field) or a Rename… button or menu item (dialog) (required)', 'Field — the current name, selected up to its extension (required)',
      'Rules — not empty, no slash or backslash, not another item’s name in the same place, the page’s own (required)', 'Message — under the field when a rule is broken (optional)', 'Actions — Enter or the check button, Escape; Rename and Cancel in the dialog (required)'],
    behavior: {
      pointer: 'Inline: a click on the name opens the field; leaving the field saves. Dialog: the button or the menu item opens it; Rename saves, Cancel, the close button or a click on the veil put the name back.',
      keyboard: 'Inline: Enter, Space or F2 on the name opens the field; Enter saves, Escape puts the name back. Dialog: Enter saves, Escape cancels; Tab stays in the dialog.',
      focus: 'The field takes focus with the name selected up to the extension. After saving or canceling, focus returns to the name or to the button that opened the dialog; an invalid name keeps focus in the field.',
      responsive: 'Inline, the field takes the name’s place, no wider than --plx-comp-rename-action-inline-width, and shrinks in a narrow container; the dialog is the small dialog at every width.',
      motion: 'None beyond the dialog’s own opening.',
      loading: 'When onRename returns a Promise the field stays busy (the dialog’s Rename shows the spinner) until it settles.',
      error: 'A broken rule or a rejected Promise keeps the field open with the message under it, marked invalid (aria-invalid, aria-describedby).'
    },
    a11y: {
      name: 'The field is named by its label ("File name"); inline, the read view says the label, the name and "edit".',
      announce: '"Renamed to …" is announced when the name is saved; the message of a broken rule is announced as it appears.',
      focus: 'Focus never lands at the top of the page.',
      contrast: 'The field’s own roles; the message is in the danger color and in words.',
      motion: 'Nothing moves.'
    },
    content: {
      labels: 'The action is "Rename" (a menu item or button that opens the dialog reads "Rename…"). The dialog’s title names the item ("Rename Cross 014.png").',
      actions: 'Rename and Cancel in the dialog; the primary action repeats the verb.',
      errors: 'Say what to change: "Enter a name", "A name can’t contain / or \\", "There’s already an item named Border 007.svg here".',
      localization: 'Every word is in strings; names are compared without regard to case in the reader’s locale.'
    }
  },
  'sortable-list': {
    purpose: 'People put a list in the order that matters to them — steps, priorities, pinned views — by dragging, by the keyboard or by a menu, and always see where an item will land.',
    anatomy: ['List — the items in a column or in rows that wrap (required)', 'Item — a row or a tile on the default surface with its frame (required)', 'Handle — the drag handle at the item’s start, the trigger of its menu of moves (optional, default)',
      'Insertion line — where the dragged item lands, in the gap (shown while dragging)', 'Move buttons — Move up and Move down at the item’s end (optional)'],
    behavior: {
      pointer: 'Press the handle (or the item with handles={false}; on touch, after a long press) and move past the slop: the item lifts and follows the pointer, and the insertion line shows where it lands. Release drops it; Escape puts it back. A click on the handle opens its menu of moves.',
      keyboard: 'Space or Enter on the handle picks the item up. Arrow Up and Down move it (in a grid also Left and Right, in reading order), and Home and End move it to the ends. Space or Enter drops it, Escape puts it back, and Tab drops it and moves on. In a group, Arrow Left and Right move it to the neighboring list.',
      focus: 'Focus stays on the moved item’s handle (or its move button) after every move and drop.',
      responsive: 'The grid fits as many tiles as the width allows (--plx-comp-sortable-list-tile-min-width); the items follow the density (a data row’s height).',
      motion: 'The lifted item follows the pointer; when it is put back it settles to its place (--plx-sys-gesture-settle-duration), at once with reduced motion. Near the edges of the scrolling region it scrolls.',
      loading: 'Not applicable: the page keeps the order; save it with the page’s own state.',
      error: 'An order that cannot be saved is the page’s message; the list shows the order it is given.'
    },
    a11y: {
      name: 'The list is named by label; each handle by the verb and the item ("Move Upload the scans"), with the instructions as its description.',
      announce: 'Every pick-up, move, drop and cancel: "Upload the scans, position 2 of 5".',
      focus: 'The handle is a button in the Tab order (aria-pressed while the item is picked up); the menu returns focus to it.',
      contrast: 'Items on the default surface with the subtle frame; the lifted item raised with the overlay shadow; the insertion line in the focus ring’s color.',
      motion: 'Reduced motion skips the settle.'
    },
    content: {
      labels: 'The list’s label is what it orders ("Steps"); the item’s own name in the handle and the announcements.',
      actions: 'Move up, Move down (Move earlier, Move later in a grid), Move to the start, Move to the end.',
      errors: 'Not applicable.',
      localization: 'Every word is in strings and DND_STRINGS; the arrow keys follow the writing direction.'
    }
  },
  'drag-handle': {
    purpose: 'One clear place to grab an item that also holds other controls, and one button that carries the keyboard drag and the menu of moves.',
    anatomy: ['Button — the inline control size, no fill at rest (required)', 'Drag icon — six dots, standing (vertical) or lying (horizontal) (required)', 'Menu of moves — when the handle is a Menu’s trigger (optional)'],
    behavior: {
      pointer: 'Shows the grab pointer on hover, and grabbing while held or while its item moves. A press that moves past the slop drags the item; a click without moving opens its menu.',
      keyboard: 'Space or Enter picks the item up; the arrow keys move it; Space or Enter drops it; Escape puts it back. While the item is picked up the arrow keys move it rather than open the menu.',
      focus: 'The focus ring around the handle; the handle keeps focus while its item moves.',
      responsive: 'At least the inline control size (24px), larger with touch. The handle takes the finger itself (touch-action none), so the page still scrolls elsewhere.',
      motion: 'None of its own.',
      loading: 'Not applicable.',
      error: 'Disabled when the item cannot move now: the disabled color and the not-allowed pointer.'
    },
    a11y: {
      name: 'A verb and the item: "Move Hero banner".',
      announce: 'The engine announces the pick-up, each move and the drop; the handle’s description holds the instructions.',
      focus: 'A button in the Tab order; aria-pressed true while its item is picked up.',
      contrast: 'The icon uses the muted content color at rest and the full content color on hover; the handle takes the selected fill while its item is picked up.',
      motion: 'Nothing moves.'
    },
    content: {
      labels: 'Always name the item: "Move Hero banner", "Move column Status".',
      actions: 'Its menu: Move up, Move down, Move to the start, Move to the end (or Move to a place).',
      errors: 'Not applicable.',
      localization: 'The label comes from the engine’s strings (handle: "Move {name}").'
    }
  },
  'drop-target': {
    purpose: 'A place says whether it takes what is over it before people let go, in words and shape as well as color, and the same move is open to the keyboard and a menu.',
    anatomy: ['Target — the dashed region (required)', 'Idle text — what it takes ("Drop images here") (required)', 'Highlight — the active fill and border while an item it takes is over it', 'Refusal — the danger border, the not-allowed pointer and rejectContent while one it does not take is over it'],
    behavior: {
      pointer: 'While an item is dragged over it the target highlights or refuses; release on a highlighted target drops the item (onDropItem); release on a refusing one puts the item back.',
      keyboard: 'A picked-up item (Space or Enter on its handle) moves from target to target with the arrow keys; Space or Enter drops it on the current one; Escape cancels.',
      focus: 'Focus stays on the item’s handle; the current target shows its highlight.',
      responsive: 'The zone’s own: full width of its column, its content centered.',
      motion: 'None of its own.',
      loading: 'What the drop starts (an upload, a move) shows its own progress.',
      error: 'A refused item says why in rejectContent; nothing changes.'
    },
    a11y: {
      name: 'name: its name in the announcements ("Over Pictures", "Documents does not take Cross 014.png").',
      announce: 'Each target as the item reaches it, refused or not, and the drop.',
      focus: 'Not focusable itself: the keyboard reaches it through the item it takes.',
      contrast: 'The refusal is the danger border, the not-allowed pointer and words: never color alone.',
      motion: 'Nothing moves.'
    },
    content: {
      labels: 'Idle text that names what it takes: "Drop images here".',
      actions: 'Pair it with a Move to action on the item, or a Choose files button.',
      errors: 'rejectContent says why: "Pictures takes images only".',
      localization: 'The words are the page’s; the announcements come from DND_STRINGS.'
    }
  },
  'resizable': {
    purpose: 'People give room to what matters to them — a preview, a note, a picture, a pane — within limits that keep the content usable, by dragging or by the keyboard.',
    anatomy: ['Box — the area that changes size (required)', 'Edge — the end edge, the bottom edge or both: a wide hit area with a line on hover and focus (required)', 'Corner — the pointer’s handle for both directions (axis="both")'],
    behavior: {
      pointer: 'Drag an edge or the corner; the size follows in size-token steps and stops at the limits; the page shows the resize pointer.',
      keyboard: 'Each edge is a separator in the Tab order: Arrow Left and Right (the end edge, mirrored in a right-to-left page) or Arrow Up and Down (the bottom edge) step to the next size; Home and End go to the limits.',
      focus: 'The edge’s line in the focus ring’s color is its focus indicator.',
      responsive: 'The box is never wider than its container (max-inline-size 100%). A drag stops at 1600px, the largest size token, and at 90% of the window (--plx-sys-shell-pane-window-share), taken down to the 4px grid; a smaller maxWidth still applies. The panes of the shell follow the same ceiling.',
      motion: 'The line appears over --plx-comp-resizable-edge-duration.',
      loading: 'Not applicable.',
      error: 'Not applicable: the limits stop the size.'
    },
    a11y: {
      name: 'Each edge is named by the label and the axis ("Preview width", "Preview height"), with aria-valuenow, -valuemin and -valuemax in pixels.',
      announce: 'Screen readers read the separator’s new value as it changes.',
      focus: 'Each edge is one Tab stop.',
      contrast: 'The edge’s line in the focus ring’s color.',
      motion: 'Nothing animates but the line’s appearance.'
    },
    content: {
      labels: 'Name what is resized: "Preview".',
      errors: 'Not applicable.',
      localization: 'Every word is in strings; the end edge follows the writing direction.'
    }
  },
  'drag-and-drop': {
    purpose: 'Moving something by dragging is a fast shortcut, never the only way: every drag has a keyboard way and a single-pointer way, shows where the item lands, and is announced.',
    anatomy: ['Draggable item — with a handle (DragHandle) or dragging as a whole (required)', 'Lifted item — the item itself, raised, following the pointer (while dragging)', 'Drop target — a place that takes it, highlighted or refusing (required)', 'Drop position — the insertion line in a list (while dragging)', 'Alternative — a Move to menu, move buttons or the keyboard (required)'],
    behavior: {
      pointer: 'A press on the handle that moves past the slop starts the drag; the targets under the pointer show their state; release drops, Escape cancels.',
      keyboard: 'Space or Enter on the handle picks the item up; the arrow keys choose the place or the target; Space or Enter drops; Escape cancels.',
      focus: 'Focus stays on the item’s handle from pick-up to drop.',
      responsive: 'On touch a handle drags at once; an item without a handle drags after a long press so the page still scrolls.',
      motion: 'The lifted item follows the pointer; a cancel settles it back (at once with reduced motion); the region under the pointer scrolls near its edges.',
      loading: 'What a drop starts shows its own progress.',
      error: 'A refused drop leaves everything as it was and says why.'
    },
    a11y: {
      name: 'Handles name the item ("Move Cross 014.png"); targets their place.',
      announce: 'Pick-up, each place or target, the drop and a cancel, through the live region.',
      focus: 'The handle keeps focus; the Move to menu returns it.',
      contrast: 'The lifted item raised; targets with outlines and words, never color alone.',
      motion: 'Reduced motion skips the settle.'
    },
    content: {
      labels: 'Targets say what they take; the alternative reads Move to.',
      actions: 'Move to {place}; Move up, Move down for lists.',
      errors: '"{target} does not take {name}".',
      localization: 'DND_STRINGS hold the announcements.'
    }
  },
  'reposition': {
    purpose: 'People place an element where it means something to them — a note on a board, a layer on a canvas — by pointer, by keyboard or by a menu, and it always lands on the grid inside its frame.',
    anatomy: ['Element — focusable, with its name (required)', 'Frame — the area it stays in (bounds) (required)', 'Move menu — Move left, right, up and down (required)'],
    behavior: {
      pointer: 'Press and move past the slop: the element follows the pointer; release places it on the grid inside the frame; Escape puts it back.',
      keyboard: 'Space or Enter picks it up; the arrow keys move it (--plx-sys-dnd-keyboard-step, Shift --plx-sys-dnd-keyboard-step-large) the way they point; Space or Enter drops it; Escape puts it back.',
      focus: 'The element keeps focus while it moves; the Move menu returns focus to its button.',
      responsive: 'The frame bounds every move; a narrower frame keeps the element inside.',
      motion: 'The element follows the pointer by a transform; reduced motion changes nothing else.',
      loading: 'Not applicable.',
      error: 'Not applicable: the frame stops the move.'
    },
    a11y: {
      name: 'The element’s name, its role description "movable" and the instructions as its description.',
      announce: 'Pick-up, each move, the drop and a cancel.',
      focus: 'One Tab stop per element; aria-pressed while it is picked up.',
      contrast: 'The element raised while it moves.',
      motion: 'Nothing animates but the move itself.'
    },
    content: {
      labels: 'Name each element ("Cover ideas").',
      actions: 'Move left, Move right, Move up, Move down.',
      errors: 'Not applicable.',
      localization: 'The arrow keys go the way they point in either writing direction.'
    }
  },
  'accessible-drag-and-drop': {
    purpose: 'Everyone can move what others drag: people who use the keyboard, a screen reader, a switch or one pointer get the same moves, the same feedback and the same result.',
    anatomy: ['Drag source — the item’s handle, a button (required)', 'Instructions — the handle’s description (required)', 'Keyboard drag — pick up, move, drop, cancel (required)', 'Single-pointer alternative — a menu of moves or move buttons (required)', 'Announcer — the live region (required)'],
    behavior: {
      pointer: 'A menu of moves or move buttons give every move to a single click (WCAG 2.2, 2.5.7).',
      keyboard: 'Space or Enter picks up; the arrow keys move (Home, End to the ends; Shift for a large step); Space or Enter drops; Escape cancels; Tab drops and moves on.',
      focus: 'Focus stays on the moved item’s handle after every move, also when the item moves to another list.',
      responsive: 'The same keys and menus with touch; the handle is at least the inline control size.',
      motion: 'Reduced motion skips the settle; key moves scroll the item into view.',
      loading: 'Not applicable.',
      error: 'A move that is not possible says so ("No place takes …").'
    },
    a11y: {
      name: 'Handles are named with the verb and the item; targets and lists, with their place.',
      announce: 'Pick-up with the instructions, each new position ("2 of 5") or target, the drop and a cancel.',
      focus: 'aria-pressed on the handle while the item is picked up.',
      contrast: 'Valid and invalid targets differ by outline style, pointer and words as well as color.',
      motion: 'Reduced motion meets 2.3.3 Animation from interactions.'
    },
    content: {
      labels: 'Short verbs: Move up, Move down, Move to …',
      actions: 'The same names in the menu and in the announcements.',
      errors: 'Say what is not possible and why.',
      localization: 'DND_STRINGS and each pattern’s strings hold every word.'
    }
  },
  'dnd-engine': {
    purpose: 'One engine gives every drag in the Platform the same feel, the same keyboard way, the same announcements and the same look, so no page writes drag code of its own.',
    anatomy: ['Session — the one drag under way, shared by every list, item and target (useDndSession)', 'Sources — useSortable’s items, useDraggable, useReposition (required)', 'Targets — useDropTarget, the lists of a group (required)',
      'Auto-scroll — the scrolling region near the pointer', 'Announcer — announce() with DND_STRINGS', 'States — the attributes system/dnd.css draws'],
    behavior: {
      pointer: 'Mouse and pen drag past --plx-sys-gesture-slop. Touch drags at once on a handle, and after the long-press delay on an item. The pointer is followed outside the element; a canceled pointer puts the item back.',
      keyboard: 'Every hook has the same keys: Space or Enter, the arrows, Escape, Tab.',
      focus: 'The handle keeps focus; useSortable refocuses the moved item’s handle after the page re-renders.',
      responsive: 'Auto-scroll near the edges of the nearest scrolling region or the window (--plx-sys-dnd-autoscroll-edge, -speed).',
      motion: 'A moving element is moved by a transform through the Web Animations API, snapped to the grid; a cancel settles back over --plx-sys-gesture-settle-duration, at once with reduced motion.',
      loading: 'Not applicable.',
      error: 'The engine never changes a list itself: onReorder and onMove hand the result to the page.'
    },
    a11y: {
      name: 'handleProps name the item; the instructions are the handle’s description (aria-describedby).',
      announce: 'Every pick-up, move, drop and cancel through announce().',
      focus: 'aria-pressed while picked up; focus restored after each move.',
      contrast: 'The drag treatment’s roles (raised surface, overlay shadow, focus ring color, danger color).',
      motion: 'Reduced motion respected.'
    },
    content: {
      labels: 'DND_STRINGS: handle "Move {name}" and the announcements.',
      actions: 'The patterns add their menus of moves.',
      errors: 'overReject, noTargets.',
      localization: 'Pass strings to each hook; the arrow keys follow the writing direction (a free move goes the way the arrow points).'
    }
  }
});
