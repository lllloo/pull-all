## Context

`status-check` 目前只看「current branch 對 upstream 的 behind」這一條訊號。實務上常被遺漏的訊號包含 current branch ahead、default branch (main/master) 的 ahead/behind、working tree dirty——這些散落在不同 git 指令裡，使用者要逐個 repo 跑才能確認「有沒有忘記 push / commit」。`pull-all` 已並行掃所有兄弟 repo，把這些訊號順手帶出去成本極低。

本提案同時要求「dirty 的本機工作絕對不能被 pull 流程攪動」作為安全前提。

## Goals / Non-Goals

**Goals:**
- 每個 repo 顯示 default 與 current 兩條 branch 的 ahead/behind
- 偵測 working tree dirty（modified + staged）並標示
- branch 無 upstream 用 `†` 角標
- dirty + current behind 的 repo **不**進入 pull 名單，dirty 一律不被攪動
- 輸出採緊湊符號（`⇡N ⇣M * †`），雜訊低、可掃讀
- 純加法，CLI 介面與 `.env` 不變

**Non-Goals:**
- 不做跨 branch 全掃（只看 default + current 兩條）
- 不細分 untracked，untracked 完全不算 dirty
- 不處理 stash
- 不對 default branch 做 fast-forward（資訊提示，留給未來的 `sync-default` 提案）
- 不引入新子指令、不改 `.env`、不改 CLI 介面

## Decisions

### 1. ahead 用 `git rev-list <br> --not --remotes --count`，而非 `@{u}..<br>`

**理由**：前者對「從未 push、沒 upstream」的 branch 仍能得出有意義的數字（branch 上不在任何 remote 的所有 commit）；後者會 fatal，必須額外分支邏輯。語意上「不在任何 remote 的 commit 數」剛好就是「沒上傳的 commit 數」。

**替代方案**：對 ahead 也用 `@{u}..<br>`，沒 upstream 時走 fallback。**否決**：邏輯分叉、語意不一致；「無 upstream」這個訊號最強烈，不該被 fallback 吃掉。

### 2. dirty 偵測排除 untracked

指令 `git status --porcelain`，過濾後判定：
- 排除 `??` 開頭的行（untracked）
- 其餘任一行存在 → dirty

**理由**：untracked 雜訊大（build 產物、暫存檔常見），訊號弱；modified + staged 才是「有改、沒提交」的強訊號。一個 bit 已夠用。

**替代方案**：(a) 全部算 dirty；(b) 拆 `*`（modified/staged）與 `?`（untracked）兩個符號。**否決**：(a) 雜訊高；(b) 規則細化先省，需要時再加 `--dirty-detail` flag。

### 3. default branch 偵測順序

1. `git symbolic-ref --short refs/remotes/origin/HEAD` → 拿到例如 `origin/main`，取後段
2. fallback：`git rev-parse --verify --quiet refs/heads/main`
3. fallback：`git rev-parse --verify --quiet refs/heads/master`
4. 都失敗 → 顯示「⚠ 無預設分支」，僅檢查 current

**理由**：`origin/HEAD` 是 git 自家的「預設分支」訊號（git 2.28 以後 clone 會自動設）。舊 clone 沒設時 fallback 兩個常見名字大多可解。

### 4. dirty + behind 從 pull 名單剔除（B 策略）

列入 pull 詢問 ⟺ `current 有 upstream` AND `current ⇣ > 0` AND `working tree clean`。dirty 一律不 pull，跳過時提示「⊘ 跳過 N 個 dirty repo (<names>)」。

**理由**：使用者明訂「本地 dirty 不能有問題」為前提。git 自帶的 dirty 保護不完整——dirty 檔案與 merge 範圍無關時，pull 會 fast-forward「成功」，留下 dirty + 新 commit 混合的 working tree，混淆「我改的 vs 拉下來的」。

**替代方案**：(A) 一視同仁照 pull、(C) 顯示警告但仍 pull。**否決**：與安全前提衝突。

### 5. default branch 純資訊，不 fast-forward

`git pull` 只動 current branch。default branch behind 顯示給使用者看，但本工具不主動更新（如想做 ref-only fast-forward 需 `git fetch origin main:main`，行為差異大，獨立提案處理）。

### 6. detached HEAD 處理

`git symbolic-ref --short HEAD` 失敗 → 視為 detached。branch 欄顯示 `(HEAD@<short-sha>, detached)`，跳過 current 那一層的 ahead/behind/upstream 檢查，仍可顯示 default branch 狀態。

### 7. empty repo 偵測在最前

`git rev-parse --verify --quiet HEAD` 非零 exit → 空 repo。顯示灰色 `(empty)`，跳過 fetch 與所有後續狀態檢查。避免後續所有指令 fatal。

### 8. 顯示策略

- 任一 branch「有事」（⇡⇣ 非零 / dirty / 無 upstream）→ 列出該 branch 一行
- 兩條都沒事 → 只列 default 當代表
- dirty 必標於 current branch 行（working tree 跟當前 checkout 綁）。若 current 本身無事，dirty 強制讓 current 行被列出
- `current == default` → 只列一條

### 9. 跳過 dirty 的提示形式

顯示「⊘ 跳過 N 個 dirty repo」，後接最多 3 個名稱、超過顯示 `+M more`。若 N=0 完全不顯示這行。

## Risks / Trade-offs

- **[行為變更] dirty + behind 不再被 pull**：少數使用者可能依靠 git 自身保護「dirty 也照 pull」 → Mitigation：跳過時明確列出 repo 名與「⊘」符號，使用者知道為何沒動到；README 改動加說明。
- **[偵測失敗] `origin/HEAD` 沒設**：常見於 git < 2.28 clone 的舊 repo → Mitigation：兩層 fallback（main → master），都沒中時清楚 ⚠ 警告但不中斷其他 repo。
- **[效能] git 指令數增加**：每 repo 從 2 個（fetch、rev-list）增加到 4–5 個（+symbolic-ref + default ref rev-list + status --porcelain）→ Mitigation：保持 `Promise.all` 並行；所有指令皆本機操作，預期增幅可忽略。
- **[視覺密度] 兩 branch 分行**：current ≠ default 且兩邊都有事時 repo 佔兩行 → Mitigation：「都沒事只列 default」抑制大部分雜訊；常態仍只一行。
- **[語意混淆] default 顯示 behind 但工具不處理**：使用者可能誤以為按 y 會 pull default → Mitigation：「N 個 repo 需要更新」這個 N 只算 current；default behind 顯示在摘要中但不進詢問。

## Migration Plan

- 純加法升級，無 `.env` 遷移、無 CLI 變更
- 第一次跑會看到新格式（`⇡⇣ * †`）。`README.md` 需要更新：
  - 輸出範例
  - 新增「圖例」段落說明四個符號
  - 在「執行流程」加入新偵測步驟與「dirty 自動跳過 pull」說明
- Rollback：純行為差別在 dirty + behind 剔除一條；revert commit 即可恢復原行為

## Open Questions

- 「⊘ 跳過 N 個 dirty repo」是否一律列名（預設列最多 3 個 + `+M more`）？開放實作時再調整，不阻擋本提案。
- 是否在輸出底部固定印一行「圖例」？預設**不**印（多餘雜訊），README 解釋即可。需要時再加 `--legend` flag。
