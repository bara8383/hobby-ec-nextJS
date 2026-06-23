1. Context observed

- この subagent は `improvement-proposer` として、実装・編集・採用判断は行わず、改善 option の提示のみを行う前提で確認した。参照した主な terminal command は `git status --short`, `git log --oneline -5`, `rg --files ...`, `cat .codex/agents/improvement-proposer.toml`, `cat docs/ai/output/human-review/001-human-review.md`, `sed -n ...`, `nl -ba ...`。
- repository は Next.js App Router 構成で、`next@15.1.6`, `react@19.0.0`, TypeScript を使っている。`npm run lint`, `npm run build`, `next dev`, `next start` scripts も定義されている。 【F:package.json†L5-L16】
- human review は、現在の UI が「落ち着きがあり、洗練されたサイト」から離れており、構成や統一感が弱いと指摘している。特に「タイトル・説明・検索バー・ナビゲーション要素」が上部の一つのカード内に詰め込まれているように見え、タイトル領域と検索/操作領域を分離したいという方向性が示されている。 【F:docs/ai/output/human-review/001-human-review.md†L5-L12】【F:docs/ai/output/human-review/001-human-review.md†L17-L37】【F:docs/ai/output/human-review/001-human-review.md†L41-L62】
- human review の High 改善案は、ヘッダー周辺レイアウト再設計、タイトル領域と検索領域の分離、上部の大きなカードへの集約回避、情報の役割ごとのセクション分離である。 【F:docs/ai/output/human-review/001-human-review.md†L66-L73】
- 現在の home page では、hero section 内に slideshow / overlay / label / h1 / `HomeKeywordSearchBar` / 説明文がまとまっている。これは human review の「タイトル・説明・検索バーを同じ上部カードにまとめない」という要望とまだ近い構造に見える。 【F:app/page.tsx†L146-L160】
- home page には、feature topics、注目商品、新着商品、ランキング風説明、カテゴリ、価格帯、タグ、chat CTA など、複数の発見導線が既にある。 【F:app/page.tsx†L162-L179】【F:app/page.tsx†L194-L223】【F:app/page.tsx†L225-L275】
- `SiteHeader` は site logo と nav を持ち、さらに header 内でログイン中ユーザー/権限を `hero-label` style で常時表示している。これは開発/デモ情報としては有用だが、一般 user 向けの「落ち着いた洗練 UI」にはノイズになり得る。 【F:components/layout/SiteHeader.tsx†L13-L33】
- `HomeKeywordSearchBar` は現在の pathname に対して `q` を付け替える `router.replace` 型で、home page 内の検索状態更新として動く設計である。検索実行後に `/search?q=...` へ移動する導線ではない。 【F:components/search/HomeKeywordSearchBar.tsx†L10-L35】【F:components/search/HomeKeywordSearchBar.tsx†L37-L59】
- `/search` は前 cycle で `q`, `category`, `tag`, `priceMin`, `priceMax`, `sort` を parse し、商品検索へ渡す構造になっている。 【F:app/(store)/search/page.tsx†L17-L49】【F:app/(store)/search/page.tsx†L107-L135】
- `/search` の metadata/canonical は、raw query parameter から canonical path を作っており、quality review は invalid `priceMin`, `priceMax`, `sort` が canonical に残る低重大度 issue を指摘している。 【F:app/(store)/search/page.tsx†L56-L67】【F:app/(store)/search/page.tsx†L99-L104】【F:docs/ai/output/quality-reviewer/001-quality-review.md†L42-L69】
- `ProductCard` は Product microdata、placeholder image、favorite、name、price、detail CTA を表示するが、category / tag / license / file format / 即時 DL などの比較情報は visible UI としてはまだ少ない。 【F:components/ProductCard.tsx†L31-L58】
- CSS 上、`main` は site-wide max-width/padding を持ち、`.hero` は border, radius, shadow, background, overlay を持つ大きな card-like section として定義されている。 【F:app/globals.css†L129-L136】【F:app/globals.css†L722-L731】
- 事実と仮定の分離:
  - 事実: human review は「落ち着いた・洗練された UI」「ヘッダー/上部エリアの情報設計」「タイトルと検索の分離」を強く求めている。 【F:docs/ai/output/human-review/001-human-review.md†L7-L11】【F:docs/ai/output/human-review/001-human-review.md†L68-L79】
  - 事実: 前 cycle の quality review で `/search` canonical 正規化の小さな SEO issue が残っている。 【F:docs/ai/output/quality-reviewer/001-quality-review.md†L44-L69】
  - 仮定: 次 cycle は broad rewrite ではなく、human review で明示された top UI/IA の違和感を小さく解消するのが最も安全。
  - 仮定: production 向けには header の権限表示は必要最小限に抑え、account/admin など適切な場所に移す方が ecommerce UX と信頼感に合う。

