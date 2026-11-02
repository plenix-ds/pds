/* Plenix · page globals (platform/globals.d.ts)
   Summary: The browser globals the Platform reads, for TypeScript: settings a page may set on window before Plenix draws,
     and the constant the CDN's ES module build puts in its banner (vite.packages.config.mjs). Types only; nothing runs. */
declare global {
  interface Window {
    /** the folder of the Material icon library's files (Icon), set by a page whose bundler renames the Plenix files */
    PlenixIconLibrary?: string;
  }
  /** plenix.esm.js only: the module's own URL (`const __plenixModuleUrl = import.meta.url` in the build's banner) */
  const __plenixModuleUrl: string | undefined;
  /** the release, from package.json (Vite's define in vite.platform.config.mjs and vite.packages.config.mjs; platform/version.ts) */
  const __PLENIX_VERSION__: string | undefined;
}
// the popover attribute (the top layer, utils/floating.ts): in browsers, not yet in @types/react 18
declare module 'react' {
  interface HTMLAttributes<T> {
    popover?: '' | 'auto' | 'manual';
  }
}
export {};
