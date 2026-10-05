/**
 * seed.js – One-time data migration from hardcoded mock data → Supabase
 *
 * Usage:
 *   1. Fill in your Supabase URL and Service Role Key below (NOT the anon key)
 *   2. Run: node scripts/seed.js
 *
 * The Service Role key bypasses RLS so we can seed without being logged in.
 * Find it: Supabase Dashboard → Settings → API → service_role (secret)
 * ⚠️  Never commit this key to Git!
 */

import { createClient } from '@supabase/supabase-js'

// ── CONFIG ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xfklochgaqozwiiseiia.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhma2xvY2hnYXFvendpaXNlaWlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDE2NDgxNCwiZXhwIjoyMTA1NzQwODE0fQ.ttE25RSQCe6OzCUNRwQ2YOCPVH9Dq5ZWVCEm0PiEkV8'
// ──────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// ── Seed data (from existing initialItems.js, initialOrders.js, initialClients.js)
const INVENTORY_SEED = [
  {
    name: 'Midnight Navy 3-Piece',
    category: 'Suit',
    size: '42R',
    rental_price_per_day: 15000,
    status: 'available',
    condition_notes: 'Excellent',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
  },
  {
    name: 'Ivory Peak Tuxedo',
    category: 'Tuxedo',
    size: '40R',
    rental_price_per_day: 22000,
    status: 'available',
    condition_notes: 'Good',
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5d8e?w=400&q=80',
  },
  {
    name: 'Classic Oxford Brogues',
    category: 'Shoes',
    size: '43',
    rental_price_per_day: 7000,
    status: 'available',
    condition_notes: 'Minor scuff on left toe',
    image_url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&q=80',
  },
  {
    name: 'Charcoal Slim Fit Suit',
    category: 'Suit',
    size: '38R',
    rental_price_per_day: 14000,
    status: 'available',
    condition_notes: 'Excellent',
    image_url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80',
  },
  {
    name: 'Gold Silk Pocket Square',
    category: 'Accessory',
    size: 'OS',
    rental_price_per_day: 2000,
    status: 'available',
    condition_notes: 'Brand new',
    image_url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80',
  },
  {
    name: 'Onyx Double-Breasted',
    category: 'Suit',
    size: '44R',
    rental_price_per_day: 18000,
    status: 'available',
    condition_notes: 'Very good',
    image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&q=80',
  },
]

const CLIENTS_SEED = [
  {
    full_name: 'Jean Paul Nkurunziza',
    id_number: '1 1988 8 0039281 0 45',
    phone_number: '0788 554 433',
    items_taken: 'Charcoal Slim Fit Suit (38R)',
    return_due: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    status: 'active_rental',
  },
  {
    full_name: 'Marie Claire Uwera',
    id_number: '1 1993 7 0048192 0 12',
    phone_number: '0785 221 990',
    items_taken: 'Onyx Double-Breasted Suit (44R)',
    return_due: new Date().toISOString().slice(0, 10),
    status: 'active_rental',
  },
  {
    full_name: 'Patrick Kalisa',
    id_number: '1 1985 8 0019283 0 77',
    phone_number: '0722 889 001',
    items_taken: 'Midnight Navy 3-Piece (42R)',
    return_due: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
    status: 'returned',
  },
]

async function seed() {
  console.log('🌱 Seeding Looking Elegant database...\n')

  // ── Inventory ─────────────────────────────────────────────────────────────
  console.log('📦 Seeding inventory...')
  const { data: inv, error: invErr } = await supabase
    .from('inventory')
    .insert(INVENTORY_SEED)
    .select()

  if (invErr) {
    console.error('❌ Inventory seed error:', invErr.message)
  } else {
    console.log(`✅ Inserted ${inv.length} inventory items`)
  }

  // ── Clients ───────────────────────────────────────────────────────────────
  console.log('\n👥 Seeding clients...')
  const { data: cli, error: cliErr } = await supabase
    .from('clients')
    .insert(CLIENTS_SEED)
    .select()

  if (cliErr) {
    console.error('❌ Clients seed error:', cliErr.message)
  } else {
    console.log(`✅ Inserted ${cli.length} clients`)
  }

  console.log('\n🎉 Seed complete! Open your Supabase dashboard to verify.')
}

seed().catch(console.error)
