/* Plenix · Page templates: HomePage: the home page (a LandingPage on the dashboard shell page)
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { LandingPage } from './LandingPage.tsx';
import type { LandingPageProps } from './LandingPage.tsx';

/** @public the prop type of HomePage (ADR 0011) */
export type HomePageProps = LandingPageProps;
export function HomePage(props: HomePageProps) { return <LandingPage {...props} page="dashboard" />; }
