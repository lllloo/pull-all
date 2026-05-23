## Context

本次為純文件整理，不涉及程式碼變更。問題來源：
- `archive` 指令生成的 spec 檔 Purpose 欄位預設為 TBD，由 change 作者負責補寫，但部分未補
- `nested-repo-support` change 的 spec 子目錄直接升格為 specs，缺少標準 header 包裝
- `simplify-core-logic` change 更新了環境變數名稱（`PULL_ALL_INCLUDE` → `PULL_ALL`），但 `init-command` spec 未同步更新
- `pull-siblings` spec 含一個描述 init 行為的 scenario，是遷移過程的殘留

## Goals / Non-Goals

**Goals:**
- 所有 spec 檔 Purpose 欄位有實質內容
- 所有 spec 檔符合標準結構（title、Purpose、Requirements）
- `init-command` spec 與現行程式行為一致（使用 `PULL_ALL`）
- `pull-siblings` spec 不含語意錯誤的 scenario

**Non-Goals:**
- 不修改任何 `index.js` 邏輯
- 不新增功能需求
- 不改寫 spec 的需求內容，只修正結構與過時引用

## Decisions

**直接編輯 6 個 spec 檔**，不透過 archive/re-propose 流程。理由：這些都是獨立的文件品質問題，每個修正範圍小且明確，不需要額外的設計層。

## Risks / Trade-offs

無技術風險。唯一風險是 Purpose 描述寫得不夠精準 → 可在 review 時修正，成本低。
