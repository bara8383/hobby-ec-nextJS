# Hobby EC Next.js

Next.js App Router ベースのミニ EC サイトです。

## 実装済み

- **Next.js 最新設計**: App Router / Server Components / Metadata API を利用
- **SEO最適化**: title・description・OGP・JSON-LD（ItemList + Product）
- **リアルタイムチャット**: SSE + Route Handler (`/api/chat`)
- **AWS最小コスト方針**: 単一コンテナを前提に、Lightsail Container or App Runner 小サイズ構成で運用

## ローカル起動（Node.js）

```bash
npm ci
npm run dev
```

`http://localhost:3000`

## ローカル起動（Container）

```bash
docker compose up --build
```

## AWS 低コストデプロイ案

1. Dockerイメージを ECR に push
2. **Lightsail Containers** の最小プラン（低トラフィック向け）にデプロイ
3. トラフィック増加時のみ App Runner/ECS Fargate へ移行

> メモ: チャットはインメモリ保持のため、複数インスタンス運用時は ElastiCache / DynamoDB への置き換えが必要です。
