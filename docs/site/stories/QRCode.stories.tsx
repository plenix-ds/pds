// States: default, sizes, levels, with a caption, with the value. The on-accent form needs an accent surface (the AppHeader's), so it is shown there, not alone. Not applicable: hover, focus, active, disabled, loading, error, selected (an image).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QRCode } from '../../../platform/components/QRCode/QRCode.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/QRCode', component: QRCode, tags: ['autodocs'], args: { value: 'https://plenix.lighthouseway.org/notes/', label: 'QR code: open Notes on your phone' } } satisfies Meta<typeof QRCode>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg', level: 'H' } };
export const Caption: Story = { args: { caption: 'Scan to open the folder on your phone' } };
export const ShowValue: Story = { args: { showValue: true } };
export const LongText: Story = { args: { showValue: true, caption: 'Scan this code with the camera of your phone to open the shared folder and everything inside it', value: 'https://plenix.lighthouseway.org/shared/folders/quarterly-review/attachments/final-version/2026' } };
export const Rtl: Story = { decorators: [rtl], args: { caption: 'Scan to open', showValue: true } };
