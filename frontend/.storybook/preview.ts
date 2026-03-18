import type { Preview } from '@storybook/react-vite';
import '../src/App.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'ubuntu', value: '#2C2C2C' },
        { name: 'light', value: '#F5F5F5' },
      ],
    },
  },
};

export default preview;
