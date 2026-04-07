-- ============================================================
-- SeatCracker Analytics Schema — Run in Supabase SQL Editor
-- ============================================================

-- 1. USERS TABLE
-- Tracks every registered user + their premium status.
-- `id` = Firebase UID (text, not UUID).
CREATE TABLE IF NOT EXISTS public.users (
  id            TEXT        PRIMARY KEY,          -- Firebase UID
  is_premium    BOOLEAN     NOT NULL DEFAULT FALSE,
  purchase_date TIMESTAMPTZ DEFAULT NULL,
  plan          TEXT        DEFAULT NULL,         -- e.g. 'EAMCET_FULL_ACCESS'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow backend (anon key) to read/insert/update this table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service: full access to users"
  ON public.users
  USING (true)
  WITH CHECK (true);

-- 2. PAYMENTS TABLE
-- Records every verified Razorpay payment.
CREATE TABLE IF NOT EXISTS public.payments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,
  amount     INT         NOT NULL,               -- in INR (e.g. 199)
  status     TEXT        NOT NULL DEFAULT 'success', -- 'success' | 'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service: full access to payments"
  ON public.payments
  USING (true)
  WITH CHECK (true);

-- 3. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_is_premium   ON public.users    (is_premium);
CREATE INDEX IF NOT EXISTS idx_payments_user_id   ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status    ON public.payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_created   ON public.payments (created_at DESC);

-- ============================================================
-- Verification queries — run after migration to confirm setup
-- ============================================================
-- SELECT COUNT(*) FROM public.users;
-- SELECT COUNT(*) FROM public.payments;
-- SELECT SUM(amount) FROM public.payments WHERE status = 'success';
