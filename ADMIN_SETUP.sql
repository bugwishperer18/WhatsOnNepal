-- ============================================
-- ADMIN SETUP COMMANDS
-- ============================================
-- Run these commands in your Supabase SQL Editor

-- 1. GRANT ADMIN ROLE TO A USER
-- Replace 'YOUR_USER_UUID' with the actual user ID from auth.users table
-- You can find user UUIDs in: Authentication > Users in Supabase dashboard

INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Example:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;


-- ============================================
-- HELPFUL QUERIES FOR ADMINS
-- ============================================

-- 2. VIEW ALL USERS
SELECT
    id,
    email,
    created_at,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;


-- 3. VIEW ALL ADMIN USERS
SELECT
    u.id,
    u.email,
    ur.role,
    ur.created_at as admin_since
FROM auth.users u
INNER JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY ur.created_at DESC;


-- 4. VIEW ALL EVENTS
SELECT
    id,
    title,
    city,
    category,
    start_at,
    created_at
FROM public.events
ORDER BY start_at DESC
LIMIT 50;


-- 5. VIEW EVENT COUNTS BY CATEGORY
SELECT
    category,
    COUNT(*) as event_count
FROM public.events
GROUP BY category
ORDER BY event_count DESC;


-- 6. VIEW EVENT COUNTS BY CITY
SELECT
    city,
    COUNT(*) as event_count
FROM public.events
GROUP BY city
ORDER BY event_count DESC;


-- 7. VIEW RECENT SCRAPE RUNS
SELECT
    id,
    ran_at,
    mode,
    status,
    requested_count,
    inserted_count,
    warnings,
    error_message
FROM public.admin_scrape_runs
ORDER BY ran_at DESC
LIMIT 10;


-- 8. VIEW USER BOOKMARKS
SELECT
    u.email,
    e.title as event_title,
    eb.created_at as bookmarked_at
FROM public.event_bookmarks eb
INNER JOIN auth.users u ON eb.user_id = u.id
INNER JOIN public.events e ON eb.event_id = e.id
ORDER BY eb.created_at DESC
LIMIT 50;


-- 9. VIEW USER REMINDERS
SELECT
    u.email,
    e.title as event_title,
    er.remind_at,
    er.created_at
FROM public.event_reminders er
INNER JOIN auth.users u ON er.user_id = u.id
INNER JOIN public.events e ON er.event_id = e.id
ORDER BY er.remind_at ASC
LIMIT 50;


-- ============================================
-- ADMIN MAINTENANCE COMMANDS
-- ============================================

-- 10. DELETE ALL EVENTS (USE WITH CAUTION!)
-- Uncomment to use:
-- DELETE FROM public.events;


-- 11. DELETE EVENTS FROM A SPECIFIC SCRAPE RUN
-- Replace 'RUN_UUID' with the admin_scrape_runs.id
-- DELETE FROM public.events
-- WHERE created_at >= (
--     SELECT ran_at FROM public.admin_scrape_runs WHERE id = 'RUN_UUID'
-- )
-- AND created_at <= (
--     SELECT ran_at + INTERVAL '1 minute' FROM public.admin_scrape_runs WHERE id = 'RUN_UUID'
-- );


-- 12. DELETE OLD EVENTS (past events older than 30 days)
-- DELETE FROM public.events
-- WHERE start_at < NOW() - INTERVAL '30 days';


-- 13. REMOVE ADMIN ROLE FROM A USER
-- Replace 'USER_UUID' with the actual user ID
-- DELETE FROM public.user_roles
-- WHERE user_id = 'USER_UUID' AND role = 'admin';


-- ============================================
-- TESTING AND DIAGNOSTICS
-- ============================================

-- 14. TEST RPC FUNCTION - Check if a user has admin role
-- Replace 'USER_UUID' with actual user ID
SELECT public.has_role('USER_UUID', 'admin');


-- 15. TEST RPC FUNCTION - Check if current user is admin
SELECT public.is_admin();


-- 16. VIEW RLS POLICIES
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


-- 17. COUNT ROWS IN ALL TABLES
SELECT
    'events' as table_name,
    COUNT(*) as row_count
FROM public.events
UNION ALL
SELECT
    'event_bookmarks',
    COUNT(*)
FROM public.event_bookmarks
UNION ALL
SELECT
    'event_reminders',
    COUNT(*)
FROM public.event_reminders
UNION ALL
SELECT
    'user_roles',
    COUNT(*)
FROM public.user_roles
UNION ALL
SELECT
    'admin_scrape_runs',
    COUNT(*)
FROM public.admin_scrape_runs;


-- ============================================
-- SAMPLE DATA FOR TESTING (OPTIONAL)
-- ============================================

-- 18. INSERT SAMPLE EVENTS FOR TESTING
-- Uncomment to use:
/*
INSERT INTO public.events (
    title,
    description,
    start_at,
    end_at,
    venue_name,
    city,
    category,
    organizer,
    image_url
) VALUES
(
    'Kathmandu Tech Meetup',
    'Monthly gathering of tech enthusiasts in Kathmandu. Network with developers, designers, and entrepreneurs.',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '3 hours',
    'Moksh Live',
    'Kathmandu',
    'tech',
    'Nepal Tech Community',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80'
),
(
    'Live Music Night at Thamel',
    'Enjoy live music performances from local bands. Great food and drinks available.',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '4 hours',
    'Thamel House Restaurant',
    'Kathmandu',
    'music',
    'Thamel Events',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'
),
(
    'Pokhara Food Festival',
    'Taste authentic Nepali and international cuisines from top restaurants in Pokhara.',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '16 days',
    'Lakeside Park',
    'Pokhara',
    'food',
    'Pokhara Tourism Board',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'
);
*/
