# ARCHITECTURE.md — X 團購文產生器 架構說明

## 設計原則

- **前後端分離**：Rails 只輸出 JSON API，前端完全由 React 處理，不混用 ERB / Hotwire
- **無 Hotwire**：明確不使用 Turbo / Stimulus，互動邏輯全在 React
- **即時讀取風格檔**：每次 AI 呼叫都重新讀取 `groupbuy.md`，風格變更無需重啟
- **單篇貼文**：適用 X 付費帳戶，產出完整單篇，不分割推文串
- **TypeScript 嚴格模式**：前端全面 `strict: true` + `noUncheckedIndexedAccess: true`

---

## 技術棧

| 層次 | 技術 |
|------|------|
| 前端框架 | Vite + React 18 + TypeScript |
| 後端框架 | Ruby on Rails 8.1（API-only） |
| 資料庫 | SQLite3 |
| AI | Anthropic Claude API（claude-sonnet-4-20250514） |
| HTTP 客戶端 | axios（前端） |
| CORS | rack-cors（後端） |
| 圖片上傳 | react-dropzone（前端）+ binary blob（SQLite） |
| Toast 通知 | react-hot-toast |
| Process 管理 | PM2 |
| Lint | ESLint + `npx tsc --noEmit`（前端）、RuboCop（後端） |

---

## 目錄結構

```
x-group-post/
├── backend/                         # Rails 8 API-only（port 3006）
│   ├── app/
│   │   ├── controllers/api/
│   │   │   ├── ai_controller.rb          # 翻譯 + 生成兩支端點
│   │   │   ├── posts_controller.rb       # 草稿 CRUD
│   │   │   └── images_controller.rb      # 圖片讀取 + 路徑載入
│   │   ├── models/
│   │   │   ├── groupbuy_post.rb          # 主記錄（含 shipping_json）
│   │   │   └── post_image.rb             # 圖片關聯（binary blob）
│   │   └── services/
│   │       ├── translation_service.rb    # Claude API 翻譯（含語言自動偵測）
│   │       └── post_generator_service.rb # Claude API 撰文（讀取 groupbuy.md）
│   ├── config/
│   │   ├── routes.rb
│   │   ├── puma.rb                       # port 3006
│   │   └── initializers/cors.rb          # 允許 localhost:5175
│   ├── db/migrate/
│   │   ├── ..._create_groupbuy_posts.rb
│   │   └── ..._create_post_images.rb
│   ├── groupbuy.md                       # AI 撰文風格（可自訂，即時生效）
│   └── .env                             # ANTHROPIC_API_KEY
│
├── frontend/                        # Vite + React + TS（port 5175）
│   ├── src/
│   │   ├── App.tsx                       # 主佈局（左右雙欄）+ 狀態管理
│   │   ├── components/
│   │   │   ├── ImageUploader.tsx         # 拖放上傳，最多 4 張
│   │   │   ├── DescriptionInput.tsx      # 語言選擇 + 原文輸入
│   │   │   ├── ProductInfoForm.tsx       # 補充資訊 + 運費選項（4 選項）
│   │   │   ├── TranslatedPreview.tsx     # 翻譯結果（可修改）
│   │   │   ├── PostEditor.tsx            # 單篇貼文（可直接編輯）
│   │   │   ├── CopyButton.tsx            # 通用複製按鈕
│   │   │   └── HistoryPanel.tsx          # 右側抽屜歷史記錄
│   │   ├── hooks/
│   │   │   └── useGroupBuyApi.ts         # 所有 API 呼叫封裝
│   │   └── types/
│   │       └── index.ts                  # TypeScript 型別定義
│   ├── vite.config.ts                    # proxy /api → localhost:3006
│   └── tsconfig.app.json                 # strict + noUncheckedIndexedAccess
│
├── docs/
│   ├── INSTALL.md
│   ├── USER_MANUAL.md
│   └── ARCHITECTURE.md
├── ecosystem.config.cjs              # PM2 設定（兩個服務）
└── README.md
```

---

## API 端點

