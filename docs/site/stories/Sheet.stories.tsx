// States: open (medium), large detent, task sheet (Cancel and Done), with footer, closed. Focus: the sheet takes focus when it opens; its buttons are reached by play. Not applicable: hover/active are the buttons, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Sheet } from '../../../platform/components/Sheet/Sheet.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Sheet', component: Sheet, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { open: true, onClose: () => {}, title: 'Details', description: 'About this project', children: <p>The kitchen remodel starts in March.</p> } } satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Large: Story = { args: { detent: 'large' } };
export const Task: Story = { args: { title: 'Rename', onDone: () => {} }, play: async () => { await userEvent.tab(); } };
export const Footer: Story = { args: { footer: <Button variant="primary" size="sm">Save</Button> } };
export const WithIcon: Story = { args: { icon: 'user' } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { title: 'Details of the kitchen remodel for the third floor of the regional office', children: <p>The kitchen remodel starts in March and covers the cabinets, the island, the restored window frames and the lighting, with the plumber and the electrician booked for the second week.</p> } };
export const Rtl: Story = { decorators: [rtl] };
