/* Plenix · SectionHeading
   Summary: The uppercase heading that names a section of a page (settings, a panel's sections, a list's groups): the card heading's type, 14px bold in the default ink (D-0110, issue 946); its size does not follow the level.
   Usage:
     <SectionHeading collapsible expanded={open} onToggle={() => setOpen(!open)} controls="recent-body">Recent</SectionHeading>
     <SectionHeading level={2}>Appearance</SectionHeading>
   Props:
     icon: an icon before the label (an icon name or element, as Panel's icon), decorative and hidden from assistive technology
     level: the heading level; default 3; null for a plain label. Every level draws with the card heading's type (D-0110)
     collapsible: renders a button that shows or hides the section; default false
     expanded: whether the section is shown (collapsible only); default true
     onToggle(event): runs when the button is clicked (collapsible only)
     controls: the id of the section body (collapsible only)
     actions: controls at the end of the heading
     className: more classes on the heading
     children: the label text
     ...rest: other attributes go on the heading element
   Behavior:
     The chevron turns with expanded.
     The size does not follow the level: pick the level from the outline, never for a size.
   Notes:
     It sets no outer margin: the list or panel it sits in spaces it. Unframed peer sections: <Stack gap="section"> of
     <Stack gap="sm"> (the heading and its content), see Stack.gap.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { asIcon as iconElement } from '../Icon/Icon.tsx';
import type { IconValue } from '../Icon/Icon.tsx';

export type SectionHeadingProps = React.HTMLAttributes<HTMLElement> & {
  /** the heading level (h1 to h6); 0 or none: a div */
  level?: number;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** the id of the region the toggle shows and hides */
  controls?: string;
  actions?: React.ReactNode;
  /** an icon before the label, as the card heading's (Panel.icon): decorative, hidden from assistive technology (ADR 0035) */
  icon?: IconValue | React.ReactNode;
};
// the level classes plx-section-heading--level-2, -3 and -4 no longer set a size (D-0110); they stay on the element for apps that select them, and are removed in 2.0.0
const LEVEL_CLASSES = [2, 3, 4];
export function SectionHeading({ level = 3, collapsible = false, expanded = true, onToggle, controls, actions, icon, className, children, ...rest }: SectionHeadingProps) {
  const Tag = (level ? 'h' + level : 'div') as React.ElementType;
  /** @deprecated plx-section-heading--level-2, -3, -4 no longer change the size; removed in 2.0.0 */
  const sized = LEVEL_CLASSES.indexOf(level) >= 0 && 'plx-section-heading--level-' + level;
  const mark = icon ? <span className="plx-section-heading__icon" aria-hidden="true">{iconElement(icon)}</span> : null;
  if (collapsible) {
    return (
      <Tag className={cx('plx-section-heading', sized, icon && 'plx-section-heading--icon', 'plx-section-heading--collapsible', className)} {...rest}>
        <button type="button" className={cx('plx-section-heading__toggle', icon && 'plx-section-heading__toggle--icon')} aria-expanded={expanded} aria-controls={controls} onClick={onToggle}>
          {mark}
          <span className="plx-section-heading__label">{children}</span>
          <span className="plx-section-heading__chevron" aria-hidden="true" />
        </button>
        {actions ? <span className="plx-section-heading__actions">{actions}</span> : null}
      </Tag>
    );
  }
  return (
    <Tag className={cx('plx-section-heading', sized, icon && 'plx-section-heading--icon', className)} {...rest}>
      {mark}
      <span className="plx-section-heading__label">{children}</span>
      {actions ? <span className="plx-section-heading__actions">{actions}</span> : null}
    </Tag>
  );
}
