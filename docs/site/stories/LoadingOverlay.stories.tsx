// States: active spinner, progress, cancel, inactive. Not applicable: hover, focus (the Cancel button only), active, disabled, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { LoadingOverlay } from '../../../platform/components/LoadingOverlay/LoadingOverlay.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/LoadingOverlay', component: LoadingOverlay, tags: ['autodocs'],
  args: { active: true, message: 'Saving changes', children: <p>The content that is being saved stays under the veil.</p> } } satisfies Meta<typeof LoadingOverlay>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Progress: Story = { args: { progress: 42, message: 'Importing 120 assets' } };
export const Cancel: Story = { args: { onCancel: () => {} }, play: async () => { await userEvent.tab(); } };
export const Inactive: Story = { args: { active: false } };
export const LongText: Story = { args: { message: 'Importing 120 assets from the shared drive of the regional office into the workspace' } };
export const Rtl: Story = { decorators: [rtl] };
