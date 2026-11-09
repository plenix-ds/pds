// States: one column (default), two columns, hover and focus on a field, a field with an error, disabled field, the actions bar. Not applicable: loading, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Form, FormSection, FormActions } from '../../../platform/patterns/Form/Form.tsx';
import { Field } from '../../../platform/components/Field/Field.tsx';
import { Input, Select } from '../../../platform/components/Input/Input.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const body = (<>
  <FormSection title="General" description="Shown on the asset card."><Field label="Name" required><Input defaultValue="Cross 014" /></Field><Field label="Category"><Select options={[{ value: 'photo', label: 'Photo' }, { value: 'doc', label: 'Document' }]} /></Field></FormSection>
  <FormSection title="Usage rights"><Field label="Credit"><Input /></Field></FormSection>
  <FormActions><Button>Cancel</Button><Button type="submit" variant="primary">Save changes</Button></FormActions>
</>);
const meta = { title: 'Patterns/Form', component: Form, tags: ['autodocs'], args: { label: 'Asset details', onSubmit: (e: React.FormEvent) => e.preventDefault(), children: body } } satisfies Meta<typeof Form>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoColumn: Story = { args: { layout: 'two-column' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithError: Story = { args: { children: <><FormSection title="General"><Field label="Name" required error="Enter a name."><Input invalid /></Field></FormSection><FormActions><Button type="submit" variant="primary">Save changes</Button></FormActions></> } };
export const Disabled: Story = { args: { children: <><FormSection title="General"><Field label="Name"><Input disabled defaultValue="Cross 014" /></Field></FormSection><FormActions><Button type="submit" variant="primary" disabled>Save changes</Button></FormActions></> } };
export const LongText: Story = { args: { children: <FormSection title="A section with a very long title that does not fit the width of the form and so wraps" description="And a description that runs on well past the width of the section."><Field label="A field label that is also very long and wraps"><Input /></Field></FormSection> } };
export const Rtl: Story = { decorators: [rtl], args: { layout: 'two-column' } };
