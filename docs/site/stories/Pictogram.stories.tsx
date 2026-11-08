// States: sizes, two-tone, named. Not applicable: hover, focus, active, disabled, loading, error, selected (a picture).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pictogram } from '../../../platform/components/Pictogram/Pictogram.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Pictogram', component: Pictogram, tags: ['autodocs'], args: { icon: 'upload' } } satisfies Meta<typeof Pictogram>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: '48' } };
export const Large: Story = { args: { size: '96', icon: 'folder-open' } };
export const TwoTone: Story = { args: { size: '96', icon: 'folder-open', twoTone: true } };
export const Named: Story = { args: { label: 'Upload files' } };
export const Rtl: Story = { decorators: [rtl], args: { label: 'Upload files' } };
