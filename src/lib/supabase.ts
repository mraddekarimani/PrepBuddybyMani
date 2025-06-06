import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
}

// For demo purposes, create a mock client if env vars are missing
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: () => Promise.resolve({ error: new Error('Demo mode - Supabase not configured') }),
    signInWithPassword: () => Promise.resolve({ error: new Error('Demo mode - Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    resend: () => Promise.resolve({ error: new Error('Demo mode - Supabase not configured') })
  },
  from: () => ({
    select: () => ({ 
      eq: () => ({ 
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => Promise.resolve({ data: [], error: null })
    }),
    insert: () => ({ 
      select: () => ({ 
        single: () => Promise.resolve({ data: null, error: new Error('Demo mode') })
      })
    }),
    update: () => ({ 
      eq: () => Promise.resolve({ error: new Error('Demo mode') })
    }),
    delete: () => ({ 
      eq: () => Promise.resolve({ error: new Error('Demo mode') })
    }),
    upsert: () => Promise.resolve({ error: new Error('Demo mode') })
  })
});

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockClient();