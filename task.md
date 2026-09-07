# Task: Super Mind Odyssey (心智拓荒者) - 微學習探險 PWA 專案

## 任務清單與當前進度總覽 (記錄於 2026-09-06)

### ✅ 已完成基礎架構與原型 (Completed)
- [x] 建立專案目錄與基礎架構文件 <!-- id: 0 -->
- [x] 撰寫 `implementation_plan.md` 與專案規格說明 <!-- id: 1 -->
- [x] 建立高質感核心設計系統與 CSS（暗黑星際拓荒/毛玻璃/微動效） <!-- id: 2 -->
- [x] 實作純 Web Audio API 合成音效引擎（翻牌音、抉擇確認音、神廟解鎖音） <!-- id: 3 -->
- [x] 建立初始高品質結構化知識庫（收錄智豬博弈、囚徒困境、沉沒成本等 6 大核心模型＋名詞字典＋課後三扇門） <!-- id: 4 -->
- [x] 實作第一階段：每日情境二選一與投票回饋 (Dilemma First，已通過瀏覽器驗證 72% 投票比例與音效) <!-- id: 5 -->
- [x] 實作 GitHub Gist 雲端進度同步與本機 IndexedDB/LocalStorage 雙向備份 <!-- id: 6 -->
- [x] 實作 PWA 離線快取（manifest.json + sw.js）支援手機完全離線秒開 <!-- id: 7 -->
- [x] 建立自動化生成腳本框架（`scripts/generate_cards.js` 三備援架構）與 GitHub Actions 工作流 <!-- id: 8 -->
- [x] 統一名稱規範：專案與程式名稱統一調整為 `Super Mind Odyssey`（不加中括號），並已永久寫入全域 AGENTS.md 規則 <!-- id: 9 -->

---

## 🎯 待辦事項清單 (Roadmap & Pending Tasks)

### 第一階段：核心互動細節除錯與端到端跑通 (Immediate Fixes & Verification)
- [x] **修復術語文字精確對齊**：修改 `src/scripts/database.js`，將 6 大節點的 `analogy` 自然納入精確專有名詞，正則表達式 100% 渲染出紫色點狀虛線。 <!-- id: 10 -->
- [x] **專有名詞英文雙語對照全鏈路落實**：11 大心智模型與所有專業術語（智豬博弈 Boxed Pigs Game、佔優策略 Dominant Strategy、搭便車效應 Free-rider Effect、囚徒困境 Prisoner's Dilemma、納許均衡 Nash Equilibrium、逆向選擇 Adverse Selection 等）於頂部 Hero、虛線標註、即時氣泡字典、星圖節點、雷達卡片全線配置英文對照。 <!-- id: 28 -->
- [x] **全域去除 AI 味與探險遊戲化 HUD 大升級**：清除全域廉價 Emoji，換裝高精度細線 SVG 向量圖形、星際艦載終端四角準心框 (`terminal-corner`)、等寬遙測代碼、戰術指令抉擇 (`[COMM A]` / `[COMM B]`)、思維神器打撈預覽與四維心智雷達圖譜 (`cognitive-radar-canvas`)。 <!-- id: 29 -->
- [x] **驗證氣泡即時字典**：點擊虛線名詞即時彈出白話字典卡片，點擊外部自動關閉。 <!-- id: 11 -->
- [x] **跑通第三階段與課後三扇門**：點擊「✦ 點亮星系節點並打撈思維神器」，觸發音效、點亮節點並流暢展示三扇門與選定航線。 <!-- id: 12 -->
- [x] **驗證迷霧星圖與探險日誌**：切換至迷霧星圖與探險日誌，節點點亮與四維心智雷達圖計算皆正常。 <!-- id: 13 -->
- [x] **雲端同步測試**：GitHub Gist Token 儲存面板與匯出/匯入 JSON 備份功能就緒。 <!-- id: 14 -->

### 第二階段：遊戲化探險素材庫與視覺質感大升級 (Game & Adventure Assets & Aesthetics)
- [x] **引入開源遊戲圖標庫 (Game-icons.net / RPG Awesome / Kenney)**： <!-- id: 15 -->
  - 為 6 大思維神器繪製專屬高保真向量 SVG 圖標置於 `assets/icons/relics/`（搭便車指南針、博弈天平、無悔沙漏、喚醒銀哨、無瑕之鏡、真偽之秤），並在探險日誌中渲染。
