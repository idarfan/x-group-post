import { useState } from 'react';
import type { ThemeConfig } from '../types';
import type { PresetName } from '../hooks/useTheme';

interface StylePanelProps {
  onClose: () => void;
  theme: ThemeConfig;
  preset: PresetName | null;
  updateTheme: (patch: Partial<ThemeConfig>) => void;
  applyPreset: (name: PresetName) => void;
  resetTheme: () => void;
}

const PRESET_META: Record<PresetName, { label: string; desc: string; swatch: string[] }> = {
  dark:   { label: '暗色系', desc: '預設深黑背景', swatch: ['#0a0a0a', '#1d9bf0', '#e8e8e8'] },
  ubuntu: { label: 'Ubuntu GNOME', desc: 'Ambiance 橘色風格', swatch: ['#2C2C2C', '#E95420', '#E0E0E0'] },
  macos:  { label: 'macOS', desc: 'Aqua 淺色系', swatch: ['#F5F5F5', '#007AFF', '#1C1C1E'] },
};

const FONT_OPTIONS = [
  { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', label: '系統預設 (System UI)' },
  { value: '"Ubuntu", "Cantarell", "DejaVu Sans", sans-serif', label: 'Ubuntu / Cantarell' },
  { value: '"SF Pro Display", "SF Pro Text", -apple-system, system-ui, sans-serif', label: 'SF Pro (macOS)' },
  { value: '"Roboto", "Noto Sans", sans-serif', label: 'Roboto' },
  { value: '"Georgia", "Times New Roman", serif', label: 'Georgia (Serif)' },
  { value: '"JetBrains Mono", "Fira Code", "Consolas", monospace', label: 'JetBrains Mono' },
];

type SectionKey = 'bg' | 'text' | 'accent' | 'border' | 'font' | 'typography' | 'spacing' | 'effects';

interface ColorRowProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function ColorRow({ label, value, onChange }: ColorRowProps) {
  return (
    <div className="sp-row">
      <label className="sp-row-label">{label}</label>
      <div className="sp-color-wrap">
        <label className="sp-color-swatch" style={{ background: value }}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sp-color-hidden"
          />
        </label>
        <span className="sp-color-hex">{value}</span>
      </div>
    </div>
  );
}

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

function SliderRow({ label, value, onChange, min, max, step, unit }: SliderRowProps) {
  return (
    <div className="sp-row">
      <label className="sp-row-label">{label}</label>
      <div className="sp-slider-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sp-slider"
        />
        <span className="sp-slider-val">{value}{unit}</span>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, value, onChange }: ToggleRowProps) {
  return (
    <div className="sp-row">
      <label className="sp-row-label">{label}</label>
      <button
        type="button"
        className={`sp-toggle ${value ? 'sp-toggle--on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
      >
        <span className="sp-toggle-thumb" />
      </button>
    </div>
  );
}

export default function StylePanel({
  onClose,
  theme,
  preset,
  updateTheme,
  applyPreset,
  resetTheme,
}: StylePanelProps) {
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    bg: true,
    text: true,
    accent: false,
    border: false,
    font: false,
    typography: false,
    spacing: false,
    effects: false,
  });

  const toggle = (key: SectionKey) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleReset = () => {
    if (window.confirm('確定要重設所有 UI 設定回預設值嗎？')) {
      resetTheme();
    }
  };

  const u = updateTheme;

  return (
    <div className="sp-overlay" onClick={onClose}>
      <aside className="sp-panel" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="sp-header">
          <span>🎨 UI Style 設定</span>
          <button type="button" onClick={onClose} className="sp-close">✕</button>
        </div>

        <div className="sp-body">
          {/* ── 預設主題 ── */}
          <section className="sp-preset-section">
            <p className="sp-preset-title">預設主題</p>
            <div className="sp-preset-grid">
              {(Object.keys(PRESET_META) as PresetName[]).map((name) => {
                const meta = PRESET_META[name];
                return (
                  <button
                    key={name}
                    type="button"
                    className={`sp-preset-card ${preset === name ? 'sp-preset-card--active' : ''}`}
                    onClick={() => applyPreset(name)}
                  >
                    <div className="sp-swatch-row">
                      {meta.swatch.map((c) => (
                        <span key={c} className="sp-swatch" style={{ background: c }} />
                      ))}
                    </div>
                    <span className="sp-preset-name">{meta.label}</span>
                    <span className="sp-preset-desc">{meta.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 背景顏色 ── */}
          <section className={`sp-section ${open.bg ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('bg')}>
              <span>🖼 背景顏色</span><span>{open.bg ? '▲' : '▼'}</span>
            </button>
            {open.bg && (
              <div className="sp-section-bd">
                <ColorRow label="主背景" value={theme.bgPrimary} onChange={(v) => u({ bgPrimary: v })} />
                <ColorRow label="卡片背景" value={theme.bgCard} onChange={(v) => u({ bgCard: v })} />
                <ColorRow label="輸入框背景" value={theme.bgInput} onChange={(v) => u({ bgInput: v })} />
              </div>
            )}
          </section>

          {/* ── 文字顏色 ── */}
          <section className={`sp-section ${open.text ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('text')}>
              <span>✏️ 文字顏色</span><span>{open.text ? '▲' : '▼'}</span>
            </button>
            {open.text && (
              <div className="sp-section-bd">
                <ColorRow label="主要文字" value={theme.textPrimary} onChange={(v) => u({ textPrimary: v })} />
                <ColorRow label="次要文字" value={theme.textSecondary} onChange={(v) => u({ textSecondary: v })} />
              </div>
            )}
          </section>

          {/* ── 強調色 ── */}
          <section className={`sp-section ${open.accent ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('accent')}>
              <span>🎨 強調色</span><span>{open.accent ? '▲' : '▼'}</span>
            </button>
            {open.accent && (
              <div className="sp-section-bd">
                <ColorRow label="主強調色" value={theme.accent} onChange={(v) => u({ accent: v })} />
                <ColorRow label="強調色（hover）" value={theme.accentHover} onChange={(v) => u({ accentHover: v })} />
                <ColorRow label="輸入框 Focus 色" value={theme.focusColor} onChange={(v) => u({ focusColor: v })} />
                <ColorRow label="危險色" value={theme.danger} onChange={(v) => u({ danger: v })} />
                <ColorRow label="成功色" value={theme.success} onChange={(v) => u({ success: v })} />
                <ColorRow label="警告色" value={theme.warning} onChange={(v) => u({ warning: v })} />
              </div>
            )}
          </section>

          {/* ── 邊框與圓角 ── */}
          <section className={`sp-section ${open.border ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('border')}>
              <span>◻ 邊框與圓角</span><span>{open.border ? '▲' : '▼'}</span>
            </button>
            {open.border && (
              <div className="sp-section-bd">
                <ColorRow label="邊框顏色" value={theme.border} onChange={(v) => u({ border: v })} />
                <SliderRow label="圓角半徑" value={theme.radius} onChange={(v) => u({ radius: v })} min={0} max={24} step={1} unit="px" />
              </div>
            )}
          </section>

          {/* ── 字體 ── */}
          <section className={`sp-section ${open.font ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('font')}>
              <span>🔤 字體</span><span>{open.font ? '▲' : '▼'}</span>
            </button>
            {open.font && (
              <div className="sp-section-bd">
                <div className="sp-row">
                  <label className="sp-row-label">字體族系</label>
                  <select
                    value={theme.fontFamily}
                    onChange={(e) => u({ fontFamily: e.target.value })}
                    className="sp-select"
                  >
                    {FONT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <SliderRow label="基本字級" value={theme.fontSizeBase} onChange={(v) => u({ fontSizeBase: v })} min={10} max={20} step={1} unit="px" />
                <SliderRow label="小字級 (sm)" value={theme.fontSizeSm} onChange={(v) => u({ fontSizeSm: v })} min={9} max={16} step={1} unit="px" />
                <SliderRow label="大字級 (lg)" value={theme.fontSizeLg} onChange={(v) => u({ fontSizeLg: v })} min={12} max={24} step={1} unit="px" />
                <SliderRow label="超大字級 (xl)" value={theme.fontSizeXl} onChange={(v) => u({ fontSizeXl: v })} min={14} max={32} step={1} unit="px" />
                <SliderRow label="一般字重" value={theme.fontWeightNormal} onChange={(v) => u({ fontWeightNormal: v })} min={300} max={500} step={100} unit="" />
                <SliderRow label="粗體字重" value={theme.fontWeightBold} onChange={(v) => u({ fontWeightBold: v })} min={500} max={900} step={100} unit="" />
              </div>
            )}
          </section>

          {/* ── 排版 ── */}
          <section className={`sp-section ${open.typography ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('typography')}>
              <span>📐 行距與字距</span><span>{open.typography ? '▲' : '▼'}</span>
            </button>
            {open.typography && (
              <div className="sp-section-bd">
                <SliderRow label="行距" value={theme.lineHeight} onChange={(v) => u({ lineHeight: v })} min={1.0} max={2.5} step={0.1} unit="" />
                <SliderRow label="字距" value={theme.letterSpacing} onChange={(v) => u({ letterSpacing: v })} min={-2} max={4} step={0.1} unit="px" />
              </div>
            )}
          </section>

          {/* ── 間距 ── */}
          <section className={`sp-section ${open.spacing ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('spacing')}>
              <span>↔ 間距尺寸</span><span>{open.spacing ? '▲' : '▼'}</span>
            </button>
            {open.spacing && (
              <div className="sp-section-bd">
                <SliderRow label="小間距 (sm)" value={theme.spacingSm} onChange={(v) => u({ spacingSm: v })} min={0.25} max={2} step={0.05} unit="rem" />
                <SliderRow label="中間距 (md)" value={theme.spacingMd} onChange={(v) => u({ spacingMd: v })} min={0.5} max={3} step={0.05} unit="rem" />
                <SliderRow label="大間距 (lg)" value={theme.spacingLg} onChange={(v) => u({ spacingLg: v })} min={0.75} max={4} step={0.05} unit="rem" />
              </div>
            )}
          </section>

          {/* ── 特效 ── */}
          <section className={`sp-section ${open.effects ? 'sp-section--open' : ''}`}>
            <button type="button" className="sp-section-hd" onClick={() => toggle('effects')}>
              <span>✨ 特效</span><span>{open.effects ? '▲' : '▼'}</span>
            </button>
            {open.effects && (
              <div className="sp-section-bd">
                <ToggleRow label="啟用陰影" value={theme.shadowEnabled} onChange={(v) => u({ shadowEnabled: v })} />
                <SliderRow label="過渡速度" value={theme.transitionSpeed} onChange={(v) => u({ transitionSpeed: v })} min={0} max={500} step={10} unit="ms" />
                <ToggleRow label="Backdrop Blur" value={theme.backdropBlurEnabled} onChange={(v) => u({ backdropBlurEnabled: v })} />
                <SliderRow label="輸入框透明度" value={theme.inputOpacity} onChange={(v) => u({ inputOpacity: v })} min={0.3} max={1} step={0.05} unit="" />
              </div>
            )}
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="sp-footer">
          <button type="button" className="sp-reset-btn" onClick={handleReset}>
            ↺ 重設為預設值
          </button>
        </div>
      </aside>
    </div>
  );
}
