# Implementation Plan - Super Mind Odyssey (心智拓荒者)

打造一個讓人在 3 分鐘內無痛搞懂跨領域核心思想（博弈論、行為經濟學、社會學）的每日探險微學習 PWA。採用「情境抉擇先於概念」、「費曼白話防禦」、「虛線名詞即時字典」、「課後三扇門探險」、「迷霧技能星圖」與「GitHub Gist 零成本雙端同步」機制。

## User Review Required

> [!IMPORTANT]
> 核心體驗原則：
> 1. **零術語負債**：所有專業名詞均以點狀虛線標註，點擊即彈出 20 字白話解說，不打斷閱讀。
> 2. **零延遲與零花費**：手機端完全離線運行（PWA 快取），預先烘焙高品質內容，不依賴手機現場呼叫付費 API；具備 GitHub Actions + 免費 LLM API (Google AI Studio / Groq / OpenRouter) 定期自動擴充知識庫。
> 3. **遊戲化反饋**：內建原生合成音效（Web Audio API），無須載入大音檔；具備迷霧星圖與思維神器成就體系。

## Proposed Architecture

```
mind_odyssey/
├── index.html                   # 主應用介面 (手機優先 / 電腦自適應)
├── manifest.json                # PWA 應用清單 (支援安裝至主畫面)
├── sw.js                        # Service Worker 離線快取引擎
├── src/
│   ├── styles/
│   │   └── main.css             # 暗黑宇宙探險美學、毛玻璃、霓虹微動效、字體規範
│   └── scripts/
│       ├── audio.js             # Web Audio API 原生合成音效 (零外部依賴)
│       ├── database.js          # 高品質結構化心智模型庫 (博弈論/經濟學/社會學)
│       ├── sync.js              # GitHub Gist 雲端同步與 LocalStorage 本地存取
│       └── app.js               # 核心控制邏輯、卡片滑動、迷霧地圖渲染、三扇門分支
├── scripts/
│   └── generate_cards.js        # 免費 API 多備援自動生成腳本 (Google/Groq/OpenRouter)
├── .github/
│   └── workflows/
│       └── daily_mind_cards.yml # GitHub Actions 每日定時自動拓展內容工作流
├── task.md                      # 任務進度清單
└── implementation_plan.md       # 本實施計畫
```

## 當前進度與系統狀態 (Current Status - 2026-09-06)

### ✅ 已完成項目
1. **完整前端工程與 PWA 基礎架構**：
   - `index.html`、`main.css`、`manifest.json`、`sw.js` 已就緒。
   - 採用暗黑星空拓荒者風格（Deep Void #090B10、霓虹金 #FFC857、電漿紫 #7B2CBF、青色科技光 #48CAE4）。
2. **Web Audio 原生合成音效**：
   - 包含點擊輕響 (`click`)、翻牌紙張聲 (`flip`)、揭曉撥弦 (`reveal`)、神廟解鎖傳送鐘聲 (`chime`)，無外部音檔加載延遲。
3. **高品質預置心智模型庫 (`database.js`)**：
   - 收錄 6 大經典跨域節點：智豬博弈、囚徒困境、沉沒成本效應、旁觀者效應、破窗效應、檸檬市場。
   - 每個節點均包含：情境抉擇二選一、統計投票、費曼比喻、名詞字典、課後三扇門連結、專屬神器與屬性點。
4. **GitHub Gist 無伺服器雙向同步 (`sync.js`)**：
   - 支援離線 LocalStorage 優先讀寫，透過 GitHub Personal Access Token 進行私密 Gist 的建立、讀取與更新。
5. **多免費備援自動化流水線 (`generate_cards.js` + GitHub Actions)**：
   - 實作三層費曼防禦提示詞，依序調用 Google AI Studio (免費) -> Groq (免費) -> OpenRouter (`:free`) 備援。
6. **全域命名偏好統一**：
   - 專案與程式標題統一為 `Super Mind Odyssey`（不加中括號），並已永久寫入 `.agents/AGENTS.md`。

---

## 🔍 後續待辦與完整實作路線圖 (Roadmap for Next LLM)

### Phase 1: 核心互動細節除錯與端到端跑通 (Immediate Fixes)
- **術語關鍵字精確對齊**：
  在 `database.js` 中的 `boxed_pigs` 核心比喻文本，需確保精確包含 `jargons` 所宣告的詞彙（例如「佔優策略」與「搭便車效應」），讓 `app.js` 的正則替換能正常為名詞加上點狀虛線與氣泡彈窗。
- **端到端流程跑通驗證**：
  1. 測試點擊紫色虛線名詞，確認即時彈出白話字典泡泡。
  2. 推進至第三階段「課後三扇門」，測試點選其中一扇門後將其設為明日目標節點。
  3. 切換「迷霧星圖」分頁，驗證點亮節點與周邊未解鎖節點的迷霧狀態。
  4. 切換「探險日誌」分頁，驗證神器收集與決策人格屬性分布。
  5. 測試 GitHub Gist Token 儲存與備份匯出匯入功能。

