// States: default, first page, last page, with range and page size, single page. Hover, focus and active are on the buttons: focus is reached by play. Not applicable: loading, error, selected (current page is the selected state).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Pagination } from '../../../platform/components/Pagination/Pagination.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Pagination', component: Pagination, tags: ['autodocs'], args: { page: 2, pageCount: 4, onPageChange: () => {} } } satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const First: Story = { args: { page: 1 } };
export const Last: Story = { args: { page: 4 } };
export const WithRange: Story = { args: { total: 120, perPage: 30, perPageOptions: [30, 60, 120], onPerPageChange: () => {} } };
export const SinglePage: Story = { args: { page: 1, pageCount: 1 } };
export const ManyPages: Story = { args: { page: 48, pageCount: 200 } };
export const Rtl: Story = { decorators: [rtl], args: { total: 120, perPage: 30, perPageOptions: [30, 60, 120], onPerPageChange: () => {} } };
