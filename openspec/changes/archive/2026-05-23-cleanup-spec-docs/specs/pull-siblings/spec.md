## REMOVED Requirements

### Requirement: init 寫入新變數名稱（錯放 scenario）
**Reason**: 此 scenario 描述的是 `init` 指令的行為（寫入 `.env` 的 `PULL_ALL` key），與 pull-siblings 的職責無關。正確位置應在 `init-command` 或 `env-config` spec。該行為已由 `init-command` spec 的「寫入 .env」requirement 覆蓋。

**Migration**: 無需遷移，相關行為由 `init-command/spec.md` 的「寫入 .env」requirement 定義。

#### Scenario: init 寫入新變數名稱
- **WHEN** 使用者執行 `pull-all init`
- **THEN** 工具將選擇結果寫入 `.env` 的 `PULL_ALL` key，不再寫 `PULL_ALL_INCLUDE`