### Phase 2: 遊戲化探險素材庫與視覺質感大升級 (Game & Adventure Assets)
- **開源遊戲圖標庫導入 (Game-icons.net / RPG Awesome / Kenney)**：
  - 下載精選 10~15 款開源高品質向量遊戲 SVG 圖標至 `assets/icons/relics/`，取代 Emoji 與簡單向量，賦予思維神器實體法器質感（搭便車指南針、囚徒雙鎖、沉沒沙漏、逆向天平等）。
- **探險視覺插畫與場景素材 (Visual Scene Art / AI Assets)**：
  - 為三大領域與每個心智模型節點設計專屬的「情境卡片頂部插畫」（使用 AI 生成或 Kenney 復古科幻宇宙素材包），取代單調純色漸層，營造沉浸式探索氛圍。
- **迷霧星圖視覺強化 (Canvas Starfield & Dynamic Fog)**：
  - 引入輕量級 HTML5 Canvas 星空粒子系統（慢漂星塵、微光閃爍）。
  - 未探索節點周邊加入動態流動雲霧遮罩（CSS Mask / Canvas Fog）。
  - 節點點亮衝擊波 (Shockwave) 與星系連線脈衝光流 (Pulse Ray)。
- **思維神器 (Relics) 3D 全息反光展示冊**：
  - 整合陀螺儀與滑鼠懸浮傾斜反光特效（Tilt Effect & Holographic Foil）。
  - 增加稀有度階級（Common / Rare / Legendary）與專屬背景故事碑文。
- **遊戲高品質音效庫擴展 (Kenney Audio / Web Audio 增強)**：
  - 擴展可選的實體音效（厚重羊皮紙、神廟石門開啟共鳴鐘聲、星際傳送躍遷音）。

### Phase 3: 題材探索雷達與自主自我擴張星圖 (Topic Exploration Radar & Universal Self-Expansion)
- [x] **自我擴張無界知識圖譜架構**：
  - 徹底突破初始 5 個建議領域的限制，全面支持物理學、演化生物學、統計學、複雜自適應系統、哲學認識論、資訊論等任何學科。
  - 實作 `getDynamicDomains` 動態領域分區管理器，自動派發星雲霓虹光芒與領域統計。
  - 預置 4 大前沿跨學科種子節點：物理學「熵增定律」、演化生物學「鷹鴿博弈」、統計與機率「倖存者偏差」、複雜系統「湧現理論」。
  - 為新增節點繪製專屬向量 SVG 思維神器（耗散逆熵儀、進化平衡羽、洞察真理目鏡、湧現幾何晶核）並賦予 3D 全息反光傾斜特效。
- [x] **題材探索雷達 (Topic Exploration Radar)**：
  - 構建鳥瞰視角彈窗（🔭 按鈕），動態展示所有跨學科星雲並支援航向鎖定。
- [x] **課後三扇門跨域躍遷與未拓荒節點自動生成**：
  - 課後三扇門點擊未探索前沿傳送門時，自動觸發即時合成並在星圖長出新星雲；「🎲 全部 Pass / 刷新航線」隨機抽取未探索節點。
- [x] **雙軌自訂拓荒探測器 (Client & CLI Autonomous Expansion)**：
  - 前端：支援使用者在探索雷達中輸入任意學科或現象，由 Gemini 或程序化費曼引擎即時生成並注入星圖。
  - CLI：`generate_cards.js --auto-expand` 自動調用 Gemini 生成任意領域（實測已產出「哲學認識論・奧卡姆剃刀」），自動烘焙至 `database.js`。

### Phase 4: 全自動內容補給流水線與多免費 API 落地 (Automated Content Engine)
- [x] **本地環境金鑰隱私保護與 .gitignore 配置**：
  - 建立嚴格的 `.gitignore` 隔離 `.env`、`*.key`、`credentials.json`，防止上傳 GitHub 外洩，並提供 `.env.example` 範本。
- [x] **本地生成腳本實測 (`generate_cards.js`)**：
  - 實作零依賴 `.env` 讀取與雙層模型自動降級備援（`gemini-flash-latest` -> `gemini-flash-lite-latest` -> `gemini-3.6-flash`），成功產出多張跨領域費曼微學習卡片。
- [ ] **三層費曼防禦自動守門員 (Automated Feynman Guardrail)**：
  - 實作自動語料檢驗器，確保 180 秒閱讀時間限制、零術語負債（名詞必有 20 字白話解說）、小學生等級生活化比喻。
- [ ] **GitHub Actions 定時自動烘焙**：
  - 每日定時自動擴充 `database.js` / JSON 庫並提交 PR，維持手機客戶端完全離線無成本秒開。

