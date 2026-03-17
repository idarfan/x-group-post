import CopyButton from "./CopyButton";

interface Props {
  post: string;
  onChange: (v: string) => void;
}

export default function PostEditor({ post, onChange }: Props) {
  return (
    <div className="post-editor">
      <div className="section-header">
        <h3>📱 團購貼文（可直接編輯）</h3>
        <CopyButton text={post} label="📋 複製貼文" />
      </div>

      <textarea
        className="post-textarea"
        value={post}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        placeholder="AI 生成的貼文將顯示在此，可直接編輯後複製..."
      />

      <p className="hint">付費帳戶，無字數限制。複製後直接貼到 X 發文。</p>
    </div>
  );
}
