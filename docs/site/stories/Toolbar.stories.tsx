// States: default, with groups and a spacer, narrow (folds into More), bar variant. Hover, focus and active are on the buttons: focus is reached by play. Not applicable: disabled (a disabled Button is shown), loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Toolbar } from '../../../platform/components/Toolbar/Toolbar.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Toolbar', component: Toolbar, tags: ['autodocs'], parameters: { layout: 'padded' },
  args: { label: 'Asset actions', children: [
    <Toolbar.Group key="a"><Button icon="upload">Upload</Button><Button icon="share">Share</Button></Toolbar.Group>,
    <Toolbar.Spacer key="s" />,
    <Toolbar.Group key="b"><Button icon="trash" disabled>Delete</Button><Button icon="download">Download</Button></Toolbar.Group>] } } satisfies Meta<typeof Toolbar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Narrow: Story = { decorators: [(Story) => <div className="plx-u-max-w-600px"><Story /></div>] };
export const Bar: Story = { args: { variant: 'bar' } };
export const LongText: Story = { args: { children: [<Button key="1" icon="upload">Upload every document from the shared drive of the regional office</Button>, <Button key="2" icon="share">Share with the whole finance committee</Button>] } };
export const Rtl: Story = { decorators: [rtl] };
