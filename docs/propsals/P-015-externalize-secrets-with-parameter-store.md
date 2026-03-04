# P-015: Externalize Secrets With Parameter Store

- Category: proposal
- Priority: high
- Status: pending
- Related: 

---

## 概要
デジタル商品のダウンロード配布は現状UI説明のみで、署名付きURL発行や購入者認証フローが未実装。【対応案】次段階で購入履歴連携 + 期限付き署名URL（S3/CloudFront）を実装する。

## 背景（Why）
- 起票カテゴリ: Improvement / Security
- 対象スコープ: Fullstack
- 期待影響: 本番運用時に不正共有・無制限再配布リスクが残る。

## 具体的に何をしたいか（What）
- 現状: デジタル商品のダウンロード配布は現状UI説明のみで、署名付きURL発行や購入者認証フローが未実装。【対応案】次段階で購入履歴連携 + 期限付き署名URL（S3/CloudFront）を実装する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
次段階で購入履歴連携 + 期限付き署名URL（S3/CloudFront）を実装する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 本番運用時に不正共有・無制限再配布リスクが残る。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
