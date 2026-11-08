// States: results (default), search with matches, empty search, an article open (Back), external article link, closed. Not applicable: hover and focus beyond its buttons, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { HelpPanel } from '../../../platform/patterns/HelpPanel/HelpPanel.tsx';
import { rtl } from './rtl.tsx';

const articles = [{ id: 'upload', title: 'Upload files', summary: 'Add files from your computer.', content: <p>Drag files into the window or choose them with the Upload button.</p> }, { id: 'share', title: 'Share a folder', summary: 'Give a team access.', content: <p>Open the folder and choose Share.</p> }, { id: 'policy', title: 'Retention policy', summary: 'How long files stay in the trash.', href: '/help/retention' }];
const meta = { title: 'Patterns/HelpPanel', component: HelpPanel, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { open: true, title: 'Help', articles, onOpenChange: () => {} } } satisfies Meta<typeof HelpPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Search: Story = { play: async () => { await userEvent.type(within(document.body).getByRole('searchbox'), 'share'); } };
export const NoMatches: Story = { play: async () => { await userEvent.type(within(document.body).getByRole('searchbox'), 'zzzz'); } };
export const Article: Story = { play: async () => { await userEvent.click(within(document.body).getByRole('button', { name: /upload files/i })); } };
export const Closed: Story = { args: { open: false } };
export const LongText: Story = { args: { articles: [{ id: 'a', title: 'A help article with a very long title that does not fit the width of the panel and so wraps', summary: 'A summary that runs on well past the width of the panel and so wraps onto several lines below the title.' }] } };
export const Rtl: Story = { decorators: [rtl] };
