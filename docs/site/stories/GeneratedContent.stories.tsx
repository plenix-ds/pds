// States: default (the latest version), with versions (previous and next), loading (regenerating), error (a failed action keeps the version), feedback. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { GeneratedContent } from '../../../platform/components/GeneratedContent/GeneratedContent.tsx';
import { rtl } from './rtl.tsx';

const versions = [{ id: 'v1', content: 'The council meets on the first Thursday of each quarter.' }, { id: 'v2', content: 'The council meets quarterly, on the first Thursday.' }];
const meta = { title: 'Components/GeneratedContent', component: GeneratedContent, tags: ['autodocs'], args: { versions } } satisfies Meta<typeof GeneratedContent>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Single: Story = { args: { versions: versions.slice(0, 1), onRegenerate: () => {}, onFeedback: () => {} } };
export const WithActions: Story = { args: { onRegenerate: () => {}, onFeedback: () => {} } };
export const Loading: Story = { args: { loading: true, onRegenerate: () => {} } };
export const Pending: Story = { args: { onRegenerate: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button', { name: /regenerate/i })); } };
export const Error: Story = { args: { onRegenerate: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('button', { name: /regenerate/i })); } };
export const Focus: Story = { args: { onRegenerate: () => {} }, play: async () => { await userEvent.tab(); } };
export const LongText: Story = { args: { versions: [{ id: 'v1', content: 'The council meets on the first Thursday of each quarter, in the main chamber, with the president presiding and every member of the standing committees present, unless the meeting has been adjourned by a vote of the majority. '.repeat(3) }] } };
export const Rtl: Story = { decorators: [rtl], args: { onRegenerate: () => {}, onFeedback: () => {} } };
