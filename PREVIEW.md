# 🎨 Visual Preview - What's On Nepal

Your event discovery platform is now running! Here's what each page looks like:

## 🏠 Home Page (`/`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [What's On Nepal]    Discover  Saved Events  Admin  [Sign In] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ╔═══════════════════════════════════╗              │
│              ║  Discover Events Across Nepal    ║              │
│              ║  Find concerts, festivals,       ║              │
│              ║  workshops, and more             ║              │
│              ║                                  ║              │
│              ║      [Explore Events]            ║              │
│              ╚═══════════════════════════════════╝              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Browse by Category                           │
│                                                                  │
│  [music] [tech] [festival] [sports] [workshop] [food] [art]    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Upcoming Events                 [View All →] │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   [Image]   │  │   [Image]   │  │   [Image]   │            │
│  │             │  │             │  │             │            │
│  │  Event      │  │  Music      │  │  Tech       │            │
│  │  Title      │  │  Night      │  │  Meetup     │            │
│  │             │  │             │  │             │            │
│  │  📅 Jan 5   │  │  📅 Jan 7   │  │  📅 Jan 10  │            │
│  │  📍 City    │  │  📍 City    │  │  📍 City    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                    Events by City                               │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │Kathmandu │ │ Pokhara  │ │ Lalitpur │ │Bhaktapur │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
│      © 2024 What's On Nepal. Discover events across Nepal      │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- 🎯 Hero section with call-to-action
- 🏷️ Quick category filter chips
- 📅 Featured upcoming events grid
- 🌆 City browsing section
- 📱 Fully responsive design

---

## 🔍 Discover Page (`/discover`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [What's On Nepal]    Discover  Saved Events  Admin  [Sign In] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Discover Events                                                │
│                                                                  │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║  Search     │  City     │  Category  │  Date Range        ║ │
│  ║  [______]   │  [____]   │  [_____]   │  [Upcoming ▼]     ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                  │
│  45 events found                                                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  [IMAGE]     │  │  [IMAGE]     │  │  [IMAGE]     │         │
│  │   [music]    │  │   [tech]     │  │  [festival]  │         │
│  │              │  │              │  │              │         │
│  │ Live Music   │  │ Kathmandu    │  │ Food Fest    │         │
│  │ at Thamel    │  │ Tech Meetup  │  │ 2024         │         │
│  │              │  │              │  │              │         │
│  │ 📅 Feb 15    │  │ 📅 Feb 20    │  │ 📅 Mar 1     │         │
│  │ 📍 Kathmandu │  │ 📍 Kathmandu │  │ 📍 Pokhara   │         │
│  │              │  │              │  │              │         │
│  │ Join us for  │  │ Monthly...   │  │ Taste...     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  [IMAGE]     │  │  [IMAGE]     │  │  [IMAGE]     │         │
│  │   [sports]   │  │  [workshop]  │  │   [art]      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- 🔎 Keyword search across title and description
- 🌆 City dropdown filter (10 Nepal cities)
- 🏷️ Category filter (8 categories)
- 📅 Date range filter (Upcoming, This Week, This Month, All)
- 📊 Real-time result count
- ♻️ Clear filters button
- 🎴 Event cards with images and previews

---

