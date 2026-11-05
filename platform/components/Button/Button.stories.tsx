/* Plenix · Button stories (Component Story Format 3): one story per state of the state manifest
   (tools/checks/states/manifest.json, check 9), plus the outline family side by side (pds#269). Hover, focus and active
   are drawn with the classes the design system uses for them (is-hover, is-focus-visible, is-pointer-down). */
import React from 'react';
import { Button } from './Button.tsx';

const meta = { title: 'Components/Button', component: Button };
export default meta;

export const Default = { args: { children: 'Edit council session' } };
export const Hover = { args: { children: 'Edit council session', className: 'is-hover' } };
export const Focus = { args: { children: 'Edit council session', className: 'is-focus-visible' } };
export const Active = { args: { children: 'Edit council session', className: 'is-pointer-down' } };
export const Disabled = { args: { children: 'Edit council session', disabled: true } };
export const Loading = { args: { children: 'Saving', variant: 'primary', loading: true } };
export const Selected = { args: { children: 'Show grid', pressed: true } };
// pds#269: secondary, tertiary and danger-secondary share one light elevation
export const OutlineFamily = {
  render: () => (
    <>
      <Button icon="pencil">Edit council session</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="danger-secondary" icon="trash">Delete</Button>
    </>
  ),
};
