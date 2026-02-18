# Digital Creator Market (Next.js)

壁紙・写真・図やイラスト・デジタル音楽を販売する、Next.js App Router ベースのデジタル商品ECです。

## 実装済み

- **Next.js 最新設計**: App Router / Server Components / Metadata API / Route Handlers
- **SEO最適化**:
  - サイト全体の metadata（title/description/keywords/OGP/canonical）
  - 商品一覧 + 商品詳細の JSON-LD（`ItemList` / `Product`）
  - 商品詳細ページごとの `generateMetadata`
- **リアルタイムチャット**: SSE + Route Handler (`/api/chat`) + クライアントウィジェット
- **AWS最小コスト方針**: standalone 出力を使った単一コンテナ前提（Lightsail Containers 小構成を想定）

## ローカル起動（Node.js）

```bash
npm install
npm run dev
```

`http://localhost:3000`

## ローカル起動（Container）

```bash
docker compose up --build
```

## 追加ドキュメント

- ローカル実行手順（本番近似）: `docs/local-development/README.md`
- Codex Environment Setup Script 運用: `docs/codex/ENV_SETUP.md`
- 将来AWS構成（Mermaid/テキスト図）: `docs/future-aws-architecture/README.md`

## CI（GitHub Actions）

`main` 向けの `push` / `pull_request` では CI を必ず実行し、`npm ci` → `lint`（存在時のみ）→ `build`（必須）→ `test`（存在時のみ）を検証します。
ローカル検証はコンテナでの再現性確認、マージ可否は CI の結果を基準に運用する想定です。

## AWS 低コストデプロイ案

1. Dockerイメージを ECR へ push
2. **Lightsail Containers** の最小プランで公開
3. 需要増加時のみ App Runner / ECS Fargate へ移行

> メモ: チャットはインメモリ保持です。本番で複数インスタンス化する場合は ElastiCache か DynamoDB への置換が必要です。
