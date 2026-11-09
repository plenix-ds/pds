// States: first step, middle, last (Done), free navigation, validation error, with summary. Hover, focus and active are on the buttons and step list: focus is reached by play. Not applicable: disabled (Back on the first step), loading (saving), selected is the current step.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Wizard } from '../../../platform/patterns/Wizard/Wizard.tsx';
import { rtl } from './rtl.tsx';

const steps = [
  { id: 'details', label: 'Details', content: <p>Name the record.</p> },
  { id: 'people', label: 'People', content: <p>Choose who can see it.</p> },
  { id: 'review', label: 'Review', content: <p>Check everything.</p> },
];
const meta = { title: 'Patterns/Wizard', component: Wizard, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { label: 'Create record', steps, onComplete: () => {}, onCancel: () => {} } } satisfies Meta<typeof Wizard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Middle: Story = { args: { defaultStep: 1 } };
export const Last: Story = { args: { defaultStep: 2 } };
export const Free: Story = { args: { navigation: 'free' } };
export const ValidationError: Story = { args: { steps: [{ ...steps[0], validate: () => 'Enter a name.' }, ...steps.slice(1)] }, play: async ({ canvasElement }) => { const next = Array.from(canvasElement.querySelectorAll('button')).find((b) => /next/i.test(b.textContent || '')); if (next) await userEvent.click(next); } };
export const Summary: Story = { args: { summary: <p>3 people will be notified.</p>, defaultStep: 2 } };
export const LongText: Story = { args: { steps: steps.map((s, i) => ({ ...s, label: i === 0 ? 'Details of the quarterly summary of expenditure by department' : s.label })) } };
export const Rtl: Story = { decorators: [rtl] };
