import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme, PRESETS, applyTheme } from './useTheme';

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
  document.documentElement.removeAttribute('style');
});

describe('PRESETS', () => {
  it('dark preset 有所有必要欄位', () => {
    const d = PRESETS.dark;
    expect(d.bgPrimary).toBe('#0a0a0a');
    expect(d.accent).toBe('#1d9bf0');
    expect(d.radius).toBe(12);
  });

  it('ubuntu preset 有橘色 accent', () => {
    expect(PRESETS.ubuntu.accent).toBe('#E95420');
  });

  it('macos preset 背景為亮色', () => {
    expect(PRESETS.macos.bgPrimary).toBe('#F5F5F5');
    expect(PRESETS.macos.accent).toBe('#007AFF');
  });
});

describe('applyTheme', () => {
  it('將顏色套用到 CSS 變數', () => {
    applyTheme(PRESETS.dark);
    const style = document.documentElement.style;
    expect(style.getPropertyValue('--bg-primary')).toBe('#0a0a0a');
    expect(style.getPropertyValue('--accent')).toBe('#1d9bf0');
    expect(style.getPropertyValue('--radius')).toBe('12px');
  });

  it('shadowEnabled=false 時設定 --shadow-sm 為 none', () => {
    applyTheme({ ...PRESETS.dark, shadowEnabled: false });
    expect(document.documentElement.style.getPropertyValue('--shadow-sm')).toBe('none');
  });

  it('shadowEnabled=true 時設定陰影值', () => {
    applyTheme({ ...PRESETS.dark, shadowEnabled: true });
    expect(document.documentElement.style.getPropertyValue('--shadow-sm')).not.toBe('none');
  });

  it('backdropBlurEnabled=false 時設定 none', () => {
    applyTheme({ ...PRESETS.dark, backdropBlurEnabled: false });
    expect(document.documentElement.style.getPropertyValue('--backdrop-blur')).toBe('none');
  });

  it('font-size-base 套用正確 px 值', () => {
    applyTheme({ ...PRESETS.dark, fontSizeBase: 16 });
    expect(document.documentElement.style.getPropertyValue('--font-size-base')).toBe('16px');
  });

  it('spacing 套用 rem 值', () => {
    applyTheme({ ...PRESETS.dark, spacingSm: 0.75 });
    expect(document.documentElement.style.getPropertyValue('--spacing-sm')).toBe('0.75rem');
  });
});

describe('useTheme hook', () => {
  it('預設使用 dark preset', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.preset).toBe('dark');
    expect(result.current.theme.bgPrimary).toBe(PRESETS.dark.bgPrimary);
  });

  it('applyPreset 切換到 ubuntu', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('ubuntu');
    });
    expect(result.current.preset).toBe('ubuntu');
    expect(result.current.theme.accent).toBe(PRESETS.ubuntu.accent);
  });

  it('applyPreset 切換到 macos', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('macos');
    });
    expect(result.current.preset).toBe('macos');
    expect(result.current.theme.bgPrimary).toBe(PRESETS.macos.bgPrimary);
  });

  it('applyPreset 將 preset 名稱存入 localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('ubuntu');
    });
    expect(localStorage.getItem('ui-preset')).toBe('ubuntu');
  });

  it('updateTheme 局部更新主題並清除 preset', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.updateTheme({ accent: '#ff0000' });
    });
    expect(result.current.preset).toBeNull();
    expect(result.current.theme.accent).toBe('#ff0000');
    expect(result.current.theme.bgPrimary).toBe(PRESETS.dark.bgPrimary);
  });

  it('updateTheme 移除 localStorage preset key', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('ubuntu');
      result.current.updateTheme({ accent: '#aabbcc' });
    });
    expect(localStorage.getItem('ui-preset')).toBeNull();
  });

  it('resetTheme 回到 dark preset', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('macos');
      result.current.resetTheme();
    });
    expect(result.current.preset).toBe('dark');
    expect(result.current.theme.bgPrimary).toBe(PRESETS.dark.bgPrimary);
  });

  it('theme 儲存至 localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('ubuntu');
    });
    const stored = JSON.parse(localStorage.getItem('ui-theme') ?? '{}') as Record<string, unknown>;
    expect(stored['accent']).toBe(PRESETS.ubuntu.accent);
  });

  it('從 localStorage 恢復 preset', () => {
    localStorage.setItem('ui-preset', 'macos');
    localStorage.setItem('ui-theme', JSON.stringify(PRESETS.macos));
    const { result } = renderHook(() => useTheme());
    expect(result.current.preset).toBe('macos');
    expect(result.current.theme.bgPrimary).toBe(PRESETS.macos.bgPrimary);
  });

  it('localStorage 損壞資料時回到 dark', () => {
    localStorage.setItem('ui-theme', 'invalid json{{{');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme.bgPrimary).toBe(PRESETS.dark.bgPrimary);
  });

  it('applyTheme 在 theme 改變時被呼叫', () => {
    const spy = vi.spyOn(document.documentElement.style, 'setProperty');
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.applyPreset('ubuntu');
    });
    expect(spy).toHaveBeenCalledWith('--accent', PRESETS.ubuntu.accent);
    spy.mockRestore();
  });
});
