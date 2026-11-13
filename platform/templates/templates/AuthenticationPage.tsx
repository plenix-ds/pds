import React from 'react';
import { Auth as AuthJs } from '../../patterns/Auth/Auth.tsx';
const Auth: any = AuthJs;
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
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
