1. Review summary

- Status from quality review: **Ready with caveats**.
- Implemented scope:
  - `/search` now supports product filter query parameters: `q`, `category`, `tag`, `priceMin`, `priceMax`, and `sort`.
  - Parameterized search result pages are treated conservatively for SEO with `noindex, follow`.
  - Root layout no longer creates a nested `<main>` landmark; the skip-link target remains `#main`.
- Main caveat:
  - Search canonical URLs currently preserve raw invalid filter values such as `priceMin=-1` or `sort=invalid`, even though filtering logic ignores or normalizes those values.

2. What changed

- Search behavior:
  - `/search` applies keyword, category, tag, price range, and sort filters through the existing product search/filter flow.
  - Search pages now show:
    - Result count.
    - Active filter labels.
    - Filter-aware empty-state copy.
- SEO/AEO metadata behavior:
  - `/search` without query/filter parameters remains the plain search page.
  - `/search?...` with supported parameters receives conservative robots metadata: `noindex, follow`.
  - Canonical paths are generated from supported query parameter names.
- Accessibility/semantic layout:
  - The root layout changed its skip-link target wrapper from a root `<main id="main">` to a non-landmark `<div id="main">`.
  - Page components continue to own their own page-level `<main>` landmarks.

3. Where to look

## Screens / routes / URLs

Use a local dev server or production preview and inspect these routes:

- `/search`
  - Baseline search page.
- `/search?priceMin=3000`
  - Confirms home price shortcut-style filtering now works.
- `/search?priceMax=2000`
  - Confirms maximum-price filtering.
- `/search?q=素材&category=photo&sort=price_asc`
  - Confirms combined keyword/category/sort filtering.
- `/search?tag=商用利用&priceMin=1000&priceMax=5000&sort=price_desc`
  - Confirms combined tag, price range, and descending price sort.
- `/`
  - Check that price shortcut links still navigate correctly.
- Representative product/category/tag pages:
  - Confirm there is no nested root `<main>` around page-level `<main>` content.

## Components or flows

- Search page:
  - `app/(store)/search/page.tsx`
- Root shell / skip-link target:
  - `app/layout.tsx`
- Search metadata helper:
  - `lib/seo/metadata.ts`
- Product filtering data flow:
  - Existing `searchProducts` / `ProductSearchFilters` usage in `data/products.ts`.

4. Verification steps

1. Start the app locally.
   - Suggested command: `npm run dev`
2. Visit `/search?priceMin=3000`.
   - Confirm all visible products are priced at or above 3,000円.
   - Confirm the page displays an active filter label like `3,000円以上`.
3. Visit `/search?priceMax=2000`.
   - Confirm all visible products are priced at or below 2,000円.
   - Confirm the page displays an active filter label like `2,000円以下`.
4. Visit `/search?q=素材&category=photo&sort=price_asc`.
   - Confirm the results are filtered by the keyword/category combination.
   - Confirm results are sorted from lower price to higher price.
   - Confirm active filter labels are understandable.
5. Visit a query that should return no results.
   - Example: `/search?q=zzzzzzzz&priceMin=999999`
   - Confirm the empty state explains that no products match and suggests adjusting conditions.
6. Inspect metadata for a parameterized search page.
   - Confirm the page has conservative robots behavior such as `noindex, follow`.
7. Inspect metadata for plain `/search`.
   - Confirm it remains a normal canonical search page without filter-specific noindex behavior.
8. Test the skip link.
   - Use keyboard navigation from the top of the page.
   - Activate the skip link.
   - Confirm it targets `#main` and moves the user to the main content area.
9. Inspect page landmarks.
   - Confirm the root layout no longer wraps all routes in a root `<main>`.
   - Confirm representative pages still expose a meaningful page-level `<main>`.

5. Previous behavior vs latest behavior

