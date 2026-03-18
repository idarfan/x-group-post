import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StylePanel from './StylePanel';
import { PRESETS } from '../hooks/useTheme';
import type { PresetName } from '../hooks/useTheme';

const baseProps = {
  onClose: vi.fn(),
  theme: PRESETS.dark,
  preset: 'dark' as PresetName,
  updateTheme: vi.fn(),
  applyPreset: vi.fn(),
  resetTheme: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('StylePanel 渲染', () => {
  it('顯示面板標題', () => {
    render(<StylePanel {...baseProps} />);
    expect(screen.getByText('🎨 UI Style 設定')).toBeInTheDocument();
  });

  it('顯示三個預設主題卡片', () => {
    render(<StylePanel {...baseProps} />);
    expect(screen.getByText('暗色系')).toBeInTheDocument();
    expect(screen.getByText('Ubuntu GNOME')).toBeInTheDocument();
    expect(screen.getByText('macOS')).toBeInTheDocument();
  });

  it('active preset 卡片有 active class', () => {
    render(<StylePanel {...baseProps} preset="ubuntu" />);
    const ubuntuCard = screen.getByText('Ubuntu GNOME').closest('button');
    expect(ubuntuCard).toHaveClass('sp-preset-card--active');
  });

  it('非 active preset 卡片沒有 active class', () => {
    render(<StylePanel {...baseProps} preset="dark" />);
    const macosCard = screen.getByText('macOS').closest('button');
    expect(macosCard).not.toHaveClass('sp-preset-card--active');
  });

  it('preset 為 null 時沒有卡片有 active class', () => {
    render(<StylePanel {...baseProps} preset={null} />);
    const cards = screen.getAllByRole('button', { name: /暗色系|Ubuntu GNOME|macOS/ });
    cards.forEach((card) => {
      expect(card).not.toHaveClass('sp-preset-card--active');
    });
  });

  it('預設展開背景顏色和文字顏色 section', () => {
    render(<StylePanel {...baseProps} />);
    expect(screen.getByText('主背景')).toBeInTheDocument();
    expect(screen.getByText('主要文字')).toBeInTheDocument();
  });

  it('強調色 section 預設折疊', () => {
    render(<StylePanel {...baseProps} />);
    expect(screen.queryByText('主強調色')).not.toBeInTheDocument();
  });

  it('點擊強調色 section 展開', () => {
    render(<StylePanel {...baseProps} />);
    fireEvent.click(screen.getByText('🎨 強調色'));
    expect(screen.getByText('主強調色')).toBeInTheDocument();
  });

  it('顯示重設按鈕', () => {
    render(<StylePanel {...baseProps} />);
    expect(screen.getByText('↺ 重設為預設值')).toBeInTheDocument();
  });
});

describe('StylePanel 互動', () => {
  it('點擊 ✕ 呼叫 onClose', () => {
    render(<StylePanel {...baseProps} />);
    fireEvent.click(screen.getByText('✕'));
    expect(baseProps.onClose).toHaveBeenCalledOnce();
  });

  it('點擊 overlay 背景呼叫 onClose', () => {
    const { container } = render(<StylePanel {...baseProps} />);
    const overlay = container.querySelector('.sp-overlay');
    if (overlay) fireEvent.click(overlay);
    expect(baseProps.onClose).toHaveBeenCalledOnce();
  });

  it('點擊面板本身不呼叫 onClose', () => {
    const { container } = render(<StylePanel {...baseProps} />);
    const panel = container.querySelector('.sp-panel');
    if (panel) fireEvent.click(panel);
    expect(baseProps.onClose).not.toHaveBeenCalled();
  });

  it('點擊預設主題卡片呼叫 applyPreset', () => {
    render(<StylePanel {...baseProps} />);
    fireEvent.click(screen.getByText('Ubuntu GNOME').closest('button')!);
    expect(baseProps.applyPreset).toHaveBeenCalledWith('ubuntu');
  });

  it('點擊重設按鈕 + confirm 呼叫 resetTheme', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<StylePanel {...baseProps} />);
    fireEvent.click(screen.getByText('↺ 重設為預設值'));
    expect(baseProps.resetTheme).toHaveBeenCalledOnce();
    vi.restoreAllMocks();
  });

  it('點擊重設按鈕 + 取消不呼叫 resetTheme', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(<StylePanel {...baseProps} />);
    fireEvent.click(screen.getByText('↺ 重設為預設值'));
    expect(baseProps.resetTheme).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('展開 section 後 toggle 元件可操作', () => {
    render(<StylePanel {...baseProps} />);
    fireEvent.click(screen.getByText('✨ 特效'));
    // 找到「啟用陰影」那一行的 toggle 按鈕
    const toggleBtn = screen.getByText('啟用陰影')
      .closest('.sp-row')
      ?.querySelector('.sp-toggle');
    expect(toggleBtn).not.toBeNull();
    if (toggleBtn) fireEvent.click(toggleBtn);
    expect(baseProps.updateTheme).toHaveBeenCalledWith({ shadowEnabled: false });
  });

  it('color picker 變更呼叫 updateTheme', () => {
    const { container } = render(<StylePanel {...baseProps} />);
    // 背景顏色 section 預設展開，取第一個隱藏 color input (bgPrimary)
    const colorInputs = container.querySelectorAll('input.sp-color-hidden');
    fireEvent.change(colorInputs[0]!, { target: { value: '#ff0000' } });
    expect(baseProps.updateTheme).toHaveBeenCalledWith({ bgPrimary: '#ff0000' });
  });

  it('slider 變更呼叫 updateTheme', () => {
    const { container } = render(<StylePanel {...baseProps} />);
    // 展開邊框 section 以取得 radius slider
    fireEvent.click(screen.getByText('◻ 邊框與圓角'));
    const sliders = container.querySelectorAll('input[type="range"]');
    // 第一個 slider 在邊框 section 是 radius
    const radiusSlider = Array.from(sliders).find(
      (s) => s.closest('.sp-section')?.querySelector('.sp-section-hd span')?.textContent?.includes('邊框')
    );
    expect(radiusSlider).not.toBeNull();
    if (radiusSlider) fireEvent.change(radiusSlider, { target: { value: '8' } });
    expect(baseProps.updateTheme).toHaveBeenCalledWith({ radius: 8 });
  });
});
