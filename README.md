# Looking Elegant Atelier — Premium Suit & Shoe Rental Platform

A modern, high-end web platform and Progressive Web Application (PWA) built for **Looking Elegant Atelier**, an exclusive suits and shoes rental boutique. This monorepo hosts two independent applications — a luxury client storefront and a mobile-first admin dashboard for inventory management.

---

## 📁 Monorepo Structure

```
Looking_elegant/
├── website/   ← Dev 1: Client-facing luxury storefront  (port 5173)
└── admin/     ← Dev 2: Owner PWA dashboard              (port 5174)
```

Each application is a standalone Vite + React project with its own dependencies, configs, and dev server.

---

## 📌 Applications

### 1. `website/` — Client Storefront (Luxury Digital Atelier)
Owned by **Developer 1**.

- **Hero & Brand Experience:** High-end visual identity showcasing luxury bespoke tailoring and footwear.
- **The Signature Curation (Catalog):** Dynamic display of available suits, tuxedos, brogues, derbies, and loafers with pricing per day (RWF) and rental availability.
- **Ceremony Booking / Rental Flow:** Seamless path for clients to select looks, schedule fittings, or place rental inquiries.
- **How It Works:** Intuitive 3-step ceremony guide (*Select Your Look*, *Book Online*, *Pick Up & Perfect*).
- **Atelier Details:** Store location, operating hours, fitting guidelines, and contact channels.

### 2. `admin/` — Owner Portal (Inventory Central PWA)
Owned by **Developer 2**.

- **Mobile-First PWA:** Installable directly to the owner's smartphone home screen with native app feel and offline caching.
- **Live Inventory Dashboard:** Overview of all rental stock with real-time status tracking:
  - 🟢 `Available`
  - 🔵 `Rented`
  - 🟡 `At Dry Cleaning`
- **Product Management (CRUD):**
  - Add new rental pieces with photo uploads, category, size variants, daily rental pricing, and condition notes.
  - Edit prices, descriptions, and rental availability on the fly.
  - Remove retired or discontinued items.
- **Secure Authentication:** Protected admin route restricted to the boutique owner.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React** (Vite) | Fast, modern client-side rendering & component architecture |
| **Styling** | **Tailwind CSS** | Utility-first styling for bespoke luxury aesthetics and responsive UI |
| **Mobile Experience** | **PWA (Vite PWA Plugin)** | Web App Manifest & Service Worker for home-screen installation |
| **Database & Auth** | **Supabase** | Managed PostgreSQL database & secure authentication |
| **Media & File Storage** | **Supabase Storage** | CDN-backed image bucket for garment and shoe photography |
| **Deployment & Hosting** | **Vercel** | Automated CI/CD, global CDN edge network, and SSL certificates |
| **Domain Management** | **Namecheap** | Custom boutique domain routing |

---

## 🗄️ Database Architecture (Supabase)

### `items` Table
```sql
create table public.items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  category text not null check (category in ('suit', 'tuxedo', 'shoes', 'accessory')),
  size text not null,
  rental_price_per_day numeric not null,
  currency text default 'RWF' not null,
  status text default 'available' not null check (status in ('available', 'rented', 'dry_cleaning')),
  condition_notes text,
  image_url text not null,
  is_featured boolean default false
);
```

### Storage Bucket
- **`inventory-photos`**: Public bucket for storing optimized product photography with Row Level Security (RLS) allowing owner uploads.

---

## 📱 PWA Features (admin/)

- **Installable Web App:** Custom `manifest.webmanifest` with icons, standalone display mode, and luxury theme colors (`#0a0906`).
- **Instant Access:** One-tap launch from the phone's home screen without needing app store downloads.
- **Responsive Layout:** Tailored controls optimized for one-handed mobile inventory management.
- **Service Worker:** Offline caching via Workbox (Vite PWA Plugin).

---

## 🚀 Getting Started for Developers

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/)
- Supabase account & project credentials

---

### Developer 1 — Storefront (`website/`)

```bash
cd website
npm install
npm run dev
# → http://localhost:5173
```

### Developer 2 — Admin Dashboard (`admin/`)

```bash
cd admin
npm install
npm run dev
# → http://localhost:5174
```

> **Tip:** Open two terminal windows to run both apps simultaneously.

---

### Environment Variables

Create a `.env.local` file inside **each** application folder:

**`website/.env.local`**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`admin/.env.local`**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
# Storefront
cd website && npm run build

# Admin dashboard
cd admin && npm run build
```

---

## 🚢 Deployment & Domain Workflow

1. **GitHub Integration:** Connect this repository to **Vercel** with two separate Vercel projects (one per app folder).
2. **Root Directory:** Set `website` or `admin` as the root directory for each Vercel project.
3. **Environment Configuration:** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to each project's Vercel Environment Variables.
4. **Custom Domain:**
   - Link domain purchased on **Namecheap**.
   - Configure DNS records (A record / CNAME) pointing to Vercel DNS.

---

## 👥 Team Roles & Week 1 Status

| Developer | Responsibility | Week 1 Status |
|---|---|---|
| **Dev 1** | Client Storefront (`website/`) | ✅ Hero, Navbar, Collection, How It Works, Footer |
| **Dev 2** | Admin Dashboard PWA (`admin/`) | ✅ Shell layout, Stats, Inventory Table, Add Item Modal |
| **Dev 3** | Supabase Backend & DevOps | 🔄 Schema creation, Auth setup, keys distribution |

---

## 📋 Team Collaboration Guidelines

- Each app lives in its own folder — **do not cross-import** between `website/` and `admin/`.
- Keep UI components modular and responsive.
- Adhere to the luxury design language (refined typography, harmonious dark/neutral palettes, smooth micro-interactions).
- Ensure all admin actions will update Supabase database state in real-time (Week 2).
- Prefix `.env.local` variables with `VITE_` for Vite compatibility.