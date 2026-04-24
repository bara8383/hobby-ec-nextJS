# P-035: Persist Favorites And Recently Viewed Flow

- Category: concern
- Priority: normal
- Status: pending
- Related: 

---

## 概要
Amazon/楽天の「閲覧履歴・お気に入り一覧・再訪導線」と比較すると、`components/product/FavoriteButton.tsx` はクライアント内トグルのみで永続化されず、`app/(store)/mypage/*` 配下にもウィッシュリスト/履歴画面が未実装。再訪時の検討再開導線が不足している。【対応案】お気に入りをサーバー保存するか（ユーザー単位DB）ローカル保存で開始するかを決定し、`/mypage/favorites` と「最近見た商品」導線の優先順位・保存期間・匿名ユーザー扱いを仕様化する。

## 背景（Why）
- 起票カテゴリ: Concern / CRM
- 対象スコープ: Fullstack
- 期待影響: 再訪CVの底上げ施策が限定され、広告流入の再コンバージョン効率が低下する。

## 具体的に何をしたいか（What）
- 現状: Amazon/楽天の「閲覧履歴・お気に入り一覧・再訪導線」と比較すると、`components/product/FavoriteButton.tsx` はクライアント内トグルのみで永続化されず、`app/(store)/mypage/*` 配下にもウィッシュリスト/履歴画面が未実装。再訪時の検討再開導線が不足している。【対応案】お気に入りをサーバー保存するか（ユーザー単位DB）ローカル保存で開始するかを決定し、`/mypage/favorites` と「最近見た商品」導線の優先順位・保存期間・匿名ユーザー扱いを仕様化する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
お気に入りをサーバー保存するか（ユーザー単位DB）ローカル保存で開始するかを決定し、`/mypage/favorites` と「最近見た商品」導線の優先順位・保存期間・匿名ユーザー扱いを仕様化する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 再訪CVの底上げ施策が限定され、広告流入の再コンバージョン効率が低下する。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
