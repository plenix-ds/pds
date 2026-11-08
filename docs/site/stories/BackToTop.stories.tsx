// States: inline (always shown), floating (shown after a screen of scrolling; here forced by a tall frame), hover and focus. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { BackToTop } from '../../../platform/components/BackToTop/BackToTop.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/BackToTop', component: BackToTop, tags: ['autodocs'], args: { variant: 'inline' } } satisfies Meta<typeof BackToTop>;
export default meta;
type Story = StoryObj<typeof meta>;
const button = (c: HTMLElement) => within(c).getByRole('button');

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(button(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Floating: Story = { args: { variant: 'floating' } };
export const LongText: Story = { args: { strings: { label: 'Back to the top of this very long page' } } };
export const Rtl: Story = { decorators: [rtl] };
