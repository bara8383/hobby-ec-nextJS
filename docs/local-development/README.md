# ローカル開発手順（Docker Compose 前提）

このドキュメントは、`git clone` 済みの状態から **Next.js(App Router) + Postgres + LocalStack(S3/SQS)** をローカル起動するための手順です。  
日常開発は `docker-compose.local.yml`、本番近似確認は `docker-compose.yml` を利用します。

## 1. 前提環境

### 必須ツール

- Docker Desktop（macOS / Windows）または Docker Engine（Linux）
- Docker Compose v2（`docker compose` コマンド）
- Git

> このリポジトリはコンテナ起動を推奨します。Node.js をホストに直接入れなくても起動できます。

### OS 別の補足（差分がある点のみ）

- **macOS**
  - Docker Desktop を起動してから作業してください。
- **Windows (WSL2)**
  - Docker Desktop + WSL2 連携を有効化し、**WSL 側の Linux パス配下**（例: `~/src/...`）で作業してください。`/mnt/c` 配下は I/O が遅くなることがあります。
- **Linux**
  - `docker` / `docker compose` を sudo なしで実行するには、必要に応じてユーザーを `docker` グループに追加してください。

## 2. まず `.env` を作成する（必須）

`.env.example` をコピーして `.env` を作成します。

```bash
cp .env.example .env
```

最低限、以下が入っていることを確認してください。

- `AWS_ENDPOINT_URL=http://localstack:4566`
- `LOCAL_S3_BUCKET=hobby-ec-local-bucket`
- `LOCAL_SQS_QUEUE_NAME=hobby-ec-local-queue`
- `DATABASE_URL=postgresql://hobby_ec:hobby_ec@db:5432/hobby_ec_local`

## 3. ローカル開発起動（推奨: `docker-compose.local.yml`）

### 起動

```bash
docker compose -f docker-compose.local.yml up --build
```

起動後の主要エンドポイント:

- アプリ: `http://localhost:3000`
- LocalStack: `http://localhost:4566`
- Postgres: `localhost:5432`

### LocalStack リソース作成

`localstack` コンテナ起動時、ready hook として以下が自動実行されます。

- `./localstack/init/01_create_resources.sh`

このスクリプトにより、S3/SQS のローカルリソースが作成されます（`LOCAL_S3_BUCKET` / `LOCAL_SQS_QUEUE_NAME` に追従）。

### 停止

```bash
docker compose -f docker-compose.local.yml down
```

### DB/LocalStack データも含めてリセット

```bash
docker compose -f docker-compose.local.yml down -v
```

## 4. 本番近似確認（`docker-compose.yml`）

Dockerfile の build/start 経路を使って `NODE_ENV=production` で確認します。

```bash
docker compose up --build
```

停止:

```bash
docker compose down
```

## 5. 起動確認チェックリスト

### 5.1 アクセス確認

- [ ] `http://localhost:3000` が表示できる
- [ ] `http://localhost:3000/api/localstack/health` が 200 を返す

### 5.2 疎通確認コマンド

```bash
# アプリ health（JSONで ok:true 想定）
curl -s http://localhost:3000/api/localstack/health

# LocalStack の状態
curl -s http://localhost:4566/_localstack/health

# コンテナ状態確認
docker compose -f docker-compose.local.yml ps
```

### 5.3 ログの見方

```bash
# 全サービス追従
docker compose -f docker-compose.local.yml logs -f

# サービス個別
docker compose -f docker-compose.local.yml logs -f web
docker compose -f docker-compose.local.yml logs -f db
docker compose -f docker-compose.local.yml logs -f localstack
```

## 6. トラブルシュート（失敗しやすいポイント）

### 6.1 ポート競合（3000 / 5432 / 4566）

症状:

- `Bind for 0.0.0.0:3000 failed: port is already allocated`
- `Port 5432 is already in use` など

対処:

- 競合プロセスを停止する。
- 既存コンテナが残っている場合は `docker compose -f docker-compose.local.yml down` を実行してから再起動する。

### 6.2 `.env` 不足・値不整合

症状:

- `env_file .env not found`
- アプリは起動したが S3/SQS 接続に失敗する

対処:

- `cp .env.example .env` を再実行し、必須値が存在するか確認する。
- LocalStack を使う場合、`AWS_ENDPOINT_URL` は `http://localstack:4566`（**コンテナ内名前解決**）を使う。

### 6.3 コンテナ内/外で接続先を混同する

ポイント:

- **web コンテナから db へ**: `db:5432`（`localhost` ではない）
- **ホストPCから db へ**: `localhost:5432`
- **web コンテナから LocalStack へ**: `http://localstack:4566`
- **ホストPCから LocalStack へ**: `http://localhost:4566`

### 6.4 初回 `npm install` が遅い

症状:

- `web` 起動時に時間がかかる（`npm install` 実行中）

理由:

- `docker-compose.local.yml` の `web` は起動コマンドで `npm install && npm run dev` を実行するため、初回は依存解決に時間がかかります。

対処:

- 初回は数分待つ。
- 途中経過は `docker compose -f docker-compose.local.yml logs -f web` で確認する。

### 6.5 ボリューム権限（主に Linux）

症状:

- `EACCES` や `permission denied` が出る

対処:

- プロジェクト配下ファイルの所有権/権限を見直す。
- 既存ボリュームが壊れている場合は `docker compose -f docker-compose.local.yml down -v` 後に再起動する。

## 7. 参考（最短の Node.js 単体起動）

依存サービスを使わず画面だけ確認したい場合:

```bash
npm ci
npm run dev
```

> ただし Postgres / LocalStack 依存機能は確認できないため、通常開発は Compose 起動を推奨します。
