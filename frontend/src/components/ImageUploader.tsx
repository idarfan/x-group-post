import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  images: File[];
  onChange: (files: File[]) => void;
  max?: number;
}

export default function ImageUploader({ images, onChange, max = 4 }: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remaining = max - images.length;
      const newFiles = acceptedFiles.slice(0, remaining);
      onChange([...images, ...newFiles]);
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
        <div className="image-preview-grid">
          {images.map((file, idx) => (
            <div key={idx} className="image-preview-item">
              <img src={URL.createObjectURL(file)} alt={`圖${idx + 1}`} />
              <span className="image-label">圖 {idx + 1}</span>
              <button className="remove-btn" type="button" onClick={() => removeImage(idx)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
