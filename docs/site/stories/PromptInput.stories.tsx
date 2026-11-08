// States: default, hover, focus, with a draft, streaming (Stop), loading (a pending send), error (a failed send keeps the draft), disabled, read-only, multiline, with models and attachments. Not applicable: selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { PromptInput } from '../../../platform/components/PromptInput/PromptInput.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/PromptInput', component: PromptInput, tags: ['autodocs'], args: { defaultValue: '', onSend: () => {} } } satisfies Meta<typeof PromptInput>;
export default meta;
type Story = StoryObj<typeof meta>;
const send = async (c: HTMLElement) => { await userEvent.type(within(c).getByRole('textbox'), 'Summarize the case{Enter}'); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithDraft: Story = { args: { defaultValue: 'Summarize the hearing notes' } };
export const Multiline: Story = { args: { multiline: true, defaultValue: 'A longer prompt\non two lines' } };
export const Streaming: Story = { args: { streaming: true, onStop: () => {} } };
export const Loading: Story = { args: { onSend: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await send(canvasElement); } };
export const Error: Story = { args: { onSend: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await send(canvasElement); } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Summarize the hearing notes' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Summarize the hearing notes' } };
export const WithModelsAndFiles: Story = { args: { attachments: true, models: [{ id: 'fast', label: 'Fast' }, { id: 'deep', label: 'Deep' }], model: 'fast', onModelChange: () => {} } };
export const LongText: Story = { args: { multiline: true, defaultValue: 'Summarize every hearing note, every supporting letter and every piece of new evidence in the case file, and list the open questions for the president. '.repeat(3) } };
export const Rtl: Story = { decorators: [rtl] };
