# 提案・懸念ログ

実装中に気づいた提案・懸念点・問題点を記録します。

## 記録ルール

- 1行1件で追記する。
- `Status` は `Open` / `Accepted` / `Rejected` / `Done` を使う。
- オーナー判断後は `Decision` と `Decision Date` を更新する。

## ログ（表形式）

| Date | Task | Type | Detail | Expected Impact | Suggested Decision | Status | Decision | Decision Date |
|---|---|---|---|---|---|---|---|---|
| 2026-02-14 | agent.md 作成と運用ルール追加 | Improvement | Codex（IDE/ブラウザ）での変更時に必ず作業ブランチを切るルールを追加。あわせてPR記載ルールと提案ログ運用を明文化。 | 変更の追跡性向上、レビュー容易性向上、main系ブランチの安定化。 | ブランチ命名規則（`feat/*`, `fix/*`, `chore/*`）とPRテンプレート導入を次タスクで決定する。 | Open | Pending | - |
| 2026-02-15 | AGENTS.md の体裁調整 | Improvement | `AGENTS.md` と `docs/proposals.md` の先頭に UTF-8 BOM が含まれており、差分や表示でノイズになる可能性を確認。 | 不要な差分混入の抑制、エディタ間の表示差異低減。 | Markdown ファイルは UTF-8（BOM なし）で統一する。 | Open | Pending | - |
| 2026-02-15 | AGENTS.md 体裁調整の再対応 | Concern | 「内容を書き換えない」の解釈が曖昧で、前回は体裁調整をBOM除去中心で実施したため期待との差分が生じた。 | 指示解釈の齟齬を減らし、レビュー手戻りを抑制。 | 今後は「意味を変えない範囲での表記・句読点・空白調整」を体裁調整として明示的に扱う。 | Open | Pending | - |
| 2026-02-15 | AGENTS.md の AI 可読性向上 | Improvement | AGENTS.md を「クイックチェック→優先順位→必須ルール→PRテンプレート」の順に再構成し、AI が冒頭で要件を把握しやすい体裁へ調整。 | Codex 実行時の初期解釈ミス削減、実装前チェック漏れの抑制。 | AGENTS.md では、今後も意味不変を維持しつつ「先頭要約＋チェックリスト」形式を標準化する。 | Open | Pending | - |
| 2026-02-15 | AGENTS.md と proposals ログの情報設計見直し | Improvement | AGENTS.md を AI 実行フロー基準で再設計し、proposals を表形式 + ステータス管理へ移行。 | ルール解釈の一貫性向上、提案の追跡性向上、意思決定状況の可視化。 | AGENTS.md は「必須事項→手順」の順で維持し、proposals は表の `Status/Decision` を定期更新する。 | Open | Pending | - |

## 2026-02-15
- 提案: `scripts/codex-with-agents.sh` を追加し、Codex 実行時に `AGENTS.md` を自動注入する運用を導入。
- 理由: 人手でルール本文を貼り付ける運用は漏れやすく、毎回確実に参照させるにはラッパースクリプトが最小コスト。
- 懸念: すべての開発者がスクリプト経由で実行しない場合は強制できないため、PR テンプレートと CI で補完する。
- 提案: `.github/pull_request_template.md` と `.github/workflows/agents-pr-guard.yml` を組み合わせ、チェック漏れをPR時に自動検出する。
