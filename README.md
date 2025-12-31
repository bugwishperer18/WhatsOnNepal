# What's On Nepal - Event Discovery Platform

A full-stack event discovery and listing website focused on Nepal, built with Next.js, TypeScript, and Supabase.

## Features

✅ **Public Event Browsing**
- Discover events across Nepal
- Advanced search and filtering (city, category, date range)
- Event detail pages with full information

✅ **User Authentication**
- Email/password and magic link authentication
- User account management
- Secure session handling

✅ **Saved Events & Reminders**
- Bookmark favorite events
- Set custom reminders for events
- View all saved events in one place

✅ **Calendar Integration**
- Download events as .ics files
- Add events directly to Google Calendar
- Share events on social media

✅ **Admin Dashboard**
- Manual event creation with full form
- AI-generated event import (for testing)
- Web scraping for real Nepal events
- Debug panel with detailed logging
- Auth diagnostics tool

✅ **Robust Security**
- Row Level Security (RLS) on all tables
- Server-side role validation with RPC functions
- Proper JWT handling for Edge Functions
- Admin-only access controls

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS, Edge Functions)
- **Calendar**: ical-generator, Google Calendar API
- **Date Handling**: date-fns

## Project Structure

```
WhatsOnNepal/
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard
│   ├── auth/                     # Authentication pages
│   ├── components/               # Reusable components
│   ├── discover/                 # Event discovery page
│   ├── event/[id]/              # Event detail page
│   ├── saved-events/            # User's saved events
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── lib/                         # Shared libraries
│   ├── supabase/                # Supabase client setup
│   └── types.ts                 # TypeScript types
├── utils/                       # Utility functions
│   ├── calendar.ts              # Calendar export functions
│   ├── fallback-images.ts       # Category fallback images
│   └── format.ts                # Date/time formatting
├── supabase/
│   ├── migrations/              # Database migrations
│   └── functions/               # Edge Functions
│       └── scrape-events/       # Event import function
├── middleware.ts                # Next.js middleware
└── package.json
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- A Supabase account (https://supabase.com)
- Supabase CLI (optional, for local development)

### 2. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the database to initialize
3. Note your project URL and anon key from Settings > API

### 3. Run Database Migrations

**Option A: Using Supabase Dashboard**
1. Go to SQL Editor in your Supabase dashboard
2. Run each migration file in order:
   - `supabase/migrations/20240101000000_initial_schema.sql`
   - `supabase/migrations/20240101000001_rpc_functions.sql`
   - `supabase/migrations/20240101000002_rls_policies.sql`

**Option B: Using Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 4. Deploy Edge Function

**Using Supabase CLI:**
```bash
supabase functions deploy scrape-events
```

**Using Supabase Dashboard:**
1. Go to Edge Functions in your Supabase dashboard
2. Create a new function named `scrape-events`
3. Copy the code from `supabase/functions/scrape-events/index.ts`
4. Deploy the function

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at http://localhost:3000

### 7. Grant Admin Access

To make a user an admin, run this SQL in your Supabase SQL Editor:

```sql
-- Replace 'user-uuid' with the actual user ID from auth.users table
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

To find your user ID:
1. Sign up/login to the app
2. Go to Authentication > Users in Supabase dashboard
3. Copy the UUID of your user
4. Run the SQL above with your UUID

## Verification Checklist

Use this checklist to verify everything works end-to-end:

### ✅ Basic Functionality

- [ ] **Home page loads** - Visit http://localhost:3000
- [ ] **Featured events display** - See events on home page (may be empty initially)
- [ ] **Category chips work** - Click categories to filter
- [ ] **City links work** - Click cities to see city-specific events

### ✅ Authentication

- [ ] **Sign up works** - Create a new account at /auth/signup
- [ ] **Sign in works** - Sign in at /auth/login
- [ ] **Magic link works** - Try magic link authentication
- [ ] **Sign out works** - Sign out from header
- [ ] **Session persists** - Refresh page, still signed in

### ✅ Event Discovery

- [ ] **Discover page works** - Navigate to /discover
- [ ] **Search works** - Enter keywords and search
- [ ] **Filters work** - Test city, category, and date filters
- [ ] **Clear filters works** - Reset all filters
- [ ] **Events display** - See event cards with images

### ✅ Event Details

- [ ] **Event detail page loads** - Click an event card
- [ ] **All info displays** - See title, date, location, description
- [ ] **Bookmark works** - Save/unsave event (requires login)
- [ ] **Calendar export works** - Download .ics file
- [ ] **Google Calendar link works** - Opens Google Calendar
- [ ] **Reminder works** - Set a reminder (requires login)
- [ ] **Share works** - Test copy link, social shares

### ✅ Saved Events

- [ ] **Saved events page loads** - Navigate to /saved-events
- [ ] **Shows bookmarked events** - See events you saved
- [ ] **Empty state works** - Shows message when no events saved
- [ ] **Requires login** - Redirects to login if not authenticated

### ✅ Admin Access

