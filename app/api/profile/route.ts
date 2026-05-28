import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/supabase-server";

function sanitize(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"'&]/g, "").trim().slice(0, 500);
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", data.id)
    .order("sort_order");

  const { data: socials } = await supabase
    .from("socials")
    .select("*")
    .eq("profile_id", data.id)
    .order("sort_order");

  return NextResponse.json({ ...data, links: links || [], socials: socials || [] });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Only pick known profile fields — don't spread the entire body
  const updates: Record<string, string> = {};
  if (body.name !== undefined) updates.name = sanitize(body.name);
  if (body.subtitle !== undefined) updates.subtitle = sanitize(body.subtitle);
  if (body.image_url !== undefined) updates.image_url = sanitize(body.image_url);
  if (body.selected_variant !== undefined) {
    const v = sanitize(body.selected_variant);
    updates.selected_variant = ["cloud", "athletic"].includes(v) ? v : "cloud";
  }

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Profile update error:", JSON.stringify(error));
    return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });
  }
  return NextResponse.json(data);
}
