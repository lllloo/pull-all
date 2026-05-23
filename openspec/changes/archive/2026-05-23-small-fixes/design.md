## Context

`index.js` 是單一入口，所有邏輯集中於此。三個問題各自獨立，不涉及架構變動。

## Goals / Non-Goals

**Goals:**
- 補齊 help 文字
- fetch 失敗時讓使用者知道原因
- env 寫入失敗時不靜默

**Non-Goals:**
- 不重構錯誤處理架構
- 不新增 log 系統

## Decisions

### Decision 1: version-flag 加在 Options 區塊

`printHelp()` 已有 `-h, --help` 一行，`--version / -v` 緊接在後，格式對齊。

### Decision 2: fetch-failed 在 renderRepo() 補印 stderr

`renderRepo()` 已處理 `fetch-failed` 類型，直接在該 case 加一行印出 stderr，不動 `checkRepo()`。

### Decision 3: updateEnvFile() 用 try/catch 包 writeFileSync

最小侵入：只包 `writeFileSync` 那一行，catch 裡印紅字並 `process.exit(1)`。
