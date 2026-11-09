// States: welcome, checklist with progress, all done, tour. Hover, focus and active are on the checklist and buttons: focus is reached by play. Not applicable: disabled, loading, error, selected (a done task is the checked state).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Onboarding } from '../../../platform/patterns/Onboarding/Onboarding.tsx';
import { rtl } from './rtl.tsx';

const tasks = [{ id: 'profile', label: 'Complete your profile' }, { id: 'upload', label: 'Upload your first file' }, { id: 'share', label: 'Share a folder' }];
const meta = { title: 'Patterns/Onboarding', component: Onboarding, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { title: 'Welcome', tasks, completed: ['profile'], onChange: () => {}, onDismiss: () => {}, children: <p>Here is how to get started.</p> } } satisfies Meta<typeof Onboarding>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Welcome: Story = { args: { welcome: true, onWelcomeDismiss: () => {} } };
export const NothingDone: Story = { args: { completed: [] } };
export const AllDone: Story = { args: { completed: ['profile', 'upload', 'share'] } };
export const LongText: Story = { args: { tasks: [{ id: 'a', label: 'Complete your profile with the name of your regional office, your role and the committees you sit on' }, ...tasks.slice(1)] } };
export const Rtl: Story = { decorators: [rtl] };
