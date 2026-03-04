# P-008: Auto Fill Empty Pr Body On Pull Request Target

- Category: proposal
- Priority: normal
- Status: pending
- Related: 

---

## 概要
`pull_request_target` で本文が空/プレースホルダーのPRを検知し、テンプレート本文へ自動更新するワークフローを追加。【対応案】作成時検証スクリプトとCIガードに加えて自動補完を三重化し、運用上の取りこぼしを最小化する。

## 背景（Why）
- 起票カテゴリ: Improvement / CI/CD
- 対象スコープ: CI
- 期待影響: make_pr障害時でもPR本文欠落を即時是正し、レビュー開始時の情報欠落を削減。

## 具体的に何をしたいか（What）
- 現状: `pull_request_target` で本文が空/プレースホルダーのPRを検知し、テンプレート本文へ自動更新するワークフローを追加。【対応案】作成時検証スクリプトとCIガードに加えて自動補完を三重化し、運用上の取りこぼしを最小化する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
作成時検証スクリプトとCIガードに加えて自動補完を三重化し、運用上の取りこぼしを最小化する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: make_pr障害時でもPR本文欠落を即時是正し、レビュー開始時の情報欠落を削減。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
