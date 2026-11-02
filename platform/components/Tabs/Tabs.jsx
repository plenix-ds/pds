/* Plenix · Tabs
   Summary: Switch between views of the same thing.
   Usage:
     <Tabs label="Asset details" value={tab} onChange={setTab}
       items={[{ value: 'info', label: 'Info', count: 3, content: <…/> }, …]} />
   Props:
     variant: "contained" (default) | "folder" | "segmented"
     orientation: "horizontal" (default) | "vertical" (the tabs in a column at the start, the panel beside them: many
       sections or long names, as a settings page; the vertical look replaces the variant's)
     items: the tabs, in order: [{ value, label, icon, count, content, disabled }]
     items[].icon: an icon name or element before the label
     items[].count: a count after the label
     items[].content: the tab's panel; without content Tabs draws only the tab list
     items[].disabled: the tab cannot be chosen and keys skip it
     value: a string: the selected tab's value (controlled)
     defaultValue: a string: the first selected tab when uncontrolled; default the first item
     onChange(value): runs when another tab is selected
     label: the accessible name of the tab list
     idBase: a string: the base of the tab and panel ids, for a panel the application renders
     className: more classes on the tabs
     panelClassName: more classes on each panel
     strings: the words it shows, for other languages: { more: "More", moreLabel: "More tabs" }
   Behavior:
     In a side panel (the inspector) the tabs use the Folder variant: the panel is already the frame (batch 272).
     The open contained or folder tab draws its own joint with the panel, so no line shows under it at any display scale.
     Arrow keys move and select (wrapping); Home and End go to the first and last. Vertical tabs say so
       (aria-orientation); Up and Down move there, Left and Right too.
     Only the selected tab is in the Tab order.
     The open folder tab has no line beneath it.
     Vertical tabs never move into More: the column grows with them and the panel takes the rest of the width.
     Tabs that do not fit on one row move into a "More" menu after the last shown tab: a menu button outside the tab list,
       its own Tab stop. The tab list never scrolls sideways (Platforms Standard 3.5, reflow). The selected tab is always
       shown: when it is one of the moved tabs, it takes the last shown place. Arrow keys, Home and End still reach every
       tab, moved ones included (the one chosen is shown); each tab states its place in the whole set (aria-posinset,
       aria-setsize), so a screen reader counts the moved tabs too. Choosing a tab in the menu selects it and focuses it.
   Notes:
     "contained" is the standard: folder tabs joined to a bordered panel.
     "folder" (owner, batch 259) is the tab strip alone: the folder tabs over a baseline, the open tab joined to it, and the
     content below with no frame of its own; for tabs inside a pane or a card that is already framed.
     "segmented" is a compact switch with SegmentedControl's look A (owner, 2026-10-14): joined segments at the button
       control height, the selected one in the selected-state blue tint.
     orientation="vertical" (library wave 7) draws each tab as a navigation list row: the hover fill, and the open tab in
       the selected state (the navigation pane's current row), never a focus ring.
     Without content on the items, the application renders the panel; give that panel id={tabsPanelId(idBase, value)}
       and pass idBase so the tabs point at it.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { arrowStep } from '../../utils/direction.ts';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { Count } from '../Count/Count.tsx';
import { Icon, stateIcon } from '../Icon/Icon.tsx';
import { Menu, MenuItem } from '../Menu/Menu.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import CaretIcon from 'plenix-platform/icons/plenix/caret';

// the selected tab fills its icon (the tab owns its state)
export const tabsPanelId = (base, value) => base + '-panel-' + String(value).replace(/[^a-zA-Z0-9_-]/g, '');
/* how many tabs fit on the row: it starts from all of them whenever the width, the tabs or the selected tab change, and
   lowers the number, before the browser paints, until every shown tab ends inside the tab list (the More control, once
   shown, takes its own room, so the list narrows and the count is checked again). The width is the Tabs' own, which
   does not follow the count, so the two never chase each other. */
function useTabsFit(rootRef, listRef, count, key) {
  const [fit, setFit] = React.useState(count);
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => { setFit(count); }, [count, key, width]);
  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => setWidth(root.clientWidth));
    ro.observe(root);
    return () => ro.disconnect();
  }, []);
  React.useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || fit <= 1) return;
    const box = list.getBoundingClientRect();
    const out = Array.prototype.some.call(list.children, (el) => {
      if (el.hidden) return false;
      const r = el.getBoundingClientRect();
      return r.right > box.right + 0.5 || r.left < box.left - 0.5;
    });
    if (out) setFit(fit - 1);
  }, [fit, count, key, width]);   // again after each step down, and after each reset (#882: not after every render)
  return Math.max(1, Math.min(fit, count));
}

