import React from 'react';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
/** @public the prop type of FullScreenExperience (ADR 0011) */
export type FullScreenExperienceProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  children?: React.ReactNode;
};
export function FullScreenExperience({ children, ...rest }: FullScreenExperienceProps) { return <Frame {...rest} page="editor">{children}</Frame>; }
