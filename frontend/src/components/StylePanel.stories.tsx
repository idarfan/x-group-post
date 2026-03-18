import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within } from 'storybook/test';
import StylePanel from './StylePanel';
import { PRESETS } from '../hooks/useTheme';

const meta: Meta<typeof StylePanel> = {
  title: 'Components/StylePanel',
  component: StylePanel,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onClose: fn(),
    updateTheme: fn(),
    applyPreset: fn(),
    resetTheme: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof StylePanel>;

// ── 暗色系（預設）──
export const DarkPreset: Story = {
  name: '暗色系（預設）',
  args: {
    theme: PRESETS.dark,
    preset: 'dark',
  },
};

// ── Ubuntu 主題 ──
export const UbuntuPreset: Story = {
  name: 'Ubuntu GNOME 主題',
  args: {
    theme: PRESETS.ubuntu,
    preset: 'ubuntu',
  },
  parameters: {
    backgrounds: { default: 'ubuntu' },
  },
};

// ── macOS 主題 ──
export const MacosPreset: Story = {
  name: 'macOS 主題',
  args: {
    theme: PRESETS.macos,
    preset: 'macos',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

// ── 自訂主題（無 preset 選中）──
export const CustomTheme: Story = {
  name: '自訂主題（無 preset）',
  args: {
    theme: { ...PRESETS.dark, accent: '#ff6600', radius: 4 },
    preset: null,
  },
};

// ── 所有 Section 展開（版面壓力測試）──
export const AllSectionsExpanded: Story = {
  name: '所有 Section 展開',
  args: {
    theme: PRESETS.dark,
    preset: 'dark',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headers = canvas.getAllByRole('button');
    for (const btn of headers) {
      const text = btn.textContent ?? '';
      if (
        text.includes('強調色') ||
        text.includes('邊框與圓角') ||
        text.includes('字體') ||
        text.includes('行距與字距') ||
        text.includes('間距尺寸') ||
        text.includes('特效')
      ) {
        await userEvent.click(btn);
      }
    }
  },
};
