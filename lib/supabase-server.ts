import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

export async function requireAuth(
  req: NextRequest
): Promise<{ error: string | null; supabase: SupabaseClient | null; user: User | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return { error: "Supabase not configured", supabase: null, user: null };
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Missing or invalid authorization header", supabase: null, user: null };
  }

  const token = authHeader.slice(7);
  if (!token || token.length < 10) {
    return { error: "Invalid token", supabase: null, user: null };
  }

  // Create a client scoped to this request's token
  const supabase = createClient(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: "Not authenticated", supabase: null, user: null };
  }

  return { error: null, supabase, user };
}
