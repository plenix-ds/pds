// States: page, file, person, selected, with path and snippet, group. Hover, focus and active are on the opener: reached by play. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { SearchResult, SearchResultGroup } from '../../../platform/components/SearchResult/SearchResult.tsx';
import { rtl } from './rtl.tsx';

const list = (Story: React.ComponentType) => <ul className="plx-u-max-w-600px"><Story /></ul>;
const meta = { title: 'Components/SearchResult', component: SearchResult, tags: ['autodocs'], decorators: [list],
  args: { title: 'Cabinet quote.pdf', kind: 'file', href: '#/files/41', query: 'quote', path: ['Projects', 'Kitchen renovation'], snippet: '…the second quote covers the cabinets and…' } } satisfies Meta<typeof SearchResult>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Page: Story = { args: { kind: 'page', title: 'Kitchen renovation', path: undefined } };
export const Person: Story = { args: { kind: 'person', title: 'Maya Chen', avatar: { name: 'Maya Chen' }, path: undefined, snippet: undefined, meta: 'Project lead' } };
export const Selected: Story = { args: { selected: true } };
export const Button: Story = { args: { href: undefined, onOpen: () => {} } };
export const Group: Story = { decorators: [], render: () => <SearchResultGroup heading="Files" count={12} moreHref="#/search/files?q=quote" moreLabel="Show all 12 files"><SearchResult kind="file" title="Cabinet quote.pdf" href="#/files/41" query="quote" /></SearchResultGroup> };
export const LongText: Story = { args: { title: 'Quarterly summary of expenditure by department and cost centre for every regional office 2026.pdf', snippet: '…the quote for the northern and eastern provinces covers the cabinets, the island, the restored window frames and the lighting the neighbors keep asking about…' } };
export const Rtl: Story = { decorators: [list, rtl] };
