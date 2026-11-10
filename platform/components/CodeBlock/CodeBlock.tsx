/* Plenix · CodeBlock
   Summary: Code or a file's source, in the code font (Reddit Mono) on the page surface, with a Copy button.
   Usage:
     <CodeBlock title="platform/components/Button/Button.tsx" maxHeight="tall">{text}</CodeBlock>
   Props:
     title: a file name or caption shown above the code; a path or file name (it holds / or \\, or ends in .ext) is in the data font, a caption in the text font (ADR 0055)
     maxHeight: "none" (default) | "tall" (a box that scrolls, for whole files)
     copy: false hides the Copy button (default true)
     label: the accessible name of the code region (default the title, else strings.code)
     strings: the words it shows and announces, for other languages: { code: "Code", copy: "Copy", copied: "Copied",
       failed: "Could not copy" }
     language: "auto" (default: from the title's extension, else read from the code) | "jsx" | "js" | "css" | "html" | "text"
     children: the code, as a string
     className: more classes on the block
   Behavior:
     The code keeps its own line breaks and scrolls sideways.
     The code is one Tab stop (a focusable region) so a keyboard user can scroll it.
     The code is colored in the usual editor manner: keywords, strings, comments, numbers, functions, tags, attributes and
       properties, custom properties, selectors.
     "text" is not colored.
     Copy puts the code on the clipboard and reads "Copied" with a check for a moment; screen readers hear "Copied" (or
       "Could not copy" when the clipboard refuses).
   Notes:
     Writing direction (owner, ctm-needs-34): the code is always left to right (dir="ltr" on the <pre>), also in a right-to-left page.
     The colors come from the --plx-sys-code-* roles.
     The highlighter (highlight, detect) is shared with CodeEditor, which colors its text the same way; it is not public.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { Button } from '../Button/Button.tsx';
import { LiveRegion } from '../../utils/announce.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import CheckIcon from 'plenix-platform/icons/plenix/check';

const KEYWORDS = 'import|from|export|default|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|delete|typeof|instanceof|in|of|null|undefined|true|false|this|async|await|class|extends|try|catch|finally|throw';
// each rule: [kind, pattern]; the first that matches at a position wins
const RULES: Record<string, [string, RegExp][]> = {
  js: [
    ['comment', /\/\*[\s\S]*?\*\/|\/\/[^\n]*/],
    ['string', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/],
    ['tag', /<\/?[A-Za-z][\w.]*/],
    ['attribute', /[A-Za-z_][\w-]*(?==(?!=)[{"'])/],
    ['keyword', new RegExp('\\b(?:' + KEYWORDS + ')\\b')],
    ['number', /\b\d+(?:\.\d+)?\b/],
    ['function', /\b[A-Za-z_$][\w$]*(?=\()/],
  ],
  css: [
    ['comment', /\/\*[\s\S]*?\*\//],
    ['string', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/],
    ['brace', /[{}]/],
    ['variable', /--[\w-]+/],
    ['keyword', /@[\w-]+|!important/],
    ['attribute', /[\w-]+(?=\s*:)/],
    ['function', /\b[\w-]+(?=\()/],
    ['number', /-?\b\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|deg|fr|vh|vw|ch)?\b/],
  ],
};
RULES.jsx = RULES.js; RULES.html = RULES.js;

// a title is a path or file name when it holds a slash or ends in an extension: only then it is in the data font
const isPath = (title: unknown): boolean => /[\\/]|\.[A-Za-z0-9]{1,8}$/.test(String(title || ''));
function detect(title: unknown, text: string): string {
  const ext = title ? (String(title).match(/\.(\w+)$/) || [])[1] : null;
  if (ext) return ext === 'css' ? 'css' : /^(jsx?|mjs|tsx?)$/.test(ext) ? 'jsx' : ext === 'html' ? 'html' : 'text';
  return /^\s*(?:[.#:@\w[\]*-][^{\n]*)\{[^}]*:[^}]*;/m.test(text) && !/=>|import |<[A-Z]/.test(text) ? 'css' : 'jsx';
}

// the code as a list of plain strings and colored spans (CodeEditor colors its text with it too)
export function highlight(text: string, language: string): React.ReactNode {
  const rules = RULES[language];
  if (!rules) return text;
  const all = new RegExp(rules.map(([, re]) => '(' + re.source + ')').join('|'), 'g');
  const out: React.ReactNode[] = [];
  let at = 0, depth = 0, m: RegExpExecArray | null, n = 0;
  const plain = (s: string) => { if (!s) return; out.push(language === 'css' && depth === 0 ? <span key={n++} className="plx-code-block__tok--selector">{s}</span> : s); };
  while ((m = all.exec(text))) {
    if (m[0] === '') { all.lastIndex++; continue; }
    plain(text.slice(at, m.index));
    const kind = rules[m.slice(1).findIndex((g) => g !== undefined)][0];
    if (kind === 'brace') { depth += m[0] === '{' ? 1 : -1; if (depth < 0) depth = 0; out.push(m[0]); }
    else if (language === 'css' && depth === 0 && kind !== 'comment' && kind !== 'keyword' && kind !== 'string') plain(m[0]);
    else if (kind === 'tag') { const slash = m[0][1] === '/' ? 2 : 1; out.push(m[0].slice(0, slash)); out.push(<span key={n++} className="plx-code-block__tok--tag">{m[0].slice(slash)}</span>); }
    else out.push(<span key={n++} className={'plx-code-block__tok--' + kind}>{m[0]}</span>);
    at = all.lastIndex;
  }
  plain(text.slice(at));
  return out;
}


export type CodeBlockProps = {
  /** a title above the code; its file extension picks the language */
  title?: string;
  /** "none" (default) or a height name the stylesheet defines */
  maxHeight?: string;
  /** the Copy button; default true */
  copy?: boolean;
  /** the code's accessible name; default the title */
  label?: string;
  /** "auto" (default) | "js" | "jsx" | "html" | "css" | "text" */
  language?: string;
  /** { copy, copied, failed, code } */
  strings?: Catalog | null;
  className?: string;
  /** the code, as text */
  children?: React.ReactNode;
};
export function CodeBlock({ title, maxHeight = 'none', copy = true, label, language = 'auto', strings, className, children }: CodeBlockProps) {
  const t = useStrings('codeBlock', strings) as Record<string, string>;
  const [copied, setCopied] = React.useState(false);
  const [said, setSaid] = React.useState('');   // what screen readers hear after Copy (batch 213)
  const text = typeof children === 'string' ? children : String(children == null ? '' : children);
  const lang = language === 'auto' ? detect(title, text) : language;
  const colored = React.useMemo(() => highlight(text, lang), [text, lang]);
  const doCopy = () => {
    const done = () => { setCopied(true); setSaid(t.copied); setTimeout(() => { setCopied(false); setSaid(''); }, 1500); };
    const failed = () => { setSaid(t.failed); setTimeout(() => setSaid(''), 3000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, failed); else failed();
  };
  return (
    <div className={cx('plx-code-block', 'plx-code-block--' + maxHeight, className)}>
      {title || copy ? (
        <div className="plx-code-block__head">
          {title ? <span className={cx('plx-code-block__title', isPath(title) && 'plx-code-block__title--path')}>{title}</span> : <span />}
          {copy ? <Button size="xs" variant="ghost" icon={copied ? CheckIcon : undefined} onClick={doCopy}>{copied ? t.copied : t.copy}</Button> : null}
          {copy ? <LiveRegion kind="status">{said}</LiveRegion> : null}
        </div>
      ) : null}
      <pre className="plx-code-block__pre" dir="ltr" tabIndex={0} aria-label={label || title || t.code}><code className="plx-code-block__code" data-plx-language={lang}>{colored}</code></pre>
    </div>
  );
}
