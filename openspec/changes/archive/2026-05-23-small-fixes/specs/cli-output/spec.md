## ADDED Requirements

### Requirement: version-flag

help 文字 SHALL 包含 `--version / -v` 旗標說明。

#### Scenario: help 顯示 version 旗標

- **WHEN** 使用者執行 `pull-all help`
- **THEN** 輸出包含 `--version` 與 `-v` 的說明行

---

### Requirement: fetch-error-message

fetch 失敗時，輸出 MUST 顯示失敗原因（stderr）。

#### Scenario: fetch 失敗顯示錯誤訊息

- **WHEN** 某個 repo 執行 `git fetch` 失敗
- **THEN** 輸出該 repo 名稱並附上 stderr 內容

---

### Requirement: env-write-error-handling

env 檔案寫入失敗時，系統 MUST 顯示錯誤訊息並以非零 exit code 結束。

#### Scenario: env 寫入失敗

- **WHEN** `updateEnvFile()` 的 `writeFileSync` 拋出例外
- **THEN** 以紅色顯示錯誤訊息並以非零 exit code 結束
