## Why

多次 change 歸檔後，specs 目錄累積了幾個文件品質問題：Purpose 未填、結構殘缺、引用已廢棄的變數名、以及一個語意錯放的 scenario。這些問題不影響程式行為，但會使 spec 成為誤導性的參考文件。

## What Changes

- `cli-command-routing/spec.md`：補寫 Purpose（目前為 TBD）
- `cli-output/spec.md`：補寫 Purpose（目前為 TBD）
- `init-command/spec.md`：將三處 `PULL_ALL_INCLUDE` 改為 `PULL_ALL`，與 `simplify-core-logic` change 完成後的現行行為一致
- `nested-repo-clone/spec.md`：補上標準 spec 結構（title、Purpose、`## Requirements` 包裝）
- `nested-repo-discovery/spec.md`：同上
- `pull-siblings/spec.md`：移除「Scenario: init 寫入新變數名稱」（該行為屬於 init-command，放在此處是語意錯誤）

不修改任何 `index.js` 邏輯，不新增功能。

## Capabilities

### New Capabilities

（無，本次純文件整理）

### Modified Capabilities

- `cli-command-routing`：補寫 Purpose 欄位
- `cli-output`：補寫 Purpose 欄位
- `init-command`：更正 `PULL_ALL_INCLUDE` → `PULL_ALL`
- `nested-repo-clone`：補齊 spec 結構
- `nested-repo-discovery`：補齊 spec 結構
- `pull-siblings`：移除錯放的 scenario

## Impact

僅影響 `openspec/specs/` 下的六個文件，不涉及程式碼、API、或相依套件。
