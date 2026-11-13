/* Plenix · Page templates: EditPage: an edit page
   Part of the page templates (platform/templates/templates, documented in Templates.tsx), split into one module per page so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Templates.tsx and platform/index.ts export the same names. */
import React from 'react';
import { FormPage } from './FormPage.tsx';
import type { FormPageProps } from './FormPage.tsx';

/** @public the prop type of EditPage (ADR 0011) */
export type EditPageProps = FormPageProps;
export function EditPage(props: EditPageProps) { return <FormPage {...props} mode="edit" />; }
