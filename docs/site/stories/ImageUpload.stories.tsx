// States: empty (drop zone), with an image (Replace, Remove), multiple, at the maximum, with alt text, cropped, hover and focus on Choose. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ImageUpload, ImageCrop } from '../../../platform/patterns/ImageUpload/ImageUpload.tsx';
import { rtl } from './rtl.tsx';

const url = (c: string) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="' + c + '"/></svg>');
const one = [{ id: 1, url: url('#cdd'), name: 'cover.png', size: 48200, alt: '' }];
const many = [...one, { id: 2, url: url('#dcd'), name: 'second.png', size: 51000, alt: '' }, { id: 3, url: url('#ddc'), name: 'third.png', size: 39000, alt: '' }];
const meta = { title: 'Patterns/ImageUpload', component: ImageUpload, tags: ['autodocs'], args: { value: [], onChange: () => {}, label: 'Cover image' } } satisfies Meta<typeof ImageUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithImage: Story = { args: { value: one, ratio: '16-9' } };
export const AltText: Story = { args: { value: one, altText: true } };
export const Multiple: Story = { args: { value: many, multiple: true, label: 'Product photos' } };
export const AtMaximum: Story = { args: { value: many, multiple: true, max: 3 } };
export const Crop: Story = { render: () => <ImageCrop src={url('#cdd')} ratio="1-1" onApply={() => {}} onCancel={() => {}} /> };
export const LongText: Story = { args: { value: [{ ...one[0], name: 'a-file-with-a-very-long-name-that-does-not-fit-the-width-of-its-preview-tile.png' }], altText: true } };
export const Rtl: Story = { decorators: [rtl], args: { value: one } };
