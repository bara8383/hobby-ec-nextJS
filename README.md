# hobby-ec-nextJS

ローカルで Next.js アプリを起動するための最小セットアップです。

## 1. 通常起動（モックデータ）

```bash
npm ci
npm run dev
```

- `http://localhost:3000` を開くと、内蔵モック商品で EC 画面を確認できます。

## 2. docs/localstack-template と連携して起動

`docs/localstack-template/docker-compose.yml` を使って LocalStack を立ち上げると、
`EC_API_BASE_URL` 経由で商品一覧・注文APIを参照できます。

```bash
cp .env.example .env.local
# 必要に応じて EC_API_BASE_URL を変更
npm run dev
```

`.env.local` 例:

```env
EC_API_BASE_URL=http://localhost:4566/restapis/<REST_API_ID>/dev/_user_request_
```

> `EC_API_BASE_URL` を設定しない場合は、アプリ内モックデータへ自動フォールバックします。
