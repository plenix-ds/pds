// States: default, hover and focus (the name is the card's link), sale, out of stock (the action turned off), list layout, no image. Not applicable: loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ProductCard } from '../../../platform/patterns/ProductCard/ProductCard.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const img = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="100%" height="100%" fill="#dcb"/></svg>');
const meta = { title: 'Patterns/ProductCard', component: ProductCard, tags: ['autodocs'], args: { title: 'Beeswax taper, 12 in', href: '#/p/taper-12', image: { src: img, alt: '' }, price: 18, currency: 'USD', meta: 'Monastery candles', rating: 4.5, reviewCount: 38, onAddToCart: () => {} } } satisfies Meta<typeof ProductCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('a') as HTMLElement); } };
export const Sale: Story = { args: { price: 24, compareAtPrice: 32 } };
export const OutOfStock: Story = { args: { outOfStock: true, action: <Button size="xs">Notify me</Button> } };
export const List: Story = { args: { layout: 'list', price: 24, compareAtPrice: 32 } };
export const NoImage: Story = { args: { image: undefined } };
export const LongText: Story = { args: { title: 'A hand-poured beeswax taper candle, twelve inches tall, made by the monks of the monastery', meta: 'Monastery candles, vigil lights and altar supplies for every parish' } };
export const Rtl: Story = { decorators: [rtl], args: { price: 24, compareAtPrice: 32 } };
