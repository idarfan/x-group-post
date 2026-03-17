import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = "複製" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("已複製到剪貼簿！");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("複製失敗，請手動選取");
    }
  };

  return (
    <button className="copy-btn" type="button" onClick={handleCopy}>
      {copied ? "✅ 已複製" : label}
    </button>
  );
}
