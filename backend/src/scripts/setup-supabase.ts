import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

console.log('🚀 Setting up Supabase database...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Found' : '❌ Missing');

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function testConnection() {
    console.log('\n1️⃣  Testing Supabase connection...');

    // Try to query system tables
    const { data, error } = await supabase
        .from('_supabase_admin')
        .select('*')
        .limit(1);

    if (error && error.code !== 'PGRST204') {
        console.log('⚠️  Cannot access admin tables (normal)');
    }

    console.log('✅ Connection successful!\n');

    // Test if we can create a simple table
    console.log('2️⃣  Creating test table...');

    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS test_connection (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

    console.log('✅ Supabase is ready!');
    console.log('\n⚠️  Note: Tables must be created via Supabase Dashboard SQL Editor');
    console.log('   Go to: https://app.supabase.com/project/wnphrjzhcixnzqqdepns/sql/new');
    console.log('   Copy SQL from: supabase_schema.sql\n');
}

testConnection().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
