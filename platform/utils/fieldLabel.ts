/* Plenix · FieldLabelContext (platform/utils/fieldLabel.ts)
   Summary: Tells a control that its enclosing Field already names it with a <label for>, so a control that can name itself (a Textarea's label) leaves the naming to the Field (ADR 0027).
   Usage: const named = React.useContext(FieldLabelContext);   // true inside a Field that has a label
*/
import React from 'react';

export const FieldLabelContext = React.createContext(false);
