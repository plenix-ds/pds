// States: no picture (initials), with picture, corner action, not removable, no crop, disabled, small. Hover, focus and active are on the buttons: focus is reached by play. Not applicable: loading, error (a refused file is reported), selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AvatarUpload } from '../../../platform/patterns/AvatarUpload/AvatarUpload.tsx';
import { rtl } from './rtl.tsx';

const src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="gray"/></svg>';
const meta = { title: 'Patterns/AvatarUpload', component: AvatarUpload, tags: ['autodocs'], args: { name: 'Maya Chen', onChange: () => {}, description: 'At least 200 × 200 pixels' } } satisfies Meta<typeof AvatarUpload>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const WithPicture: Story = { args: { src } };
export const Corner: Story = { args: { src, actions: 'corner', size: 'lg' } };
export const NotRemovable: Story = { args: { src, removable: false, crop: false } };
export const Small: Story = { args: { size: 'xl' } };
export const Disabled: Story = { args: { src, disabled: true } };
export const Rtl: Story = { decorators: [rtl], args: { src } };
