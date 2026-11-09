/* Plenix · Text
   Summary: A run of text in one of the system's text roles, from the type tokens.
   Usage:
     <Text variant="secondary" as="p" truncate>Last edited 2 days ago</Text>
     <Text variant="display" as="h1">1,284 assets</Text>
     <Text as="p" lines={3} expandable>A long description…</Text>
     <Text variant="secondary" tabular>12:40</Text>
   Props:
     variant: the text role: "body" (default) | "secondary" | "caption" | "data" | "label" | "strong" | "heading"
       | "accent" (a highlighted term, step number or key figure: the accent color) | "success" (a good outcome, the new value in a change)
       | "eyebrow" | "danger" | "link" | "title" | "display" | "lead".
       body: the UI text. secondary: muted, 12px (counts, hints, descriptions). caption: subtle, 11px.
       data: the data font, Reddit Mono, for technical values (IDs, file names and paths, versions, dates and
       times, sizes, counts, durations); 12px on its own, the size of the text around it inside other text.
       label: semibold 12px. strong: semibold, the current size.
       heading: a group's title inside a page or dialog, semibold 13px.
       eyebrow: a small uppercase title over a tool panel, 11px, bold, widest spacing, muted.
       danger: the danger color (a required marker). link: the link color, normal weight (the color only: a link is the Link component).
       title: a page title, the heading font, 20px, bold.
       display: the largest style, for one key figure or a sign-in or welcome heading: the heading font at the top
         step of the type scale, semibold, with a tight line height and letter spacing (library wave 2).
       lead: body text one step up (15px) with a relaxed line height, for the opening paragraph of a page or an
         empty state (body-lg; library wave 2).
     as: the element; "span" (default) | "p" | "div" | "h1"–"h4" | "dt" | "dd" | "label" | …
     truncate: one line, cut with an ellipsis; default false (lines wins when both are set)
     lines: 2 | 3 | 4: at most that many lines, the last one cut with an ellipsis (line clamp); default none
     expandable: with lines, a "Show more" button under the text while it is cut; it shows the rest and reads
       "Show less" to fold it again; default false
     defaultExpanded: an expandable text starts unfolded; default false
     tabular: digits of equal width (tabular figures), so numbers line up down a column and do not shift as they
       change; default false
     overflow: "none" (default) | "dialog": with lines or truncate, a small button at the inline end while the text is cut opens the whole text in a Dialog (ADR 0047, issue 1122)
     overflowLabel: the field's name; it names that button ("Show full text: {label}") and titles the Dialog
     strings: the words of the expand button and the full-text button: { more: 'Show more', less: 'Show less', fullText: 'Show full text', fullTextOf: 'Show full text: {label}', fullTextTitle: 'Full text' }
     className: more classes on the text
     children: the text
     ...rest: other attributes go on the element
   Behavior:
     lines clamps with the line-clamp property; the whole text stays in the page, so search, copy and screen readers
       get all of it.
     expandable measures the text: the button shows only while the text is cut (and while it is unfolded). It is a
       button with aria-expanded that points at the text (aria-controls); it measures again when the width changes.
     display and lead are type styles only: the element (as) gives the heading level.
   Notes:
     Applications never set a font, size, weight or color themselves.
     There are no margins in any case, whatever the element.
     The expand button has the look of ShowMore (CollapsibleSection): the smallest button, its chevron after the
       label, down to show more and up to show less.
     Writing direction (owner, ctm-needs-34): the element is dir="auto" (its first strong letter decides); dir="rtl" or "ltr" and
       lang override it, for text in the other direction than the page (an Arabic question in an English page).
     Data (issue 838): a data value with no letter of a right-to-left script (a phone number, an IBAN, a date, a version) is dir="ltr" and a left-to-right
       island (unicode-bidi: isolate-override, as Isolate), so its spaced digit groups keep their order in an Arabic page; with an Arabic letter in it the
       element stays dir="auto". An explicit dir="ltr" is an island too.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Button } from '../Button/Button.tsx';
import { isCut } from '../../utils/overflow.ts';
import { readsLeftToRight } from '../../utils/direction.ts';
import { useStrings, useDigits } from '../../providers/LocaleProvider.tsx';
import type { Catalog } from '../../providers/LocaleProvider.tsx';
import { localDigits } from '../../utils/digits.ts';
import { FullTextAction } from './FullTextAction.tsx';
import ChevronDownIcon from 'plenix-platform/icons/plenix/chevron-down';
import ChevronUpIcon from 'plenix-platform/icons/plenix/chevron-up';

const LINES = [2, 3, 4];

// a text's classes: its role, how it overflows (one line, or at most `clamp` lines while folded) and its figures
const textClass = (variant: string, truncate: boolean, clamp: number | null, open: boolean, tabular: boolean, className: string | undefined) => cx('plx-text', 'plx-text--' + variant,
  truncate && !clamp && 'plx-text--truncate', clamp && !open && 'plx-text--lines-' + clamp, tabular && 'plx-text--tabular', className);

// the digits of a text's strings: Arabic-Indic in an Arabic page, emails and web addresses kept (owner, arabic-digits-35)
const shownDigits = (children: React.ReactNode, digits: string | undefined) => (digits === 'arab' ? React.Children.map(children, (c) => (typeof c === 'string' || typeof c === 'number' ? localDigits(String(c), { digits }) : c)) : children);

export type TextVariant = 'body' | 'secondary' | 'caption' | 'data' | 'label' | 'strong' | 'heading' | 'accent' | 'success' | 'eyebrow' | 'danger' | 'link' | 'title' | 'display' | 'lead';
export type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  variant?: TextVariant;
  truncate?: boolean;
  /** at most this many lines (2, 3 or 4) */
  lines?: number | string;
  expandable?: boolean;
  /** "dialog": with lines or truncate, a button shows the whole text in a Dialog while it is cut */
  overflow?: 'none' | 'dialog';
  /** names the full-text button and titles its Dialog */
  overflowLabel?: string;
  defaultExpanded?: boolean;
  tabular?: boolean;
  strings?: Catalog | null;
};
export function Text({ as: As = 'span', variant = 'body', truncate = false, lines, expandable = false, overflow = 'none', overflowLabel, defaultExpanded = false, tabular = false, strings, className, children, ...rest }: TextProps) {
  devWarn('Text', { variant }, { variant: ['body','secondary','caption','data','label','strong','heading','accent','success','eyebrow','danger','link','title','display','lead'] });
  const digits = useDigits();
  const clamp = LINES.indexOf(Number(lines)) >= 0 ? Number(lines) : null;
  devWarn('Text', { overflow, 'overflow with lines or truncate': overflow === 'dialog' && !clamp && !truncate ? 'none' : undefined, 'overflow with expandable': overflow === 'dialog' && expandable ? 'both' : undefined }, { overflow: ['none', 'dialog'], 'overflow with lines or truncate': ['set'], 'overflow with expandable': ['alone'] });
  if (overflow === 'dialog' && (clamp || truncate) && !expandable) {
    return <FullText As={As} variant={variant} truncate={truncate} clamp={clamp} tabular={tabular} label={overflowLabel} strings={strings} className={className} rest={rest}>{children}</FullText>;
  }
  if (expandable && clamp) {
    return <ExpandableText As={As} variant={variant} clamp={clamp} defaultExpanded={defaultExpanded} tabular={tabular} strings={strings} className={className} rest={rest}>{children}</ExpandableText>;
  }
  // a data value with no letter of a right-to-left script is a left-to-right island: its spaced digit groups keep their order in an Arabic page (issue 838)
  const dir = variant === 'data' && readsLeftToRight(children) ? 'ltr' : 'auto';
  return <As dir={dir} className={textClass(variant, truncate, clamp, false, tabular, className)} {...rest}>{shownDigits(children, digits)}</As>;
}

