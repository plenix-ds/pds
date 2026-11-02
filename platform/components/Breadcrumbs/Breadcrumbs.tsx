/* Plenix · Breadcrumbs
   Summary: Shows where the page sits in a hierarchy, from the top level to the current page.
   Usage:
     <Breadcrumbs label="Breadcrumb"
       items={[{ label: 'UI Inventory', href: '#/' }, { label: 'Forms', href: '#/forms' }, { label: 'Combobox' }]} />
   Props:
     items: the levels, from the top level to the current page: [{ label, href, onClick }]
     items[].href: the link of the level; an item without href is plain text
     items[].onClick: runs when the level's link is clicked
     label: the accessible name of the navigation landmark (default "Breadcrumb")
     className: more classes on the <nav>
   Behavior:
     It is a navigation landmark with an ordered list.
     Every item but the last is a link (or plain text without href).
     The last item is the current page (aria-current="page").
     Separators are drawn by CSS and hidden from assistive technology.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function Breadcrumbs({ items = [], label, className }) {
  const tw = useStrings('breadcrumbs');
  if (label === undefined) label = tw.label;
  return (
    <nav aria-label={label} className={cx('plx-breadcrumbs', className)}>
      <ol className="plx-breadcrumbs__list">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="plx-breadcrumbs__item">
              {last ? <span className="plx-breadcrumbs__current" aria-current="page">{it.label}</span>
                : it.href ? <a className="plx-breadcrumbs__link" href={it.href} onClick={it.onClick}>{it.label}</a>
                  : <span className="plx-breadcrumbs__text">{it.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
