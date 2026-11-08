// States: default (hidden text names an icon-only control; shown here beside it for review). Not applicable: hover, focus, active, disabled, loading, error, selected (it has no look).
import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from '../../../platform/components/VisuallyHidden/VisuallyHidden.tsx';
import { Icon } from '../../../platform/components/Icon/Icon.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/VisuallyHidden', component: VisuallyHidden, tags: ['autodocs'], args: { children: 'Delete' } } satisfies Meta<typeof VisuallyHidden>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <button type="button"><Icon name="trash" /><VisuallyHidden {...args} /></button> };
export const AsHeading: Story = { render: () => <section aria-labelledby="vh-title"><VisuallyHidden as="h2" id="vh-title">Search results</VisuallyHidden><p>Three results.</p></section> };
export const LongText: Story = { render: () => <button type="button"><Icon name="trash" /><VisuallyHidden>Delete this file and every earlier version of it from this folder and from every folder that shares it</VisuallyHidden></button> };
export const Rtl: Story = { decorators: [rtl], render: (args) => <button type="button"><Icon name="trash" /><VisuallyHidden {...args} /></button> };
