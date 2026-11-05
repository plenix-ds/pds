// Every story gets the Platform stylesheet, and the toolbar switches theme and direction.
import type { Preview } from '@storybook/react-vite';
import '../platform/platform.css';

const preview: Preview = {
  globalTypes: {
    direction: { description: 'Writing direction', toolbar: { icon: 'transfer', items: ['ltr', 'rtl'], dynamicTitle: true } },
  },
  initialGlobals: { direction: 'ltr' },
  decorators: [
    (Story, context) => {
      document.documentElement.setAttribute('dir', context.globals.direction);
      return Story();
    },
  ],
  parameters: { layout: 'centered' },
};
export default preview;
