// States: default (current step), complete, error (a step needs attention), clickable (hover and focus), vertical, compact. Not applicable: disabled beyond a disabled step, loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ProgressSteps } from '../../../platform/components/ProgressSteps/ProgressSteps.tsx';
import { rtl } from './rtl.tsx';

const steps = [{ label: 'Upload', description: 'Choose the file' }, { label: 'Map columns', description: 'Match the fields' }, { label: 'Review' }, { label: 'Finish' }];
const meta = { title: 'Components/ProgressSteps', component: ProgressSteps, tags: ['autodocs'], args: { label: 'Import', current: 1, steps } } satisfies Meta<typeof ProgressSteps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const First: Story = { args: { current: 0 } };
export const Complete: Story = { args: { current: 4 } };
export const Error: Story = { args: { steps: [{ label: 'Upload' }, { label: 'Map columns', status: 'error' }, { label: 'Review' }] } };
export const Clickable: Story = { args: { onStepClick: () => {} }, play: async () => { await userEvent.tab(); } };
export const DisabledStep: Story = { args: { onStepClick: () => {}, steps: [{ label: 'Upload' }, { label: 'Map columns', disabled: true }, { label: 'Review' }] } };
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Compact: Story = { args: { variant: 'compact' } };
export const LongText: Story = { args: { steps: [{ label: 'Upload every document for the case' }, { label: 'Match each column to a field in the case file' }, { label: 'Review' }] } };
export const Rtl: Story = { decorators: [rtl] };
