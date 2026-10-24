# Liquid Glass Web — UI／UX 與設計系統完整審查報告

> **核心結論：保留目前「內容不透明、玻璃承載導航與控制」的方向，優先補齊任務流程、響應式組合與 Web 操作契約。** 這個專案最值得投入的下一步，是讓材質規則成為可靠的應用程式設計系統；增加透明度、折射或動畫，不是目前的主要改善方向。

| 項目 | 本次範圍 |
| --- | --- |
| 專案 | [yingray/liquid-glass-web][repo] |
| 審查日期 | 2026-10-24（UTC） |
| 固定版本 | `141f90488e0e6e6774cb82b18e2a4793dbea3b8b`（[檢視 commit][commit]） |
| 交付用途 | 供 Ray 判斷方向，並交由 Claude Code 拆解、實作及驗收 |
| 盤點結果 | **50 項：P1 12 項、P2 36 項、P3 2 項**；包含已確認問題、條件性風險與設計建議，不把三者混稱為已發生的產品故障 |
| 本次變更 | 沒有修改專案產品程式碼或發布內容 |

**證據限制：這是一份以原始碼、設計文件、官方指引與色彩計算為基礎的完整範圍審查。此次環境未能成功渲染專案頁面，因此沒有完成目視截圖、瀏覽器互動、真實手機或螢幕閱讀器驗證。** 涉及遮擋、觸控焦點、效能、畫面觀感的結論，以下均保留「風險／待驗」或「設計建議」標示。不能把本報告當作視覺驗收或 WCAG 合規認證；也不提供沒有觀察依據的美感分數。

## 目錄

