import { getSupabase } from "./supabase";
import type { ProfileData } from "./types";

export async function getProfile(): Promise<ProfileData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  // First check if profiles table exists
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (profileError || !profile) return null;

  // Fetch links separately (handles missing table gracefully)
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("sort_order");

  // Fetch socials separately
  const { data: socials } = await supabase
    .from("socials")
    .select("*")
    .eq("profile_id", profile.id)
    .order("sort_order");

  return {
    ...profile,
    links: links || [],
    socials: socials || [],
  };
}
