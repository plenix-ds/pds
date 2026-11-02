/* Plenix · MegaMenu
   Summary: A top navigation item that opens a large panel of grouped links, column by column with an optional featured
     area (06 Navigation › Hierarchical navigation › Mega menu). It is a disclosure of links, not a menu: a button with
     aria-expanded and a panel of headings and lists of links, in a Popover beside the button. At the Narrow window class
     it is an accordion in place: the button opens the groups as a NavList whose headings fold.
   Usage:
     <nav aria-label="Main">
       <MegaMenu label="Guides" groups={[{ title: 'Start', links: [{ label: 'Upload files', href: 'upload.html', description: 'Add files to a project' }] }]} />
       <MegaMenu label="Products" groups={groups} featured={<Card …/>} />
     </nav>
     <MegaMenu label="Guides" groups={groups} layout="accordion" />   always the accordion (a narrow side area)
   Props:
     label: the button's text (the top navigation item)
     groups: the columns: [{ title, links: [{ label, href, description?, current? }] }]: a heading and its links;
       description is a short line under the link; current marks the page people are on (aria-current="page")
     featured: an area after the columns that highlights one item (a Card, a picture with a link); optional
     layout: "auto" (default: columns, the accordion at the Narrow window class) | "columns" | "accordion"
     placement: where the panel opens (default "bottom-start"; Popover's placements)
     className: more classes on the wrapper
   Behavior:
     Columns: the button opens and closes the panel on click, Enter or Space (never on hover); focus stays on the button
       and Tab moves into the links in order. Escape closes it and returns focus to the button; a click outside, Tab past
       the last link, or following a link closes it.
     Accordion: the button shows the groups in place, below it; each group heading is a disclosure that folds its links
       (NavList's collapsible groups, closed at first unless one holds the current page).
     The panel is never wider than the window; columns wrap under each other when they do not fit.
   Notes:
     For a site or documentation with many sections. Task-focused apps use the NavPane and NavList.
     Group headings are short; link names do not repeat the button's text.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Button } from '../Button/Button.tsx';
import { Link } from '../Link/Link.tsx';
import { NavList } from '../NavList/NavList.tsx';
import { Popover } from '../Popover/Popover.tsx';
import { useMedia, below } from '../../patterns/AppShell/AppShell.tsx';

export function MegaMenu({ label, groups = [], featured, layout = 'auto', placement = 'bottom-start', className }) {
  const id = useUid('plx-mega-menu');
  const narrow = useMedia(below('--plx-sys-shell-phone-below'));
  const accordion = layout === 'accordion' || (layout === 'auto' && narrow);
  const [open, setOpen] = React.useState(false);

  if (accordion) {
    const current = (g) => g.links.some((l) => l.current);
    const navGroups = groups.map((g) => ({ heading: g.title, defaultExpanded: current(g),
      items: g.links.map((l, i) => ({ id: l.href || String(i), label: l.label, href: l.href })) }));
    const value = (groups.flatMap((g) => g.links).find((l) => l.current) || {}).href;
    return (
      <div className={cx('plx-mega-menu', 'plx-mega-menu--accordion', className)}>
        <Button variant="ghost" caret expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="plx-mega-menu__toggle">{label}</Button>
        {open ? <div id={id} className="plx-mega-menu__sections"><NavList label={label} groups={navGroups} value={value} /></div> : null}
      </div>
    );
  }

  // following a link closes the panel (the page may stay: a link to a place on it)
  const follow = () => setOpen(false);
  return (
    <div className={cx('plx-mega-menu', 'plx-mega-menu--columns', featured && 'plx-mega-menu--featured', className)}>
      <Popover trigger={<Button variant="ghost" caret>{label}</Button>} role={null} open={open} onOpenChange={setOpen} focusOnOpen={false}
        sheetOnNarrow={false} size="auto" placement={placement} className="plx-mega-menu__panel">
        <div className="plx-mega-menu__columns">
          {groups.map((g, gi) => (
            <section key={gi} className="plx-mega-menu__group" aria-labelledby={id + 'h' + gi}>
              <h2 id={id + 'h' + gi} className="plx-mega-menu__heading">{g.title}</h2>
              <ul className="plx-mega-menu__links">
                {g.links.map((l, li) => (
                  <li key={li} className="plx-mega-menu__item">
                    <Link href={l.href} variant="standalone" aria-current={l.current ? 'page' : undefined} onClick={follow} className="plx-mega-menu__link">{l.label}</Link>
                    {l.description ? <p className="plx-mega-menu__description">{l.description}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {featured ? <div className="plx-mega-menu__feature">{featured}</div> : null}
        </div>
      </Popover>
    </div>
  );
}
