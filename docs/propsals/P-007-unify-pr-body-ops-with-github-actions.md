# P-007: Unify Pr Body Ops With Github Actions

- Category: proposal
- Priority: normal
- Status: accepted
- Related: 

---

## 概要
ブラウザ版Codex環境では `gh` を利用できないため、ローカル専用スクリプト運用を廃止し、GitHub Actionsによる自動補完/ガードへ一本化。【対応案】ローカル専用スクリプトを削除し、Actions中心の運用を維持する。

## 背景（Why）
- 起票カテゴリ: Improvement / CI/CD
- 対象スコープ: CI
- 期待影響: 環境依存の運用を減らし、PR本文品質担保をサーバー側で統一。

## 具体的に何をしたいか（What）
- 現状: ブラウザ版Codex環境では `gh` を利用できないため、ローカル専用スクリプト運用を廃止し、GitHub Actionsによる自動補完/ガードへ一本化。【対応案】ローカル専用スクリプトを削除し、Actions中心の運用を維持する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
ローカル専用スクリプトを削除し、Actions中心の運用を維持する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 環境依存の運用を減らし、PR本文品質担保をサーバー側で統一。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
