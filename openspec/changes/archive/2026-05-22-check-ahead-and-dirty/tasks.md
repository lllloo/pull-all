## 1. 偵測輔助函式

- [x] 1.1 新增 `isEmptyRepo(dir)`：以 `git rev-parse --verify --quiet HEAD` 判定空 repo（無 commit）
- [x] 1.2 新增 `getCurrentBranch(dir)`：以 `git symbolic-ref --short HEAD` 拿 current branch，失敗回 `{ detached: true, sha: <short-sha> }`
- [x] 1.3 新增 `getDefaultBranch(dir)`：依序試 `origin/HEAD` → `main` → `master`，皆失敗回 `null`
- [x] 1.4 新增 `getAhead(dir, branch)`：執行 `git rev-list <branch> --not --remotes --count`，回非負整數
- [x] 1.5 新增 `getBehind(dir, branch)`：執行 `git rev-list <branch>..<branch>@{u} --count`，無 upstream 時回 `null`，否則回非負整數
- [x] 1.6 新增 `hasUpstream(dir, branch)`：以 `git rev-parse --verify --quiet <branch>@{u}` 判定
- [x] 1.7 新增 `isDirty(dir)`：執行 `git status --porcelain`，濾掉 `??` 開頭的行，剩餘任一行存在即 dirty

## 2. 改造 status 收集流程

- [x] 2.1 改造 `checkAndPull(target)`（或拆出 `getRepoStatus`）：依序判定 empty → fetch → default/current branch → 兩 branch 的 ahead/behind/upstream → dirty
- [x] 2.2 結果結構改為 `{ name, fullPath, type, empty?, fetchError?, currentBranch, defaultBranch, defaultStatus, currentStatus, dirty, detached, noDefault }`，其中 `defaultStatus` / `currentStatus` 含 `{ ahead, behind, hasUpstream }`
- [x] 2.3 空 repo 直接 short-circuit，type = `'empty'`，跳過 fetch
- [x] 2.4 fetch 失敗仍 short-circuit，type = `'fetch-failed'`，跳過所有後續偵測
- [x] 2.5 detached HEAD 跳過 current 的 ahead/behind/upstream 判定，仍判定 default

## 3. 摘要輸出

- [x] 3.1 新增 `formatBranchLine({ branch, ahead, behind, hasUpstream, dirty, isCurrent })` 回傳緊湊符號字串：`✓` / `⇡N` / `⇣N` / `⇡N ⇣M`，無 upstream 加 `†`，dirty（僅 current 行）加 `*`
- [x] 3.2 實作顯示策略：任一 branch 有事列那條；都沒事只列 default；dirty 強制 current 行列出；`current == default` 只列一條
- [x] 3.3 `current ≠ default` 且兩條都需顯示時，第二條縮排對齊 branch 欄
- [x] 3.4 邊界輸出：empty 顯示「(empty)」灰色一行；fetch-failed 顯示「✗ fetch 失敗」加 stderr；無 default branch 顯示「⚠ 無預設分支」並僅顯示 current
- [x] 3.5 detached HEAD 的 branch 欄顯示「(HEAD@<short-sha>, detached)」
- [x] 3.6 移除/重寫原本 `no-tracking` 顯示路徑，改由 `†` 標記呈現

## 4. pull 名單過濾與詢問

- [x] 4.1 計算 `toBePulled` 改為過濾「current 有 upstream + current behind > 0 + clean」三條件 AND
- [x] 4.2 計算 `skippedDirty`：current behind > 0 + dirty 的 repo 集合
- [x] 4.3 在摘要與詢問之間若 `skippedDirty.length > 0`，顯示「⊘ 跳過 N 個 dirty repo: <最多 3 個名稱>[+M more]」
- [x] 4.4 「N 個 repo 需要更新」中的 N 改為 `toBePulled.length`，僅算 current behind clean
- [x] 4.5 「所有 repo 已是最新」訊息保留；無 toBePulled 且有 skippedDirty 時顯示對應提示而非「最新」

## 5. README 與圖例

- [x] 5.1 更新 `README.md` 的「輸出範例」段落，採新格式
- [x] 5.2 在 `README.md` 加入「圖例」段落說明 `⇡⇣ * †` 與 `(empty)`/`(HEAD@..., detached)`/「⚠ 無預設分支」
- [x] 5.3 在「執行流程」段落補上 default branch 偵測、dirty 偵測、dirty + behind 跳過 pull
- [x] 5.4 在「設定」或新增「行為」段落明確記載：dirty 的 repo 不會被 pull

## 6. 驗證

- [ ] 6.1 手動測試表 1 全部 9 個 case（current == default）
- [ ] 6.2 手動測試表 2 current ≠ default 的 7 個 case
- [ ] 6.3 手動測試邊界：detached HEAD、空 repo、無 default branch、fetch 失敗
- [ ] 6.4 確認沒有任何情境下，dirty 的 repo 被執行 `git pull`
- [x] 6.5 跑 `openspec validate check-ahead-and-dirty --strict` 通過
