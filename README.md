# Sweet Dreams Cakes

A full-featured cake shop website with an admin panel and live backend sync. Built with React + Vite + TypeScript, deployed as a single service on Render.

---

## What's included

- **Public site** — Homepage, gallery, products/menu, and animated sections
- **Admin panel** — Manage gallery, carousel, products, categories, and settings at `/control`
- **Backend sync** — Every admin change auto-saves to Supabase (PostgreSQL) and syncs across all devices instantly
- **Single deployment** — One Render Web Service serves both the website and the API

---

## Deploying to Render (one-time setup)

### Step 1 — Supabase database

1. Go to [supabase.com](https://supabase.com) → create a new project
2. Go to **Settings** → **Database**
3. Scroll to **Connection string** → choose the **Session mode** tab (port 5432 via pooler)
4. Copy the URI — it looks like:
   `postgresql://postgres.xxxxxxxx:[PASSWORD]@aws-0-region.pooler.supabase.com:5432/postgres`
5. Add it as a Render environment variable: `DATABASE_URL = <that URI>`

The `shops` table is created automatically on first server startup — no migration needed.

### Step 2 — Web Service on Render

1. Render dashboard → **New** → **Web Service**
2. Connect your GitHub repo (`mdmahinpro/cake-website`)
3. Settings:
   - **Branch**: `main`
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
   - **Start Command**: `node artifacts/api-server/dist/index.mjs`
   - **Environment**: Node
4. Add environment variable:
   - `DATABASE_URL` = your Supabase Session Pooler URI (from Step 1)
5. Deploy

### Step 3 — Connect the admin panel

1. Open your Render URL → go to `/control` → log in
2. Go to the **Sync** tab
3. Enter your **Shop ID** (e.g. `techely-cake-shop`) and **Sync Token** (default: `admin123`)
4. Click **Connect & Test** — you should see "Connected! Data synced successfully."
5. Every change you make now auto-saves and appears on all devices worldwide

---

## How sync works

- **Admin device**: When you make changes, they auto-save to Supabase after 1.5 seconds
- **Visitor devices**: On page load, the site fetches the latest data from Supabase and displays it
- **Hard refresh**: Safe — the app checks timestamps before overwriting; fresher local edits are never reverted
- **New devices**: Automatically discover and load your shop data with no configuration needed

---

## Local development

```bash
pnpm install
# Start all services
pnpm --filter @workspace/api-server run dev   # API on :8080
pnpm --filter @workspace/sweet-dreams run dev  # Frontend via Vite
```

Note: Local dev requires `DATABASE_URL` set as a Replit secret. Without it, the API returns 503 (expected — the site still works using local demo data).

---

## Admin panel login

Default password: `admin` (set in `artifacts/sweet-dreams/src/pages/AdminPage.tsx`)

Change it before going public!
