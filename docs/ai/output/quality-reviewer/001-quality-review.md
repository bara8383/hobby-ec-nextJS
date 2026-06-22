1. レビュー範囲

- 最新実装を decision-reviewer の **Accepted スコープのみ**に照らしてレビューした。
  - **Option A**: `/search` が `q`、`category`、`tag`、`priceMin`、`priceMax`、`sort` を解析して適用し、既存の商品検索ロジックを再利用し、パラメータ付き検索ページに `noindex, follow` を付与していること。
  - **Option C**: root layout の nested `<main>` landmark を解消し、skip link の遷移先を維持していること。
- レビュー対象ファイル:
  - `app/(store)/search/page.tsx`
  - `app/layout.tsx`
  - `lib/seo/metadata.ts`
  - `docs/ai/output/...`
- 実行した確認:
  - `git status --short`
  - `git log --oneline -5`
  - `git show --stat --oneline HEAD`
  - `git show --name-only --oneline HEAD`
  - `sed -n '1,240p' 'app/(store)/search/page.tsx'`
  - `sed -n '1,120p' app/layout.tsx`
  - `sed -n '1,150p' lib/seo/metadata.ts`
  - `rg "type ProductSearchFilters|function searchProducts|sort" data app components lib -n`
  - `sed -n '1,260p' data/products.ts`
  - `sed -n '1,130p' 'app/(store)/products/page.tsx'`
  - `sed -n '1,120p' components/search/HomeSearchBar.tsx`
  - `sed -n '1,80p' components/a11y/SkipLink.tsx`
  - `find app -name 'page.tsx' -maxdepth 5 -print | sort | while read f; do if ! rg -q '<main' "$f"; then echo "NO_MAIN $f"; fi; done`
  - `sed -n '1,180p' 'app/(store)/legal/LegalPageTemplate.tsx'`
  - `npm run lint && npm run build`

2. 重大度別の指摘

## 重大

- なし。

## 高

- なし。

## 中

- なし。

## 低

### 指摘 1 — 検索 canonical URL が、正規化後ではなく raw な無効フィルタ値を保持する場合がある

- **根拠**
  - `parsePrice` は無効値、非有限値、負数を検索条件から除外する。
  - `parseSort` は未対応の sort 値を `newest` にフォールバックする。
  - 一方で `buildSearchCanonical` は `q`、`category`、`tag`、`priceMin`、`priceMax`、`sort` の raw な値を canonical URL に反映する。
  - 例:
    - `/search?priceMin=-1` は検索条件としては `priceMin` なしとして扱われるが、canonical には `priceMin=-1` が残り得る。
    - `/search?sort=unknown` は `newest` として並び替えられるが、canonical には `sort=unknown` が残り得る。

- **影響**
  - 検索結果そのものは正規化済み条件を使うため、商品表示の不具合ではない。
  - パラメータ付き検索ページは `noindex, follow` のため、SEO リスクは限定的である。
  - ただし canonical metadata の一貫性としては改善余地がある。

- **推奨修正**
  - canonical URL も正規化済み filters から生成する。
  - 無効な `priceMin` / `priceMax` は canonical から除外する。
  - 未対応の `sort` は canonical から除外するか、明示的に `newest` に正規化する。

- **推奨検証**
  - `/search?priceMin=-1`
  - `/search?priceMax=abc`
  - `/search?sort=invalid`
  - `/search?priceMin=3000&sort=price_asc`
  - 上記の metadata を確認し、無効値が canonical に残らないことを検証する。

3. 指摘ごとの詳細

- 低 の指摘 1 を参照。

4. 良好だった確認項目

- `/search` は accepted scope の検索パラメータを解析している。
- `/search` は既存の `searchProducts(filters)` を再利用している。
- 無効な価格値は検索条件として安全に無視される。
- 検索結果 UI には件数、適用中条件、条件に応じた empty state が表示される。
- パラメータ付き検索ページには `robots: { index: false, follow: true }` が適用される。
- plain `/search` は通常の検索ページとして扱われる。
- root layout は `<main id="main">` ではなく `<div id="main">` を使うため、root の `<main>` とページ側 `<main>` の nested landmark が解消された。
- skip link は引き続き `#main` を指している。
- Deferred だった ProductCard 改修、カテゴリ/タグ FAQ 追加、chat 整理、AWS 変更は含まれていない。
- `npm run lint` と `npm run build` は成功した。

5. 人によるレビューの準備状況: **条件付きでレビュー可能**

- 実装は accepted scope を概ね満たしており、human product review に進められる。
- Caveat は低重大度で、`/search` の canonical URL が検索条件の正規化後ではなく raw value を使う場合がある点である。