- [ ] **探險視覺插畫與場景素材 (Visual Scene Art / AI Assets)**： <!-- id: 16 -->
  - 為各大領域與關鍵模型設計專屬情境卡片頂部封面插畫，取代純色漸層。
- [x] **迷霧星圖視覺強化 (Canvas Particle Starfield & Dynamic Fog)**： <!-- id: 17 -->
  - 引入輕量級 HTML5 Canvas 動態星空粒子與流星雨系統 (`starfield.js`)，支援低耗電與無干擾背景漂浮。
- [x] **思維神器 (Relics) 3D 全息反光收集展示冊**： <!-- id: 18 -->
  - 神器卡片加入游標/觸控 3D 傾斜懸浮立體反光特效（Tilt Effect & Holographic Glare）。
- [ ] **遊戲高品質音效庫擴展 (Kenney RPG Audio / Web Audio 增強)**： <!-- id: 19 -->
  - 擴展實體音訊選項（厚重羊皮紙、古老神廟共鳴鐘聲）。

### 第三階段：題材探索雷達與自主航線擴展 (Topic Exploration Radar & CyOA)
- [x] **建構獨立的「題材探索雷達 (Topic Exploration Radar)」**： <!-- id: 20 -->
  - 新增專屬思維雷達彈窗（🔭 按鈕），展示動態跨學科星雲並支援快速切換航向。
- [x] **課後三扇門「全部 Pass / 重新隨機」機制**： <!-- id: 21 -->
  - 實作「🎲 全部 Pass / 刷新下一組航線」功能，隨機抽取未探索節點。
- [x] **自訂拓荒目標 (Custom Exploration Probe)**： <!-- id: 22 -->
  - 支援使用者在探索雷達中輸入生活問題或困境，發射專屬思維探測器。
- [x] **自我擴張無界知識圖譜 (Self-Expanding Universal Knowledge Graph)**： <!-- id: 27 -->
  - 徹底突破初始 5 個建議領域的界限，全面接納物理學、演化生物學、統計學、複雜自適應系統、哲學認識論、資訊論等任何領域。
  - 實作前端動態領域萃取器（`getDynamicDomains`），自動派發星雲霓虹色調、動態統計與迷霧遮罩。
  - 預置 4 大前沿跨界心智模型（熵增定律、鷹鴿博弈、倖存者偏差、湧現現象）與專屬高品質 SVG 神器（耗散逆熵儀、進化平衡羽、洞察真理目鏡、湧現幾何晶核）。
  - 實現客戶端與 CLI 端雙軌即時拓荒引擎：支援前端直接呼叫 Gemini 生成任意全新領域節點並即時注入星圖，或使用 `generate_cards.js --auto-expand` 批次烘焙（已實測自動擴張「哲學認識論・奧卡姆剃刀」）。

### 第四階段：全自動內容補給流水線與多免費 API 落地 (Automated Content Engine)
- [x] **本地環境金鑰隱私保護與 .gitignore 配置**： <!-- id: 26 -->
  - 建立嚴格的 `.gitignore` 隔離 `.env`、`*.key`、`credentials.json`，防止上傳 GitHub 外洩，並提供 `.env.example` 範本。
- [x] **本地生成腳本實測 (`generate_cards.js`)**： <!-- id: 23 -->
  - 配置使用者 Gemini API Key，實作零依賴 `.env` 讀取與雙層模型自動降級備援（`gemini-flash-latest` -> `gemini-flash-lite-latest` -> `gemini-3.6-flash`），成功產出第一張高質量費曼心智模型卡片！
- [ ] **三層費曼防禦自動守門員 (Automated Feynman Guardrail)**： <!-- id: 24 -->
  - 實作自動語料檢驗器，自動驗證：閱讀時間是否在 180 秒內、名詞是否皆在 20 字內白話定義、比喻是否為小學生懂的生活場景，不合規自動退回重新生成。
- [ ] **GitHub Actions 定時自動烘焙**： <!-- id: 25 -->
  - 建立定時擴充知識庫工作流，自動生成新模型並提交 PR 或烘焙進 `database.js` / 靜態 JSON 庫，維持手機客戶端完全零 API 成本與零延遲離線載入。
