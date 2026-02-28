-- Migration 002: Add user preferences JSONB and list archived_at timestamp
-- Run this in your Supabase SQL Editor

-- Add preferences column to users table for storing dashboard settings
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferences JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Add archived_at timestamp to lists table for tracking when a list was archived
ALTER TABLE public.lists ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ NULL;

-- Backfill archived_at for existing archived lists using updated_at as best approximation
UPDATE public.lists SET archived_at = updated_at WHERE is_archived = TRUE AND archived_at IS NULL;

-- Index for efficient archived list sorting (recently archived first)
CREATE INDEX IF NOT EXISTS lists_user_archived_at_idx
  ON public.lists (user_id, is_archived, archived_at DESC);
