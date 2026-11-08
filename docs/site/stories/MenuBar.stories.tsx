// States: default (closed menus), open, hover and focus on a menu button, overflow ("More menus" when narrow). Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { MenuBar, MenuBarMenu } from '../../../platform/components/MenuBar/MenuBar.tsx';
import { MenuItem, MenuDivider } from '../../../platform/components/Menu/Menu.tsx';
import { rtl } from './rtl.tsx';

const menus = (<><MenuBarMenu label="File"><MenuItem onSelect={() => {}}>New</MenuItem><MenuDivider /><MenuItem checked onSelect={() => {}}>Show ruler</MenuItem></MenuBarMenu><MenuBarMenu label="Edit"><MenuItem onSelect={() => {}}>Undo</MenuItem></MenuBarMenu><MenuBarMenu label="View"><MenuItem onSelect={() => {}}>Zoom in</MenuItem></MenuBarMenu></>);
const meta = { title: 'Components/MenuBar', component: MenuBar, tags: ['autodocs'], args: { label: 'Application', children: menus } } satisfies Meta<typeof MenuBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Open: Story = { play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('menuitem', { name: 'File' })); } };
export const Small: Story = { args: { size: 'sm' } };
export const Narrow: Story = { decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const LongText: Story = { args: { children: <><MenuBarMenu label="A menu with a very long name that takes room"><MenuItem onSelect={() => {}}>Item</MenuItem></MenuBarMenu><MenuBarMenu label="Another long menu name"><MenuItem onSelect={() => {}}>Item</MenuItem></MenuBarMenu></> } };
export const Rtl: Story = { decorators: [rtl] };
