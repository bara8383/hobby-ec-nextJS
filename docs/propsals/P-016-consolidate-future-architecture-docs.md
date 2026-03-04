# P-016: Consolidate Future Architecture Docs

- Category: proposal
- Priority: low
- Status: pending
- Related: 

---

## 概要
README にローカル実行の概要はあるが、本番近似での確認観点（SEO/チャット/AWS移行前提）と将来AWS構成図が分離管理されていなかった。【対応案】`docs/local-development` と `docs/future-aws-architecture` を新設し、運用時の参照先を明確化する。

## 背景（Why）
- 起票カテゴリ: Improvement / Docs
- 対象スコープ: Docs
- 期待影響: オンボーディング時間短縮、環境差分による手戻り削減、低コスト構成判断の明確化。

## 具体的に何をしたいか（What）
- 現状: README にローカル実行の概要はあるが、本番近似での確認観点（SEO/チャット/AWS移行前提）と将来AWS構成図が分離管理されていなかった。【対応案】`docs/local-development` と `docs/future-aws-architecture` を新設し、運用時の参照先を明確化する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
`docs/local-development` と `docs/future-aws-architecture` を新設し、運用時の参照先を明確化する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: オンボーディング時間短縮、環境差分による手戻り削減、低コスト構成判断の明確化。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
