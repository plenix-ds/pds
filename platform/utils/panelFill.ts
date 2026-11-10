/* Plenix · panelFill
   Summary: The context a WidgetGrid item gives its direct Panel so the Panel fills the item's cell (ADR 0054, issue 1229).
   Notes: a Panel reads it and clears it for its own children, so a Panel nested deeper never fills.
*/
import React from 'react';

/** @internal true inside a WidgetGrid item, until the first Panel */
export const PanelFillContext = React.createContext(false);
