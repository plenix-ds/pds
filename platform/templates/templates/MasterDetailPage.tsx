import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { PagePanes } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
import { SecondaryPane as SecondaryPaneJs } from '../../patterns/SecondaryPane/SecondaryPane.tsx';
const SecondaryPane: any = SecondaryPaneJs;
import { useWords } from './words.ts';
/** @public the prop type of MasterDetailPage (ADR 0011) */
export type MasterDetailPageProps = {
  pane?: React.ReactNode;
  paneTitle?: React.ReactNode;
  detailOpen?: boolean;
  onBack?: () => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
export function MasterDetailPage({ pane, paneTitle, detailOpen = false, onBack, strings, children, header, sideNav, footer, mainId }: MasterDetailPageProps) {
  const t = useWords(strings), id = React.useId();
  return <AppShell page="master-detail" header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}><PagePanes><SecondaryPane title={paneTitle || t.pane} detailOpen={detailOpen} onBack={onBack}>{pane}</SecondaryPane><PageContent>{children}</PageContent></PagePanes></AppShell>;
}
