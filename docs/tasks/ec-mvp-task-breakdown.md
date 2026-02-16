# EC MVPタスク分解と実行ログ

## タスク1: カート〜決済〜購入完了
- [x] 商品詳細にカート追加導線を追加
- [x] カートページの作成
- [x] チェックアウトページの作成
- [x] 注文確定 API（`/api/checkout`）を作成
- [x] 購入完了ページを作成

## タスク2: 購入済みライブラリ / 署名付きURL
- [x] 購入済みライブラリ一覧ページを作成
- [x] orderItem単位のダウンロード発行ページを作成
- [x] ダウンロード発行 API（`/api/downloads/[orderItemId]`）を作成
- [x] 署名付きURL発行ユーティリティを実装

## タスク3: 検索・絞り込み
- [x] クエリ連動のフィルタUIを追加
- [x] 商品検索ロジックを `data/products.ts` に実装
- [x] `/products` を絞り込み対応に変更
- [x] `/search` をキーワード検索対応に変更

## タスク4: チャット本番運用に向けた強化
- [x] チャットストアの抽象化（`lib/chat/store.ts`）
- [x] `app/api/chat/route.ts` を抽象化済みストア利用へ変更
- [x] 送信レート制限（簡易）を導入
- [x] チャットウィジェットに再接続・送信エラー表示を追加

## タスク5: DB/管理基盤の最小整備
- [x] `lib/db/schema` に product/order/user スキーマを追加
- [x] `lib/db/repositories` に product/order/user repository を追加
- [x] 管理画面（商品一覧/注文一覧）を追加
