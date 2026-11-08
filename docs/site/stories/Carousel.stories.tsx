// States: default, paused/playing autoplay, last page (Next disabled). Hover, focus and active are on the controls: focus is reached by play. Not applicable: loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Carousel } from '../../../platform/components/Carousel/Carousel.tsx';
import { Card } from '../../../platform/components/Card/Card.tsx';
import { rtl } from './rtl.tsx';

const slides = ['Brand kit', 'Annual report', 'Floor plans', 'Meeting notes', 'Photos'].map((t) => <Card key={t} title={t} meta="12 assets">Shared with the team.</Card>);
const meta = { title: 'Components/Carousel', component: Carousel, tags: ['autodocs'], args: { label: 'Featured assets', children: slides } } satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ThreePerView: Story = { args: { perView: 3 } };
export const Dots: Story = { args: { controls: 'dots' } };
export const Arrows: Story = { args: { controls: 'arrows' } };
export const Autoplay: Story = { args: { autoplay: true } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const LastPage: Story = { args: { page: 4, onPageChange: () => {} } };
export const SingleSlide: Story = { args: { children: slides[0] } };
export const Rtl: Story = { decorators: [rtl] };
