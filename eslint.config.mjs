// ESLint (npm run lint:js): one rule for now, import/no-unresolved. Every relative import must name a file that exists as
// written. TypeScript (moduleResolution "bundler") and Vite both map a ".js" or ".jsx" path to the ".ts" or ".tsx" file of
// the same name, so an import left on a renamed file's old name builds and type-checks; this rule does not map it and
// fails instead (#708: hooks/useBranchLoader.ts still named Button.jsx and Loading.jsx after the rename of slice 3).
// The node resolver adds no extensions here: an import must write its file's own extension, as every Platform import does.
// More rules come one at a time, each in its own pull request (the #882 findings: unused imports, dead locals).
import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';

const sources = ['platform/**/*.{js,jsx,mjs,ts,tsx}', 'suite/**/*.{js,jsx}', 'dam/app/**/*.{js,jsx}',
  '{dashboard,projects,messages,contacts,calendar,tasks,notes,bookmarks,files,settings}/*.{js,jsx}'];

export default [
  {
    // generated files, vendored libraries and the design spec (its own repository)
    ignores: ['platform/dist/**', 'platform/vendor/**', 'platform/design-system/**', 'platform/mobile/**',
      '*/app.js', 'dam/app/assets.js', 'platform/components/Icon/glyphs.js', '**/*.d.ts'],
  },
  {
    files: sources,
    // react-hooks is loaded with its rules off, so the source's eslint-disable comments for them name a known rule;
    // they are rules to adopt later, one at a time
    plugins: { import: importPlugin, 'react-hooks': reactHooks },
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    languageOptions: { ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } } },
    settings: { 'import/resolver': { node: { extensions: [] } } },
    rules: {
      // the names the build resolves itself: plenix-platform (the page's window.Plenix, and its icon modules), React
      'import/no-unresolved': ['error', { ignore: ['^plenix-platform(/|$)', '^react(-dom)?(/|$)'] }],
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  {
    files: ['platform/**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
  },
];
