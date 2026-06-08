import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true' && Boolean(supabaseUrl) && Boolean(supabaseAnonKey);

export const supabase = useSupabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