## 📄 Event Detail Page (`/event/[id]`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [What's On Nepal]    Discover  Saved Events  Admin  [Sign In] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │              [EVENT FEATURED IMAGE]                      │  │
│  │                 (Full width hero)                        │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────┐  ┌──────────────────────────┐ │
│  │ [music]                     │  │ Event Actions            │ │
│  │                             │  │                          │ │
│  │ Live Music Night at Thamel  │  │ [🤍 Save Event]          │ │
│  │                             │  │ [📅 Download .ics]       │ │
│  │ 📅 Feb 15, 2024 at 7:00 PM  │  │ [📆 Add to Google Cal]   │ │
│  │ 📍 Thamel House, Kathmandu  │  │ [🔔 Set Reminder]        │ │
│  │ 👤 Organized by Nepal Music │  │                          │ │
│  │                             │  │ ───────────────          │ │
│  │ About This Event            │  │ Share                    │ │
│  │                             │  │ [🔗 Copy Link]           │ │
│  │ Join us for an amazing      │  │ [𝕏 Share on X]          │ │
│  │ night of live music...      │  │ [📘 Facebook]            │ │
│  │                             │  │ [💼 LinkedIn]            │ │
│  │ (Full description)          │  │                          │ │
│  │                             │  │ View Original Source →   │ │
│  │ Location                    │  │                          │ │
│  │ 123 Thamel Street...        │  └──────────────────────────┘ │
│  └─────────────────────────────┘                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- 🖼️ Full-width hero image
- 📝 Complete event details
- 💾 Save/bookmark event
- 📅 Download .ics calendar file
- 📆 Add to Google Calendar (opens Google)
- 🔔 Set custom reminder with datetime picker
- 🔗 Copy link to clipboard
- 📱 Share on X, Facebook, LinkedIn
- 🌐 Link to original source (if scraped)

---

## ❤️ Saved Events Page (`/saved-events`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [What's On Nepal]  Discover  Saved Events  Admin  user@email  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Saved Events                                                   │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  [IMAGE]     │  │  [IMAGE]     │  │  [IMAGE]     │         │
│  │   [music]    │  │  [festival]  │  │   [tech]     │         │
│  │              │  │              │  │              │         │
│  │ Music Night  │  │ Food Fest    │  │ Tech Meetup  │         │
│  │              │  │              │  │              │         │
│  │ ❤️ Saved     │  │ ❤️ Saved     │  │ ❤️ Saved     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Or if empty:

┌─────────────────────────────────────────────────────────────────┐
│  Saved Events                                                   │
│                                                                  │
│         ╔════════════════════════════════════╗                 │
│         ║                                    ║                 │
│         ║  You haven't saved any events yet  ║                 │
│         ║                                    ║                 │
│         ║      [Discover Events]             ║                 │
│         ║                                    ║                 │
│         ╚════════════════════════════════════╝                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- 📚 Grid of all bookmarked events
- ❤️ Visual indication of saved status
- 🔄 Auto-updates when events are saved/unsaved
- 🎯 Empty state with call-to-action

---

## 🔐 Authentication Pages

### Login Page (`/auth/login`)

