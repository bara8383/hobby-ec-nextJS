1. Decision summary

- **Accepted for implementation:** Option A, Option B, and Option C.
- **Rejected for this cycle:** Broad visual redesign / full design-system rewrite, and sticky/header-level search-band redesign.
- **Deferred:** Option D, realtime chat backend work, AWS deployment/infrastructure changes, and category/tag FAQ/HowTo content expansion.
- The accepted scope should stay narrow: resolve the human review’s top UI/IA concern by separating the home title/value proposition from the search/action area, reduce public header debug noise, and fix the already-identified low-risk `/search` canonical inconsistency. The human review explicitly prioritizes separating title/description from search/actions and avoiding one large top card that mixes different roles. 【F:docs/ai/output/human-review/001-human-review.md†L17-L37】【F:docs/ai/output/human-review/001-human-review.md†L41-L73】

2. Accepted items

- **Item label:** Option A — Separate home hero/value proposition from search/action area.
  - **Scope to implement:**
    - Keep the home first view focused on brand/value proposition: brand label, single `h1`, and concise explanatory copy.
    - Move `HomeKeywordSearchBar` out of the hero content into an independent search/action section immediately below the hero.
    - Give the new search section an accessible label, preferably via `aria-labelledby` and a visible or screen-reader-friendly heading.
    - Prefer a calm, low-density search section over another large “everything card”; do not introduce sticky behavior in this cycle.
    - If touching the search form behavior, route submissions to the existing `/search?q=...` destination rather than only mutating the home page query, because the repository already has a dedicated `/search` page and the current home search only replaces the current pathname query. 【F:components/search/HomeKeywordSearchBar.tsx†L16-L35】【F:app/(store)/search/page.tsx†L99-L120】
  - **Acceptance rationale:**
    - This is the most direct response to the human review’s High feedback: separate title/description from search/operation elements, avoid concentrating dissimilar information in one top card, and clarify each section’s role. 【F:docs/ai/output/human-review/001-human-review.md†L30-L37】【F:docs/ai/output/human-review/001-human-review.md†L56-L73】
    - The current home hero places slideshow, overlay, label, `h1`, search form, and description in one section, matching the structure the human review found visually overloaded. 【F:app/page.tsx†L146-L160】
    - The change is visible and high-signal, but still reversible and localized to the home page and related styles/search component.

- **Item label:** Option B — Reduce public `SiteHeader` information density and debug/role noise.
  - **Scope to implement:**
    - Remove the always-visible “ログイン中 / 権限” line from the public site header.
    - Preserve the existing logo and role-aware navigation behavior.
    - Do not add a new account system or new page; the existing navigation already includes login/mypage destinations depending on role. 【F:lib/auth/permissions.ts†L28-L64】
    - If a development/debug role indicator is still needed, keep it out of the production-like public header and gate it behind an explicitly non-public/debug-only mechanism in a later cycle.
  - **Acceptance rationale:**
    - The current header always renders user display name and raw role labels directly under the main navigation, which increases visual noise and exposes implementation/demo state in a shopper-facing area. 【F:components/layout/SiteHeader.tsx†L13-L33】
    - This is a low-cost support change for the human review’s request for a calmer, more polished top area.
    - The implementation is small and reversible because it should not change authorization or navigation rules.

- **Item label:** Option C — Normalize `/search` canonical URL generation.
  - **Scope to implement:**
    - Generate canonical URLs from normalized filter values rather than raw query parameters.
    - Exclude invalid `priceMin` / `priceMax` values from canonical output.
    - Exclude invalid `sort` values from canonical output, or normalize them consistently through the same sort parser.
    - Treat `newest` as the default sort and omit it from canonical unless the repository already has a documented reason to keep default parameters.
    - Keep unknown `category` / `tag` handling unchanged unless validation can be added without broad product-data policy changes.
  - **Acceptance rationale:**
    - The quality review already identified that `parsePrice` and `parseSort` normalize search behavior while `buildSearchCanonical` still reflects raw invalid values, creating canonical inconsistency. 【F:docs/ai/output/quality-reviewer/001-quality-review.md†L44-L63】
    - The current implementation confirms canonical generation is raw-param based. 【F:app/(store)/search/page.tsx†L56-L67】
    - This is a low-cost SEO/AEO cleanup that aligns metadata with actual search behavior without changing product display behavior.

3. Rejected items

- **Item label:** Broad visual redesign / full design-system rewrite.
  - **Rejection rationale:**
    - Rejected for this cycle because it is too speculative and too large relative to the evidence. The decision-reviewer rules prefer small, reversible, high-signal improvements and reject/defer speculative large rewrites. 【F:.codex/agents/decision-reviewer.toml†L24-L30】
    - The human feedback is specific enough to address with targeted top-area IA changes first, not a full redesign.

- **Item label:** Sticky/header-level search-band redesign for the home search.
  - **Rejection rationale:**
    - Rejected for this cycle because it expands layout and interaction risk, especially on mobile, before validating the simpler separation pattern.
    - A non-sticky independent search section directly addresses the core feedback while keeping scope smaller and easier to reverse.

4. Deferred items

