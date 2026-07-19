---
name: verify
description: Build, launch, and drive this Next.js storefront to verify changes at the page level.
---

# Verifying next-roihin changes

## Launch

The app is a Next.js (App Router) storefront backed by a live Laravel CMS. No local `.env` exists; the API base defaults to `http://localhost:8000`, which is not running. Point it at the production CMS (read-only GETs are safe):

```bash
LARAVEL_API_URL=https://cms.roihin.com npx next dev --turbopack -p 3457
```

Ready in ~5s; poll `http://localhost:3457/en` for HTTP 200.

## Drive

Pages are server-rendered — `curl` the route and grep the HTML. Useful routes:

- `/en/shop` and `/en/shop/<collection>` (collections: bracelet, ring, earring, pandents, nacklace, rough-crystal, perfume, gifts, new-arrivals — see `src/config/shop.config.ts`)
- `/en/shop/product/<slug>` and `/en/charmspacer/product/<slug>` (same page component; known product slug: `moonlit-rose`)
- Swap `/en/` for `/th/` to check the Thai locale.

The product-detail breadcrumb lives in `<nav class="mb-8">` inside `ProductDetail.tsx`.

## Gotchas

- Pre-existing React "missing key" warnings from `Typography`/`HeroSection` show in dev logs — not caused by your change.
- `revalidate = 0` everywhere, so every request re-fetches from the CMS; slow first responses (~1-3s) are compile + fetch, not a hang.
