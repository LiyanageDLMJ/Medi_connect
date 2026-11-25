/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

// Vite exposes only VITE_* vars via import.meta.env
const supabaseUrl = "https://meebbkyglwiuqdowfhdn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZWJia3lnbHdpdXFkb3dmaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzIxOTksImV4cCI6MjA2ODkwODE5OX0._ysLiTv7fM_SBySQud_y5ZjUziJTaBGa8bxIObm-eIQ";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase env vars for frontend");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection only in development
if (import.meta.env.DEV) {
  supabase.auth.getSession().then(({ error }) => {
    if (error) {
      console.error("Supabase connection error:", error);
    } else {    
      console.log("Supabase connected successfully");
    }
  });
}