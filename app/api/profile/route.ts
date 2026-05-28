import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/supabase-server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function sanitize(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"'&]/g, "").trim().slice(0, 500);
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const supabase = createClient(url, key);

  try {
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
  } catch (e) {
    console.error("Profile GET error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (auth.error || !auth.supabase) {
      return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { id } = body;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const updates: Record<string, string | null> = {};
    if (body.name !== undefined) updates.name = sanitize(body.name);
    if (body.subtitle !== undefined) updates.subtitle = sanitize(body.subtitle);
    if (body.image_url !== undefined) updates.image_url = body.image_url ? sanitize(body.image_url) : null;
    if (body.selected_variant !== undefined) {
      const v = sanitize(body.selected_variant);
      updates.selected_variant = ["cloud", "athletic"].includes(v) ? v : "cloud";
    }

    const { data, error } = await auth.supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", JSON.stringify(error));
      return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });
    }

    revalidatePath("/");
    return NextResponse.json(data);
  } catch (e) {
    console.error("Profile PUT crash:", e);
    return NextResponse.json({ error: `Server error: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}
