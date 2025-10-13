import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In test environment, don't initialize if env vars aren't set
if (process.env.NODE_ENV === 'test' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Supabase credentials not found in test environment');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: fetch.bind(globalThis),
    headers: { 'x-client-info': 'medimmosecret' }
  },
  db: {
    schema: 'public'
  },
  // Add retries for better reliability
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add error handling wrapper
export async function supabaseRequest<T>(
  request: Promise<{ data: T; error: any }>
): Promise<T> {
  try {
    const { data, error } = await request;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase request failed:', error);
    throw error;
  }
}