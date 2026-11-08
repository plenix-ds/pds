// States: masonry, grid, justified, lightbox, empty. Hover, focus and active are on the images (buttons when openable): focus is reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AssetGallery } from '../../../platform/patterns/AssetGallery/AssetGallery.tsx';
import { rtl } from './rtl.tsx';

const src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="gray"/></svg>';
const items = [1, 2, 3, 4, 5, 6].map((n) => ({ id: n, src, alt: 'Placeholder ' + n, title: 'photo-' + n + '.jpg', meta: '2.4 MB', ratio: n % 2 ? 1.33 : 0.75 }));
const meta = { title: 'Patterns/AssetGallery', component: AssetGallery, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { items, label: 'Project images', lightbox: true } } satisfies Meta<typeof AssetGallery>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Grid: Story = { args: { layout: 'grid' } };
export const Justified: Story = { args: { layout: 'justified' } };
export const Small: Story = { args: { size: 'xs' } };
export const OpenHandler: Story = { args: { lightbox: false, onOpen: () => {} } };
export const Empty: Story = { args: { items: [], empty: 'No images yet.' } };
export const LongText: Story = { args: { items: items.map((i) => ({ ...i, title: 'Quarterly summary of expenditure by department and cost centre for every regional office ' + i.id + '.jpg' })) } };
export const Rtl: Story = { decorators: [rtl] };