2. Improvement options

- Option A
  - Purpose: home hero を「ブランド/価値提案」領域と「検索/操作」領域に分離し、human review の High 指摘に最小 scope で対応する。
  - Expected impact:
    - UX: 上部の視線導線が整理され、h1 と説明文を読ませる領域、検索する領域が明確になる。
    - Ecommerce UX: user が「まず価値を理解する」「次に検索する」という流れを取りやすくなる。
    - SEO/AEO: h1 と説明文が検索 form に埋もれにくくなり、page の primary topic が machine-readable に明確になる。
    - A11y: search form を独立 section にし、`aria-labelledby` を付けることで landmark/section navigation が分かりやすくなる。
  - Implementation cost: Medium
  - Risks:
    - visible design change のため、スクリーンショット確認が必要。
    - hero visual を弱めすぎると現状の「特集感」が減る可能性がある。
    - home page の上部余白が増えすぎると first view の商品導線が下がる。
  - Adoption decision points:
    - 検索 form は hero 直下の独立 card にするか、header 下の sticky/search band にするか。
    - hero の slideshow/background を維持するか、より静的で落ち着いた editorial header にするか。
    - h1 下の長い説明文は短縮するか、別 section に移すか。
    - validation: desktop/mobile screenshot、keyboard tab order、`h1` が 1 つであること、search form の accessible name、Lighthouse/axe 相当の landmark 確認。

- Option B
  - Purpose: `SiteHeader` の情報密度を下げ、ログイン/権限表示を account/admin 向けの控えめな場所へ移す、または production-like 表示では非表示にする。
  - Expected impact:
    - UX: header が logo/navigation に集中し、落ち着いた ecommerce site に近づく。
    - Ecommerce trust: 「権限: guest/admin」などの内部状態表示が一般 shopper の視界に入りにくくなり、デモ感を抑えられる。
    - SEO/AEO: 直接の ranking impact は小さいが、header の boilerplate/noise が減り、main content への集中度が上がる。
    - Security perception: 実権限名を常時見せる設計から離れられる。
  - Implementation cost: Low
  - Risks:
    - 開発/レビュー時に現在の user role が見えにくくなる。
    - guest/admin/seller navigation の切り替え確認が少し不便になる。
    - 既存 E2E/manual review が header 内の表示に依存している場合は調整が必要。
  - Adoption decision points:
    - ログイン状態表示は header 右端に「マイページ」だけ残すか、完全に account page へ移すか。
    - demo/debug 表示は environment flag で開発時だけ表示するか。
    - admin/seller role の明示は `/admin` / `/seller` 側だけでよいか。
    - validation: guest/login/admin の header screenshot、nav items の表示確認、mobile wrapping 確認。

- Option C
  - Purpose: quality review が残した `/search` canonical 正規化 issue を修正候補として扱い、invalid/raw query が canonical に残らないようにする。
  - Expected impact:
    - SEO: invalid parameter URL の canonical inconsistency を減らし、`noindex, follow` と canonical の整合性が上がる。
    - AEO: search result metadata が実際の正規化済み条件に近づき、AI crawler / search engine にとって URL intent が明確になる。
    - Maintainability: `parseFilters` と canonical generation の責務を揃えられる。
  - Implementation cost: Low
  - Risks:
    - `sort=newest` を canonical に含める/含めない判断で URL policy が揺れる可能性がある。
    - `category` / `tag` の unknown value をどう canonical 化するか決める必要がある。
    - `/search` は `noindex` なので business impact は小さく、human review の UI 改善より優先度を上げすぎると product feedback 対応が遅れる。
  - Adoption decision points:
    - canonical は normalized filters から生成するか、raw params を sanitize するだけにするか。
    - `sort=newest` は default として canonical から省くか、明示的に残すか。
    - unknown `category` / `tag` は現状通り残すか、known values のみに制限するか。
    - validation: `/search?priceMin=-1`, `/search?priceMax=abc`, `/search?sort=invalid`, `/search?priceMin=3000&sort=price_asc` の metadata/canonical 確認。 【F:docs/ai/output/quality-reviewer/001-quality-review.md†L64-L69】

