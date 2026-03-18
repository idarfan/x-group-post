import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import TranslatedPreview from './TranslatedPreview';

const meta: Meta<typeof TranslatedPreview> = {
  title: 'Components/TranslatedPreview',
  component: TranslatedPreview,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof TranslatedPreview>;

export const Default: Story = {
  name: '翻譯結果',
  args: {
    text: '這是從英文翻譯過來的商品描述：日本直送的精選零食組合，包含多種口味，適合送禮自用。',
    onChange: fn(),
  },
};
