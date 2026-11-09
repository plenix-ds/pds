// States: open at the first step (default), next step, validation error (a step that fails keeps its values), loading (a pending completion), error (a failed completion), dirty (close asks first), sizes, closed. Not applicable: hover and focus beyond its buttons, disabled beyond pending, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { WizardDialog } from '../../../platform/patterns/WizardDialog/WizardDialog.tsx';
import { ToastProvider } from '../../../platform/components/Toast/Toast.tsx';
import { rtl } from './rtl.tsx';

const steps = [{ id: 'details', label: 'Details', content: <p>Name the record and choose its owner.</p> }, { id: 'access', label: 'Access', content: <p>Choose who can see it.</p> }, { id: 'review', label: 'Review', content: <p>Check everything before you create it.</p> }];
const meta = { title: 'Patterns/WizardDialog', component: WizardDialog, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, decorators: [(Story) => <ToastProvider><Story /></ToastProvider>], args: { open: true, title: 'Create record', steps, onClose: () => {}, onComplete: () => {} } } satisfies Meta<typeof WizardDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
const press = async (name: RegExp) => { await userEvent.click(within(document.body).getByRole('button', { name })); };

export const Default: Story = {};
export const SecondStep: Story = { play: async () => { await press(/next/i); } };
export const LastStep: Story = { play: async () => { await press(/next/i); await press(/next/i); } };
export const Invalid: Story = { args: { steps: [{ ...steps[0], validate: () => 'Enter a name.' }, ...steps.slice(1)] }, play: async () => { await press(/next/i); } };
export const Loading: Story = { args: { onComplete: () => new Promise(() => {}) }, play: async () => { await press(/next/i); await press(/next/i); await press(/create|complete|finish/i); } };
export const Error: Story = { args: { onComplete: () => Promise.reject(new globalThis.Error('failed')) }, play: async () => { await press(/next/i); await press(/next/i); await press(/create|complete|finish/i); } };
export const Dirty: Story = { args: { dirty: true }, play: async () => { await press(/cancel/i); } };
export const Large: Story = { args: { size: 'lg' } };
export const FullScreen: Story = { args: { size: 'full' } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { title: 'Create the record of the hearing for every case filed this quarter in every office', steps: [{ id: 'a', label: 'A step with a very long name that does not fit the width of the dialog', content: <p>{'Content that runs on well past the width of the dialog. '.repeat(8)}</p> }, steps[1]] } };
export const Rtl: Story = { decorators: [rtl] };
