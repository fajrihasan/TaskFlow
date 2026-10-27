import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  throw new Error("Supabase publishable key belum diatur");
}

if (!supabaseUrl) {
  throw new Error("Supabase URL belum diatur");
}

export const supabase = createClient(supabaseUrl, supabaseKey);