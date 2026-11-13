import { useStrings } from '../../providers/LocaleProvider.tsx';
// the templates' words come from the catalog (templates.templates.Templates in platform/i18n), so an Arabic page shows them in
// Arabic; a template's strings prop still wins
export const useWords = (strings: any): any => useStrings('templates.templates.Templates', strings);
