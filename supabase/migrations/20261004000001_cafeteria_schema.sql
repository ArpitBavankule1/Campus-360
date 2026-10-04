-- ==============================================================================
-- CampusLens AI — Phase 35: Smart Campus Cafeteria, Dining Wallets & Contactless Food Ordering
-- Migration: 20261004000001_cafeteria_schema.sql
-- ==============================================================================

-- 1. Dining Vendors & Food Outlets Table
CREATE TABLE IF NOT EXISTS public.dining_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  cuisine_type TEXT NOT NULL CHECK (cuisine_type IN ('North Indian & Thali', 'South Indian Tiffin', 'Continental & Italian', 'Asian & Wok', 'Fresh Juice & Bakery', 'Healthy Protein Bowls', 'Specialty Coffee & Tea')),
  location_stall TEXT NOT NULL,
  opening_time TIME NOT NULL DEFAULT '07:30:00',
  closing_time TIME NOT NULL DEFAULT '22:30:00',
  rating NUMERIC(2, 1) NOT NULL DEFAULT 4.5,
  is_accepting_orders BOOLEAN NOT NULL DEFAULT true,
  average_prep_time_mins INT NOT NULL DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Live Menu Catalog Table
CREATE TABLE IF NOT EXISTS public.cafeteria_menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.dining_vendors(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Breakfast', 'Lunch Specials', 'Snacks & Beverages', 'Healthy Bowls', 'Dinner')),
  price_inr INT NOT NULL CHECK (price_inr > 0),
  dietary_tag TEXT NOT NULL CHECK (dietary_tag IN ('Pure Veg', 'Vegan', 'Egg', 'Non-Veg', 'Jain Option')),
  calories INT NOT NULL DEFAULT 350,
  is_in_stock BOOLEAN NOT NULL DEFAULT true,
  prep_time_mins INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Student Digital Dining Wallets Table
CREATE TABLE IF NOT EXISTS public.dining_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  wallet_balance_inr NUMERIC(8, 2) NOT NULL DEFAULT 1500.00,
  monthly_subsidy_inr NUMERIC(8, 2) NOT NULL DEFAULT 500.00,
  auto_reload_enabled BOOLEAN NOT NULL DEFAULT true,
  qr_payment_token TEXT NOT NULL UNIQUE,
  last_topup_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Meal Orders & Contactless Pickup Tokens Table
CREATE TABLE IF NOT EXISTS public.meal_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  order_code TEXT NOT NULL UNIQUE,
  scholar_id TEXT NOT NULL,
  scholar_name TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  items_summary TEXT NOT NULL,
  total_amount_inr NUMERIC(8, 2) NOT NULL,
  pickup_slot TEXT NOT NULL,
  order_status TEXT NOT NULL DEFAULT 'Preparing' CHECK (order_status IN ('Preparing', 'Ready for Pickup', 'Completed', 'Cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'Dining Wallet' CHECK (payment_method IN ('Dining Wallet', 'UPI Instant', 'Campus Card')),
  token_pass_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for all dining tables
ALTER TABLE public.dining_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafeteria_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dining_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_orders ENABLE ROW LEVEL SECURITY;

-- Read policies for authenticated campus members
CREATE POLICY "Allow members to view dining vendors"
  ON public.dining_vendors FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow members to view cafeteria menu items"
  ON public.cafeteria_menu_items FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow scholars to view their dining wallets"
  ON public.dining_wallets FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow scholars to view meal orders"
  ON public.meal_orders FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Allow scholars to place meal orders"
  ON public.meal_orders FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);
