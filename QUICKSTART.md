# Quick Start Guide

Get your What's On Nepal platform up and running in 15 minutes!

## 🚀 Fast Track Setup

### Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com and sign up
2. Click "New Project"
3. Fill in:
   - Name: `whats-on-nepal`
   - Database Password: (generate a strong one)
   - Region: `Singapore` (closest to Nepal)
4. Click "Create new project" and wait ~2 minutes

### Step 2: Run Database Migrations (3 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Open `supabase/migrations/20240101000000_initial_schema.sql`
3. Copy entire contents and paste in SQL Editor
4. Click "Run"
5. Repeat for:
   - `20240101000001_rpc_functions.sql`
   - `20240101000002_rls_policies.sql`

### Step 3: Deploy Edge Function (2 minutes)

1. In Supabase dashboard, go to **Edge Functions**
2. Click "New Function"
3. Name: `scrape-events`
4. Copy contents of `supabase/functions/scrape-events/index.ts`
5. Paste and click "Deploy"

### Step 4: Setup Environment (2 minutes)

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy your:
   - Project URL
   - Anon/Public key
3. In your project, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
4. Update `.env.local` with your values

### Step 5: Install & Run (3 minutes)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit http://localhost:3000 - you should see the home page! 🎉

### Step 6: Create Admin User (2 minutes)

1. Click "Sign In" > "Sign Up"
2. Create account with your email
3. In Supabase dashboard, go to **Authentication** > **Users**
4. Copy your user UUID (ID column)
5. Go to **SQL Editor** and run:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('YOUR_USER_UUID', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
6. Refresh your app - you should see "Admin" in header

### Step 7: Import Test Events (1 minute)

1. Click "Admin" in header
2. Go to "Import Events" tab
3. Select "AI Generated"
4. Enter `10` in count field
5. Click "Import Events"
6. Wait for success message
7. Go to "Discover" - see your 10 events!

## ✅ Verify Everything Works

Quick checklist:

- [ ] Home page loads
- [ ] Can sign in/out
- [ ] Discover page shows events
- [ ] Can click event to see details
- [ ] Can bookmark an event
- [ ] Can download .ics calendar file
- [ ] Can access /admin
- [ ] Can create event manually
- [ ] Can import AI events (count=5)
- [ ] Debug panel shows last import

If all checked - **you're done!** 🎊

## 🎯 What You Built

A complete event platform with:

✅ **Public Features**
- Event discovery with search/filters
- Event details with calendar export
- Social sharing
- Google Calendar integration

✅ **User Features**
- Sign up/login (email + magic link)
- Bookmark events
- Set reminders
- View saved events

✅ **Admin Features**
- Create events manually
- Import AI-generated events
- Scrape real events from web
- Debug panel with full error details
- Auth diagnostics

✅ **Security**
- Row Level Security on all tables
- Server-side admin validation
- JWT authentication for Edge Functions
- Proper error handling

## 📚 Next Steps

### Customize Your Platform

1. **Branding**: Update colors in `tailwind.config.ts`
2. **Content**: Add real events via admin dashboard
3. **Cities**: Edit `NEPAL_CITIES` in `lib/types.ts`
4. **Categories**: Edit `CATEGORIES` in `lib/types.ts`

### Deploy to Production

Follow `DEPLOYMENT.md` for:
- Deploying to Vercel
- Setting up custom domain
- Production Supabase project
- SSL and security

### Learn More

- `README.md` - Full documentation
- `ARCHITECTURE.md` - Technical decisions
- `ADMIN_SETUP.sql` - Admin SQL commands

## 🆘 Troubleshooting

### "No events showing"
- Check Debug Panel for import errors
- Verify RLS policies ran successfully
- Try manual event creation first

### "Admin page shows Access Denied"
- Double-check user UUID in SQL
- Sign out and back in
- Check user_roles table has entry

### "Edge Function fails"
- Check function deployed successfully
- Verify `.env.local` has correct URL
- Use Auth Diagnostics panel

### "Can't sign up"
- Check email in spam folder
- Try magic link instead
- Check Supabase auth logs

## 💡 Pro Tips

1. **Start with AI events** - Test everything before real scraping
2. **Use Debug Panel** - Check every import for errors
3. **Test auth flow early** - Admin features depend on it
4. **Keep categories simple** - Can always add more later
5. **Deploy early** - Test in production-like environment

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind**: https://tailwindcss.com/docs
- **TypeScript**: https://typescriptlang.org/docs

---

**Questions?** Check the full README.md or ARCHITECTURE.md for detailed explanations.

**Ready to deploy?** See DEPLOYMENT.md for production setup.

Happy building! 🚀
