1. Accepted scope implemented

- Implemented Option A by separating the home hero/value proposition from the keyword search/action area. The hero now keeps the brand label, a single visible `h1`, and concise explanatory copy, while the search form is placed in an independent section immediately below the hero with `aria-labelledby`.
- Implemented Option B by removing the always-visible public header login/role line while preserving the existing logo and role-aware navigation rendering.
- Implemented Option C by generating `/search` canonical URLs from parsed/normalized filters, excluding invalid price values, excluding invalid sort values, and omitting the default `sort=newest` parameter.

2. Files changed and why

- `app/page.tsx`: Moved `HomeKeywordSearchBar` out of `.hero-content`, added the separate labeled home search section, and tightened hero copy to keep the first view focused on value proposition.
- `app/globals.css`: Added low-density styling for the new home search section and removed the hero-specific search margin rule that no longer applies.
- `components/search/HomeKeywordSearchBar.tsx`: Updated submission behavior to navigate to the dedicated `/search?q=...` route instead of mutating the current page query.
- `components/layout/SiteHeader.tsx`: Removed the public debug-like login/role line and unused `isGuest` import while keeping role-aware nav items intact.
- `app/(store)/search/page.tsx`: Changed canonical URL generation to use normalized `ProductSearchFilters` instead of raw query parameters.

3. Behavior changes

- The home first view presents the store message first, then a separate “素材をキーワードで探す” search section immediately below it.
- Home keyword searches now route to `/search` with the `q` parameter when present, or `/search` for an empty query.
- The public header no longer exposes the current demo user name or raw role labels.
- Search canonical URLs now drop invalid `priceMin`, invalid `priceMax`, invalid `sort`, and default `sort=newest`; valid non-default filters remain in canonical output.

4. Validation commands run or recommended

- Ran `npm run lint` successfully.
- Ran `npm run build` successfully. Next.js emitted its existing edge-runtime static-generation warning during build, but the build completed successfully.
- Ran `npm start` and verified canonical output with a Python `urllib.request` check for `/search?priceMin=-1`, `/search?priceMax=abc`, `/search?sort=invalid`, `/search?priceMin=3000&sort=price_asc`, and `/search?sort=newest`.
- Attempted to capture a screenshot with `npx --yes playwright screenshot --viewport-size=1440,1100 http://127.0.0.1:3000 /tmp/hobby-screenshots/home.png`, but the environment blocked fetching Playwright from npm with `403 Forbidden`; no screenshot was produced.

5. Known follow-ups that were intentionally not implemented

- Did not perform a broad visual redesign or design-system rewrite.
- Did not add sticky header/search behavior.
- Did not add ProductCard metadata chips or listing density changes.
- Did not implement realtime chat backend changes.
- Did not modify AWS deployment or infrastructure.
- Did not generate new FAQ/HowTo content.
- Did not change authorization or permission logic.
