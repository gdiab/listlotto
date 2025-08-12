-- Sample data for development
-- Run this after schema.sql in your Supabase SQL Editor
-- This creates test data for development/testing

-- Note: In production, users and lists will be created through the app
-- This seed data is only for development testing

-- Sample lists with different types of content
-- These will be owned by the first authenticated user

-- Insert sample list data (will be associated with authenticated user automatically)
-- You can run this after creating your first user account

/*
Example usage after you have authenticated users:

-- Replace 'user-uuid-here' with actual user UUID from auth.users table
INSERT INTO public.lists (user_id, title, items, is_archived) VALUES 
(
  'user-uuid-here',
  'Dinner Ideas',
  '[
    {"id": "1", "text": "Pizza", "createdAt": 1691234567890},
    {"id": "2", "text": "Sushi", "createdAt": 1691234567891},
    {"id": "3", "text": "Italian", "createdAt": 1691234567892},
    {"id": "4", "text": "Mexican", "createdAt": 1691234567893}
  ]'::jsonb,
  false
),
(
  'user-uuid-here',
  'Weekend Activities',
  '[
    {"id": "1", "text": "Hiking", "createdAt": 1691234567894},
    {"id": "2", "text": "Movie Theater", "createdAt": 1691234567895},
    {"id": "3", "text": "Beach Day", "createdAt": 1691234567896},
    {"id": "4", "text": "Museum Visit", "createdAt": 1691234567897},
    {"id": "5", "text": "Cooking Class", "createdAt": 1691234567898}
  ]'::jsonb,
  false
),
(
  'user-uuid-here',
  'Book Reading List',
  '[
    {"id": "1", "text": "The Midnight Library", "createdAt": 1691234567899},
    {"id": "2", "text": "Atomic Habits", "createdAt": 1691234567900},
    {"id": "3", "text": "Project Hail Mary", "createdAt": 1691234567901}
  ]'::jsonb,
  false
),
(
  'user-uuid-here',
  'Archived Old List',
  '[
    {"id": "1", "text": "Old Item 1", "createdAt": 1691234567902},
    {"id": "2", "text": "Old Item 2", "createdAt": 1691234567903}
  ]'::jsonb,
  true
);
*/

-- Instructions for development setup:
-- 1. Create your Supabase project at https://supabase.com
-- 2. Run the schema.sql first
-- 3. Set up Google OAuth in Supabase Auth settings
-- 4. Create your first user account through the app
-- 5. Get the user UUID from the auth.users table
-- 6. Uncomment and modify the INSERT statements above with your user UUID
-- 7. Run this seed.sql to create sample data

SELECT 'Seed file ready - follow instructions in comments above' as message;