1. 判断概要

- **Option A** を narrow scope で Accepted とする。`/search` が既存の商品 filter query parameter (`q`, `category`, `tag`, `priceMin`, `priceMax`, `sort`) を扱い、既存の product search/filter model を再利用し、filtered search pages は `noindex, follow` で conservative に扱う。
- **Option C** を narrow scope で Accepted とする。skip link target と page-level main landmark を維持しながら nested `<main>` landmark を解消する。
- **Option B** は Deferred とする。価値はあるが、card density と CSS の visible risk があり、まず検索機能と semantic accessibility の修正を優先する。
- **Option D** は Deferred とする。AEO FAQ/HowTo は有用だが、generic/thin content を避けるため content strategy が必要である。
- **Option E** は Deferred とする。chat architecture の整理は重要だが、今回の cycle には大きく risk が高い。
- outright rejection はなし。採用しなかった提案は repository の方向性とは一致するが、今回の narrow pass では実装しない。

2. 採用項目

- 項目ラベル: **Option A — `/search` の filters と canonicalization を修正**
  - 実装 scope:
    - `/search` で次の query parameter を解析し適用する。
      - `q`
      - `category`
      - `tag`
      - `priceMin`
      - `priceMax`
      - `sort`
    - 可能な限り既存の商品 filter/search logic を再利用し、新しい検索実装を作らない。
    - home page の価格帯ショートカット `/search?priceMin=...` が実際に filter 済み結果を返すようにする。
    - 見出し、empty state、result summary などで適用中の条件が user に分かるようにする。
    - parameterized search result pages は primary SEO landing page ではなく utility/result page として扱う。
    - query/filter parameter がある場合は `robots: { index: false, follow: true }` を使う。
    - arbitrary filter combination を indexable な thin page として生成しない。
  - 採用理由:
    - home の価格帯ショートカットが `/search?priceMin=...` を指しているのに `/search` が price filter を無視する、という明確な user-facing mismatch を修正する。
    - ecommerce UX を改善し、探索導線を信頼できるものにする。
    - SEO/AEO 上、duplicate/thin URL の index risk を抑えられる。
    - 実装コストが低く、reversible である。

- 項目ラベル: **Option C — nested `<main>` landmark の解消**
  - 実装 scope:
    - root layout と page component の双方が `<main>` を出すことによる nested landmark を解消する。
    - 小さい convention change として、root layout は `<div id="main">` のような non-landmark skip target を使う。
    - page component 側が page-level `<main>` landmark を持つ方針を維持する。
    - skip link behavior を維持する。
    - 必要以上に全 page を大規模 refactor しない。
  - 採用理由:
    - accessibility/semantic HTML の concrete issue を低 risk で修正できる。
    - machine-readable page structure の改善により SEO/AEO 品質にも間接的に寄与する。
    - 小さく reversible な変更である。

3. 却下項目

- なし。

4. 延期項目

- 項目ラベル: **Option B — ProductCard に richer visible product attributes を追加**
  - Deferred 理由:
    - ecommerce UX と AEO に価値はあるが、app 全体の grid に影響する visible design/CSS change である。
    - 今回は broken/misleading filter behavior と semantic accessibility の修正を優先する。
  - 再検討に必要な情報:
    - surface ごとの card density 方針。
    - 優先 field。
    - card 内の category/tag を link にするか label にするか。
    - responsive layout の visual acceptance criteria。

- 項目ラベル: **Option D — category/tag detail pages に AEO FAQ/HowTo を追加**
  - Deferred 理由:
    - content plan なしの template content は thin/repetitive になり得る。
    - FAQ JSON-LD は visible FAQ と一致させる必要がある。
  - 再検討に必要な情報:
    - 優先 landing pages。
    - human-approved FAQ/HowTo content guideline。
    - content の配置場所。

- 項目ラベル: **Option E — chat abstraction の整理または文書化**
  - Deferred 理由:
    - 複数世代の chat code があり、discovery と regression risk が高い。
    - 今回は frontend UX/SEO/A11y の明確な issue を優先する。
  - 再検討に必要な情報:
    - canonical active chat path。
    - legacy/future AWS preparation/still active の切り分け。
    - production realtime target。
    - chat regression test / manual QA steps。

- 項目ラベル: **AWS deployment と broad realtime backend rewrite の延期**
  - Deferred 理由:
    - accepted item は infrastructure 変更を必要としない。
    - AWS 作業は cost と operational complexity を増やす可能性がある。

5. 判断理由

- Modern Next.js architecture:
  - Option A は既存の App Router convention と product filtering type を再利用できる。
  - Option C は broad architecture rewrite なしで semantic layout を改善する。
- SEO / AEO:
  - Option A は検索結果 URL の扱いを明確にし、thin parameter combination の uncontrolled indexing を避ける。
  - Option C は landmark semantics を改善する。
- Ecommerce UX:
  - Option A は home 価格帯ショートカットから relevant results へつながる導線を改善する。
- Real-time chat:
  - Option E は重要だが、今回の検索/a11y 修正には不要である。
- Minimum AWS cost:
  - accepted items は AWS resource を追加しない。
- Learning value:
  - Option A は conservative SEO handling と既存 domain filter の再利用を学べる。
  - Option C は App Router app における accessible landmark convention を学べる。

6. implementer への 実装引き継ぎ

- 実装する accepted item:
  - **Option A**:
    - 既存の `/products` filter parsing と `searchProducts` / `ProductSearchFilters` を確認する。
    - `/search` で `q`、`category`、`tag`、`priceMin`、`priceMax`、`sort` を解析する。
    - invalid numeric value は無視または安全に normalize する。
    - result count、heading、empty state が active filters を反映するようにする。
    - query/filter parameter がある検索結果ページには `robots: { index: false, follow: true }` を適用する。
    - home price shortcut URL が filter 済み結果を返すことを確認する。
  - **Option C**:
    - root layout の wrapper を `<main id="main">` から non-landmark skip target、たとえば `<div id="main">` に変更する。
    - skip link target と keyboard behavior を維持する。
    - page-level routes が `<main>` を持つことを確認する。
- 明示的な non-goals:
  - ProductCard visual-density upgrade は実装しない。
  - category/tag FAQ/HowTo は追加しない。
  - chat repositories、SSE、SQS、`lib/chat/core` の整理はしない。
  - AWS resource や deployment 変更はしない。
  - 新しい search backend は導入しない。
  - arbitrary parameterized `/search` を indexable SEO landing page にしない。
- 推奨 validation:
  - `npm run lint`
  - `npm run build`
  - `/search?priceMin=3000`
  - `/search?priceMax=2000`
  - `/search?q=<known keyword>&category=<known category>&sort=price_asc`
  - 代表 page の HTML で nested `<main>` がないことを確認する。
  - skip link が main content area へ移動することを確認する。
