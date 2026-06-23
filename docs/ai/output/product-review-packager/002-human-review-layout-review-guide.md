1. **Review summary**

- This package covers the implemented human-review layout cycle for the storefront home/search/header experience.
- The accepted work focused on:
  - Separating the home hero/value proposition from the keyword search action.
  - Reducing public header noise by removing the visible login/role debug-style line.
  - Normalizing `/search` canonical URLs from parsed filter values.
  - Addressing the quality-review medium finding by adding native form fallback attributes: `action="/search"` and `method="get"` on the home search form. 【F:components/search/HomeKeywordSearchBar.tsx†L32-L34】
- The change is ready for human product review, with one main caveat: desktop/mobile visual screenshots were not captured in the implementation environment, so spacing, density, and first-view polish still need hands-on review.

2. **What changed**

- The home hero now contains the brand label, one visible `h1`, and concise value-proposition copy only. 【F:app/page.tsx†L148-L158】
- The keyword search form was moved into a separate section immediately below the hero, labeled with `aria-labelledby="home-search-title"`. 【F:app/page.tsx†L161-L170】
- The search section has its own low-density card styling, instead of being embedded inside the hero content. 【F:app/globals.css†L794-L809】
- Home keyword searches now target the dedicated `/search` route:
  - Native fallback: `action="/search"` and `method="get"`. 【F:components/search/HomeKeywordSearchBar.tsx†L32-L34】
  - Hydrated client behavior: builds `/search?q=...` or `/search` and uses `router.push`. 【F:components/search/HomeKeywordSearchBar.tsx†L14-L29】
- The public header no longer shows the previous always-visible “ログイン中 / 権限” style user/role line; it now shows the logo and role-aware navigation only. 【F:components/layout/SiteHeader.tsx†L13-L27】
- `/search` canonical URL generation now uses normalized filters:
  - Keeps valid `q`, `category`, `tag`, `priceMin`, `priceMax`.
  - Omits invalid price/sort values through parsing.
  - Omits default `sort=newest`.
  - Preserves valid non-default sort values. 【F:app/(store)/search/page.tsx†L56-L83】

3. **Where to look**

- **Screens / routes / URLs**
  - `/`
    - Main review target.
    - Check the top hero, the separated search section, first-view hierarchy, and whether the page feels calmer and more polished.
  - `/search?q=壁紙`
    - Verify home search lands on the search results page with the query preserved.
  - `/search`
    - Verify empty search submission still lands on the search page.
  - `/search?priceMin=-1`
    - Confirm invalid `priceMin` does not appear in canonical output.
  - `/search?priceMax=abc`
    - Confirm invalid `priceMax` does not appear in canonical output.
  - `/search?sort=invalid`
    - Confirm invalid `sort` does not appear in canonical output.
  - `/search?sort=newest`
    - Confirm default sort is omitted from canonical output.
  - `/search?priceMin=3000&sort=price_asc`
    - Confirm valid non-default filters remain in canonical output.

- **Components or flows**
  - Home page hero and separated search section: `app/page.tsx`. 【F:app/page.tsx†L148-L170】
  - Home search form behavior and native fallback: `components/search/HomeKeywordSearchBar.tsx`. 【F:components/search/HomeKeywordSearchBar.tsx†L14-L54】
  - Header navigation display: `components/layout/SiteHeader.tsx`. 【F:components/layout/SiteHeader.tsx†L13-L27】
  - Search canonical normalization: `app/(store)/search/page.tsx`. 【F:app/(store)/search/page.tsx†L56-L83】
  - Search-section styling: `app/globals.css`. 【F:app/globals.css†L794-L826】

4. **Verification steps**

- ✅ `npm run lint`
  - Implementer and quality reviewer reported this passed.
- ✅ `npm run build`
  - Implementer and quality reviewer reported this passed.
  - Build emitted an existing edge-runtime static-generation warning, but completed successfully.
- ✅ `npm start`
  - Quality reviewer reported this was used for HTTP probing.
- ✅ Python `urllib.request` HTTP probe against `/`, `/search?priceMin=-1`, `/search?priceMax=abc`, `/search?sort=invalid`, `/search?priceMin=3000&sort=price_asc`, and `/search?sort=newest`
  - Quality reviewer reported this confirmed one home `h1`, no header login/role noise, search-section marker presence, and expected canonical normalization.
- ⚠️ `npx --yes playwright screenshot --viewport-size=1440,1100 http://127.0.0.1:3000 /tmp/hobby-screenshots/home.png`
  - Implementer reported this could not complete because the environment blocked fetching Playwright with `403 Forbidden`; no screenshot was produced.
- Manual product review checks:
  - Open `/` on desktop and mobile widths.
  - Confirm the hero reads as a calm value-proposition area, not a mixed “everything card.”
  - Confirm the search section feels visually separate but not overly heavy.
  - Submit a keyword from `/` and confirm the destination is `/search?q=<keyword>`.
  - Disable JavaScript, or test before hydration if possible, and confirm native form submission still lands on `/search?q=<keyword>`.
  - Confirm keyboard tab order flows naturally through header, hero/search, and product discovery sections.
  - Confirm there is exactly one visible home-page `h1`.
  - Inspect page source or metadata for the canonical URL behavior on the `/search` test URLs above.

