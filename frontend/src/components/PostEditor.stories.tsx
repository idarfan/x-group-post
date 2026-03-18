import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import PostEditor from './PostEditor';

const meta: Meta<typeof PostEditor> = {
  title: 'Components/PostEditor',
  component: PostEditor,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof PostEditor>;

export const WithContent: Story = {
  name: '有內容',
  args: {
    post: '🛒 【團購】精選好物\n\n📦 商品名稱：日本直送零食組合\n💰 原價：$1,200\n🎉 團購價：$890\n\n📅 截止日期：2026-03-31\n📮 取貨方式：全家店到店 $68\n\n歡迎加入！數量有限，先搶先贏！',
    onChange: fn(),
  },
};

export const Empty: Story = {
  name: '空白',
  args: {
    post: '',
    onChange: fn(),
  },
};