- [ ] **Admin page blocked for non-admins** - Try accessing /admin before granting admin role
- [ ] **Shows "Access Denied"** - Non-admin users see access denied message
- [ ] **Grant admin role** - Run SQL to grant admin (see step 7 above)
- [ ] **Admin page accessible** - Access /admin after granting role
- [ ] **Admin shows in header** - See "Admin" link in navigation

### ✅ Admin - Create Event

- [ ] **Create event tab works** - Click "Create Event" tab
- [ ] **Form validation works** - Try submitting empty form
- [ ] **Create event works** - Fill form and create event
- [ ] **Success message shows** - See success confirmation
- [ ] **Event appears** - New event shows on discover page

### ✅ Admin - AI Import

- [ ] **Import events tab works** - Click "Import Events" tab
- [ ] **AI mode selected** - Select "AI Generated" mode
- [ ] **Set count to 5** - Enter 5 in count field
- [ ] **Import works** - Click "Import Events"
- [ ] **Success message shows** - See success with inserted count = 5
- [ ] **No generic errors** - No "Edge Function returned non-2xx" errors
- [ ] **Events appear** - 5 new events show on discover page

### ✅ Admin - Web Scrape Import

- [ ] **Scrape mode selected** - Select "Web Scrape" mode
- [ ] **Set count to 50** - Enter 50 in count field (may return fewer)
- [ ] **Import works** - Click "Import Events"
- [ ] **Success or warnings** - See success with count or warnings about sources
- [ ] **Events appear** - New events show on discover page

### ✅ Admin - Debug Panel

- [ ] **Debug panel tab works** - Click "Debug Panel" tab
- [ ] **Last run displays** - See details from last import
- [ ] **Shows all fields** - Run time, status, mode, counts visible
- [ ] **Inserted count correct** - Matches import result
- [ ] **Warnings display** - If any warnings, they show clearly
- [ ] **No generic errors** - Error messages are specific and helpful
- [ ] **Refresh works** - Click refresh to update

### ✅ Auth Diagnostics

- [ ] **Test function auth works** - Click "Test Function Auth" button
- [ ] **Shows user ID** - User ID displays
- [ ] **Shows token info** - Token issued/expires dates show
- [ ] **Test call succeeds** - Function responds with success
- [ ] **No JWT errors** - No "Invalid JWT" errors

### ✅ Edge Function Reliability

- [ ] **Proper auth validation** - Function rejects unauthenticated requests
- [ ] **Admin check works** - Function rejects non-admin users
- [ ] **Returns structured JSON** - All responses are valid JSON
- [ ] **Error codes present** - Errors include code and message
- [ ] **No 500 errors** - Function handles errors gracefully
- [ ] **Logs to database** - admin_scrape_runs table has entries

## Common Issues & Solutions

### "Invalid JWT" Error

**Problem**: Edge Function returns "Invalid JWT" error

**Solutions**:
1. Verify SUPABASE_URL in `.env.local` matches your project exactly
2. Check that you're using the user's `access_token`, not the anon key
3. Ensure Edge Function is deployed to the same Supabase project
4. Check token expiry in Auth Diagnostics panel

### Admin Access Not Working

**Problem**: Can't access /admin even after granting role

**Solutions**:
1. Verify SQL ran successfully in Supabase SQL Editor
2. Check `user_roles` table has the entry
3. Sign out and sign back in
4. Clear browser cache and cookies
5. Use Auth Diagnostics to test admin role check

### Events Not Appearing

**Problem**: Imported events don't show on discover page

**Solutions**:
1. Check Debug Panel for actual inserted count
2. Verify events table in Supabase has new rows
3. Check RLS policies are correctly applied
4. Refresh the discover page
5. Clear any filters that might hide events

### Edge Function Timeout

**Problem**: Import takes too long and times out

**Solutions**:
1. Reduce import count (try 10-20 instead of 50-100)
2. Use AI mode instead of scrape mode for faster results
3. Check Supabase function logs for specific errors
4. Ensure you have stable internet connection

## Database Schema

### Events Table
- Core event information
- Public SELECT, admin INSERT/UPDATE/DELETE
- Full-text search on title and description

### Event Bookmarks
- User's saved events
- Users can only access their own bookmarks
- Cascade delete when event is removed

### Event Reminders
- User-set reminders for events
- One reminder per user per event
- Cascade delete when event is removed

### User Roles
- Role assignments (currently only 'admin')
- Protected by RLS
- Queried via RPC for security

### Admin Scrape Runs
- Logs of all import operations
- Tracks success/failure, counts, warnings
- Only accessible to admins

## API Routes

### Edge Functions

**POST /functions/v1/scrape-events**
- Import events (AI or web scrape)
- Requires: Authorization header with user JWT
- Requires: Admin role
- Body: `{ mode: 'ai' | 'scrape', count: number }`
- Returns: `{ ok: true, inserted_count, warnings }` or error

## Development

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## License

MIT License - feel free to use this project as a template for your own event platforms.

## Support

For issues or questions:
1. Check the Common Issues section above
2. Review Supabase function logs
3. Use the Auth Diagnostics panel
4. Check browser console for errors
