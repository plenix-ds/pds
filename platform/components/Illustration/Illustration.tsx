/* Plenix · Illustration
   Summary: A drawing from the Plenix illustration set that supports a message: an empty state, a first run or an error page.
     Drawn in the theme's colors (no colors of its own), so it follows light and dark mode and sits on the accent.
   Usage:
     <Stack align="center"><Illustration name="no-results" size="sm" /><EmptyState title="No results" … /></Stack>
     <Center maxWidth="sm" text intrinsic><Illustration name="offline" size="lg" /><Text>…</Text></Center>
     <Illustration name="get-started" tone="on-accent" />                  on the accent surface
   Props:
     Illustration.name: a drawing of the set (ILLUSTRATIONS): the empty states "empty-folder" | "no-results" | "inbox-zero" |
       "no-data" | "get-started"; the errors "error" | "offline" | "not-found" | "no-access"
     Illustration.size: "sm" (64px: a spot beside a short message) | "md" (default, 120px: a scene) | "lg" (200px: a full-page state)
     Illustration.tone: "default" | "on-accent" (on the blue header, an accent banner or a welcome panel)
     Illustration.label: names the drawing (role="img"); true uses its title. Without it the drawing is decorative: the
       message beside it says everything
     Illustration.className: more classes
   Behavior:
     Each part of a drawing has a color role (backdrop, shape, line, accent, danger): the illustration tokens give each
       role a theme role, so nothing in a drawing is a color of its own. Lines keep their width at every size.
     It never shrinks below its size; a narrow container takes the smaller size (sm) instead.
   Notes:
     One illustration per view, in empty, first-run and error states: never in tables, forms or dense work areas. The
       heading and text beside it carry the message; the drawing adds no information and holds no words.
     The set and its geometry are in illustrations.ts; other props pass through to the <svg>.
*/
import React from 'react';
import { devWarn } from '../../utils/devWarn.ts';
import { cx } from '../../utils/cx.ts';
import { illustrationByName } from './illustrations.ts';

export type IllustrationProps = Omit<React.SVGProps<SVGSVGElement>, 'name' | 'label'> & {
  /** a drawing's name (ILLUSTRATIONS) */
  name: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'default' | 'on-accent';
  /** its accessible name; true: the drawing's own title; none: decorative */
  label?: string | boolean;
};
export function Illustration({ name, size = 'md', tone = 'default', label, className, ...rest }: IllustrationProps) {
  devWarn('Illustration', { size, tone }, { size: ['sm','md','lg'], tone: ['default','on-accent'] });
  const art = illustrationByName(name);
  if (!art) return null;
  const named = label === true ? art.title : label;
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" focusable="false"
      className={cx('plx-illustration', 'plx-illustration--' + size, tone !== 'default' && 'plx-illustration--' + tone, className)}
      role={named ? 'img' : undefined} aria-label={(named || undefined) as string | undefined} aria-hidden={named ? undefined : true} data-plx-illustration={art.name} {...rest}>
      {art.parts.map(([role, el, attrs], i) => React.createElement(el, { key: i, className: 'plx-illustration__' + role, ...attrs }))}
    </svg>
  );
}