| Area | Previous behavior | Latest behavior |
|---|---|---|
| `/search?priceMin=3000` | Price parameter could be ignored by the search page. | Products are filtered using the minimum price. |
| `/search?priceMax=2000` | Price parameter could be ignored by the search page. | Products are filtered using the maximum price. |
| Combined filters | `/search` primarily behaved like keyword search. | `/search` supports keyword, category, tag, price range, and sort together. |
| Search result explanation | Applied filters were less visible to users. | Result count and active filter labels are shown. |
| Empty state | Empty results were less specific to filter conditions. | Empty state tells users to adjust keywords/prices/conditions. |
| SEO for parameterized search | Search-result URL handling was less explicit. | Parameterized search pages use conservative `noindex, follow`. |
| Layout landmarks | Root layout used `<main id="main">`, while pages also rendered `<main>`, creating nested main landmarks. | Root layout uses `<div id="main">`; pages own the main landmark. |

6. Known unresolved issues

- Low-severity SEO metadata caveat:
  - Canonical URLs for `/search` are built from raw supported query parameter values.
  - Invalid values are safely ignored or normalized for filtering, but can still appear in canonical metadata.
  - Examples:
    - `/search?priceMin=-1`
      - Filtering treats `priceMin` as absent.
      - Canonical may still include `priceMin=-1`.
    - `/search?priceMax=abc`
      - Filtering treats `priceMax` as absent.
      - Canonical may still include `priceMax=abc`.
    - `/search?sort=invalid`
      - Filtering falls back to `newest`.
      - Canonical may still include `sort=invalid`.
- Impact:
  - This does not block product review because filtering works and parameterized search pages are noindexed.
  - It should be cleaned up in a future implementation cycle for metadata consistency and cleaner SEO hygiene.

7. Decision points for the human reviewer

- Search UX:
  - Are the active filter labels clear enough for non-technical shoppers?
  - Should the sort label always be displayed, even when it defaults to `newest`?
  - Is the empty-state copy helpful enough when multiple filters produce no results?
- SEO/AEO:
  - Is `noindex, follow` the desired policy for all parameterized `/search` result pages?
  - Should plain `/search?q=...` also remain noindexed, as currently intended for conservative search-result handling?
  - Should future work normalize canonical URLs to remove invalid filter values?
- Navigation:
  - Should home price shortcuts continue linking to `/search`, or should they eventually point to `/products` if that becomes the primary filtered listing experience?
- Accessibility:
  - Is the skip-link behavior acceptable after changing the root wrapper to `<div id="main">`?
  - Are there any pages where the page-level `<main>` landmark feels missing or poorly scoped?

8. Human review checklist

- [ ] `/search` loads normally without parameters.
- [ ] `/search?priceMin=3000` returns only matching price-filtered products.
- [ ] `/search?priceMax=2000` returns only matching price-filtered products.
- [ ] Combined filters work with keyword, category, tag, price, and sort.
- [ ] Result count matches visible product cards.
- [ ] Active filter labels match the URL parameters.
- [ ] Empty-state copy appears when no products match.
- [ ] Parameterized search pages are not intended as indexable SEO landing pages.
- [ ] Robots metadata for filtered/search-result pages is conservative.
- [ ] Skip link still works with keyboard navigation.
- [ ] Root layout no longer creates nested `<main>` landmarks.
- [ ] No unintended ProductCard visual redesign is present.
- [ ] No category/tag FAQ content was added in this cycle.
- [ ] No chat architecture or AWS deployment changes were introduced.
- [ ] Caveat about raw invalid canonical params is acceptable for this release or filed for follow-up.

9. Suggested feedback format for the next improvement-proposer cycle

```md
## Product review result

Decision:
- Accept / Accept with follow-up / Request changes

Reviewed routes:
- /search
- /search?priceMin=3000
- /search?priceMax=2000
- /search?q=素材&category=photo&sort=price_asc
- Other:

What worked well:
- 

Issues found:
- 

SEO/AEO feedback:
- 

Accessibility feedback:
- 

Follow-up priorities:
1. 
2. 
3. 

Should the next cycle address the known canonical caveat?
- Yes / No / Later

Additional notes:
- 
```
