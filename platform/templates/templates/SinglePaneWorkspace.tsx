import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
/** @public the prop type of SinglePaneWorkspace (ADR 0011) */
export type SinglePaneWorkspaceProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
};
export function SinglePaneWorkspace({ toolbar, children, ...rest }: SinglePaneWorkspaceProps) { return <Frame {...rest}><Stack gap="md">{toolbar}{children}</Stack></Frame>; }
