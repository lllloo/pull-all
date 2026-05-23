## MODIFIED Requirements

### Requirement: CLI command dispatch
（需求內容不變，僅補寫 spec 檔的 Purpose 欄位。）

Purpose 應補為：集中定義 CLI 入口的路由規則，確保每個子命令在進入實際處理前明確分派，防止未知指令誤觸 git 操作。

#### Scenario: 未帶 argument
- **WHEN** 使用者執行 `pull-all`
- **THEN** 系統執行主要 pull 流程

#### Scenario: init command
- **WHEN** 使用者執行 `pull-all init`
- **THEN** 系統執行初始化流程

#### Scenario: clone command
- **WHEN** 使用者執行 `pull-all clone`
- **THEN** 系統執行 clone 流程

#### Scenario: help command
- **WHEN** 使用者執行 `pull-all help`、`pull-all --help`、或 `pull-all -h`
- **THEN** 系統顯示 CLI 用法並以 exit code 0 結束，且不執行 repo 掃描、`git fetch`、`git pull`、或 `gh` 檢查

#### Scenario: unknown command
- **WHEN** 使用者執行未支援的子命令，例如 `pull-all typo`
- **THEN** 系統顯示未知指令錯誤與簡短用法，並以非 0 exit code 結束，且不執行 repo 掃描、`git fetch`、`git pull`、或 `gh` 檢查
