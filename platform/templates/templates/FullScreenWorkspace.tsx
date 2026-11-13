import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { PagePanes } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
import { SecondaryPane as SecondaryPaneJs } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
const SecondaryPane: any = SecondaryPaneJs;
import { Stack } from '../../components/Stack/Stack.tsx';
import { useWords } from './words.ts';
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
