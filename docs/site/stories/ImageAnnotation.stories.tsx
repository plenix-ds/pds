// States: default (list of notes beside the image), selected note (opens its thread), add a note, a failed add keeps the text (error), empty. Not applicable: hover, disabled, loading, selected beyond the note.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { ImageAnnotation } from '../../../platform/patterns/ImageAnnotation/ImageAnnotation.tsx';
import { rtl } from './rtl.tsx';

const src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320"><rect width="100%" height="100%" fill="#dde"/></svg>');
const annotations = [{ id: 'a1', label: 'Logo', kind: 'pin' as const, location: 'Top left', x: 12, y: 18, comments: [{ id: 1, author: 'Maya Chen', body: 'Can the logo be larger?' }] }, { id: 'a2', label: 'Headline', kind: 'region' as const, location: 'Center', x: 200, y: 140 }];
const meta = { title: 'Patterns/ImageAnnotation', component: ImageAnnotation, tags: ['autodocs'], args: { src, alt: 'Review artwork', annotations, onAdd: () => {}, onReply: () => {} } } satisfies Meta<typeof ImageAnnotation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { selectedId: 'a1' } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Empty: Story = { args: { annotations: [] } };
export const AddError: Story = { args: { onAdd: () => Promise.reject(new globalThis.Error('failed')) } };
export const LongText: Story = { args: { annotations: [{ ...annotations[0], label: 'A note with a very long label that does not fit the width of the list and so wraps', comments: [{ id: 1, author: 'Maya Chen', body: 'A comment that runs on well past the width of the thread and so wraps onto several lines below the author name.' }] }], selectedId: 'a1' } };
export const Rtl: Story = { decorators: [rtl] };
