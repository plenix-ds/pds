import React from 'react';
import { EmptyState } from '../../components/EmptyState/EmptyState.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Link } from '../../components/Link/Link.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
import { useWords } from './words.ts';
/** @public the prop type of ErrorPage (ADR 0011) */
export type ErrorPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  error?: number;
  onRetry?: () => void;
  homeHref?: string;
  strings?: Record<string, string>;
};
export function ErrorPage({ error = 404, onRetry, homeHref, strings, ...rest }: ErrorPageProps) {
  const t = useWords(strings), errors: Record<number, string[]> = { 404: ['Page not found', 'Check the address or return home.'], 403: ['Access denied', 'Ask the owner for access to this page.'], 500: ['Something went wrong', 'Try again or return home.'] }, copy = errors[error] || errors[500];
  return <Frame {...rest} page="detail"><EmptyState kind={error === 404 ? 'not-found' : error === 403 ? 'permission-denied' : undefined} tone={error === 500 ? 'error' : undefined} title={t.title || copy[0]} action={<Stack gap="sm">{onRetry ? <Button onClick={onRetry as () => void}>{t.retry}</Button> : null}{homeHref ? <Link href={homeHref}>{t.home}</Link> : null}</Stack>}>{t.description || copy[1]}</EmptyState></Frame>;
}
