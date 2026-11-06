/* Plenix · GridPane
   Summary: Internal bounded-pane context shared by SplitView and DataGrid.
   Usage: SplitView supplies the provider; the grid reads its allocated room.
   Props: Boolean context value; false outside a pane.
   Behavior: Keeps pane viewport measurement local without changing standalone grid sizing.
   Notes: No public component API or visual tokens. */
import React from 'react';
export const GridPane = React.createContext(false);
