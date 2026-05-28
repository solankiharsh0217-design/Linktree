import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/supabase-server";

function sanitize(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"'&]/g, "").trim().slice(0, 500);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { profile_id, label, url, icon, thumbnail_url, sort_order, is_active } = body;
  if (!profile_id || !label || !url) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase.from("links").insert({
    profile_id: sanitize(profile_id),
    label: sanitize(label),
    url: sanitize(url),
    icon: icon ? sanitize(icon) : null,
    thumbnail_url: thumbnail_url ? sanitize(thumbnail_url) : null,
    sort_order: typeof sort_order === "number" ? sort_order : 0,
    is_active: is_active !== false,
  }).select().single();

  if (error) return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (updates.label) updates.label = sanitize(updates.label);
  if (updates.url) updates.url = sanitize(updates.url);
  if (updates.thumbnail_url !== undefined) updates.thumbnail_url = updates.thumbnail_url ? sanitize(updates.thumbnail_url) : null;

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { data, error } = await supabase.from("links").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
