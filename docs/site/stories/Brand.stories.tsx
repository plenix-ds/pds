// States: the kinds of the mark. Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandMark } from '../../../platform/components/Brand/Brand.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Brand', component: BrandMark, tags: ['autodocs'], args: { label: 'Plenix' } } satisfies Meta<typeof BrandMark>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Logo: Story = { args: { kind: 'logo', size: 'lg' } };
export const Wordmark: Story = { args: { kind: 'wordmark', tone: 'mono' } };
export const Product: Story = { args: { kind: 'product', app: 'notes' } };
export const ProductTileOnly: Story = { args: { kind: 'product', app: 'notes', showName: false } };
export const Rtl: Story = { args: { kind: 'logo' }, decorators: [rtl] };