- **Item label:** Option D — Add category / file format / license / instant-download attributes to `ProductCard`.
  - **Deferral rationale:**
    - The ecommerce and AEO value is plausible, but adding more visible attributes to every product card may worsen the exact “not calm / not organized” impression raised by the human review.
    - `ProductCard` is reused across listing surfaces, so even small density changes would affect multiple pages and should follow the top-area cleanup rather than ship in the same UI cycle. 【F:components/ProductCard.tsx†L31-L58】
  - **Information needed to revisit:**
    - Which attributes are mandatory for purchase confidence.
    - Whether the product data model consistently contains file format, license, and instant-download status.
    - Whether listings need separate compact/default card variants.
    - Desktop and mobile density review after Option A/B are implemented.

- **Item label:** Realtime chat backend integration.
  - **Deferral rationale:**
    - Realtime chat is a repository priority, but the current proposal is focused on human-reviewed UI/IA issues. Adding backend/chat architecture work would increase regression and infrastructure risk without directly addressing the reviewed layout problem.
  - **Information needed to revisit:**
    - Chat product requirements, realtime transport choice, persistence model, moderation needs, and AWS cost target.

- **Item label:** AWS deployment / infrastructure / cost optimization.
  - **Deferral rationale:**
    - Minimum AWS cost is a repository priority, but no deployment requirement or cost problem is evidenced in this proposal. Infrastructure changes should not be mixed into a visible home/header UI cycle.
  - **Information needed to revisit:**
    - Target AWS services, expected traffic, budget ceiling, build/runtime constraints, and whether realtime chat must be included in the deployment design.

- **Item label:** Category/tag FAQ/HowTo content expansion.
  - **Deferral rationale:**
    - AEO content expansion may be useful, but it risks thin or repetitive content unless guided by an approved content strategy.
  - **Information needed to revisit:**
    - Human-approved content tone, FAQ/HowTo eligibility rules, duplication policy, and target landing pages.

5. Reasoning

- **Repository priorities considered:**
  - **Modern Next.js architecture:** The accepted work fits the existing Next.js App Router structure and does not require architectural rewrites. The project is already on Next.js 15.1.6 and React 19.0.0. 【F:package.json†L11-L16】
  - **SEO / AEO quality:** Option A improves the semantic clarity of the home page’s primary message by separating value proposition from search UI. Option C directly fixes canonical metadata consistency for normalized search filters.
  - **Ecommerce UX:** Option A clarifies the shopper journey from “understand the store value” to “search products.” Option B removes public header noise that makes the experience feel more like a demo than a polished storefront.
  - **Realtime chat capability:** Deferred because the proposal does not provide enough chat-specific requirements and because adding backend work would distract from the human-reviewed layout issue.
  - **Minimum AWS cost:** Accepted items are frontend/metadata changes and should not increase AWS runtime cost. Chat and infrastructure changes are deferred to avoid accidental cost expansion.
  - **Learning value:** The accepted set teaches practical prioritization: address high-signal human review feedback, remove obvious UI noise, and resolve a bounded SEO metadata issue without over-designing.

- **Cost / risk / reversibility notes:**
  - Option A is medium cost because it is visibly user-facing and needs screenshot review, but it is localized and reversible.
  - Option B is low cost and low risk if it only removes the debug-like role line while preserving navigation.
  - Option C is low cost and should be covered with deterministic URL/metadata checks.
  - Option D is deferred because the visual-density risk is higher than its current urgency.
  - Realtime chat, AWS deployment, and generated AEO content are deferred because each requires dedicated requirements and risk review.

6. Implementation handoff for implementer

- **Only accepted items:**
  - Implement Option A:
    - Move home search out of `.hero-content`.
    - Add a separate home search/action section immediately after the hero.
    - Keep exactly one visible `h1`.
    - Add accessible labeling to the search section.
    - Prefer `/search?q=...` navigation for home search submissions if the search component is modified.
    - Verify first-view spacing so product discovery sections are not pushed too far down.
  - Implement Option B:
    - Remove the visible “ログイン中 / 権限” line from `SiteHeader`.
    - Keep logo and existing role-aware nav links unchanged.
  - Implement Option C:
    - Build `/search` canonical URLs from normalized filters.
    - Drop invalid price and sort values from canonical.
    - Omit default `sort=newest` from canonical unless a repository convention requires otherwise.
    - Preserve current product search behavior.

- **Explicit non-goals:**
  - Do not perform a full visual redesign.
  - Do not introduce a full design system rewrite.
  - Do not add sticky header/search behavior.
  - Do not add ProductCard metadata chips in this cycle.
  - Do not implement realtime chat backend changes.
  - Do not modify AWS deployment or infrastructure.
  - Do not generate new FAQ/HowTo content.
  - Do not change authorization/permission logic.

- **Suggested validation commands or checks:**
  - `npm run lint`
  - `npm run build`
  - Run the app locally with `npm run dev` and capture desktop/mobile screenshots of the home first view.
  - Manually verify keyboard tab order through header, hero, search section, and first product section.
  - Manually verify there is exactly one home page `h1`.
  - Manually verify the home search has an accessible name and, if changed, submits to `/search?q=...`.
  - Manually verify guest, buyer/seller, and admin navigation still shows the expected links.
  - Manually verify `/search?priceMin=-1`, `/search?priceMax=abc`, `/search?sort=invalid`, and `/search?priceMin=3000&sort=price_asc` do not emit canonical URLs with invalid values.
