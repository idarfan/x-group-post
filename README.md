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

### 2026-03-18 — Storybook + Chromatic 視覺回歸測試 + Focus 色 + UI 修正

**動機：** 加入視覺回歸測試防止 CSS 排版問題（元素交疊、截斷、間距錯誤）；修正 StylePanel 顏色縮圖太小、Section 內容截斷、輸入框 focus 無高亮等視覺問題。

**異動內容：**
- 安裝 Storybook 10 + Chromatic + Playwright，建立雙 Vitest project（unit / storybook）
- 新增 4 個 Stories：`StylePanel`、`CopyButton`、`PostEditor`、`TranslatedPreview`（含 play function 展開所有 Section）
- 顏色縮圖從 32×24px 放大為 **56×32px**（隱藏原生 input，外層 label 顯示色塊）
- 移除 `.sp-section { overflow: hidden }`，修正 Section 展開時內容截斷問題
- 展開中的 Section 加橘色高亮邊框（`border-color: #f97316`）
- 新增 `--focus-color`（預設 `#a855f7` 亮紫）CSS 變數：輸入框 focus 時顯示亮紫邊框 + 光暈
- `ThemeConfig` 新增 `focusColor` 欄位，Style Panel 「強調色」section 開放設定
- Chromatic Build 1–5 完成，視覺快照 17 個 stories
- `.env` 加入 `CHROMATIC_PROJECT_TOKEN` 與 `OBSIDIAN_API_KEY`

**涉及檔案：** `frontend/src/types/index.ts`、`frontend/src/hooks/useTheme.ts`、`frontend/src/components/StylePanel.tsx`、`frontend/src/App.css`、`frontend/.storybook/`、`frontend/vite.config.ts`、`frontend/package.json`、`frontend/.env`、`frontend/.gitignore`

### 2026-03-18 — UI Style Panel

**動機：** 讓使用者能自訂 app 外觀，並提供三套預設主題（暗色系、Ubuntu GNOME、macOS），設定刷新後自動恢復。

**異動內容：**
- 新增 `src/hooks/useTheme.ts`：管理 ThemeConfig state、三套 PRESETS、localStorage 持久化、`applyPreset` / `updateTheme` / `resetTheme`
- 新增 `src/components/StylePanel.tsx`：右滑動側邊欄，涵蓋顏色、字體、排版、間距、特效共 8 個可折疊 Section，底部重設按鈕（二次確認）
- 擴充 `src/types/index.ts`：新增 `ThemeConfig` interface（28 個屬性）
- 擴充 `src/App.css`：新增 17 個 CSS 變數（字體、間距、特效）及 StylePanel 全部樣式
- 修改 `src/App.tsx`：Header 加入「🎨 UI Style」按鈕，整合 useTheme hook
- 建立測試：`useTheme.test.ts`（20 個）、`StylePanel.test.tsx`（18 個），共 38 個全數通過

**涉及檔案：** `src/types/index.ts`, `src/hooks/useTheme.ts`, `src/hooks/useTheme.test.ts`, `src/components/StylePanel.tsx`, `src/components/StylePanel.test.tsx`, `src/App.css`, `src/App.tsx`, `vite.config.ts`, `package.json`

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
