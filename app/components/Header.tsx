'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (!error && data) {
          setIsAdmin(true);
        }
      }

      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error } = await supabase.rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });

          if (!error && data) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-nepal-blue">
            What's On Nepal
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/discover" className="hover:text-nepal-blue transition-colors">
              Discover
            </Link>

            {user && (
              <Link href="/saved-events" className="hover:text-nepal-blue transition-colors">
                Saved Events
              </Link>
            )}

            {isAdmin && (
              <Link href="/admin" className="hover:text-nepal-blue transition-colors">
                Admin
              </Link>
            )}

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <button onClick={handleSignOut} className="btn btn-secondary text-sm">
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login" className="btn btn-primary text-sm">
                    Sign In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
