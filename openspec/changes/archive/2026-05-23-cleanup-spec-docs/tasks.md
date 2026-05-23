## 1. 補寫 Purpose 欄位

- [x] 1.1 在 `openspec/specs/cli-command-routing/spec.md` 將 Purpose 從 TBD 改為：「集中定義 CLI 入口的路由規則，確保每個子命令在進入實際處理前明確分派，防止未知指令誤觸 git 操作。」
- [x] 1.2 在 `openspec/specs/cli-output/spec.md` 將 Purpose 從 TBD 改為：「定義 pull-all CLI 的終端輸出格式規範，包含 help 文字、錯誤訊息、及寫入失敗的處理方式，確保使用者在各種情境下取得清楚的回饋。」

## 2. 補齊 spec 結構

- [x] 2.1 在 `openspec/specs/nested-repo-clone/spec.md` 開頭加入：`# nested-repo-clone Specification`、`## Purpose`（定義 runClone() 對含 `/` 的 parent/child 路徑格式的 clone 行為，包含自動建立 parent 目錄的邏輯）、`## Requirements`，現有 `### Requirement:` 區塊置於 `## Requirements` 之下
- [x] 2.2 在 `openspec/specs/nested-repo-discovery/spec.md` 開頭加入：`# nested-repo-discovery Specification`、`## Purpose`（定義 runInit() 掃描巢狀 git repo 的邏輯，包含 parent/child 格式的選單顯示、縮排規則、以及 PULL_ALL 寫入格式）、`## Requirements`，現有 `### Requirement:` 區塊置於 `## Requirements` 之下

## 3. 修正 init-command 過時引用

- [x] 3.1 在 `openspec/specs/init-command/spec.md` 的 Purpose 欄位：將「`PULL_ALL_INCLUDE`」改為「`PULL_ALL`」
- [x] 3.2 在「預先勾選現有清單」requirement：將「`PULL_ALL_INCLUDE=repo-a,repo-b`」改為「`PULL_ALL=repo-a,repo-b`」
- [x] 3.3 在「寫入 .env」requirement 及其所有 scenario：將「`PULL_ALL_INCLUDE`」全數改為「`PULL_ALL`」

## 4. 移除錯放 scenario

- [x] 4.1 在 `openspec/specs/pull-siblings/spec.md` 移除最後一個 Scenario「init 寫入新變數名稱」及其所屬 WHEN/THEN 內容（對應的需求已在 init-command spec 的「寫入 .env」requirement 覆蓋）
