import { NextResponse, type NextRequest } from "next/server";
import { requireAuth } from "@/lib/supabase-server";

function sanitize(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"'&]/g, "").trim().slice(0, 500);
}

function validateUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return ["http:", "https:"].includes(u.protocol);
  } catch {
    return false;
  }
}

const VALID_PLATFORMS = ["tiktok", "youtube", "twitter", "instagram"];

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { profile_id, platform, url, sort_order } = body;

  if (!profile_id || !platform || !url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!VALID_PLATFORMS.includes(platform as string)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  if (!validateUrl(sanitize(url as string))) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const { data, error } = await auth.supabase!.from("socials").insert({
    profile_id: sanitize(profile_id),
    platform: sanitize(platform),
    url: sanitize(url),
    sort_order: typeof sort_order === "number" ? sort_order : 0,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
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

  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (updates.platform && !VALID_PLATFORMS.includes(updates.platform as string)) {
    return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
  }

  if (updates.url) {
    if (!validateUrl(sanitize(updates.url as string))) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    updates.url = sanitize(updates.url);
  }

  const { data, error } = await auth.supabase!.from("socials").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await auth.supabase!.from("socials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
