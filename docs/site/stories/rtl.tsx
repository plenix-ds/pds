// Decorator for the Rtl story of every part: Arabic words from the catalog, right-to-left layout.
import React from 'react';
import { LocaleProvider } from '../../../platform/providers/LocaleProvider.tsx';

export const rtl = (Story: React.ComponentType) => (
  <LocaleProvider locale="ar" dir="rtl"><Story /></LocaleProvider>
);
