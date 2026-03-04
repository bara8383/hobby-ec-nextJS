# P-014: Review Iam Policy Scope For Chat Resources

- Category: concern
- Priority: high
- Status: pending
- Related: 

---

## 概要
現在のリアルタイムチャットは Route Handler のインメモリ実装のため、マルチインスタンス構成でメッセージ整合性が崩れる可能性を確認。【対応案】本番移行時は Redis（ElastiCache）または DynamoDB Streams へ置き換える。

## 背景（Why）
- 起票カテゴリ: Concern / Architecture
- 対象スコープ: BE
- 期待影響: 水平スケール時にチャット履歴欠落や片系配信が発生するリスク。

## 具体的に何をしたいか（What）
- 現状: 現在のリアルタイムチャットは Route Handler のインメモリ実装のため、マルチインスタンス構成でメッセージ整合性が崩れる可能性を確認。【対応案】本番移行時は Redis（ElastiCache）または DynamoDB Streams へ置き換える。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
本番移行時は Redis（ElastiCache）または DynamoDB Streams へ置き換える。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 水平スケール時にチャット履歴欠落や片系配信が発生するリスク。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
