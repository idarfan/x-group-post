import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { ImageEntry } from "../types";

interface Props {
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max = 4 }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = max - images.length;
      const newEntries: ImageEntry[] = acceptedFiles
        .slice(0, remaining)
        .map((file) => ({ file, path: file.name }));
      onChange([...images, ...newEntries]);
    },
    [images, max, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: max - images.length,
    disabled: images.length >= max,
  });

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const updatePath = (index: number, path: string) => {
    onChange(images.map((entry, i) => i === index ? { ...entry, path } : entry));
  };

  return (
    <div className="image-uploader">
      <label>📸 產品圖片（最多 {max} 張）</label>

      <div
        {...getRootProps()}
        className={`dropzone${isDragActive ? " active" : ""}${images.length >= max ? " disabled" : ""}`}
      >
        <input {...getInputProps()} />
        {images.length >= max ? (
          <p>已達上限 {max} 張</p>
        ) : (
          <p>{isDragActive ? "放開以上傳" : "拖放圖片到此，或點擊選擇"}</p>
        )}
      </div>

      {images.length > 0 && (
        <div className="image-entry-list">
          {images.map((entry, idx) => (
            <div key={idx} className="image-entry">
              <div className="image-thumb-wrap">
                <img
                  src={URL.createObjectURL(entry.file)}
                  alt={`圖${idx + 1}`}
                />
                <span className="image-label">圖 {idx + 1}</span>
                <button
                  className="remove-btn"
                  type="button"
                  onClick={() => removeImage(idx)}
                >
                  ✕
                </button>
              </div>
              <input
                className="path-input"
                type="text"
                value={entry.path}
                onChange={(e) => updatePath(idx, e.target.value)}
                placeholder="檔案路徑（可輸入完整路徑，如 C:\... 或 /mnt/c/...）"
                title="儲存時使用此路徑；可改為完整系統路徑"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
