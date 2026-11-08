// States: request (default), pending, approved, denied (can request again), loading (a pending request), error (a failed request keeps the message), focus. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { AccessRequest } from '../../../platform/patterns/AccessRequest/AccessRequest.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/AccessRequest', component: AccessRequest, tags: ['autodocs'], args: { status: 'request', onRequest: () => {}, onOpen: () => {} } } satisfies Meta<typeof AccessRequest>;
export default meta;
type Story = StoryObj<typeof meta>;
const submit = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Pending: Story = { args: { status: 'pending' } };
export const Approved: Story = { args: { status: 'approved' } };
export const Denied: Story = { args: { status: 'denied' } };
export const Loading: Story = { args: { onRequest: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await submit(canvasElement); } };
export const Error: Story = { args: { onRequest: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await submit(canvasElement); } };
export const Rtl: Story = { decorators: [rtl] };
