/* Plenix · Page templates: shared: what the pages share: the frame, the cards, the empty state, the words and the frame props
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { AppShell, PageContent } from '../../patterns/AppShell/AppShell.tsx';
import { RecordPage as RecordPageJs } from '../../patterns/RecordPage/RecordPage.tsx';
import { FeatureCard } from '../../patterns/FeatureCard/FeatureCard.tsx';
import { ContentGrid } from '../../patterns/ContentGrid/ContentGrid.tsx';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import FolderIcon from 'plenix-platform/icons/plenix/folder';
const RecordPage: any = RecordPageJs;
// the templates' words come from the catalog (templates.templates.Templates in platform/i18n), so an Arabic page shows them in
// Arabic; a template's strings prop still wins
export const useWords = (strings: any): any => useStrings('templates.templates.Templates', strings);
export function Frame({ page = 'workspace', title, description, actions, header, sideNav, footer, mainId, children }: any) {
  const id = React.useId();
  return <AppShell page={page} header={header} sideNav={sideNav} footer={footer} mainId={mainId || 'plx-template-' + id}>
    <PageContent><RecordPage header={title ? <RecordPage.Header title={title} description={description} actions={actions} /> : null}>{children}</RecordPage></PageContent>
  </AppShell>;
}
export function Cards({ items = [], onOpen }: any) { return <ContentGrid>{items.map((item: any) => <FeatureCard key={item.id} title={item.title} description={item.description} icon={item.icon || FolderIcon} href={item.href} onOpen={!item.href && onOpen ? () => onOpen(item) : undefined} />)}</ContentGrid>; }
export function NoRecords({ strings, empty }: any) { const t = useWords(strings); return empty || <EmptyState title={t.empty}>{t.emptyDescription}</EmptyState>; }
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
