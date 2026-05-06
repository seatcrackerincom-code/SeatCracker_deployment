-- Phase 10: Admin Dashboard schema updates

-- 1. Add is_admin to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 2. Audit Actions Table
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email text NOT NULL,
    action_type text NOT NULL,
    target_user_id text,
    target_exam_id text,
    reason text,
    note text,
    performed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Polls System Tables
CREATE TABLE IF NOT EXISTS public.polls (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    question text NOT NULL,
    options jsonb NOT NULL,
    is_active boolean DEFAULT true,
    created_by text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id uuid REFERENCES public.polls(id) ON DELETE CASCADE,
    user_id text NOT NULL,
    selected_option integer NOT NULL,
    voted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(poll_id, user_id)
);

-- 4. Enable RLS
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- 5. Add Policies
-- Only service role (API) can insert/view admin actions
DROP POLICY IF EXISTS "Service role access admin actions" ON public.admin_actions;
CREATE POLICY "Service role access admin actions" ON public.admin_actions USING (true);

-- Polls are readable by everyone, writable by service role
DROP POLICY IF EXISTS "Public can view active polls" ON public.polls;
DROP POLICY IF EXISTS "Service role can manage polls" ON public.polls;
CREATE POLICY "Public can view active polls" ON public.polls FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can manage polls" ON public.polls USING (true);

-- Poll votes: users can insert their own vote
DROP POLICY IF EXISTS "Users can insert their own votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Service role can read votes" ON public.poll_votes;
CREATE POLICY "Users can insert their own votes" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- Poll votes: service role can read
CREATE POLICY "Service role can read votes" ON public.poll_votes FOR SELECT USING (true);

-- 6. Important Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active);
CREATE INDEX IF NOT EXISTS idx_user_exam_access_purchased ON public.user_exam_access(purchased_at);
