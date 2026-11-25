import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();                     // load .env for Node

const supabaseUrl  = "https://meebbkyglwiuqdowfhdn.supabase.co";
const supabaseKey  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZWJia3lnbHdpdXFkb3dmaGRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzIxOTksImV4cCI6MjA2ODkwODE5OX0._ysLiTv7fM_SBySQud_y5ZjUziJTaBGa8bxIObm-eIQ";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase env vars. Check .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to extract file path from Supabase URL
export const extractFilePathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'cvdata');
    
    if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    return null;
  } catch (error) {
    console.error("Error parsing Supabase URL:", error);
    return null;
  }
};

// Helper function to delete file from Supabase storage
export const deleteFileFromSupabase = async (filePath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('cvdata')
      .remove([filePath]);
    
    if (error) {
      console.error("Error deleting file from Supabase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteFileFromSupabase:", error);
    return false;
  }
};

// Helper function to check if file exists in Supabase storage
export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('cvdata')
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });
    
    if (error) {
      console.error("Error checking file existence:", error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Error in checkFileExists:", error);
    return false;
  }
};