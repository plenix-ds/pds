// States: accent (default), frost, plain, with search, with an action, with a brand object, item current, hover and focus on an item, compact. Not applicable: disabled, loading, error.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { AppHeader } from '../../../platform/patterns/AppHeader/AppHeader.tsx';
import { rtl } from './rtl.tsx';

const nav = (<><AppHeader.Item label="Projects" current href="#projects" /><AppHeader.Item label="Reports" count={3} href="#reports" /></>);
const meta = { title: 'Patterns/AppHeader', component: AppHeader, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, args: { tone: 'accent', appName: 'Assets', nav } } satisfies Meta<typeof AppHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Frost: Story = { args: { tone: 'frost' } };
export const Plain: Story = { args: { tone: 'plain' } };
export const WithAction: Story = { args: { action: <AppHeader.Action icon="hdr-upload" onClick={() => {}}>Upload</AppHeader.Action> } };
export const OrganizationBrand: Story = { args: { tone: 'plain', brand: { organization: 'Diocese of Los Angeles', application: 'Clerical Tribunal Management' } } };
export const BrandLink: Story = { args: { tone: 'plain', brandHref: '#home' }, play: async () => { await userEvent.tab(); } };
export const Focus: Story = { play: async () => { await userEvent.tab(); } };
export const Hover: Story = { play: async () => { await userEvent.hover(document.querySelectorAll('a')[1] as HTMLElement); } };
export const LongText: Story = { args: { tone: 'plain', brand: { organization: 'The Roman Catholic Archdiocese of Los Angeles and its surrounding parishes', application: 'Clerical Tribunal Management' } } };
export const Rtl: Story = { decorators: [rtl] };
