// The image editor is a set of steps and styles (IMAGE_EDITOR_STEPS and image-editor.css), not a component: this story shows its adjustment sliders from those steps.
// States: default (every slider at zero). Not applicable: hover, focus beyond the sliders (see Slider), active, disabled, loading, error, selected.
import type { Meta, StoryObj } from '@storybook/react-vite';
import { IMAGE_EDITOR_STEPS } from '../../../platform/patterns/ImageEditor/imageEditorSteps.js';
import { Slider } from '../../../platform/components/Slider/Slider.tsx';
import { Stack } from '../../../platform/components/Stack/Stack.tsx';
import { rtl } from './rtl.tsx';

type SliderStep = { key: string; label: string; min: number; max: number; unit?: string };
const Sliders = () => <Stack>{(IMAGE_EDITOR_STEPS.sliders as SliderStep[]).map((s) => <Slider key={s.key} label={s.label} min={s.min} max={s.max} unit={s.unit} defaultValue={0} />)}</Stack>;
const meta = { title: 'Patterns/ImageEditor', component: Sliders, tags: ['autodocs'] } satisfies Meta<typeof Sliders>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongText: Story = { render: () => <Stack><Slider label="A slider with a very long label that does not fit the width of the editor" min={-100} max={100} unit="%" defaultValue={0} /></Stack> };
export const Rtl: Story = { decorators: [rtl] };
