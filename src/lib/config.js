import { createClient } from "@supabase/supabase-js";

/** Supabase config */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
