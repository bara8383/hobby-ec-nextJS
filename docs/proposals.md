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
