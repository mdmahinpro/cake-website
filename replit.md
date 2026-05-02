# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains a full-featured cake shop website ("Sweet Dreams Cakes") as the primary artifact, plus an API server and mockup sandbox.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## Sweet Dreams Cakes (`artifacts/sweet-dreams`)

A frontend-only static React + Vite cake shop website. No backend required — all data lives in `localStorage`.

### Tech Stack
- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4 (all theme in `src/index.css` `@theme` block — no `tailwind.config.js`)
- Framer Motion
- React Router v7
- vite-plugin-pwa (PWA support)
- react-icons

### Routes
| Path | Description |
|------|-------------|
| `/` | Homepage (hero, carousel, gallery, delivered, testimonials, CTA) |
| `/gallery` | Full gallery with filters, search, masonry grid, lightbox |
| `/control` | Admin panel (password-protected) |
| `*` | 404 page |

### Key Files
- `src/store/useStore.tsx` — React Context store with localStorage persistence; auto-seeds demo data on first load
- `src/data/demoData.ts` — 12 demo gallery items + 3 carousel slides (Unsplash images)
- `src/index.css` — Tailwind v4 `@theme` block with caramel/choco/rose palette + custom animations
- `src/pages/AdminPage.tsx` — Admin router (internal `currentPage` state, no nested React Router routes)
- `src/components/admin/` — AdminLogin, AdminLayout, DashboardPage, GalleryManager, CarouselManager, SettingsPage
- `src/components/home/` — HeroSection, CategorySection, FeaturedCarousel, DeliveredSection, TestimonialsSection, CTASection, etc.
- `src/components/gallery/` — GalleryGrid, GalleryCard, FilterBar, SearchBar, Lightbox
- `src/components/shared/` — Navbar, Footer, SparkleField, FloatingParticles, AnimatedSection, OrderButton, FloatingOrderButton

### Admin Auth
- Password: `localStorage.getItem("sd_admin_password") || import.meta.env.VITE_ADMIN_PASSWORD || "admin123"`
- Session key: `cakeauth` in `sessionStorage`

### Data Model
- `CakeItem` — `{ id, caption, category, imageUrl, featured?, type? }` (type="delivered" for delivered orders)
- `CarouselSlide` — `{ id, title, subtitle, imageUrl, ctaText? }`
- `Settings` — shop name, tagline, hero text, whatsapp/facebook, order channel toggle, social URLs

### Deploy
- **Vercel**: `vercel.json` at root — SPA rewrite rules
- **Netlify**: `netlify.toml` — build config + redirects
- **Hostinger**: `public/.htaccess` — Apache rewrite for SPA
- **PWA**: icons at `public/icon-192.png` + `public/icon-512.png`, manifest injected by vite-plugin-pwa
- **Env**: copy `.env.example` → `.env`, set `VITE_ADMIN_PASSWORD`

### Icon Generation
Run once to regenerate PWA icons:
```bash
node scripts/src/generateIcons.mjs
```
