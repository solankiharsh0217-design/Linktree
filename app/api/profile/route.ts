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
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id, name, subtitle, image_url } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing profile id" }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (name !== undefined) updates.name = sanitize(name);
  if (subtitle !== undefined) updates.subtitle = sanitize(subtitle);
  if (image_url !== undefined) updates.image_url = sanitize(image_url);
  updates.updated_at = new Date().toISOString();

  const { data, error } = await auth.supabase!
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