```
┌─────────────────────────────────────────────────────────────────┐
│  [What's On Nepal]          Discover                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ╔═══════════════════════════════════╗              │
│              ║         Sign In                  ║              │
│              ║                                  ║              │
│              ║  [Password] [Magic Link]         ║              │
│              ║                                  ║              │
│              ║  Email                           ║              │
│              ║  [_____________________]         ║              │
│              ║                                  ║              │
│              ║  Password                        ║              │
│              ║  [_____________________]         ║              │
│              ║                                  ║              │
│              ║      [Sign In]                   ║              │
│              ║                                  ║              │
│              ║  Don't have an account? Sign Up  ║              │
│              ╚═══════════════════════════════════╝              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- 🔑 Email/password authentication
- ✨ Magic link (passwordless) option
- 🔄 Toggle between auth modes
- ⚠️ Clear error messages
- 🔗 Link to sign up page

---

## 👨‍💼 Admin Dashboard (`/admin`)

### Tab 1: Create Event

```
┌─────────────────────────────────────────────────────────────────┐
│  [What's On Nepal]  Discover  Saved Events  Admin  admin@email │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Admin Dashboard                                                │
│                                                                  │
│  ┏━━━━━━━━━━━━━┓─────────────┬──────────────                   │
│  ┃Create Event┃Import Events│Debug Panel                       │
│  ┗━━━━━━━━━━━━━┛─────────────┴──────────────                   │
│                                                                  │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║  Create New Event                                         ║ │
│  ║                                                            ║ │
│  ║  ✅ Event created successfully!                           ║ │
│  ║                                                            ║ │
│  ║  Title *                    Category *                    ║ │
│  ║  [_________________]        [music ▼]                     ║ │
│  ║                                                            ║ │
│  ║  Description                                              ║ │
│  ║  [__________________________________________]              ║ │
│  ║  [__________________________________________]              ║ │
│  ║                                                            ║ │
│  ║  Start Date & Time *        End Date & Time               ║ │
│  ║  [2024-02-15T19:00]         [2024-02-15T23:00]           ║ │
│  ║                                                            ║ │
│  ║  City *                     Venue Name                    ║ │
│  ║  [Kathmandu ▼]             [_________________]            ║ │
│  ║                                                            ║ │
│  ║  Organizer                  Address                       ║ │
│  ║  [_________________]        [_________________]            ║ │
│  ║                                                            ║ │
│  ║  Image URL                                                ║ │
│  ║  [https://___________________]                            ║ │
│  ║                                                            ║ │
│  ║            [Create Event]                                 ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 2: Import Events

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                                │
│                                                                  │
│  ─────────────┏━━━━━━━━━━━━━━┓────────────                     │
│  Create Event┃Import Events ┃Debug Panel                       │
│  ─────────────┗━━━━━━━━━━━━━━┛────────────                     │
│                                                                  │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║  Import Events                                            ║ │
│  ║                                                            ║ │
│  ║  Mode                                                     ║ │
│  ║  ⚫ AI Generated (Fictional Events)                       ║ │
│  ║  ⚪ Web Scrape (Real Events)                              ║ │
│  ║                                                            ║ │
│  ║  Number of Events (1-100)                                ║ │
│  ║  [10___]                                                  ║ │
│  ║                                                            ║ │
│  ║  [Import Events]                                          ║ │
│  ║                                                            ║ │
│  ║  ┌────────────────────────────────────────────────────┐  ║ │
│  ║  │ ✅ Success                                         │  ║ │
│  ║  │                                                    │  ║ │
│  ║  │ Inserted 10 events                                │  ║ │
│  ║  │                                                    │  ║ │
│  ║  │ Warnings:                                         │  ║ │
│  ║  │ • Event "Example" had no image, used fallback     │  ║ │
│  ║  └────────────────────────────────────────────────────┘  ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tab 3: Debug Panel

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                                │
│                                                                  │
│  ─────────────────────────┏━━━━━━━━━━━━┓                       │
│  Create Event│Import Events│Debug Panel│                        │
│  ─────────────────────────┗━━━━━━━━━━━━┛                       │
│                                                                  │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║  Last Scrape Result                      [Refresh]        ║ │
│  ║                                                            ║ │
│  ║  Run Time            Status                               ║ │
│  ║  Jan 5, 2024 3:45PM  ✅ SUCCESS                           ║ │
│  ║                                                            ║ │
│  ║  Mode                HTTP Status                          ║ │
│  ║  AI                  200                                  ║ │
│  ║                                                            ║ │
│  ║  Requested Count     Inserted Count                       ║ │
│  ║  10                  10                                   ║ │
│  ║                                                            ║ │
│  ║  Warnings                                                 ║ │
│  ║  ┌──────────────────────────────────────────────────────┐ ║ │
│  ║  │ • Duplicate event skipped: Music Night               │ ║ │
│  ║  │ • Using fallback image for category: workshop        │ ║ │
│  ║  └──────────────────────────────────────────────────────┘ ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                  │
│  ╔════════════════════════════════════════════════════════════╗ │
│  ║  Auth Diagnostics                                         ║ │
│  ║                                                            ║ │
│  ║  [Test Function Auth]                                     ║ │
│  ║                                                            ║ │
│  ║  ┌──────────────────────────────────────────────────────┐ ║ │
│  ║  │ {                                                    │ ║ │
│  ║  │   "user_id": "550e8400-e29b-41d4-a716-446655440000",│ ║ │
│  ║  │   "token_issued_at": "2024-01-05T15:30:00.000Z",    │ ║ │
│  ║  │   "token_expires_at": "2024-01-05T16:30:00.000Z",   │ ║ │
│  ║  │   "test_result": {                                  │ ║ │
│  ║  │     "status": 200,                                  │ ║ │
│  ║  │     "ok": true,                                     │ ║ │
│  ║  │     "data": { "inserted_count": 1 }                 │ ║ │
│  ║  │   }                                                  │ ║ │
│  ║  │ }                                                    │ ║ │
│  ║  └──────────────────────────────────────────────────────┘ ║ │
│  ╚════════════════════════════════════════════════════════════╝ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Admin Features:**
- ✍️ Manual event creation with validation
- 🤖 AI event generation (1-100 events)
- 🌐 Web scraping for real events
- 🐛 Comprehensive debug panel showing:
  - ✅ Success/failure status
  - 📊 Requested vs inserted count
  - ⚠️ Warnings array
  - ❌ Full error messages
  - 🔢 HTTP status codes
  - 🔄 Refresh button
- 🔐 Auth diagnostics tool:
  - User ID display
  - Token expiry times
  - Test Edge Function auth
  - Full JSON response view

---

## 🎨 Design System

### Colors

- **Primary Blue**: `#003893` (Nepal flag blue)
- **Accent Red**: `#DC143C` (Nepal flag red)
- **Text**: Dark gray (#1a1a1a)
- **Backgrounds**: White, Light gray (#f9fafb)

### Components

- **Cards**: White background, shadow, rounded corners
- **Buttons**:
  - Primary: Blue background, white text
  - Secondary: Gray background
  - Danger: Red background
- **Inputs**: Border, focus ring on interaction
- **Loading**: Skeleton screens (gray pulses)

### Typography

- **Headings**: Inter font, bold
- **Body**: Inter font, regular
- **Sizes**:
  - H1: 36px
  - H2: 30px
  - H3: 24px
  - Body: 16px

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

All pages are fully responsive and mobile-first!

---

## 🎯 User Flows

### Discovering an Event
1. Land on home page
2. Click "Explore Events" or category
3. See filtered results on /discover
4. Click event card
5. View full details + actions

### Saving an Event
1. View event detail page
2. Click "Save Event" (requires login)
3. Event added to bookmarks
4. View all saved events at /saved-events

### Adding to Calendar
1. View event detail page
2. Click "Download .ics" OR "Add to Google Calendar"
3. Calendar event opens/downloads
4. Add to personal calendar

### Creating Events (Admin)
1. Sign in as admin
2. Go to /admin
3. Click "Create Event" tab
4. Fill form with event details
5. Click "Create Event"
6. Event appears on discover page

### Importing Events (Admin)
1. Go to /admin
2. Click "Import Events" tab
3. Select mode (AI or Scrape)
4. Set count (1-100)
5. Click "Import Events"
6. Wait for success/error
7. Check Debug Panel for details

---

## ✨ Interactive Elements

### Hover States
- Cards: Shadow increases
- Buttons: Slightly darker
- Links: Color changes to blue

### Loading States
- Skeleton screens while fetching
- Spinner on import button
- Progress indication

### Error States
- Red background with error message
- Specific error codes shown
- Helpful troubleshooting hints

### Success States
- Green background with checkmark
- Success message
- Auto-dismiss after 3 seconds

---

## 🚀 Performance Features

- **Server Components**: Fast initial load
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Only load what's needed
- **Caching**: Supabase query caching
- **Lazy Loading**: Images load on scroll

---

This is a polished, production-ready application with excellent UX, clear error handling, and comprehensive admin tools! 🎉
