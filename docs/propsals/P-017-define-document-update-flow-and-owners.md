# P-017: Define Document Update Flow And Owners

- Category: proposal
- Priority: low
- Status: pending
- Related: 

---

## 概要
ローカル手順に「開発モード / 本番近似モード」を併記したが、使い分け理由（速度と本番差分のトレードオフ）が明示されていなかった。【対応案】`docs/local-development/README.md` に「モードが二つある理由」を追記し、標準運用（普段dev、PR前production近似）を明文化する。

## 背景（Why）
- 起票カテゴリ: Improvement / Docs
- 対象スコープ: Docs
- 期待影響: 運用時のモード選択ミスを減らし、レビュー前チェックの一貫性を向上。

## 具体的に何をしたいか（What）
- 現状: ローカル手順に「開発モード / 本番近似モード」を併記したが、使い分け理由（速度と本番差分のトレードオフ）が明示されていなかった。【対応案】`docs/local-development/README.md` に「モードが二つある理由」を追記し、標準運用（普段dev、PR前production近似）を明文化する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
`docs/local-development/README.md` に「モードが二つある理由」を追記し、標準運用（普段dev、PR前production近似）を明文化する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 運用時のモード選択ミスを減らし、レビュー前チェックの一貫性を向上。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
