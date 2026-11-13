import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
import { Cards } from './Cards.tsx';
/** @public the prop type of LandingPage (ADR 0011) */
export type LandingPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  items?: unknown[];
  onOpen?: (item: unknown) => void;
  children?: React.ReactNode;
};
export function LandingPage({ items = [], onOpen, children, ...rest }: LandingPageProps) { return <Frame {...rest}><Stack gap="lg">{children}<Cards items={items} onOpen={onOpen} /></Stack></Frame>; }
