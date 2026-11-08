// States: default (none), with a value (selected stars), hover, focus, half stars, read-only, disabled-like read-only. Not applicable: loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Rating } from '../../../platform/components/Rating/Rating.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Rating', component: Rating, tags: ['autodocs'], args: { label: 'Rating', value: 0, onChange: () => {} } } satisfies Meta<typeof Rating>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { value: 3 } };
export const Hover: Story = { args: { value: 3 }, play: async () => { await userEvent.hover(document.querySelectorAll('[role=radio]')[4] as HTMLElement); } };
export const Focus: Story = { args: { value: 3 }, play: async () => { await userEvent.tab(); } };
export const Half: Story = { args: { half: true, value: 3.5 } };
export const ReadOnly: Story = { args: { readOnly: true, value: 4 } };
export const ReadOnlyHalf: Story = { args: { readOnly: true, half: true, value: 3.5 } };
export const TenStars: Story = { args: { max: 10, value: 7 } };
export const LongText: Story = { args: { label: 'How would you rate the way the council handled every part of your case from filing to decision', value: 2 } };
export const Rtl: Story = { decorators: [rtl], args: { half: true, value: 3.5 } };
