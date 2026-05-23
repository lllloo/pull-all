## Why

三個獨立的小問題各自影響使用者體驗：help 文字遺漏 `--version`、fetch 失敗沒有錯誤訊息、env 寫入無錯誤處理。

## What Changes

- `printHelp()` 補上 `--version / -v` 說明行
- `renderRepo()` 對 `fetch-failed` 顯示 stderr 訊息
- `updateEnvFile()` 用 try/catch 包住 `writeFileSync`

## Capabilities

### New Capabilities

- `version-flag`：CLI 顯示版本號旗標說明
- `fetch-error-message`：fetch 失敗時顯示錯誤原因
- `env-write-error-handling`：env 寫入失敗顯示錯誤

## Impact

- `index.js`：三處修改，各自獨立
