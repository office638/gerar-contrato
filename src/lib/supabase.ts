import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação: evita erro silencioso se esquecer de setar variáveis
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('⛔ Supabase URL ou Anon Key não definidos em .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
