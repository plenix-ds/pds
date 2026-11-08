// States: delete, cancel, confirm text typed (enabled), closed. Hover, focus and active are on the controls: focus is reached by play. Not applicable: disabled is the confirm button before the name is typed, loading (busy while confirming), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Offboarding } from '../../../platform/patterns/Offboarding/Offboarding.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/Offboarding', component: Offboarding, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { open: true, accountName: 'Workspace', action: 'delete', onConfirm: () => {}, onClose: () => {} } } satisfies Meta<typeof Offboarding>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Cancel: Story = { args: { action: 'cancel' } };
export const WithExport: Story = { args: { onExport: () => {}, formats: [{ value: 'csv', label: 'CSV' }] } };
export const NameTyped: Story = { play: async ({ canvasElement }) => { const box = (canvasElement.ownerDocument.querySelector('input[type=text]') as HTMLInputElement | null); if (box) { box.focus(); await userEvent.keyboard('Workspace'); } } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { accountName: 'Shared workspace of the regional office for the northern and eastern provinces' } };
export const Rtl: Story = { decorators: [rtl] };
