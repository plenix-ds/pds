// States: hidden (default), shown on hover, shown on keyboard focus, rich (title and body), toggletip (an action, opens on press), disabled, placements. Not applicable: loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Tooltip } from '../../../platform/components/Tooltip/Tooltip.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { Link } from '../../../platform/components/Link/Link.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Tooltip', component: Tooltip, tags: ['autodocs'], decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>], args: { content: 'Upload files', children: <Button iconOnly icon="upload" label="Upload files" /> } } satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Top: Story = { args: { placement: 'top' }, play: async () => { await userEvent.tab(); } };
export const Rich: Story = { args: { title: 'Retention', content: 'Deleted files stay in the trash for 30 days.' }, play: async () => { await userEvent.tab(); } };
export const Toggletip: Story = { args: { title: 'Smart crop', content: 'Crops to the subject of the picture.', action: <Link href="#crop" variant="standalone">About smart crop</Link> }, play: async () => { await userEvent.click(document.querySelector('button') as HTMLElement); } };
export const Disabled: Story = { args: { disabled: true } };
export const LongText: Story = { args: { content: 'Upload one or more files from your computer to this folder and to every folder that shares its permissions, in every workspace you manage.' }, play: async () => { await userEvent.tab(); } };
export const Rtl: Story = { decorators: [rtl], play: async () => { await userEvent.tab(); } };
