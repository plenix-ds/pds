/* Plenix · DataGrid engine · the virtual window of rows
   Summary: The grid's virtual window: TanStack Virtual, unmodified, redrawing only when the window of rows changes, so a
     scroll inside the same window needs no render.
   Usage:
     import { useVirtualizer } from './engine/useVirtualizer.ts';
     const virtualizer = useVirtualizer({ count, getScrollElement, estimateSize, overscan });
   Props:
     options: TanStack Virtual's Virtualizer options; returns the Virtualizer. redrawOnSize: true also redraws when the
       total size or the first drawn item's place changes (measured items: the card list's spacers, issue 809)
   Notes:
     Moved out of DataGridEngine.jsx (issue 688); redrawOnSize added for the card list (issue 809). The engine is documented in DataGridEngine.jsx.
*/
import React from 'react';
import { flushSync } from 'react-dom';
import { observeElementRect, observeElementOffset, elementScroll, Virtualizer, type VirtualizerOptions } from '@tanstack/react-virtual';

/** TanStack Virtual's options (the driver and the scroll functions come from here), and redrawOnSize: measured items redraw when their place or the total size changes */
export type GridVirtualOptions = Partial<VirtualizerOptions<HTMLElement, Element>> & Pick<VirtualizerOptions<HTMLElement, Element>, 'count' | 'getScrollElement' | 'estimateSize'> & { redrawOnSize?: boolean };

// TanStack Virtual, unmodified, driven like its React adapter but redrawing only when the window of rows changes: the
// rows sit between gaps (no position per row), so a scroll inside the same window needs no render at all
export function useVirtualizer(options: GridVirtualOptions) {
  const rerender = React.useReducer((x) => x + 1, 0)[1],
    shownRange = React.useRef('');
  const resolved: VirtualizerOptions<HTMLElement, Element> = {
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
    ...options,
    onChange: (instance: Virtualizer<HTMLElement, Element>, sync: boolean) => {
      const r = instance.range,
        // measured items (the card list, issue 809) also redraw when the drawn items' place or the total size changes
        key = (r ? r.startIndex + ':' + r.endIndex : '') + (options.redrawOnSize ? ':' + instance.getTotalSize() + ':' + (instance.getVirtualItems()[0]?.start ?? 0) : '');
      if (key === shownRange.current) return;
      shownRange.current = key;
      if (sync) flushSync(rerender);
      else rerender();
    }
  };
  const [instance] = React.useState(() => new Virtualizer<HTMLElement, Element>(resolved));
  instance.setOptions(resolved);
  React.useLayoutEffect(() => instance._didMount(), []);
  React.useLayoutEffect(() => instance._willUpdate());
  return instance;
}
