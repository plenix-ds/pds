/* Plenix · Page templates: FullScreenWorkspace: a full screen workspace with tools and an inspector
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { SecondaryPane as SecondaryPaneJs } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
import { PagePanes } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { useWords } from './shared.tsx';
const SecondaryPane: any = SecondaryPaneJs;

/** @public the prop type of FullScreenWorkspace (ADR 0011) */
export type FullScreenWorkspaceProps = {
  tools?: React.ReactNode;
  inspector?: React.ReactNode;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
  strings?: Record<string, string>;
  mainId?: string;
};
export function FullScreenWorkspace({ tools, inspector, toolbar, children, strings, mainId }: FullScreenWorkspaceProps) {
  const t = useWords(strings), id = React.useId();
  return <AppShell page="editor" mainId={mainId || 'plx-template-' + id}><PagePanes>
    {tools ? <SecondaryPane title={t.tools} width="sm">{tools}</SecondaryPane> : null}
    <PageContent><Stack gap="md">{toolbar}{children}</Stack></PageContent>
    {inspector ? <SecondaryPane title={t.inspector} side="end">{inspector}</SecondaryPane> : null}
  </PagePanes></AppShell>;
}
