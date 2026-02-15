# ローカル実行手順（本番近似）

この手順書は、**開発は `NODE_ENV=development`、本番検証は `NODE_ENV=production`** で行い、
ローカル検証時の品質と開発速度の両立を目的にしています。

## 1. 方針（公式標準に沿った運用）

- 日常開発: `npm run dev`（development モード）
- 本番検証: `docker compose up --build`（production モード）
- 使い分け理由: `NODE_ENV` の責務を明確に分離し、開発効率と本番再現性を両立する

> 将来の構成は `docs/future-aws-architecture/README.md` を参照してください。

## 1-1. なぜ `NODE_ENV` を切り替えるか

- development は HMR・デバッグ情報など、実装反復を高速化するためのモード
- production は最適化済みビルド/実行経路の確認に適したモード
- 片方のみで運用すると以下の課題が出る
  - development のみ: 本番特有の差分を見落としやすい
  - production のみ: UI修正やロジック調整の反復速度が落ちる
- 現在のリポジトリはAWS SDK連携を未実装のため、まずは Next.js 本体の development/production 切替運用を優先します。
- Node.js 20 以上
- npm 10 以上

## 3. 日常開発（development モード）

```bash
npm install
npm run dev
```

- アクセス: `http://localhost:3000`
- 用途: UI調整、レイアウト確認、細かいロジック変更の即時確認

## 4. 本番検証（production モード）

## 5. 代表チェック
## 6. 本番との差分（先に理解しておく）
## 7. AWS 想定に寄せる確認ポイント
- development/production の切替を日常運用に組み込み、差分検知を早期化する

## 8. よく使うコマンド

```bash
# 開発モード
# 本番ビルド
npm run build

# 本番起動
npm run start

```

- アクセス: `http://localhost:3000`
- 用途: UI 調整、レイアウト確認、細かいロジック変更の即時確認

## 4. 本番近似起動（推奨）

### 4-1. コンテナ起動

```bash
docker compose up --build
```

- `Dockerfile` の build 結果を使って `next start` で起動
- `NODE_ENV=production` で動作
- App Router / Route Handler / SSE の本番寄り動作を確認しやすい

### 4-2. 代表チェック

1. トップページ表示
2. 商品詳細ページの metadata（title/description）
3. JSON-LD が出力されていること
4. チャットウィジェットの送受信（SSE）

## 5. 本番との差分（先に理解しておく）

- チャットはインメモリ保持のため、単一プロセス内のみ共有
- マルチインスタンス配信（AWSでスケール時）は Redis / DynamoDB など外部ストアが必要
- ローカルは単一コンテナ前提。CDN / WAF / ALB 振る舞いは未再現

## 6. AWS 想定に寄せる確認ポイント

- 単一インスタンスでのレスポンス・SEO出力を先に安定化
- 将来のストア分離を見越し、チャット永続化ポイントを切り出しやすい設計で運用
- コンテナイメージでの起動確認をデフォルトにして、環境差分を減らす

## 7. よく使うコマンド

```bash
# 開発モード
npm run dev

# 本番ビルド
npm run build

# 本番起動
npm run start

# 静的解析
npm run lint
```
