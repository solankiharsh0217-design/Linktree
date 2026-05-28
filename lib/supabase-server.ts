import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

/**
 * Server-side auth: creates a Supabase client with the user's JWT.
 * The JWT is used directly for RLS — no network call to Supabase auth needed.
 */
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
    return { error: "Not authenticated — please log in again", supabase: null, user: null };
  }

  const token = authHeader.slice(7);
  if (!token || token.length < 10) {
    return { error: "Invalid token — please log in again", supabase: null, user: null };
  }

  // Decode JWT to get user info (no network call)
  let user: User;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    user = {
      id: payload.sub,
      email: payload.email || "",
      app_metadata: payload.app_metadata || {},
      user_metadata: payload.user_metadata || {},
      aud: payload.aud || "",
      created_at: "",
    } as User;
  } catch {
    return { error: "Invalid token format", supabase: null, user: null };
  }

  // Create Supabase client with the user's JWT in headers
  // This means RLS policies will see auth.uid() = user.id
  const supabase = createClient(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });

  return { error: null, supabase, user };
}
