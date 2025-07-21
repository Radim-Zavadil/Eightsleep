import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.');
}

if (!supabaseServiceKey) {
  console.warn('Service role key not found. Admin operations will not work. Please add EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY to your .env file.');
}

// Create a custom storage implementation that works in both web and native
const customStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      // Check if localStorage is available (for web environments)
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      // Check if localStorage is available (for web environments)
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
        return;
      }
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      // Check if localStorage is available (for web environments)
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        return;
      }
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Create a service role client for admin operations
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to check if admin client is properly configured
export const isAdminClientConfigured = () => {
  return !!supabaseServiceKey && supabaseServiceKey !== supabaseAnonKey;
};