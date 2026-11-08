// States: text (default), images (page navigation, hover and focus on its buttons), loading and error (a PDF that cannot be read), empty. Not applicable: disabled, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { DocumentViewer } from '../../../platform/components/DocumentViewer/DocumentViewer.tsx';
import { rtl } from './rtl.tsx';

const svg = (n: number) => 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="640"><rect width="100%" height="100%" fill="#eee"/><text x="40" y="80" font-size="32">Page ' + n + '</text></svg>');
const pages = [1, 2, 3].map((n) => ({ id: n, src: svg(n), alt: 'Page ' + n }));
const meta = { title: 'Components/DocumentViewer', component: DocumentViewer, tags: ['autodocs'], args: { kind: 'text', label: 'Report', text: 'Quarterly report\n\nThe council met on the first Thursday of the quarter.' } } satisfies Meta<typeof DocumentViewer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Images: Story = { args: { kind: 'images', pages } };
export const Focus: Story = { args: { kind: 'images', pages }, play: async () => { await userEvent.tab(); } };
export const Zoomed: Story = { args: { kind: 'images', pages, initialZoom: 150 } };
export const Loading: Story = { args: { kind: 'pdf', text: undefined, src: '/files/slow.pdf' } };
export const Error: Story = { args: { kind: 'pdf', text: undefined, src: '/files/missing.pdf' } };
export const Empty: Story = { args: { kind: 'images', pages: [], text: undefined } };
export const LongText: Story = { args: { text: 'A very long unbroken line of report text that does not fit the width of the viewer and so wraps onto several lines inside the text document instead of scrolling sideways, repeated. '.repeat(6) } };
export const Rtl: Story = { decorators: [rtl], args: { kind: 'images', pages } };
