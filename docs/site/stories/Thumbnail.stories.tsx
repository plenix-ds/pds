// States: icon (no picture), picture, failed picture (falls back to the icon). Not applicable: hover, focus, active, disabled, loading (lazy image), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Thumbnail } from '../../../platform/components/Thumbnail/Thumbnail.tsx';
import { rtl } from './rtl.tsx';

const src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="gray"/></svg>';
const meta = { title: 'Components/Thumbnail', component: Thumbnail, tags: ['autodocs'] } satisfies Meta<typeof Thumbnail>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Image: Story = { args: { src, alt: 'A gray placeholder' } };
export const Failed: Story = { args: { src: 'data:image/png;base64,invalid', alt: '' } };
export const OtherIcon: Story = { args: { icon: 'folder' } };
export const Rtl: Story = { decorators: [rtl], args: { src, alt: 'A gray placeholder' } };
