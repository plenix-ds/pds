// States: modal, light, inverse (contained, so the page keeps scrolling). Not applicable: hover, focus, active, disabled, loading, error, selected (a decorative layer; it is aria-hidden).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Scrim } from '../../../platform/components/Scrim/Scrim.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Scrim', component: Scrim, tags: ['autodocs'], args: { contained: true, onClick: () => {} } } satisfies Meta<typeof Scrim>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Light: Story = { args: { variant: 'light' } };
export const Inverse: Story = { args: { variant: 'inverse' } };
export const Rtl: Story = { decorators: [rtl] };
