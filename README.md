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
5. You'll paste this as `DATABASE_URL` in Step 2.

The `shops` table is created automatically on first server startup — no migration needed.

### Step 2 — Web Service on Render

1. Render dashboard → **New** → **Web Service**
2. Connect your GitHub repo (`mdmahinpro/cake-website`)
3. Settings:
   - **Branch**: `main`
   - **Build Command**: `pnpm install --frozen-lockfile && pnpm --filter @workspace/api-server run build`
   - **Start Command**: `node artifacts/api-server/dist/index.mjs`
   - **Environment**: Node
4. Add these environment variables:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | Your Supabase Session Pooler URI (from Step 1) |
| `VITE_SHOP_ID` | Recommended | Your shop slug, e.g. `techely-cake-shop` |
| `VITE_SYNC_TOKEN` | Recommended | Secret token that protects backend writes |
| `VITE_ADMIN_PASSWORD` | Recommended | Admin panel login password (default: `admin123`) |

> **Security tip:** Always set `VITE_SYNC_TOKEN` and `VITE_ADMIN_PASSWORD` before sharing the site publicly.

5. Deploy

### Step 3 — Connect the admin panel

1. Open your Render URL → go to `/control` → log in
2. Go to the **Sync** tab
3. If you set `VITE_SHOP_ID` and `VITE_SYNC_TOKEN` as environment variables, the panel auto-configures — just click **Connect & Test**
4. If not using env vars: enter your **Shop ID** (e.g. `techely-cake-shop`) and **Sync Token** manually
5. Click **Connect & Test** — you should see "Connected! Data synced successfully."
6. Every change you make now auto-saves and appears on all devices worldwide

---

## Admin panel password

The admin panel is at `/control`. The password system works in priority order:

```
1. VITE_ADMIN_PASSWORD  (environment variable — recommended for production)
2. sd_admin_password    (localStorage — set when you change it via Settings)
3. admin123             (hardcoded fallback — change this before going public!)
```

### How to change your password

1. Log into the admin panel at `/control`
2. Go to **Settings** tab → scroll to **Admin Password**
3. Enter your current password, then your new password (twice)
4. Click **Update Password**

The new password is saved to `localStorage` on your device immediately.

> **Important:** The password change via Settings only affects the current browser/device.
> For a password that works across all devices and browsers, use the `VITE_ADMIN_PASSWORD` environment variable instead (see below).

### Setting a permanent password via environment variable (recommended)

On Render:

1. Go to your Web Service → **Environment**
2. Add `VITE_ADMIN_PASSWORD = yourStrongPassword123`
3. Click **Save Changes** — Render will rebuild and redeploy automatically
4. Your new password now works from any device, any browser, forever

On Replit (for development):

1. Go to **Secrets** (lock icon in left sidebar)
2. Add key `VITE_ADMIN_PASSWORD` with your password as value
3. Restart the workflow

### Forgot your password?

**If you set `VITE_ADMIN_PASSWORD`:** Update or remove it in your Render/Replit environment variables.

**If you used the in-panel Settings to change it** (stored in localStorage):

Option A — Reset via browser console:
1. Open your site in the browser
2. Press **F12** → go to **Console** tab
3. Type: `localStorage.removeItem("sd_admin_password")` and press Enter
4. Reload the page — the password resets to the default (`admin123` or `VITE_ADMIN_PASSWORD` if set)

Option B — Reset via Render (nuclear option):
1. In Render → **Environment** → set `VITE_ADMIN_PASSWORD = newpassword`
2. Redeploy — this overrides everything

---

## Sync token (backend write protection)

The sync token is a separate secret that protects your Supabase database from unauthorised writes.
It is different from the admin panel login password.

```
1. VITE_SYNC_TOKEN    (environment variable — recommended for production)
2. sd_sync_token      (localStorage — set when you configure the Sync tab)
3. admin123           (hardcoded fallback — change this before going public!)
```

Set it the same way as `VITE_ADMIN_PASSWORD` above.

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
pnpm --filter @workspace/api-server run dev   # API on :8080 + frontend served from it
pnpm --filter @workspace/sweet-dreams run dev  # Frontend dev server with HMR
```

Set these Replit secrets for local dev:

| Secret | Value |
|---|---|
| `DATABASE_URL` | Your Supabase pooler URI |
| `SESSION_SECRET` | Any random string |

Without `DATABASE_URL`, the API returns 503 (expected — the public site still works using local demo data).

---

## Environment variables reference

| Variable | Where used | Description |
|---|---|---|
| `DATABASE_URL` | API server | Supabase PostgreSQL connection string |
| `SESSION_SECRET` | API server | Express session secret |
| `VITE_ADMIN_PASSWORD` | Frontend (build-time) | Admin panel login password |
| `VITE_SYNC_TOKEN` | Frontend (build-time) | Token sent with every backend write |
| `VITE_SHOP_ID` | Frontend (build-time) | Auto-configures the shop without manual Sync tab setup |
| `VITE_API_URL` | Frontend (build-time) | Override API base URL (leave empty for same-origin `/api`) |

> **Note:** `VITE_*` variables are baked into the frontend bundle at **build time**.
> If you change them on Render, the service must **redeploy** for them to take effect.
> The admin panel Settings and Sync tabs let you override them at runtime via `localStorage`
> — useful for quick testing without a full redeploy.
