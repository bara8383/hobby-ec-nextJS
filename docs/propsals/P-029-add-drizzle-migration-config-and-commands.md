# P-029: Add Drizzle Migration Config And Commands

- Category: concern
- Priority: normal
- Status: pending
- Related: 

---

## 概要
PostgreSQL互換DDLを追加したが、現状repoにはDrizzleマイグレーション実行設定（`drizzle.config.*` や適用スクリプト）がなく、運用が手動適用に依存している。【対応案】次タスクでDrizzle導入可否を再確認し、導入可能なら設定ファイルと `npm run db:migrate` を追加して機械適用へ移行する。

## 背景（Why）
- 起票カテゴリ: Concern / DB
- 対象スコープ: Infra
- 期待影響: 開発者ごとに適用手順がぶれると、スキーマ差分やレビュー時の再現性低下を招く。

## 具体的に何をしたいか（What）
- 現状: PostgreSQL互換DDLを追加したが、現状repoにはDrizzleマイグレーション実行設定（`drizzle.config.*` や適用スクリプト）がなく、運用が手動適用に依存している。【対応案】次タスクでDrizzle導入可否を再確認し、導入可能なら設定ファイルと `npm run db:migrate` を追加して機械適用へ移行する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
次タスクでDrizzle導入可否を再確認し、導入可能なら設定ファイルと `npm run db:migrate` を追加して機械適用へ移行する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 開発者ごとに適用手順がぶれると、スキーマ差分やレビュー時の再現性低下を招く。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
