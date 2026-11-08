// States: saving, saved, offline, failed (with Retry). Hover, focus and active are on the Retry button: focus is reached by play. Not applicable: disabled, loading is saving, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Autosave } from '../../../platform/patterns/Autosave/Autosave.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/Autosave', component: Autosave, tags: ['autodocs'], args: { state: 'saved' } } satisfies Meta<typeof Autosave>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Saved: Story = {};
export const Saving: Story = { args: { state: 'saving' } };
export const Offline: Story = { args: { state: 'offline' } };
export const Failed: Story = { args: { state: 'failed', onRetry: () => {} } };
export const Focus: Story = { args: { state: 'failed', onRetry: () => {} }, play: async () => { await userEvent.tab(); } };
export const Rtl: Story = { decorators: [rtl], args: { state: 'failed', onRetry: () => {} } };
