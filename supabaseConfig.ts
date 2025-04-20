import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';
import { Database } from './types/supabase';

// For secure store implementation
const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Supabase initialization with Expo secure storage
// Using Environment Variables from app.config.js
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseKey || 'YOUR_SUPABASE_ANON_KEY';

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl, 
  supabaseAnonKey, 
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export default supabase;