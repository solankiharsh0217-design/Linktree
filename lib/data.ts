import { getSupabase } from "./supabase";
import type { ProfileData } from "./types";

export async function getProfile(): Promise<ProfileData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      links:links(*),
      socials:socials(*)
    `)
    .eq("links.is_active", true)
    .order("sort_order", { foreignTable: "links" })
    .order("sort_order", { foreignTable: "socials" })
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}
