1. **Review scope**

- Reviewed the latest implementation described in `docs/ai/output/implementer/002-implementation-result.md` against the accepted decisions in `docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md`.
- Focused on changed implementation files: `app/page.tsx`, `app/globals.css`, `components/search/HomeKeywordSearchBar.tsx`, `components/layout/SiteHeader.tsx`, and `app/(store)/search/page.tsx`. The implementer reported these same files as changed for Options A, B, and C. 【F:docs/ai/output/implementer/002-implementation-result.md†L7-L13】
- Decision scope reviewed:
  - Option A: separate home hero/value proposition from search/action area, keep one visible `h1`, add accessible search-section labeling, and route touched search behavior to `/search?q=...`. 【F:docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md†L10-L20】
  - Option B: remove the public “ログイン中 / 権限” header line while preserving role-aware navigation. 【F:docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md†L22-L31】
  - Option C: normalize `/search` canonical URLs from parsed filters, drop invalid price/sort values, and omit default `sort=newest`. 【F:docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md†L33-L43】
  - Explicit non-goals checked for scope drift: no design-system rewrite, sticky search, ProductCard metadata chips, realtime chat backend, AWS/infrastructure, FAQ/HowTo content generation, or authorization logic changes. 【F:docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md†L123-L131】

2. **Findings by severity**

## Critical

- No findings.

## High

- No findings.

## Medium

### Finding: Home search only routes to `/search` after client JavaScript handles submit

- **Evidence**
  - The accepted decision says touched home search behavior should route submissions to the existing `/search?q=...` destination rather than only changing the home page query. 【F:docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md†L16-L16】
  - The implementation does route to `/search` in the client `onSubmit` handler via `router.push(nextUrl)`. 【F:components/search/HomeKeywordSearchBar.tsx†L14-L29】
  - However, the rendered `<form>` has no `action="/search"` or `method="get"` fallback; it only has `className`, `onSubmit`, and `aria-label`. 【F:components/search/HomeKeywordSearchBar.tsx†L32-L54】
- **Impact**
  - For users submitting before hydration, with JavaScript disabled, or if the client bundle fails, the browser will use the HTML form default action/current URL. On the home page, that means `/?q=...` rather than `/search?q=...`, leaving users on the home page instead of the dedicated search results page.
  - This is a progressive-enhancement gap in an ecommerce discovery path. It does not block normal hydrated usage, but it weakens the decision’s intended behavior and modern Next.js robustness.
- **Recommended fix**
  - Add native form attributes so the server-rendered HTML also submits to search: `action="/search"` and `method="get"`.
  - Keep the client `onSubmit` only if the app still wants client-side navigation, but ensure the no-JS/native path reaches the same `/search?q=...` destination.
- **Suggested validation**
  - Validate with JavaScript disabled or before hydration that entering a keyword on `/` lands on `/search?q=<keyword>`.
  - Re-run canonical/search checks after adding the fallback.

## Low

### Finding: Visual first-view validation remains incomplete because no screenshot was captured

- **Evidence**
  - The decision handoff requested local desktop/mobile screenshot review of the home first view and manual checks for first-view spacing, tab order, single `h1`, and search accessible naming. 【F:docs/ai/output/decision-reviewer/002-human-review-layout-decisions.md†L133-L141】
  - The implementer reports the screenshot attempt failed because the environment blocked fetching Playwright, so no screenshot was produced. 【F:docs/ai/output/implementer/002-implementation-result.md†L24-L27】
- **Impact**
  - The code structure satisfies the intended separation, but the human reviewer still lacks visual evidence for the most user-facing part of the change: whether the hero/search separation is calm, low-density, and does not push discovery content too far down.
- **Recommended fix**
  - Capture desktop and mobile screenshots using an already-available browser tool or in a local environment where Playwright/browser binaries are installed.
- **Suggested validation**
  - Review `/` at desktop and mobile widths for first-view hierarchy, search section density, and spacing before final product review.

3. **Positive checks passed**

- The home page now keeps the hero focused on label, single visible `h1`, and explanatory copy, with the search moved into a separate `aria-labelledby="home-search-title"` section immediately after the hero. 【F:app/page.tsx†L146-L170】
- The new search section has low-density styling and responsive button behavior without introducing sticky/header-level search behavior. 【F:app/globals.css†L794-L826】【F:app/globals.css†L1410-L1421】
- The public header now preserves logo and role-aware nav rendering while removing the visible login/role debug line. 【F:components/layout/SiteHeader.tsx†L13-L27】
- `/search` canonical generation now uses normalized filters, includes valid `q`, `category`, `tag`, and price values, and omits `sort=newest` while preserving valid non-default sorts. 【F:app/(store)/search/page.tsx†L56-L83】
- `/search` metadata uses the normalized canonical builder while preserving the existing noindex/follow behavior for search-parameter pages. 【F:app/(store)/search/page.tsx†L116-L123】
- No scope drift found in the reviewed implementation: changed code is aligned to Options A/B/C, and no ProductCard, realtime chat backend, AWS/infrastructure, FAQ/HowTo content, or authorization changes were observed in the reviewed diff.
- ✅ `npm run lint`
- ✅ `npm run build`
- ✅ `npm start`
- ✅ Python `urllib.request` HTTP probe against `/`, `/search?priceMin=-1`, `/search?priceMax=abc`, `/search?sort=invalid`, `/search?priceMin=3000&sort=price_asc`, and `/search?sort=newest` confirmed one home `h1`, no header login/role noise, presence of the search section marker, and expected canonical normalization.

4. **Human-review readiness: Ready with caveats**

- Ready for human review of the accepted visual/layout direction, with caveats:
  - Add a native form fallback for `/search` submission to close the progressive-enhancement gap.
  - Capture desktop/mobile screenshots before relying on human review for final visual spacing and density assessment.
