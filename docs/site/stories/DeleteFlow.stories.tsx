// States: closed (the trigger), confirm (the question), type to confirm, undo (a toast), move to trash, loading-free: the app deletes. Not applicable: hover and focus beyond its buttons, disabled, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { DeleteFlow } from '../../../platform/patterns/DeleteFlow/DeleteFlow.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const items = [{ id: 'c1', label: 'Easter' }, { id: 'c2', label: 'Advent' }];
const meta = { title: 'Patterns/DeleteFlow', component: DeleteFlow, tags: ['autodocs'], args: { items, noun: 'category', plural: 'categories', consequence: 'Their 14 assets stay, without a category.', onDelete: () => {}, trigger: <Button variant="danger-secondary" icon="trash">Delete</Button> } } satisfies Meta<typeof DeleteFlow>;
export default meta;
type Story = StoryObj<typeof meta>;
const open = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Confirm: Story = { play: async ({ canvasElement }) => { await open(canvasElement); } };
export const OneItem: Story = { args: { items: [items[0]] }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const TypeToConfirm: Story = { args: { variant: 'type', items: [{ id: 'p', label: 'Kitchen renovation' }], noun: 'project', consequence: 'Its 230 assets and 12 boards are deleted too.' }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Undo: Story = { args: { variant: 'undo', onRestore: () => {}, onCommit: () => {} }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Trash: Story = { args: { variant: 'trash', retention: 30, onRestore: () => {} }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const LongText: Story = { args: { items: [{ id: 'x', label: 'A category with a very long name that does not fit the width of the dialog and so wraps onto several lines' }], consequence: 'Every asset in it stays, without a category, and every rule that points to it stops working until you choose another.' }, play: async ({ canvasElement }) => { await open(canvasElement); } };
export const Rtl: Story = { decorators: [rtl], play: async ({ canvasElement }) => { await open(canvasElement); } };
