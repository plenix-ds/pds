/* Plenix · ILLUSTRATIONS
   Summary: The Plenix illustration set: each drawing as data (its shapes and the color role of each), for Illustration to
     draw in the theme's colors. Two sets: the empty states and the errors.
   Usage:
     import { ILLUSTRATIONS, illustrationByName } from './illustrations.ts';
     ILLUSTRATIONS.filter((x) => x.set === 'error').map((x) => x.name)     // error, offline, not-found, no-access
   Props:
     ILLUSTRATIONS[i].name: the name Illustration takes ("no-results")
     ILLUSTRATIONS[i].set: "empty" (an empty state) | "error" (an error state)
     ILLUSTRATIONS[i].title: what it shows, in words (its accessible name when it is not decorative)
     ILLUSTRATIONS[i].parts: [role, element, attributes]: the role picks the color (back, shape, stroke, ghost, accent,
       accent-stroke, knock, danger, danger-stroke, danger-knock); element is circle, rect or path; the attributes are the
       geometry on a 120-unit square
   Behavior:
     The geometry is drawing data, not styling: every color, stroke width and size comes from the illustration tokens.
   Notes:
     The drawings follow the brand mark: square corners and ends, straight strokes, one accent. Add a drawing here (on the
       120-unit square, 4-unit steps) and it is in the set; never color a part by hand.
*/
// one shape: [its color role, its element (circle, rect, path), its geometry on the 120-unit square]
export type IllustrationPart = [string, string, Record<string, number | string>];
export type IllustrationArt = { name: string; set: 'empty' | 'error'; title: string; parts: IllustrationPart[] };
const BACK: IllustrationPart = ['back', 'circle', { cx: 60, cy: 60, r: 52 }];

export const ILLUSTRATIONS: IllustrationArt[] = [
  { name: 'empty-folder', set: 'empty', title: 'An empty folder', parts: [BACK,
    ['shape', 'path', { d: 'M20 36h28l8 8h44v48H20z' }],
    ['shape', 'path', { d: 'M20 52h80v40H20z' }],
    ['accent-stroke', 'path', { d: 'M52 72h16' }]] },
  { name: 'no-results', set: 'empty', title: 'A magnifier that found nothing', parts: [BACK,
    ['stroke', 'path', { d: 'M69 69l23 23' }],
    ['shape', 'circle', { cx: 52, cy: 52, r: 24 }],
    ['accent-stroke', 'path', { d: 'M44 52h16' }]] },
  { name: 'inbox-zero', set: 'empty', title: 'An empty tray, all done', parts: [BACK,
    ['shape', 'path', { d: 'M20 64l12-28h56l12 28v28H20z' }],
    ['stroke', 'path', { d: 'M20 64h24l4 8h24l4-8h24' }],
    ['accent', 'circle', { cx: 84, cy: 32, r: 12 }],
    ['knock', 'path', { d: 'M78 32l4 4l8-8' }]] },
  { name: 'no-data', set: 'empty', title: 'A chart with no data yet', parts: [BACK,
    ['ghost', 'rect', { x: 36, y: 60, width: 12, height: 32 }],
    ['ghost', 'rect', { x: 56, y: 44, width: 12, height: 48 }],
    ['ghost', 'rect', { x: 76, y: 68, width: 12, height: 24 }],
    ['stroke', 'path', { d: 'M24 24v68h72' }]] },
  { name: 'get-started', set: 'empty', title: 'A new page with a plus', parts: [BACK,
    ['shape', 'rect', { x: 32, y: 20, width: 52, height: 72 }],
    ['stroke', 'path', { d: 'M44 40h28M44 52h28M44 64h16' }],
    ['accent', 'circle', { cx: 84, cy: 84, r: 16 }],
    ['knock', 'path', { d: 'M84 76v16M76 84h16' }]] },
  { name: 'error', set: 'error', title: 'A window with a warning', parts: [BACK,
    ['shape', 'rect', { x: 20, y: 28, width: 80, height: 60 }],
    ['stroke', 'path', { d: 'M20 40h80' }],
    ['danger', 'path', { d: 'M60 48l18 32H42z' }],
    ['danger-knock', 'path', { d: 'M60 58v10M60 72v2' }]] },
  { name: 'offline', set: 'error', title: 'A cloud with no connection', parts: [BACK,
    ['shape', 'path', { d: 'M36 84h48a16 16 0 0 0 0-32a24 24 0 0 0-46-6a20 20 0 0 0-2 38z' }],
    ['danger-stroke', 'path', { d: 'M28 28l64 64' }]] },
  { name: 'not-found', set: 'error', title: 'A page that is not there', parts: [BACK,
    ['shape', 'path', { d: 'M36 20h36l16 16v56H36z' }],
    ['stroke', 'path', { d: 'M72 20v16h16' }],
    ['accent-stroke', 'path', { d: 'M52 50a8 8 0 1 1 12 7l-4 3v6' }],
    ['accent', 'circle', { cx: 60, cy: 76, r: 3 }]] },
  { name: 'no-access', set: 'error', title: 'A closed lock', parts: [BACK,
    ['stroke', 'path', { d: 'M44 56V44a16 16 0 0 1 32 0v12' }],
    ['shape', 'rect', { x: 36, y: 56, width: 48, height: 36 }],
    ['danger', 'circle', { cx: 60, cy: 70, r: 5 }],
    ['danger', 'rect', { x: 58, y: 72, width: 4, height: 10 }]] }
];

export const illustrationByName = (name: string): IllustrationArt | null => ILLUSTRATIONS.find((x) => x.name === name) || null;
