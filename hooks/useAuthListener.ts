// hooks/useAuthListener.ts
import { supabase } from '@/utils/supabase';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export const useAuthListener = () => {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, 'Session:', !!session);

        // Check if we're in a protected route
        const inProtectedRoute = segments[0] === '(tabs)';
        
        if (event === 'SIGNED_IN' && session) {
          // User signed in, redirect to main app if not already there
          if (!inProtectedRoute) {
            router.replace('/(tabs)');
          }
        } else if (event === 'SIGNED_OUT' || !session) {
          // User signed out or no session, redirect to auth if in protected route
          if (inProtectedRoute) {
            router.replace('/auth');
          }
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      const inProtectedRoute = segments[0] === '(tabs)';
      
      if (session && !inProtectedRoute) {
        router.replace('/(tabs)');
      } else if (!session && inProtectedRoute) {
        router.replace('/auth');
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [segments, router]);
};