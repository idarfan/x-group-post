interface Props {
  paths: string[];
  onChange: (paths: string[]) => void;
  max?: number;
}

const PREVIEW_BASE = "/api/images/from_path?path=";

export default function ImageUploader({ paths, onChange, max = 4 }: Props) {
  const addPath = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || paths.includes(trimmed) || paths.length >= max) return;
    onChange([...paths, trimmed]);
  };

  const removePath = (index: number) => {
    onChange(paths.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addPath((e.currentTarget as HTMLInputElement).value);
      (e.currentTarget as HTMLInputElement).value = "";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim()) {
      addPath(e.target.value);
      e.target.value = "";
    }
  };

  return (
    <div className="image-uploader">
      <label>📸 產品圖片路徑（最多 {max} 張）</label>
      <p className="hint">支援 Windows（C:\...）、WSL2（/mnt/c/...）、Linux 路徑，輸入後按 Enter 加入</p>

      {paths.length < max && (
        <input
          type="text"
          className="path-input"
          placeholder="貼上圖片路徑，按 Enter 加入..."
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}

      {paths.length > 0 && (
        <div className="image-preview-grid">
          {paths.map((p, idx) => (
            <div key={idx} className="image-preview-item">
              <img
                src={`${PREVIEW_BASE}${encodeURIComponent(p)}`}
                alt={`圖${idx + 1}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="image-label">圖 {idx + 1}</span>
              <button className="remove-btn" type="button" onClick={() => removePath(idx)}>
                ✕
              </button>
              <span className="path-badge" title={p}>
                {p.length > 30 ? `...${p.slice(-28)}` : p}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
