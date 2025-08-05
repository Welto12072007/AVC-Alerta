import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL e Service Role Key são obrigatórios');
}

// Cliente Supabase com permissões de admin
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Cliente público para autenticação
export const supabaseAuth = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export default supabase;