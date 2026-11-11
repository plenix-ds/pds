/* Plenix · Commerce: which kind of page each commerce template is (a constant, no code to load)
   Part of the commerce templates (platform/templates/Commerce, documented in Commerce.tsx), split into one module per page and one per helper so a screen loads
   only what it draws (ADR 0052: code per screen). The public API is unchanged: Commerce.tsx and platform/index.ts export the same names. */
export const COMMERCE_PAGES: Record<string, string> = {
  'product-discovery': 'workspace', 'product-listing': 'workspace', 'product-detail': 'detail', cart: 'workspace', checkout: 'form',
  payment: 'form', 'order-confirmation': 'detail', 'order-management': 'workspace', 'order-detail': 'detail', 'subscription-management': 'settings', returns: 'form',
};