- Option D
  - Purpose: `ProductCard` に category / file format / license / 即時 DL など、購入判断に必要な最小限の visible attribute を追加する。
  - Expected impact:
    - Ecommerce UX: listing 上で比較できる情報が増え、商品詳細へ行く前の判断がしやすくなる。
    - SEO/AEO: Product entity の visible content と structured/microdata の整合が高まり、AI engine が商品特徴を把握しやすくなる。
    - Conversion: ライセンスや形式への不安をカード段階で減らせる。
  - Implementation cost: Medium
  - Risks:
    - card density が上がり、human review の「落ち着きがない」印象を悪化させる可能性がある。
    - home / search / category / ranking / deals など複数 surface に同じ card が出るため、見た目の影響範囲が広い。
    - 詳細表示項目を増やしすぎると CTA が埋もれる。
  - Adoption decision points:
    - 今回は「category + file format + license」程度に限定するか。
    - tag は表示しない/1個だけ/複数 chip のどれにするか。
    - home の featured/new arrivals と listing で同じ密度にするか、compact variant を設けるか。
    - validation: grid density の desktop/mobile screenshot、Product microdata と visible text の整合確認。

- Defer option
  - Purpose: realtime chat backend 統合、AWS deployment/infrastructure、category/tag FAQ/HowTo content 拡張は今回 defer する。
  - Expected impact:
    - cycle を human review の top UI/IA feedback と search SEO caveat に集中できる。
    - AWS cost や chat regression risk を増やさず、安全な visible improvement に限定できる。
    - AEO content 拡張は human-approved content strategy 後に行うことで thin/repetitive content risk を抑えられる。
  - Implementation cost: Low
  - Risks:
    - realtime chat capability と AWS production readiness は進まない。
    - category/tag landing page の AEO 強化は次 cycle 以降になる。
  - Adoption decision points:
    - 今回の目的を「human review の UI 違和感解消」に絞るか。
    - chat/AWS は次の dedicated architecture review に回すか。
    - FAQ/HowTo は content guideline 作成後に回すか。

3. Recommended decision-reviewer focus

- 最も判断すべき焦点は、Option A と Option B を同じ cycle で小さく採用するかどうか。
  - human review の High 指摘に最も直接対応するのは Option A。
  - header のノイズを減らして「落ち着いた、洗練された」印象に寄せる補助策として Option B は低 cost。
- Option C は quality-reviewer の明確な low issue なので、UI 改修と一緒に入れてもよい。ただし human review 対応が主目的なら、Option C は「同時に直す小修正」または「次 cycle の first issue」として扱うのが妥当。
- Option D は ecommerce/AEO value はあるが、card density が増えるため、human review の「見せ方が整理されていない」という指摘と衝突し得る。今回採用するなら表示項目をかなり絞るべき。
- Defer 推奨:
  - realtime chat backend の整理
  - AWS deploy/cost optimization
  - category/tag FAQ/HowTo content generation
  - broad visual redesign / full design system rewrite
- decision-reviewer は、次 cycle の acceptance criteria を「home first view が title/value proposition と search action に分離されている」「header に debug/role 感が出すぎない」「search canonical caveat を直すか延期するか」に絞ると安全。

4. Open questions or assumptions for decision-reviewer

- home hero の検索 form は、hero から完全に出して独立 section にするべきか、それとも hero 内で visual separation だけ強めれば十分か。
- hero slideshow は「洗練された編集感」に寄与しているか、それとも card-like/noisy な印象の原因になっているか。
- header の「ログイン中: displayName / 権限: ...」は production-like UI でも必要か、開発/debug 専用表示にするべきか。 【F:components/layout/SiteHeader.tsx†L27-L32】
- home search は現在 home URL の query を更新するが、user expectation と SEO/AEO を考えると `/search?q=...` に遷移する方が自然か。 【F:components/search/HomeKeywordSearchBar.tsx†L16-L35】
- `/search` canonical normalization は今回の UI cycle に含めるか、SEO maintenance cycle に分けるか。
- ProductCard の情報追加は human review の「落ち着き」改善後に再評価するか、今回ごく小さく入れるか。
- スクリーンショット基準として、どの viewport を human review の主対象にするか。例: desktop 1440px、tablet、mobile 390px。
- AEO content を増やす場合、human-approved な FAQ/HowTo tone と重複回避ルールを先に決める必要がある、という前提でよいか。
