/* Plenix · DataGrid engine · which row actions show as icons
   Summary: Splits a row menu's items into the icon buttons at the row's inline end and the items left in the ⋮ menu (issue 800, AC-5, ADR 0022, D-0090).
   Usage:
     const { inline, rest } = splitRowActions(items);
   Props:
     splitRowActions(items): items, the row menu's items; returns { inline, rest }, two lists of items in the menu's order
   Behavior:
     An item is an icon when it has an icon, is not a separator and is not danger; at most three. inline: false keeps an item out; inline: true lets a
       fourth item in (items with inline: true take the places first, then the others in order). A danger item is never an icon, whatever inline says.
     The rest keep their order; separators are kept between items but never lead, trail or double up, so Delete stays last after its divider.
*/
import { development } from '../../../utils/devWarn.ts';

const MAX_ICONS = 3;
type Item = { icon?: unknown; separator?: boolean; danger?: boolean; inline?: boolean };

const warned = new Set<string>();
export function splitRowActions<T extends Item>(items: T[]): { inline: T[]; rest: T[] } {
  const eligible = (i: T) => !i.separator && !!i.icon && !i.danger;
  const chosen = new Set<T>();
  // development only: a danger item asked to be an icon is told once that it stays in the menu
  const dev = development();
  items.forEach((i) => {
    const name = String((i as any).label);
    if (dev && i.inline === true && i.danger && !warned.has(name)) { warned.add(name); console.warn('DataGrid: a danger row action stays in the ⋮ menu; inline is ignored for ' + name); }
  });
  items.filter((i) => eligible(i) && i.inline === true).forEach((i) => { if (chosen.size < MAX_ICONS) chosen.add(i); });
  items.filter((i) => eligible(i) && i.inline !== false && i.inline !== true).forEach((i) => { if (chosen.size < MAX_ICONS) chosen.add(i); });
  const inline = items.filter((i) => chosen.has(i));
  const rest: T[] = [];
  items.forEach((i) => {
    if (chosen.has(i)) return;
    if (i.separator && (!rest.length || rest[rest.length - 1].separator)) return;
    rest.push(i);
  });
  while (rest.length && rest[rest.length - 1].separator) rest.pop();
  return { inline, rest };
}
