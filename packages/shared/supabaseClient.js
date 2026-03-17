import { createClient } from "@supabase/supabase-js";

// REMPLACE par tes vraies infos trouvées dans Supabase (Settings > API)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export * from "./supabaseClient";
