// States: default, hover, focus, active, disabled, loading, selected (pressed). Not applicable: error (a destructive action is the danger variant).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Button, ButtonGroup } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Button', component: Button, tags: ['autodocs'], args: { children: 'Save' } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
const button = (c: HTMLElement) => within(c).getByRole('button');

export const Default: Story = {};
export const Primary: Story = { args: { variant: 'primary' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };
export const Hover: Story = { play: async ({ canvasElement }) => { await userEvent.hover(button(canvasElement)); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Active: Story = { play: async ({ canvasElement }) => { const b = button(canvasElement); await userEvent.hover(b); b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); } };
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Selected: Story = { args: { pressed: true } };
export const IconOnly: Story = { args: { iconOnly: true, icon: 'more_horiz', label: 'More actions' } };
export const Group: Story = { render: () => <ButtonGroup label="Transfer"><Button>Import</Button><Button>Export</Button></ButtonGroup> };
export const LongText: Story = { args: { truncate: true, children: 'Save all of the changes made to every document in this workspace' }, decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Rtl: Story = { decorators: [rtl], args: { icon: 'save' } };
