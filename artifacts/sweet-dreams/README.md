# Sweet Dreams Cake Website

A beautiful, fully responsive cake shop website with a public gallery and a password-protected admin panel. Built with React, Vite, TypeScript, Tailwind CSS v4, and Framer Motion.

## Features

- Homepage with animated hero, featured cake carousel, delivered orders gallery, testimonials, and social links
- Full gallery page with category filters, search, masonry grid, and lightbox with swipe support
- Complete admin panel at `/control` — gallery manager, carousel editor, settings, and more
- PWA-ready (installable on mobile)
- localStorage-based data persistence (no backend required)
- WhatsApp / Facebook order channel toggle

## Quick Deploy

### Vercel (Free, Recommended)

1. Push to GitHub
2. Connect repo at vercel.com
3. Set build command: `npm run build`, output: `dist`
4. Add environment variable: `VITE_ADMIN_PASSWORD=yourpassword`
5. Deploy — done!

### Netlify (Free)

1. Run `npm run build` locally
2. Drag the `dist` folder to netlify.com/drop
3. Add env variable `VITE_ADMIN_PASSWORD` in site settings → Environment

### Hostinger Shared Hosting

1. Run `npm run build` on your computer
2. Upload **all contents** of the `dist` folder to `public_html`
3. Upload `public/.htaccess` to `public_html`
4. Visit your domain — done!

## Environment Variables

Copy `.env.example` to `.env` and set your values:

```
VITE_ADMIN_PASSWORD=yoursecurepasswordhere
```

## Admin Panel

- URL: `yourdomain.com/control`
- Default password: `admin123` (change this immediately via Settings)
- Password is stored in `localStorage` after first change

## First Time Setup

1. Visit `/control` and log in
2. Go to **Settings** — update shop name, WhatsApp number, Facebook page URL
3. Toggle WhatsApp or Facebook as the preferred order channel
4. Go to **Gallery Manager** — delete demo items and add your real cake photos
5. Go to **Carousel Slides** — update homepage hero slides with your best photos
6. Export your data from Settings → Data Management to keep a backup

## Tech Stack

- React 19 + Vite 7 + TypeScript
- Tailwind CSS v4
- Framer Motion
- React Router v7
- vite-plugin-pwa

Built by TECHELY
