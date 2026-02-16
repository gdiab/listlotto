-- Migration: Add use_weights column to lists table
-- This enables weighted randomization per list
-- Backwards compatible: existing lists default to FALSE (standard randomization)

-- Add use_weights column with default FALSE
ALTER TABLE public.lists
ADD COLUMN IF NOT EXISTS use_weights BOOLEAN DEFAULT FALSE;

-- Note: Item weights are stored in the JSONB items array
-- Each item can have an optional "weight" field (default 1 when undefined)
-- Example: {"id": "...", "text": "Pizza", "createdAt": 123, "weight": 2}
-- No schema change needed for items - JSONB is flexible

-- Add comment for documentation
COMMENT ON COLUMN public.lists.use_weights IS 'When true, item weights affect randomization probability';
