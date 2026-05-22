## Why

目前 `pull-all` 只看「current branch 對 upstream 的 behind」這一個訊號。實際工作中，「有沒有東西沒上傳」其實是另一個更高頻的問題——可能是當前分支 ahead、可能是 default branch (main/master) 在本機沒推、可能是 working tree dirty。這些訊號散在不同 git 指令裡，沒人想為了確認「有沒有忘記推」逐個 repo 跑一輪。

`pull-all` 既然已經並行掃所有兄弟 repo，把這幾個訊號順手帶出來，就能用同一個指令同時看到「需要 pull」與「需要 push / commit」。

## What Changes

- 在 status 檢查階段，除了現有的 current branch behind，**額外偵測**：
  - current branch ahead（本機領先 upstream 的 commit 數）
  - default branch (main 或 master) 的 ahead / behind
  - working tree dirty（modified + staged，**不**含 untracked）
  - branch 沒 upstream（從未 push 過）的標示
- 輸出格式改為 **B 風格緊湊版**：`⇡N ⇣M` 數字 + `*` (dirty) + `†` (沒 upstream) 角標
- current ≠ default 時，「有事」的兩條 branch 分行列出
- **BREAKING**：dirty + current behind 的 repo **從 pull 名單剔除**（不問也不跑），避免本地未提交工作被攪動。dirty + 其他情況本來就不在 pull 名單，行為不變。
- default branch 的 ahead/behind 是**純資訊**，不觸發 pull（`git pull` 只動 current branch）。
- 邊界處理新增：empty repo (`(empty)`)、detached HEAD (`(HEAD@<sha>)`)、無 default branch (⚠ 警告)。

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `status-check`: 從「只看 current branch 對 upstream 的 behind」擴充為「同時看 current + default branch 的 ahead/behind、dirty bit、無 upstream 標示」，且 pull 詢問改為「current 有 upstream + ⇣>0 + clean」三條件 AND。

## Impact

- **程式碼**：`index.js` 的 `getStatus()` 與 `main()` 的摘要輸出與 pull 名單過濾。新增輔助函式：default branch 偵測、ahead/dirty 偵測、空 repo 判定。
- **行為相容性**：dirty + behind 的 repo 不再被 pull——這對「明知 dirty 還想 pull」的少數 case 是行為改變，但符合「dirty 不能被攪動」的安全前提。其餘 repo 流程完全不變。
- **`.env` / CLI 介面**：不變。無新環境變數、無新子指令。
- **相依**：仍只用 `git`，無新依賴。
- **spec 影響**：`status-check` spec 大幅改寫；`pull-siblings` spec 受連動（pull 名單條件），但變動可以集中在 `status-check` 內描述。
