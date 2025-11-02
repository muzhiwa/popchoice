import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

/** OpenAI config */
if (!process.env.REACT_APP_OPENAI_API_KEY) {
  throw new Error("Missing REACT_APP_OPENAI_API_KEY in .env");
}

export const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/** Supabase config */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables missing");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
