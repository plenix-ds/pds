/* Plenix · DataGrid engine · rows from a server
   Summary: Whether the grid gets its rows from a server (fetchRows with the mode "pages", "load-more" or "fill"), and asking for them:
     one request per page, sort, filter or search (the old one is aborted), the rows kept (appended in load-more and fill), the
     total, whether one is on its way, the last failure, and Retry.
   Usage:
     import { useRemoteRows } from './engine/useRemoteRows.ts';
     const { remoteMode, scrollFill, remote, remoteBusy, remoteError, fetching, setRetry } = useRemoteRows({ props, mode, page, pageSize, sorting, filters });
   Props:
     props: the grid's props (fetchRows, search); mode: 'pages', 'load-more' or 'fill'; page, pageSize, sorting, filters: the engine's
       own state, which a new request follows. Returns remoteMode (true with a server), scrollFill (the "fill" mode), remote
       ({ rows, total } so far), remoteBusy, remoteError, retry and setRetry (Retry asks again) and fetching (a ref: a request is on its way).
   Notes:
     Moved out of DataGridEngine.tsx without any change to the code (issue 714, the remote fetch): the parts were lines of the
     engine function, in the same order with the same values. The engine is documented in DataGridEngine.tsx.
*/
import React from 'react';
import { sorted } from './helpers.tsx';
import type { DataRecord } from '../types.ts';

/** what fetchRows is asked for, and what it gives back */
type RemoteRequest = { page: number; size: number; sort: Array<{ field: string; dir: string }>; filters: Array<{ field: string; type: string; value: unknown }>; search?: string; signal: AbortSignal };
type RemoteResult = { rows?: DataRecord[]; total?: number };
type RemoteProps = { fetchRows?: (request: RemoteRequest) => Promise<RemoteResult> | RemoteResult; search?: string };

export function useRemoteRows({ props, mode, page, pageSize, sorting, filters }: { props: RemoteProps; mode: string; page: number; pageSize: number; sorting: Array<{ id: string; desc?: boolean }>; filters: Array<{ id: string; value: unknown }> }) {
  const fetching = React.useRef(false);
  const [remoteBusy, setRemoteBusy] = React.useState(false);
  const [remote, setRemote] = React.useState<{ rows: DataRecord[]; total: number } | null>(null),
    [remoteError, setRemoteError] = React.useState<unknown>(null),
    [retry, setRetry] = React.useState(0);
  // rows from a server: a page at a time ("pages"), appended by Load more ("load-more"), or appended as the person scrolls
  // near the end ("fill", issue 522: one list, no page controls)
  const remoteMode =
      typeof props.fetchRows === 'function' && (mode === 'pages' || mode === 'load-more' || mode === 'fill'),
    scrollFill = remoteMode && mode === 'fill';
  React.useEffect(() => {
    if (!remoteMode) return;
    fetching.current = true;
    setRemoteBusy(true);
    let alive = true;
    const controller = new AbortController();
    setRemoteError(null);
    Promise.resolve()
      .then(() =>
        (props.fetchRows as NonNullable<RemoteProps['fetchRows']>)({
          page: page + 1,
          size: pageSize,
          sort: sorted(sorting),
          filters: filters.map((f) => ({ field: f.id, type: 'like', value: f.value })),
          search: props.search,
          signal: controller.signal,
        })
      )
      .then(
        (result: RemoteResult) => {
          if (alive) {
            fetching.current = false;
            setRemoteBusy(false);
            setRemote((old) => {
              const append = mode === 'load-more' || mode === 'fill',
                got = result.rows || [],
                rows = append && page > 0 ? [...(old?.rows || []), ...got] : got;
              // an empty or short page ends the list (issue 614), even when the total says there are more
              return { rows, total: append && got.length < pageSize ? rows.length : result.total || 0 };
            });
          }
        },
        (failure: unknown) => {
          if (alive) {
            fetching.current = false;
            setRemoteBusy(false);
            setRemoteError(failure);
          }
        }
      );
    return () => {
      alive = false;
      controller.abort();
    };
  }, [remoteMode, page, pageSize, JSON.stringify(sorting), JSON.stringify(filters), props.search, retry]);
  return { fetching, remoteBusy, remote, remoteError, setRetry, remoteMode, scrollFill };
}
