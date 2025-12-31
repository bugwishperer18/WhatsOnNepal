# Architecture & Design Decisions

This document explains the technical architecture and key design decisions made in building What's On Nepal.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js 14 (App Router)                    │  │
│  │                                                       │  │
│  │  • Server Components (Default)                       │  │
│  │  • Client Components (Interactive)                   │  │
│  │  • Middleware (Session Refresh)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Backend                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │     Auth     │  │    Edge      │     │
│  │              │  │              │  │  Functions   │     │
│  │  • Tables    │  │  • Email/PW  │  │              │     │
│  │  • RLS       │  │  • Magic Link│  │  • Scraper   │     │
│  │  • RPC       │  │  • JWT       │  │  • Import    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Next.js App Router vs Pages Router

**Decision**: Use App Router (Next.js 14)

**Rationale**:
- Server Components reduce client-side JavaScript
- Better streaming and loading states
- Improved routing with nested layouts
- Future-proof architecture

**Trade-offs**:
- Steeper learning curve
- Some libraries not fully compatible yet
- Must explicitly mark client components

### 2. Row Level Security (RLS) vs API Routes

**Decision**: Use RLS with Supabase

**Rationale**:
- Security enforced at database level
- Cannot be bypassed by misconfigured client
- Reduces need for custom API routes
- Automatic filtering of queries

**Implementation**:
```sql
-- Example: Users can only see their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON public.event_bookmarks
FOR SELECT
USING (auth.uid() = user_id);
```

### 3. Admin Role Validation: Client vs Server

**Decision**: Server-side validation using RPC functions

**Rationale**:
- Client-side checks can be bypassed
- RPC functions use SECURITY DEFINER to bypass RLS
- Single source of truth for role checks
- Works reliably across different contexts

**Implementation**:
```typescript
// Client calls RPC function
const { data: isAdmin } = await supabase.rpc('has_role', {
  _user_id: user.id,
  _role: 'admin'
});

// Server function checks database directly
CREATE FUNCTION has_role(_user_id uuid, _role text)
RETURNS boolean
SECURITY DEFINER
```

**Why not direct user_roles query?**
- RLS would block the query
- Less consistent across server/client
- Harder to audit and maintain

### 4. Edge Functions vs Server Actions

**Decision**: Supabase Edge Functions for scraping

**Rationale**:
- Long-running operations (web scraping)
- Isolated environment for external requests
- Separate from Next.js server
- Better error handling and logging
- Can be called from anywhere (not just Next.js)

**When to use each**:
- Edge Functions: External APIs, scraping, scheduled tasks
- Server Actions: Form submissions, quick DB operations

### 5. Calendar Export: Client vs Server

**Decision**: Client-side generation with ical-generator

**Rationale**:
- No server round-trip needed
- Immediate download experience
- Reduces server load
- Works offline after page load

**Implementation**:
```typescript
// Client generates and downloads
const calendar = ical({ name: 'What\'s On Nepal' });
calendar.createEvent({ ...eventData });
const blob = new Blob([calendar.toString()]);
// Trigger download
```

### 6. Image Strategy

**Decision**: External URLs with fallbacks

**Rationale**:
- No storage costs for MVP
- Faster development
- Easy to migrate later
- Use Unsplash for reliable fallbacks

**Trade-offs**:
- Depends on external services
- Less control over image quality
- Could be slow in Nepal

**Future improvement**:
- Upload to Supabase Storage
- Use Next.js Image Optimization
- Implement lazy loading

### 7. Authentication: Session vs JWT

**Decision**: Supabase Auth with JWT + Cookie sessions

**Rationale**:
- Best of both worlds
- JWT for API authentication
- HTTP-only cookies for web security
- Automatic token refresh
- Works with Edge Functions

**Flow**:
1. User signs in → Supabase returns JWT
2. JWT stored in HTTP-only cookie
3. Middleware refreshes session on each request
4. Edge Functions validate JWT
5. Token auto-refreshes before expiry

### 8. State Management

**Decision**: No global state library (Redux, Zustand)

**Rationale**:
- Server components fetch data directly
- Local state for client components
- Supabase subscriptions for real-time (future)
- Simpler, less boilerplate

**When to add state management**:
- Complex shared state across components
- Real-time features with many subscribers
- Offline support needed

### 9. Error Handling Strategy

**Decision**: Structured error responses everywhere

**Implementation**:
```typescript
// Edge Functions always return structured JSON
{
  ok: false,
  code: 'SPECIFIC_ERROR_CODE',
  message: 'Human-readable message',
  details?: 'Additional context'
}
```

**Rationale**:
- Easy to debug
- UI can show specific errors
- Logging and monitoring improved
- No generic "500 Internal Server Error"

### 10. Database Schema Design

**Decision**: Normalized schema with foreign keys

**Key choices**:
- UUID primary keys (not auto-increment)
- Soft deletes via ON DELETE CASCADE
- Timestamps on everything
- Check constraints for data integrity

**Example**:
```sql
-- Events table with constraints
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  CONSTRAINT valid_dates CHECK (end_at IS NULL OR end_at >= start_at)
);
```

