# X 團購文產生器

將英文、日文或簡體中文的產品說明，自動翻譯並以 AI 產生 X（Twitter）團購貼文。

適用於 X 付費帳戶，產出單篇完整貼文（無字數限制）。

## 快速開始

```bash
# 後端
cd backend && bundle install && bundle exec rails db:migrate
cp .env.example .env  # 填入 ANTHROPIC_API_KEY
bundle exec rails server  # port 3006

# 前端
cd frontend && npm install
npm run dev  # port 5175
```

開啟 http://localhost:5175

## 文件

- [安裝指南](docs/INSTALL.md)
- [使用說明](docs/USER_MANUAL.md)
- [架構說明](docs/ARCHITECTURE.md)

## 功能

- 英文 / 日文 / 簡體中文自動翻譯為繁體中文
- AI 依台灣團購文風格撰寫完整貼文
- 運費選項：含/不含（國際運費、稅金、全家店到店、郵寄）
- 圖片上傳（最多 4 張，拖放支援）
- 貼文可直接編輯、一鍵複製
- 歷史記錄儲存與管理
- 撰文風格可自訂（修改 `backend/groupbuy.md`）

---

## 變更記錄

### 2026-03-17 — 初始建立

**動機：** 協助 X 付費帳戶使用者快速產生專業台灣風格的團購貼文。

**異動內容：**
- 建立 Rails 8 API-only 後端（port 3006）
- 建立 Vite + React 18 + TypeScript 前端（port 5175）
- 實作 TranslationService / PostGeneratorService（Claude Sonnet 4）
- 運費選項：國際運費、稅金、全家店到店、郵寄，含/不含自動標注
- 前段重點優先結構（Hook → 核心賣點 → 規格 → 運費 → CTA）
- X 深色主題 UI，左右雙欄佈局

**涉及檔案：** `backend/`、`frontend/`、`docs/`、`README.md`
