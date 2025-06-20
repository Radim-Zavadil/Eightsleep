import { supabase } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle navigation based on auth state
        const inProtectedRoute = segments[0] === '(tabs)';
        const inAuthRoute = segments[0] === 'auth';
        const inOnboardingRoute = segments[0] === 'onboarding';
        const inWelcomeRoute = segments[0] === 'welcome';
        
        if (event === 'SIGNED_IN' && session) {
          // User signed in, redirect to main app if not already there
          if (!inProtectedRoute && !inOnboardingRoute) {
            router.replace('/(tabs)');
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          // User signed out or no session, redirect to welcome if in protected route
          if (inProtectedRoute) {
            router.replace('/welcome');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [segments, router]);

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Sign out error:', error);
        throw error;
      }
      console.log('AuthContext: Sign out successful');
      // Navigation will be handled by the auth state change listener
    } catch (error) {
      console.error('AuthContext: Sign out failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};