/* Plenix · Form, FormSection, FormActions
   Summary: A form laid out the Plenix way: titled sections of fields in one column (labels above) or two (labels beside),
     and one bar of actions at the end that stays in view while a long form scrolls.
   Usage:
     <Form label="Asset details" layout="two-column" onSubmit={save}>
       <FormSection title="General" description="Shown on the asset card.">
         <Field label="Name" required><Input value={name} onChange={…} /></Field>
         <Field label="Category"><Select options={CATEGORIES} … /></Field>
       </FormSection>
       <FormSection title="Usage rights">…</FormSection>
       <FormActions>
         <Button onClick={cancel}>Cancel</Button>
         <Button type="submit" variant="primary">Save changes</Button>
       </FormActions>
     </Form>
   Props:
     Form.layout: "one-column" (default; every field's label above its control) | "two-column" (labels beside their
       controls in one label column: settings-like forms with many short fields); a Field's own layout still wins
     Form.label: names the form for screen readers when no heading names it (aria-label)
     Form.onSubmit(event): runs when the form is submitted (Enter in a one-line field, or the submit button)
     Form.className: more classes on the <form>
     Form.children: FormSections (or Fields), then one FormActions
     FormSection.title: the section's title, a heading (it names the section)
     FormSection.description: one sentence under the title: why the section asks for this
     FormSection.headingLevel: the title's heading level (default 2: under the page title)
     FormSection.className: more classes on the section
     FormSection.children: the fields of the section, stacked
     FormActions.label: names the group of buttons for screen readers (default "Form actions")
     FormActions.sticky: the bar stays at the bottom of the scrolling page while the form is longer than it (default
       true); false keeps it in its place under the last section (a short form, a form in a card)
     FormActions.className: more classes on the bar
     FormActions.children: the buttons, in reading order: a destructive action first, the primary last (at the end)
   Behavior:
     The fields of a section are a Stack: in a two-column form they share one label column, as wide as the longest label
       (at most --plx-ref-size-160px); a label cut short shows in full in a Tooltip; in a very narrow column each label
       moves above its control (Field).
     A section is a <section> named by its title; its description is part of the page text (read in order).
     FormActions is an ActionBar: buttons at the end in one row (what does not fit folds into More actions); sticky by default.
     Other props pass through to the <form> and the <section>.
   Notes:
     One set of actions per form, never one per section. Validate on submit or when a field is left, and show the error
     under its field (Field error); with several errors, an error summary at the top of the form.
     Sections are separated by space only (no lines or frames), so a form inside a card or a dialog stays two frames deep.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { FieldLayoutContext } from '../../components/Field/Field.tsx';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Text } from '../../components/Text/Text.tsx';
import { ActionBar } from '../ActionBar/ActionBar.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';

const LAYOUTS = ['one-column', 'two-column'];

export function Form({ layout = 'one-column', label, className, children, ...rest }) {
  const lay = LAYOUTS.indexOf(layout) >= 0 ? layout : 'one-column';
  return (
    <FieldLayoutContext.Provider value={lay === 'two-column' ? 'inline' : null}>
      <form className={cx('plx-form', 'plx-form--' + lay, className)} aria-label={label} {...rest}>{children}</form>
    </FieldLayoutContext.Provider>
  );
}

export function FormSection({ title, description, headingLevel = 2, className, children, ...rest }) {
  const id = useUid('plx-form-s');
  return (
    <section className={cx('plx-form-section', className)} aria-labelledby={title ? id : undefined} {...rest}>
      {title || description ? (
        <div className="plx-form-section__header">
          {title ? <Text as={'h' + headingLevel} variant="heading" id={id} className="plx-form-section__title">{title}</Text> : null}
          {description ? <Text as="p" variant="secondary" className="plx-form-section__description">{description}</Text> : null}
        </div>
      ) : null}
      <Stack gap="md" className="plx-form-section__body">{children}</Stack>
    </section>
  );
}

export function FormActions({ label, sticky = true, className, children }) {
  const tw = useStrings('form');
  if (label === undefined) label = tw.label;
  return <ActionBar label={label} className={cx('plx-form-actions', !sticky && 'plx-form-actions--static', className)}>{children}</ActionBar>;
}
