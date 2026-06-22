1. Accepted scope implemented

- Implemented **Option A — Fix `/search` filters and canonicalization**.
  - `/search` now parses `q`, `category`, `tag`, `priceMin`, `priceMax`, and `sort` from `searchParams`.
  - The page reuses `searchProducts` and `ProductSearchFilters` for filtering and sorting.
  - Invalid, negative, or non-finite numeric price values are ignored during filtering.
  - The result count, visible active-condition summary, and empty-state copy now reflect applied filters.
  - Parameterized search pages now pass `robots: { index: false, follow: true }` to search metadata.
  - Search canonical URLs remain conservative and include only supported search/filter parameters.
- Implemented **Option C — Remove nested `<main>` landmarks**.
  - The root layout wrapper was changed from `<main id="main">` to `<div id="main">`.
  - The skip-link target remains `#main`.
  - Page-level routes continue to own their `<main>` landmarks.

2. Files changed and why

- `app/(store)/search/page.tsx`
  - Added scoped query-parameter parsing for supported search filters.
  - Added safe price normalization and sort normalization.
  - Reused existing product search/filter data model to return filtered results.
  - Added visible active-filter labels, result count, and improved empty-state copy.
  - Added noindex/follow robots metadata for parameterized search-result URLs.
- `lib/seo/metadata.ts`
  - Extended `buildSearchMetadata` with an optional robots metadata argument so `/search` can keep conservative SEO handling for utility result pages.
- `app/layout.tsx`
  - Changed the root skip target wrapper to a non-landmark `<div id="main">` to avoid nesting page-level `<main>` landmarks.

3. Behavior changes

- `/search?priceMin=3000` now filters out products below 3,000円 instead of returning unfiltered keyword-only results.
- `/search?priceMax=2000` now filters to products at or below 2,000円.
- `/search?q=<keyword>&category=<category>&tag=<tag>&priceMin=<number>&priceMax=<number>&sort=<sort>` now applies supported filters together through the existing `searchProducts` utility.
- Unsupported or invalid price values are ignored safely instead of becoming `NaN` filters.
- Parameterized `/search` pages emit conservative robots metadata (`noindex,follow`) while preserving supported parameters in canonical metadata.
- The root layout no longer creates a nested main landmark around pages that already render `<main>`.

4. Validation commands run or recommended

- Ran `npm run lint` successfully.
- Ran `npm run build` successfully.
- Recommended manual checks for the next reviewer:
  - Visit `/search?priceMin=3000` and confirm only products priced at 3,000円以上 are listed.
  - Visit `/search?priceMax=2000` and confirm no higher-priced products are listed.
  - Visit `/search?q=photo&category=photo&sort=price_asc` and confirm combined filtering/sorting works.
  - Inspect a rendered store route and confirm there is no root `<main>` wrapping a page-level `<main>`.
  - Confirm the skip link still targets `#main`.

5. Known follow-ups that were intentionally not implemented

- Did not implement ProductCard visual-density upgrades.
- Did not add category/tag FAQ or HowTo content blocks.
- Did not consolidate chat implementations.
- Did not add AWS or deployment changes.
- Did not introduce a new search backend.
- Did not make arbitrary parameterized `/search` pages indexable SEO landing pages.
