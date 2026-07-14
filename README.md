# HighTableNews — Merged App (Public Site + Admin Panel)

This is your **admin panel** and **user (public) site** combined into a
single Next.js 14 project. Both used to be separate apps that shared almost
all of their UI code (components, defaults, block definitions) but talked to
the backend differently — the public site called unauthenticated `/…`
routes, the admin panel called authenticated `/admin/…` routes with a JWT.
That split is preserved internally; only the project/repo is now one.

## Run it

```bash
npm install
npm run dev
```

- Public site: http://localhost:3000/
- Admin panel: http://localhost:3000/admin (redirects to `/admin/login` if not signed in)

Only **one** `.env.local` now (see `.env.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
JWT_SECRET=must match the backend's JWT_SECRET
```

### Backend CORS

Your backend's `CORS_ORIGINS` env var used to list both
`http://localhost:3000` (site) and `http://localhost:3001` (admin). Since
everything now runs on one port, you can trim it to just:

```
CORS_ORIGINS=http://localhost:3000
```

## What changed structurally

- **Routing**: public pages (`/`, `/[category]`, `/author/[slug]`) now live
  under `app/(site)/` (a route group — doesn't affect URLs). Admin pages
  (`/admin/**`) are unchanged, still under `app/admin/`. `middleware.js`
  still gates every `/admin/**` route behind the login cookie exactly as
  before.
- **Data providers**: each route group has its own provider so the two
  never race on the same cache — `app/(site)/layout.jsx` uses
  `components/site/DataProvider` (public, unauthenticated preload),
  `app/admin/layout.jsx` uses `components/admin/DataProvider` (authenticated
  preload). The root `app/layout.jsx` just supplies `<html>/<body>` and the
  shared `ToastProvider`.
- **API layer**: `apis/adminApis.js` (+ `apis/adminAxiosConfig.js`, which
  attaches the admin JWT and auto-logs-out on 401) and `apis/usersideApis.js`
  (+ `apis/axiosConfig.js`, unauthenticated) both still exist, unchanged in
  behavior.
- **Shared lib files** that used to exist in two versions (one per project)
  are now single merged files exposing **both** a public function and an
  `…Admin` counterpart, backed by the same in-memory cache:
  - `lib/categoriesArticlesApi.js` — `preloadCategoriesAndArticles()` (public)
    / `preloadCategoriesAndArticlesAdmin()` (admin, includes drafts), plus all
    the CRUD (`saveCategory`, `saveArticle`, etc.) which remain admin-only.
  - `lib/authorsApi.js` — `preloadAuthors()` / `preloadAuthorsAdmin()`.
  - `lib/api.js` — `getHeader/getFooter/getHomepage` (public) and
    `getHeaderAdmin/getFooterAdmin/getHomepageAdmin` (admin, used by the
    builders), `saveHeader/saveFooter/saveHomepage` (admin-only).
  - `lib/articleDetailPageApi.js`, `lib/authorPageApi.js`,
    `lib/categoryPageApi.js` — same pattern (`get…Config` public,
    `get…ConfigAdmin` admin, `save…Config` admin-only).
  - The `*-builder` component folders (article/author/category/footer/
    header/homepage) and `components/ui` were byte-identical between the two
    original projects, so they were only kept once, and the admin-only
    builder screens were pointed at the `…Admin` read functions via a simple
    import alias (e.g. `import { getHeaderAdmin as getHeader, ... }`) — no
    component code needed to change.
- **package.json**: merged to the union of both projects' dependencies
  (adds `@dnd-kit/*` and `jose`, used by the admin panel). Delete/regenerate
  `package-lock.json` on first install.

## Folder overview

```
app/
  layout.jsx            — root <html>/<body> + ToastProvider
  (site)/                — public site route group
    layout.jsx           — public DataProvider
    page.jsx              — homepage
    [category]/            — category pages
    author/[slug]/         — author profile pages
  admin/                 — admin panel (protected by middleware.js)
    layout.jsx            — admin DataProvider + CMS metadata
    dashboard/, articles/, categories/, authors/, media-library/,
    header-builder/, footer-builder/, homepage-builder/,
    articledetailpage-builder/, authordetailpage-builder/,
    categorypage-builder/, pages/, settings/, users/, login/
  api/admin/login, api/admin/logout   — cookie session routes
apis/            — adminApis.js + adminAxiosConfig.js, usersideApis.js + axiosConfig.js
components/      — admin/, site/, ui/, and the shared *-builder folders
lib/             — merged data layer (see above) + shared helpers
middleware.js    — guards /admin/**
```

Everything else (Tailwind config, `jsconfig.json`, `next.config.js`,
`globals.css`, block definitions, etc.) was already identical between the
two original projects and was kept as-is.
