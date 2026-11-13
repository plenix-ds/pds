/* Plenix · Page templates: ContentManagementPage: a page of items as cards
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { Frame, Cards, NoRecords } from './shared.tsx';
import type { FrameProps } from './shared.tsx';

/** @public the prop type of ContentManagementPage (ADR 0011) */
export type ContentManagementPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  items?: unknown[];
  onOpen?: (item: unknown) => void;
  empty?: React.ReactNode;
  strings?: Record<string, string>;
  children?: React.ReactNode;
};
export function ContentManagementPage({ items = [], onOpen, empty, strings, children, ...rest }: ContentManagementPageProps) { return <Frame {...rest}>{children}{items.length ? <Cards items={items} onOpen={onOpen} /> : <NoRecords empty={empty} strings={strings} />}</Frame>; }
