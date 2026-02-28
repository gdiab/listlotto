-- Migration 003: Add sort_order column for custom list ordering
-- Run this in your Supabase SQL Editor

-- Add sort_order column (NULL means no custom order assigned yet)
ALTER TABLE public.lists ADD COLUMN IF NOT EXISTS sort_order INTEGER NULL;

-- Backfill sort_order for existing active lists based on updated_at (most recent = lowest number = top)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) AS rn
  FROM public.lists
  WHERE is_archived = FALSE
)
UPDATE public.lists
SET sort_order = ranked.rn
FROM ranked
WHERE public.lists.id = ranked.id;

-- Index for efficient custom sort ordering
CREATE INDEX IF NOT EXISTS lists_user_sort_order_idx
  ON public.lists (user_id, is_archived, sort_order ASC);
