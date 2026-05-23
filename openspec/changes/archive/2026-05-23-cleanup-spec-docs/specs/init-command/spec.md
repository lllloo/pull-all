## MODIFIED Requirements

### Requirement: 預先勾選現有清單
若 `.env` 已存在且包含 `PULL_ALL`，系統 SHALL 預先勾選對應的 repo。

#### Scenario: .env 已存在
- **WHEN** `.env` 含有 `PULL_ALL=repo-a,repo-b`
- **THEN** checkbox 清單中 `repo-a` 與 `repo-b` 預設為勾選

#### Scenario: .env 不存在
- **WHEN** `.env` 不存在
- **THEN** 所有 repo 預設為未勾選

---

### Requirement: 寫入 .env
確認後，系統 SHALL 將勾選結果寫入 `.env` 的 `PULL_ALL`。

#### Scenario: .env 不存在時建立
- **WHEN** `.env` 不存在，使用者確認勾選清單
- **THEN** 建立 `.env` 並寫入 `PULL_ALL=<comma-separated-list>`

#### Scenario: 更新現有 .env
- **WHEN** `.env` 已存在，使用者確認勾選清單
- **THEN** 僅更新 `PULL_ALL` 那行，其餘 key 保留不變

#### Scenario: 未勾選任何 repo
- **WHEN** 使用者未勾選任何 repo 並按 Enter
- **THEN** `PULL_ALL=`（空值），效果等同掃描全部
