import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Export the regular client for non-auth operations
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Create an authenticated client with custom headers
export const createAuthenticatedClient = (userId: string) => {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    },
  });
};