- [一、整體判斷與優先處理事項](#一整體判斷與優先處理事項)
- [二、審查方法、證據與優先級](#二審查方法證據與優先級)
- [三、六個核心設計概念](#三六個核心設計概念)
- [四、建議的整體設計方向](#四建議的整體設計方向)
- [五、50 項改善總表](#五50-項改善總表)
- [六、逐項改善規格](#六逐項改善規格)
- [七、建議實作順序與依賴](#七建議實作順序與依賴)
- [八、驗收矩陣與完成定義](#八驗收矩陣與完成定義)
- [九、可直接交給 Claude Code 的工作指示](#九可直接交給-claude-code-的工作指示)
- [附錄 A：對比計算與重現方式](#附錄-a對比計算與重現方式)
- [附錄 B：來源與檔案覆蓋](#附錄-b來源與檔案覆蓋)

## 一、整體判斷與優先處理事項

### 1.1 專案已抓到正確的材質角色

目前的優點相當明確：glass 用在導航、控制和暫時覆蓋層；內容區保持 opaque surface；對固定底色使用 flat glass，避免沒有意義的背景模糊；浮在任意內容上的選單、sheet 與 toast 使用更厚的材質；媒體區在淺色主題仍保留適合影像的深色控制。這與 Apple 將 Liquid Glass 視為承載控制與導航、讓內容保持主角的方向相符。[設計總覽][doc-brand]、[材質 token][code-palette]、[Apple WWDC25][A2]

因此我不建議推倒重來，也不建議把內容卡片全面玻璃化。現有無框架 runtime、tokens 生成流程與薄 React adapter 可以繼續使用。主要工作是把已存在的視覺語言補成可組合、可操作、可驗證的系統。

### 1.2 目前最明顯的落差

材質與外觀規則寫得比應用程式行為更完整。固定桌面／手機樣張看得出設計意圖，卻尚未交付一份可在不同尺寸持續完成同一任務的 AppShell；元件有標記、有部分鍵盤程式碼，但動態資料、受控狀態、取消、停用、焦點與非同步工作還沒有同樣完整的契約。[預覽生成器][code-previews]、[核心控制器][code-js]、[React adapter][code-react]

這會產生一種下游風險：Claude Code 能很快產生外觀一致的畫面，但每個產品都得重新猜手機入口、overlay 關閉規則、tabs 面板、錯誤與 loading 行為。這些猜測會逐步造成 UX 分歧。

### 1.3 第一輪應先處理的 12 個 P1

| 問題類別 | 優先項目 | 先做的原因 |
| --- | --- | --- |
| 完整任務與布局 | UI-01、UI-02 | 固定樣張不足以承擔響應式參考；手機缺少明確的專案功能替代入口 |
| 文字與狀態可讀性 | UI-12、UI-13、UI-14、UI-16 | 已有狀態對比計算缺口；素材狀態不能只靠色點 |
| 觸控與固定導航 | UI-21、UI-22 | 實際 hit area 與 44px 承諾不同；導航、safe-area 與內容預留的幾何來源不一致 |
| 元件操作與語義 | UI-25、UI-26、UI-27、UI-30 | menu 缺關鍵操作合約、停用項缺 guard、動態 toolbar 可能失去入口、ListRow 狀態與角色不匹配 |

其中 UI-22 的程式碼不一致已確認，但遮擋的實際程度仍需真機驗證；UI-21 是對本專案更高觸控目標的要求，不等同所有低於 44px 的項目都違反 WCAG AA。

### 1.4 應保留的既有成果

- **材質分工：**導航／控制／overlay 與內容層分開，沒有把 blur 當作每個容器的預設。
- **六主題：**dark、light、dark-solid、light-solid、dark-contrast、light-contrast 已有共同基礎。
- **原生 dialog：**已有 `showModal()`、背景 inert 的原生機制、焦點返回與頁面捲動鎖定；不要改回只有 z-index 的假 modal。
- **基本鍵盤支援：**Toolbar 有 roving tabindex 與方向鍵；SegmentedControl 有鍵盤與 RTL 邏輯。Menu 已有 Escape／回焦，但尚未完整，兩者要區分。
- **使用者偏好：**已有 reduced-motion、forced-colors、降低透明度、高對比、鍵盤 inset 與焦點 ring 基礎。
- **生成與驗證：**tokens、preview 來源有明確生成流程；既有對比和互動檢查可擴充。

以上可在 [bundle.js][code-js]、[bundle.css][code-css]、[無障礙規範][doc-a11y]、[CONTRIBUTING][doc-contributing] 查核。修正時應守住這些基礎，避免因局部美化產生退步。

## 二、審查方法、證據與優先級

### 2.1 實際做過的工作

| 工作 | 結果／邊界 |
| --- | --- |
| 取得固定版本 | 取得 81 個追蹤檔並以 Git blob hash 校驗，81/81 一致；檔案位置皆指向上述 commit |
| 來源審查 | 核心 CSS／JS、型別、tokens 生成、設計指南、元件指南、11 份 HTML 預覽與 19 份 React 預覽的結構／組合，以及 Claude Design adapter |
| 編譯 tokens CSS | `python3 tools/compile_tokens.py tools/.cache/tokens.css` 成功 |
| 執行既有對比檢查 | `python3 tools/check_contrast.py` 回報 **`checks: 905 fails: 0`** |
| 補充對比計算 | 用同一套 `palette.py`／`contrast.py` 計算目前測試未涵蓋的狀態；見附錄 A |
| 官方指引核對 | Apple Liquid Glass／Materials／Menus、W3C WCAG 2.2 與 APG |
| 未完成 | 瀏覽器視覺渲染、`make check`、既有 81 個互動判斷的實際執行、Safari／Firefox／手機／AT／效能驗證 |

「取得並檢查來源」不等同執行全部程式路徑。11＋19 是兩種預覽形式的檔案數，也不代表 30 個互不重複的產品元件。

### 2.2 證據標示

| 標示 | 意思 | 後續處理 |
| --- | --- | --- |
| 程式碼確認 | 可由選擇器、DOM 結構、事件處理或 API 直接判讀 | 為具體情境建立回歸，再修正 |
| 程式碼＋數值確認 | 使用宣告色值與合成順序的計算結果 | 先修配對，再補 computed style／瀏覽器實際渲染驗證 |
| 規範與實作不一致 | 文件承諾和目前來源不同 | 決定正確契約，同步修改文件、程式與範例 |
| 條件性／待驗風險 | 只有特定組合、裝置或消費端行為才發生 | 先重現，避免把推論變成不必要重構 |
| 設計建議／能力缺口 | 對層級、流程、適用範圍的專業判斷 | 以真實任務、線框與原型驗收，不假稱是既有事故 |

### 2.3 優先級定義

- **P1：正式作為可重用 Web App 參考前優先完成。** 涉及主要任務入口、明確可讀性、核心鍵盤路徑或基本狀態語義。本次沒有確認需要立即停用整個專案的 P0。
- **P2：下一輪系統化完善。** 包含重要流程、組合規範、動態整合與可學習性。若產品實際依賴相關能力，可按情境升級。
- **P3：產品定位與擴充。** 先把支持邊界說清楚，再決定是否投資實作。

React 項目 UI-41～45 的預設分級是 P2，因為該 adapter 明示用於 Claude Design；若正式 Web App 直接以它作主要元件，UI-41～44 應升為 P1。不能用 adapter 的缺口推論所有無框架用法都失效。

## 三、六個核心設計概念

### C1 — 內容優先，材質負責說明操作層

使用者來看圖片、讀資料、做判斷；玻璃的任務是承載控制、表達前後關係並維持內容可見。材質若讓影像構圖被裁掉、亮度被永久壓暗，或所有東西都變成同等顯眼的膠囊，就要重新檢查它是否仍服務內容。

對本專案的推論：保留 opaque content 與 media controls；補 contain／cover 與 inspection mode；以控制角色選 Regular／更厚材質或適合媒體的 Clear 方向。Apple 的 Regular／Clear 是原生材質模型，Web 不需要假裝可以用一組固定 alpha 完整複製其所有動態效果。[Apple Materials][A4]、[WWDC25][A2]

### C2 — 用任務與作用範圍建立層級

分組要先說清楚「全域、目前專案、目前選取」；再用位置、字體、留白、色彩與材質表現。材質層數、z-index 或膠囊數量本身不能回答資訊架構問題。主按鈕由目前任務的下一步決定，而不是每個元件各自放一顆強調色。

對本專案的推論：專案標題、Picks／Sources 與 Export 要有空間關聯；Inspector 的內容要說清歸屬；overlay 形式要依任務中斷程度選擇。Apple 對 hierarchy 的原則支持以秩序、間距與對比建立重點，但具體分組仍是本產品的設計決策。[Apple WWDC26][A5]

### C3 — 響應式要延續任務

桌面功能縮成手機版時，可以變位置、變容器、降低同時呈現的資訊量，但必須保留合理的到達路徑。主導航、專案內分頁與目前素材操作不能因 `display:none` 就消失，也不能靠使用者猜測反向捲動找回。

對本專案的推論：新增同一份 fluid AppShell、桌面到手機的功能映射、共享 navbar 幾何、container／viewport 一致的導航模式；同時保留鍵盤與混合輸入能力。

### C4 — 外觀、語義、資料與操作一致

看起來可拖曳就要有拖曳能力；宣告 menu 就要有對應焦點與鍵盤模式；停用就不能執行；受控值沒有改變，畫面也不能自行變成另一個已提交狀態。這些一致性讓人可以預測系統，不必每次重新學習。

對本專案的推論：先完成 Menu、Toolbar、ListRow、Scrubber、取消與 overlay 關閉；再穩固 React 橋接。APG 提供模式參考，是否符合 WCAG 仍須依實際結果與成功準則判斷。[APG Menu Button][W7]、[APG Tabs][W8]、[APG Dialog][W9]

### C5 — 可讀性與可操作性要隨內容和使用者條件成立

對比不是兩個色票的孤立比較，觸控目標也不是外層容器高度。需要檢查狀態、底層內容、局部 opacity、文字長度、放大、鍵盤與輔助工具。無障礙不是最後額外加一個主題，而是每個元件的基本條件。

對本專案的推論：建立狀態配色矩陣、兩種密度、長文字規則、非純色狀態線索與實際 hit area；把標準下限與產品更高目標分開，見第八章。[WCAG 2.2][W0]

### C6 — 設計系統要交付可驗證的契約

每個元件都應能回答：誰擁有狀態、誰處理副作用、哪些 props 可更新、如何取消、怎樣清理、哪些情境已測。設計文件也應區分 Apple 原則、專案風格與硬性能力門檻。

對本專案的推論：文件、CSS、core、adapter、型別、預覽與測試一起更新；保留單一來源生成流程；用行為證據支持 Meets，並明示目前未覆蓋的平台。

### Apple → Web：哪些應保留，哪些需要重新設計

| 層次 | 可承接的原則 | Web 上的落地方式 |
| --- | --- | --- |
| 材質 | 控制與導航位於內容之上、依背景保持可讀 | 受控的材質角色、合成對比測試、fallback、實際效能量測 |
| 層級 | 內容是主角、重點有秩序 | global／project／selection 範圍、文字與留白，不只複製膠囊 |
| 適應 | 不同尺寸與使用者偏好下仍可用 | 流動版面、縮放與重排、safe-area、reduced-motion／forced-colors／solid |
| 操作 | 控制具有一致的狀態與回饋 | 原生 HTML、正確 ARIA、鍵盤／pointer／touch、焦點與路由契約 |
| 風格 | 可維持一套鮮明且一致的視覺語言 | accent、圓角、密度可由產品選擇，不把每個數值說成 Apple 必須 |

Liquid Glass 涵蓋 Apple 多個平台；它不是僅供 iOS 的設計概念。Web 轉譯仍需要處理瀏覽器與開放內容的條件。另現行 Apple Menus 指引已改為有目的且節制地使用圖示，沒有明確對應時可省略；專案「每項必有 icon」需要更新。[WWDC25][A2]、[Apple Menus][A3]

## 四、建議的整體設計方向

本章是建議的目標規格，尚未實作或經目視驗證。先以低保真布局和真實內容確認，再套用現有材質；不需要另做一套視覺品牌。

### 4.1 建議的 AppShell 區域

| 區域 | 桌面 | 窄版／手機 | 核心驗收問題 |
| --- | --- | --- | --- |
| 全域導航 | 穩定、可辨識的主目的地區 | 底部主目的地；縮小時仍有明確到達方式 | 我現在在哪個主區域？ |
| 專案脈絡 | 名稱、子分頁與專案動作在同一視覺範圍 | 主內容上方的專案標頭與局部分頁／選單 | 目前操作哪個專案？ |
| 內容舞台 | 可依剩餘空間伸縮，保留媒體比例 | 優先呈現內容，控制不擋關鍵區域 | 我看到的是完整原圖還是裁切？ |
| 目前選取資訊 | 有清楚對象標頭的 Inspector | 可開合區域或適合任務的 sheet／頁面 | 這些設定會改哪個素材？ |
| 專案工作佇列 | 與 selection inspector 有清楚區別 | Queue／Activity 明確入口與未完成數量 | 系統還有什麼工作在進行？ |
| 素材總覽 | 一致的 tile／真實比例模式 | 可操作的縮圖列或網格 | 哪些已選、待處理、已審核？ |
| Composer | 有明確作用範圍、非同步狀態 | 鍵盤開啟時仍可看見輸入與提交回饋 | 我的指令送給誰、是否已收到？ |

不要先以「四塊玻璃島」或「只能有一顆強調色」當布局起點；先完成上述範圍與任務關係，再決定表面、間距和強度。

### 4.2 桌面到手機的功能映射

| 目前桌面入口 | 手機建議位置 | 不能遺失的資訊 |
| --- | --- | --- |
| Studio／Library／Shows | 主 TabBar | current destination、完整可達性 |
| 專案名稱 | 內容標頭／專案切換器 | 完整或可取得的名稱、所在範圍 |
| Picks／Sources | 專案局部分頁或清楚的本地切換器 | current tab、Sources 待處理數量 |
| Export | 專案動作區／明確標示的更多選單 | 匯出對象、進度、成功／失敗 |
| Search | 可辨識的搜尋入口 | 搜尋範圍與結果；不能以 Assistant 代替 |
| Queue | 專案動作區，必要時保留 badge | 背景工作的進度與錯誤 |
| Review／Use | 目前素材的 contextual action | 動作對象、可用狀態與結果 |

以上是具體可行的起點，不是要求所有入口永遠同時露出。驗收重點是到達路徑與作用範圍清楚，而不是單純比對可見按鈕數。

### 4.3 字體與密度起點

| 角色 | Compact 建議起點 | Comfortable 建議起點 |
| --- | --- | --- |
| 本文 | 14px／20px line-height | 16px／24px |
| 主要控制文字 | 13–14px，依任務調整 | 14–16px |
| 次要資訊 | 12px／16px，但不承擔唯一關鍵資訊 | 13px／18px |
| 手機主導航標籤 | 不沿用 10.5px 作一般預設 | 以 12–13px 起測，搭配可理解文字 |
| 互動命中區 | 按精確指標與密度設計，另驗 WCAG | 以 44×44 CSS px 產品目標起測 |

這些是本報告的設計起點，不是 Apple 或 WCAG 規定字級。以繁中、長檔名、長專案名和真實表單測試；若空間不足，先調整結構、呈現層級與換行，不先縮小重要文字。

### 4.4 間距、形狀與表面

維持現有 spacing scale，但讓間距表達關係：同一控制內最緊，同一任務內次之，不同範圍更鬆。不要把所有區域都用相同 8px gap，否則規則雖一致，分組卻沒有層次。這是目標方向，是否有特定區塊過密／過鬆仍需渲染後確認。

Capsule 適合短控制與導航；表單、多行內容和大容器則應依內容選圓角。保留 concentric corners 作合理預設，但 hit area、文字內距與語義應優先於機械式半徑公式。用同一材質角色的相同陰影與邊緣，避免每個 showcase 補一套局部視覺語言。

### 4.5 媒體與 overlay 決策

| 情境 | 建議呈現 | 需要避免的誤解 |
| --- | --- | --- |
| 縮圖瀏覽 | 可 cover；清楚的 selected／status | 任意寬度被當成時長 |
| 精確檢視構圖／顏色 | contain／可切完整，控制與 scrim 可退出 | UI 遮罩被誤當素材本身的亮度 |
| 播放／展示 | 適量局部 scrim、穩定媒體控制 | 小舞台被永久全域壓暗 |
| 短且有來源的選項 | Anchored popover／menu | 開在無關位置、scope 不清楚 |
| 需集中注意的小任務 | 桌面 dialog／手機 sheet，依內容選 | 一律把所有桌面任務放底部 |
| 持續與素材對照 | 非模態 inspector／side panel | 無必要地封鎖背景內容 |
| 複雜或長流程 | 完整頁面或明確分步流程 | 在小 sheet 中堆入整個產品流程 |

## 五、50 項改善總表

表內的優先級是執行排序，不是對每項都宣稱已觀察到同樣嚴重的故障。詳細條目包含證據與前提。

| ID | 優先級 | 改善項目 | 範圍 |
| --- | --- | --- | --- |
| [UI-01](#ui-01) | P1 | 把固定展示畫布補成真正可縮放的 AppShell 參考實作 | 完整頁面範例 |
| [UI-02](#ui-02) | P1 | 手機版必須補回被隱藏的專案操作與工作狀態 | 完整手機工作區範例／文件 |
| [UI-03](#ui-03) | P2 | 導覽島嶼應先按操作範圍分組，再決定材質與數量 | 資訊架構／導航美感 |
| [UI-04](#ui-04) | P2 | 分開目前素材的檢查資訊與整個專案的工作佇列 | Inspector／右側欄 |
| [UI-05](#ui-05) | P2 | 用當前任務決定主要動作，統一互相衝突的強調色規則 | 主要動作／視覺層級 |
| [UI-06](#ui-06) | P2 | 提供舒適與緊湊兩種密度，不把工作站密度當成通用預設 | 字體／資訊密度 |
| [UI-07](#ui-07) | P2 | 把固定高度與截字規則改成可容納內容的尺寸契約 | 字級放大／長文／在地化 |
| [UI-08](#ui-08) | P2 | 為媒體檢視提供 contain／cover 與長寬比契約 | Stage／媒體保真 |
| [UI-09](#ui-09) | P2 | 分開媒體展示與精確檢視時的遮罩策略 | Stage／遮罩／影像判斷 |
| [UI-10](#ui-10) | P2 | 把 Contact Sheet 與 Timeline 定義為兩種不同的組合模式 | 素材總覽／時間軸 |
| [UI-11](#ui-11) | P2 | 依任務選擇覆蓋層形式，保留桌面與手機的差異 | Dialog／Sheet／Popover |
| [UI-12](#ui-12) | P1 | 把 danger 文字的 hover／pressed 納入對比契約 | Danger 按鈕／選單狀態 |
| [UI-13](#ui-13) | P1 | 修正媒體分段控制在按住時幾乎消失的選取文字 | 媒體上 SegmentedControl |
| [UI-14](#ui-14) | P1 | 移除 timecode 的任意透明度，改用可驗證的次要文字色 | 媒體播放時間文字 |
| [UI-15](#ui-15) | P2 | 補足輸入欄位的邊界與可輸入感 | TextField／表單 |
| [UI-16](#ui-16) | P1 | 讓素材狀態不只剩彩色小點 | 素材縮圖／狀態標示 |
| [UI-17](#ui-17) | P2 | 讓選取與焦點標記在任意影像上都能辨識 | 影像選取／焦點 |
| [UI-18](#ui-18) | P2 | 使降低透明度與高對比模式的承諾對齊實作 | Solid／Contrast 主題 |
| [UI-19](#ui-19) | P2 | 把真正共用的排版與尺寸語義收回 tokens | Tokens／生成流程 |
| [UI-20](#ui-20) | P3 | 明確定義哪些是 Liquid Glass 原則、哪些是目前品牌風格 | 品牌／主題擴充 |
| [UI-21](#ui-21) | P1 | 兌現專案自己的 44px 觸控目標承諾 | 觸控操作尺寸 |
| [UI-22](#ui-22) | P1 | 用同一份導航幾何計算內容、選單與捲動邊緣 | Navbar／safe area／內容預留 |
| [UI-23](#ui-23) | P2 | 統一 Navbar 與 TabBar 判斷可用空間的上下文 | 嵌入式布局／斷點 |
| [UI-24](#ui-24) | P2 | 為縮小後的主導覽提供明確展開操作 | TabBar minimize |
| [UI-25](#ui-25) | P1 | 補齊 role=menu 所承諾的鍵盤與焦點行為 | Menu／GlassPanel |
| [UI-26](#ui-26) | P1 | 讓 aria-disabled 的選單項目確實不能啟動動作 | Menu.Item 停用狀態 |
| [UI-27](#ui-27) | P1 | 修復工具列在隱藏或停用項目變動後的 Tab 入口 | Toolbar 動態可用性 |
| [UI-28](#ui-28) | P2 | 分開拖曳預覽、提交與取消 | SegmentedControl 拖曳 |
| [UI-29](#ui-29) | P2 | 交付完整的 tabs 組合範例與責任邊界 | Tabs 與 SegmentedControl |
| [UI-30](#ui-30) | P1 | 讓 ListRow 的選取狀態對應合法的角色 | ListRow 語義 |
| [UI-31](#ui-31) | P2 | 用真正的外部命中判定關閉 sheet | Sheet 背景點擊 |
| [UI-32](#ui-32) | P2 | 為未完成工作提供一致的離開與草稿策略 | 有草稿的 Dialog／Sheet |
| [UI-33](#ui-33) | P2 | 定義同時開啟多個浮層時誰先關閉 | 多層 Overlay／Escape |
| [UI-34](#ui-34) | P2 | 依操作後果選擇確認方式，取消一律禁止 dialog 的規則 | 破壞性操作確認 |
| [UI-35](#ui-35) | P2 | 把助理指令輸入與站內搜尋區分清楚 | Assistant Composer 語義 |
| [UI-36](#ui-36) | P2 | 只顯示真的有註冊且適用於平台的快捷鍵 | ⌘K／快捷鍵提示 |
| [UI-37](#ui-37) | P2 | 補齊送出、進行中、失敗與重試的工作流程 | Composer 非同步任務 |
| [UI-38](#ui-38) | P2 | 明確決定 Scrubber 是進度顯示還是可操作時間控制 | Scrubber |
| [UI-39](#ui-39) | P2 | 讓一般使用者也能辨識圖示功能 | Icon-only 控制／Tooltip |
| [UI-40](#ui-40) | P2 | 把通知放在目前操作脈絡，並保留重要結果 | Toast／操作回饋 |
| [UI-41](#ui-41) | P2 | 讓 React 更新後的 callback 與選項確實生效 | React 控制器 options |
| [UI-42](#ui-42) | P2 | 兌現 SegmentedControl 的受控狀態契約 | React controlled state |
| [UI-43](#ui-43) | P2 | 使用穩定 value，不用顯示文字當資料身份 | SegmentedControl value |
| [UI-44](#ui-44) | P2 | 在選項增刪與重排後更新控制器集合 | 動態 SegmentedControl items |
| [UI-45](#ui-45) | P2 | 合併 helper 與 error 描述，避免互相覆蓋 | TextField 描述與錯誤 |
| [UI-46](#ui-46) | P2 | 讓卸載與 destroy 完整釋放各自擁有的資源 | Core／React 生命週期 |
| [UI-47](#ui-47) | P2 | 分開 Apple 原則、專案風格與真正的可用性門檻 | Apple 對照／設計 lint |
| [UI-48](#ui-48) | P2 | 讓驗證從固定樣張延伸到真實操作契約 | 測試／CI／效能 |
| [UI-49](#ui-49) | P2 | 用真實與困難內容測試材質，而不只用柔和漸層 | 視覺驗收資料 |
| [UI-50](#ui-50) | P3 | 把可重用設計系統的邊界寫清楚，再擴大適用產品 | v1 定位／消費端契約 |

## 六、逐項改善規格

### A｜版面、資訊架構與視覺層級

#### UI-01

**把固定展示畫布補成真正可縮放的 AppShell 參考實作**

**優先級：P1｜證據：程式碼確認｜範圍：完整頁面範例**

- **位置：**[previews_body.py][code-previews] L584–647；[interact.py][code-interact] 的 `page_html` 寬度測試；[響應式規範][doc-responsive]；[Claude Design 使用約定][code-conventions] 的 Setup。
- **問題與影響：**桌面 `.sc` 固定 1440×900 並隱藏溢位；手機 `.ph` 是另一份 390×844 固定畫布。現有寬度測試主要驗證精簡導覽與假內容，沒有一起驗證舞台、素材列、Inspector、Composer。使用約定的起始範例還把主內容設為固定雙欄與 24px padding，沒有示範導航預留。
- **核心概念：**C3：響應式應保留完整任務。靜態樣張可作設計溝通，但不能承擔應用程式版面契約。
- **建議修正：**保留展示卡；新增一份真正流動的 AppShell，統一導航預留、主內容最小寬度、側欄開合、底部控制預留與局部捲動。側欄是否常駐由剩餘內容空間決定；不要只把 1440 改成 100vw 就當作完成。
- **驗收條件：**同一份參考頁在 320、390、600、743、744、900、1099、1100、1440、1920px，以及短視窗／橫向下可完成相同任務。不能用 `body{overflow:hidden}` 掩蓋被截掉的內容；必要的時間軸可局部橫向捲動。

#### UI-02

**手機版必須補回被隱藏的專案操作與工作狀態**

**優先級：P1｜證據：程式碼確認｜範圍：完整手機工作區範例／文件**

- **位置：**[previews_body.py][code-previews] L5–39、660–675；[bundle.css][code-css] L383–391；[響應式規範][doc-responsive] 的元件差異表。
- **問題與影響：**桌面展示提供 Picks、Sources、Export、Search、Queue；窄版透過 `.lg-nav-desktop` 隱藏這些區域，手機選單卻只有 Activity／Settings，底部分頁只有 Studio／Library／Shows。文件說專案脈絡會移入選單，範例沒有落實。這是 ShowcaseMobile 的缺口；FloatingNavbar 獨立預覽的 TabBar 已可含 Search，不應對所有手機 TabBar 重複增加入口。
- **核心概念：**C2／C3：縮小畫面時重新分配入口，維持操作範圍與任務完整性。
- **建議修正：**建立桌面→手機功能映射：主目的地留底部分頁；專案名稱與子分頁進頁面內標頭；Export、Queue 放進可發現的專案動作區；Sources 的待處理數量保留可見提示。Assistant Composer 不等同站內搜尋。
- **驗收條件：**手機使用者可找到目前專案、切換 Picks／Sources、看待處理項、開啟 Queue、搜尋及 Export。逐項記錄入口與步數；此項針對設計系統範例，並非宣稱所有消費端應用都已遺失功能。

#### UI-03

**導覽島嶼應先按操作範圍分組，再決定材質與數量**

**優先級：P2｜證據：設計建議｜範圍：資訊架構／導航美感**

- **位置：**[FloatingNavbar 規範][doc-navbar] 的 Structure／Grouping；[previews_body.py][code-previews] L13–32；[反模式][doc-antipatterns] 的工具列分組規則。
- **問題與影響：**現有四塊島嶼與獨立 Export 有秩序，但全域目的地、專案名稱、專案子分頁與專案動作被分成多個相近的膠囊。材質的前後層級無法單獨解釋 Studio、專案名稱與 Picks 之間的資訊階層。
- **核心概念：**C2：群組首先要回答「我在哪裡、這個動作影響誰」。
- **建議修正：**在規範定義全域、專案、目前選取三種範圍；讓專案名稱、局部分頁與 Export 有可辨識的空間關聯。全域導覽與局部分頁以位置、標籤及語義區分；依任務決定表面數，不硬性追求更多或更少玻璃島。
- **驗收條件：**在桌面與手機，使用者都能辨識三層範圍，並在點擊 Export 前知道匯出哪個專案。先以線框與真實文案確認分組，再調整陰影或透明度。

#### UI-04

**分開目前素材的檢查資訊與整個專案的工作佇列**

**優先級：P2｜證據：設計建議｜範圍：Inspector／右側欄**

- **位置：**[previews_body.py][code-previews] L323–347、608–620；[ShowcaseDesktop 說明][doc-desktop]。
- **問題與影響：**舞台顯示 Frame 14，右側 Inspector 同時放其他 Frame 的決策、Library 缺圖、Frame 15 進度、跨素材 Notes 與 Activity。這些內容可共存，但目前缺少清楚的「目前素材／專案」範圍標頭。
- **核心概念：**C2：空間位置要能說明資訊歸屬，讓使用者預測操作的影響範圍。
- **建議修正：**提供 Selection Inspector 與 Project Assistant／Activity 的明確模式或區段；上方固定顯示目前對象。優先呈現和選取素材直接相關的內容，其餘佇列提供摘要與可展開詳細資訊。
- **驗收條件：**切換素材後，標頭、相關資訊與動作同步；點擊跨素材建議時清楚切換對象。使用者能回答「這個按鈕會改哪一張圖／哪個專案」。

#### UI-05

**用當前任務決定主要動作，統一互相衝突的強調色規則**

**優先級：P2｜證據：文件確認＋設計建議｜範圍：主要動作／視覺層級**

- **位置：**[品牌規範][doc-brand] L55–56；[使用約定][code-conventions] Rules；[ShowcaseDesktop][doc-desktop]；[bundle.css][code-css] L507–508；[React Composer][code-react] L271–293。
- **問題與影響：**品牌規範說每個畫面一個最重要的強調色動作，使用約定允許再加一個 navbar 動作；展示有 Export 與 Review。在 React 或 host 落實啟用行為的狀態下，Composer 有文字時的 Send 也突出。原生 preview helper 只按生成時的 value 決定 disabled，不能說它已綁定即時輸入行為。各元件組合後仍缺少主要動作的優先關係。
- **核心概念：**C2：主要動作的強度應反映目前下一步，不能由每個元件各自宣告。
- **建議修正：**定義瀏覽、審核、編輯指令、匯出等任務狀態。審核時 Review／Use 最突出，Export 可維持較低強度；輸入指令時 Send 突出。不同區域可各有主要動作，但需有清楚的作用範圍與強度差。
- **驗收條件：**對每個完整情境都能用一句話說出下一步；同時可用的 Export／Review／Send 不形成三個等強焦點。驗收須包含 Composer 有文字的狀態。

#### UI-06

**提供舒適與緊湊兩種密度，不把工作站密度當成通用預設**

**優先級：P2｜證據：設計建議｜範圍：字體／資訊密度**

- **位置：**[tokens_build.py][code-tokens] L47–67；[品牌規範][doc-brand] Typography；[bundle.css][code-css] L19–20、284、427、502、723。
- **問題與影響：**全系統以 14px 本文、13px 控制、12px 次要資訊為主；手機分頁標籤只有 10.5px，手機沿用相同尺度。這是專業工作站可以採用的選擇，但對長時間閱讀、繁中內容與一般手機應用的適用性尚未驗證。
- **核心概念：**C5：密度由任務、閱讀負擔與輸入方式決定。
- **建議修正：**保留 Compact；新增 Comfortable 作為手機及一般表單預設。建議起點為本文 16/24、控制 14–16px、次要資訊 13/18；重要導航與狀態不要依賴 micro 字級。尺寸是本報告的設計起點，不是 Apple 或 WCAG 固定要求。
- **驗收條件：**以相同真實內容對照兩種密度，保留主次與資訊量；手機不用放大就能閱讀關鍵短描述。不要靠縮字解決導航塞不下。

#### UI-07

**把固定高度與截字規則改成可容納內容的尺寸契約**

**優先級：P2｜證據：程式碼風險｜範圍：字級放大／長文／在地化**

- **位置：**[bundle.css][code-css] L158–169、276–286、349–354、412–429、491–506、579、637；[響應式規範][doc-responsive] Type sizes。
- **問題與影響：**多個控制使用固定 height、px 字級與 nowrap；Modal 標題一律 ellipsis。尚無足夠情境證明長專案名、翻譯後按鈕與放大文字仍可用。px 本身不會阻止整頁縮放，不能因此直接判定違反規範。
- **核心概念：**C3／C5：版面應容納內容與使用者設定，不能只容納設計稿文字。
- **建議修正：**以角色字體 token 與相對尺度支援使用者設定；必要控制採 min-height；允許長動作換行或重新配置。明定哪些內容可截字，並提供可取得全文的方法；任務標題優先完整呈現。
- **驗收條件：**分別驗證 200% 文字放大、等效 320px 重排、文字間距覆寫、繁中／日文／德文／RTL 長字串。一般內容不失功能；必要二維編輯區可有局部捲動。參考 [Reflow][W3]、[Resize Text][W4]、[Text Spacing][W5]。

#### UI-08

**為媒體檢視提供 contain／cover 與長寬比契約**

**優先級：P2｜證據：程式碼確認＋設計建議｜範圍：Stage／媒體保真**

- **位置：**[bundle.css][code-css] L108；[React adapter][code-react] L565–585；[previews_body.py][code-previews] L597、609；[React types][code-react-types] StageProps。
- **問題與影響：**Stage 預設 background-size:cover，React media 直接產生背景圖；展示另使用 130% 背景尺寸。示例目前是漸層，所以沒有真人或影片被裁切的實測證據；但直接放入不同比例真圖時，API 預設會裁切。
- **核心概念：**C1：媒體工作區應讓使用者判斷原始內容，幾何呈現要可預期。
- **建議修正：**定義 fit=contain／cover／native 或對應樣式；檢視模式預設完整呈現，縮圖才選擇 cover。提供 img／video slot 與描述文字，讓來源比例、載入狀態與內容語義有明確位置。
- **驗收條件：**以 16:9、9:16、1:1、超寬及四角標記測試圖驗收；contain 不裁角、不拉伸；cover 可辨識並可切回完整畫面。

#### UI-09

**分開媒體展示與精確檢視時的遮罩策略**

**優先級：P2｜證據：設計建議｜範圍：Stage／遮罩／影像判斷**

- **位置：**[bundle.css][code-css] L109–120；[品牌規範][doc-brand] Stage scrim；[React adapter][code-react] L565–585 的 noScrim。
- **問題與影響：**所有 Stage 預設都有上方 64→140px、下方 88→180px 的黑色遮罩，即使沒有相應控制也存在；小高度時兩段可能重疊。系統已提供 noScrim，缺的是明確選用與退出控制規則。
- **核心概念：**C1：控制可讀性與內容原貌必須同時被照顧。
- **建議修正：**定義展示／播放與精確檢視兩種模式；只在控制實際需要的位置加遮罩。精確檢視可隱藏控制及遮罩，並提供明確返回操作；中間標記使用局部 plate。
- **驗收條件：**灰階與純白測試圖在精確檢視時不被系統遮罩改變；顯示控制後仍可讀。檢查短舞台，避免上下遮罩把整張內容壓暗。

#### UI-10

**把 Contact Sheet 與 Timeline 定義為兩種不同的組合模式**

**優先級：P2｜證據：設計建議｜範圍：素材總覽／時間軸**

- **位置：**[品牌規範][doc-brand] Layers 後的標準版面；[previews_body.py][code-previews] L582–600、614–616、638–639。
- **問題與影響：**文件把底部面板同時描述成素材總覽或時間軸；目前素材列使用任意 flex-grow 寬度，手機又改等寬，沒有時間尺或時長語義。這些示意值不能直接當作時間軸規則。
- **核心概念：**C2：位置、順序與寬度本身就是資訊，必須有一致含義。
- **建議修正：**素材總覽採一致 tile，或依真實圖片比例排列並清楚說明；時間軸另定時長對寬度、播放位置、縮放與捲動。若 v1 不提供剪輯器，明確列為尚未涵蓋，避免 Agent 挪用展示列。
- **驗收條件：**素材寬度不會無故暗示播放長短；時間軸的相對寬度可解讀成時長；素材選取與播放位置有不同標記。

#### UI-11

**依任務選擇覆蓋層形式，保留桌面與手機的差異**

**優先級：P2｜證據：設計建議｜範圍：Dialog／Sheet／Popover**

- **位置：**[Modal 規範][doc-modal] When to use／Sizes；[bundle.css][code-css] L613–650；[GlassPanel 規範][doc-panel]。
- **問題與影響：**目前 Modal 統一是底部 sheet，桌面也距底 16px；這是可行的風格選擇，但缺少置中對話框、來源相連的 popover、非模態側欄與完整頁面的選用條件。
- **核心概念：**C2／C3：先決定是否中斷工作、是否要對照內容，再決定容器位置。
- **建議修正：**局部短選項用 anchored popover；需要集中注意的小任務可用桌面 dialog／手機 sheet；持續對照素材用非模態 inspector；長流程用完整頁面。將 presentation 與 modal 語義分開，保留現有 sheet 選項。
- **驗收條件：**同一個匯出設定或素材替換流程在兩種尺寸都有清楚位置與範圍；非模態檢查不意外封鎖舞台；關閉回到正確來源。

### B｜材質、色彩、狀態與 tokens

#### UI-12

**把 danger 文字的 hover／pressed 納入對比契約**

**優先級：P1｜證據：程式碼＋數值確認｜範圍：Danger 按鈕／選單狀態**

- **位置：**[bundle.css][code-css] L190–209、L582–586；[palette.py][code-palette] L43–51；[check_contrast.py][code-contrast-check] L55–58、L105–115。
- **問題與影響：**既有 905 項檢查通過，但狀態底色主要驗證 ink，沒有完整覆蓋 danger 前景。依宣告色值合成，dark 的 danger 按鈕在白色內容上疊 thick glass 與 fill-strong 為 3.50:1；pressed 為 2.85:1；dark-solid 對應為 4.10:1／3.30:1。這低於一般文字 4.5:1。選單 hover 使用 fill，不能把按鈕的 hover 數值直接套到選單；選單 pressed 則同樣需要檢查。
- **核心概念：**C5／C6：可讀性是「前景 × 材質 × 互動狀態 × 底層內容」的契約，單獨色票合格不代表元件合格。
- **建議修正：**選擇狀態專用 danger 前景／底色組合，或以穩定的內容底板保護文字；同時檢查 icon、文字及 focus。增加 danger 在 default、hover、pressed、selected 與主要材質下的組合測試，避免只調一般 ink token。
- **驗收條件：**六種主題的 danger 小字在支持的表面與狀態中達 4.5:1；對比主題若仍宣稱 7:1，就另達專案的 7:1 門檻。新增測試先能捕捉目前案例，再驗證修正；數學計算與瀏覽器 computed style／取樣分開記錄。

#### UI-13

**修正媒體分段控制在按住時幾乎消失的選取文字**

**優先級：P1｜證據：程式碼＋數值確認｜範圍：媒體上 SegmentedControl**

- **位置：**[bundle.css][code-css] L311–324；[palette.py][code-palette] 的 stage、media-glass 與 media-fill。
- **問題與影響：**媒體模式的 selected label 使用深色 stage 前景，但 pressed 規則把 thumb 切回深色 media-glass；選擇器優先順序使這個配對保留下來。黑色媒體底上，計算對比約 1.11:1；solid 約 1.09:1；contrast 為 1.00:1。這是可由 CSS 與 token 直接推導的配色錯配，尚未做畫面取樣。
- **核心概念：**C4／C5：按下狀態應確認使用者正在操作哪一項，不能把最重要的選取標籤隱藏。
- **建議修正：**以明確的媒體模式 state table 定義 selected／pressed 前景與 thumb 背景；讓兩者同步轉換。不要靠繼續增加零散 specificity 覆寫來修補。
- **驗收條件：**六主題、明暗媒體、pointer 持續按住與拖曳時，選取文字均可讀；每個 state 的 computed foreground/background 與預期表一致。高對比模式也要單獨覆蓋。

#### UI-14

**移除 timecode 的任意透明度，改用可驗證的次要文字色**

**優先級：P1｜證據：程式碼＋數值確認｜範圍：媒體播放時間文字**

- **位置：**[bundle.css][code-css] L478–479；[previews_body.py][code-previews] L70–81、L612、L651；[React adapter][code-react] 的 Toolbar.Text。
- **問題與影響：**timecode 的 small 直接設 opacity:.6，繞過已有的媒體次要文字 token。以白色內容＋底部 scrim＋media glass 合成，dark 一般主題約 4.16:1，低於此小字的 4.5:1。既有 contrast suite 沒有把這層局部 opacity 算進去。
- **核心概念：**C5：次要資訊可以降低視覺權重，但不應失去基本可讀性。
- **建議修正：**使用 ink-on-media-muted 或專用、經驗證的 timecode token；用字級／間距／字重分層，避免容器 opacity 連同所有子元素一起削弱。
- **驗收條件：**時間總長與目前時間在白、黑、灰與高頻媒體上可讀，六主題都測試實際組合；至少覆蓋目前 4.16:1 案例。

#### UI-15

**補足輸入欄位的邊界與可輸入感**

**優先級：P2｜證據：程式碼確認＋設計風險｜範圍：TextField／表單**

- **位置：**[bundle.css][code-css] L714–737；[React TextField][code-react] L676–689；[無障礙規範][doc-a11y]。
- **問題與影響：**一般輸入框依賴很接近周圍的 surface-inset，且 border:0。輸入底與 surface 約為 dark 1.09:1、light 1.15:1；light canvas 約 1.02:1。這不代表所有欄位都違反 WCAG，因為辨識也受標籤、位置與其他線索影響；但來源碼顯示缺乏一套穩定的欄位可辨識策略，高對比主題也未明確補邊界。
- **核心概念：**C4／C5：人應看得出哪裡能輸入，不能只在已經聚焦後才知道。
- **建議修正：**建立 default／hover／focus／disabled／error 欄位狀態；依使用表面選擇可辨識的細邊界、底色或底線。保留永久 label，placeholder 不作唯一名稱。若邊界是辨識輸入欄位所必需，依 WCAG 1.4.11 達 3:1；純裝飾邊線不一律要求。有 label 或位置線索不構成自動豁免。
- **驗收條件：**在淺色、深色、solid、contrast、forced-colors 與表單密集排列下，不必先點擊就能辨識欄位；錯誤除紅色外有文字與關聯；由實際必要的辨識線索判定 WCAG 1.4.11。

#### UI-16

**讓素材狀態不只剩彩色小點**

**優先級：P1｜證據：程式碼確認｜範圍：素材縮圖／狀態標示**

- **位置：**[previews_body.py][code-previews] L600、L615–616、L656–657；[ShowcaseMobile 範例][doc-mobile]。
- **問題與影響：**素材縮圖以不同色點標示狀態，手機 aria-label 主要只報 Frame 編號。顏色代表的 reviewed／pending 等資訊沒有穩定的文字或形狀等價表示；選取狀態與工作狀態的差異也需要說清楚。
- **核心概念：**C4／C5：狀態是內容資訊，不能把理解它的能力建立在分辨色相上。
- **建議修正：**保留顏色作快速掃視線索，同時加入形狀／圖示或可見文字，並把狀態放進 accessible name 或描述。分別定義 selected、current playback、pending、reviewed，避免一個點承擔多種意思。
- **驗收條件：**灰階與常見色覺差異條件下能分辨關鍵狀態；讀屏讀到素材名稱、選取與審閱狀態；狀態改變時有適當回饋，不靠顏色獨自傳意。

#### UI-17

**讓選取與焦點標記在任意影像上都能辨識**

**優先級：P2｜證據：程式碼確認＋設計風險｜範圍：影像選取／焦點**

- **位置：**[bundle.css][code-css] L131–134；[check_contrast.py][code-contrast-check] L76–79；[previews_body.py][code-previews] L598。
- **問題與影響：**通用選取 ring 依主題使用 accent／accent-text，仍直接疊在任意影像內側，現有檢查主要比對 canvas／surface；展示素材列又另用 ink outline。尚未證實某張實際照片造成失效，但目前規格沒有保證任意內容上的辨識，也沒有統一區分 focus 與 selected。
- **核心概念：**C4／C5：選取是持續狀態，焦點是目前鍵盤操作位置；兩者應能同時成立且不混淆。
- **建議修正：**把選取標記放在受控的 gutter／底板上，或採雙色邊界加 check 等第二線索；保留獨立 focus-visible。統一 showcase 與元件使用同一套選取規則。
- **驗收條件：**在全白、全黑、accent 同色、棋盤、高頻照片上仍可定位 selected；焦點與選取各有清楚語義，單選是否隨焦點變更須明定，多選時移動焦點不無意清除既有選取；所需非文字辨識線索達 3:1。

#### UI-18

**使降低透明度與高對比模式的承諾對齊實作**

**優先級：P2｜證據：規範與程式碼不一致｜範圍：Solid／Contrast 主題**

- **位置：**[無障礙規範][doc-a11y] L24 起；[palette.py][code-palette] L56 起；[bundle.css][code-css] 的 menu、sheet、media 與 pin shadow 規則。陰影主題繼承另見 [tokens_build.py][code-tokens] L95–103。
- **問題與影響：**文件描述 solid 媒體面為 opaque，但 media token 仍可為 .90／.92 alpha；contrast 說明移除 shadow，部分元件仍繼承 shadow。這不是自動構成無障礙失敗，而是「選了什麼適應模式」與文件承諾不一致。
- **核心概念：**C5／C6：使用者選擇降低透明度或提高對比後，效果應可預期、可驗證。
- **建議修正：**決定 solid 的準確契約：完全不透明，或明確說明仍有受控透明的媒體變體；若保留 contrast 的陰影，也說明目的並驗證。用 token／variant 統一策略，不在每個元件分散補丁。
- **驗收條件：**對照文件逐項檢查六主題的 opacity、backdrop-filter、shadow 與文字對比；不得為追求更透而降低目前保護文字的底板；偏好切換不改變任務位置與資料。

#### UI-19

**把真正共用的排版與尺寸語義收回 tokens**

**優先級：P2｜證據：程式碼確認｜範圍：Tokens／生成流程**

- **位置：**[tokens_build.py][code-tokens]；[palette.py][code-palette]；[bundle.css][code-css] 的 font shorthand、尺寸；[previews_body.py][code-previews] 版面樣式；[CONTRIBUTING][doc-contributing]。
- **問題與影響：**已有良好的 token 生成流程，但多處字級、行高、控制尺寸與 preview 布局仍直接寫值。變更 typography token 不一定能傳到所有元件；相同功能也可能在 showcase 與 adapter 各自演化。
- **核心概念：**C6：設計系統的價值是一次修改能可靠傳遞，並清楚知道哪些值屬於產品組合。
- **建議修正：**抽取 semantic type roles、control heights、density、layout spacing 與層級必要值；保留合理的局部幾何常數，不把每個 literal 都變成 token。明確標記 source-of-truth、生成檔與 app-specific styles。
- **驗收條件：**改變一個 body／control／density token 時，相關元件與 reference shell 同步更新；執行生成工具後沒有漂移；不能直接手改 tokens.json 或 preview.html 來完成修正。

#### UI-20

**明確定義哪些是 Liquid Glass 原則、哪些是目前品牌風格**

**優先級：P3｜證據：設計建議｜範圍：品牌／主題擴充**

- **位置：**[設計系統總覽][doc-brand] 的 brand／accent 規則；[palette.py][code-palette]；[tokens_build.py][code-tokens]。
- **問題與影響：**文件把系統描述成幾乎無品牌、主要改 accent；但帶紫的中性色、capsule 比例、密度與陰影本來就是可辨識的風格選擇。這不需要被移除，只需避免讓使用者以為改 accent 就能完整適配任何產品品牌。
- **核心概念：**C1／C6：可攜的是內容優先與材質角色；不是每個產品都要長得像同一套樣張。
- **建議修正：**列出固定原則與可配置選項。前者包括材質用途、狀態可讀性、操作一致；後者可包括中性色溫、字體、密度、圓角強度、accent。先維持一套高品質預設，未實作的品牌能力標為未支援。
- **驗收條件：**提供最小主題擴充契約與驗證清單；不必立即產生多套品牌，也不以客製化為由放寬對比／焦點／目標尺寸要求。

### C｜響應式、導航、鍵盤與覆蓋層

#### UI-21

**兌現專案自己的 44px 觸控目標承諾**

**優先級：P1｜證據：程式碼與尺寸推導｜範圍：觸控操作尺寸**

- **位置：**[bundle.css][code-css] L276、L448、L739、L805–818；[響應式規範][doc-responsive]；[無障礙規範][doc-a11y]。
- **問題與影響：**粗指標樣式不等於每個可點區都達 44px：segmented 內項約 38px、chip 約 30px、縮小 TabBar 的 current 項寬約 36px；brand link 也未自動跟隨。只用 pointer:coarse 還可能忽略同時有滑鼠與觸控的裝置。這些是專案 44px 承諾的缺口，不應一律宣稱違反 WCAG AA 的 24px 尺寸／間距規則。
- **核心概念：**C3／C5：目標尺寸要量實際命中區，不能只看外層容器有多高。
- **建議修正：**為每個互動子項定義 hit area 與相鄰安全間距；可擴大透明命中範圍，但不可彼此重疊。以合理的密度模式與 any-pointer／裝置實測處理混合輸入；不要把所有桌面元件無條件放大。
- **驗收條件：**在承諾的觸控模式下，實際 bounding box 或明確無重疊 hit area 達 44×44 CSS px；至少覆蓋 segmented、chip、brand、minimized tab、icon button 與 close。另獨立驗 WCAG 2.5.8 的 24px 及例外條件。

#### UI-22

**用同一份導航幾何計算內容、選單與捲動邊緣**

**優先級：P1｜證據：程式碼不一致；實機影響待驗｜範圍：Navbar／safe area／內容預留**

- **位置：**[bundle.css][code-css] L84–85、L340、L375–391、L809–812；[previews_body.py][code-previews] L631–647。
- **問題與影響：**Navbar 外距包含 safe-area，粗指標 island 高度變成 54px；但 content-top 仍由 42px 導出 68px，scroll-edge 與 menu top 也依賴 42px，未一致涵蓋安全區。手機展示 padding-top:60px 已小於 8＋54px。來源碼的不一致已確認，但尚未在瀏海手機、旋轉或鍵盤開啟時重現遮擋。
- **核心概念：**C3／C6：固定導航與內容是同一個版面契約，不能各自猜另一方高度。
- **建議修正：**建立 shared navbar block-size／offset／safe-area 變數，或由實際量測回寫 layout token；content reservation、scroll-padding、scroll-edge、menu anchor 共用。分清視窗固定與 contained 模式，鍵盤可視範圍也使用同一邏輯。
- **驗收條件：**真實 iPhone Safari／Android Chrome、橫向、放大文字、各 density、鍵盤開關時，首個內容與焦點不被導航遮擋；選單緊接其觸發來源；safe-area 不重複加算。

#### UI-23

**統一 Navbar 與 TabBar 判斷可用空間的上下文**

**優先級：P2｜證據：程式碼確認＋條件性風險｜範圍：嵌入式布局／斷點**

- **位置：**[bundle.css][code-css] 的 navbar @container 規則與 L453 附近 TabBar @media；[響應式規範][doc-responsive]。
- **問題與影響：**Navbar 依容器寬度收合，TabBar 預設依 viewport 寬度隱藏。若 App 嵌在寬螢幕內的窄欄，而 contained 等旗標沒有同步設定，可能出現 navbar 已收起、tabbar 卻仍按大視窗隱藏的組合。全寬頁面不一定受影響；文件雖提到兩種查詢，缺少可直接使用的共享上下文。
- **核心概念：**C3：決定響應式的是元件實際可用空間，任務替代入口要與原入口一起切換。
- **建議修正：**讓 AppShell 提供同一 navigation mode，或以一致的容器查詢契約管理兩者；提供 full-page 與 embedded pane 兩份最小整合例。
- **驗收條件：**在 1440px viewport 內嵌 390／600px app、雙欄 split view 與一般全頁時，都存在且可辨識完整主導覽，不會同時消失或重複兩套相衝突入口。

#### UI-24

**為縮小後的主導覽提供明確展開操作**

**優先級：P2｜證據：程式碼確認；觸控結果待驗｜範圍：TabBar minimize**

- **位置：**[bundle.css][code-css] L446–452；[bundle.js][code-js] L557–595。
- **問題與影響：**縮小時非 current 目的地被 display:none；目前可由反向捲動或 focusin 恢復。缺少專用展開控制與第一次 activation 的契約。一般點擊可能先 focus 而展開，因此不能斷言點擊一定無效；但同次點擊仍可能執行 current link 的預設導航，觸控行為需實測。
- **核心概念：**C3／C4：省下畫面空間不應要求使用者猜出如何找回主導覽。
- **建議修正：**預設可只縮小容器而保留所有目的地圖示；若需要只剩 current，提供真正的展開 button 與 aria-expanded／aria-controls，分離展開和導航。允許產品關閉 minimize。
- **驗收條件：**iPhone Safari 與 Android Chrome 捲到長內容底部後，不必先反向捲動就能切換任一主目的地；鍵盤及觸控可理解展開狀態；不能把桌面 focusin 成功當成手機已通過。

#### UI-25

**補齊 role=menu 所承諾的鍵盤與焦點行為**

**優先級：P1｜證據：程式碼確認｜範圍：Menu／GlassPanel**

- **位置：**[bundle.js][code-js] L511–554；[React adapter][code-react] L344–377；[GlassPanel 規範][doc-panel]。
- **問題與影響：**GlassPanel 有開關、Escape、外點關閉與來源位置，卻在 show 時不移焦，也未實作選單上下鍵導覽；React Menu 宣告 role=menu，部分 trigger 範例未帶 aria-haspopup。視覺和 ARIA 都告訴使用者這是選單，實際卻主要仍是一般 DOM Tab 序列。
- **核心概念：**C4：外觀、語義和鍵盤行為必須是同一個元件。
- **建議修正：**將 generic panel 與 action menu 的行為分開。Menu 採 APG menu-button 的開啟移焦、項目導航、Escape 回焦與 Tab 離開策略；Home/End／字元導覽依規格選用。一般網站導航 disclosure 保留 nav/list/link，不為了外觀強套 menu role。
- **驗收條件：**Enter／Space 開啟後焦點到適當項目；方向鍵操作一致；Escape 回來源；Tab 合理離開並關閉。disabled 項策略明確，隱藏項不留在序列；以 APG 作實作參考，不將其所有 optional 行為誤列 WCAG 強制項。

#### UI-26

**讓 aria-disabled 的選單項目確實不能啟動動作**

**優先級：P1｜證據：程式碼確認；需有消費端 handler 才觸發影響｜範圍：Menu.Item 停用狀態**

- **位置：**[bundle.css][code-css] L582–586；[bundle.js][code-js] L529–542；[React Menu.Item][code-react] L363–377。
- **問題與影響：**aria-disabled 目前主要改透明度與游標，Menu 控制器沒有 activation guard。原生 HTML button 的 disabled 本可阻止啟動，但目前 adapter 型別未提供明確 disabled API；aria-disabled 本身不會阻止事件；若使用者按現有模式綁 onClick 而未自行 guard，停用項仍可能執行。這不是宣稱展示頁已發生刪除事故。
- **核心概念：**C4：停用的視覺承諾必須等同於不可執行，而不是只看起來淡一點。
- **建議修正：**建立明確 disabled API，對 pointer、Enter、Space 與程式合成的 activation 採一致防護；需要保留可發現性時可用 aria-disabled＋guard。停用項不觸發正常 hover／pressed 反饋；不要只靠 pointer-events:none。
- **驗收條件：**以帶計數器的項目驗證：停用時三種輸入皆不執行 handler，啟用後正常；button 與 link 兩種 rendering 都有規則；與 UI-25 的焦點策略一致。

#### UI-27

**修復工具列在隱藏或停用項目變動後的 Tab 入口**

**優先級：P1｜證據：程式碼確認｜範圍：Toolbar 動態可用性**

- **位置：**[bundle.js][code-js] L409–445；[Toolbar 規範][doc-toolbar]。
- **問題與影響：**Roving tabindex 初始化以當時可見、非原生 disabled 的按鈕選一個 tabindex=0，後續主要靠 keydown／focusin 更新。若唯一入口被 hidden／disabled，或整組在隱藏 dialog 中初始化，可能留下所有項目 tabindex=-1，顯示時沒有自動修復。現有一般工具列的左右鍵功能應保留。
- **核心概念：**C4／C6：功能可用性變動不能切斷整組鍵盤操作路徑。
- **建議修正：**提供 refresh／動態集合更新契約；保持合法的 last focused 與 fallback。開啟隱藏容器、增刪項目、切換 disabled 時刷新。aria-disabled 項是否可聚焦是可選的可發現性策略，不必一律剔除。
- **驗收條件：**停用或移除目前 tabindex=0 項後，下一次 Tab 仍能進入工具列；隱藏 dialog 中 init 後再開啟也可操作；一個工具列只有一個預期 Tab 入口，方向鍵不進入 hidden、已移除或原生 disabled 節點；aria-disabled 項依文件化的可發現性策略處理。

#### UI-28

**分開拖曳預覽、提交與取消**

**優先級：P2｜證據：程式碼確認；行為需定義｜範圍：SegmentedControl 拖曳**

- **位置：**[bundle.js][code-js] L358–381；[SegmentedControl 規範][doc-segmented]。
- **問題與影響：**pointermove 已以 emit=true 切換選項，pointercancel 又與 pointerup 共用提交流程，沒有回復起始值。即時切換畫面可以是合理設計，但取消手勢是否也要保留切換、是否可觸發載入等副作用，現在未明定。
- **核心概念：**C4：使用者取消一個手勢，應得到可理解的結果；預覽不應偷偷等同於最後提交。
- **建議修正：**記錄起始選項；定義 onPreview／onCommit 或等價契約。一般選擇可在 up 提交一次，cancel 回復；如果採即時預覽，清楚定義取消與副作用邊界。不把 segmented 用於不可逆交易。
- **驗收條件：**拖到另一項後 pointercancel 的值與事件序列符合文件；正常 tap／drag/up 沒有重複提交；垂直頁面捲動與水平切換衝突時能安全取消。

#### UI-29

**交付完整的 tabs 組合範例與責任邊界**

**優先級：P2｜證據：規範／範例完整性；部分程式碼確認｜範圍：Tabs 與 SegmentedControl**

- **位置：**[bundle.js][code-js] L293–355；[SegmentedControl 規範][doc-segmented]；[React adapter][code-react] L177–228。
- **問題與影響：**核心只負責 trigger、host 負責面板可以成立，不能據此說 tabs 完全無法使用。缺口是沒有一份完整示範 panel IDs、aria-controls、aria-labelledby、內容切換與焦點責任；另外水平控制也攔截 Up／Down，與 APG 水平 tabs 的預期不同。
- **核心概念：**C4／C6：樣式復用可以共用外殼，導航連結、radio 選擇與 tabs 面板仍有不同操作合約。
- **建議修正：**提供 navigation／radiogroup／tabs 三種明確例子。水平 tabs 保留垂直鍵的頁面捲動；本地、無延遲面板可自動啟用，需載入或有較高成本的面板提供手動 activation 選項。寫清 host 與 core 各自責任。
- **驗收條件：**讀屏可辨識 tab 與對應 panel；已啟用 tab 與可見 panel 一致，手動啟用模式允許焦點先移至尚未啟用的 tab，再以 Enter／Space 切換；水平 Up／Down 不被無端吃掉；延遲內容不因路過焦點就反覆發出請求。

#### UI-30

**讓 ListRow 的選取狀態對應合法的角色**

**優先級：P1｜證據：程式碼確認｜範圍：ListRow 語義**

- **位置：**[React adapter][code-react] L623–626；[previews_body.py][code-previews] L468 附近。
- **問題與影響：**預設 button／div 可帶 aria-selected，但這不是這些預設角色的適用狀態。消費端可以覆寫 role，不代表 API 預設就提供正確語義；若改成 option 又缺少 listbox 的整組鍵盤行為，也只是轉移問題。
- **核心概念：**C4：輔助工具得到的角色與狀態，應描述使用者實際在做什麼。
- **建議修正：**依任務選模式：切換按鈕用 aria-pressed；互斥值用原生 radio／完整 radiogroup；選取集合採完整 listbox／option；導航用 aria-current。把 selected 視覺與語義分開，提供明確 variant 或可組合範例。
- **驗收條件：**各種模式的 DOM role／state 合法，鍵盤合約完整，讀屏能理解目前選取；預設範例沒有孤立的 aria-selected button/div。

#### UI-31

**用真正的外部命中判定關閉 sheet**

**優先級：P2｜證據：程式碼推導風險；未重現｜範圍：Sheet 背景點擊**

- **位置：**[bundle.js][code-js] L485 附近；[bundle.css][code-css] L613–650。
- **問題與影響：**目前把 event.target===dialog 視為 backdrop 點擊。dialog 自身在 grabber 周圍或 full-sheet safe-area 可能也有可見空白；該區若成為事件 target，可能被誤當外部。這不是指所有 header/body padding 都會觸發，也尚未經瀏覽器重現。
- **核心概念：**C4：點容器內的空白應與點外部背景有清楚、可預測的界線。
- **建議修正：**採實際 hit-test／明確 surface wrapper，將可見 sheet 內部與 backdrop 分開；若使用座標，要考慮圓角外的點本來就是外部。避免將拖曳後的 pointerup 當成新的外點點擊。
- **驗收條件：**在可見圓角輪廓內的 grabber 兩側與 safe-area 點擊不關閉；真正外部點擊依 dismissOnBackdrop 決定；拖曳從內到外與 Esc 各自符合關閉策略。先重現再選最小修正。

#### UI-32

**為未完成工作提供一致的離開與草稿策略**

**優先級：P2｜證據：能力／組合規格缺口｜範圍：有草稿的 Dialog／Sheet**

- **位置：**[bundle.js][code-js] L460–507；[Modal 規範][doc-modal]；[React Modal][code-react]。
- **問題與影響：**目前有 dismissOnBackdrop，但它本來就只針對背景點擊；onClose 通知發生在關閉之後。尚無跨 Esc、close button、外點與導航的統一 beforeClose／closeReason／草稿策略。這是表單組合能力的缺口，不能推定現有展示已遺失真實資料。
- **核心概念：**C2／C4：使用者應能放心探索，也知道未完成輸入會如何處理。
- **建議修正：**由產品選擇自動保留草稿、可復原退出或必要時確認；元件提供可取消的 close request 與原因。避免每次關閉都跳確認，亦不要把 dismissOnBackdrop 偷改成所有關閉方式的總開關。
- **驗收條件：**有未儲存輸入時，Esc、關閉按鈕、外點與路由離開遵守同一份政策；取消退出後保留文字、選取與焦點；沒有更動的關閉不增加無意義步驟。

#### UI-33

**定義同時開啟多個浮層時誰先關閉**

**優先級：P2｜證據：條件性組合風險｜範圍：多層 Overlay／Escape**

- **位置：**[bundle.js][code-js] L239–247、L534–542 及 Modal 控制器。
- **問題與影響：**Navbar panel、GlassPanel 等各自監聽 document Escape；若 host 允許多層同時開啟，單一 Escape 可能被多個控制器處理。若 host 保證互斥，風險可被避免；不能只憑多個 listener 就宣稱焦點已實際跳錯。
- **核心概念：**C4／C6：離開操作需要一個清楚的作用範圍與順序。
- **建議修正：**選擇並文件化 overlay stack 或互斥開啟政策；最上層處理 Escape，並由該層負責回焦。讓 native modal top layer、menu 與 popover 的優先序一致，避免各自推算。
- **驗收條件：**menu 開在 modal 中、popover 再開子面板等支持的組合，一次 Escape 只關閉預期一層，焦點回到仍存在且可操作的來源；未支持的巢狀組合要明確阻止。

#### UI-34

**依操作後果選擇確認方式，取消一律禁止 dialog 的規則**

**優先級：P2｜證據：設計規範需修正｜範圍：破壞性操作確認**

- **位置：**[Modal 規範][doc-modal] L9；[GlassPanel 規範][doc-panel] L54；[反模式][doc-antipatterns] L54；[Apple 對照][doc-apple] L85。
- **問題與影響：**現有規範把破壞性操作固定成選單內 inline confirmation，並禁止另開 dialog。來源關係清楚是好原則，但移出一張可復原圖片、永久刪除資產、刪除整個專案所需說明與注意力不同；不能由同一種外觀決定全部流程。
- **核心概念：**C2：確認的強度應與可復原性、影響範圍和理解成本成比例。
- **建議修正：**可復原的小操作優先即時完成＋Undo 或簡短 inline confirmation；高影響、後果複雜的動作允許 modal confirmation，說清對象、數量、影響與取消方式。保持來源脈絡，不一律要求輸入名稱確認。
- **驗收條件：**文件至少提供移出 show、永久刪除資產、刪除專案三種策略；Undo 的期限與恢復範圍明確；設計規範與人工審查不再一律排斥合適的 modal。

### D｜任務控制、可學習性與回饋

#### UI-35

**把助理指令輸入與站內搜尋區分清楚**

**優先級：P2｜證據：程式碼確認｜範圍：Assistant Composer 語義**

- **位置：**[React adapter][code-react] L271–293；[previews_body.py][code-previews] L61 起；[Toolbar 規範][doc-toolbar]。
- **問題與影響：**用來輸入助理指令的 composer form 宣告 role=search。範例語意是對專案／選取內容下指令，並非單純搜尋；這使 landmark 與功能名稱不一致，也容易讓視覺與互動規格把 Search 與 Assistant 混為一談。
- **核心概念：**C2／C4：控制項的名稱、位置與語義都應說清這次操作會影響什麼。
- **建議修正：**為 Search 與 Assistant 分開 pattern。搜尋可用 search landmark；助理使用有明確名稱的 form／region，標出作用範圍與送出動作。使用者應理解 scope，且能透過素材選取或明確入口改變它；chip 可以只是反映外部選取的狀態，不必另做一套範圍編輯器。
- **驗收條件：**讀屏 landmark 清單不把助理誤報成搜尋；使用者能說出指令對目前素材、專案或全部內容哪個範圍生效；視覺標籤與提交資料相符。

#### UI-36

**只顯示真的有註冊且適用於平台的快捷鍵**

**優先級：P2｜證據：規範與實作不一致｜範圍：⌘K／快捷鍵提示**

- **位置：**[Toolbar 規範][doc-toolbar] L68、L82；[React adapter][code-react] L271–288；[bundle.js][code-js]。
- **問題與影響：**文件描述 ⌘K 聚焦 composer，預覽與 React 預設也顯示提示，但隨附 runtime 沒有對應全域 binding。使用者仍可點擊／Tab 進入，故不是功能完全不可達；問題是顯示了承諾卻沒有執行責任與平台規則。
- **核心概念：**C4／C6：介面顯示的每一個操作承諾都必須有實際行為或明確 host 合約。
- **建議修正：**可由 host 註冊 shortcut，但 API 應在已註冊時才顯示提示；支援平台化 Cmd／Ctrl，避開瀏覽器與可編輯欄位衝突。把 shortcut registry 或整合範例寫清楚。
- **驗收條件：**提示存在時按鍵能聚焦正確 composer，焦點樣式可見；未註冊時不顯示；多個 composer 的作用域明確，輸入文字與使用輸入法時不被無故攔截。

#### UI-37

**補齊送出、進行中、失敗與重試的工作流程**

**優先級：P2｜證據：設計／整合規格缺口｜範圍：Composer 非同步任務**

- **位置：**[React Composer][code-react] L271–293；[Toolbar 規範][doc-toolbar]；[ShowcaseDesktop][doc-desktop]。
- **問題與影響：**目前 composer 主要提供單行值、空白時停用與 submit callback；沒有交付 pending、重複提交、取消、失敗重試、草稿保留或 scope 變動時的完整參考行為。host 可以自行實作，因此應列為 pattern 缺口，不是已證實重複發出請求。
- **核心概念：**C2／C4：送出只是任務開始，設計必須讓使用者知道系統是否收到、目前在做什麼、失敗後如何繼續。
- **建議修正：**定義 host-owned async state 與最小 UI 契約：立即確認收到、可辨識 pending、合理的停止／重試、錯誤說明、保留可修正輸入。送出時記錄作用範圍，避免等待期間切換素材後混淆結果歸屬。依內容需要支援多行與清楚送出方式。
- **驗收條件：**慢速、失敗、取消、重試、重複 activation、送出後切換素材等案例結果可預測；不遺失草稿，不以 toast 作唯一錯誤紀錄；無障礙狀態通知適量且不搶焦點。

#### UI-38

**明確決定 Scrubber 是進度顯示還是可操作時間控制**

**優先級：P2｜證據：程式碼確認；元件定位需決定｜範圍：Scrubber**

- **位置：**[React adapter][code-react] L255–262；[React types][code-react-types] L167–169；[bundle.css][code-css] L481 附近。
- **問題與影響：**Scrubber 目前以 span 呈現進度、接受 0–100 value，CSS 卻給 pointer cursor。沒有滑動、鍵盤或 value text 的完整控制合約。這會造成可點擊的視覺暗示，但也不能假設專案已承諾完整影片播放器。
- **核心概念：**C4：可供性應與能力一致；看起來能拖曳的控制應真的能被操作。
- **建議修正：**若只是狀態顯示，改名為 progress／timeline indicator，移除誤導游標並給適當語義；若可 seek，優先用原生 range 或完整 slider pattern，支援 min/max、步進、時間描述、preview／commit 與觸控。
- **驗收條件：**使用者看到的互動線索與實際能力相同；可操作版本可用方向鍵、Home/End、pointer／touch 調整，讀屏能聽到時間值；不可操作版本不假裝可點。

#### UI-39

**讓一般使用者也能辨識圖示功能**

**優先級：P2｜證據：設計規範缺口｜範圍：Icon-only 控制／Tooltip**

- **位置：**[無障礙規範][doc-a11y] L12；[Toolbar 規範][doc-toolbar]；[GlassPanel 規範][doc-panel]；[audit.py][code-audit]。
- **問題與影響：**aria-label 與 title 已有價值，但不能等同於所有視覺使用者都能取得名稱。原生 title 在鍵盤與觸控上的可用方式不一致；目前沒有可共用的 tooltip／可見標籤策略。讓想看文字的人改用讀屏，並不能解決日常可學習性。
- **核心概念：**C2／C5：降低畫面噪音時，也要保留足夠的功能線索。
- **建議修正：**為熟悉、常用操作保留 icon-only；陌生、低頻、高後果操作直接帶文字。提供 hover 與 keyboard focus 可見、Escape 可關閉的 tooltip，保持 accessible name；觸控以可見標籤或不觸發動作的說明入口處理。
- **驗收條件：**新使用者不靠試錯就能辨識主要動作；聚焦可取得名稱與有效 shortcut；tooltip 不遮住必要內容且符合可關閉／可持續／可移入條件；手機有可理解的替代方式。

#### UI-40

**把通知放在目前操作脈絡，並保留重要結果**

**優先級：P2｜證據：程式碼確認＋情境風險｜範圍：Toast／操作回饋**

- **位置：**[bundle.js][code-js] L598–618；[Modal 規範][doc-modal]；[React adapter][code-react] 的 toast export。
- **問題與影響：**toast 預設掛在 body，而 native modal 位於 top layer；modal 期間的回饋可能出現在背景或無法被適當宣讀。API 已有 root 選項，因此不是完全不支持 modal 內通知。另預設 2800ms 與單一訊息覆寫策略不適合承擔所有重要結果。
- **核心概念：**C4／C5：回饋應出現在使用者正在工作的地方，重要資訊不應只短暫閃過。
- **建議修正：**提供 active dialog scope 或明確的 root 使用範例，定義訊息替換／排隊／去重策略；簡短成功可用 toast，錯誤與需行動結果保留在原內容。針對可互動 Undo 另設足夠時間與持續入口。
- **驗收條件：**在 modal 內完成操作時，訊息可見且讀屏可感知；關閉後 scope 正確清理；連續訊息不吞掉重要結果；不依賴更高 z-index 穿越 native top layer。

### E｜Claude Design React adapter 與生命週期

**適用範圍：**UI-41～45 主要針對 Claude Design adapter；它們不代表 core 已承諾正式 React／SSR 支援。UI-46 同時涉及 core 的資源生命週期。

#### UI-41

**讓 React 更新後的 callback 與選項確實生效**

**優先級：P2｜證據：程式碼確認；限 Claude Design adapter｜範圍：React 控制器 options**

- **位置：**[React adapter][code-react] L16–29；Modal 等 useController 使用處；[React package 定位][code-react-package]。
- **問題與影響：**useController 初始化時捕捉 options；latest ref 雖更新，已建立的 controller 並未讀取新值。若 props 改變 callback 或 dismissOnBackdrop，現有 instance 可能仍使用初始行為。這是 Claude Design adapter 的問題，不等於無框架 core 承諾支援 React props 卻失效。
- **核心概念：**C4／C6：使用者看到的新狀態，應對應新的操作規則。
- **建議修正：**以 stable callback proxy 讀最新 props，並提供 updateOptions 或必要時安全重建。分清 immutable init options 與 reactive options，避免每次 render 盲目重建控制器。
- **驗收條件：**rerender 換 callback 後只呼叫新 callback；dismissOnBackdrop true→false→true 行為同步；不重複綁 listener、不丟焦點。若正式產品直接使用此 adapter，將本項升為 P1。

#### UI-42

**兌現 SegmentedControl 的受控狀態契約**

**優先級：P2｜證據：程式碼確認；限 Claude Design adapter｜範圍：React controlled state**

- **位置：**[React adapter][code-react] L177–228；[React types][code-react-types] 的 controlled index；[bundle.js][code-js] 的 select。
- **問題與影響：**core 先直接改 DOM 選取，React 只在 index prop 變更時同步。當 host 維持 index=0、拒絕一次變更時，prop 沒變就可能不觸發同步，畫面卻已停在其他項。types 明稱 index 為 controlled，所以這是具體契約不一致。Modal.open 則應另外明定是受控還是命令式同步，不能直接當同一個已證實 bug。
- **核心概念：**C4／C6：資料、視覺與輔助語義必須指向同一個真實狀態。
- **建議修正：**受控模式只提出變更請求，由 prop 決定已提交狀態；非受控模式才自行管理值。拖曳預覽可獨立，必須能回復。明確區分 defaultIndex／index 與 defaultOpen／open 或其他 API。
- **驗收條件：**host 不更新 prop、延遲更新、拒絕更新、外部重設時，thumb、aria-selected／checked 與資料一致；普通非受控用法仍正常。正式採用 adapter 時升 P1。

#### UI-43

**使用穩定 value，不用顯示文字當資料身份**

**優先級：P2｜證據：程式碼確認；限 Claude Design adapter｜範圍：SegmentedControl value**

- **位置：**[React adapter][code-react] L207–220；[bundle.js][code-js] L325 附近；[React types][code-react-types]。
- **問題與影響：**item.value 被用作 React key，但未輸出 data-value；core 缺少 data-value 時回退 textContent。帶 badge 或切換語系會改變回傳值，例如 value:'grid'、label:'格狀'、badge:3 可能回傳『格狀3』。
- **核心概念：**C6：介面文字可以翻譯，業務值不能跟著文字改名。
- **建議修正：**先明確輸出 data-value={it.value}，保留既有 callback 與 index-controlled API，使回傳值不依賴文字。若未來另增 value-controlled 模式，作為相容的後續演進處理，不把公共 API 遷移當成本項必要修復。
- **驗收條件：**更換 label、語系或 badge 後 callback 仍回傳 grid；重排不改 item 身份；宣告型別與實際事件 payload 相同。正式採用 adapter 時升 P1。

#### UI-44

**在選項增刪與重排後更新控制器集合**

**優先級：P2｜證據：程式碼確認；限 Claude Design adapter｜範圍：動態 SegmentedControl items**

- **位置：**[bundle.js][code-js] L293 起；[React adapter][code-react] L177–228。
- **問題與影響：**控制器初始化時 snapshot items，React 後續新增、刪除或重排時沒有刷新。這會使控制器持有舊節點／舊順序；實際影響取決消費端是否使用動態列表，不能概括所有靜態預覽都錯。
- **核心概念：**C4／C6：選項集合改變後，操作身份、鍵盤順序與視覺位置仍須一致。
- **建議修正：**提供 refreshItems 或受控重建，使用 stable value 保留有效選取和焦點；選取被移除時採文件化 fallback。與 UI-43 一起處理，避免只修 index。
- **驗收條件：**選中第二項後移除第一項、刪除當前項、重排、追加項目，thumb、回傳值、Tab 入口與箭頭順序都對應目前 DOM；焦點不落在已移除節點。

#### UI-45

**合併 helper 與 error 描述，避免互相覆蓋**

**優先級：P2｜證據：程式碼確認；限 Claude Design adapter｜範圍：TextField 描述與錯誤**

- **位置：**[React adapter][code-react] L676–689；[React types][code-react-types] 的 TextField。
- **問題與影響：**TextField 先寫 error 的 aria-describedby，再 spread rest；host 同時提供 helper 的 aria-describedby 時，會覆蓋錯誤 ID。沒有外部描述時 error 關聯本來是正確的，問題只在常見的 helper＋error 組合。multiline 的 textarea props／ref 型別也需要同步檢查。
- **核心概念：**C5／C6：錯誤要連回原欄位，既有提示不應因此消失。
- **建議修正：**合併去重描述 IDs，明確決定 aria-invalid 的覆寫責任；以 input／textarea 分支提供準確型別與 ref，保留外部 label／name。
- **驗收條件：**同時 helper/error 時讀屏可取得兩者；error 清除後只留下 helper；外部 props 不意外取消必要語義；單行與多行 ref 都指向實際元素。

#### UI-46

**讓卸載與 destroy 完整釋放各自擁有的資源**

**優先級：P2｜證據：程式碼確認的可靠性風險；未量測洩漏｜範圍：Core／React 生命週期**

- **位置：**[bundle.js][code-js] L160–191、L460–507；[React adapter][code-react] L55–58。
- **問題與影響：**Modal.destroy 沒有覆蓋 open 狀態下 onClose 所做的全部 observer／resize 清理；refraction 停用、快取與最終銷毀的 ownership 尚未完整區分；Root 的 init 也未明確統一 disposal。這些是整合風險，並非已量測到記憶體洩漏或掉幀。
- **核心概念：**C6：設計系統要能支撐長時間工作的 SPA，不能只在第一次掛載時看起來正確。
- **建議修正：**定義 root-owned 全域服務與 per-instance 資源；destroy 在開啟／關閉狀態都可安全重複執行。區分 disable 與 dispose：停用時停止不需要的觀察／工作，可保留有明確管理的快取；節點移除或 root 卸載時 unobserve 並釋放資源。多個 root 共用服務時避免清掉其他 root，也不強制每次 toggle 重建全部 SVG。
- **驗收條件：**開關與掛載卸載 100 次後，以 listener／observer／filter 及執行紀錄確認沒有持續累積；移除 dialog 後 resize 不再量測它；不以一次 heap 變動就武斷判定洩漏。

### F｜規範、驗證與產品邊界

#### UI-47

**分開 Apple 原則、專案風格與真正的可用性門檻**

**優先級：P2｜證據：官方規範核對＋專案規則檢視｜範圍：Apple 對照／設計 lint**

- **位置：**[Apple 對照][doc-apple]；[設計總覽][doc-brand] L88–94；[GlassPanel 規範][doc-panel] L51；[audit.py][code-audit] L49–115；[Apple Menus][A3]。
- **問題與影響：**每個 menu item 必有 icon 的 lint，與目前 Apple HIG『有目的地節制使用，沒有清楚圖示可省略』的指引不一致。英文選單 Title Case 有 HIG 的平台一致性脈絡；擴張成所有 Web 文案的硬性 lint 則是專案選擇。gap≤8 的圓角公式、最多 8 個 blur、bar 的 accent 數量等屬自訂規則或啟發式，不能把通過它們描述為 Apple 認證或完整 UX 證明。
- **核心概念：**C1／C6：把原則轉成 Web 能力需要判斷，不能讓外觀檢查取代使用者任務。
- **建議修正：**改為三類規則：硬性功能／無障礙門檻、可測的產品設計契約、允許理由化例外的風格偏好。移除 menu icon 一律必需，按邏輯群組維持全有或全無的一致處理，不為湊圖示扭曲語意；英文大小寫尊重品牌與 locale；Apple 對照的 Meets 改成附證據與支援邊界。
- **驗收條件：**無合適圖示的清楚文字選單不再被判錯；合理的文字標籤與響應式例外可通過 review；每個 Apple 映射都有具體出處與實際證據，不用 z-index 層數證明資訊架構清楚。

#### UI-48

**讓驗證從固定樣張延伸到真實操作契約**

**優先級：P2｜證據：驗證範圍確認｜範圍：測試／CI／效能**

- **位置：**[check_contrast.py][code-contrast-check]；[audit.py][code-audit]；[interact.py][code-interact]；[CI 範本][code-ci]；[CONTRIBUTING][doc-contributing]。
- **問題與影響：**既有數值與 Chromium 展示測試有用，但未覆蓋本報告的 menu keyboard、disabled menu、動態 toolbar、React rerender、pointercancel 等風險。audit 主要看 dark；8 個 blur 是自訂預算，沒有實測裝置性能證據。CI 檔位於 tools/ci/check.yml，是待安裝範本，不在 GitHub 自動辨識的 workflows 位置。
- **核心概念：**C6：驗證要能指出使用者在哪個任務會失敗，測試數量本身不是完成定義。
- **建議修正：**優先為 P1 補能先失敗的行為／狀態測試；把外觀 lint 與行為、對比、AT／裝置驗證分開。若要 GitHub CI，自行啟用正式 workflow 並確認依賴。以代表裝置量測玻璃層面積、捲動、動畫與輸入反應，依結果調整預算，不直接許諾固定 FPS。
- **驗收條件：**每個已修 P1 有可追溯回歸證據；Chromium／WebKit／Firefox 自動測試與真正 Safari／手機實測分列；說明未覆蓋項。不得把原有 81 個判斷或本次未執行的 make check 寫成已通過。

#### UI-49

**用真實與困難內容測試材質，而不只用柔和漸層**

**優先級：P2｜證據：範例內容範圍確認｜範圍：視覺驗收資料**

- **位置：**[previews_head.py][code-preview-head] L55–73；[React Stage preview][code-stage-preview]；[previews_body.py][code-previews]。
- **問題與影響：**柔和 light-field 漸層很適合比較材質，卻無法代表白底文件、繁中長文、密集線條、不同長寬比照片與快速變動影片。現在不能從理想素材推定任意內容下都具有相同清晰度，也不能反過來宣稱真照片已被證明不可用。
- **核心概念：**C1／C5／C6：材質應在使用者的內容上成立，展示背景只是一種測試條件。
- **建議修正：**保留 gradient baseline，增加可合法使用的真照片、亮白文件、密集表格、四角比例測試圖、黑白／彩色網格、長檔名與影片。每個 fixture 指向特定驗證目的，如對比、裁切、焦點、scrim 或動態性能。
- **驗收條件：**主要 composition 至少在亮、暗、高頻、長文與不同媒體比例下做目視／互動 review；留下 theme、viewport、瀏覽器與結果；未驗證條件不標 Meets。

#### UI-50

**把可重用設計系統的邊界寫清楚，再擴大適用產品**

**優先級：P3｜證據：支援範圍建議｜範圍：v1 定位／消費端契約**

- **位置：**[README][doc-root]；[設計總覽][doc-brand]；[React package][code-react-package]；[React adapter][code-react] L1–8；[bundle.js][code-js] L6–7。
- **問題與影響：**完整 composition 主要是 Lumen 媒體工作站；對一般 Web App 的表單、搜尋結果與設定流程還缺少同等完整參考。React adapter 已明示 Claude Design 用途，且 import 會碰 document，不能把它當成已宣稱的 SSR 套件後再判定現有 SSR 功能壞掉。
- **核心概念：**C6：讓下游知道哪些可直接使用、哪些是示範、哪些仍需產品決策。
- **建議修正：**先定義 v1：無框架 runtime 支援哪些模式、Claude Design adapter 的用途、已驗證平台與未包含能力。以既有元件補一個設定表單、一個搜尋／列表與一個流動媒體工作區。若未來要正式 React／SSR，另設 client entry、hydration、套件與受控狀態契約。
- **驗收條件：**Claude Code 不會把 prototype adapter 誤當 production-ready 通用套件；文件清楚列出 host 責任與非目標；未實作支援不宣稱已具備，也不因此要求現在重寫整個技術架構。

## 七、建議實作順序與依賴

### 7.1 分批交付

| 批次 | 要交付的結果 | 主要項目 | 依賴與避免事項 |
| --- | --- | --- | --- |
| 0：固定契約 | 保留現有基準，定義支援範圍、主題門檻、Menu／tabs／受控狀態責任；建立 issue 對照 | UI-47、UI-48、UI-50 的規格部分 | 這是小範圍整理，不能變成延後 P1 的長期重構 |
| 1：可讀且可操作的元件 | 狀態配色、可辨識素材狀態、正確 Menu／Toolbar／ListRow、觸控目標 | UI-12、13、14、16、21、25、26、27、30；連動 UI-15、17、19 | 每類用最小失敗案例驗證；不先做整體視覺換皮 |
| 2：完整響應式工作區 | 同一份 fluid AppShell、手機功能映射、導航與 safe-area、清楚任務範圍 | UI-01、02、22；連動 UI-03、04、05、06、07、23、24 | 以真實內容決定斷點，不把目前 744／1100 視為不可改的 Apple 常數 |
| 3：完整任務與內容呈現 | 媒體保真、overlay／草稿、Composer、快捷鍵、Scrubber、Tooltip／Toast | UI-08、09、10、11、28、29、31、32、33、34、35、36、37、38、39、40 | 先定義 preview／commit／cancel 與作用範圍，再接動畫與材質；高風險推論先重現 |
| 4：Adapter 可靠性 | options 更新、controlled state、stable value、動態 items、表單描述、dispose | UI-41、42、43、44、45、46 | 正式產品若直接依賴 adapter，相關部分提前到第 1 批；保留相容 API，避免藉修 bug 全面遷移 |
| 5：主題與驗證收斂 | solid／contrast 承諾、真實內容 fixtures、正式 workflow、支援矩陣與品牌擴充邊界 | UI-18、20、47、48、49、50；回查 UI-19 | 不用只通過 lint 宣告完成；實際啟用 CI 與真機／AT 結果分開記錄 |

批次不是一次大型 PR。建議每個 PR 對應一個可獨立審查的結果，例如「修正三種狀態對比」、「完成 Menu 操作契約」、「交付流動 AppShell」。只要相依元件已穩定，文件、fixtures 與 adapter 可與版面工作並行。

### 7.2 關鍵依賴

- **先分清作用範圍，再決定美術分組：**UI-03／04 決定 UI-05 的主動作與 UI-35／37 的 Composer scope。
- **先有完整 Shell，再調細版面：**UI-01／02／22 是密度、斷點、側欄與 minimize 的共同基礎；避免各 preview 自己補 padding。
- **先有 state table，再選色：**UI-12／13／14 與 UI-18／19 一起避免某主題修好、另一主題退步。
- **先補 Menu 契約，再擴大覆蓋層用途：**UI-25／26 與 UI-31～34 共用焦點、停用及退出規則。
- **先修資料身份，再測動態集合：**UI-43 的 data-value 修正是 UI-44 與 UI-42 穩定測試的重要前提；不用因此放棄既有 index API。

### 7.3 修改來源地圖

| 要改的內容 | 應編輯來源 | 需要同步的交付物 |
| --- | --- | --- |
| 顏色、主題與合成規則 | `tools/palette.py` | 生成 tokens、狀態矩陣、contrast checks |
| 字體、密度、間距、圓角、陰影 tokens | `tools/tokens_build.py` | `design-system/tokens.json` 及實際使用這些 token 的 CSS |
| 元件外觀 | `design-system/components/bundle.css` | guidelines、預覽、相關主題驗收 |
| 元件行為 | `design-system/components/bundle.js` | `index.d.ts`、操作範例、回歸測試 |
| HTML showcase 與 helpers | `tools/previews_body.py`、`tools/previews_head.py` | 生成的 `components/*/preview.html` |
| Claude Design React adapter | `.design-sync/react/src/index.jsx`、`index.d.ts` | 對應 `.design-sync/previews/*.tsx`、conventions 與 adapter 驗證 |
| 設計與支援契約 | `design-system/*.md`、元件 `README.md`、`.design-sync/conventions.md` | Apple 對照、使用範例、Claude Design 整合說明 |
| 驗證 | `tools/check_contrast.py`、`audit.py`、`interact.py` 與需要的 adapter suite | 啟用的 CI、可重現指令、實際結果 |

這份來源地圖以 [CONTRIBUTING][doc-contributing] 為基礎。**不要直接修改 `tokens.json` 或 `preview.html` 當作主要修正**；這些檔案會被下一次生成覆蓋。

## 八、驗收矩陣與完成定義

### 8.1 標準下限與專案目標分開

| 議題 | 標準或參考 | 本專案應採取的驗收方式 |
| --- | --- | --- |
| 一般文字對比 | WCAG 1.4.3 AA 一般文字 4.5:1；符合大字條件可 3:1。[W1] | 現有多數小字採 4.5:1；contrast 主題宣稱的 7:1 是較高產品目標，不能與 AA 混淆 |
| 非文字對比 | WCAG 1.4.11 AA：必要的元件／狀態識別資訊對相鄰色 3:1，需考慮條文例外。[W2] | 檢查必要 input 邊界、選取與控制線索；不要求所有裝飾線都有 3:1 |
| 觸控目標 | WCAG 2.5.8 AA 為 24×24 CSS px 或符合間距等例外；2.5.5 AAA 為 44×44，亦有例外。[Target Size][W6]、[WCAG 2.2][W0] | 保持專案承諾的觸控 44px，量實際 hit area；AA 合規另按條文判斷 |
| 文字放大 | WCAG 1.4.4 AA：在條文適用範圍內放大到 200% 不失內容／功能。[W4] | 驗長名稱、按鈕、對話框標題與 inline error；不以 px 單位本身判失敗 |
| 重排 | WCAG 1.4.10 AA：一般垂直捲動內容在等效 320 CSS px 寬度可重排，必要二維內容有例外。[W3] | 一般頁面不產生雙向捲動；必要舞台／時間軸局部處理，周圍控制仍可用 |
| 文字間距 | WCAG 1.4.12 AA 驗使用者覆寫後不失內容／功能；不是強迫預設採同一間距。[W5] | 測行高 1.5、段距 2em、字距 .12em、詞距 .16em 的適用內容 |
| 鍵盤與焦點 | WCAG 2.1.1、2.4.7、2.4.11 等；2.4.13 的特定 Focus Appearance 指標屬 AAA。[W0] | 所有必要功能可鍵盤操作；焦點可見、不被作者內容完全遮住；更強焦點 ring 可作產品目標 |
| Menu／tabs／dialog | APG 是模式實作指引，並非每個 optional 行為都直接等於 WCAG 強制條款。[Menu][W7]、[Tabs][W8]、[Dialog][W9] | 依宣告角色完成一致的操作、焦點與名稱；記錄所選模式 |
| 狀態通知 | WCAG 4.1.3 AA：適用的狀態訊息可被輔助工具辨識，無需移焦。[W10] | 成功、進度、錯誤依語義通知；避免每次細小更新都打斷使用者 |
| 動畫與偏好 | WCAG 2.3.3 的 interaction animation 屬 AAA；自動持續動畫可能另涉及 A 級條款。[W0] | 保留既有 reduced-motion；分別驗必要回饋、長動畫與停止方式，不能只看 media query 是否存在 |

此表是本次相關要求的檢核方向，不是完整 WCAG 清單。特定條文是否適用，仍需看實際內容與操作結果。

### 8.2 有目的的情境矩陣

| 維度 | 至少覆蓋 | 對應風險 |
| --- | --- | --- |
| 主題 | 六主題；另測 forced-colors、reduced-motion | 狀態配色、solid／contrast 契約、焦點與 motion |
| 寬度 | 320、390、600、743／744、900、1099／1100、1440、1920px | 切點兩側、完整任務與側欄收合 |
| 可用高度 | 短桌面窗、手機橫向、軟鍵盤開啟 | Sheet、Composer、底部導航與 safe-area |
| 容器 | 全頁、寬 viewport 內的窄 app pane | Container 與 media query 不一致 |
| 輸入 | 鍵盤、滑鼠、觸控、混合輸入；RTL | Focus、hit target、drag/cancel、方向規則 |
| 內容 | 白／黑／中灰、高頻圖、真照片、四角比例圖、長檔名、繁中／德文／RTL | 材質對比、截字、crop、密度與局部遮罩 |
| 動態資料 | empty、loading、error、success、disabled、重排、刪除選項、快速連續操作 | 元件契約與資料／視覺同步 |
| 平台 | 宣稱支援的 Chromium／Firefox／WebKit；真實 iPhone Safari／Android Chrome | 自動引擎結果不能替代實際瀏覽器與 OS 行為 |
| 輔助工具 | 至少 VoiceOver＋Safari 與 NVDA＋一個支持的桌面瀏覽器之代表流程 | Landmark、名稱、選取、錯誤、狀態與焦點順序 |

不需要把所有維度做無差別笛卡兒積。P1 的受影響 state／theme 要完整；其餘按風險選代表組合，記錄覆蓋邊界。檢查目的應是解決一個具體剩餘風險。

### 8.3 必須跑完的使用者任務

1. **找到專案並完成匯出：**桌面與手機進入相同專案，切 Picks／Sources，辨識待處理數，檢視 Queue，設定匯出並取得結果。
2. **只用鍵盤操作：**進入工具列、開啟 Menu、選項移動、遇到停用項、關閉回焦；測試項目被隱藏／停用之後仍有入口。
3. **檢視與選取素材：**不同長寬比仍看得懂完整／裁切模式，selected／focus／review status 不混淆；單選與多選行為符合規格。
4. **編輯後離開：**輸入草稿，分別嘗試 Esc、close、外點與路由離開，驗證保存／取消／確認規則；不要每次都額外確認。
5. **送出助理任務：**慢速、錯誤、重試、取消與切換素材都不混淆 scope，輸入不消失，狀態回饋可感知。
6. **React 動態更新：**替換 callback、拒絕 controlled 變更、改 label／badge、增刪 items、helper＋error、掛載卸載，驗證畫面和資料一致。

### 8.4 每個問題的結案條件

- 已改正真正來源檔，生成檔同步，API／型別／文件／範例沒有互相衝突。
- 已確認問題有對應驗證；對程式故障，回歸案例在修正前能失敗、修正後能通過。低影響文案／風格整理不需要為湊數寫測試。
- 視覺建議已在目標尺寸、主題和真實內容下檢視；需要實機／AT 的項目有實際結果，或明確保持待驗狀態。
- 高風險動態行為的焦點、資料、視覺狀態一致；沒有犧牲既有六主題、reduced-motion、RTL、原生 dialog 與內容分層。
- 更新 `5-apple-alignment.md` 時引用具體證據；不以「測試全部綠燈」泛稱所有 Apple 原則或全部無障礙條文都已達成。

## 九、可直接交給 Claude Code 的工作指示

以下文字連同本報告交付即可。報告內的設計建議可在實作時選擇等效方案，但必須保留理由與驗收目標。

```text
請在 yingray/liquid-glass-web 中，依《Liquid Glass Web — UI／UX 與設計系統完整審查報告》分批完成改善。

基準 commit：141f90488e0e6e6774cb82b18e2a4793dbea3b8b。
若目前 HEAD 已更新，先比較差異並重新核對相關條目；不要覆寫後續工作，也不要假設所有問題仍存在。

目標：保留內容優先、glass 用於導航／控制／overlay 的核心方向，
補齊完整響應式 AppShell、狀態可讀性、Web 操作契約與可驗證的整合。

工作順序：
1. 讀 CONTRIBUTING、設計指南、原始碼與本報告。
2. 建立 UI-01～UI-50 的追蹤表：確認／已修／待重現／設計決策／不適用及理由。
3. 依第七章從 P1 開始實作；使用最小、可審查的分批變更，不只停在計畫。
4. 已確認故障先補最小失敗案例；條件性風險先重現；設計建議先確認低保真結構與真實內容。
5. 每批同步更新 docs、types、previews、必要回歸，並記錄實際執行結果。
6. 完成後交付剩餘未驗項、設計取捨與使用者任務驗收結果。

不可破壞：
- opaque content／glass controls 的分工、六主題、原生 dialog、焦點返回、RTL、reduced-motion、forced-colors。
- 不為了更透明而降低目前保護文字的 alpha 下限。
- 不以隱藏 overflow、縮小文字、移除手機功能來讓畫面看起來整齊。
- 不為修復 adapter 而全面重寫框架、公共 API 或整個設計系統。

來源規則：
- 顏色改 tools/palette.py；其他 tokens 改 tools/tokens_build.py。
- HTML preview 改 tools/previews_body.py／previews_head.py。
- 核心改 bundle.css／bundle.js／index.d.ts。
- Claude Design adapter 改 .design-sync/react/src 與對應 previews／conventions。
- 不直接手改 tokens.json 或 preview.html 當作完成。

重要判斷：
- 44px 是本專案觸控目標；WCAG AA 24px／間距例外另行驗證。
- APG 是模式指引，不把所有 optional 行為說成 WCAG 強制。
- Menu icons 不再一律必需；同邏輯群組維持合理一致。
- 單選可選 selection-follows-focus；多選不能因移動焦點無意清掉選取。
- React adapter 目前是 Claude Design 用途，正式 React／SSR 支援需另定範圍。
- UI-43 先補 data-value 並保留既有 index API；不是強制遷移為 value-controlled。
- 本報告沒做成功的視覺／瀏覽器／手機／AT驗證。不能引用為這些檢查已通過。

驗證：
- 使用專案生成流程與既有 make check／make shots，確實具備環境後執行並保留結果。
- 增加針對實際風險的狀態與行為測試，不為湊測試數量複製實作。
- 核心流程覆蓋手機／桌面、鍵盤、六主題與必要真實內容。
- 真機／AT／性能若無條件執行，保持明確待驗，不能只因 lint 成功就結案。
```

## 附錄 A：對比計算與重現方式

### A.1 結果

以下使用固定版本中的宣告色值，依透明度逐層合成後套用相對亮度公式。數值四捨五入到小數二位；判定時使用未四捨五入值。這些是**數學組合結果**，不是瀏覽器像素取樣；漸層位置、控制是否位於 scrim 完整強度區、繪製與動畫過程仍需要額外驗證。[palette.py][code-palette]、[contrast.py][code-contrast-math]、[CSS 狀態][code-css]

| 案例 | 主題 | 合成條件 | 對比 | 判讀 |
| --- | --- | --- | --- | --- |
| Danger button hover | dark | 白底 → thick glass → fill-strong；danger 文字 | **3.50:1** | 低於 4.5 |
| Danger pressed | dark | 白底 → thick glass → fill-pressed；danger 文字 | **2.85:1** | 低於 4.5 |
| Danger button hover | dark-solid | thick glass → fill-strong；danger 文字 | **4.10:1** | 低於 4.5 |
| Danger pressed | dark-solid | thick glass → fill-pressed；danger 文字 | **3.30:1** | 低於 4.5 |
| Danger pressed | light | 黑底 → thick glass → fill-pressed；danger 文字 | **4.32:1** | 低於 4.5 |
| Danger hover／pressed | dark-contrast | thick glass → fill-strong／fill-pressed | **5.79／4.51:1** | 達 4.5，但低於專案 7.0 目標 |
| Media selected label pressed | dark | 黑底 → media-fill → pressed media-glass；stage 前景 | **1.11:1** | 前景與背景接近 |
| Media selected label pressed | dark-solid | 同上，solid tokens | **1.09:1** | 前景與背景接近 |
| Media selected label pressed | dark-contrast | 同上，contrast tokens | **1.00:1** | 前景與背景相同亮度 |
| Timecode small | dark | 白底 → bottom scrim → media-glass；白字 opacity .6 | **4.16:1** | 低於 4.5 |

Menu hover 實際使用 `fill`，不是 `fill-strong`；不能把第一列的按鈕 hover 數值直接稱為 menu hover。Menu pressed 使用 `fill-pressed`，所以仍需覆蓋 danger pressed 的組合。非作用中的 disabled 控制有不同規範考量，本表談的是可操作狀態。

### A.2 最小重現程式

在 repo 根目錄執行以下 Python；它只讀 token，不會修改檔案。這是重現計算的短程式，不是完整元件測試。

```python
import sys
sys.path.insert(0, 'tools')
from palette import COLOR
from contrast import cr, over, parse

WHITE = (255, 255, 255, 1.0)
BLACK = (0, 0, 0, 1.0)

def v(name, theme):
    value = COLOR[name][theme]
    return v(value[1:-1], theme) if value.startswith('{') else value

def ratio(label, fg, bg):
    print(f'{label}: {cr(fg, bg):.6f}:1')

for theme in ('dark', 'dark-solid', 'dark-contrast'):
    thick = over(v('glass-thick', theme), WHITE)
    for state in ('fill-strong', 'fill-pressed'):
        ratio(f'{theme} danger/{state}', v('danger', theme),
              over(v(state, theme), thick))

    # A standalone media segmented control over a black frame.
    # The .lg-stage provides --stage; the control track supplies media-fill.
    track = over(v('media-fill', theme), BLACK)
    pressed_thumb = over(v('media-glass', theme), track)
    ratio(f'{theme} media selected/pressed', v('stage', theme), pressed_thumb)

    scrim = over(v('media-scrim-bottom', theme), WHITE)
    plate = over(v('media-glass', theme), scrim)
    r, g, b, alpha = parse(v('ink-on-media', theme))
    dimmed_text = over((r, g, b, alpha * 0.6), plate)
    ratio(f'{theme} timecode opacity .6', dimmed_text, plate)

theme = 'light'
thick = over(v('glass-thick', theme), BLACK)
ratio('light danger/pressed', v('danger', theme),
      over(v('fill-pressed', theme), thick))
```

### A.3 為什麼 905 項通過仍會有這些結果

`check_contrast.py` 檢查的是它列出的配對。現有 state ground 的部分檢查只測一般 ink，thick pressed 也沒有完整覆蓋 danger；media 檢查沒有反映 selected label 在 pressed thumb 的配對；timecode 的局部 opacity 沒有納入。這說明應補充元件狀態覆蓋，並不表示既有 905 項計算沒有價值。[check_contrast.py][code-contrast-check]

## 附錄 B：來源與檔案覆蓋

### B.1 專案來源

本報告全部專案連結固定到審查 commit，避免 main 後續變更使證據失去對應。行號以該版本為準；Claude Code 開始工作時應重新核對目前 HEAD。

| 範圍 | 主要來源 |
| --- | --- |
| 系統定位與規範 | [README][doc-root]、[設計總覽][doc-brand]、[States][doc-states]、[Responsive][doc-responsive]、[Accessibility][doc-a11y]、[Anti-patterns][doc-antipatterns]、[Apple alignment][doc-apple] |
| 核心 | [bundle.css][code-css]、[bundle.js][code-js]、[核心 types][code-types] |
| Tokens | [palette.py][code-palette]、[tokens_build.py][code-tokens]、[compile_tokens.py][code-compile] |
| 預覽與布局 | [previews_body.py][code-previews]、[previews_head.py][code-preview-head]、[Desktop][doc-desktop]、[Mobile][doc-mobile] |
| 元件規範 | [Navbar][doc-navbar]、[Toolbar][doc-toolbar]、[SegmentedControl][doc-segmented]、[GlassPanel][doc-panel]、[Modal][doc-modal]、[GlassButton][doc-button] |
| React／Claude Design | [Adapter][code-react]、[Types][code-react-types]、[Package][code-react-package]、[Conventions][code-conventions]、[Stage preview][code-stage-preview] |
| 驗證與生成 | [CONTRIBUTING][doc-contributing]、[Makefile][code-make]、[contrast checks][code-contrast-check]、[contrast math][code-contrast-math]、[audit][code-audit]、[interaction][code-interact]、[render][code-render]、[CI 範本][code-ci] |

### B.2 Apple 一手來源

| 編號 | 來源 | 本報告使用範圍 |
| --- | --- | --- |
| A1 | [Adopting Liquid Glass][A1] | 使用者提供的原始參考與專案映射基準；直接頁面有 JavaScript 讀取限制，未將無法完整取得的段落當作已全文核實 |
| A2 | [WWDC25 — Meet Liquid Glass][A2] | 跨平台、內容與控制層、材質與適應方向 |
| A3 | [Human Interface Guidelines — Menus][A3] | 圖示需有目的、同群組一致、英文選單大小寫；頁面列 2026-06-08 更新 menu icons 指引 |
| A4 | [Human Interface Guidelines — Materials][A4] | Regular／Clear 的用途與可讀性考量 |
| A5 | [WWDC26 — Principles of great design][A5] | Hierarchy、秩序、間距、對比的設計方向 |

本報告以 Apple 公開指引作為參照，不代表 Apple 內部設計評審或官方認證。其數值與原生元件行為不能直接當成 Web 的法律或技術合規門檻。

### B.3 W3C 一手來源

| 編號 | 來源 |
| --- | --- |
| W0 | [WCAG 2.2 正式規範][W0] |
| W1 | [Understanding Contrast (Minimum)][W1] |
| W2 | [Understanding Non-text Contrast][W2] |
| W3 | [Understanding Reflow][W3] |
| W4 | [Understanding Resize Text][W4] |
| W5 | [Understanding Text Spacing][W5] |
| W6 | [Understanding Target Size (Minimum)][W6] |
| W7 | [APG Menu Button Pattern][W7] |
| W8 | [APG Tabs Pattern][W8] |
| W9 | [APG Dialog (Modal) Pattern][W9] |
| W10 | [Understanding Status Messages][W10] |

### B.4 實作完成後應補的證據

此報告已提供具體問題與設計方向；仍需由實作階段補上改前／改後截圖、真實操作紀錄、裝置與 AT 結果。尤其是 UI-01、07、09、15、17、22、23、24、31、40、46、48、49，不能只靠來源閱讀或數學計算就宣告視覺、跨裝置或效能已驗收。

文件結束。

[repo]: https://github.com/yingray/liquid-glass-web
[commit]: https://github.com/yingray/liquid-glass-web/commit/141f90488e0e6e6774cb82b18e2a4793dbea3b8b
[doc-root]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/README.md
[doc-contributing]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/CONTRIBUTING.md
[doc-brand]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/README.md
[doc-states]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/1-states.md
[doc-responsive]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/2-responsive.md
[doc-a11y]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/3-accessibility.md
[doc-antipatterns]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/4-anti-patterns.md
[doc-apple]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/5-apple-alignment.md
[doc-navbar]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/FloatingNavbar/README.md
[doc-toolbar]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/Toolbar/README.md
[doc-segmented]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/SegmentedControl/README.md
[doc-panel]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/GlassPanel/README.md
[doc-modal]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/Modal/README.md
[doc-button]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/GlassButton/README.md
[doc-desktop]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/ShowcaseDesktop/README.md
[doc-mobile]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/ShowcaseMobile/README.md
[code-css]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/bundle.css
[code-js]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/bundle.js
[code-types]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/design-system/components/index.d.ts
[code-palette]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/palette.py
[code-tokens]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/tokens_build.py
[code-compile]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/compile_tokens.py
[code-previews]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/previews_body.py
[code-preview-head]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/previews_head.py
[code-contrast-check]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/check_contrast.py
[code-contrast-math]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/contrast.py
[code-audit]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/audit.py
[code-interact]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/interact.py
[code-ci]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/ci/check.yml
[code-render]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/tools/render.py
[code-make]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/Makefile
[code-react]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/.design-sync/react/src/index.jsx
[code-react-types]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/.design-sync/react/src/index.d.ts
[code-react-package]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/.design-sync/react/package.json
[code-conventions]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/.design-sync/conventions.md
[code-stage-preview]: https://github.com/yingray/liquid-glass-web/blob/141f90488e0e6e6774cb82b18e2a4793dbea3b8b/.design-sync/previews/Stage.tsx
[A1]: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
[A2]: https://developer.apple.com/videos/play/wwdc2025/219/
[A3]: https://developer.apple.com/design/human-interface-guidelines/menus
[A4]: https://developer.apple.com/design/human-interface-guidelines/materials
[A5]: https://developer.apple.com/videos/play/wwdc2026/250/
[W0]: https://www.w3.org/TR/WCAG22/
[W1]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
[W2]: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
[W3]: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
[W4]: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
[W5]: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
[W6]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
[W7]: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
[W8]: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
[W9]: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
[W10]: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html

