import React from 'react';
import { FormFlow } from '../../patterns/FormFlow/FormFlow.tsx';
import { Frame } from './Frame.tsx';
import type { FrameProps } from './Frame.tsx';
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
