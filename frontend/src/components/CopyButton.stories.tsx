import type { Meta, StoryObj } from '@storybook/react-vite';
import CopyButton from './CopyButton';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  name: '預設',
  args: { text: '這是要複製的文字內容' },
};
