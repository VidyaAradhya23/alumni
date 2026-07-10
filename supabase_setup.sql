-- Supabase Setup Script for RVCE Alumni App
-- Run this script in the SQL Editor of your Supabase Dashboard to create all necessary tables, triggers, and functions.

-- 1. Create PUBLIC.USERS Table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    institution TEXT,
    department TEXT,
    batch_year TEXT,
    joining_year TEXT,
    bio TEXT,
    linkedin TEXT,
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create PUBLIC.POSTS Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create PUBLIC.REPORTS Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reported_item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create PUBLIC.BLOCKED_USERS Table
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blocker_id, blocked_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- 5. Define RLS Policies

-- Public Users Policies
CREATE POLICY "Allow authenticated users to read profiles" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow admins to delete users" ON public.users
    FOR DELETE USING (
        COALESCE(
            (SELECT is_approved FROM public.users WHERE id = auth.uid()), 
            FALSE
        )
    );

-- Posts Policies
CREATE POLICY "Allow authenticated users to read posts" ON public.posts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to create their own posts" ON public.posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own posts" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- Reports Policies
CREATE POLICY "Allow authenticated users to submit reports" ON public.reports
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = reporter_id);

CREATE POLICY "Allow authenticated users to see reports" ON public.reports
    FOR SELECT USING (auth.role() = 'authenticated');

-- Blocked Users Policies
CREATE POLICY "Allow users to manage their blocklist" ON public.blocked_users
    FOR ALL USING (auth.uid() = blocker_id);

-- 6. Trigger to automatically sync auth.users metadata into public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id, 
        name, 
        email, 
        institution, 
        department, 
        batch_year, 
        joining_year, 
        is_approved
    )
    VALUES (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', ''),
        new.email,
        coalesce(new.raw_user_meta_data->>'institution', ''),
        coalesce(new.raw_user_meta_data->>'department', ''),
        coalesce(new.raw_user_meta_data->>'batchYear', ''),
        coalesce(new.raw_user_meta_data->>'joiningYear', ''),
        false
    )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        institution = EXCLUDED.institution,
        department = EXCLUDED.department,
        batch_year = EXCLUDED.batch_year,
        joining_year = EXCLUDED.joining_year,
        is_approved = EXCLUDED.is_approved;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 7. RPC function to allow users to delete their own account from client library safely
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void AS $$
BEGIN
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
