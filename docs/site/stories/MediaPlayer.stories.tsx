// States: audio, video without a source, with transcript, fill. Hover, focus and active are on the player's controls: focus is reached by play. Not applicable: disabled, selected; loading and error are the browser's media states.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MediaPlayer } from '../../../platform/components/MediaPlayer/MediaPlayer.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/MediaPlayer', component: MediaPlayer, tags: ['autodocs'], args: { kind: 'audio', label: 'Project walkthrough' } } satisfies Meta<typeof MediaPlayer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Video: Story = { args: { kind: 'video' } };
export const Transcript: Story = { args: { showTranscript: true, transcript: [{ start: 0, text: 'Welcome to the walkthrough.' }, { start: 6, text: 'First, the kitchen.' }] } };
export const Rates: Story = { args: { rates: [0.5, 1, 1.5, 2] } };
export const LongText: Story = { args: { label: 'Project walkthrough of the kitchen remodel with the oak finish, the new island and the restored windows' } };
export const Rtl: Story = { decorators: [rtl] };
