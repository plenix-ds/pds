// States: default (banner), card, dialog, dismissible (the default), loading (dismissal pending), error (dismissal failed). Not applicable: hover/focus on the announcement itself, disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Announcement } from '../../../platform/components/Announcement/Announcement.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Announcement', component: Announcement, tags: ['autodocs'], args: { id: 'release', title: 'New workspace tools', children: 'Folders now share their permissions with every file inside them.' } } satisfies Meta<typeof Announcement>;
export default meta;
type Story = StoryObj<typeof meta>;
const dismiss = async (c: HTMLElement) => { await userEvent.click(within(c).getByRole('button')); };

export const Default: Story = {};
export const Card: Story = { args: { variant: 'card', actions: <Button size="sm">See what changed</Button> } };
export const Dialog: Story = { args: { variant: 'dialog', actions: <Button size="sm">Got it</Button> } };
export const NotDismissible: Story = { args: { dismissible: false } };
export const Loading: Story = { args: { onDismiss: () => new Promise(() => {}) }, play: async ({ canvasElement }) => { await dismiss(canvasElement); } };
export const Error: Story = { args: { onDismiss: () => Promise.reject(new globalThis.Error('failed')) }, play: async ({ canvasElement }) => { await dismiss(canvasElement); } };
export const LongText: Story = { args: { title: 'Folders now share their permissions with every file and every subfolder inside them', children: 'Anyone who can open a folder can now open everything inside it, in every workspace you manage, until you change the setting on the folder itself.' } };
export const Rtl: Story = { decorators: [rtl] };
