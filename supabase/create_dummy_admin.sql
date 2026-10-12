-- Create Dummy Admin in Supabase Auth & Profiles
-- Run this in Supabase Dashboard -> SQL Editor

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  new_admin_id UUID := 'a0000000-0000-0000-0000-000000000001'::UUID;
BEGIN
  -- 1. Insert into auth.users if not already existing
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@fellashoney.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    ) VALUES (
      new_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@fellashoney.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Master Beekeeper (Admin)","phone":"+1 (555) 888-BEE1","role":"admin"}',
      now(),
      now(),
      'authenticated',
      'authenticated',
      ''
    );
  END IF;

  -- 2. Insert or update public.profiles with role = 'admin'
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    phone,
    role,
    created_at,
    updated_at
  ) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@fellashoney.com' LIMIT 1),
    'Master Beekeeper (Admin)',
    'admin@fellashoney.com',
    '+1 (555) 888-BEE1',
    'admin',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Master Beekeeper (Admin)',
    email = 'admin@fellashoney.com';

END $$;
