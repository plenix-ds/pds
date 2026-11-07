### Fixed

- The `@plenix-ds/web-components` package defines its custom elements again. Once the last parts became TypeScript, its build found no components and produced an empty package without an error. It now reads the components the same way as the Vue and Angular bridges, and the build fails if it finds none.
