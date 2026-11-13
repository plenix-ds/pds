/* Plenix · Page templates: SinglePaneWorkspace: a single pane workspace
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Frame } from './shared.tsx';
import type { FrameProps } from './shared.tsx';

/** @public the prop type of SinglePaneWorkspace (ADR 0011) */
export type SinglePaneWorkspaceProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
};
export function SinglePaneWorkspace({ toolbar, children, ...rest }: SinglePaneWorkspaceProps) { return <Frame {...rest}><Stack gap="md">{toolbar}{children}</Stack></Frame>; }