| 方法 | 路徑 | Controller | 說明 |
|------|------|------------|------|
| POST | `/api/ai/translate` | `Api::AiController#translate` | 翻譯產品說明 |
| POST | `/api/ai/generate` | `Api::AiController#generate` | 生成團購貼文 |
| GET  | `/api/posts` | `Api::PostsController#index` | 歷史記錄列表 |
| POST | `/api/posts` | `Api::PostsController#create` | 儲存記錄（含圖片） |
| GET  | `/api/posts/:id` | `Api::PostsController#show` | 單筆記錄 |
| PATCH| `/api/posts/:id` | `Api::PostsController#update` | 更新記錄 |
| DELETE| `/api/posts/:id` | `Api::PostsController#destroy` | 刪除記錄 |
| GET  | `/api/images/:id` | `Api::ImagesController#show` | 讀取已儲存圖片 |
| POST | `/api/images/from_path` | `Api::ImagesController#from_path` | 從本機路徑載入圖片 |

---

## 翻譯資料流

```
React（DescriptionInput）
  └── POST /api/ai/translate
        └── TranslationService#call
              ├── [source_language == "auto"] → detect_language()
              │     ├── 偵測假名 → "ja"
              │     ├── CJK 比例 < 15% → "en"
              │     └── 簡繁字頻比較 → "zh_cn" / "zh_tw"
              ├── [lang == "zh_tw"] → 直接回傳原文（不翻譯）
              └── Anthropic Claude API（claude-sonnet-4-20250514）
                    → system prompt 依語言切換（EN/JA/簡中）
                    → 回傳繁體中文譯文
```

---

## 撰文資料流

```
React（App.tsx#handleGenerate）
  └── POST /api/ai/generate
        └── PostGeneratorService#call
              ├── File.read("groupbuy.md") → system prompt（風格指引）
              ├── build_user_prompt()
              │     ├── 翻譯後繁體中文說明
              │     ├── 圖片數量
              │     ├── 產品補充資訊（名稱、原價、團購價、期間、下單方式）
              │     └── append_shipping_info()
              │           ├── included[] → "✅ 已含：國際運費、含稅..."
              │           └── excluded[] → "⚠️ 不含（務必在貼文中明確註明）：..."
              └── Anthropic Claude API
                    → 回傳純文字完整貼文（非 JSON、非推文串）
```

---

## 運費邏輯

`ShippingOptions`（前端 TypeScript 型別）：

```typescript
interface ShippingOptions {
  intl_shipping: boolean;  // 國際運費
  tax:           boolean;  // 進口稅金
  cvs_family:    boolean;  // 全家店到店
  postal:        boolean;  // 郵寄費用
  note:          string;   // 自訂備註
}
```

送入 `product_info.shipping` → `PostGeneratorService#append_shipping_info`：

- 勾選（`true`）→ 加入 `included[]` → prompt 中顯示 `✅ 已含：xxx`
- 未勾選（`false`）→ 加入 `excluded[]` → prompt 中顯示 `⚠️ 不含：xxx（務必在貼文中明確註明）`
- AI 依 `groupbuy.md` 的「運費呈現規則」在貼文對應段落加入 ✅/⚠️ 標示

---

## 圖片儲存策略

- **開發 / 小量**：圖片以 `binary blob` 直接存入 SQLite `post_images.image_data` 欄位（4 張小圖適用）
- **讀取**：`GET /api/images/:id` 透過 `send_data` 回傳 blob
- **路徑載入**：`POST /api/images/from_path` 支援 WSL2 路徑（`/mnt/c/...`）、Windows 路徑（`C:\Users\...`）、Linux 路徑，後端自動轉換
- **擴充**：圖片量大時改用 ActiveStorage，不影響其他邏輯

---

## 安全性設計

- `ANTHROPIC_API_KEY` 透過環境變數注入，不寫入程式碼，前端永遠不接觸 API Key
- 所有 AI 呼叫透過 Rails 後端代理
- 圖片路徑載入限 Unix/WSL2 路徑格式，production 環境應加白名單限制（見 `ImagesController` 備注）
- TypeScript `strict` 模式防止型別漏洞，API 回傳值定義完整型別，禁止 `any`

---

## PM2 設定

```
ecosystem.config.cjs
├── x-groupbuy-api       → bundle exec rails server -p 3006
└── x-groupbuy-frontend  → npm run dev -- --host
```

開機自啟：`pm2 startup` + `pm2 save`
