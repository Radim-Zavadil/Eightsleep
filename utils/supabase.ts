import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from 'react-native';

const supabaseUrl = "https://deoiuvlytpcpegyhiafa.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlb2l1dmx5dHBjcGVneWhpYWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MjcyNzcsImV4cCI6MjA2MzAwMzI3N30.BF0Ps-MQqxv2T2BjcJZDtTg9JgIpLaZmEVm71BjkZH0";

// Add service role key for admin operations
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlb2l1dmx5dHBjcGVneWhpYWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQyNzI3NywiZXhwIjoyMDYzMDAzMjc3fQ.XwdBv9YmJSUmeOkOJwKQyIgFele5grblm9Lx1MCrHm8";

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