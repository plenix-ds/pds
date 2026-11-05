/* Plenix · RichText
   Summary: A block of formatted reading text (prose): paragraphs, headings, lists, links, quotes, inline code and code
     blocks, from an editor's or a Markdown renderer's HTML or from JSX, in the Platform's type styles.
   Usage:
     <RichText>
       <h2>Before you upload</h2>
       <p>Name each file the way the <a href="../guides/naming.html">naming guide</a> says.</p>
       <ul><li>Photos</li><li>Drawings</li></ul>
     </RichText>
     <RichText variant="compact" html={sanitizedHtml} />
   Props:
     variant: "article" (default: a page of reading: 14px text, 24px lines, a reading width of about 80 characters) |
       "compact" (notes, comments and help in a panel: the body size, 20px lines, the container's width)
     html: HTML to show; RichText cleans it through the rich-text allow-list (cleanRichText) first; without it, the children
     as: the element: "div" (default) | "article" | "section"
     label: names the region for assistive technology when it is a landmark (as="section")
     children: the content, as plain elements (h1–h6, p, ul, ol, li, a, strong, em, u, s, sub, sup, mark, code, pre,
       blockquote, hr, img, figure, table, and the RichTextEditor's task lists)
     className: more classes on the container
   Behavior:
     Not interactive itself; links inside it are one Tab stop each and take the Link's look and focus ring.
     Blocks are spaced by the variant's rhythm; a heading has more space above it than below.
     Long words and addresses wrap; a code block (pre) scrolls sideways inside its box and is one Tab stop when it
       overflows (give it tabindex="0" and a name in the content).
     Lists take their markers from the writing direction; the quote's rule sits at the start side.
   Notes:
     html is always cleaned by cleanRichText (the RichTextEditor's allow-list): the elements above, no scripts, no event
       attributes, no style attributes except the person's text formatting, safe link and picture addresses only.
     With html, the container carries plx-user-content: the HTML is a person's content, whose own formatting (color,
       background-color, font-family, font-size and text-align on its text, as the RichTextEditor stores them) the style
       audit and the page checks allow there; the rest follows the type styles.
     It uses the elements' own styles from Link, Code and Blockquote, so a link in prose looks like <Link>.
     Tables of data are not prose: show them with the DataGrid. A table written in the RichTextEditor shows here in the
       Plenix table's look (its surface, header and full inside lines).
     Keep the real heading levels and list markup: screen readers move through them.
     Other props pass through to the container.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { cleanRichText } from '../../utils/richTextClean.ts';

type RichTextProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  /** "article" (default) | "compact" */
  variant?: 'article' | 'compact';
  /** HTML to clean and show (it is cleaned with cleanRichText); without it the children show */
  html?: string | null;
  as?: React.ElementType;
  label?: string;
  children?: React.ReactNode;
};
export function RichText({ variant = 'article', html, as: Tag = 'div', label, className, children, ...rest }: RichTextProps) {
  devWarn('RichText', { variant }, { variant: ['article','compact'] });
  const clean = React.useMemo(() => (html != null ? cleanRichText(html) : null), [html]);
  // nosemgrep: pds-no-dangerously-set-inner-html -- the HTML went through cleanRichText just above (this is the rich-text engine, as the rule asks)
  const content = clean != null ? { dangerouslySetInnerHTML: { __html: clean } } : null;
  return (
    <Tag aria-label={label} {...content} {...rest}
      className={cx('plx-rich-text', 'plx-rich-text--' + (variant === 'compact' ? 'compact' : 'article'), html != null && 'plx-user-content', className)}>
      {html != null ? undefined : children}
    </Tag>
  );
}
