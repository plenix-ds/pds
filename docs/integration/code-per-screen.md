# Code per screen: load only the parts a screen uses

Rule 2 of the performance standard (D-0160, #1201, ADR 0052). Available from Plenix 1.7.0. The measured sizes and the samples below were checked against the live `/cdn/1.7.0/` on 2026-11-10.

## What loads

| What | Size (brotli, as the CDN sends it) |
|---|---|
| `plenix.js`, everything | 560 KB (573,287 B) |
| `plenix-loader.js` | 1.3 KB |
| A screen with `Badge` | 39 KB |
| A screen with `Button` | 50 KB |
| A screen with `Dialog` | 72 KB |
| A screen with `DataGrid` (with the parts it draws) | 226 KB |
| `Badge`, `Button`, `DataGrid` and `Dialog` together (shared code loads once) | 227 KB |

- Sizes are the part, the shared code it imports, and nothing else. React is not counted, in either column.
- Parts share code, so a second part on the same screen usually costs little.
- `plenix.css` is still one file (183,007 B as sent). Splitting it is a later decision.

## A page without a bundler (CDN)

- Load React, then `plenix-loader.js`, as classic `<script src>` tags in `<head>`, before any module script. Use the same version for all of them.
- Call `Plenix.load([...])` with the names the screen uses, and render when it resolves. Then use `window.Plenix.<Name>` as with `plenix.js`.

```html
<link rel="stylesheet" href="https://design-system.lighthouseway.org/cdn/1.7.0/plenix.css">
<script src="https://design-system.lighthouseway.org/cdn/1.7.0/vendor/react.production.min.js"></script>
<script src="https://design-system.lighthouseway.org/cdn/1.7.0/vendor/react-dom.production.min.js"></script>
<script src="https://design-system.lighthouseway.org/cdn/1.7.0/plenix-loader.js"></script>
<div id="root"></div>
<script>
  Plenix.load(['ThemeProvider', 'DataGrid', 'Button']).then(function () {
    var h = React.createElement, P = window.Plenix;
    var rows = [{ id: 1, name: 'Mina' }, { id: 2, name: 'Mariam' }];
    ReactDOM.createRoot(document.getElementById('root')).render(
      h(P.ThemeProvider, null,
        h(P.DataGrid, { label: 'Cases', data: rows, index: 'id', columns: [{ field: 'name', title: 'Name' }] }),
        h(P.Button, null, 'Save')));
  });
</script>
```

- `Plenix.load(names)` returns a promise. Each name loads `esm/<Name>.js` and its shared code, once per page.
- A name already loaded resolves at once, with no new request.
- An unknown name rejects with `Plenix.load: no part named <Name>`. Catch it.
- The loader writes the import map that points React at the version's own ES modules. A page with its own import map adds the four React names to it (`react`, `react-dom`, `react-dom/client`, `react/jsx-runtime`) and gives the map the attribute `data-plenix`.
- The loader reads `esm/manifest.json` and preloads each part's shared code, so the requests run in parallel.

## An app with a bundler (npm)

- Import each part from its own entry: `import { DataGrid } from '@plenix-ds/react/DataGrid'`. The barrel `@plenix-ds/react` still works, and a bundler drops what the app does not import.
- A router loads a whole screen on demand with `import()`:

  ```js
  const Cases = lazy(() => import('./screens/Cases'));
  ```

## Rules

- Use one version for the loader, React, the CSS and every part. The folders are immutable, so a versioned URL is cached for a year.
- Ask for the names a screen draws, not a list for the whole app. Add a name when the screen starts to use it.
- Load the parts before the first render of the screen. Do not call `window.Plenix.<Name>` for a name that was not loaded.
- Keep `plenix.js` only until the app moves. It stays unchanged through 1.x, is deprecated, and is removed in 2.0.0.
- Icons load per set: a screen that draws a set loads only that set (`esm/icons/<set>.js`).

## Check it

- Open the page's network panel: `plenix.js` is never requested, and every Plenix module comes from `esm/`.
- Load the page twice: the second visit serves every file from the cache.
