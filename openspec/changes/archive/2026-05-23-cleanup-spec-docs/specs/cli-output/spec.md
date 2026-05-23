## MODIFIED Requirements

### Requirement: version-flag
（需求內容不變，僅補寫 spec 檔的 Purpose 欄位。）

Purpose 應補為：定義 pull-all CLI 的終端輸出格式規範，包含 help 文字、錯誤訊息、及寫入失敗的處理方式，確保使用者在各種情境下取得清楚的回饋。

help 文字 SHALL 包含 `--version / -v` 旗標說明。

#### Scenario: help 顯示 version 旗標
- **WHEN** 使用者執行 `pull-all help`
- **THEN** 輸出包含 `--version` 與 `-v` 的說明行
