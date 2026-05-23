## 1. printHelp()

- [x] 1.1 在 `-h, --help` 之後補上 `  -v, --version     顯示版本號` 說明行

## 2. renderRepo()

- [x] 2.1 `fetch-failed` case 補印 stderr（已存在，無需修改）

## 3. updateEnvFile()

- [x] 3.1 用 try/catch 包住 `writeFileSync`，catch 印紅字並 `process.exit(1)`
