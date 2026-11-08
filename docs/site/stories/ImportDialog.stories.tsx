// States: file (default), paste, url, a validation error (invalid), loading (a pending import), error (a failed import keeps the input), closed. Not applicable: hover and focus beyond its controls, disabled beyond pending, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { ImportDialog } from '../../../platform/patterns/ImportDialog/ImportDialog.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/ImportDialog', component: ImportDialog, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, onImport: () => {}, onClose: () => {}, accept: '.csv' } } satisfies Meta<typeof ImportDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
const body = () => within(document.body);

export const Default: Story = {};
export const Paste: Story = { args: { initialMode: 'paste' } };
export const Url: Story = { args: { initialMode: 'url' } };
export const Invalid: Story = { args: { initialMode: 'url' }, play: async () => { await userEvent.click(body().getByRole('button', { name: /import/i })); } };
export const Loading: Story = { args: { initialMode: 'paste', onImport: () => new Promise(() => {}) }, play: async () => { await userEvent.type(body().getByRole('textbox'), 'a,b{Enter}'); await userEvent.click(body().getByRole('button', { name: /import/i })); } };
export const Error: Story = { args: { initialMode: 'paste', onImport: () => Promise.reject(new globalThis.Error('failed')) }, play: async () => { await userEvent.type(body().getByRole('textbox'), 'a,b'); await userEvent.click(body().getByRole('button', { name: /import/i })); } };
export const Multiple: Story = { args: { multiple: true } };
export const Closed: Story = { args: { open: false } };
export const Rtl: Story = { decorators: [rtl] };
