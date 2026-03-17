# INSTALL.md — X 團購文產生器 安裝指南

## 系統需求

| 項目 | 版本 |
|------|------|
| Ruby | >= 4.0 |
| Rails | ~> 8.1 |
| Node.js | >= 18 |
| SQLite3 | >= 3.x |
| PM2 | >= 6.x（process 管理） |
| OS | Linux（建議 Ubuntu 22.04 / WSL2） |

---

## 一、複製專案

```bash
git clone <repo-url> x-group-post
cd x-group-post
```

---

## 二、安裝後端相依套件

```bash
cd backend
bundle install
```

主要 gem：

| Gem | 用途 |
|-----|------|
| `rails ~> 8.1` | API 框架本體 |
| `sqlite3 >= 2.1` | 輕量資料庫（儲存草稿） |
| `anthropic` | Claude API 客戶端（翻譯 + 撰文） |
| `rack-cors` | 允許前端跨域請求 |
| `dotenv-rails` | 讀取 `.env` 環境變數 |
| `puma >= 5.0` | Web 伺服器 |

---

## 三、設定環境變數

```bash
cp backend/.env.example backend/.env
```

`.env` 必填項目：

```env
# Anthropic Claude API（翻譯與撰文）
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

取得 API Key：前往 `https://console.anthropic.com` 建立。

---

## 四、資料庫初始化

```bash
cd backend
bundle exec rails db:migrate
```

---

## 五、安裝前端相依套件

```bash
cd frontend
npm install
```

主要套件：

| 套件 | 用途 |
|------|------|
| `react` + `react-dom` | UI 框架 |
| `axios` | API 呼叫 |
| `react-dropzone` | 圖片拖放上傳 |
| `react-hot-toast` | Toast 通知 |
| `lucide-react` | Icon 圖示 |

---

## 六、啟動服務

### 開發環境（手動）

```bash
# 終端機 1 — Rails API（port 3006）
cd backend && bundle exec rails server

# 終端機 2 — Vite dev server（port 5175）
cd frontend && npm run dev
```

### 正式環境（PM2）

```bash
# 從專案根目錄啟動
pm2 start ecosystem.config.cjs

# 儲存 process 清單（開機自動恢復）
pm2 save

# 設定開機自啟（執行後複製輸出的 sudo 指令）
pm2 startup
```

---

## 七、確認安裝成功

```bash
# 確認 Rails 可正常啟動
cd backend && bundle exec rails runner "puts 'Boot OK'"

# 確認路由
bundle exec rails routes | grep api

# 查看 PM2 狀態
pm2 status

# 查看後端 log
pm2 logs x-groupbuy-api --lines 30

# 查看前端 log
pm2 logs x-groupbuy-frontend --lines 30
```

開啟瀏覽器：

- 前端：`http://localhost:5175`
- API health check：`http://localhost:3006/up`

---

## 八、撰文風格自訂

撰文風格定義於 `backend/groupbuy.md`，每次 AI 呼叫都會重新讀取，**修改後立即生效，無需重啟**。

---

## 九、TypeScript 型別檢查與 Lint

```bash
# TypeScript 無錯誤檢查
cd frontend && npx tsc --noEmit

# ESLint
cd frontend && npx eslint .
```

---

## 常見問題

### API 回傳 500 / `ANTHROPIC_API_KEY` 錯誤

確認 `backend/.env` 中 `ANTHROPIC_API_KEY` 填寫正確，且帳號有可用額度。

### 前端無法連到後端（CORS 錯誤）

確認後端正在 port 3006 執行，且 `config/initializers/cors.rb` 允許 `localhost:5175`。

### PM2 重啟後服務沒有起來

重新執行 `pm2 save` 並確認已執行 `pm2 startup` 產生的 `sudo` 指令。

### SQLite 無法寫入

確認 `backend/db/` 目錄有寫入權限：

```bash
chmod 755 backend/db
```
