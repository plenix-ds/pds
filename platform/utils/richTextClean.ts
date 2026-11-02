/* Plenix · richTextClean
   Summary: The rich-text allow-list: a clean copy of HTML from people (comments, imported documents, the RichTextEditor's
     output), with only the prose elements, safe links and pictures, and the person's own text formatting.
   Usage: import { cleanRichText } from '../utils/richTextClean.ts'; const safe = cleanRichText(html);
   Behavior: Elements outside the list are unwrapped (their text stays); scripts, event and style attributes are dropped,
     except the person's color, background color, font, size and alignment on their text; links keep http(s), mailto and
     relative addresses only; pictures keep http(s) and relative sources only. Returns '' with no document (server).
   Notes: Used by RichText (its html prop) and RichTextEditor (its value and onChange); published as cleanRichText.
     SAFE_HREF and SAFE_SRC, its address checks for links and pictures, are also what RichTextEditor's Insert link and Insert
     image accept (one rule in one place, issue 884). */
const MENTION_CLASS = 'plx-rich-text-editor__mention';
const CHECK_CLASS = 'plx-check__input';
const ALLOWED: Record<string, number> = { P: 1, BR: 1, STRONG: 1, EM: 1, U: 1, S: 1, CODE: 1, SUB: 1, SUP: 1, MARK: 1, A: 1, SPAN: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1,
  UL: 1, OL: 1, LI: 1, BLOCKQUOTE: 1, PRE: 1, HR: 1, IMG: 1, FIGURE: 1, FIGCAPTION: 1, TABLE: 1, THEAD: 1, TBODY: 1, TR: 1, TH: 1, TD: 1, LABEL: 1, INPUT: 1, DIV: 1 };
const RENAME: Record<string, string> = { B: 'strong', I: 'em', STRIKE: 's', DEL: 's', DIV: 'p' };
// the person's own formatting kept on their content: these style properties only, on these elements
const USER_STYLE: Record<string, string[]> = { SPAN: ['color', 'background-color', 'font-family', 'font-size'], MARK: ['color', 'background-color'],
  P: ['text-align'], H1: ['text-align'], H2: ['text-align'], H3: ['text-align'], H4: ['text-align'], H5: ['text-align'], H6: ['text-align'], TH: ['text-align'], TD: ['text-align'] };
export const RICH_TEXT_STYLE_PROPERTIES = ['color', 'background-color', 'font-family', 'font-size', 'text-align'];
export const SAFE_HREF = /^(https?:|mailto:|\/|\.|#|[^:]*$)/i;
export const SAFE_SRC = /^(https?:|\/|\.|[^:]*$)/i;

// the allow-list: a clean copy of the HTML (elements renamed or unwrapped, attributes dropped, styles kept to the person's formatting)
export function cleanRichText(html: unknown): string {
  if (typeof document === 'undefined') return '';
  const from = document.createElement('template'); from.innerHTML = String(html || '');
  const copy = (node: Node, into: Node, task: boolean): void => {
    // each child is an element past the two node-type tests below
    (node.childNodes as NodeListOf<HTMLElement>).forEach((n) => {
      if (n.nodeType === 3) { const text = n.nodeValue!.replace(/\u200B/g, ''); if (text) into.appendChild(document.createTextNode(text)); return; }
      if (n.nodeType !== 1) return;
      // inside a task item its label, checkbox and content div stay as Tiptap writes them
      const inTask = task && n.parentNode && (n.parentNode as Element).getAttribute && (n.parentNode as Element).getAttribute('data-type') === 'taskItem';
      let tag = RENAME[n.tagName] && !(inTask && n.tagName === 'DIV') ? RENAME[n.tagName].toUpperCase() : n.tagName;
      if ((tag === 'LABEL' || tag === 'DIV') && !inTask) { copy(n, into, task); return; }
      if (tag === 'INPUT') {
        if (!(task && n.closest('li[data-type="taskItem"]') && /^checkbox$/i.test(n.getAttribute('type') || ''))) return;
        const box = document.createElement('input');
        const item = n.closest('li[data-type="taskItem"]'), body = item && item.querySelector(':scope > div');
        box.setAttribute('type', 'checkbox'); box.setAttribute('class', CHECK_CLASS); box.setAttribute('disabled', '');
        if (n.hasAttribute('checked') || (item && item.getAttribute('data-checked') === 'true')) box.setAttribute('checked', 'checked');
        box.setAttribute('aria-label', ((body ? body.textContent : '') || '').trim().slice(0, 200));
        into.appendChild(box); return;
      }
      const mention = tag === 'SPAN' && n.hasAttribute('data-mention');
      const styles = (USER_STYLE[tag] || []).map((p) => [p, n.style ? n.style.getPropertyValue(p) : '']).filter((s) => s[1] && !/url\(|expression|[<>]/i.test(s[1]));
      if (!ALLOWED[tag] || (tag === 'SPAN' && !mention && !styles.length)) { copy(n, into, task); return; }
      const el = document.createElement(tag.toLowerCase());
      // an href only when there is one: SAFE_HREF's "no scheme" branch also matches the empty string, so a link whose unsafe
      // href was dropped came back as href="" on a second pass (issue 783: one pass must be final)
      if (tag === 'A') { const href = (n.getAttribute('href') || '').trim(); if (href && SAFE_HREF.test(href)) el.setAttribute('href', href); }
      if (tag === 'IMG') {
        const src = (n.getAttribute('src') || '').trim();
        if (!src || !SAFE_SRC.test(src)) return;
        el.setAttribute('src', src); el.setAttribute('alt', n.getAttribute('alt') || '');
        if (n.getAttribute('title')) el.setAttribute('title', n.getAttribute('title')!);
      }
      if (tag === 'OL' && /^\d+$/.test(n.getAttribute('start') || '') && n.getAttribute('start') !== '1') el.setAttribute('start', n.getAttribute('start')!);
      if ((tag === 'TD' || tag === 'TH')) ['colspan', 'rowspan'].forEach((a) => { const v = n.getAttribute(a); if (/^\d+$/.test(v || '') && v !== '1') el.setAttribute(a, v!); });
      if (tag === 'UL' && n.getAttribute('data-type') === 'taskList') el.setAttribute('data-type', 'taskList');
      const isTask = tag === 'LI' && n.getAttribute('data-type') === 'taskItem';
      if (isTask) { el.setAttribute('data-type', 'taskItem'); el.setAttribute('data-checked', n.getAttribute('data-checked') === 'true' ? 'true' : 'false'); }
      if (tag === 'MARK' && n.getAttribute('data-color')) el.setAttribute('data-color', n.getAttribute('data-color')!);
      if (mention) { el.setAttribute('data-mention', n.getAttribute('data-mention')!); el.setAttribute('class', MENTION_CLASS); el.setAttribute('contenteditable', 'false'); }
      styles.forEach((s) => el.style.setProperty(s[0], s[1]));
      if (tag === 'LABEL') el.setAttribute('contenteditable', 'false');
      if (tag === 'IMG' || tag === 'HR' || tag === 'BR') { into.appendChild(el); return; }
      copy(n, el, task || isTask); into.appendChild(el);
    });
  };
  const out = document.createElement('div'); copy(from.content, out, false);
  return out.innerHTML;
}
