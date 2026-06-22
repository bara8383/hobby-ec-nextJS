1. Decision summary

- Accept **Option A** with a narrow scope: make `/search` honor existing product filter query parameters (`q`, `category`, `tag`, `priceMin`, `priceMax`, `sort`) by reusing the existing product search/filter model, and keep filtered search pages conservative for SEO with `noindex,follow`.
- Accept **Option C** with a narrow scope: remove nested `<main>` landmarks while preserving the skip-link target and page-level main landmarks.
- Defer **Option B** for this cycle. It is valuable, but it introduces visible card-density/CSS risk and should follow the functional/search and semantic accessibility fixes.
- Defer **Option D**. AEO FAQ/HowTo content may be useful, but it needs content strategy to avoid generic or thin templated pages.
- Defer **Option E**. Chat architecture consolidation is important but larger and riskier than this cycle should be.
- Reject no options outright. The non-accepted proposals are directionally compatible with the repository but should not be implemented in this narrow pass.

2. Accepted items

- Item label: **Option A — Fix `/search` filters and canonicalization**
  - Scope to implement:
    - Update `/search` so it parses and applies the existing filter query parameters:
      - `q`
      - `category`
      - `tag`
      - `priceMin`
      - `priceMax`
      - `sort`
    - Reuse the repository’s existing product filtering/search logic where practical instead of creating a separate search implementation.
    - Ensure home page price shortcut links such as `/search?priceMin=...` produce matching filtered results.
    - Update search page headings, empty-state copy, and/or result summary so the applied filters are understandable to users.
    - Canonicalization/robots decision:
      - Treat parameterized search results as utility/result pages rather than primary SEO landing pages.
      - Use `robots: { index: false, follow: true }` for filtered/search-result parameter pages, especially when query/filter parameters are present.
      - Avoid creating indexable thin combinations of arbitrary search parameters.
    - Preserve existing behavior for plain `/search` and `/search?q=...` where possible, while making the SEO handling explicit and conservative.
  - Acceptance rationale:
    - Fixes a clear user-facing mismatch identified in the proposal: home price shortcuts point to `/search?priceMin=...`, but `/search` currently ignores price filters.
    - Aligns with ecommerce UX by making discovery links truthful and useful.
    - Aligns with SEO/AEO by avoiding misleading result pages and reducing duplicate/thin indexed URL risk.
    - Low implementation cost and reversible.
    - Builds on existing product filtering capabilities instead of introducing a new architecture.

- Item label: **Option C — Remove nested `<main>` landmarks**
  - Scope to implement:
    - Eliminate nested `<main>` landmarks caused by the root layout and page components both rendering `<main>`.
    - Prefer the smaller convention change:
      - Root layout should keep the skip-link target but use a non-landmark wrapper such as `<div id="main">` or equivalent.
      - Page components should continue owning their page-level `<main>` landmarks.
    - Preserve skip-link behavior.
    - Confirm key route groups still expose a meaningful main landmark at the page level.
    - Avoid broad conversion of every page component unless necessary.
  - Acceptance rationale:
    - Addresses a concrete accessibility/semantic HTML issue with low code risk.
    - Supports machine-readable page structure, which indirectly helps SEO/AEO quality.
    - The change is small, reversible, and consistent with modern App Router layouts where the root layout owns shell elements while pages define page content landmarks.
    - Avoids a broader and riskier “layout owns all main landmarks” refactor.

3. Rejected items

- None.

4. Deferred items

- Item label: **Option B — Upgrade `ProductCard` with richer visible product attributes**
  - Deferral rationale:
    - Directionally valuable for ecommerce UX and AEO, but it is a visible design/CSS change affecting many grids across the app.
    - The current cycle should prioritize correcting broken/misleading filter behavior and semantic accessibility first.
    - Card-density decisions require product/design judgment: which fields matter most, whether cards need compact/default variants, and how much information is appropriate on home versus listing pages.
  - Information needed to revisit:
    - Desired card density per surface: home, product listing, related products, ranking/search/category/tag pages.
    - Priority fields: category, tags, file format, license, seller rating, favorites, sales count, instant-download badge.
    - Whether tags/categories inside cards should be links or plain labels to avoid nested-interactive complexity.
    - Visual acceptance criteria or screenshots for responsive card layout.

- Item label: **Option D — Add AEO FAQ/HowTo blocks to category and tag detail pages**
  - Deferral rationale:
    - The repository already has strong SEO/AEO foundations; adding templated content without a content plan risks thin or repetitive pages.
    - FAQ JSON-LD should only be added when the FAQ content is visible and genuinely useful.
    - This is medium-cost and content-sensitive, making it less suitable for the current small implementation cycle.
  - Information needed to revisit:
    - Which landing pages are highest priority: category pages, tag pages, or both.
    - Human-approved FAQ/HowTo content guidelines.
    - Whether content should be data-driven from a central SEO content module or authored page-by-page.
    - Indexing strategy for category/tag pages with generated content.

- Item label: **Option E — Consolidate or document chat abstractions**
  - Deferral rationale:
    - Chat is important to the repository direction, but the proposal indicates multiple generations of chat code, which raises discovery and regression risk.
    - Code consolidation could accidentally break existing chat/admin monitor flows.
    - This cycle should avoid medium/high-risk architecture cleanup while addressing clearer frontend UX/SEO/A11y issues.
  - Information needed to revisit:
    - Confirm the canonical active chat path: likely `lib/chat/core/*` and `/chat/[conversationId]`, but this needs verification.
    - Decide whether older repository/SSE/SQS modules are legacy, future AWS preparation, or still active.
    - Define the production real-time target: in-memory demo, SSE, WebSocket, SQS-backed worker, or another AWS-minimal architecture.
    - Establish chat regression tests or manual QA steps before refactoring.

