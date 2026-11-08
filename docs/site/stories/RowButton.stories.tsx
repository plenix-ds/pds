// States: default, hover, focus, selected, current, pressed, expanded, disabled. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { RowButton } from '../../../platform/components/RowButton/RowButton.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/RowButton', component: RowButton, tags: ['autodocs'], args: { children: 'Kitchen renovation', onClick: () => {} } } satisfies Meta<typeof RowButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('button')); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Selected: Story = { args: { selected: true } };
export const Current: Story = { args: { current: 'page' } };
export const Pressed: Story = { args: { pressed: true } };
export const Expanded: Story = { args: { expanded: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { children: 'Kitchen renovation: permits, quotes, contractors and the full schedule of works for the third floor' } };
export const Rtl: Story = { decorators: [rtl] };
