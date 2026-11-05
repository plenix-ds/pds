// Storybook for PDS (P0-11, #193). Stories live in docs/site; each component's own stories join them later.
import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const ROOT = path.resolve(import.meta.dirname, '..');

const config: StorybookConfig = {
  stories: ['../docs/site/**/*.mdx', '../docs/site/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  // icon modules resolve to the files build-icons.js writes (the same rule as vite.platform.config.mjs)
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    resolve: {
      ...viteConfig.resolve,
      alias: [
        ...(Array.isArray(viteConfig.resolve?.alias) ? viteConfig.resolve.alias : []),
        { find: /^plenix-platform\/icons\/(.*)$/, replacement: path.join(ROOT, 'platform/dist/icons/$1.js') },
      ],
    },
  }),
};
export default config;
