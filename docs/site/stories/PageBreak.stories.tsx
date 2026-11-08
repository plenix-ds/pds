// States: default (print only), preview. Not applicable: hover, focus, active, disabled, loading, error, selected (a decorative print break).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageBreak } from '../../../platform/components/PageBreak/PageBreak.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/PageBreak', component: PageBreak, tags: ['autodocs'] } satisfies Meta<typeof PageBreak>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Preview: Story = { args: { preview: true } };
export const Rtl: Story = { decorators: [rtl], args: { preview: true } };
