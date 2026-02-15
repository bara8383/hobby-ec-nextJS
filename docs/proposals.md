# 提案・懸念ログ

実装中に気づいた提案・懸念点・問題点を、時系列で追記してください。

## 記録テンプレート

- Date: YYYY-MM-DD
- Task:
- Type: Proposal | Concern | Risk | Improvement
- Detail:
- Expected Impact:
- Suggested Decision:

- Date: 2026-02-14
- Task: agent.md 作成と運用ルール追加
- Type: Improvement
- Detail: Codex（IDE/ブラウザ）での変更時に必ず作業ブランチを切るルールを追加。あわせてPR記載ルールと提案ログ運用を明文化。
- Expected Impact: 変更の追跡性向上、レビュー容易性向上、main系ブランチの安定化。
- Suggested Decision: ブランチ命名規則（`feat/*`, `fix/*`, `chore/*`）とPRテンプレート導入を次タスクで決定する。

- Date: 2026-02-15
- Task: AGENTS.md の体裁調整
- Type: Improvement
- Detail: `AGENTS.md` と `docs/proposals.md` の先頭に UTF-8 BOM が含まれており、差分や表示でノイズになる可能性を確認。
- Expected Impact: 不要な差分混入の抑制、エディタ間の表示差異低減。
- Suggested Decision: Markdown ファイルは UTF-8（BOM なし）で統一する。

- Date: 2026-02-15
- Task: AGENTS.md 体裁調整の再対応
- Type: Concern
- Detail: 「内容を書き換えない」の解釈が曖昧で、前回は体裁調整をBOM除去中心で実施したため期待との差分が生じた。
- Expected Impact: 指示解釈の齟齬を減らし、レビュー手戻りを抑制。
- Suggested Decision: 今後は「意味を変えない範囲での表記・句読点・空白調整」を体裁調整として明示的に扱う。
