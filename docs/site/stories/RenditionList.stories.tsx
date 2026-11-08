// States: table, menu, with progress, empty. Hover, focus and active are on the download buttons: focus is reached by play. Not applicable: disabled, loading is progress, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { RenditionList } from '../../../platform/patterns/RenditionList/RenditionList.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 1, name: 'Original', format: 'PNG', size: 4800000, href: '#/o.png', fileName: 'original.png' }, { id: 2, name: 'Web', format: 'JPG', size: 480000, href: '#/w.jpg', fileName: 'web.jpg' }, { id: 3, name: 'Print', format: 'PDF', size: 9600000, progress: 42 }];
const meta = { title: 'Patterns/RenditionList', component: RenditionList, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { items, variant: 'table' } } satisfies Meta<typeof RenditionList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Menu: Story = { args: { variant: 'menu' } };
export const MenuOpen: Story = { args: { variant: 'menu' }, play: async () => { await userEvent.tab(); await userEvent.keyboard('{Enter}'); } };
export const Empty: Story = { args: { items: [] } };
export const LongText: Story = { args: { items: [{ id: 1, name: 'Original file exactly as it was uploaded by the finance committee secretary', format: 'PNG', size: 4800000, href: '#/o.png' }] } };
export const Rtl: Story = { decorators: [rtl] };
