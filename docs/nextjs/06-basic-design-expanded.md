# 06. 基本設計書（拡充版）

## 1. 設計方針

- 方針1: App Router / Server Componentsを基本として描画効率を担保
- 方針2: SEO関連責務を共通化し、ページ間差分は最小化
- 方針3: チャットなどSEO非依存機能は購買導線と疎結合に設計
- 方針4: 将来の機能追加（認証・検索・配信）を見据えた責務分離

---

## 2. システム構成（論理）

```txt
[Browser]
   |
   | HTTP(S)
   v
[Next.js App Router]
   |-- app/              画面ルーティング
   |-- components/       UI部品
   |-- actions/          更新系ユースケース
   |-- lib/              ドメインロジック・ユーティリティ
   |-- app/api/*         外部連携向けエンドポイント
```

- 画面描画は`app`配下で実施
- 更新処理はServer Actionsを優先
- 外部連携やWebhook受け口が必要な場合のみRoute Handlerを利用

---

## 3. 画面設計（基本）

| 画面 | URL | 役割 | レンダリング | SEO方針 |
|---|---|---|---|---|
| Home | `/` | サイト導線・カテゴリ遷移 | Server | index |
| 商品一覧 | `/products` | 商品探索ハブ | Server | index |
| 商品詳細 | `/products/[id]` | 購入判断 | Server + 動的metadata | index |
| カート | `/cart` | 購入前確認 | Server/Client混在 | noindex推奨 |
| チェックアウト | `/checkout` | 決済処理 | Server/Action中心 | noindex |
| 購入完了 | `/purchase/success/[orderId]` | 完了通知・DL導線 | Server | noindex |
| チャット | `/chat` | 問い合わせ | Client主体 | noindex推奨 |

---

## 4. コンポーネント設計

### 4.1 レイヤ分割

- `components/layout`: ヘッダー等の共通レイアウト
- `components/product`: 商品表示/購入関連UI
- `components/chat`: チャット専用UI
- `components/seo`: JSON-LD描画コンポーネント
- `components/ui`: 汎用ボタンなど低レベルUI

### 4.2 設計ルール

- ページ直下の肥大化を避け、表示単位でコンポーネントへ切り出す
- `"use client"` は最小範囲（入力、クリック、状態保持）に限定
- SEOに必要なHTMLは可能な限りServer側で出力

---

## 5. データ設計（概念）

### 5.1 Product

- `id`: string
- `title`: string
- `description`: string
- `price`: number
- `image`: string
- `downloadUrl`: string
- `category`: string

### 5.2 CartItem

- `productId`: string
- `title`: string
- `price`: number
- `quantity`: number

### 5.3 Order

- `id`: string
- `items`: CartItem[]
- `amountTotal`: number
- `createdAt`: string

---

## 6. 処理方式設計

### 6.1 読み取り系

- 商品一覧/詳細はServer Componentから`lib/products`を利用
- SEO情報は`lib/seo`でメタ情報を生成し、`metadata`または`generateMetadata`へ注入

### 6.2 更新系

- カート更新・注文確定は`actions/*`経由
- 決済API呼び出しは`app/api/stripe/route.ts`で処理
- チャット送信は`app/api/chat/route.ts`で受付

---

## 7. SEO設計

### 7.1 metadata

- 共通生成関数でtitle/description/canonical/OGを組み立て
- 商品詳細は`generateMetadata`で動的値を設定

### 7.2 構造化データ

- Home: `WebSite`
- 一覧: `ItemList`
- 詳細: `Product`

### 7.3 クロール制御

- `robots.ts`でクロール許可/制御
- `sitemap.ts`でindex対象URLを列挙

---

## 8. エラー/例外設計

- 商品未存在: 404応答（Not Foundページ）
- API失敗: ユーザー向け簡易メッセージ + サーバーログ記録
- チャット失敗: リトライ可能メッセージ表示、購買導線には影響させない

---

## 9. 非機能設計

### 9.1 性能

- 可能なページは静的生成または再検証で配信
- クライアントバンドル肥大化を避けるためClient Componentを限定

### 9.2 運用性

- 機能ごとに責務分離し、変更影響範囲を局所化
- ドキュメント（00〜06）を設計判断の一次情報として維持

### 9.3 拡張性

- chat APIはSSE/WebSocketへの置換可能性を残す
- 決済・注文をAdapter化し将来の外部サービス差し替えに対応

---

## 10. テスト観点（基本設計レベル）

- 単体: `lib/*` の純関数（価格計算、metadata生成など）
- 結合: 主要導線（一覧→詳細→カート→決済→完了）
- SEO: metadata重複、JSON-LD妥当性、robots/sitemap整合
- 回帰: チャット機能変更時に購買導線が影響を受けないこと
