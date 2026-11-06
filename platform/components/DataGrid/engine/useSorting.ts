/* Plenix · DataGrid engine · sorting
   Summary: Which sort the grid shows: the caller's sort (props.sort, normalized), the grid's own, or none, and who owns it
     now (the person's last choice wins until the caller sends a new sort), kept in a ref for the handlers that run later.
   Usage:
     import { useSorting } from './engine/useSorting.ts';
     const { sorting, sortSignal, sortingRef, sortOwner, setSortOwner, setSorting } = useSorting({ props, initial });
   Props:
     props: the grid's props (sort, onViewChange); initial: the saved view the grid opens with (sorting).
       Returns sorting (the list of { id, desc } the table sorts by), sortSignal (props.sort as text, to see that the caller
       sent another), sortingRef (the current sorting for later handlers), and the owner state: sortOwner and setSortOwner,
       setSorting (the grid's own sort).
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, the sorting concern): the parts were lines of
     the engine function, in the same order with the same values. The engine is documented in DataGridEngine.tsx.
*/
import React from 'react';
import { normalizeSort } from '../state.ts';
import { EMPTY_ROWS } from './helpers.tsx';
import type { SortItem } from '../state.ts';

type SortProps = { sort?: Array<{ field?: string; column?: string; dir?: string }>; onViewChange?: unknown };

export function useSorting({ initial, props }: { initial: { sorting: SortItem[] }; props: SortProps }) {
  const [localSort, setSorting] = React.useState<SortItem[]>(initial.sorting);
  const sortSignal = JSON.stringify(props.sort);
  const [sortOwner, setSortOwner] = React.useState<string | null>(null);
  const controlledSort = React.useMemo(() => normalizeSort(props.sort), [sortSignal]);
  const initiallyControlledSort = React.useRef(!!props.sort?.length),
    appliedSort = React.useRef(false);
  if (
    props.sort?.length &&
    (initiallyControlledSort.current || JSON.stringify(controlledSort) !== JSON.stringify(initial.sorting))
  )
    appliedSort.current = true;
  React.useEffect(() => {
    if (props.sort?.length && sortOwner !== sortSignal) setSortOwner(null);
  }, [sortSignal]);
  const sorting: SortItem[] = props.onViewChange
    ? controlledSort
    : sortOwner === sortSignal || (!props.sort?.length && sortOwner !== null)
      ? localSort
      : props.sort?.length
        ? controlledSort
        : appliedSort.current
          ? (EMPTY_ROWS as SortItem[])
          : localSort;
  const sortingRef = React.useRef(sorting);
  sortingRef.current = sorting;
  return { setSorting, sortSignal, setSortOwner, sorting, sortingRef };
}