// a cut text and its corner button (overflow="dialog"): the text and the button share a wrapper, the button at the inline end while the text is cut
type FullTextProps = { As: React.ElementType; variant: string; truncate: boolean; clamp: number | null; tabular: boolean; label?: string; strings?: Catalog | null; className?: string; rest: React.HTMLAttributes<HTMLElement>; children?: React.ReactNode };
function FullText({ As, variant, truncate, clamp, tabular, label, strings, className, rest, children }: FullTextProps) {
  const ref = React.useRef<HTMLElement>(null);
  const digits = useDigits();
  const dir = variant === 'data' && readsLeftToRight(children) ? 'ltr' : 'auto';
  return (
    <div className="plx-text-full">
      <As dir={dir} {...rest} ref={ref} className={textClass(variant, truncate, clamp, false, tabular, cx('plx-text-full__text', className))}>{shownDigits(children, digits)}</As>
      <FullTextAction target={ref} label={label} strings={strings}>{children}</FullTextAction>
    </div>
  );
}

// a clamped text and its Show more button: the button shows while the text is cut, and while it is unfolded
type ExpandableTextProps = { As: React.ElementType; variant: string; clamp: number; defaultExpanded: boolean; tabular: boolean; strings?: Catalog | null; className?: string; rest: React.HTMLAttributes<HTMLElement>; children?: React.ReactNode };
function ExpandableText({ As, variant, clamp, defaultExpanded, tabular, strings, className, rest, children }: ExpandableTextProps) {
  const own = useUid('plx-text');
  const id = rest.id || own;
  const ref = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(defaultExpanded);
  const [cut, setCut] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || open) return undefined;
    const measure = () => setCut(isCut(el));
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watch = new ResizeObserver(measure);
    watch.observe(el);
    return () => watch.disconnect();
  }, [open, children]);
  const words = useStrings('text', strings);
  return (
    <div className="plx-text-expand">
      <As dir="auto" {...rest} ref={ref} id={id} className={textClass(variant, false, clamp, open, tabular, className)}>{children}</As>
      {open || cut ? (
        <Button size="2xs" iconEnd={open ? ChevronUpIcon : ChevronDownIcon} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          {(open ? words.less : words.more) as React.ReactNode}
        </Button>
      ) : null}
    </div>
  );
}
