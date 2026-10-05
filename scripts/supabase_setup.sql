-- ============================================================
-- Looking Elegant – Supabase Database Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. CREATE TABLES ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS inventory (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  category              TEXT NOT NULL CHECK (category IN ('Suit', 'Tuxedo', 'Shoes', 'Accessory')),
  size                  TEXT NOT NULL,
  rental_price_per_day  INTEGER NOT NULL DEFAULT 0,
  status                TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'rented', 'dry_cleaning')),
  condition_notes       TEXT,
  image_url             TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT,
  customer_address TEXT,
  order_type       TEXT DEFAULT 'Store Pickup',
  items            JSONB NOT NULL DEFAULT '[]',
  total_amount     INTEGER DEFAULT 0,
  deposit_amount   INTEGER DEFAULT 0,
  payment_method   TEXT,
  payment_status   TEXT DEFAULT 'Pending',
  order_status     TEXT NOT NULL DEFAULT 'pending'
    CHECK (order_status IN ('pending', 'confirmed', 'delivered', 'returned', 'cancelled')),
  start_date       DATE,
  return_date      DATE,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT NOT NULL,
  id_number    TEXT,
  phone_number TEXT,
  items_taken  TEXT,
  return_due   DATE,
  status       TEXT DEFAULT 'active_rental'
    CHECK (status IN ('active_rental', 'returned', 'overdue')),
  recorded_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY ────────────────────────────────

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients   ENABLE ROW LEVEL SECURITY;

-- 3. RLS POLICIES ─────────────────────────────────────────────

-- INVENTORY: public can read (website collection page)
CREATE POLICY "Public can read inventory"
  ON inventory FOR SELECT USING (true);

-- INVENTORY: only signed-in admin can write
CREATE POLICY "Auth users can manage inventory"
  ON inventory FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ORDERS: anyone can place an order (website rent form)
CREATE POLICY "Public can place orders"
  ON orders FOR INSERT WITH CHECK (true);

-- ORDERS: only signed-in admin can read/update/delete
CREATE POLICY "Auth users can read orders"
  ON orders FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete orders"
  ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- CLIENTS: only signed-in admin (all operations)
CREATE POLICY "Auth users can manage clients"
  ON clients FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 4. STORAGE RLS (run after creating 'product-images' bucket) ─

-- Anyone can view product images (needed for website to load images)
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Only authenticated users can upload images
CREATE POLICY "Auth users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Only authenticated users can delete images
CREATE POLICY "Auth users can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- 5. REALTIME ─────────────────────────────────────────────────
-- Enable realtime for all three tables so the dashboard updates live

ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;

-- ============================================================
-- DONE! Now:
-- 1. Go to Storage → create 'product-images' bucket (set Public = true)
-- 2. Go to Authentication → Users → Invite the boutique owner's email
-- 3. Fill in admin/.env and website/.env with your project URL + anon key
-- 4. Run: node scripts/seed.js  (to load initial inventory data)
-- ============================================================
