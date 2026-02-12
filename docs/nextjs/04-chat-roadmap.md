# 04. リアルタイムチャット導入ロードマップ（第3優先）

チャットは学習価値が高い一方で、SEO優先のEC基盤より後に導入します。

## ゴール

- 商品検索や購入前の疑問解消を支援
- SEO導線（商品一覧・詳細）の表示速度と分離

---

## Phase 1: Polling（最小実装）

- 既存 `app/api/chat/route.ts` を利用
- `ChatWidget` は一定間隔で新着を取得
- メリット: 実装が簡単、挙動を把握しやすい
- デメリット: 通信効率が低い

## Phase 2: SSE（推奨中間）

- Route Handler で Server-Sent Events を返す
- 片方向リアルタイム通知に適する
- 学習コストとリアルタイム性のバランスが良い

## Phase 3: WebSocket（本格運用）

- 双方向・低遅延が必要な場合に採用
- インフラ（接続維持、スケール、認証）コストは増える

---

## 実装ガイドライン

- チャットは `app/(engagement)/chat` へ分離し、購買ルートの描画に影響させない
- ユーザー入力とメッセージ表示だけを Client 化
- 履歴保存が必要なら、`chatStore.ts` を抽象化して永続化可能にする

---

## 最低限の受け入れ基準

- [ ] チャットが落ちても商品閲覧・購入は継続できる
- [ ] チャット関連JSの読み込みが初期描画を著しく悪化させない
- [ ] API失敗時にリトライ/エラー表示を実装
- [ ] ログ出力・監視ポイントを定義

---

## 公式参照先

- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Streaming: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
