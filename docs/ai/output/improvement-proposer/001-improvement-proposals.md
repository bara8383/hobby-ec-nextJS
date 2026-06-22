1. Context observed

- Repository is a Next.js App Router ecommerce app using Next.js 15.1.6, React 19, TypeScript, and npm scripts for `build`, `lint`, and CI checks.
- The app already has several modern App Router patterns:
  - Route groups under `app/(store)` and `app/(admin)`.
  - Async `searchParams` / `params` usage compatible with current Next.js conventions.
  - `generateMetadata`, `generateStaticParams`, sitemap, robots, Open Graph, Twitter metadata, Product JSON-LD, FAQ JSON-LD, and breadcrumbs.
- Product discovery is already fairly developed:
  - Home page includes hero search, featured products, new arrivals, categories, tags, price shortcuts, ranking-style UI explanation, and chat CTA.
  - Product listing supports query/category/tag/price/sort filters at the data layer.
  - Category and tag hub/detail pages exist and are included in sitemap.
- Product detail already has:
  - Product metadata and JSON-LD.
  - FAQ JSON-LD.
  - Seller summary.
  - Add-to-cart, cart, terms, FAQ, and product-specific chat CTA.
  - Related products.
- Chat functionality exists in two generations/areas:
  - `lib/chat/core/*` and `/chat/[conversationId]` appear to power the newer in-memory product-linked chat flow.
  - Older-looking `lib/chat/repository.ts`, `sse-broker.ts`, `queue.ts`, and docs for SSE/SQS also exist.
  - Product detail and chat list already connect product-specific chat sessions.
- SEO/AEO foundations are strong, but there are still small gaps:
  - Search page only canonicalizes and applies `q`; price shortcuts on home link to `/search?priceMin=...`, but `/search` currently ignores `priceMin` / `priceMax`.
  - Product cards include Product microdata but only expose name and offer price; visible card content omits category, tags, license, file format, and immediate-download indicators even though the data model has these fields.
  - Root layout wraps all pages in `<main id="main">`, while many pages also render their own `<main>`, creating nested main landmarks and potentially weaker accessibility semantics.
- Repository documentation includes an existing UI enhancement proposal with phased ideas around home hierarchy, product cards, product detail, chat CTA, and minimal design-system work. Current implementation appears to have already addressed many Phase 1/2 items, so proposals should be incremental rather than broad rewrites.
- Assumption: the next implementation cycle should be small, reviewable, and focused on visible product/SEO/A11y improvements rather than infrastructure rewrites.

2. Improvement options

- Option A
  - Purpose: Fix `/search` so home price shortcuts and future filtered search URLs actually apply `priceMin`, `priceMax`, `category`, `tag`, and `sort`, and canonicalize those parameters consistently.
  - Expected impact:
    - Ecommerce UX: Users clicking “価格帯ショートカット” from home receive relevant filtered results instead of an unfiltered/keyword-only search page.
    - SEO/AEO: Search/result pages can present clearer intent-specific headings/descriptions and avoid misleading canonical URLs. If parameterized search pages should not be indexed, this can also clarify robots behavior.
    - Maintainability: Reuses the existing `ProductSearchFilters` shape and `searchProducts` filtering logic instead of maintaining a separate keyword-only search path.
  - Implementation cost: Low
  - Risks:
    - If search result parameter pages are indexed accidentally, thin/duplicate pages may increase. Decision-reviewer should decide whether filtered `/search` pages should be `noindex,follow` or canonicalized to `/search`.
    - Query parameter parsing is duplicated in `/products`; implementer should avoid excessive duplication if possible.
  - Adoption decision points:
    - Should `/search?q=...` and `/search?priceMin=...` be indexable, or should all search-result pages be `noindex,follow`?
    - Should home price shortcuts continue pointing to `/search`, or should they point to `/products` because `/products` already has a full filter UI?
    - Should `/search` remain a lightweight keyword landing page while `/products` becomes the canonical filtered listing?

- Option B
  - Purpose: Upgrade `ProductCard` to expose more decision-making information already available in `data/products.ts`: category label, first 2 tags, file format/license summary, seller rating or favorite count, and “即時DL” style badge.
  - Expected impact:
    - Ecommerce UX: Users can compare products without opening every detail page, improving discovery and likely click quality.
    - SEO/AEO: Product cards can provide richer visible entity context around product type, license, format, and use cases. This helps both humans and AI answer engines understand page content.
    - Accessibility: Better text labels and visible summaries reduce reliance on image/CTA alone.
  - Implementation cost: Low to Medium
  - Risks:
    - Card density may become too high on home pages where many sections already exist.
    - If microdata is expanded incorrectly, structured data quality could degrade. Keep visible content and structured data aligned.
    - CSS changes may affect multiple grids across home, products, categories, tags, ranking, search, and related products.
  - Adoption decision points:
    - Which fields are highest priority on cards: category/tags/license/file format/rating/favorite count?
    - Should home cards and listing cards share the same density, or should `ProductCard` accept a compact/default variant?
    - Should tags on cards link to tag pages, or remain plain text to avoid nested interactive elements if the card has CTA links?