## Security Architecture

### Defense in Depth

1. **Row Level Security**: Database level
2. **RPC Functions**: Server-side validation
3. **Edge Function Auth**: JWT verification
4. **Client Validation**: UX improvement only
5. **HTTPS**: Transport security

### Admin Access Flow

```
User Request
    │
    ▼
Next.js Middleware (refresh session)
    │
    ▼
Client Component (check isAdmin via RPC)
    │
    ├─ Not Admin → Show "Access Denied"
    │
    └─ Is Admin
        │
        ▼
    Admin Actions
        │
        ▼
    Edge Function (re-verify admin)
        │
        ├─ Not Admin → 403 Forbidden
        │
        └─ Is Admin → Process Request
```

### Why verify admin twice?
- Client check: Better UX (don't show admin UI)
- Server check: Security (never trust client)

## Performance Considerations

### Current Optimizations

1. **Server Components**: Reduce client JS
2. **Database Indexes**: Fast queries on common filters
3. **Next.js Image**: Automatic optimization
4. **Edge Caching**: Vercel's CDN

### Future Optimizations

1. **ISR (Incremental Static Regeneration)**: Cache event pages
2. **Database Connection Pooling**: Handle more concurrent users
3. **CDN for Images**: Serve images from edge
4. **Search Index**: PostgreSQL full-text search or Algolia

## Scalability Path

### Current Capacity (Free Tier)

- **Database**: 500 MB (thousands of events)
- **Bandwidth**: 5 GB/month
- **Edge Functions**: 500K invocations/month
- **Auth**: Unlimited users

### Scaling Strategy

1. **Vertical** (better Supabase plan)
   - More database storage
   - Better performance
   - More function invocations

2. **Horizontal** (architecture changes)
   - Read replicas for queries
   - CDN for static content
   - Separate scraping service
   - Queue for imports

3. **Optimization First**
   - Add database indexes
   - Implement caching
   - Optimize queries
   - Reduce payload sizes

## Technology Choices Rationale

### Why Next.js?

- **SSR/SSG**: Better SEO for event discovery
- **API Routes**: Flexibility for future features
- **Vercel Deployment**: Zero-config deployment
- **React Ecosystem**: Large community, many libraries

### Why Supabase?

- **PostgreSQL**: Reliable, powerful SQL database
- **Auth Built-in**: No need to build from scratch
- **RLS**: Security at database level
- **Edge Functions**: Serverless compute included
- **Free Tier**: Great for MVP

### Why TypeScript?

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Autocomplete, refactoring
- **Self-Documenting**: Types explain intent
- **Scales Better**: Easier to maintain as project grows

### Why Tailwind CSS?

- **Rapid Development**: No context switching
- **Consistent Design**: Design tokens built-in
- **Tiny Bundle**: PurgeCSS removes unused styles
- **Responsive**: Mobile-first by default

## Testing Strategy (Future)

### Recommended Approach

1. **Unit Tests**: Utility functions (calendar, format)
2. **Integration Tests**: API routes, Edge Functions
3. **E2E Tests**: Critical user flows (Playwright)
4. **Manual Testing**: Verification checklist

### Priority Order

1. Edge Function tests (most critical)
2. RPC function tests (security)
3. Calendar export tests
4. Form validation tests
5. E2E tests for happy paths

## Monitoring & Observability

### What to Monitor

1. **Edge Function Errors**: scrape-events failures
2. **Database Performance**: Slow queries
3. **Auth Failures**: Sign-in issues
4. **Client Errors**: JavaScript exceptions

### Tools

- **Supabase Dashboard**: Database, auth, function logs
- **Vercel Analytics**: Page views, performance
- **Browser Console**: Client-side errors
- **Debug Panel**: Admin import diagnostics

## Future Enhancements

### Short Term

1. Email reminders (using Supabase Functions + Cron)
2. Event recommendations (based on bookmarks)
3. User profiles (name, preferences)
4. Event organizer accounts

### Medium Term

1. Real-time updates (Supabase subscriptions)
2. Event reviews and ratings
3. Image upload (Supabase Storage)
4. Advanced search (full-text)

### Long Term

1. Mobile app (React Native)
2. Event check-ins (QR codes)
3. Ticket integration
4. Social features (following, comments)

## Lessons Learned

### What Went Well

1. RLS for security - robust and reliable
2. RPC for admin checks - consistent across contexts
3. Structured error handling - easy debugging
4. Server Components - great DX and performance

### What Could Be Improved

1. More comprehensive error types
2. Automated tests from the start
3. Better TypeScript types for Supabase responses
4. Image optimization earlier

### Avoiding Common Pitfalls

1. **Don't query user_roles directly from client** - use RPC
2. **Always return structured errors** - not just status codes
3. **Verify admin on both client and server** - defense in depth
4. **Test JWT flow early** - auth issues are hard to debug later
5. **Use correlation IDs** - makes debugging much easier

## Contributing

When adding new features:

1. Follow existing patterns
2. Update types in `lib/types.ts`
3. Add RLS policies for new tables
4. Document breaking changes
5. Test admin flow thoroughly

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
