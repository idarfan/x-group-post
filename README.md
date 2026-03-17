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
- 運費選項：國際運費/稅金（checkbox）+ 物流方式單選（全家 $68/$72/$78 或郵寄）
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

### 2026-03-18 — 物流方式互斥單選 + 全家費率三選一

**動機：** 全家店到店與郵寄為互斥選項，不應同時勾選；全家費率因服務別有 $68 / $72 / $78 三種。

**異動內容：**
- 物流方式改為 radio 單選：不含物流 / 全家店到店 / 郵寄（三擇一，互斥）
- 選擇全家店到店後展開費率子選項：$68 / $72 / $78
- 更新 `ShippingOptions` 型別：`cvs_family + postal` → `delivery + cvs_family_fee`
- 後端 `PostGeneratorService` 依新結構輸出物流說明至 AI prompt
- favicon 更換為 X（𝕏）風格黑底白字圖示
- 頁籤標題改為「X 團購文產生器」
- 同步更新 `docs/USER_MANUAL.md`、`docs/ARCHITECTURE.md`

**涉及檔案：** `frontend/src/types/index.ts`、`frontend/src/components/ProductInfoForm.tsx`、`frontend/src/App.tsx`、`frontend/src/App.css`、`frontend/public/favicon.svg`、`frontend/index.html`、`backend/app/services/post_generator_service.rb`、`docs/`
