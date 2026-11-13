import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { RecordPage as RecordPageJs } from '../../patterns/RecordPage/RecordPage.tsx';
const RecordPage: any = RecordPageJs;
export function Frame({ page = 'workspace', title, description, actions, header, sideNav, footer, mainId, children }: any) {
  const id = React.useId();
  return <AppShell page={page} header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}>
    <PageContent><RecordPage header={title ? <RecordPage.Header title={title} description={description} actions={actions} /> : null}>{children}</RecordPage></PageContent>
  </AppShell>;
}
/** @public the page frame's props, which every page template passes on (title, description, actions, the shell's regions) */
export type FrameProps = {
  page?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  sideNav?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
