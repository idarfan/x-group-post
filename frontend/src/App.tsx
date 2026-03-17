import { useState } from "react";
import { Toaster } from "react-hot-toast";
import ImageUploader from "./components/ImageUploader";
import DescriptionInput from "./components/DescriptionInput";
import ProductInfoForm from "./components/ProductInfoForm";
import TranslatedPreview from "./components/TranslatedPreview";
import PostEditor from "./components/PostEditor";
import HistoryPanel from "./components/HistoryPanel";
import { useGroupBuyApi } from "./hooks/useGroupBuyApi";
import type { ProductInfo } from "./types";
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
    cvs_family: false,
    postal: false,
    note: "",
  },
};

export default function App() {
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [productInfo, setProductInfo] = useState<ProductInfo>(DEFAULT_PRODUCT_INFO);
  const [translatedText, setTranslatedText] = useState("");
  const [generatedPost, setGeneratedPost] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const api = useGroupBuyApi();

  const handleGenerate = async () => {
    if (!description.trim()) return;

    const transResult = await api.translate(description, sourceLang);
    setTranslatedText(transResult.translated_text);

    const genResult = await api.generate(
      transResult.translated_text,
      imagePaths.length,
      productInfo
    );
    setGeneratedPost(genResult.post);
  };

  const handleRegenerate = async () => {
    if (!translatedText.trim()) return;

    const genResult = await api.generate(translatedText, imagePaths.length, productInfo);
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
      imagePaths
    );
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />

      <header className="app-header">
        <h1>🛒 X 團購文產生器</h1>
        <button
          type="button"
          className="history-btn"
          onClick={() => setShowHistory(true)}
        >
          📋 歷史記錄
        </button>
      </header>

      <main className="app-main">
        {/* ── 左欄：輸入 ── */}
        <section className="input-panel">
          <ImageUploader paths={imagePaths} onChange={setImagePaths} max={4} />

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
    </div>
  );
}
