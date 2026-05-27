-- Migration: Add phone and company columns to contact_requests table
-- Execute this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/xdeyzxwnsklrpkkerrox/sql/new

ALTER TABLE public.contact_requests
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS company text;

-- Add comment to explain columns
COMMENT ON COLUMN public.contact_requests.phone IS 'Contact phone or WhatsApp number';
COMMENT ON COLUMN public.contact_requests.company IS 'Contact company or brand name';
