import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isOnboardingCompleted: boolean;
  setIsOnboardingCompleted: (completed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkOnboardingStatus(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkOnboardingStatus(session.user.id);
        } else {
          setIsOnboardingCompleted(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboardingStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return;
      }

      setIsOnboardingCompleted(data?.onboarding_completed || false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (!error && data?.user) {
      // Create a profile row for the new user
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: email,
          onboarding_completed: false,
        },
      ]);
      if (profileError) {
        console.error('Error creating profile row:', profileError);
      }
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setIsOnboardingCompleted(false);
    await supabase.auth.signOut();
    await AsyncStorage.clear();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isOnboardingCompleted,
    setIsOnboardingCompleted,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 