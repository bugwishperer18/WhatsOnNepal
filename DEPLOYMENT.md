# Deployment Guide

This guide covers deploying What's On Nepal to production.

## Prerequisites

- Supabase project (production)
- Vercel account (or other Next.js hosting)
- Domain name (optional)

## Step 1: Prepare Supabase (Production)

### 1.1 Create Production Supabase Project

1. Go to https://supabase.com
2. Create a new project (separate from development)
3. Choose a strong database password
4. Select a region close to your users (Singapore for Nepal)
5. Wait for initialization to complete

### 1.2 Run Migrations

1. Go to SQL Editor in Supabase dashboard
2. Run migrations in order:
   - Copy and run `supabase/migrations/20240101000000_initial_schema.sql`
   - Copy and run `supabase/migrations/20240101000001_rpc_functions.sql`
   - Copy and run `supabase/migrations/20240101000002_rls_policies.sql`
3. Verify tables exist in Table Editor

### 1.3 Deploy Edge Function

**Option A: Using Supabase CLI**
```bash
# Install CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your-production-project-ref

# Deploy Edge Function
supabase functions deploy scrape-events
```

**Option B: Using Dashboard**
1. Go to Edge Functions in Supabase dashboard
2. Click "New Function"
3. Name it `scrape-events`
4. Copy entire content from `supabase/functions/scrape-events/index.ts`
5. Click "Deploy"

### 1.4 Get API Credentials

1. Go to Settings > API in Supabase dashboard
2. Copy:
   - Project URL
   - Anon/Public key
3. Keep these safe for next step

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub

```bash
git add .
git commit -m "Initial commit - What's On Nepal"
git push origin main
```

### 2.2 Import to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 2.3 Add Environment Variables

In Vercel project settings > Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Make sure these match your PRODUCTION Supabase project!

### 2.4 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed URL

## Step 3: Configure Production Settings

### 3.1 Supabase Auth Settings

1. Go to Authentication > URL Configuration in Supabase
2. Add your Vercel domain to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`
3. Save changes

### 3.2 Email Templates (Optional)

1. Go to Authentication > Email Templates
2. Customize:
   - Confirmation email
   - Magic link email
   - Password reset email
3. Add your branding and styling

### 3.3 Rate Limiting (Recommended)

1. Go to Database > Extensions
2. Enable `pg_cron` for scheduled tasks
3. Consider adding rate limiting to Edge Function

## Step 4: Grant Admin Access

### 4.1 Create Your Admin Account

1. Visit your deployed app
2. Sign up with your email
3. Verify email if required

### 4.2 Grant Admin Role

1. Go to Supabase dashboard > Authentication > Users
2. Find your user and copy the UUID
3. Go to SQL Editor
4. Run:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('your-user-uuid-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 4.3 Verify Admin Access

1. Sign in to your app
2. Check that "Admin" link appears in header
3. Visit /admin page
4. Test Auth Diagnostics panel
5. Try importing 5 AI events

## Step 5: Add Initial Content

### 5.1 Import Events

1. Go to /admin > Import Events
2. Select "AI Generated" mode
3. Set count to 20-30
4. Click "Import Events"
5. Verify events appear on discover page

### 5.2 Add Real Events (Optional)

Either:
- Use "Web Scrape" mode to import real events
- Manually create events using "Create Event" tab

### 5.3 Test All Features

Go through the verification checklist in README.md

## Step 6: Custom Domain (Optional)

### 6.1 Add Domain to Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS as instructed

### 6.2 Update Supabase Auth URLs

1. Go to Supabase > Authentication > URL Configuration
2. Update Site URL to your custom domain
3. Update Redirect URLs to include custom domain

## Monitoring & Maintenance

### Monitor Edge Function Logs

```bash
# Using Supabase CLI
supabase functions logs scrape-events --project-ref your-project-ref
```

Or in Supabase dashboard:
- Go to Edge Functions > scrape-events
- Click "Logs" tab

### Monitor Database

1. Check admin_scrape_runs table regularly
2. Review failed imports in Debug Panel
3. Monitor storage usage
4. Set up database backups

### Regular Maintenance Tasks

1. **Weekly**: Check Debug Panel for errors
2. **Monthly**: Review and clean old events
3. **Quarterly**: Update dependencies
4. **As Needed**: Add new categories/cities

## Scaling Considerations

### When You Grow

1. **Enable Database Connection Pooling**
   - Supabase > Database > Connection Pooling

2. **Optimize Queries**
   - Add indexes for common searches
   - Use database functions for complex queries

3. **Consider CDN**
   - Use Vercel's Edge Network
   - Cache event images

4. **Rate Limiting**
   - Implement on Edge Functions
   - Use Supabase Row Level Security

5. **Caching**
   - Enable Next.js ISR for event pages
   - Cache event lists with revalidation

## Troubleshooting Production Issues

### Edge Function Fails

1. Check function logs in Supabase dashboard
2. Verify JWT configuration matches
3. Test with Auth Diagnostics panel
4. Ensure environment variables are set

### Auth Not Working

1. Check redirect URLs in Supabase
2. Verify site URL matches deployment
3. Check email delivery (Supabase limits on free tier)
4. Review auth logs in Supabase

### Events Not Showing

1. Check RLS policies in SQL Editor
2. Verify data exists in events table
3. Check browser console for errors
4. Review Next.js build logs

### Slow Performance

1. Enable database indexes
2. Implement caching
3. Optimize images (use Next.js Image)
4. Enable Vercel Analytics for insights

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Admin role properly configured
- [ ] Edge Function validates JWT
- [ ] CORS headers configured
- [ ] Environment variables secure (not in code)
- [ ] Database backups enabled
- [ ] Strong database password
- [ ] Email verification enabled
- [ ] Rate limiting considered
- [ ] SQL injection prevention (parameterized queries)

## Backup Strategy

### Automatic Backups (Supabase Pro+)

Supabase Pro and higher plans include automatic backups.

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Restore
supabase db reset
psql -h your-db-host -U postgres -d postgres -f backup.sql
```

### Data Export

Regular exports of critical data:
1. Events table
2. User roles table
3. Scrape runs (for audit trail)

## Post-Deployment

### Marketing Your Platform

1. Submit to event directories
2. Share on Nepal-focused social media
3. Partner with event organizers
4. Create social media accounts
5. Enable event sharing features

### Analytics (Optional)

Add Vercel Analytics or Google Analytics:

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Monitoring (Optional)

Consider adding:
- Error tracking (Sentry)
- Uptime monitoring (UptimeRobot)
- Performance monitoring (Vercel Analytics)

## Support & Updates

### Staying Updated

1. Watch Supabase changelog
2. Update Next.js regularly
3. Monitor security advisories
4. Update dependencies monthly

### Getting Help

- Supabase Discord: https://discord.supabase.com
- Vercel Discord: https://discord.gg/vercel
- Next.js Discussions: https://github.com/vercel/next.js/discussions

---

Congratulations! Your What's On Nepal platform is now live! 🎉
