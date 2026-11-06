/* Plenix · DataGrid engine · sort changes
   Summary: What a change of sort does: the person's choice becomes the owner, the page goes back to the first, onViewChange
     and the dataSorted event hear it.
   Usage:
     import { sortActions } from './engine/sortActions.ts';
     const { changeSort } = sortActions({ sorting, setSortOwner, sortSignal, setSorting, setPage, props, emit });
   Props:
     sorting, setSortOwner, sortSignal, setSorting: from useSorting; setPage: the engine's page state; props: the grid's props
       (onViewChange); emit: the engine's event emitter. Returns changeSort(update): update is the new sorting or a function of the
       current one (TanStack's onSortingChange).
   Notes:
     Moved out of DataGridEngine.jsx without any change to the code (issue 714, the sorting concern): the parts were lines of
     the engine function, in the same order with the same values. The engine is documented in DataGridEngine.jsx.
*/
import { sorted } from './helpers.tsx';

export function sortActions({ sorting, setSortOwner, sortSignal, setSorting, setPage, props, emit }: any) {
  const changeSort = (update: any) => {
    const next = typeof update === 'function' ? update(sorting) : update;
    setSortOwner(sortSignal);
    setSorting(next);
    setPage(0);
    props.onViewChange?.({ sort: sorted(next) });
    emit(
      'dataSorted',
      next.map((s: any) => ({ field: s.id, dir: s.desc ? 'desc' : 'asc' }))
    );
  };
  return { changeSort };
}