5. **Previous behavior vs latest behavior**

| Area | Previous behavior | Latest behavior |
|---|---|---|
| Home top area | Hero bundled slideshow, label, `h1`, description, and search together, reinforcing the “top card is overloaded” concern. | Hero now focuses on brand/value proposition only; search moved to a separate section below. 【F:app/page.tsx†L148-L170】 |
| Home search destination | Search behavior previously mutated the current page query instead of clearly sending users to `/search`. | Search now targets `/search`, both through client navigation and native form fallback. 【F:components/search/HomeKeywordSearchBar.tsx†L14-L34】 |
| No-JS / pre-hydration search | Quality review found the form lacked native fallback, so browser default behavior could remain on `/?q=...`. | Parent follow-up added `action="/search"` and `method="get"`, so native submission now reaches `/search?q=...`. 【F:components/search/HomeKeywordSearchBar.tsx†L32-L34】 |
| Public header | Header showed visible login/display-name and role/debug-like information. | Header shows logo and role-aware navigation only. 【F:components/layout/SiteHeader.tsx†L13-L27】 |
| Search canonical URL | Canonical generation reflected raw query values, so invalid price/sort parameters could remain. | Canonical is built from normalized filters and omits invalid/default values. 【F:app/(store)/search/page.tsx†L56-L83】 |

6. **Known unresolved issues**

- Desktop and mobile screenshots are still missing because the implementation environment could not fetch Playwright.
- Human visual review is still required for:
  - First-view hierarchy.
  - Hero/search spacing.
  - Whether the new search section feels calm and polished.
  - Whether product discovery content is pushed too far down.
- Product card metadata chips were intentionally not added in this cycle.
- Sticky search/header search redesign was intentionally not added.
- Realtime chat backend changes were intentionally not implemented.
- AWS deployment/infrastructure changes were intentionally not implemented.
- FAQ/HowTo AEO content expansion was intentionally deferred.
- No broad visual redesign or full design-system rewrite was included.

7. **Decision points for the human reviewer**

- Does the new top-page structure solve the original concern that title, description, search, and operations felt crowded into one upper card?
- Is the separate search section visually calm enough, or does it still feel like another large card competing with the hero?
- Is the hero copy concise and polished enough for the desired brand impression?
- Should the hero slideshow/background remain as-is, or should a future cycle simplify it further for a more editorial, premium feel?
- Is the removal of visible login/role information from the public header acceptable for review/demo workflows?
- Is `/search` the right destination for all home keyword searches?
- Should default/invalid canonical normalization policy be extended later to stricter `category` / `tag` validation?
- Should the next improvement cycle focus on visual polish, product-card purchase confidence, AEO content strategy, realtime chat, or AWS deployment readiness?

8. **Human review checklist**

- [ ] On desktop, the home first view feels calmer and more polished than before.
- [ ] On mobile, the hero and search section do not feel cramped or overly tall.
- [ ] The `h1` and value proposition are easy to understand before interacting with search.
- [ ] The search section is clearly separate from the hero.
- [ ] The search section does not look like another overloaded “everything card.”
- [ ] Search from `/` with a keyword lands on `/search?q=<keyword>`.
- [ ] Empty search from `/` lands on `/search`.
- [ ] Native/no-JS form behavior also lands on `/search`.
- [ ] Header no longer shows public debug-like login/role text.
- [ ] Header navigation still shows expected links for guest, buyer/seller, and admin states.
- [ ] `/search` canonical URLs drop invalid price/sort parameters.
- [ ] Default `sort=newest` is omitted from canonical output.
- [ ] Valid non-default filters remain in canonical output.
- [ ] No unexpected changes are visible on product cards, chat, AWS/deployment behavior, or FAQ/HowTo content.

9. **Suggested feedback format for the next improvement-proposer cycle**

```md
## Overall decision

- Approve / Approve with requested follow-up / Request changes

## Top-page layout feedback

- Hero/value proposition:
  - What works:
  - What feels off:
  - Desired adjustment:

- Search section:
  - What works:
  - What feels off:
  - Desired adjustment:

- Header:
  - Is the reduced header acceptable?
  - Any missing account/demo information?

## Search behavior / SEO-AEO feedback

- Is `/search?q=...` the expected destination from home search?
- Any concerns with canonical normalization?
- Should category/tag canonical handling be stricter in a future cycle?

## Visual review notes

- Desktop:
- Mobile:
- Spacing/density:
- Brand impression:

## Next-cycle priority

Choose one primary focus:

1. Further home/header visual polish
2. Product-card purchase-confidence information
3. Search/category/tag AEO content strategy
4. Realtime chat backend/product flow
5. AWS deployment and minimum-cost architecture
6. Other:

## Specific examples or screenshots

- Route / screenshot:
- Issue:
- Expected direction:
```
