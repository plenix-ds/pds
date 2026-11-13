/* Plenix · Page templates: LandingPage: a landing page of cards
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Frame, Cards } from './shared.tsx';
import type { FrameProps } from './shared.tsx';

/** @public the prop type of LandingPage (ADR 0011) */
export type LandingPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  items?: unknown[];
  onOpen?: (item: unknown) => void;
  children?: React.ReactNode;
};
export function LandingPage({ items = [], onOpen, children, ...rest }: LandingPageProps) { return <Frame {...rest}><Stack gap="lg">{children}<Cards items={items} onOpen={onOpen} /></Stack></Frame>; }
