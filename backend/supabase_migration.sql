-- ============================================================
-- Tandarust AI — Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- ── 1. Profiles table (linked to Supabase Auth) ─────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('doctor', 'patient', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ── 2. Patients table ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    symptoms TEXT NOT NULL,
    urgency_score INTEGER NOT NULL DEFAULT 50 CHECK (urgency_score BETWEEN 0 AND 100),
    urgency_level TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency_level IN ('Low', 'Medium', 'High', 'Critical')),
    wait_time TEXT NOT NULL DEFAULT '30 min',
    avatar TEXT NOT NULL DEFAULT '',
    history TEXT[] NOT NULL DEFAULT '{}',
    risk_scores JSONB NOT NULL DEFAULT '[]',
    ai_summary TEXT NOT NULL DEFAULT '',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for priority queue (most urgent first)
CREATE INDEX IF NOT EXISTS idx_patients_urgency ON public.patients (urgency_score DESC);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON public.patients (created_at DESC);


-- ── 3. Prescriptions table ──────────────────────────
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    patient_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    medications JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Digitized', 'Verified')),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON public.prescriptions (status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_date ON public.prescriptions (date DESC);


-- ── 4. Row Level Security (RLS) ─────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, update own
CREATE POLICY "Profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Patients: all authenticated users can read; doctors/admins can insert/update/delete
CREATE POLICY "Patients are viewable by authenticated users"
    ON public.patients FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Doctors and admins can insert patients"
    ON public.patients FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

CREATE POLICY "Doctors and admins can update patients"
    ON public.patients FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

CREATE POLICY "Doctors and admins can delete patients"
    ON public.patients FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

-- Prescriptions: all authenticated can read; doctors/admins can manage
CREATE POLICY "Prescriptions are viewable by authenticated users"
    ON public.prescriptions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Doctors and admins can insert prescriptions"
    ON public.prescriptions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

CREATE POLICY "Doctors and admins can update prescriptions"
    ON public.prescriptions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );

CREATE POLICY "Doctors and admins can delete prescriptions"
    ON public.prescriptions FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('doctor', 'admin')
        )
    );


-- ── 5. Storage bucket for prescription images ───────
-- Run this via Supabase Dashboard → Storage → New bucket
-- Name: prescription-images
-- Public: false (signed URLs for access)
-- Or use the SQL below:
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescription-images', 'prescription-images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload prescription images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'prescription-images');

-- Storage policy: authenticated users can read
CREATE POLICY "Authenticated users can read prescription images"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'prescription-images');


-- ── 6. Updated_at trigger ────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_patients_updated_at
    BEFORE UPDATE ON public.patients
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_prescriptions_updated_at
    BEFORE UPDATE ON public.prescriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
