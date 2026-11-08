// States: closed (default), open, hover and focus, custom instruction dialog, loading (a pending refinement), error (a failed one keeps the text), disabled. Not applicable: selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { RefineMenu } from '../../../platform/components/RefineMenu/RefineMenu.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/RefineMenu', component: RefineMenu, tags: ['autodocs'], args: { onRefine: () => {} } } satisfies Meta<typeof RefineMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { onRefine: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await open(canvasElement); await userEvent.click(within(document.body).getAllByRole('menuitem')[0]); } };
export const Error: Story = { args: { onRefine: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await open(canvasElement); await userEvent.click(within(document.body).getAllByRole('menuitem')[0]); } };
export const LongText: Story = { args: { label: 'Refine this long paragraph of generated text before you send it to the whole team' } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await open(canvasElement); } };
