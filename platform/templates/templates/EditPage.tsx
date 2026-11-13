
import { FormPage } from './FormPage.tsx';
import type { FormPageProps } from './FormPage.tsx';
/** @public the prop type of EditPage (ADR 0011) */
export type EditPageProps = FormPageProps;
export function EditPage(props: EditPageProps) { return <FormPage {...props} mode="edit" />; }
