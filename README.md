# dsh-evidence-first-knowledge-work

把 [evidence-first-knowledge-work](https://github.com/win10ogod/evidence-first-knowledge-work) 1.1.0 封裝為 DeepSeek Harness 插件。已依 DSH `0.1.7-rc.2`、`0.2.0-rc.2`、`0.2.1-alpha.1`、`0.2.2-alpha.2` 與 `0.2.2-rc.1` 的 Skill 註冊介面製作。

插件將完整的 `SKILL.md`、參考文件與評估工具放在 `assets/evidence-first-knowledge-work/`，並註冊到 DSH 原有的 `ctx.skills`。代理會在技能目錄看到名稱和描述；任務符合描述時可用 `skill` 工具載入全文。使用者也可在訊息中輸入 `/evidence-first-knowledge-work` 明確載入。載入全文時，DSH 會提供包內資源目錄，供代理按需讀取 `references/` 等文件。

插件不自行發起對話、反思或背景模型輪次，也不修改 DSH 的工具權限。技能內容屬指令層；是否確實遵循七道關卡仍需從實際任務及驗證結果判斷。專案內同名技能依 DSH 的優先順序可以覆蓋此插件；本插件優先於使用者全域技能目錄中的同名副本。

## 安裝

使用 DSH 命令安裝至所需 profile，例如 `web`：

```powershell
dsh plugin --profile web add github:win10ogod/dsh-evidence-first-knowledge-work
dsh --profile web --dump-config
```

`dsh plugin` 會安裝套件並把 bundle 加進 profile；`--dump-config` 應顯示 `skill-evidence-first-knowledge-work` 條目。重新啟動已在執行的 DSH 後使用。

執行 `npm run check` 可驗證插件語法、技能內容、資源目錄和 DSH 註冊呼叫。`npm pack --dry-run` 可檢查發佈包是否包含完整技能文件。

技能本身與插件均依 MIT 授權；原始技能內容保留於 `assets/evidence-first-knowledge-work/`。