- Option C
  - Purpose: Remove nested `<main>` landmarks by changing the root layout wrapper from `<main id="main">` to a non-landmark skip-link target wrapper, or by standardizing page-level layout landmarks.
  - Expected impact:
    - Accessibility: Avoids multiple/nested main landmarks, making screen-reader navigation cleaner and more standards-aligned.
    - Maintainability: Establishes a clear convention for App Router pages: layout owns header/footer and skip target; pages own their `<main>`.
    - SEO/AEO: Better semantic HTML can marginally improve machine readability and page structure clarity.
  - Implementation cost: Low
  - Risks:
    - Skip link currently likely targets `#main`; if the wrapper changes, the skip target must remain reliable.
    - Some pages may not render `<main>` consistently; implementer should check route coverage before changing the layout.
  - Adoption decision points:
    - Should every page component own its `<main>`, with layout using `<div id="main">` or similar?
    - Or should layout own the only `<main>` and page components be converted to sections/fragments? This is broader and less suitable for a small cycle.
    - Should admin/chat pages follow the same convention now or be deferred?

- Option D
  - Purpose: Add lightweight AEO-focused FAQ/HowTo content blocks to category and tag detail pages using data-driven templates.
  - Expected impact:
    - SEO/AEO: Category/tag pages would better answer intent-specific questions like “商用利用できる写真素材を探すには？” or “BGM素材の形式は？” and become more useful landing pages.
    - Ecommerce UX: Users arriving from organic search get clearer selection guidance before product grids.
    - Learning value: Demonstrates scalable content modeling for category/tag landing pages without external CMS cost.
  - Implementation cost: Medium
  - Risks:
    - Generic templated text can become thin or repetitive if overdone.
    - FAQ JSON-LD should only be added when the FAQ is visible on the page.
    - More content could push product grids lower on small screens.
  - Adoption decision points:
    - Start with category pages only, tag pages only, or both?
    - Use visible FAQ sections only, or also add JSON-LD?
    - Should content live in `data/products.ts`, a new SEO content module, or page-local constants?

- Option E
  - Purpose: Consolidate duplicated chat abstractions or clearly document current active chat path before deeper real-time/AWS implementation.
  - Expected impact:
    - Maintainability: Reduces ambiguity between `lib/chat/core/*` and older `lib/chat/*` repository/SSE/SQS modules.
    - Realtime roadmap: Helps future implementers know whether to extend in-memory chat, repository-based chat, or AWS SQS/SSE design.
    - AWS cost control: Prevents prematurely deploying multiple overlapping chat mechanisms.
  - Implementation cost: Medium to High depending on whether it is documentation-only or code cleanup.
  - Risks:
    - Code cleanup could accidentally break current chat/admin monitor flows.
    - Larger than ideal if implementer tries to migrate chat storage in the same cycle.
  - Adoption decision points:
    - Is this cycle meant to improve user-facing product pages, or invest in chat architecture hygiene?
    - Should the accepted scope be documentation-only for now?
    - Which chat implementation is considered canonical by the product owner?

- Defer option
  - Purpose: Defer infrastructure/AWS deployment changes and broad chat backend rewrites.
  - Expected impact:
    - Keeps the implementation cycle small and focused.
    - Avoids costly or risky changes before UX/SEO basics are tightened.
  - Implementation cost: Low
  - Risks:
    - Realtime chat and AWS deployment remain partially conceptual/documented rather than production-grade.
  - Adoption decision points:
    - Defer until after core ecommerce UX and semantic quality pass.
    - Revisit once product owner prioritizes production deployment or real multi-user chat testing.

3. Recommended decision-reviewer focus

- Highest-priority recommendation: Accept Option A and Option C together if the goal is a small, safe implementation cycle.
  - Option A fixes a clear user-facing mismatch: home price shortcuts currently imply filtered search behavior that `/search` does not implement.
  - Option C fixes a semantic/accessibility issue with likely small code impact and low regression risk if skip-link behavior is preserved.
- Secondary recommendation: Accept Option B if reviewer wants a visible ecommerce UX improvement in the same cycle and is comfortable with CSS/card snapshot risk.
  - Keep B scoped to 3–4 high-value fields: category, first two tags, file format/license, and 即時DL badge.
  - Avoid introducing a broad card variant system unless needed.
- Recommended deferrals:
  - Defer Option D unless content/SEO landing pages are the explicit priority for this cycle.
  - Defer Option E unless the reviewer wants architecture cleanup rather than frontend UX/SEO improvements.
  - Defer any AWS infrastructure or production realtime chat migration in this cycle.

4. Open questions or assumptions for decision-reviewer

- Should parameterized `/search` pages be indexable, or should filtered search pages use `robots: { index: false, follow: true }` to avoid thin/duplicate search result indexing?
- Should home price shortcuts route to `/search` after fixing it, or to `/products` where filter UI already exists?
- Is the current active chat implementation the `lib/chat/core/*` flow, and are older `lib/chat/repository.ts` / SSE/SQS modules retained for future AWS work?
- For product cards, should seller trust metrics such as rating/sales/favorites be visible at card level, or reserved for product detail to keep cards calm?
- Should the implementation cycle include visual CSS changes, or should it prioritize non-visual semantic/functionality fixes only?
