// States: open (initially), closed with badge, dismissed. Focus: reached by play (the bubble's buttons). Not applicable: hover/active are the buttons, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { FeatureIntro } from '../../../platform/patterns/FeatureIntro/FeatureIntro.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Patterns/FeatureIntro', component: FeatureIntro, tags: ['autodocs'],
  args: { title: 'Saved views', target: <Button>Views</Button>, initiallyOpen: true, onDismiss: () => {}, children: 'Save and reuse filters.' } } satisfies Meta<typeof FeatureIntro>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Badge: Story = { args: { initiallyOpen: false, showBadge: true } };
export const Closed: Story = { args: { initiallyOpen: false } };
export const LongText: Story = { args: { title: 'Saved views for every list in the workspace of the regional office', children: 'Save a set of filters for the documents held by the finance committee and open them again from here next time.' } };
export const Rtl: Story = { decorators: [rtl] };
