# ローカル開発環境セットアップ（Docker Compose）

## 1. 前提（必須ツール / 推奨バージョン）

- Docker Engine / Docker Desktop
- Docker Compose v2（`docker compose` コマンド）
- Node.js / npm（ホストで直接実行する場合）
  - Node.js: `22`（`.nvmrc`）
  - engines: `node >=22.0.0 <23`, `npm >=10 <12`（`package.json`）

## 2. セットアップ（.env 作成）

```bash
cp .env.example .env
```

- `.env.example` には、LocalStack 用の `AWS_ENDPOINT_URL=http://localstack:4566`、PostgreSQL 用の `DATABASE_URL=postgresql://hobby_ec:hobby_ec@db:5432/hobby_ec_local` などが定義されています。
- LocalStack 初期化スクリプト `localstack/init/01_create_resources.sh` は、`LOCAL_S3_BUCKET` / `LOCAL_SQS_QUEUE_NAME` / `CHAT_*_TABLE` の値を参照します。

## 3. 起動（docker compose -f docker-compose.local.yml up --build）

```bash
docker compose -f docker-compose.local.yml up --build
```

- `web`（`node:22-alpine`）
  - `npm install && npm run dev`
  - 公開ポート: `3000:3000`
- `db`（`postgres:16-alpine`）
  - 公開ポート: `5432:5432`
- `localstack`（`localstack/localstack:3.8`）
  - 公開ポート: `4566:4566`
  - `SERVICES=s3,sqs`
  - `./localstack/init` が ready hook として実行されます

停止:

```bash
docker compose -f docker-compose.local.yml down
```

データも含めて初期化:

```bash
docker compose -f docker-compose.local.yml down -v
```

## 4. 設定の要点（.env と compose の environment の関係、コンテナ内/外の接続先）

- `web` は `env_file: .env` を読み込んだうえで、`docker-compose.local.yml` の `environment` が同名キーを上書きします。
  - `AWS_ENDPOINT_URL=http://localstack:4566`
  - `DATABASE_URL=postgresql://hobby_ec:hobby_ec@db:5432/hobby_ec_local`
- 接続先の整理:
  - web → db: `db:5432`
  - web → localstack: `http://localstack:4566`
  - ホストPC → web/localstack/db: `http://localhost:3000` / `http://localhost:4566` / `localhost:5432`

LocalStack init の実行内容（`localstack/init/01_create_resources.sh`）:

- S3 バケット作成を試行（`awslocal s3api create-bucket ... || true`）
- SQS キュー作成を試行（`awslocal sqs create-queue ...`）
- DynamoDB テーブル 3 種の作成を試行（`awslocal dynamodb create-table ... || true`）

補足:

- `docker-compose.local.yml` の `SERVICES` は `s3,sqs` です。
- そのため、スクリプト内の DynamoDB 作成処理は実行環境によって結果が変わる可能性があります（スクリプトは `|| true` で継続する実装）。

## 5. 起動確認（URL / curl / docker compose ps / logs）

- URL:
  - アプリ: `http://localhost:3000`
  - LocalStack: `http://localhost:4566`

```bash
curl -i http://localhost:3000
curl -s http://localhost:4566/_localstack/health
```

```bash
docker compose -f docker-compose.local.yml ps
```

```bash
docker compose -f docker-compose.local.yml logs -f web
docker compose -f docker-compose.local.yml logs -f db
docker compose -f docker-compose.local.yml logs -f localstack
```

## 6. トラブルシュート（症状→原因→対処、短い箇条書き）

- 症状: `port is already allocated`（3000/5432/4566）
  - 原因: ホスト側で同ポート使用中
  - 対処: 使用中プロセス/既存コンテナを停止し、再度 `docker compose -f docker-compose.local.yml up --build`

- 症状: `env_file .env not found`
  - 原因: `.env` 未作成
  - 対処: `cp .env.example .env`

- 症状: web から DB/LocalStack に接続できない
  - 原因: コンテナ内接続先に `localhost` を使っている
  - 対処: web からは `db:5432` と `http://localstack:4566` を使用

- 症状: LocalStack 起動後に DynamoDB 関連が期待通り作成されない
  - 原因: `SERVICES=s3,sqs` 設定により DynamoDB が有効化されていない可能性
  - 対処: `docker compose -f docker-compose.local.yml logs -f localstack` で init 実行結果を確認し、必要なら LocalStack 設定を見直す
