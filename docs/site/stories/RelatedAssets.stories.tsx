// States: strip, grid, empty. Hover, focus and active are on the cards and the carousel controls: focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RelatedAssets } from '../../../platform/patterns/RelatedAssets/RelatedAssets.tsx';
import { rtl } from './rtl.tsx';

const src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="gray"/></svg>';
const items = [1, 2, 3, 4].map((n) => ({ id: n, src, alt: '', title: 'photo-' + n + '.jpg', meta: '2.4 MB', href: '#/asset/' + n }));
const meta = { title: 'Patterns/RelatedAssets', component: RelatedAssets, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { items, label: 'Related assets', variant: 'strip' } } satisfies Meta<typeof RelatedAssets>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Grid: Story = { args: { variant: 'grid' } };
export const OpenHandler: Story = { args: { items: items.map((i) => ({ ...i, href: undefined })), onOpen: () => {} } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: items.map((i) => ({ ...i, title: 'Quarterly summary of expenditure by department and cost centre for every regional office ' + i.id + '.jpg' })) } };
export const Rtl: Story = { decorators: [rtl] };
