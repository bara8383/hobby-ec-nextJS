# P-028: Migrate To Drizzle And Postgres Compatible Schema

- Category: proposal
- Priority: normal
- Status: accepted
- Related: 

---

## 概要
現行DB定義はTypeScript型の最小表現に留まり、SEO用slug/カテゴリ・タグ正規化、購入後ダウンロード権限制御、チャット履歴永続化を一貫管理できないことを確認。【対応案】`docs/db-design-draft.md` を基準に、Drizzle + PostgreSQL互換スキーマへ段階移行（開発はSQLite）する。

## 背景（Why）
- 起票カテゴリ: Improvement / DB
- 対象スコープ: Fullstack
- 期待影響: Next.js App Routerでの再利用性とSEO拡張性が不足し、将来のチャット分析や低コストAWS移行の設計判断が遅延する。

## 具体的に何をしたいか（What）
- 現状: 現行DB定義はTypeScript型の最小表現に留まり、SEO用slug/カテゴリ・タグ正規化、購入後ダウンロード権限制御、チャット履歴永続化を一貫管理できないことを確認。【対応案】`docs/db-design-draft.md` を基準に、Drizzle + PostgreSQL互換スキーマへ段階移行（開発はSQLite）する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: Next.js App Routerでの再利用性とSEO拡張性が不足し、将来のチャット分析や低コストAWS移行の設計判断が遅延する。
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
`docs/db-design-draft.md` を基準に、Drizzle + PostgreSQL互換スキーマへ段階移行（開発はSQLite）する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: Next.js App Routerでの再利用性とSEO拡張性が不足し、将来のチャット分析や低コストAWS移行の設計判断が遅延する。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
