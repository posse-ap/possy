import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseAnonKey) {
  console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. Supabase client may not work properly.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
