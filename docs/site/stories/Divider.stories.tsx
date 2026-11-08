// States: default (horizontal), with text, vertical. Not applicable: hover, focus, active, disabled, loading, error, selected (a rule).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../../../platform/components/Divider/Divider.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Divider', component: Divider, tags: ['autodocs'] } satisfies Meta<typeof Divider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithText: Story = { args: { children: 'or' } };
export const Vertical: Story = { args: { orientation: 'vertical' }, decorators: [(Story) => <div className="plx-u-max-w-600px"><span>Left</span><Story /><span>Right</span></div>] };
export const LongText: Story = { args: { children: 'Continue with a different account' } };
export const Rtl: Story = { decorators: [rtl], args: { children: 'Today' } };
