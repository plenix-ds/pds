// States: default (loaded), loading (the placeholder), error (the fallback), ratios, fit, rounded. Not applicable: hover, focus, active, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Image } from '../../../platform/components/Image/Image.tsx';
import { rtl } from './rtl.tsx';

const svg = (w: number, h: number) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><rect width="100%" height="100%" fill="#bcd"/></svg>');
const meta = { title: 'Components/Image', component: Image, tags: ['autodocs'], args: { src: svg(640, 480), alt: 'The finished kitchen, oak cabinets', ratio: '4-3' } } satisfies Meta<typeof Image>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Wide: Story = { args: { ratio: '16-9', src: svg(1280, 720) } };
export const Contain: Story = { args: { fit: 'contain', ratio: '1-1', src: svg(640, 240) } };
export const Rounded: Story = { args: { rounded: true } };
export const Loading: Story = { args: { src: '/files/slow.jpg', placeholder: 'color' } };
export const Error: Story = { args: { src: '/files/missing.jpg' } };
export const LongText: Story = { args: { src: '/files/missing.jpg', alt: 'The finished kitchen with oak cabinets, a marble island, three pendant lights and a window over the sink looking out on the garden' } };
export const Rtl: Story = { decorators: [rtl] };
