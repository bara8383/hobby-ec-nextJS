# P-025: Remove Secrets From Repository History Risk

- Category: concern
- Priority: high
- Status: pending
- Related: 

---

## 概要
MVPとして注文/ライブラリ/管理画面を実装したが、認証は `user-demo` 固定のため本番では不正アクセス防止の要件を満たさないことを確認。【対応案】次段階でNextAuth等のセッション認証と権限ベースアクセス制御を導入し、API/page双方で userId 固定ロジックを廃止する。

## 背景（Why）
- 起票カテゴリ: Concern / Security
- 対象スコープ: Fullstack
- 期待影響: 本番公開前に認証・認可を実装しない場合、購入情報とダウンロードURLの保護が不十分となる。

## 具体的に何をしたいか（What）
- 現状: MVPとして注文/ライブラリ/管理画面を実装したが、認証は `user-demo` 固定のため本番では不正アクセス防止の要件を満たさないことを確認。【対応案】次段階でNextAuth等のセッション認証と権限ベースアクセス制御を導入し、API/page双方で userId 固定ロジックを廃止する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
次段階でNextAuth等のセッション認証と権限ベースアクセス制御を導入し、API/page双方で userId 固定ロジックを廃止する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 本番公開前に認証・認可を実装しない場合、購入情報とダウンロードURLの保護が不十分となる。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
