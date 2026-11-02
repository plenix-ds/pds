/* Plenix · RichTextEditor
   Summary: A field for formatted text: a formatting toolbar (the Platform Toolbar, Buttons and Menus) over an editing
     area that shows the text as RichText does. The editing engine is Tiptap 3.31.3 (MIT, on ProseMirror), vendored in
     platform/vendor/tiptap/ and loaded the first time an editor mounts; the editor offers all of Tiptap's free formatting
     with Tiptap's own keyboard behavior.
   Usage:
     <RichTextEditor label="Description" defaultValue={html} onChange={(html) => …} />
     <RichTextEditor label="Notes" toolbar="full" placeholder="Describe the change" />
     <RichTextEditor label="Comment" mentions={{ search: (q) => people.filter((p) => p.label.startsWith(q)) }} />
     <RichTextEditor label="Description" readOnly defaultValue={html} />
     RichTextEditor.preload()   // a page whose first screen has an editor: starts loading the engine as its script starts
   Props:
     label: the accessible name of the editing area (required; give a visible label with Field or a heading)
     defaultValue: the starting HTML; it is cleaned to the allowed elements (see Notes) before it is shown
     onChange(html): runs after each change with the cleaned HTML of the content ('' when the area is empty)
     toolbar: "basic" (default: bold, italic, link, bulleted and numbered list) | "full" (every format, in groups: text
       style (paragraph, heading 1–6); font and size; bold, italic, underline, strikethrough, inline code, subscript,
       superscript; text color and highlight; align left, center, right, justify; bulleted, numbered and task list;
       insert link, image, table, code block, quote, horizontal rule; undo, redo, clear formatting) | false (no toolbar;
       the shortcuts still work)
     markdownShortcuts: Tiptap's input rules as you type (default true): "- " or "* " a bulleted list, "1. " a numbered
       list, "[ ] " a task list, "# " to "###### " a heading 1 to 6, "> " a quote, "```" a code block, "---" a horizontal
       rule; **bold**, *italic*, ~~strike~~, ==highlight== and `code` around words; typography: "smart quotes", -- an em
       dash, ... an ellipsis, (c) ©, -> →
     mentions: the mentions slot: { trigger: "@" (default), search(query) → options or a Promise of them ([{ value, label }]),
       renderOption(option) (the row's content; default its label) }; typing the trigger opens the list under the caret.
       Give it when the editor mounts (the engine is set up once); a new search function is used from the next keystroke.
     placeholder: the hint in the empty area
     readOnly: shows the content without the toolbar; it can be selected and copied, not changed (default false)
     invalid: marks the area invalid (aria-invalid); put the message in Field's error
     warning: true shows a warning state beside invalid (a Field with a warning sets it): a warning border and fill; the Field draws its icon and message
     disabled: the area cannot be used (default false)
     strings: the words it shows, for other languages (the richTextEditor section of i18n/en.js: every button, menu and field name; on(name),
       off(name) announce a format turned on or off from the keyboard; tip(name, keys) is a button's tooltip; leave is
       announced after Escape)
     className: more classes on the editor
     id: the id of the editing area (a Field sets it)
     dir, lang: the editor's writing direction and language, for an editor in the other direction than its page (an Arabic
       answer in an English form: dir="rtl" lang="ar"). They go on the editor's root, so the toolbar mirrors, the editing
       area and its lists start on that side, and spelling follows the language; without them the editor follows the page
       (issue 413)
   Behavior:
     The toolbar is one Tab stop (arrow keys move inside it). Its groups that do not fit the frame's width move, in
       order from the end, into a More formatting menu at the end of the row (the Platform overflow: utils/overflow.ts).
       Its buttons are icon-only ghost buttons named by their format (aria-label), each with a tooltip of the name and
       its shortcut as hotkeyLabel writes it (Bold (Ctrl B); Bold (⌘ B) on a Mac) and aria-keyshortcuts. A format button
       shows whether the text at the caret has that format (aria-pressed). Text style, font, size and table are menus.
       Pressing a button keeps the selection in the area; choosing from a menu returns the focus to the area.
     Keyboard: Tiptap's own shortcuts (Command on a Mac for Ctrl): Ctrl+B bold, Ctrl+I italic, Ctrl+U underline,
       Ctrl+Shift+S strikethrough, Ctrl+E inline code, Ctrl+, subscript, Ctrl+. superscript, Ctrl+Shift+H highlight,
       Ctrl+Alt+0 paragraph, Ctrl+Alt+1 to 6 heading 1 to 6, Ctrl+Shift+L / E / R / J align left, center, right,
       justify, Ctrl+Shift+8 bulleted list, Ctrl+Shift+7 numbered list, Ctrl+Shift+9 task list, Ctrl+Shift+B quote,
       Ctrl+Alt+C code block, Shift+Enter or Ctrl+Enter a line break, Ctrl+Z undo, Ctrl+Shift+Z or Ctrl+Y redo; and
       Plenix's Ctrl+K link. A format turned on or off from the keyboard is announced ("Bold on").
     Tab and Shift+Tab are Tiptap's: in a list item they nest it and lift it out, in a table they move to the next and
       the previous cell (Tab in the last cell adds a row); elsewhere they move the focus out of the area. To leave the
       area from anywhere: Escape, then Tab or Shift+Tab (Escape announces it; the area's description says it too).
     Backspace right after a Markdown shortcut turns it back into the typed characters (Tiptap's input rules).
     Link: with the caret in a link it removes the link; otherwise the link field opens under the toolbar (Enter adds the
       link, Escape closes it); an address without a scheme gets https://. Image: the image field takes an address and
       a description (the alternative text). Text color and highlight: the color field offers suggested swatches (the
       category colors), a custom color (a hex value or the browser's color input) and Remove. Custom font and size:
       the menus' Custom item opens a field for any font family or size.
     Paste inserts plain text (a line break starts a new paragraph), so formatting from other documents never comes in.
     Mentions: ↓ / ↑ move in the list, Enter or Tab inserts the mention (one unit, removed with one Backspace), Escape closes it.
     The area grows with its text up to its maximum height, then scrolls inside (it is focusable, so the keyboard reaches it).
     Until the engine has loaded (the first editor on a page) the area shows the cleaned content without editing; a failed
       load leaves it so, and the next editor that mounts tries again.
   Notes:
     The rule: the editor's interface (the frame, toolbar, menus, fields and swatches) follows the design system, on its
       tokens and fonts; the content is the person's own: the colors, fonts, sizes and alignment they choose are kept as
       Tiptap stores them (an inline style on the text), and the area and RichText output carry plx-user-content, the
       marker the style audit and the page checks read to allow exactly those properties there.
     The engine: Tiptap (@tiptap/core, pm, starter-kit, extension-list, extension-mention, extension-table,
       extension-text-style, extension-text-align, extension-highlight, extension-subscript, extension-superscript,
       extension-image, extension-typography 3.31.3, MIT), driven directly (no @tiptap/react). The table draws no column
       group (no column resizing) and the task item draws its own checkbox (the Platform checkbox's class), so the engine
       writes no style of its own.
     Allowed elements (cleanRichText): p, br, strong, em, u, s, code, sub, sup, mark, a (href: http, https, mailto or a
       relative address), span (a mention, or the person's text style), h1–h6, ul, ol (start), li, blockquote, pre, hr,
       img (src: http, https or a relative address; alt, title), table, tbody, tr, th, td (colspan, rowspan), task lists
       (ul data-type="taskList", li data-type="taskItem" data-checked, its label, checkbox and div). Style attributes keep
       only color, background-color, font-family, font-size and text-align; everything else is unwrapped or dropped.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { useFloating, TOP_LAYER } from '../../utils/floating.ts';
import { useOverflow, splitAt } from '../../utils/overflow.ts';
import { Toolbar } from '../Toolbar/Toolbar.jsx';
import { Button } from '../Button/Button.tsx';
import { Input } from '../Input/Input.tsx';
import { Tooltip } from '../Tooltip/Tooltip.tsx';
import { Menu, MenuItem, MenuGroup, MenuDivider, MenuRadioGroup, MenuSub } from '../Menu/Menu.jsx';
import { ColorSwatch } from '../ColorSwatch/ColorSwatch.jsx';
import { CATEGORY_COLORS } from '../ColorSwatch/categoryColors.js';
import { hotkeyLabel, isMac } from '../../utils/hotkey.ts';
import { loadTiptap } from './tiptap.js';
import { cleanRichText, RICH_TEXT_STYLE_PROPERTIES, SAFE_HREF, SAFE_SRC } from '../../utils/richTextClean.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import { useReadOnly } from '../../providers/ReadOnly.tsx';
import { formatNumber } from '../../utils/format.ts';
import AddColumnLeftIcon from 'plenix-platform/icons/plenix/add-column-left';
import AddColumnRightIcon from 'plenix-platform/icons/plenix/add-column-right';
import AddRowAboveIcon from 'plenix-platform/icons/plenix/add-row-above';
import AddRowBelowIcon from 'plenix-platform/icons/plenix/add-row-below';
import ChecklistIcon from 'plenix-platform/icons/plenix/checklist';
import CodeIcon from 'plenix-platform/icons/plenix/code';
import CodeBlocksIcon from 'plenix-platform/icons/plenix/code-blocks';
import EdAlignCenterIcon from 'plenix-platform/icons/plenix/ed-align-center';
import EdAlignJustifyIcon from 'plenix-platform/icons/plenix/ed-align-justify';
import EdAlignLeftIcon from 'plenix-platform/icons/plenix/ed-align-left';
import EdAlignRightIcon from 'plenix-platform/icons/plenix/ed-align-right';
import EdImageIcon from 'plenix-platform/icons/plenix/ed-image';
import EdRedoIcon from 'plenix-platform/icons/plenix/ed-redo';
import EdUndoIcon from 'plenix-platform/icons/plenix/ed-undo';
import FormatBoldIcon from 'plenix-platform/icons/plenix/format-bold';
import FormatClearIcon from 'plenix-platform/icons/plenix/format-clear';
import FormatColorTextIcon from 'plenix-platform/icons/plenix/format-color-text';
import FormatItalicIcon from 'plenix-platform/icons/plenix/format-italic';
import FormatListNumberedIcon from 'plenix-platform/icons/plenix/format-list-numbered';
import FormatQuoteIcon from 'plenix-platform/icons/plenix/format-quote';
import FormatStrikethroughIcon from 'plenix-platform/icons/plenix/format-strikethrough';
import FormatUnderlinedIcon from 'plenix-platform/icons/plenix/format-underlined';
import HorizontalRuleIcon from 'plenix-platform/icons/plenix/horizontal-rule';
import InkHighlighterIcon from 'plenix-platform/icons/plenix/ink-highlighter';
import LinkIcon from 'plenix-platform/icons/plenix/link';
import ListBulletsIcon from 'plenix-platform/icons/plenix/list-bullets';
import MoreIcon from 'plenix-platform/icons/plenix/more';
import SubscriptIcon from 'plenix-platform/icons/plenix/subscript';
import SuperscriptIcon from 'plenix-platform/icons/plenix/superscript';
import TableIcon from 'plenix-platform/icons/plenix/table';
import TrashIcon from 'plenix-platform/icons/plenix/trash';
export { cleanRichText, RICH_TEXT_STYLE_PROPERTIES };


// the toolbar's icons (Material Symbols Sharp, platform/icons/map.json)
const ICONS = { bold: FormatBoldIcon, italic: FormatItalicIcon, underline: FormatUnderlinedIcon, strike: FormatStrikethroughIcon, code: CodeIcon,
  subscript: SubscriptIcon, superscript: SuperscriptIcon, link: LinkIcon, bulleted: ListBulletsIcon, numbered: FormatListNumberedIcon, tasks: ChecklistIcon,
  quote: FormatQuoteIcon, codeBlock: CodeBlocksIcon, rule: HorizontalRuleIcon, image: EdImageIcon, table: TableIcon, color: FormatColorTextIcon,
  highlight: InkHighlighterIcon, alignLeft: EdAlignLeftIcon, alignCenter: EdAlignCenterIcon, alignRight: EdAlignRightIcon,
  alignJustify: EdAlignJustifyIcon, clear: FormatClearIcon, undo: EdUndoIcon, redo: EdRedoIcon,
  rowBefore: AddRowAboveIcon, rowAfter: AddRowBelowIcon, columnBefore: AddColumnLeftIcon, columnAfter: AddColumnRightIcon, deleteTable: TrashIcon };
// each shortcut as a binding (Tiptap's defaults, and Plenix's Ctrl+K): shown as people read it and named for aria-keyshortcuts
const KEYS = { bold: 'Mod+B', italic: 'Mod+I', underline: 'Mod+U', strike: 'Mod+Shift+S', code: 'Mod+E', subscript: 'Mod+,', superscript: 'Mod+.',
  highlight: 'Mod+Shift+H', link: 'Mod+K', bulleted: 'Mod+Shift+8', numbered: 'Mod+Shift+7', tasks: 'Mod+Shift+9', quote: 'Mod+Shift+B',
  codeBlock: 'Mod+Alt+C', alignLeft: 'Mod+Shift+L', alignCenter: 'Mod+Shift+E', alignRight: 'Mod+Shift+R', alignJustify: 'Mod+Shift+J',
  undo: 'Mod+Z', redo: () => (isMac() ? 'Mod+Shift+Z' : 'Mod+Y'), paragraph: 'Mod+Alt+0', h1: 'Mod+Alt+1', h2: 'Mod+Alt+2', h3: 'Mod+Alt+3',
  h4: 'Mod+Alt+4', h5: 'Mod+Alt+5', h6: 'Mod+Alt+6' };
const keysOf = (name) => (typeof KEYS[name] === 'function' ? KEYS[name]() : KEYS[name]);
const keysAria = (binding) => binding.replace('Mod', isMac() ? 'Meta' : 'Control');

// the person's fonts and sizes to choose from (content, not interface: any family or size can be typed in too)
const RICH_TEXT_FONTS = [['DM Sans', '"DM Sans", sans-serif'], ['Reddit Mono', '"Reddit Mono", monospace'], ['Arial', 'Arial, sans-serif'],
  ['Helvetica', 'Helvetica, Arial, sans-serif'], ['Verdana', 'Verdana, sans-serif'], ['Tahoma', 'Tahoma, sans-serif'], ['Trebuchet MS', '"Trebuchet MS", sans-serif'],
  ['Georgia', 'Georgia, serif'], ['Times New Roman', '"Times New Roman", serif'], ['Garamond', 'Garamond, serif'], ['Courier New', '"Courier New", monospace']];
const RICH_TEXT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

// the mention list goes to the top layer only where the browser also places it by anchor (as Menu and Popover): without
const MENTION_CLASS = 'plx-rich-text-editor__mention';
const CHECK_CLASS = 'plx-check__input';
const USER_CONTENT = 'plx-user-content';

// what the toolbar shows for the text at the caret, read from the editor
const MARKS = { bold: 'bold', italic: 'italic', underline: 'underline', strike: 'strike', code: 'code', subscript: 'subscript', superscript: 'superscript',
  link: 'link', highlight: 'highlight', bulleted: 'bulletList', numbered: 'orderedList', tasks: 'taskList', quote: 'blockquote', codeBlock: 'codeBlock' };
const ALIGNS = { alignLeft: 'left', alignCenter: 'center', alignRight: 'right', alignJustify: 'justify' };
function readState(ed) {
  const f = {};
  Object.keys(MARKS).forEach((k) => { f[k] = ed.isActive(MARKS[k]); });
  Object.keys(ALIGNS).forEach((k) => { f[k] = ed.isActive({ textAlign: ALIGNS[k] }); });
  f.block = 'paragraph';
  for (let n = 1; n <= 6; n += 1) if (ed.isActive('heading', { level: n })) f.block = 'h' + n;
  const ts = ed.getAttributes('textStyle');
  f.font = ts.fontFamily || ''; f.size = ts.fontSize || ''; f.textColor = ts.color || '';
  f.table = ed.isActive('table');
  f.headerRow = false;
  const at = ed.state.selection.$from;
  for (let d = at.depth; d > 0; d -= 1) {
    const n = at.node(d);
    if (n.type.name === 'table') { const cell = n.firstChild && n.firstChild.firstChild; f.headerRow = !!cell && cell.type.name === 'tableHeader'; break; }
  }
  f.undo = ed.can().undo(); f.redo = ed.can().redo();
  return f;
}

// a computed color (rgb() or rgba()) as a hex value, for the person's content
const toHex = (rgb) => {
  if (/^#[0-9a-f]{3,6}$/i.test(String(rgb))) return String(rgb);
  const m = String(rgb).match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return '';
  return '#' + m.slice(0, 3).map((v) => Math.round(Number(v)).toString(16).padStart(2, '0')).join('');
};
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

// the engine set up for this editor: the starter kit with every format, the official free extensions, a table without
// its column group, a task item with the Platform checkbox, the mention node (its suggestion list only when the editor
// has a mentions slot), Plenix's Ctrl+K and the announcements of the format shortcuts
function makeEditor(T, el, o) {
  const trigger = o.trigger;
  const PlenixKeys = T.Extension.create({
    name: 'plenixKeys',
    priority: 1000,
    addKeyboardShortcuts() {
      const key = (name) => () => { o.apply(name, true); return true; };
      const out = { 'Mod-k': key('link') };
      // Tiptap's own shortcuts, run through the same commands so a format turned on or off is announced
      [['Mod-b', 'bold'], ['Mod-i', 'italic'], ['Mod-u', 'underline'], ['Mod-Shift-s', 'strike'], ['Mod-e', 'code'], ['Mod-,', 'subscript'],
        ['Mod-.', 'superscript'], ['Mod-Shift-h', 'highlight'], ['Mod-Shift-7', 'numbered'], ['Mod-Shift-8', 'bulleted'], ['Mod-Shift-9', 'tasks']]
        .forEach((k) => { out[k[0]] = key(k[1]); });
      return out;
    }
  });
  const PlenixMention = T.Mention.extend({
    parseHTML() { return [{ tag: 'span[data-mention]' }]; },
    addAttributes() {
      return {
        id: { default: null, parseHTML: (e) => e.getAttribute('data-mention'), renderHTML: (a) => ({ 'data-mention': a.id }) },
        label: { default: null, parseHTML: (e) => { const s = e.textContent || ''; return s.indexOf(trigger) === 0 ? s.slice(trigger.length) : s; }, renderHTML: () => ({}) },
        mentionSuggestionChar: { default: trigger, parseHTML: () => trigger, renderHTML: () => ({}) }
      };
    },
    addProseMirrorPlugins() { return o.mentions ? this.parent() : []; }
  }).configure({
    deleteTriggerWithBackspace: true,
    HTMLAttributes: { class: MENTION_CLASS, contenteditable: 'false' },
    suggestion: {
      char: trigger,
      decorationClass: 'plx-rich-text-editor__mention-query',
      items: ({ query }) => Promise.resolve(o.search(query)).then((items) => (Array.isArray(items) ? items : []), () => []),
      render: () => ({ onStart: o.suggest, onUpdate: o.suggest, onKeyDown: o.suggestKey, onExit: () => o.suggest(null) })
    }
  });
  // a table without the engine's column group and widths (no column resizing): nothing written inline
  const PlenixTable = T.Table.extend({ renderHTML({ HTMLAttributes }) { return ['table', HTMLAttributes, ['tbody', 0]]; } }).configure({ View: null, resizable: false });
  const noWidth = (Cell) => Cell.extend({ addAttributes() { const a = Object.assign({}, this.parent()); delete a.colwidth; return a; } });
  // a task item whose checkbox is the Platform checkbox (named by its text), in place of the engine's view
  const PlenixTaskItem = T.TaskItem.extend({
    addNodeView() {
      return ({ node, getPos, editor }) => {
        const doc = el.ownerDocument;
        const item = doc.createElement('li'), label = doc.createElement('label'), box = doc.createElement('input'), content = doc.createElement('div');
        label.contentEditable = 'false'; box.type = 'checkbox'; box.className = CHECK_CLASS;
        const show = (n) => { item.setAttribute('data-type', 'taskItem'); item.setAttribute('data-checked', n.attrs.checked ? 'true' : 'false'); box.checked = !!n.attrs.checked; box.setAttribute('aria-label', n.textContent || o.strings().tasks); };
        show(node);
        box.addEventListener('mousedown', (e) => e.preventDefault());
        box.addEventListener('change', () => {
          if (!editor.isEditable || typeof getPos !== 'function') { box.checked = !box.checked; return; }
          editor.chain().focus(undefined, { scrollIntoView: false }).command(({ tr }) => {
            const at = getPos(); if (typeof at !== 'number') return false;
            const cur = tr.doc.nodeAt(at); tr.setNodeMarkup(at, undefined, Object.assign({}, cur && cur.attrs, { checked: box.checked })); return true;
          }).run();
        });
        label.appendChild(box); item.append(label, content);
        return { dom: item, contentDOM: content, update: (n) => { if (n.type !== this.type) return false; show(n); return true; } };
      };
    }
  });
  return new T.Editor({
    element: { mount: el },
    injectCSS: false,
    content: o.content,
    editable: o.editable,
    enableInputRules: o.markdown,
    enablePasteRules: false,
    extensions: [
      T.StarterKit.configure({
        dropcursor: false, gapcursor: false, trailingNode: false,
        link: { openOnClick: false, autolink: false, linkOnPaste: false, HTMLAttributes: { target: null, rel: null, class: null }, isAllowedUri: (url) => SAFE_HREF.test(String(url || '').trim()) }
      }),
      T.TaskList, PlenixTaskItem.configure({ nested: true }),
      PlenixTable, T.TableRow, noWidth(T.TableHeader), noWidth(T.TableCell),
      T.TextStyle, T.Color, T.FontFamily, T.FontSize, T.Highlight.configure({ multicolor: true }),
      T.TextAlign.configure({ types: ['heading', 'paragraph'] }), T.Subscript, T.Superscript,
      T.Image.configure({ inline: false, allowBase64: false }), o.markdown ? T.Typography : null,
      PlenixMention, PlenixKeys
    ].filter(Boolean),
    editorProps: { attributes: o.attributes, handlePaste: o.paste, handleDOMEvents: { keydown: o.keydown } }
  });
}

export function RichTextEditor({ label, defaultValue = '', onChange, toolbar = 'basic', markdownShortcuts = true, mentions, placeholder, readOnly: readOnlyOwn,
  invalid, warning, disabled = false, strings, className, id, ...rest }) {
  const readOnly = useReadOnly(readOnlyOwn);   // its own readOnly, else the nearest ReadOnly region's
  const t = useStrings('richTextEditor', strings);
  // heading and tip are messages with {n}, {name} and {keys}; an app's own function in strings still works
  const headingText = (n) => (typeof t.heading === 'function' ? t.heading(n) : String(t.heading).replace('{n}', () => formatNumber(n)));
  const tipText = (name, keys) => (typeof t.tip === 'function' ? t.tip(name, keys) : String(t.tip).replace('{name}', () => name).replace('{keys}', () => keys));
  const auto = useUid('plx-rte');
  const areaId = id || auto + '-area';
  const area = React.useRef(null), list = React.useRef(null), firstField = React.useRef(null), groupsRef = React.useRef(null), picker = React.useRef(null);
  const editorRef = React.useRef(null), saved = React.useRef(null), pasting = React.useRef(false), escaped = React.useRef(false);
  const [ready, setReady] = React.useState(false);
  const [formats, setFormats] = React.useState({});
  const [empty, setEmpty] = React.useState(() => !String(defaultValue || '').replace(/<[^>]*>/g, '').trim());
  const [bar, setBar] = React.useState(null);           // the field under the toolbar: { kind: link | image | font | size | color | highlight }
  const [values, setValues] = React.useState({});       // its fields' values
  const [mention, setMention] = React.useState(null);   // { items, active, x, y, command }
  const editable = !readOnly && !disabled;
  const live = React.useRef({}); live.current = { onChange, editable, mentions, mention, t };

  const mentionOpen = !!(mention && mention.items.length);
  // the editing area's attributes: ProseMirror owns the element, so they go through the engine (and onto the element
  // itself until the engine has loaded)
  const attributes = { id: areaId, class: cx('plx-rich-text', 'plx-rich-text--compact', 'plx-rich-text-editor__area', USER_CONTENT, empty && 'is-empty'),
    role: 'textbox', 'aria-multiline': 'true', 'aria-label': label, 'aria-description': editable ? t.hint : null, 'aria-readonly': readOnly ? 'true' : null,
    'aria-disabled': disabled ? 'true' : null, 'aria-invalid': invalid ? 'true' : null, 'aria-placeholder': placeholder || null,
    'data-placeholder': placeholder || null, tabindex: disabled ? '-1' : '0',
    'aria-autocomplete': mentions ? 'list' : null, 'aria-controls': mentionOpen ? auto + '-mentions' : null,
    'aria-activedescendant': mentionOpen ? auto + '-m' + mention.active : null };
  Object.keys(attributes).forEach((k) => { if (attributes[k] == null || attributes[k] === false) delete attributes[k]; });
  const attrKey = JSON.stringify(attributes);
  const shown = React.useRef({});
  React.useLayoutEffect(() => {
    const ed = editorRef.current, el = area.current;
    if (ed && !ed.isDestroyed) { ed.view.setProps({ attributes }); return; }
    if (!el) return;
    Object.keys(shown.current).forEach((k) => { if (!(k in attributes)) el.removeAttribute(k); });
    Object.keys(attributes).forEach((k) => el.setAttribute(k, attributes[k]));
    shown.current = attributes;
  }, [attrKey, ready]);   // eslint-disable-line react-hooks/exhaustive-deps

  // the engine: the cleaned content shows at once; the editor takes over the same element once Tiptap has loaded
  React.useLayoutEffect(() => {
    const el = area.current; if (!el) return undefined;
    const content = cleanRichText(defaultValue);
    el.innerHTML = content;
    let gone = false;
    loadTiptap(el.ownerDocument.defaultView).then((T) => {
      if (gone) return;
      const ed = makeEditor(T, el, {
        content, editable: live.current.editable, markdown: markdownShortcuts, attributes,
        trigger: (mentions && mentions.trigger) || '@', mentions: !!mentions, strings: () => live.current.t,
        apply: (name, fromKeys) => apply(name, fromKeys),
        search: (q) => { const m = live.current.mentions; return m && m.search ? m.search(q) : []; },
        suggest: (p) => {
          if (!p || !p.items || !p.items.length) { setMention(null); return; }
          const box = p.clientRect ? p.clientRect() : null;
          setMention({ items: p.items, active: 0, x: box ? box.left : 0, y: box ? box.bottom : 0, command: p.command });
        },
        suggestKey: ({ event }) => {
          const m = live.current.mention; if (!m || !m.items.length) return false;
          const n = m.items.length;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { setMention(Object.assign({}, m, { active: (m.active + (event.key === 'ArrowDown' ? 1 : n - 1)) % n })); return true; }
          if (event.key === 'Enter' || event.key === 'Tab') { pick(m, m.items[m.active]); return true; }
          if (event.key === 'Escape') { setMention(null); return true; }
          return false;
        },
        // Escape, then Tab or Shift+Tab, always leaves the area: the browser moves the focus (nothing handles that Tab)
        keydown: (view, e) => {
          if (e.key === 'Escape') {
            const m = live.current.mention;
            if (!(m && m.items.length)) { escaped.current = true; announce(live.current.t.leave); }
            return false;
          }
          if (e.key === 'Tab' && escaped.current && !e.ctrlKey && !e.altKey && !e.metaKey) { escaped.current = false; return true; }
          if (['Shift', 'Control', 'Alt', 'Meta'].indexOf(e.key) < 0) escaped.current = false;
          return false;
        },
        paste: (view, event) => {
          if (pasting.current) return false;
          const text = event.clipboardData ? event.clipboardData.getData('text/plain') : '';
          event.preventDefault();
          if (!text || !live.current.editable) return true;
          pasting.current = true;
          try { view.pasteText(text, event); } finally { pasting.current = false; }
          return true;
        }
      });
      editorRef.current = ed;
      let last = '';
      const sync = () => {
        const f = readState(ed), key = JSON.stringify(f);
        if (key !== last) { last = key; setFormats(f); }
        setEmpty(ed.isEmpty);
      };
      ed.on('transaction', sync);
      ed.on('update', () => { const cb = live.current.onChange; if (cb) cb(ed.isEmpty ? '' : cleanRichText(ed.getHTML())); });
      ed.on('blur', () => setMention(null));
      sync(); setReady(true);
    }, () => {});
    return () => { gone = true; const ed = editorRef.current; editorRef.current = null; if (ed) ed.destroy(); };
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => { const ed = editorRef.current; if (ed && !ed.isDestroyed && ed.isEditable !== editable) ed.setEditable(editable); }, [editable, ready]);

  const pick = (m, o) => { if (m && m.command && o) m.command({ id: o.value, label: o.label }); setMention(null); };

  const COMMANDS = {
    bold: (c) => c.toggleBold(), italic: (c) => c.toggleItalic(), underline: (c) => c.toggleUnderline(), strike: (c) => c.toggleStrike(),
    code: (c) => c.toggleCode(), subscript: (c) => c.toggleSubscript(), superscript: (c) => c.toggleSuperscript(), highlight: (c) => c.toggleHighlight(),
    bulleted: (c) => c.toggleBulletList(), numbered: (c) => c.toggleOrderedList(), tasks: (c) => c.toggleTaskList(),
    quote: (c) => c.toggleBlockquote(), codeBlock: (c) => c.toggleCodeBlock(), rule: (c) => c.setHorizontalRule(),
    alignLeft: (c) => c.setTextAlign('left'), alignCenter: (c) => c.setTextAlign('center'), alignRight: (c) => c.setTextAlign('right'), alignJustify: (c) => c.setTextAlign('justify'),
    paragraph: (c) => c.setParagraph(), h1: (c) => c.toggleHeading({ level: 1 }), h2: (c) => c.toggleHeading({ level: 2 }), h3: (c) => c.toggleHeading({ level: 3 }),
    h4: (c) => c.toggleHeading({ level: 4 }), h5: (c) => c.toggleHeading({ level: 5 }), h6: (c) => c.toggleHeading({ level: 6 }),
    insertTable: (c) => c.insertTable({ rows: 3, cols: 3, withHeaderRow: true }), rowBefore: (c) => c.addRowBefore(), rowAfter: (c) => c.addRowAfter(),
    columnBefore: (c) => c.addColumnBefore(), columnAfter: (c) => c.addColumnAfter(), deleteRow: (c) => c.deleteRow(), deleteColumn: (c) => c.deleteColumn(),
    headerRow: (c) => c.toggleHeaderRow(), deleteTable: (c) => c.deleteTable(),
    defaultFont: (c) => c.unsetFontFamily(), defaultSize: (c) => c.unsetFontSize(),
    clear: (c) => c.unsetAllMarks().clearNodes().unsetTextAlign(), undo: (c) => c.undo(), redo: (c) => c.redo()
  };
  // a format from the toolbar, a menu or the keyboard; from the keyboard it is announced
  function apply(name, fromKeys) {
    const ed = editorRef.current, L = live.current;
    if (!ed || !L.editable) return;
    if (name === 'link') { openLink(); return; }
    // the header row is the table's first row (the engine toggles the row of the caret): toggled from its first cell
    if (name === 'headerRow') {
      const at = ed.state.selection.$from; let d = at.depth;
      while (d > 0 && at.node(d).type.name !== 'table') d -= 1;
      if (!d) return;
      const { from, to } = ed.state.selection;
      ed.chain().focus().setTextSelection(at.before(d) + 4).toggleHeaderRow().setTextSelection({ from, to }).run();
      return;
    }
    if (name === 'image' || name === 'color' || name === 'highlight' && !fromKeys || name === 'customFont' || name === 'customSize') { openBar(name); return; }
    const was = MARKS[name] ? ed.isActive(MARKS[name]) : false;
    COMMANDS[name](ed.chain().focus()).run();
    if (fromKeys && MARKS[name]) announce(was ? L.t.off(L.t[name]) : L.t.on(L.t[name]));
  }
  // after a menu choice the menu gives the focus to its button; it goes back to the area
  const fromMenu = (fn) => () => { fn(); setTimeout(() => { const ed = editorRef.current; if (ed && !ed.isDestroyed) ed.commands.focus(); }, 0); };

  // the field under the toolbar (link, image, color, highlight, custom font or size), for the selection kept in saved
  function openBar(kind, start) {
    const ed = editorRef.current; if (!ed) return;
    const { from, to } = ed.state.selection;
    saved.current = { from, to };
    const ts = ed.getAttributes('textStyle'), hl = ed.getAttributes('highlight');
    const hex = toHex(kind === 'color' ? ts.color || '' : kind === 'highlight' ? hl.color || '' : '') || '';
    setValues(Object.assign({ main: kind === 'font' ? ts.fontFamily || '' : kind === 'size' ? ts.fontSize || '' : HEX.test(hex) ? hex : '', alt: '' }, start));
    setBar({ kind: kind === 'customFont' ? 'font' : kind === 'customSize' ? 'size' : kind });
  }
  function openLink() {
    const ed = editorRef.current; if (!ed) return;
    if (ed.isActive('link')) { ed.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    openBar('link');
  }
  React.useEffect(() => { if (bar && firstField.current) firstField.current.focus(); }, [bar]);
  // the browser's color input follows a full hex value typed in the field (it holds #rrggbb only)
  React.useEffect(() => { const v = values.main || ''; if (picker.current && /^#[0-9a-f]{6}$/i.test(v) && picker.current.value !== v.toLowerCase()) picker.current.value = v.toLowerCase(); }, [values.main, bar]);
  const closeBar = () => {
    setBar(null);
    const ed = editorRef.current; if (!ed) return;
    const s = saved.current;
    if (s) ed.chain().focus().setTextSelection(s).run(); else ed.commands.focus();
  };
  const submitBar = (value) => {
    const kind = bar && bar.kind, v = String(value != null ? value : values.main || '').trim(), alt = String(values.alt || '').trim();
    closeBar();
    const ed = editorRef.current;
    if (!ed || !kind) return;
    if (kind === 'link') {
      if (!v) return;
      let to = v;
      if (!/^[a-z][a-z0-9+.-]*:/i.test(to) && !/^[/#.]/.test(to)) to = 'https://' + to;
      if (!SAFE_HREF.test(to)) return;
      if (ed.state.selection.empty) ed.chain().focus().insertContent({ type: 'text', text: v, marks: [{ type: 'link', attrs: { href: to } }] }).unsetMark('link').run();
      else ed.chain().focus().setLink({ href: to }).run();
    } else if (kind === 'image') {
      let src = v;
      if (src && !/^[a-z][a-z0-9+.-]*:/i.test(src) && !/^[/.]/.test(src)) src = 'https://' + src;
      if (src && SAFE_SRC.test(src)) ed.chain().focus().setImage({ src, alt }).run();
    } else if (kind === 'font') { if (v) ed.chain().focus().setFontFamily(v).run(); }
    else if (kind === 'size') { const s = /^\d+(\.\d+)?$/.test(v) ? v + 'px' : v; if (s) ed.chain().focus().setFontSize(s).run(); }
    else if (kind === 'color') { if (HEX.test(v)) ed.chain().focus().setColor(v).run(); }
    else if (kind === 'highlight') { if (HEX.test(v)) ed.chain().focus().setHighlight({ color: v }).run(); }
  };
  const removeColor = () => {
    const kind = bar && bar.kind; closeBar();
    const ed = editorRef.current; if (!ed) return;
    if (kind === 'color') ed.chain().focus().unsetColor().run(); else ed.chain().focus().unsetHighlight().run();
  };
  // a suggested swatch: its color as the stylesheet shows it now, kept on the content as a hex value
  const swatchPick = (e) => {
    const chip = e.currentTarget, win = chip.ownerDocument.defaultView;
    submitBar(toHex(win.getComputedStyle(chip).backgroundColor));
  };

  useFloating(area, list, { open: mentionOpen, placement: 'bottom-start', virtual: mentionOpen ? { x: mention.x, y: mention.y } : null });
  React.useLayoutEffect(() => { const el = list.current; if (mentionOpen && TOP_LAYER && el && el.showPopover && !el.matches(':popover-open')) el.showPopover(); }, [mentionOpen]);

  const usable = editable && ready;
  const PLAIN = ['undo', 'redo', 'clear', 'rule', 'image', 'color'];
  const pressedOf = (name) => (PLAIN.indexOf(name) >= 0 ? undefined : name === 'highlight' ? !!formats.highlight : !!formats[name]);
  // an icon-only ghost button named by its word, with a tooltip of the word and its shortcut
  const toolButton = (name) => {
    const keys = keysOf(name), off = !usable || (name === 'undo' && !formats.undo) || (name === 'redo' && !formats.redo);
    return (
      <Tooltip key={name} content={keys ? tipText(t[name], hotkeyLabel(keys)) : t[name]} disabled={off}>
        <Button variant="ghost" size="sm" pressed={pressedOf(name)} icon={ICONS[name]} iconOnly label={t[name]}
          aria-keyshortcuts={keys ? keysAria(keys) : undefined} disabled={off}
          onMouseDown={(e) => e.preventDefault()} onClick={() => apply(name)}>{t[name]}</Button>
      </Tooltip>
    );
  };
  const blockName = (b) => (!b || b === 'paragraph' ? t.paragraph : headingText(Number(b.slice(1))));
  const fontName = (f) => { const hit = RICH_TEXT_FONTS.find((x) => x[1] === f); return f ? (hit ? hit[0] : f.replace(/["']/g, '').split(',')[0]) : t.font; };
  // the menus' items, the same in the toolbar's menus and in the More menu's submenus
  const blockItems = () => (
    <MenuRadioGroup label={t.textStyle} value={formats.block || 'paragraph'} onChange={(v) => fromMenu(() => apply(v === 'paragraph' ? 'paragraph' : v))()}>
      {['paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((b) => <MenuItem key={b} value={b} aria-keyshortcuts={keysAria(keysOf(b))}>{blockName(b)}</MenuItem>)}
    </MenuRadioGroup>
  );
  const fontItems = () => [
    <MenuItem key="d" checked={!formats.font} onSelect={fromMenu(() => apply('defaultFont'))}>{t.defaultFont}</MenuItem>,
    ...RICH_TEXT_FONTS.map((f) => <MenuItem key={f[0]} checked={formats.font === f[1]} onSelect={fromMenu(() => { const ed = editorRef.current; if (ed) ed.chain().focus().setFontFamily(f[1]).run(); })}>{f[0]}</MenuItem>),
    <MenuDivider key="div" />, <MenuItem key="c" onSelect={() => setTimeout(() => apply('customFont'), 0)}>{t.custom}</MenuItem>
  ];
  const sizeItems = () => [
    <MenuItem key="d" checked={!formats.size} onSelect={fromMenu(() => apply('defaultSize'))}>{t.defaultSize}</MenuItem>,
    ...RICH_TEXT_SIZES.map((s) => <MenuItem key={s} checked={formats.size === s} onSelect={fromMenu(() => { const ed = editorRef.current; if (ed) ed.chain().focus().setFontSize(s).run(); })}>{s}</MenuItem>),
    <MenuDivider key="div" />, <MenuItem key="c" onSelect={() => setTimeout(() => apply('customSize'), 0)}>{t.custom}</MenuItem>
  ];
  const tableItems = () => [
    <MenuItem key="i" icon={ICONS.table} disabled={!usable || formats.table} onSelect={fromMenu(() => apply('insertTable'))}>{t.insertTable}</MenuItem>,
    <MenuDivider key="d1" />,
    ...['rowBefore', 'rowAfter', 'columnBefore', 'columnAfter', 'deleteRow', 'deleteColumn'].map((n) => (
      <MenuItem key={n} icon={ICONS[n]} disabled={!usable || !formats.table} onSelect={fromMenu(() => apply(n))}>{t[n]}</MenuItem>)),
    <MenuItem key="h" checked={!!formats.headerRow} disabled={!usable || !formats.table} onSelect={fromMenu(() => apply('headerRow'))}>{t.headerRow}</MenuItem>,
    <MenuDivider key="d2" />,
    <MenuItem key="x" icon={ICONS.deleteTable} danger disabled={!usable || !formats.table} onSelect={fromMenu(() => apply('deleteTable'))}>{t.deleteTable}</MenuItem>
  ];
  const menuButton = (name, text, items, icon) => (
    <Menu key={name} label={t[name]} trigger={<Button variant="ghost" size="sm" caret icon={icon} iconOnly={!!icon} label={icon ? t[name] : t[name] + ': ' + text} disabled={!usable} onMouseDown={(e) => e.preventDefault()}>{text}</Button>}>
      {items()}
    </Menu>
  );

  // the full toolbar's groups, in order; each is one overflow item (the last ones move into More formatting first)
  const GROUPS = toolbar === 'full' ? [
    { id: 'block', label: t.textStyle, menus: [['textStyle', () => blockName(formats.block), blockItems]] },
    { id: 'font', label: t.font, menus: [['font', () => fontName(formats.font), fontItems], ['size', () => formats.size || t.size, sizeItems]] },
    { id: 'marks', label: t.groupMarks, buttons: ['bold', 'italic', 'underline', 'strike', 'code', 'subscript', 'superscript'] },
    { id: 'color', label: t.groupColor, buttons: ['color', 'highlight'] },
    { id: 'align', label: t.groupAlign, buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'] },
    { id: 'lists', label: t.groupLists, buttons: ['bulleted', 'numbered', 'tasks'] },
    { id: 'insert', label: t.groupInsert, buttons: ['link', 'image'], menus: [['table', null, tableItems, ICONS.table]], after: ['codeBlock', 'quote', 'rule'] },
    { id: 'history', label: t.groupHistory, buttons: ['undo', 'redo', 'clear'] }
  ] : [{ id: 'marks', label: t.groupMarks, buttons: ['bold', 'italic', 'link'] }, { id: 'lists', label: t.groupLists, buttons: ['bulleted', 'numbered'] }];
  const fit = useOverflow(groupsRef, GROUPS.length, toolbar + JSON.stringify([formats.block, formats.font, formats.size]));
  const groupEl = (g) => (
    <span key={g.id} data-plx-overflow-item="" className="plx-rich-text-editor__slot">
      <Toolbar.Group>
        {(g.buttons || []).map(toolButton)}
        {(g.menus || []).map((m) => menuButton(m[0], m[1] ? m[1]() : t[m[0]], m[2], m[3]))}
        {(g.after || []).map(toolButton)}
      </Toolbar.Group>
    </span>
  );
  // a hidden group in the More menu: its buttons as items (a format as a checkbox item), its menus as submenus
  const menuEntry = (name) => (
    <MenuItem key={name} icon={ICONS[name]} checked={pressedOf(name)} disabled={!usable || (name === 'undo' && !formats.undo) || (name === 'redo' && !formats.redo)}
      aria-keyshortcuts={keysOf(name) ? keysAria(keysOf(name)) : undefined}
      onSelect={['image', 'color', 'highlight', 'link'].indexOf(name) >= 0 ? () => setTimeout(() => apply(name), 0) : fromMenu(() => apply(name))}>{t[name]}</MenuItem>
  );
  const hidden = GROUPS.slice(fit);
  const more = hidden.length ? (
    <span key="plx-more" data-plx-overflow-more="" className="plx-rich-text-editor__slot">
      <Menu label={t.more} placement="bottom-end" trigger={<Button variant="ghost" size="sm" iconOnly icon={MoreIcon} label={t.more} disabled={!usable} onMouseDown={(e) => e.preventDefault()} />}>
        {hidden.map((g) => (
          <MenuGroup key={g.id} label={g.label}>
            {(g.buttons || []).map(menuEntry)}
            {(g.menus || []).map((m) => <MenuSub key={m[0]} label={t[m[0]]} icon={m[3]}>{m[2]()}</MenuSub>)}
            {(g.after || []).map(menuEntry)}
          </MenuGroup>
        ))}
      </Menu>
    </span>
  ) : null;

  const showToolbar = toolbar && !readOnly;
  const field = (props) => <Input ref={firstField} {...props} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitBar(); } else if (e.key === 'Escape') { e.preventDefault(); closeBar(); } }} />;
  const setMain = (e) => setValues(Object.assign({}, values, { main: e.target.value }));
  let barContent = null;
  if (bar) {
    const k = bar.kind;
    if (k === 'link') barContent = [field({ key: 'a', type: 'url', 'aria-label': t.linkAddress, placeholder: 'https://', value: values.main, onChange: setMain }),
      <Button key="ok" size="sm" variant="primary" onClick={() => submitBar()}>{t.addLink}</Button>];
    else if (k === 'image') barContent = [field({ key: 'a', type: 'url', 'aria-label': t.imageAddress, placeholder: 'https://', value: values.main, onChange: setMain }),
      <Input key="alt" aria-label={t.imageAlt} placeholder={t.imageAlt} value={values.alt} onChange={(e) => setValues(Object.assign({}, values, { alt: e.target.value }))}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitBar(); } else if (e.key === 'Escape') { e.preventDefault(); closeBar(); } }} />,
      <Button key="ok" size="sm" variant="primary" onClick={() => submitBar()}>{t.addImage}</Button>];
    else if (k === 'font' || k === 'size') barContent = [field({ key: 'a', 'aria-label': k === 'font' ? t.customFont : t.customSize, value: values.main, onChange: setMain }),
      <Button key="ok" size="sm" variant="primary" onClick={() => submitBar()}>{t.apply}</Button>];
    else barContent = [
      <div key="sw" role="group" aria-label={t.swatches} className="plx-rich-text-editor__swatches">
        {CATEGORY_COLORS.map((c) => <ColorSwatch key={c} category={c} size="md" label={c.charAt(0).toUpperCase() + c.slice(1)} onClick={swatchPick} />)}
      </div>,
      field({ key: 'hex', 'aria-label': t.hex, placeholder: t.hex, value: values.main, invalid: !!values.main && !HEX.test(values.main), onChange: setMain, className: 'plx-rich-text-editor__hex' }),
      <Input key="pick" ref={picker} type="color" aria-label={t.customColor} onChange={(e) => setValues(Object.assign({}, values, { main: e.target.value }))} className="plx-rich-text-editor__picker" />,
      <Button key="ok" size="sm" variant="primary" disabled={!HEX.test(values.main || '')} onClick={() => submitBar()}>{t.apply}</Button>,
      <Button key="rm" size="sm" onClick={removeColor}>{t.remove}</Button>];
  }
  return (
    <div className={cx('plx-rich-text-editor', readOnly && 'is-read-only', disabled && 'is-disabled', className)} data-plx-warning={warning || undefined} {...rest}>
      {showToolbar ? (
        <Toolbar label={t.toolbar} className="plx-rich-text-editor__toolbar">
          <div ref={groupsRef} className="plx-rich-text-editor__groups">{splitAt(GROUPS.map(groupEl), fit, more)}</div>
        </Toolbar>
      ) : null}
      {bar ? (
        <div className="plx-rich-text-editor__bar" role="group" aria-label={t[bar.kind === 'font' ? 'customFont' : bar.kind === 'size' ? 'customSize' : bar.kind]}>
          {barContent}
          <Button size="sm" onClick={closeBar}>{t.cancel}</Button>
        </div>
      ) : null}
      {/* the editing area: ProseMirror's element (its attributes are set above, never by React) */}
      <div ref={area} />
      {mentionOpen ? (
        <ul ref={list} id={auto + '-mentions'} role="listbox" aria-label={t.mentions} popover={TOP_LAYER ? 'manual' : undefined} className="plx-rich-text-editor__mentions">
          {mention.items.map((o, i) => (
            <li key={o.value} id={auto + '-m' + i} role="option" aria-selected={i === mention.active} className={cx('plx-rich-text-editor__mention-option', i === mention.active && 'is-active')}
              onMouseDown={(e) => { e.preventDefault(); pick(mention, o); }}>{mentions && mentions.renderOption ? mentions.renderOption(o) : o.label}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

// starts loading the engine before the first editor mounts (a page whose first screen has an editor)
RichTextEditor.preload = () => { loadTiptap().catch(() => {}); };
