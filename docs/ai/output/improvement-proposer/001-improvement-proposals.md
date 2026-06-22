1. 観測した context

- この repository は Next.js App Router の ecommerce app で、Next.js 15.1.6、React 19、TypeScript を利用している。
- `app/(store)` と `app/(admin)` の route group、async `searchParams` / `params`、`generateMetadata`、`generateStaticParams`、sitemap、robots、Open Graph、Twitter metadata、Product JSON-LD、FAQ JSON-LD、breadcrumbs など、現代的な App Router 構成がすでに導入されている。
- 商品発見導線は比較的充実している。
  - home には hero search、featured products、new arrivals、categories、tags、価格帯ショートカット、ranking 風の説明 UI、chat CTA がある。
  - product listing は data layer で query/category/tag/price/sort の filter に対応している。
  - category と tag の hub/detail page があり、sitemap にも含まれている。
- 商品詳細には metadata、JSON-LD、FAQ JSON-LD、seller summary、add-to-cart、cart、terms、FAQ、商品別 chat CTA、related products がある。
- chat 機能は複数世代の実装が共存しているように見える。
  - `lib/chat/core/*` と `/chat/[conversationId]` が新しい in-memory 商品連動 chat flow に見える。
  - `lib/chat/repository.ts`、`sse-broker.ts`、`queue.ts`、SSE/SQS docs も残っている。
- SEO/AEO の基盤は強いが、小さな gap がある。
  - home の価格帯ショートカットは `/search?priceMin=...` へ遷移するが、`/search` は `priceMin` / `priceMax` を無視している。
  - ProductCard は microdata を持つが、表示情報として category、tags、license、file format、即時 download などが不足している。
  - root layout が `<main id="main">` で全ページを包み、各 page も `<main>` を持つため nested main landmark になり得る。
- 今回の cycle は、大規模 rewrite ではなく、商品 UX / SEO / accessibility の小さく安全な改善に集中する前提で提案する。

2. 改善 option

- Option A
  - 目的: `/search` が `priceMin`、`priceMax`、`category`、`tag`、`sort` を正しく扱い、home 価格帯ショートカットや将来の filtered search URL が意図通り動くようにする。
  - 期待効果:
    - ecommerce UX: 価格帯ショートカットを押した user が期待通りの検索結果を得られる。
    - SEO/AEO: 検索結果ページの intent を明確にし、thin/duplicate な parameter URL の扱いを整理できる。
    - maintainability: 既存の `ProductSearchFilters` と `searchProducts` を再利用できる。
  - 実装コスト: 低
  - リスク:
    - parameterized search pages を indexable にすると thin/duplicate URL が増える可能性がある。
    - `/products` と query parsing が重複しやすい。
  - 採用判断点:
    - filtered `/search` を indexable にするか、`noindex, follow` にするか。
    - home の価格帯ショートカットを `/search` のままにするか、`/products` に寄せるか。

- Option B
  - 目的: `ProductCard` に category、上位 tags、file format/license、seller rating/favorite count、即時DL badge などを表示する。
  - 期待効果:
    - ecommerce UX: 商品詳細へ移動しなくても比較しやすくなる。
    - SEO/AEO: 商品 entity の context が増え、human と AI engine の理解を助ける。
  - 実装コスト: 低 to 中
  - リスク:
    - card density が上がり、home や listing の見た目に影響する。
    - structured data と visible content の整合性に注意が必要。
  - 採用判断点:
    - どの field を card に出すか。
    - home と listing で同じ密度にするか。
    - tags/categories を link にするか plain label にするか。

- Option C
  - 目的: root layout と page component の nested `<main>` landmark を解消する。
  - 期待効果:
    - accessibility: screen reader の landmark navigation が明確になる。
    - maintainability: layout は shell、page は main content という convention が明確になる。
    - SEO/AEO: semantic HTML の構造が改善される。
  - 実装コスト: 低
  - リスク:
    - skip link の target を維持する必要がある。
    - page-level `<main>` がない route がないか確認が必要。
  - 採用判断点:
    - root は `<div id="main">` にして page 側が `<main>` を持つ方針にするか。
    - 逆に layout が唯一の `<main>` を持つ方針にするか。

- Option D
  - 目的: category/tag detail page に AEO 向け FAQ/HowTo content block を追加する。
  - 期待効果:
    - SEO/AEO: category/tag page が intent-specific な質問に答えやすくなる。
    - ecommerce UX: organic search から来た user が選び方を理解しやすくなる。
  - 実装コスト: 中
  - リスク:
    - generic な template 文章が thin/repetitive content になり得る。
    - FAQ JSON-LD は visible FAQ と一致させる必要がある。
  - 採用判断点:
    - category から始めるか、tag から始めるか、両方か。
    - content をどこに持つか。

- Option E
  - 目的: chat abstraction の重複を整理するか、少なくとも active path を文書化する。
  - 期待効果:
    - maintainability: `lib/chat/core/*` と古い chat module の関係が明確になる。
    - realtime roadmap: 今後どの implementation を伸ばすべきか判断しやすくなる。
    - AWS cost control: 複数方式を同時に運用する無駄を避ける。
  - 実装コスト: 中 to 高
  - リスク:
    - code cleanup は chat/admin monitor flow を壊す可能性がある。
  - 採用判断点:
    - 今回は user-facing UX 改善を優先するか、chat architecture hygiene を優先するか。

- Defer option
  - 目的: AWS deployment と broad chat backend rewrite は延期する。
  - 期待効果:
    - cycle を小さく安全に保つ。
    - 不要な cost と operational complexity を避ける。
  - 実装コスト: 低
  - リスク:
    - realtime chat と AWS deployment は production-grade には近づかない。

3. decision-reviewer に推奨する focus

- 最優先: Option A と Option C を採用する。
  - Option A は home 価格帯ショートカットと `/search` の実挙動の不一致を直す。
  - Option C は accessibility/semantic issue を小さな変更で直せる。
- 次点: UI 変更を許容するなら Option B を検討する。ただし今回は deferred が妥当。
- Option D、Option E、AWS/realtime backend rewrite は今回 defer を推奨する。

4. decision-reviewer 向けの open questions / assumptions

- parameterized `/search` pages は indexable にするか、`noindex, follow` にするか。
- home の価格帯ショートカットは `/search` のままにするか、`/products` に寄せるか。
- active chat implementation は `lib/chat/core/*` か。
- ProductCard に seller trust metric を出すべきか。
- 今回の cycle に visual CSS 変更を含めるべきか、semantic/functionality に限定すべきか。
