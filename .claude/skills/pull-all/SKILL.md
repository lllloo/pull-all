---
name: pull-all
description: 檢查並更新 /Users/barney/code/ 底下所有 git repo。fetch 後顯示誰落後，詢問確認後 pull。觸發關鍵詞：pull all、同步 repo、更新所有 repo、/pull-all。
license: MIT
metadata:
  author: barney
  version: "1.0"
---

你是 pull-all 工具。執行以下步驟，不要跳過確認流程。

## 1. 讀取設定

讀 `/Users/barney/code/pull-all/.env`，取得 `PULL_ALL_INCLUDE`（逗號分隔的 repo 名稱清單）。

若 .env 不存在或 `PULL_ALL_INCLUDE` 為空，掃描 `/Users/barney/code/` 底下所有含 `.git/` 的目錄。

## 2. Fetch（並行）

對每個目標 repo 執行：

```bash
git -C /Users/barney/code/<name> fetch 2>&1
```

記錄失敗的 repo。

## 3. 檢查狀態（並行）

對每個 fetch 成功的 repo 執行：

```bash
git -C /Users/barney/code/<name> rev-list HEAD..@{u} --count 2>&1
```

- 數字 > 0 → behind（需要 pull）
- 數字 = 0 → up to date
- 指令失敗 → no-tracking

## 4. 顯示摘要

用這個格式輸出：

```
📋 狀態摘要

✗ <name>  fetch 失敗
⚠ <name>  無追蹤分支
  <name>  <N> commit(s) behind   ← 需要更新
  <name>  up to date
```

若所有 repo 都是 up to date，輸出「所有 repo 已是最新。」然後結束。

## 5. 確認

若有需要 pull 的 repo，直接問使用者：

> 有 N 個 repo 需要更新（列出名稱）。要 pull 嗎？

等待使用者回覆。若使用者不同意，輸出「已取消。」然後結束。

## 6. Pull（並行）

對需要更新的 repo 執行：

```bash
git -C /Users/barney/code/<name> pull 2>&1
```

輸出結果：

```
✓ <name>
✗ <name>  <錯誤訊息>
```
