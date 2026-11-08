// States: active (default, Archive offered), archived (banner and Restore), loading (a pending action), error (a failed action keeps the state), focus. Not applicable: hover beyond the button, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { ArchiveRestore } from '../../../platform/patterns/ArchiveRestore/ArchiveRestore.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/ArchiveRestore', component: ArchiveRestore, tags: ['autodocs'], args: { archived: false, onArchive: () => {}, onRestore: () => {}, children: 'Kitchen renovation: the record content.' } } satisfies Meta<typeof ArchiveRestore>;
export default meta;
type Story = StoryObj<typeof meta>;
const press = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Archived: Story = { args: { archived: true } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { onArchive: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await press(canvasElement); } };
export const Error: Story = { args: { onArchive: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await press(canvasElement); } };
export const RestoreError: Story = { args: { archived: true, onRestore: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await press(canvasElement); } };
export const LongText: Story = { args: { archived: true, children: 'A record with a very long description that wraps onto several lines below the banner. '.repeat(4) } };
export const Rtl: Story = { decorators: [rtl], args: { archived: true } };
