/* Plenix · Page templates: AuthenticationPage: a sign-in page
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { Auth as AuthJs } from '../../patterns/Auth/Auth.tsx';
import { Frame } from './shared.tsx';
const Auth: any = AuthJs;

/** @public the prop type of AuthenticationPage (ADR 0011) */
export type AuthenticationPageProps = {
  auth?: Record<string, unknown>;
  form?: React.ReactNode;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  mainId?: string;
};
export function AuthenticationPage({ auth, form, children, header, footer, mainId }: AuthenticationPageProps) { return <Frame header={header} footer={footer} mainId={mainId} page="form"><Auth {...auth}>{form || children}</Auth></Frame>; }
