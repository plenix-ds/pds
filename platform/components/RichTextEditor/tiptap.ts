/* Plenix · RichTextEditor engine (tiptap.js)
   Summary: Asks the page's engines script for the engine every RichTextEditor runs on: Tiptap 3.31.3 (MIT, on ProseMirror),
     vendored as one file in platform/vendor/tiptap/tiptap.min.js that sets window.PlenixTiptap.
   Usage:
     loadTiptap().then((T) => new T.Editor({ element: { mount: el }, extensions: [T.StarterKit] }));
   Props:
     loadTiptap(win): resolves with the given window's PlenixTiptap (default this one: an editor in a frame runs on its
       frame's engine), loading it through PlenixEngines.tiptap on first use
   Behavior:
     Only the first editor on a page loads the file; later editors reuse the same promise. Pages without an editor never
       load it (no prefetch): RichTextEditor.preload() starts the load early on a page whose first screen has an editor.
     The page loads platform/engines/plenix-engines.js, which holds the vendor folder's address and the loader
       (issues 456, 457). Without it, loadTiptap rejects with a message that says the engines script is missing.
     The engine has no stylesheet of its own: the few rules ProseMirror needs are in rich-text-editor.css, on tokens.
   Notes:
     A failed load rejects and is forgotten, so the next editor that mounts tries again.
     The bundle holds @tiptap/core, @tiptap/pm, @tiptap/starter-kit (with its link, underline and list extensions),
       @tiptap/extension-list, -mention, -table, -text-style, -text-align, -highlight, -subscript, -superscript, -image and
       -typography, and their dependencies (platform/vendor/README.md: versions, licenses, how it is built). */

import { engine } from '../../utils/engines.ts';
// the types come from the packages at the vendored version (devDependencies, import type only: ADR 0011 addendum, D-0067); the engine itself is the vendored bundle
import type * as Core from '@tiptap/core';
import type { StarterKit } from '@tiptap/starter-kit';
import type { TaskList, TaskItem } from '@tiptap/extension-list';
import type { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import type { TextStyle, Color, FontFamily, FontSize } from '@tiptap/extension-text-style';
import type { TextAlign } from '@tiptap/extension-text-align';
import type { Highlight } from '@tiptap/extension-highlight';
import type { Subscript } from '@tiptap/extension-subscript';
import type { Superscript } from '@tiptap/extension-superscript';
import type { Image } from '@tiptap/extension-image';
import type { Typography } from '@tiptap/extension-typography';
import type { Mention } from '@tiptap/extension-mention';

/** What window.PlenixTiptap holds: the core and the extensions the bundle includes (internal) */
export type TiptapEngine = typeof Core & {
  StarterKit: typeof StarterKit; TaskList: typeof TaskList; TaskItem: typeof TaskItem; Table: typeof Table; TableRow: typeof TableRow; TableHeader: typeof TableHeader; TableCell: typeof TableCell;
  TextStyle: typeof TextStyle; Color: typeof Color; FontFamily: typeof FontFamily; FontSize: typeof FontSize; TextAlign: typeof TextAlign; Highlight: typeof Highlight;
  Subscript: typeof Subscript; Superscript: typeof Superscript; Image: typeof Image; Typography: typeof Typography; Mention: typeof Mention;
};

export function loadTiptap(win?: Window | null): Promise<TiptapEngine> {
  const w = win || (typeof window !== 'undefined' ? window : null);
  if (!w) return Promise.reject(new Error('Tiptap needs a browser'));
  const loaded = (w as Window & { PlenixTiptap?: TiptapEngine }).PlenixTiptap;
  if (loaded) return Promise.resolve(loaded);
  return engine<TiptapEngine>('tiptap', w);
}