- Item label: **Defer AWS deployment and broad real-time backend rewrites**
  - Deferral rationale:
    - No accepted item requires infrastructure changes.
    - AWS work can increase cost and operational complexity without immediate product value in this cycle.
    - Broad real-time backend rewrites are not small or easily reversible.
  - Information needed to revisit:
    - Deployment target and budget ceiling.
    - Expected concurrent users and real-time latency requirements.
    - Persistence requirements for chat.
    - Monitoring and failure-mode expectations.

5. Reasoning

- Repository priorities considered:
  - **Modern Next.js architecture**:
    - Option A should reuse existing App Router conventions, metadata patterns, and product filtering types.
    - Option C improves semantic layout structure without a broad architecture rewrite.
  - **SEO / AEO quality**:
    - Option A corrects search-result behavior while preventing uncontrolled indexing of thin parameter combinations.
    - Option C improves landmark semantics and machine-readable structure.
    - Option D is SEO/AEO-oriented but should wait for stronger content guidance.
  - **Ecommerce UX**:
    - Option A directly improves the user journey from home page price shortcuts to relevant results.
    - Option B would improve browsing quality but is more visual and should be scoped carefully later.
  - **Real-time chat capability**:
    - Option E relates to chat maintainability, but it is not necessary for the accepted search/accessibility fixes.
    - Avoiding chat refactors in this cycle reduces regression risk.
  - **Minimum AWS cost**:
    - Accepted items require no AWS resources and do not increase hosting complexity.
    - AWS and real-time backend work should remain deferred until requirements are clearer.
  - **Learning value**:
    - Option A demonstrates safe reuse of existing domain filters and conservative SEO handling for search-result pages.
    - Option C demonstrates accessible landmark conventions in a Next.js App Router app.

- Cost / risk / reversibility notes:
  - **Option A**:
    - Cost: Low.
    - Risk: Moderate SEO risk if search/filter URLs are made indexable indiscriminately.
    - Mitigation: use `noindex,follow` for parameterized search-result pages and keep canonical behavior conservative.
    - Reversibility: High.
  - **Option C**:
    - Cost: Low.
    - Risk: Low, mainly skip-link behavior and route coverage.
    - Mitigation: preserve `id="main"` target and validate rendered pages still include page-level `<main>`.
    - Reversibility: High.
  - **Option B**:
    - Cost: Low to Medium.
    - Risk: Visual density and cross-page CSS regression.
    - Reversibility: Medium.
  - **Option D**:
    - Cost: Medium.
    - Risk: Thin/repetitive content and structured-data quality issues.
    - Reversibility: Medium.
  - **Option E**:
    - Cost: Medium to High.
    - Risk: Chat regression due to overlapping active/legacy abstractions.
    - Reversibility: Lower if migrations are attempted.

6. Implementation handoff for implementer

- Only accepted items:
  - Implement **Option A**:
    - Inspect existing `/products` filter parsing and `searchProducts` / `ProductSearchFilters` utilities.
    - Update `/search` to parse `q`, `category`, `tag`, `priceMin`, `priceMax`, and `sort`.
    - Ensure invalid numeric values are ignored or safely normalized.
    - Ensure result count/heading/empty state reflects active filters.
    - Add or update metadata so parameterized search result pages are not indexed:
      - Use `robots: { index: false, follow: true }` when search/filter parameters are present.
      - Keep canonical URLs conservative and avoid generating indexable arbitrary filter combinations.
    - Confirm home page price shortcut URLs now produce filtered search results.
  - Implement **Option C**:
    - Change the root layout’s outer content wrapper from `<main id="main">` to a non-landmark skip target, likely `<div id="main">`.
    - Preserve the skip link target and keyboard behavior.
    - Confirm page-level routes still render their own `<main>`.
    - Do not perform a large page-wide landmark refactor unless a specific route lacks a main landmark and can be fixed minimally.

- Explicit non-goals:
  - Do not implement ProductCard visual-density upgrades in this cycle.
  - Do not add category/tag FAQ or HowTo content blocks in this cycle.
  - Do not consolidate chat repositories, SSE, SQS, or `lib/chat/core` implementations in this cycle.
  - Do not add AWS resources or deployment changes.
  - Do not introduce a new search backend or duplicate the product filtering system.
  - Do not make arbitrary parameterized `/search` pages indexable SEO landing pages.

- Suggested validation commands or checks:
  - `npm run lint`
  - `npm run build`
  - If available, run the repository’s type/check script, for example `npm run typecheck` or `npm run check`.
  - Manual checks:
    - Visit `/search?priceMin=3000` and confirm results are price-filtered.
    - Visit `/search?priceMax=2000` and confirm results are price-filtered.
    - Visit `/search?q=<known keyword>&category=<known category>&sort=price-asc` and confirm combined filtering/sorting works.
    - Inspect rendered HTML for a representative store page and confirm there is no nested `<main>`.
    - Confirm the skip link still moves focus/scroll target to the main content area.
    - Confirm parameterized search pages include conservative robots metadata such as `noindex,follow`.
