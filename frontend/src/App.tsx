import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ImageUploader from "./components/ImageUploader";
import DescriptionInput from "./components/DescriptionInput";
import ProductInfoForm from "./components/ProductInfoForm";
import TranslatedPreview from "./components/TranslatedPreview";
import PostEditor from "./components/PostEditor";
import HistoryPanel from "./components/HistoryPanel";
import StylePanel from "./components/StylePanel";
import { useGroupBuyApi } from "./hooks/useGroupBuyApi";
import { useTheme } from "./hooks/useTheme";
import type { ProductInfo, ImageEntry } from "./types";
import "./App.css";

const DEFAULT_PRODUCT_INFO: ProductInfo = {
  name: "",
  original_price: "",
  group_price: "",
  start_date: "",
  end_date: "",
  order_method: "",
  shipping: {
    intl_shipping: false,
    tax: false,
    delivery: "",
    cvs_family_fee: 68,
    note: "",
  },
};

export default function App() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [description, setDescription] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [productInfo, setProductInfo] = useState<ProductInfo>(DEFAULT_PRODUCT_INFO);
  const [translatedText, setTranslatedText] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showStyle, setShowStyle] = useState(false);

  const api = useGroupBuyApi();
  const { theme, preset, updateTheme, applyPreset, resetTheme } = useTheme();

  const handleGenerate = async () => {
    if (!description.trim()) return;

    const transResult = await api.translate(description, sourceLang);
    setTranslatedText(transResult.translated_text);

    const genResult = await api.generate(
      transResult.translated_text,
      images.length,
      productInfo
    );
    setGeneratedPost(genResult.post);
  };

  const handleRegenerate = async () => {
    if (!translatedText.trim()) return;

    const genResult = await api.generate(translatedText, images.length, productInfo);
    setGeneratedPost(genResult.post);
  };

  const handleSave = async () => {
    await api.savePost(
      {
        product_name: productInfo.name || "未命名",
        original_description: description,
        source_language: sourceLang,
        translated_description: translatedText,
        generated_post: generatedPost,
        edited_post: generatedPost,
        group_price: productInfo.group_price,
        start_date: productInfo.start_date,
        end_date: productInfo.end_date,
        order_method: productInfo.order_method,
        shipping_json: JSON.stringify(productInfo.shipping),
        status: "draft",
      },
      images.map((e) => e.path)
    );
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />

      <header className="app-header">
        <h1>🛒 X 團購文產生器</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="style-btn"
            onClick={() => setShowStyle(true)}
          >
            🎨 UI Style
          </button>
          <button
            type="button"
            className="history-btn"
            onClick={() => setShowHistory(true)}
          >
            📋 歷史記錄
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* ── 左欄：輸入 ── */}
        <section className="input-panel">
          <ImageUploader images={images} onChange={setImages} max={4} />

          <DescriptionInput
            value={description}
            onChange={setDescription}
            sourceLang={sourceLang}
            onLangChange={setSourceLang}
          />

          <ProductInfoForm value={productInfo} onChange={setProductInfo} />

          <button
            type="button"
            className="generate-btn"
            onClick={handleGenerate}
            disabled={!description.trim() || api.loading}
          >
            {api.loading ? "⏳ 處理中..." : "🚀 翻譯並生成團購文"}
          </button>
        </section>

        {/* ── 右欄：結果 ── */}
        <section className="result-panel">
          {translatedText && (
            <TranslatedPreview text={translatedText} onChange={setTranslatedText} />
          )}

          {generatedPost && (
            <>
              <PostEditor post={generatedPost} onChange={setGeneratedPost} />
              <div className="action-bar">
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleSave}
                  disabled={api.loading}
                >
                  💾 儲存記錄
                </button>
                <button
                  type="button"
                  className="regenerate-btn"
                  onClick={handleRegenerate}
                  disabled={api.loading}
                >
                  🔄 重新生成
                </button>
              </div>
            </>
          )}

          {!translatedText && !generatedPost && (
            <div className="empty-result">
              <p>填寫左欄資訊後點擊「翻譯並生成團購文」</p>
              <p>即可在此看到 AI 生成的貼文</p>
            </div>
          )}
        </section>
      </main>

      {showHistory && <HistoryPanel onClose={() => setShowHistory(false)} />}

      {showStyle && (
        <StylePanel
          onClose={() => setShowStyle(false)}
          theme={theme}
          preset={preset}
          updateTheme={updateTheme}
          applyPreset={applyPreset}
          resetTheme={resetTheme}
        />
      )}
    </div>
  );
}
