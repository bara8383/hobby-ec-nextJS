# ローカル実行手順（本番近似）

この手順書は、**ローカル検証時に本番挙動との差分を最小化**することを目的にしています。

## 1. 方針

- 開発速度重視: `npm run dev`（HMRあり）
- 本番近似重視: `docker compose up --build`（`NODE_ENV=production` / `next start`）
- AWS 本番想定との整合: 単一コンテナ運用を前提に、将来は Lightsail Containers → App Runner/ECS へ移行可能な構成で確認する

> 将来の構成は `docs/future-aws-architecture/README.md` を参照してください。

## 2. 前提ツール

- Node.js 20 以上（推奨: LTS）
- npm 10 以上
- Docker / Docker Compose
- （任意）AWS CLI v2

## 3. 最速起動（開発モード）

```bash
npm install
npm run dev
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
