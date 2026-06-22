1. レビュー概要

- quality-reviewer の判定: **条件付きでレビュー可能**。
- 実装された範囲:
  - `/search` が `q`、`category`、`tag`、`priceMin`、`priceMax`、`sort` の検索パラメータに対応した。
  - パラメータ付き検索結果ページは SEO 上 conservative に `noindex, follow` として扱う。
  - root layout は nested `<main>` landmark を作らなくなり、skip link の遷移先 `#main` は維持された。
- 主な caveat:
  - 検索処理では無効な値を無視または正規化するが、canonical URL には `priceMin=-1` や `sort=invalid` のような raw な無効値が残る場合がある。

2. 変更内容

- 検索機能:
  - `/search` は keyword、category、tag、価格帯、sort を既存の商品検索フローで処理する。
  - 検索ページには結果件数、適用中条件、条件に応じた empty state を表示する。
- SEO/AEO metadata:
  - パラメータなしの `/search` は通常の検索ページとして扱う。
  - 対応済みパラメータを持つ `/search?...` は `noindex, follow` として扱う。
- アクセシビリティ/セマンティック構造:
  - root layout の wrapper を `<main id="main">` から `<div id="main">` に変更した。
  - ページ component 側が page-level `<main>` landmark を持つ方針を維持した。

3. 確認すべき場所

## 画面 / routes / URLs

- `/search`
  - 基本の検索ページ。
- `/search?priceMin=3000`
  - home の価格帯ショートカット相当の絞り込みを確認する。
- `/search?priceMax=2000`
  - 上限価格の絞り込みを確認する。
- `/search?q=素材&category=photo&sort=price_asc`
  - keyword、category、sort の組み合わせを確認する。
- `/search?tag=商用利用&priceMin=1000&priceMax=5000&sort=price_desc`
  - tag、価格帯、降順 sort の組み合わせを確認する。
- `/`
  - home の価格帯ショートカットが正しく遷移することを確認する。
- 代表的な product/category/tag ページ
  - root の `<main>` とページ側 `<main>` が nested になっていないことを確認する。

## 関連ファイル

- `app/(store)/search/page.tsx`
- `app/layout.tsx`
- `lib/seo/metadata.ts`
- `data/products.ts`

4. 検証手順

1. ローカルでアプリを起動する。
   - 推奨コマンド: `npm run dev`
2. `/search?priceMin=3000` を開く。
   - 表示される商品が 3,000円以上であることを確認する。
   - `3,000円以上` のような適用中条件が表示されることを確認する。
3. `/search?priceMax=2000` を開く。
   - 表示される商品が 2,000円以下であることを確認する。
4. `/search?q=素材&category=photo&sort=price_asc` を開く。
   - 条件が組み合わさって適用されることを確認する。
   - 価格が安い順に並ぶことを確認する。
5. `/search?q=zzzzzzzz&priceMin=999999` を開く。
   - 条件に一致する商品がない場合の empty state が表示されることを確認する。
6. パラメータ付き検索ページの metadata を確認する。
   - `noindex, follow` 相当の robots 設定があることを確認する。
7. plain `/search` の metadata を確認する。
   - filter 用の noindex 挙動が不要に付与されていないことを確認する。
8. keyboard navigation で skip link を操作する。
   - `#main` に移動できることを確認する。
9. landmark を確認する。
   - root layout が全 route を `<main>` で包んでいないことを確認する。
   - 代表ページに page-level `<main>` が存在することを確認する。

5. 以前の挙動と現在の挙動

| 項目 | 以前 | 現在 |
|---|---|---|
| `/search?priceMin=3000` | 価格パラメータが検索ページで無視される場合があった。 | 最低価格で絞り込む。 |
| `/search?priceMax=2000` | 価格パラメータが検索ページで無視される場合があった。 | 最高価格で絞り込む。 |
| 複合条件 | 主に keyword 検索として動作していた。 | keyword、category、tag、価格帯、sort を組み合わせて処理する。 |
| 検索結果説明 | 適用中条件が分かりにくかった。 | 件数と適用中条件を表示する。 |
| empty state | 条件に応じた説明が弱かった。 | 検索条件の調整を促す。 |
| SEO | パラメータ付き検索結果の扱いが明示的でなかった。 | `noindex, follow` として conservative に扱う。 |
| landmark | root layout と page component の `<main>` が nested になる場合があった。 | root は `<div id="main">`、page 側が `<main>` を持つ。 |

6. 既知の未解決事項

- 低重大度の SEO metadata caveat:
  - canonical URL は raw な対応済み query parameter から生成される。
  - 検索処理では無効値を無視または正規化するが、canonical metadata には残る場合がある。
  - 例:
    - `/search?priceMin=-1`
    - `/search?priceMax=abc`
    - `/search?sort=invalid`
- 影響:
  - 検索結果の表示には影響しない。
  - パラメータ付き検索ページは noindex のため、今回の product review をブロックしない。
  - 次回以降、canonical も正規化済み条件から生成する改善を検討するとよい。

7. human reviewer 向け decision points

- 検索 UX:
  - 適用中条件のラベルは分かりやすいか。
  - default の `newest` も常に表示すべきか。
  - 結果なし時の文言は十分に親切か。
- SEO/AEO:
  - パラメータ付き `/search` をすべて `noindex, follow` とする方針でよいか。
  - `/search?q=...` も conservative に noindex とする方針でよいか。
  - 次回 canonical の正規化 caveat を優先的に直すべきか。
- navigation:
  - home の価格帯ショートカットは `/search` のままでよいか。
  - 将来的に `/products` を primary filtered listing にするか。
- accessibility:
  - skip link の動作は問題ないか。
  - page-level `<main>` の範囲は自然か。

8. human review checklist

- [ ] `/search` がパラメータなしで表示される。
- [ ] `/search?priceMin=3000` が価格で絞り込む。
- [ ] `/search?priceMax=2000` が価格で絞り込む。
- [ ] keyword、category、tag、価格帯、sort の複合条件が動作する。
- [ ] 結果件数が表示商品数と一致する。
- [ ] 適用中条件が URL パラメータと一致する。
- [ ] 結果なし時の empty state が表示される。
- [ ] パラメータ付き検索ページを indexable SEO landing page として扱っていない。
- [ ] filtered/search-result pages の robots metadata が conservative である。
- [ ] skip link が keyboard navigation で動作する。
- [ ] root layout が nested `<main>` を作っていない。
- [ ] ProductCard の意図しない redesign が含まれていない。
- [ ] カテゴリ/タグ FAQ 追加が含まれていない。
- [ ] chat architecture や AWS deployment の変更が含まれていない。
- [ ] raw invalid canonical params の caveat を今回許容するか、follow-up にするか判断した。

9. 次回 improvement-proposer cycle 向け feedback format

```md
## プロダクトレビュー結果

判断:
- Accept / Accept with follow-up / Request changes

レビューした routes:
- /search
- /search?priceMin=3000
- /search?priceMax=2000
- /search?q=素材&category=photo&sort=price_asc
- Other:

良かった点:
- 

見つかった問題:
- 

SEO/AEO feedback:
- 

Accessibility feedback:
- 

次の優先事項:
1. 
2. 
3. 

次回 canonical caveat を扱うべきか:
- Yes / No / Later

追加メモ:
- 
```
