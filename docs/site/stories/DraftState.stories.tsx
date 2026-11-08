// States: default, saving, saved, offline, failed. Hover, focus and active are on Resume and Discard: focus is reached by play. Not applicable: disabled, loading is saving, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DraftState } from '../../../platform/patterns/DraftState/DraftState.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/DraftState', component: DraftState, tags: ['autodocs'], args: { version: '3', onResume: () => {}, onDiscard: () => {} } } satisfies Meta<typeof DraftState>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Saving: Story = { args: { saveState: 'saving' } };
export const Saved: Story = { args: { saveState: 'saved' } };
export const Offline: Story = { args: { saveState: 'offline' } };
export const Failed: Story = { args: { saveState: 'failed' } };
export const NoVersion: Story = { args: { version: undefined } };
export const Rtl: Story = { decorators: [rtl] };
