import React from 'react';
import { RecordPage as RecordPageJs } from '../../patterns/RecordPage/RecordPage.tsx';
const RecordPage: any = RecordPageJs;
import { Stack } from '../../components/Stack/Stack.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Panel } from '../../components/Card/Card.tsx';
import { useWords } from './words.ts';
import { MasterDetailPage } from './MasterDetailPage.tsx';
import type { FrameProps } from './Frame.tsx';
/** @public the prop type of DetailPage (ADR 0011) */
export type DetailPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  sections?: unknown[];
  strings?: Record<string, string>;
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};
export function DetailPage({ sections = [], strings, children, title, description, actions, ...rest }: DetailPageProps) {
  const t = useWords(strings);
  return <MasterDetailPage {...rest} paneTitle={t.sections} detailOpen pane={<Stack gap="sm">{sections.map((s: any) => <Link key={s.id} href={'#' + s.id}>{s.title}</Link>)}</Stack>}><Stack gap="lg"><RecordPage.Header title={title} description={description} actions={actions} />{children}{sections.map((s: any) => <section key={s.id} id={s.id} aria-label={s.title}><Panel title={s.title}>{s.content}</Panel></section>)}</Stack></MasterDetailPage>;
}
