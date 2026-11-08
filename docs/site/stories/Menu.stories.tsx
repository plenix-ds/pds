// States: closed (default), open, hover and focus on an item, disabled item, danger item, checked item, submenu, context menu. Not applicable: loading, error, selected (the checked item is its selected state).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Menu, MenuItem, MenuDivider, MenuRadioGroup, MenuSub, ContextMenu } from '../../../platform/components/Menu/Menu.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const items = (<><MenuItem icon="pencil" onSelect={() => {}}>Rename</MenuItem><MenuItem icon="copy" onSelect={() => {}}>Duplicate</MenuItem><MenuDivider /><MenuItem icon="trash" danger onSelect={() => {}}>Delete</MenuItem></>);
const meta = { title: 'Components/Menu', component: Menu, tags: ['autodocs'], parameters: { layout: 'padded' }, args: { label: 'Actions', trigger: <Button caret>Actions</Button>, children: items } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Open: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const ItemFocus: Story = { play: async ({ canvasElement }) => { await open(canvasElement); await userEvent.keyboard('{ArrowDown}'); } };
export const DisabledItem: Story = { args: { children: <><MenuItem onSelect={() => {}}>Rename</MenuItem><MenuItem disabled>Move</MenuItem></> }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Checked: Story = { args: { children: <><MenuItem checked onSelect={() => {}}>Show ruler</MenuItem><MenuItem checked={false} onSelect={() => {}}>Show grid</MenuItem></> }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Radio: Story = { args: { children: <MenuRadioGroup label="Sort by" value="name" onChange={() => {}}><MenuItem value="name">Name</MenuItem><MenuItem value="date">Date modified</MenuItem></MenuRadioGroup> }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Submenu: Story = { args: { children: <MenuSub label="Move to" icon="move"><MenuItem onSelect={() => {}}>Brand kit</MenuItem><MenuItem onSelect={() => {}}>Archive</MenuItem></MenuSub> }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Context: Story = { render: () => <ContextMenu target={<div tabIndex={0}>Cross 014 (right-click)</div>} label="Asset actions"><MenuItem icon="pencil" onSelect={() => {}}>Rename</MenuItem></ContextMenu> };
export const LongText: Story = { args: { children: <MenuItem onSelect={() => {}}>Move every selected file and its subfolders to the shared archive</MenuItem> }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await open(canvasElement); } };
