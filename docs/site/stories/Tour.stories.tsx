// States: open at a step, last step, closed, no spotlight. Hover, focus and active are on the Next, Back and Skip buttons: focus is reached by play. Not applicable: disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Tour } from '../../../platform/patterns/Tour/Tour.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const steps = [
  { id: 'filters', target: <Button>Filters</Button>, title: 'Saved filters', content: 'Save a set of filters and open it from here next time.' },
  { id: 'share', target: <Button>Share</Button>, title: 'Share a folder', content: 'Send a folder without accounts.' },
  { id: 'done', target: <Button>Done</Button>, title: 'You are set', content: 'Open the checklist any time.' },
];
const meta = { title: 'Patterns/Tour', component: Tour, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { steps, open: true, onOpenChange: () => {}, onFinish: () => {} } } satisfies Meta<typeof Tour>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LastStep: Story = { args: { defaultStep: 2 } };
export const NoSpotlight: Story = { args: { spotlight: false } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { steps: [{ ...steps[0], title: 'Saved filters for every list in the workspace of the regional office', content: 'Save a set of filters for the documents held by the finance committee and open them again from here next time.' }, steps[1]] } };
export const Rtl: Story = { decorators: [rtl] };