export function Tabs({ variant = 'contained', orientation = 'horizontal', items, value, defaultValue, onChange, label, idBase, className, panelClassName, strings }) {
  devWarn('Tabs', { variant }, { variant: ['contained','folder','segmented'] });
  const words = useStrings('tabs', strings);
  const uid = useUid('plx-tabs');
  const base = idBase || uid;
  const [own, setOwn] = React.useState(defaultValue !== undefined ? defaultValue : (items[0] ? items[0].value : undefined));
  const current = value !== undefined ? value : own;
  const refs = React.useRef({});
  const root = React.useRef(null), list = React.useRef(null);
  const vertical = orientation === 'vertical';
  // what changes a tab's width: its label, its count and whether it has an icon, and the selected tab
  const measured = useTabsFit(root, list, items.length, items.map((t) => t.label + (t.count !== undefined ? '#' + t.count : '') + (t.icon ? '*' : '')).join('|') + '|' + String(current));
  const fit = vertical ? items.length : measured;
  // the shown tabs: the first `fit`; the selected tab takes the last place when it is not among them
  const at = items.findIndex((t) => t.value === current);
  const shown = (i) => (at < fit ? i < fit : (i < fit - 1 || i === at));
  const moved = items.filter((t, i) => !shown(i));
  // every part carries its variant (tabs.css: no part is styled through the root); a segmented strip marks its first and
  // last shown tabs (the rounded ends) and the shown tabs after the first (joined: no start edge)
  const kind = vertical ? 'vertical' : variant, seg = kind === 'segmented';
  const shownAt = items.map((t, i) => i).filter(shown), firstShown = shownAt[0], lastShown = shownAt[shownAt.length - 1];
  // focus goes to a tab once it is shown (a moved tab chosen by key or from the menu)
  const focusNext = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = focusNext.current !== null ? refs.current[focusNext.current] : null;
    if (el && !el.hidden) { focusNext.current = null; el.focus(); }
  });
  const select = (v) => { if (value === undefined) setOwn(v); if (onChange) onChange(v); };
  const enabled = items.filter((t) => !t.disabled);
  const onKeyDown = (e) => {
    const at = enabled.findIndex((t) => t.value === current);
    let next = null;
    const step = arrowStep(e, e.currentTarget);   // in reading order: right to left reverses Left and Right (batch 213)
    if (step > 0) next = (at + 1) % enabled.length;
    else if (step < 0) next = (at - 1 + enabled.length) % enabled.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    else return;
    e.preventDefault();
    const t = enabled[next];
    select(t.value);
    if (refs.current[t.value] && !refs.current[t.value].hidden) refs.current[t.value].focus();
    else focusNext.current = t.value;
  };
  const hasPanels = items.some((t) => t.content !== undefined);
  return (
    <div ref={root} className={cx('plx-tabs', vertical ? 'plx-tabs--vertical' : 'plx-tabs--' + variant, className)}>
      <div className={cx('plx-tabs__list', 'plx-tabs__list--' + kind)}>
        <div ref={list} role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : undefined} className={cx('plx-tabs__tablist', 'plx-tabs__tablist--' + kind)} onKeyDown={onKeyDown}>
          {items.map((t, i) => {
            const on = t.value === current;
            return (
              <button key={t.value} ref={(el) => { refs.current[t.value] = el; }} type="button" role="tab" id={base + '-tab-' + String(t.value).replace(/[^a-zA-Z0-9_-]/g, '')}
                aria-selected={on} aria-controls={tabsPanelId(base, t.value)} aria-posinset={i + 1} aria-setsize={items.length}
                tabIndex={on ? 0 : -1} disabled={t.disabled || undefined} hidden={!shown(i) || undefined}
                className={cx('plx-tabs__tab', 'plx-tabs__tab--' + kind, on && 'is-selected', seg && shown(i) && i !== firstShown && 'plx-tabs__tab--joined',
                  seg && i === firstShown && 'plx-tabs__tab--first', seg && i === lastShown && 'plx-tabs__tab--last')} onClick={() => select(t.value)}>
                {t.icon ? <span className="plx-tabs__icon">{stateIcon(t.icon, on)}</span> : null}
                <span className="plx-tabs__label">{t.label}</span>
                {t.count !== undefined ? <Count value={t.count} tone="neutral" /> : null}
              </button>
            );
          })}
        </div>
        {moved.length ? (
          <Menu label={words.moreLabel} placement="bottom-end" className="plx-tabs__more-anchor" trigger={
            <button type="button" className={cx('plx-tabs__tab', 'plx-tabs__tab--' + kind, seg && 'plx-tabs__tab--first', seg && 'plx-tabs__tab--last', 'plx-tabs__more')}>
              <span className="plx-tabs__label">{words.more}</span>
              <span className="plx-tabs__more-caret" aria-hidden="true"><Icon icon={CaretIcon} filled={false} /></span>
            </button>}>
            {moved.map((t) => (
              <MenuItem key={t.value} icon={t.icon} disabled={t.disabled} onSelect={() => { focusNext.current = t.value; select(t.value); }}>
                {t.count !== undefined ? t.label + ' (' + t.count + ')' : t.label}
              </MenuItem>
            ))}
          </Menu>
        ) : null}
      </div>
      {hasPanels ? items.map((t) => (
        <div key={t.value} role="tabpanel" id={tabsPanelId(base, t.value)} aria-labelledby={base + '-tab-' + String(t.value).replace(/[^a-zA-Z0-9_-]/g, '')}
          tabIndex={0} hidden={t.value !== current}
          className={cx('plx-tabs__panel', 'plx-tabs__panel--' + kind, kind === 'contained' && items[0] && current === items[0].value && 'plx-tabs__panel--corner', panelClassName)}>
          {t.value === current ? t.content : null}
        </div>
      )) : null}
    </div>
  );
}
