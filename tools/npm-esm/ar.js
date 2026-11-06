// The npm package's ES modules only (#702, #709 step 5): LocaleProvider's import of i18n/ar.js resolves here
// (vite.packages.config.mjs, resolve.alias), an empty catalog that dist/i18n/ar.js fills (import '@plenix-ds/react/i18n/ar').
import { languageSlot } from '../../platform/i18n/optional.ts';

export default languageSlot('ar');
