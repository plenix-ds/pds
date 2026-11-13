
import { FormPage } from './FormPage.tsx';
import type { FormPageProps } from './FormPage.tsx';
/** @public the prop type of CreatePage (ADR 0011) */
export type CreatePageProps = FormPageProps;
export function CreatePage(props: CreatePageProps) { return <FormPage {...props} mode="create" />; }
