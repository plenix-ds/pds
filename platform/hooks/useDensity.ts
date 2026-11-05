/* Plenix · useDensity
   Summary: Gives the current page's display density and a way to change it.
   Usage:
     const [density, setDensity] = useDensity();
   Props:
     returns: [density, setDensity]; density is "compact" | "standard" | "comfortable" (the data-plx-density attribute on <html>,
       "standard" when unset); setDensity(value) changes it through the workspace runtime (window.PlenixWorkspace)
   Behavior:
     Inside a ThemeProvider it reads the provider and re-renders when the density changes.
     Outside one it reads <html> directly, with no re-render on change.
*/
import React from 'react';
import { ThemeContext } from '../providers/ThemeProvider.tsx';

// the setter is missing only inside a ThemeZone with no ThemeProvider around it
export function useDensity(): [string, ((density: string) => void) | undefined] {
  const ctx = React.useContext(ThemeContext);
  if (ctx) return [ctx.density, ctx.setDensity];
  const set = (d: string) => { if (window.PlenixWorkspace) window.PlenixWorkspace.setDensity(d); };
  return [document.documentElement.getAttribute('data-plx-density') || 'standard', set];
}

export const unusedProof197 = 1;
