// States: page (default), inline, dialog, drawer, edit mode, dirty (unsaved-change protection), loading (a pending save), error (a failed save keeps the values), invalid. Not applicable: hover, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { FormFlow } from '../../../platform/patterns/FormFlow/FormFlow.tsx';
import { ToastProvider } from '../../../platform/components/Toast/Toast.tsx';
import { Field } from '../../../platform/components/Field/Field.tsx';
import { Input } from '../../../platform/components/Input/Input.tsx';
import { rtl } from './rtl.tsx';

type V = { name: string };
const fields = ({ value, setValue }: { value: V; setValue: (v: V) => void }) => <Field label="Name" required><Input value={value.name} onChange={(e) => setValue({ name: e.target.value })} /></Field>;
const meta = { title: 'Patterns/FormFlow', component: FormFlow<V>, tags: ['autodocs'], decorators: [(Story) => <ToastProvider><Story /></ToastProvider>], args: { title: 'Create record', initialValue: { name: '' }, onSubmit: () => {}, children: fields } } satisfies Meta<typeof FormFlow<V>>;
export default meta;
type Story = StoryObj<typeof meta>;
const save = async (c: HTMLElement) => { await userEvent.type(within(c).getByRole('textbox'), 'Cross{Enter}'); };

export const Default: Story = {};
export const Edit: Story = { args: { mode: 'edit', title: 'Edit record', initialValue: { name: 'Cross 014' } } };
export const Inline: Story = { args: { surface: 'inline' } };
export const Dialog: Story = { args: { surface: 'dialog' } };
export const Drawer: Story = { args: { surface: 'drawer' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Dirty: Story = { args: { onCancel: () => {} }, play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('textbox'), 'x'); } };
export const Loading: Story = { args: { onSubmit: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await save(canvasElement); } };
export const Error: Story = { args: { onSubmit: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await save(canvasElement); } };
export const Invalid: Story = { args: { validate: (v: V) => (v.name.trim() ? false : 'Enter a name.') }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getAllByRole('button').pop() as HTMLElement); } };
export const Rtl: Story = { decorators: [rtl] };
