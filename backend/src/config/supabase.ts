import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials missing in environment variables');
}

// Server-side client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Helper to create user-specific client
export const getUserSupabaseClient = (accessToken: string) => {
    return createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY || '', {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    });
};

console.log('✅ Supabase client initialized');
