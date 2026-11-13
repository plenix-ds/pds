
import { LandingPage } from './LandingPage.tsx';
import type { LandingPageProps } from './LandingPage.tsx';
/** @public the prop type of HomePage (ADR 0011) */
export type HomePageProps = LandingPageProps;
export function HomePage(props: HomePageProps) { return <LandingPage {...props} page="dashboard" />; }
