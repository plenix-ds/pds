/* Plenix · Commerce: the hook that claims a template's kind of page on the AppShell
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
import React from 'react';
import { useAppLayout } from '../../patterns/AppShell/AppShell.tsx';
import { COMMERCE_PAGES } from './pages.ts';

// a template claims its kind of page on the AppShell around it (the layout standard lays it out)
export function useCommercePage(template: string) {
  const shell = useAppLayout();
  const claim = shell && shell.claimPage;
  const kind = COMMERCE_PAGES[template];
  React.useEffect(() => (claim && kind ? claim(kind) : undefined), [claim, kind]);
}

