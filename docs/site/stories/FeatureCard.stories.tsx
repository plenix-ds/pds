// States: icon, image, horizontal, link, button, hues. Hover, focus and active are on the card when it is a link or button: reached by play. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { FeatureCard } from '../../../platform/patterns/FeatureCard/FeatureCard.tsx';
import { rtl } from './rtl.tsx';

const image = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect width="320" height="200" fill="gray"/></svg>';
const meta = { title: 'Patterns/FeatureCard', component: FeatureCard, tags: ['autodocs'], args: { icon: 'sparkle', hue: 'purple', title: 'Smart tags', description: 'Tags your pictures as they upload.', href: '#/tags' } } satisfies Meta<typeof FeatureCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(within(canvasElement).getByRole('link')); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Image: Story = { args: { variant: 'image', image, imageAlt: '', icon: undefined, title: 'Brand kit', description: 'Logos, colors and fonts in one place.' } };
export const Horizontal: Story = { args: { variant: 'horizontal', icon: 'share', hue: 'blue', title: 'Share links', description: 'Send a folder without accounts.' } };
export const Button: Story = { args: { href: undefined, onOpen: () => {} } };
export const Static: Story = { args: { href: undefined } };
export const Green: Story = { args: { hue: 'green' } };
export const LongText: Story = { args: { title: 'Smart tags for every picture uploaded to the shared drive of the regional office', description: 'Tags your pictures as they upload, suggests the folder they belong in and keeps the names consistent across every team.' } };
export const Rtl: Story = { decorators: [rtl] };
