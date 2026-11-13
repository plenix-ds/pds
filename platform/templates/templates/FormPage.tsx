/* Plenix · Page templates: FormPage: the form page CreatePage and EditPage share
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { FormFlow } from '../../patterns/FormFlow/FormFlow.tsx';
import { Frame } from './shared.tsx';
import type { FrameProps } from './shared.tsx';

/** @public the prop type of CreatePage and EditPage (ADR 0011) */
export type FormPageProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & FrameProps & {
  fields?: unknown[];
  initialValue?: Record<string, unknown>;
  sessionKey?: string;
  validate?: (values: Record<string, unknown>) => unknown;
  onSubmit?: (values: Record<string, unknown>) => unknown;
  onSuccess?: (result?: unknown) => void;
  onCancel?: () => void;
  strings?: Record<string, string>;
  children?: React.ReactNode;
};
export function FormPage(props: FormPageProps & { mode: 'create' | 'edit' }) {
  const { mode, fields, initialValue, sessionKey, validate, onSubmit, onSuccess, onCancel, strings, title, children, ...rest } = props as any;
  return <Frame {...rest} page="form" title={title}><FormFlow mode={mode} title={title} surface="page" initialValue={initialValue} sessionKey={sessionKey} validate={validate} onSubmit={onSubmit} onSuccess={onSuccess} onCancel={onCancel} strings={strings}>{fields || children}</FormFlow></Frame>;
}
