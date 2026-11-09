// States: caption below, caption overlay, credit. Not applicable: hover, focus, active, disabled, loading, error, selected (not interactive).
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Figure } from '../../../platform/components/Figure/Figure.tsx';
import { Image } from '../../../platform/components/Image/Image.tsx';
import { rtl } from './rtl.tsx';

const meta = { title: 'Components/Figure', component: Figure, tags: ['autodocs'],
  args: { caption: 'The kitchen after the remodel, with the oak finish the client chose.', children: <Image alt="The finished kitchen" ratio="4-3" /> } } satisfies Meta<typeof Figure>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Credit: Story = { args: { credit: 'Photo: Ana Ruiz' } };
export const Overlay: Story = { args: { captionPosition: 'overlay', caption: 'Lisbon office, east wing' } };
export const NoCaption: Story = { args: { caption: undefined } };
export const LongText: Story = { args: { caption: 'The kitchen after the remodel, with the oak finish the client chose, the new island, the restored window frames and the lighting the neighbors keep asking about.', credit: 'Photo: Ana Ruiz, for the regional design review' } };
export const Rtl: Story = { decorators: [rtl], args: { credit: 'Photo: Ana Ruiz' } };
