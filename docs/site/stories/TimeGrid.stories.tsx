// States: week (default), today's column marked, events placed by their time, hover and focus on an event, a day view, empty. Not applicable: disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { TimeGrid } from '../../../platform/patterns/TimeGrid/TimeGrid.tsx';
import { rtl } from './rtl.tsx';

const days = [{ key: 'mon', weekday: 'Mon', day: '5' }, { key: 'tue', weekday: 'Tue', day: '6', today: true }, { key: 'wed', weekday: 'Wed', day: '7' }];
const events = [{ id: 1, day: 'tue', start: 10, end: 11.5, title: 'Site visit', time: '10:00', color: 'blue', onClick: () => {} }, { id: 2, day: 'wed', start: 9, end: 10, title: 'Hearing', time: '9:00', color: 'purple', onClick: () => {} }];
const meta = { title: 'Patterns/TimeGrid', component: TimeGrid, tags: ['autodocs'], args: { label: 'Week of 5 October', startHour: 8, endHour: 18, days, events } } satisfies Meta<typeof TimeGrid>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelector('button') as HTMLElement); } };
export const Day: Story = { args: { label: 'Tuesday 6 October', days: days.slice(1, 2), events: events.slice(0, 1) } };
export const Empty: Story = { args: { events: [] } };
export const LongText: Story = { args: { events: [{ ...events[0], title: 'A site visit to the third floor with the structural engineer and the president of the council', end: 12.5 }] } };
export const Rtl: Story = { decorators: [rtl] };
