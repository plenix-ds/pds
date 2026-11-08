// States: open (default), with a footer, non-modal, not dismissible, confirm (destructive), prompt with an error, drawer. Not applicable: hover/focus beyond its buttons (focus lands in it on open), disabled, loading, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dialog, ConfirmDialog, PromptDialog, Drawer } from '../../../platform/components/Dialog/Dialog.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Dialog', component: Dialog, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { open: true, onClose: () => {}, title: 'Rename asset', description: 'The new name shows everywhere the asset is used.', children: 'Choose a name people will recognize.' } } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithFooter: Story = { args: { footer: <><Button>Cancel</Button><Button variant="primary">Rename</Button></> } };
export const NonModal: Story = { args: { modal: false, size: 'sm' } };
export const NotDismissible: Story = { args: { dismissible: false, footer: <Button variant="primary">Got it</Button> } };
export const Confirm: Story = { render: () => <ConfirmDialog open title="Delete 3 assets?" message="This cannot be undone." confirmLabel="Delete" destructive onConfirm={() => {}} onCancel={() => {}} /> };
export const Prompt: Story = { render: () => <PromptDialog open title="Rename asset" label="Name" defaultValue="" confirmLabel="Rename" validate={(v: string) => (v.trim() ? '' : 'Enter a name.')} onSubmit={() => {}} onCancel={() => {}} /> };
export const Side: Story = { render: () => <Drawer open onClose={() => {}} title="Details" side="end" size="md">Properties of the selected asset.</Drawer> };
export const LongText: Story = { args: { title: 'Rename every asset in this collection and every collection that shares its permissions', description: 'The new names show everywhere the assets are used, in every workspace you manage, and in every shared link that points to them.' } };
export const Rtl: Story = { decorators: [rtl], args: { footer: <><Button>Cancel</Button><Button variant="primary">Rename</Button></> } };
