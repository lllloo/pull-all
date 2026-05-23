## ADDED Requirements

### Requirement: spec 檔案結構補齊（文件整理）
`nested-repo-discovery/spec.md` 需補上標準結構：
- `# nested-repo-discovery Specification` 標題
- `## Purpose` 欄位（描述：定義 runInit() 掃描巢狀 git repo 的邏輯，包含 parent/child 格式的選單顯示、縮排規則、以及 PULL_ALL 寫入格式）
- `## Requirements` 包裝

需求內容本身不變，僅補齊包裝結構。

#### Scenario: spec 可被正常解析
- **WHEN** 讀取 `openspec/specs/nested-repo-discovery/spec.md`
- **THEN** 檔案含有 title、Purpose、Requirements 三個區段
