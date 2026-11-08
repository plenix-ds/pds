// States: default, hover/focus (the button), loading, no more (ends), infinite. Not applicable: error (the app's list shows it), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { LoadMore } from '../../../platform/components/LoadMore/LoadMore.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/LoadMore', component: LoadMore, tags: ['autodocs'], args: { onLoadMore: () => {}, hasMore: true, shown: 20, total: 120, pageSize: 20 } } satisfies Meta<typeof LoadMore>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Loading: Story = { args: { loading: true } };
export const End: Story = { args: { hasMore: false, shown: 120 } };
export const Infinite: Story = { args: { mode: 'infinite' } };
export const NoTotal: Story = { args: { total: undefined } };
export const Rtl: Story = { decorators: [rtl] };
