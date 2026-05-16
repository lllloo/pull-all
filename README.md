# pull-all

對兄弟層所有 git repo 執行 `git pull`，一次同步所有專案。

## 安裝

無需安裝額外套件，只需 Node.js 與 git。

```bash
# 將此 repo clone 到與其他專案同層的目錄
# 例如：~/code/pull-all/
```

## 使用方式

```bash
node index.js
```

## 設定檔

在 `pull-all.config.json` 中指定要同步的 repo 白名單：

```json
{
  "include": [
    "web",
    "common",
    "note"
  ]
}
```

- **有設定檔**：只 pull `include` 清單內的 repo
- **無設定檔**：pull 父目錄下所有 git repo
- **找不到的 repo**：顯示黃色警告，其他 repo 正常執行

## 輸出範例

```
正在 pull 3 個 repo...

✓ web
✓ common
⚠ note（找不到）
✗ sync-ai
  error: Your local changes...
```
