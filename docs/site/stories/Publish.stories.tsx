// States: draft (default), scheduled, published, publish confirmation open, schedule dialog open, read-only, loading (a pending action), error (a failed action). Not applicable: hover and focus beyond its buttons, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Publish } from '../../../platform/patterns/Publish/Publish.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/Publish', component: Publish, tags: ['autodocs'], args: { name: 'Easter banner', status: 'draft', audience: 'everyone in the library', onPublish: () => {}, onSchedule: () => {} } } satisfies Meta<typeof Publish>;
export default meta;
type Story = StoryObj<typeof meta>;
const press = async (label: RegExp) => { await userEvent.click(within(document.body).getByRole('button', { name: label })); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Scheduled: Story = { args: { status: 'scheduled', scheduledFor: '2026-10-20T09:00', onCancelSchedule: () => {} } };
export const Published: Story = { args: { status: 'published', publishedAt: '2026-10-15T10:24', by: 'Maya Chen', onUnpublish: () => {} } };
export const AskPublish: Story = { play: async () => { await press(/^publish/i); } };
export const AskSchedule: Story = { play: async () => { await press(/schedule/i); } };
export const ReadOnly: Story = { args: { status: 'published', publishedAt: '2026-10-15T10:24', readOnly: true } };
export const Loading: Story = { args: { confirm: false, onPublish: () => new Promise(() => {}) }, play: async () => { await press(/^publish/i); } };
export const Error: Story = { args: { confirm: false, onPublish: () => Promise.reject(new globalThis.Error('failed')) }, play: async () => { await press(/^publish/i); } };
export const LongText: Story = { args: { name: 'An announcement banner with a very long name that does not fit the width of the row', audience: 'every member of every team in every workspace you manage' } };
export const Rtl: Story = { decorators: [rtl] };
