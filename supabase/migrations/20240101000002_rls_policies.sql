-- ============================================
-- EVENTS TABLE POLICIES
-- ============================================

-- Allow everyone to view events
CREATE POLICY "Events are publicly readable"
    ON public.events
    FOR SELECT
    USING (true);

-- Only admins can insert events
CREATE POLICY "Admins can insert events"
    ON public.events
    FOR INSERT
    WITH CHECK (public.is_admin());

-- Only admins can update events
CREATE POLICY "Admins can update events"
    ON public.events
    FOR UPDATE
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Only admins can delete events
CREATE POLICY "Admins can delete events"
    ON public.events
    FOR DELETE
    USING (public.is_admin());

-- ============================================
-- USER ROLES TABLE POLICIES
-- ============================================

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
    ON public.user_roles
    FOR SELECT
    USING (public.is_admin());

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
    ON public.user_roles
    FOR INSERT
    WITH CHECK (public.is_admin());

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
    ON public.user_roles
    FOR DELETE
    USING (public.is_admin());

-- ============================================
-- EVENT BOOKMARKS TABLE POLICIES
-- ============================================

-- Users can view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
    ON public.event_bookmarks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
    ON public.event_bookmarks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
    ON public.event_bookmarks
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- EVENT REMINDERS TABLE POLICIES
-- ============================================

-- Users can view their own reminders
CREATE POLICY "Users can view their own reminders"
    ON public.event_reminders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own reminders
CREATE POLICY "Users can insert their own reminders"
    ON public.event_reminders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own reminders
CREATE POLICY "Users can update their own reminders"
    ON public.event_reminders
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reminders
CREATE POLICY "Users can delete their own reminders"
    ON public.event_reminders
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- ADMIN SCRAPE RUNS TABLE POLICIES
-- ============================================

-- Only admins can view scrape runs
CREATE POLICY "Admins can view scrape runs"
    ON public.admin_scrape_runs
    FOR SELECT
    USING (public.is_admin());

-- Only admins can insert scrape runs
CREATE POLICY "Admins can insert scrape runs"
    ON public.admin_scrape_runs
    FOR INSERT
    WITH CHECK (public.is_admin());
