// States: open (image), several items, with actions, closed. Focus: the viewer takes focus when it opens; its controls are reached by play. Not applicable: hover/active are the controls, disabled, loading, error, selected.
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { MediaViewer } from '../../../platform/components/MediaViewer/MediaViewer.tsx';
import { Button } from '../../../platform/components/Button/Button.tsx';
import { rtl } from './rtl.tsx';

const items = [
  { src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="gray"/></svg>', alt: 'A gray placeholder', title: 'hero.jpg', meta: ['JPG', '2.4 MB'] },
  { src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="silver"/></svg>', alt: 'A silver placeholder', title: 'second.jpg', meta: ['JPG', '1.1 MB'] },
];
const meta = { title: 'Components/MediaViewer', component: MediaViewer, tags: ['autodocs'], parameters: { layout: 'fullscreen' },
  args: { open: true, onClose: () => {}, items, label: 'Photos' } } satisfies Meta<typeof MediaViewer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SecondItem: Story = { args: { defaultIndex: 1 } };
export const Single: Story = { args: { items: items.slice(0, 1) } };
export const Actions: Story = { args: { actions: <Button size="sm">Download</Button> }, play: async () => { await userEvent.tab(); } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { items: [{ ...items[0], title: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.jpg' }] } };
export const Rtl: Story = { decorators: [rtl] };
