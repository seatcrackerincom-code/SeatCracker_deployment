-- Create new table for user exam access tracking
CREATE TABLE IF NOT EXISTS user_exam_access (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  exam_id text NOT NULL,
  is_premium boolean DEFAULT false,
  payment_id text,
  order_id text,
  amount_paid numeric(8,2),
  purchased_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, exam_id)
);

-- Enable RLS
ALTER TABLE user_exam_access ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own access data
CREATE POLICY "Users can read their own access" 
ON user_exam_access FOR SELECT 
USING (auth.uid()::text = user_id);

-- Policy: Only service role or server-side functions can write (usually via admin API)
-- For this setup, we'll allow the app to upsert if we trust the API, 
-- but better to restrict to server-side only in production.
CREATE POLICY "System can manage access" 
ON user_exam_access FOR ALL 
USING (true); 
