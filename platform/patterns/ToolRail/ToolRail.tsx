/* Plenix · ToolRail
   Summary: A vertical bar of tools beside a canvas (the image editor).
   Usage:
     <ToolRail label="Tools">
       <ToolRail.Item icon="ed-crop" label="Crop" pressed={tool === 'crop'} onClick={() => …} />
       <ToolRail.Divider />
     </ToolRail>
   Props:
     label: the toolbar's accessible name
     showLabels: each tool shows its name under the icon (no tooltip); default false
     className: more classes
     children: the tools (ToolRail.Item) and dividers (ToolRail.Divider)
     ToolRail.Item.icon: an icon name or element
     ToolRail.Item.label: the tool's name: its accessible name and tooltip
     ToolRail.Item.pressed: the toggle state; leave it out for a plain button
     ToolRail.Item.disabled: default false; the arrow keys skip it
     ToolRail.Item.onClick: runs on click
     ToolRail.Item.className: more classes
     ToolRailBar (NavPane at Narrow): the same items drawn as the destinations of the bottom navigation bar
   Behavior:
     It is a toolbar with vertical orientation and one Tab stop: Arrow Up / Down, Home and End move between tools; Tab
     enters and leaves the rail. Its Tab stop and arrow keys are the shared focus group (useFocusGroup,
     hooks/useFocusable.ts); NavPane's and SecondaryPane's collapsed rails are this rail.
     Each tool is an icon-only toggle button with a tooltip at its end side.
   Notes:
     The editor page sets the dark mode on its container.
*/
import React from 'react';
import { useFocusGroup } from '../../hooks/useFocusable.ts';
import { cx } from '../../utils/cx.ts';
import { stateIcon, asIcon as iconElement } from '../../components/Icon/Icon.tsx';
import { Tooltip } from '../../components/Tooltip/Tooltip.tsx';

const LabelsContext = React.createContext(false);
// inside the bottom navigation bar (NavPane at Narrow; Platforms Standard 4.1, 6.4) an item is a destination: its icon with
// its label under it, always shown, and aria-current for the current one
export const BarContext = React.createContext(false);

export function ToolRail({ label, showLabels = false, className, children }) {
  const ref = React.useRef(null);
  const itemsOf = () => (ref.current ? Array.prototype.slice.call(ref.current.querySelectorAll('.plx-tool-rail__item:not([disabled])')) : []);
  // one Tab stop: Tab enters and leaves the rail; Arrow Up / Down (looping), Home and End move between tools (batch 213).
  // The shared focus group (hooks/useFocusable.ts, issue 262); the rail's own items, and a held modifier still moves, as before
  const { groupProps } = useFocusGroup(ref, { orientation: 'vertical', items: itemsOf, modifiers: true });
  return (
    <LabelsContext.Provider value={showLabels}>
      <div ref={ref} role="toolbar" aria-orientation="vertical" aria-label={label} className={cx('plx-tool-rail', showLabels && 'plx-tool-rail--labels', className)} {...groupProps}>{children}</div>
    </LabelsContext.Provider>
  );
}

ToolRail.Item = function ToolRailItem({ icon, label, pressed, disabled = false, onClick, className }) {
  const labels = React.useContext(LabelsContext), bar = React.useContext(BarContext);
  if (bar) return (
    <button type="button" className={cx('plx-nav-bar__item', pressed && 'is-current', className)} aria-current={pressed ? 'page' : undefined}
      disabled={disabled || undefined} onClick={onClick}>
      {iconElement(icon, { filled: !!pressed })}
      <span className="plx-nav-bar__label">{label}</span>
    </button>
  );
  const button = (
    <button type="button" className={cx('plx-tool-rail__item', pressed && 'is-pressed', className)} aria-label={labels ? undefined : label}
      aria-pressed={pressed === undefined ? undefined : !!pressed} disabled={disabled || undefined} onClick={onClick}>
      {stateIcon(icon, pressed)}
      {labels ? <span className="plx-tool-rail__label">{label}</span> : null}
    </button>
  );
  return labels ? button : <Tooltip content={label} placement="end">{button}</Tooltip>;
};

ToolRail.Divider = function ToolRailDivider() {
  if (React.useContext(BarContext)) return null;   // the bar has no dividers
  return <span role="separator" className="plx-tool-rail__divider" />;
};
