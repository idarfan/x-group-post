import CopyButton from "./CopyButton";

interface Props {
  text: string;
  onChange: (v: string) => void;
}

export default function TranslatedPreview({ text, onChange }: Props) {
  return (
    <div className="translated-preview">
      <div className="section-header">
        <h3>🔤 翻譯結果（繁體中文）</h3>
        <CopyButton text={text} label="複製譯文" />
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
      />
      <p className="hint">可直接修改翻譯內容，修改後重新生成貼文會使用新的翻譯</p>
    </div>
  );
}
