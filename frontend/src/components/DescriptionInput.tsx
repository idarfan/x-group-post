interface Props {
  value: string;
  onChange: (v: string) => void;
  sourceLang: string;
  onLangChange: (lang: string) => void;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "zh_cn", label: "簡體中文" },
  { value: "auto", label: "自動偵測" },
];

export default function DescriptionInput({ value, onChange, sourceLang, onLangChange }: Props) {
  const placeholder =
    sourceLang === "ja"
      ? "日本語の商品説明を貼り付けてください..."
      : sourceLang === "zh_cn"
        ? "请粘贴简体中文产品说明..."
        : "Paste the product description in English...";

  return (
    <div className="description-input">
      <label>📝 產品說明</label>

      <div className="lang-selector">
        {LANGUAGES.map((lang) => (
          <label key={lang.value} className="lang-option">
            <input
              type="radio"
              value={lang.value}
              checked={sourceLang === lang.value}
              onChange={(e) => onLangChange(e.target.value)}
            />
            {lang.label}
          </label>
        ))}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
      />
    </div>
  );
}
