// States: default, with a label, many lines. Not applicable: hover, focus, active, disabled, loading, error, selected (a printed writing area).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnswerLines } from '../../../platform/components/AnswerLines/AnswerLines.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/AnswerLines', component: AnswerLines, tags: ['autodocs'] } satisfies Meta<typeof AnswerLines>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Labeled: Story = { args: { label: 'Notes', lines: 4 } };
export const ManyLines: Story = { args: { label: 'Statement', lines: 12 } };
export const LongText: Story = { args: { label: 'Describe, in your own words and in as much detail as you can, what happened on the day of the hearing', lines: 3 } };
export const Rtl: Story = { decorators: [rtl], args: { label: 'Notes', lines: 4 } };
