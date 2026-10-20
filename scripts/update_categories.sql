-- ============================================================
-- Looking Elegant – Category Check Constraint Update
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Drop the old constraint that only allowed ('Suit', 'Tuxedo', 'Shoes', 'Accessory')
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_category_check;

-- Add updated constraint allowing Women Suit, Men Suit, Blazer, etc.
ALTER TABLE inventory ADD CONSTRAINT inventory_category_check 
  CHECK (category IN ('Suit', 'Men Suit', 'Women Suit', 'Women Suits', 'Tuxedo', 'Blazer', 'Shoes', 'Accessory'));
