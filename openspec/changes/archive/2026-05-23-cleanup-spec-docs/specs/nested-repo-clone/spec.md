## ADDED Requirements

### Requirement: spec 檔案結構補齊（文件整理）
`nested-repo-clone/spec.md` 需補上標準結構：
- `# nested-repo-clone Specification` 標題
- `## Purpose` 欄位（描述：定義 runClone() 對含 `/` 的 parent/child 路徑格式的 clone 行為，包含自動建立 parent 目錄的邏輯）
- `## Requirements` 包裝

需求內容本身不變，僅補齊包裝結構。

#### Scenario: spec 可被正常解析
- **WHEN** 讀取 `openspec/specs/nested-repo-clone/spec.md`
- **THEN** 檔案含有 title、Purpose、Requirements 三個區段
