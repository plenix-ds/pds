// States: columns (default), matrix, slider (before and after), only differences, two to four items, focus on the mode control. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ComparisonView } from '../../../platform/patterns/ComparisonView/ComparisonView.tsx';
import { rtl } from './rtl.tsx';

const svg = (c: string) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="100%" height="100%" fill="' + c + '"/></svg>');
const items = [{ id: 'v2', title: 'Version 2', meta: '2 Oct 2026', image: { src: svg('#ccd'), alt: 'Hero banner, version 2' }, values: { format: 'JPEG', size: '2.4 MB', width: '1920' } }, { id: 'v3', title: 'Version 3', meta: '9 Oct 2026', image: { src: svg('#dcc'), alt: 'Hero banner, version 3' }, values: { format: 'PNG', size: '3.1 MB', width: '1920' } }];
const attributes = [{ key: 'format', label: 'Format' }, { key: 'size', label: 'Size', kind: 'data' as const }, { key: 'width', label: 'Width', kind: 'data' as const }];
const meta = { title: 'Patterns/ComparisonView', component: ComparisonView, tags: ['autodocs'], args: { label: 'Compare versions', items, attributes, modes: ['columns', 'matrix', 'slider'] } } satisfies Meta<typeof ComparisonView>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Matrix: Story = { args: { defaultMode: 'matrix' } };
export const Slider: Story = { args: { defaultMode: 'slider' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const ThreeItems: Story = { args: { items: [...items, { id: 'v4', title: 'Version 4', meta: '16 Oct 2026', image: { src: svg('#cdc'), alt: 'Hero banner, version 4' }, values: { format: 'PNG', size: '3.4 MB', width: '2560' } }] } };
export const LongText: Story = { args: { items: items.map((it) => ({ ...it, title: it.title + ' of the hero banner for every printed and digital use of the new brand' })) } };
export const Rtl: Story = { decorators: [rtl] };
