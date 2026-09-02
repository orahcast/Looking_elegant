# Looking Elegant Atelier — Premium Suit & Shoe Rental Platform

A modern, high-end web platform and Progressive Web Application (PWA) built for **Looking Elegant Atelier**, an exclusive suits and shoes rental boutique. This solution provides a luxury storefront for clients to browse and rent ceremonial attire, alongside a mobile-first **Inventory Central** dashboard for the store owner.

---

## 📌 Project Overview

### 1. Client Storefront (Luxury Digital Atelier)
- **Hero & Brand Experience:** High-end visual identity showcasing luxury bespoke tailoring and footwear.
- **The Signature Curation (Catalog):** Dynamic display of available suits, tuxedos, brogues, derbies, and loafers with pricing per day (e.g., in RWF) and rental availability.
- **Ceremony Booking / Rental Flow:** Seamless path for clients to select looks, schedule fittings, or place rental inquiries.
- **How It Works:** Intuitive 3-step ceremony guide (*Select Your Look*, *Book Online*, *Pick Up & Perfect*).
- **Atelier Details:** Store location, operating hours, fitting guidelines, and contact channels.

### 2. Owner Portal (Inventory Central PWA)
- **Mobile-First PWA:** Installable directly to the owner's smartphone home screen (*"Add to Home Screen"*) with native app feel and offline caching.
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

## 📱 PWA Features

- **Installable Web App:** Custom `manifest.webmanifest` with icons, standalone display mode, and luxury theme colors.
- **Instant Access:** One-tap launch from the phone's home screen without needing app store downloads.
- **Responsive Layout:** Tailored controls optimized for one-handed mobile inventory management.

---

## 🚀 Getting Started for Developers

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- Supabase account & project credentials

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/Looking_elegant.git
cd Looking_elegant
npm install
```

### 2. Environment Variables Setup
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🚢 Deployment & Domain Workflow

1. **GitHub Integration:** Connect this repository to **Vercel**.
2. **Environment Configuration:** Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Vercel Environment Variables.
3. **Custom Domain:**
   - Link domain purchased on **Namecheap**.
   - Configure DNS records (A record / CNAME) pointing to Vercel DNS.

---

## 👥 Team Collaboration Guidelines

- Keep UI components modular and responsive.
- Adhere to the luxury design language (refined typography, harmonious dark/neutral palettes, smooth micro-interactions).
- Ensure all admin actions update Supabase database state in real-time.