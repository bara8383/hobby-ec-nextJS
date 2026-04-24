# P-001: Enforce Working Branch And Pr Rules

- Category: proposal
- Priority: low
- Status: denied
- Related: 

---

## 概要
Codex（IDE/ブラウザ）での変更時に必ず作業ブランチを切るルールを追加。あわせてPR記載ルールと提案ログ運用を明文化。【対応案】ブランチ命名規則（`feat/*`, `fix/*`, `chore/*`）とPRテンプレート導入を次タスクで決定する。

## 背景（Why）
- 起票カテゴリ: Improvement / DX
- 対象スコープ: Docs
- 期待影響: 変更の追跡性向上、レビュー容易性向上、main系ブランチの安定化。

## 具体的に何をしたいか（What）
- 現状: Codex（IDE/ブラウザ）での変更時に必ず作業ブランチを切るルールを追加。あわせてPR記載ルールと提案ログ運用を明文化。【対応案】ブランチ命名規則（`feat/*`, `fix/*`, `chore/*`）とPRテンプレート導入を次タスクで決定する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
ブランチ命名規則（`feat/*`, `fix/*`, `chore/*`）とPRテンプレート導入を次タスクで決定する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 変更の追跡性向上、レビュー容易性向上、main系ブランチの安定化。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 既存台帳で Rejected と判断済み。
