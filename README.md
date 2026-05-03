# Sweet Dreams Cakes

A full-featured cake shop website with an admin panel and live backend sync. Built with React + Vite + TypeScript, deployed as a single service on Render.

---

## What's included

- **Public site** — Homepage, gallery, products/menu, and animated sections
- **Admin panel** — Manage gallery, carousel, products, categories, and settings at `/control`
- **Backend sync** — Every admin change auto-saves to a PostgreSQL database and syncs across all devices instantly
- **Single deployment** — One Render Web Service serves both the website and the API

---

## Deploying to Render (one-time setup)

### Step 1 — PostgreSQL database (already done if you followed setup)

1. Render dashboard → **New** → **PostgreSQL** → free tier → create
2. Copy the **Internal Database URL** (used only on Render, not locally)
3. Copy the **External Database URL** (used to run migrations from your local machine)

Run the migration once from your local terminal (with the external URL):
```
DATABASE_URL=<external-url> pnpm --filter @workspace/db run push
```

### Step 2 — Web Service

1. Render dashboard → **New** → **Web Service**
2. Connect your GitHub repo: `mdmahinpro/cake-website`
3. Fill in these settings:

| Setting | Value |
|---|---|
| **Root Directory** | *(leave blank)* |
| **Runtime** | Node |
| **Build Command** | `npm install -g pnpm@10 && pnpm install && pnpm --filter @workspace/api-server run build` |
| **Start Command** | `node artifacts/api-server/dist/index.mjs` |
| **Instance Type** | Free |

4. Add these **Environment Variables**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *(Internal Database URL from Step 1)* |

> **PORT** is set automatically by Render — do not add it.

5. Click **Create Web Service** and wait for the first deploy (~3-5 min).

Your site will be live at: `https://cake-website.onrender.com` (or your chosen name)

---

## Connecting the admin panel to the backend

Once the Render service is live:

1. Go to your site → `/control` → log in → open the **Sync** tab
2. Fill in:
   - **API URL**: your Render URL (e.g. `https://cake-website.onrender.com`) — or leave blank if using the built-in `/api`
   - **Shop ID**: a unique slug (e.g. `sweet-dreams`)
   - **Sync Token**: any secret password you choose (keep it private)
3. Click **Connect & Test** — your data saves to the database immediately

After connecting, every change in the admin panel auto-saves to the database within 1.5 seconds. All devices see the latest content.

---

## Local development

```bash
# Install dependencies
pnpm install

# Start everything (frontend + API)
pnpm --filter @workspace/sweet-dreams run dev   # Frontend at localhost:PORT
pnpm --filter @workspace/api-server run dev     # API at localhost:8080
```

Set a `DATABASE_URL` secret in Replit (external Render URL) to use the real database during development.

---

## Default admin password

```
admin123
```

Change it in the admin panel → Settings → Admin Password after first login.

---

## Notes on Render free tier

- The service **sleeps after 15 minutes** of no traffic
- First visitor after a sleep period waits ~30 seconds for it to wake up
- A loading indicator appears automatically during wake-up
- Upgrade to a paid plan ($7/mo) for always-on if needed

---

## For multiple client websites

Deploy the API once on Render — it can serve unlimited shops. Each client website just needs a different **Shop ID** in the Sync tab. Set `VITE_SHOP_ID` as a build-time environment variable to lock it in permanently for a specific client.
