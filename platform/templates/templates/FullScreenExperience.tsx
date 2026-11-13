/* Plenix · Page templates: FullScreenExperience: a full screen experience
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { Frame } from './shared.tsx';
import type { FrameProps } from './shared.tsx';

/** @public the prop type of FullScreenExperience (ADR 0011) */
export type FullScreenExperienceProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  children?: React.ReactNode;
};
export function FullScreenExperience({ children, ...rest }: FullScreenExperienceProps) { return <Frame {...rest} page="editor">{children}</Frame>; }
