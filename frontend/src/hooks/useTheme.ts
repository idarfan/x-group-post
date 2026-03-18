import { useState, useEffect } from 'react';
import type { ThemeConfig } from '../types';

export type PresetName = 'dark' | 'ubuntu' | 'macos';

export const PRESETS: Record<PresetName, ThemeConfig> = {
  dark: {
    bgPrimary: '#0a0a0a',
    bgCard: '#161616',
    bgInput: '#1c1c1c',
    textPrimary: '#e8e8e8',
    textSecondary: '#888888',
    accent: '#1d9bf0',
    accentHover: '#1a8cd8',
    focusColor: '#a855f7',
    danger: '#f4212e',
    success: '#00ba7c',
    warning: '#ffd400',
    border: '#2f3336',
    radius: 12,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSizeBase: 14,
    fontSizeSm: 12,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontWeightNormal: 400,
    fontWeightBold: 600,
    lineHeight: 1.6,
    letterSpacing: 0,
    spacingSm: 0.5,
    spacingMd: 1.0,
    spacingLg: 1.5,
    shadowEnabled: true,
    transitionSpeed: 150,
    backdropBlurEnabled: true,
    inputOpacity: 1,
  },
  ubuntu: {
    bgPrimary: '#2C2C2C',
    bgCard: '#3C3C3C',
    bgInput: '#444444',
    textPrimary: '#E0E0E0',
    textSecondary: '#AAAAAA',
    accent: '#E95420',
    accentHover: '#D44010',
    focusColor: '#a855f7',
    danger: '#CC0000',
    success: '#4CAF50',
    warning: '#FF9800',
    border: '#555555',
    radius: 6,
    fontFamily: '"Ubuntu", "Cantarell", "DejaVu Sans", sans-serif',
    fontSizeBase: 14,
    fontSizeSm: 12,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontWeightNormal: 400,
    fontWeightBold: 500,
    lineHeight: 1.5,
    letterSpacing: 0,
    spacingSm: 0.5,
    spacingMd: 1.0,
    spacingLg: 1.5,
    shadowEnabled: true,
    transitionSpeed: 150,
    backdropBlurEnabled: false,
    inputOpacity: 1,
  },
  macos: {
    bgPrimary: '#F5F5F5',
    bgCard: '#FFFFFF',
    bgInput: '#EBEBEB',
    textPrimary: '#1C1C1E',
    textSecondary: '#6C6C70',
    accent: '#007AFF',
    accentHover: '#0066DD',
    focusColor: '#a855f7',
    danger: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    border: '#D1D1D6',
    radius: 10,
    fontFamily: '"SF Pro Display", "SF Pro Text", -apple-system, system-ui, sans-serif',
    fontSizeBase: 14,
    fontSizeSm: 12,
    fontSizeLg: 16,
    fontSizeXl: 20,
    fontWeightNormal: 400,
    fontWeightBold: 600,
    lineHeight: 1.5,
    letterSpacing: -0.2,
    spacingSm: 0.5,
    spacingMd: 1.0,
    spacingLg: 1.5,
    shadowEnabled: true,
    transitionSpeed: 250,
    backdropBlurEnabled: true,
    inputOpacity: 1,
  },
};

export function applyTheme(theme: ThemeConfig): void {
  const r = document.documentElement;
  r.style.setProperty('--bg-primary', theme.bgPrimary);
  r.style.setProperty('--bg-card', theme.bgCard);
  r.style.setProperty('--bg-input', theme.bgInput);
  r.style.setProperty('--text-primary', theme.textPrimary);
  r.style.setProperty('--text-secondary', theme.textSecondary);
  r.style.setProperty('--accent', theme.accent);
  r.style.setProperty('--accent-hover', theme.accentHover);
  r.style.setProperty('--focus-color', theme.focusColor);
  r.style.setProperty('--danger', theme.danger);
  r.style.setProperty('--success', theme.success);
  r.style.setProperty('--warning', theme.warning);
  r.style.setProperty('--border', theme.border);
  r.style.setProperty('--radius', `${theme.radius}px`);
  r.style.setProperty('--font-family', theme.fontFamily);
  r.style.setProperty('--font-size-base', `${theme.fontSizeBase}px`);
  r.style.setProperty('--font-size-sm', `${theme.fontSizeSm}px`);
  r.style.setProperty('--font-size-lg', `${theme.fontSizeLg}px`);
  r.style.setProperty('--font-size-xl', `${theme.fontSizeXl}px`);
  r.style.setProperty('--font-weight-normal', `${theme.fontWeightNormal}`);
  r.style.setProperty('--font-weight-bold', `${theme.fontWeightBold}`);
  r.style.setProperty('--line-height', `${theme.lineHeight}`);
  r.style.setProperty('--letter-spacing', `${theme.letterSpacing}px`);
  r.style.setProperty('--spacing-sm', `${theme.spacingSm}rem`);
  r.style.setProperty('--spacing-md', `${theme.spacingMd}rem`);
  r.style.setProperty('--spacing-lg', `${theme.spacingLg}rem`);
  r.style.setProperty(
    '--shadow-sm',
    theme.shadowEnabled ? '0 1px 3px rgba(0,0,0,0.3)' : 'none'
  );
  r.style.setProperty(
    '--shadow-md',
    theme.shadowEnabled ? '0 4px 12px rgba(0,0,0,0.4)' : 'none'
  );
  r.style.setProperty('--transition-speed', `${theme.transitionSpeed}ms`);
  r.style.setProperty(
    '--backdrop-blur',
    theme.backdropBlurEnabled ? 'blur(8px)' : 'none'
  );
  r.style.setProperty('--input-opacity', `${theme.inputOpacity}`);
}

const STORAGE_THEME = 'ui-theme';
const STORAGE_PRESET = 'ui-preset';

function loadSavedTheme(): ThemeConfig {
  try {
    const raw = localStorage.getItem(STORAGE_THEME);
    if (raw) return JSON.parse(raw) as ThemeConfig;
  } catch {
    // 忽略損壞的資料
  }
  return PRESETS.dark;
}

function loadSavedPreset(): PresetName | null {
  const saved = localStorage.getItem(STORAGE_PRESET);
  if (saved && saved in PRESETS) return saved as PresetName;
  return 'dark';
}

export function useTheme() {
  const [preset, setPreset] = useState<PresetName | null>(loadSavedPreset);
  const [theme, setTheme] = useState<ThemeConfig>(loadSavedTheme);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_THEME, JSON.stringify(theme));
  }, [theme]);

  const applyPreset = (name: PresetName) => {
    setPreset(name);
    setTheme(PRESETS[name]);
    localStorage.setItem(STORAGE_PRESET, name);
  };

  const updateTheme = (patch: Partial<ThemeConfig>) => {
    setPreset(null);
    localStorage.removeItem(STORAGE_PRESET);
    setTheme((prev) => ({ ...prev, ...patch }));
  };

  const resetTheme = () => {
    applyPreset('dark');
  };

  return { theme, preset, updateTheme, applyPreset, resetTheme };
}
