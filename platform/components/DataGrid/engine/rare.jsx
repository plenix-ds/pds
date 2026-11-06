/* Plenix · DataGrid engine · rare (draws a part of chromeRare.jsx once it has loaded)
   Summary: A part of the grid that is seldom drawn is a function in chromeRare.jsx, loaded with one dynamic import the first time it is drawn (issue 807).
     Rare asks for the file when it first mounts and draws the part when it arrives (nothing before: the dialog opens one load later).
   Usage:
     {managing ? <Rare part="manageDialog" args={{ ... }} fallback={(retry, from) => manageFailed({ B, S, retry, close, from, frame })} /> : null}
   Props:
     part: the name of the function in chromeRare.jsx ("manageDialog"); args: the object it takes;
     pending: what to draw while the file is on its way (a menu: a busy row, never an empty panel)
     fallback(retry, from): what to draw when the file could not load; retry asks for it again, from is the element that had focus when
       Rare mounted (where the part was asked for). Without a fallback nothing is drawn.
   Behavior:
     The file is loaded once for the page and kept. A failed load is not kept: the promise is dropped, so the next Retry, or the next
       Rare that mounts (the next "Manage columns"), asks for the file again. In the iife builds the import is inlined, so nothing is fetched.
*/
import React from 'react';

let loaded = null, loading = null;
function load() {
  return loading || (loading = import('./chromeRare.tsx').then(
    (m) => (loaded = m),
    (error) => { loading = null; throw error; },
  ));
}

// starts the download without drawing anything (a trigger calls it on hover, focus and touch so the part is ready by the click)
export function preloadRare() { load().catch(() => {}); }

export function Rare({ part, args, fallback, pending }) {
  const [failed, setFailed] = React.useState(false), [, again] = React.useState(0), from = React.useRef(null);
  const attempt = React.useCallback(() => {
    setFailed(false);
    load().then(() => again((n) => n + 1), () => setFailed(true));
  }, []);
  // where focus was when the part was asked for (a menu has already handed focus back to its trigger), so the fallback can return it there
  React.useEffect(() => { from.current = document.activeElement; if (!loaded) attempt(); }, [attempt]);
  if (loaded) return loaded[part](args);
  return failed && fallback ? fallback(attempt, from.current) : failed ? null : pending || null;
}
