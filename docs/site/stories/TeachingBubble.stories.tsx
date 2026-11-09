// States: open, with step (a tour), with media, closed. Focus: reached by play (the bubble's buttons). Not applicable: hover/active are the buttons, disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TeachingBubble } from '../../../platform/components/TeachingBubble/TeachingBubble.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/TeachingBubble', component: TeachingBubble, tags: ['autodocs'],
  args: { target: <Button icon="filter">Filters</Button>, open: true, onDismiss: () => {}, title: 'Saved filters', primaryAction: { label: 'Got it', onClick: () => {} }, children: 'Save a set of filters and open it from here next time.' } } satisfies Meta<typeof TeachingBubble>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Step: Story = { args: { step: { current: 2, total: 3 }, secondaryAction: { label: 'Back', onClick: () => {} }, primaryAction: { label: 'Next', onClick: () => {} } } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { title: 'Save a set of filters and open it from here the next time you come back to the list', children: 'Save a set of filters for the documents held by the finance committee for every region and every quarter of the year, and open them from here next time.' } };
export const Rtl: Story = { decorators: [rtl] };
