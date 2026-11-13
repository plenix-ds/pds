import type { FrameProps } from './Frame.tsx';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
import { NoRecords } from './NoRecords.tsx';
import { Cards } from './Cards.tsx';
import React from 'react';
/** @public the prop type of ContentManagementPage (ADR 0011) */
export type ContentManagementPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  items?: unknown[];
  onOpen?: (item: unknown) => void;
  empty?: React.ReactNode;
  strings?: Record<string, string>;
  children?: React.ReactNode;
};
export function ContentManagementPage({ items = [], onOpen, empty, strings, children, ...rest }: ContentManagementPageProps) { return <Frame {...rest}>{children}{items.length ? <Cards items={items} onOpen={onOpen} /> : <NoRecords empty={empty} strings={strings} />}</Frame>; }
