"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, GripVertical, Save, Eye, LogOut, LogIn, Lock, Upload, X } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { DefaultLogoIcon, ICON_OPTIONS } from "@/components/shared/Logos";
import type { ProfileData, Link as LinkType, Social } from "@/lib/types";
import type { Session } from "@supabase/supabase-js";

function getAuthHeaders(session: Session | null): Record<string, string> {
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function uploadFile(file: File, session: Session): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", "images");
  formData.append("folder", "uploads");

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: getAuthHeaders(session),
    body: formData,
  });

  const data = await res.json();
  if (data.error) return null;
  return data.url;
}

// ========== IMAGE UPLOADER COMPONENT ==========
function ImageUploader({
  url,
  onUrlChange,
  label,
  session,
  size = "md",
}: {
  url: string;
  onUrlChange: (url: string) => void;
  label: string;
  session: Session;
  size?: "sm" | "md" | "lg";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const newUrl = await uploadFile(file, session);
    if (newUrl) onUrlChange(newUrl);
    setUploading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const dims = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  return (
    <div
      className={`relative group ${dims[size]} rounded-xl overflow-hidden border-2 border-dashed transition-all duration-200 cursor-pointer flex-shrink-0 ${
        dragOver
          ? "border-indigo-500 bg-indigo-50"
          : url
          ? "border-transparent"
          : "border-gray-200 hover:border-indigo-300 bg-gray-50 hover:bg-indigo-50/50"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {url ? (
        <>
          <img src={url} alt={label} className="w-full h-full object-cover" />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 text-white" />
                <span className="text-[10px] text-white font-medium">Change</span>
              </>
            )}
          </div>
          {/* Remove button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onUrlChange(""); }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          {uploading ? (
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-4 h-4 text-gray-400" />
              <span className="text-[9px] text-gray-400 font-medium">
                {size === "sm" ? "+" : "Drop"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ========== ADMIN FORM ==========
export default function AdminForm() {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthChecked(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    setMessage("");
    fetch("/api/profile", { headers: getAuthHeaders(session) })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setMessage(data.error);
        else setProfile(data);
        setLoading(false);
      })
      .catch(() => { setLoading(false); setMessage("Failed to load profile."); });
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setLoginError(error.message); setLoginLoading(false); }
    } catch {
      setLoginError("Network error. Try again.");
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await getSupabaseBrowser().auth.signOut(); } catch {}
    setSession(null); setProfile(null); setEmail(""); setPassword("");
  };

  const saveProfile = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true); setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders(session) },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          subtitle: profile.subtitle,
          image_url: profile.image_url,
          selected_variant: profile.selected_variant || "cloud",
        }),
      });
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        if (data.error) setMessage(`Error: ${data.error}`);
        else setMessage("Profile saved!");
      } catch {
        setMessage(`Error: Server returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
      }
    } catch (e) { setMessage(`Failed: ${e instanceof Error ? e.message : "unknown"}`); }
    setSaving(false);
  }, [profile, session]);

  const saveLinks = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true); setMessage("");
    try {
      let hasError = false;
      const updatedLinks = [...profile.links];
      for (let i = 0; i < profile.links.length; i++) {
        const link = profile.links[i];
        const isNew = link.id.startsWith("new-");
        
        const res = await fetch("/api/links", {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders(session) },
          body: JSON.stringify(isNew ? { ...link, id: undefined } : link),
        });
        
        const data = await res.json();
        if (data.error) {
          setMessage(`Error: ${data.error}`);
          hasError = true;
          break;
        }
        
        if (isNew) {
          updatedLinks[i] = data;
        }
      }
      
      setProfile({ ...profile, links: updatedLinks });
      if (!hasError) setMessage("Links saved!");
    } catch (e) {
      console.error("Save links error:", e);
      setMessage("Failed to save links.");
    }
    setSaving(false);
  }, [profile, session]);

  const saveSocials = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true); setMessage("");
    try {
      let hasError = false;
      const updatedSocials = [...profile.socials];
      for (let i = 0; i < profile.socials.length; i++) {
        const social = profile.socials[i];
        const isNew = social.id.startsWith("new-");
        
        const res = await fetch("/api/socials", {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders(session) },
          body: JSON.stringify(isNew ? { ...social, id: undefined } : social),
        });
        
        const data = await res.json();
        if (data.error) {
          setMessage(`Error: ${data.error}`);
          hasError = true;
          break;
        }
        
        if (isNew) {
          updatedSocials[i] = data;
        }
      }
      
      setProfile({ ...profile, socials: updatedSocials });
      if (!hasError) setMessage("Socials saved!");
    } catch (e) {
      console.error("Save socials error:", e);
      setMessage("Failed to save socials.");
    }
    setSaving(false);
  }, [profile, session]);

  const addLink = () => {
    if (!profile) return;
    setProfile({ ...profile, links: [...profile.links, {
      id: `new-${Date.now()}`, profile_id: profile.id, label: "New Link", url: "https://",
      icon: null, thumbnail_url: null, sort_order: profile.links.length + 1, is_active: true,
    }]});
  };

  const removeLink = async (id: string) => {
    if (!profile || !session) return;
    
    // If it's a new link, just remove from state
    if (id.startsWith("new-")) {
      setProfile({ ...profile, links: profile.links.filter((l) => l.id !== id) });
      return;
    }

    // Existing link: immediate delete with optimistic UI
    const previousProfile = { ...profile };
    setProfile({ ...profile, links: profile.links.filter((l) => l.id !== id) });
    setMessage("Deleting link...");

    try {
      const res = await fetch(`/api/links?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(session),
      });
      const data = await res.json();
      if (data.error) {
        setProfile(previousProfile);
        setMessage(`Error deleting: ${data.error}`);
      } else {
        setMessage("Link deleted.");
      }
    } catch (e) {
      console.error("Delete link error:", e);
      setProfile(previousProfile);
      setMessage("Failed to delete link.");
    }
  };

  const updateLink = (id: string, field: keyof LinkType, value: string | number | boolean | null) => {
    if (!profile) return;
    setProfile({ ...profile, links: profile.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)) });
  };

  const addSocial = () => {
    if (!profile) return;
    setProfile({ ...profile, socials: [...profile.socials, {
      id: `new-${Date.now()}`, profile_id: profile.id, platform: "instagram",
      url: "https://", sort_order: profile.socials.length + 1,
    }]});
  };

  const removeSocial = async (id: string) => {
    if (!profile || !session) return;
    
    // If it's a new social, just remove from state
    if (id.startsWith("new-")) {
      setProfile({ ...profile, socials: profile.socials.filter((s) => s.id !== id) });
      return;
    }

    // Existing social: immediate delete with optimistic UI
    const previousProfile = { ...profile };
    setProfile({ ...profile, socials: profile.socials.filter((s) => s.id !== id) });
    setMessage("Deleting social...");

    try {
      const res = await fetch(`/api/socials?id=${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(session),
      });
      const data = await res.json();
      if (data.error) {
        setProfile(previousProfile);
        setMessage(`Error deleting: ${data.error}`);
      } else {
        setMessage("Social deleted.");
      }
    } catch (e) {
      console.error("Delete social error:", e);
      setProfile(previousProfile);
      setMessage("Failed to delete social.");
    }
  };

  const updateSocial = (id: string, field: keyof Social, value: string | number) => {
    if (!profile) return;
    setProfile({ ...profile, socials: profile.socials.map((s) => (s.id === id ? { ...s, [field]: value } : s)) });
  };

  if (!authChecked) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Checking auth...</p></div>;

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mx-auto mb-4">
              <Lock className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-lg font-semibold text-gray-800 text-center mb-1">Admin Login</h1>
            <p className="text-xs text-gray-400 text-center mb-6">Sign in to manage your linktree</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
              <button type="submit" disabled={loginLoading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loginLoading ? "Signing in..." : <><LogIn className="w-4 h-4" /> Sign In</>}
              </button>
            </form>
          </div>
          <Link href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-4">Back to home</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400 text-sm">Loading profile...</p></div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-gray-600 text-sm">Could not load profile. Run the SQL to create tables in Supabase.</p>
          {message && <p className="text-xs text-red-500">{message}</p>}
          <button onClick={handleLogout} className="text-indigo-600 text-sm hover:underline">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-gray-800">Admin</h1>
        <div className="flex items-center gap-3">
          {message && <span className={`text-xs ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>{message}</span>}
          <Link href="/cloud" className="text-xs text-indigo-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Cloud</Link>
          <Link href="/athletic" className="text-xs text-indigo-600 hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Athletic</Link>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><LogOut className="w-3 h-3" /> Logout</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 pt-8 space-y-6">

        {/* ===== PROFILE SECTION ===== */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Profile</h2>
            <button onClick={saveProfile} disabled={saving} className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />} Save
            </button>
          </div>

          <div className="p-5">
            <div className="flex gap-5">
              <ImageUploader
                url={profile.image_url}
                onUrlChange={(url) => setProfile({ ...profile, image_url: url })}
                label="Profile photo"
                session={session}
                size="lg"
              />
              <div className="flex-1 space-y-3">
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Display name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                <input type="text" value={profile.subtitle} onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })} placeholder="Subtitle / tagline" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== VARIANT SELECTOR ===== */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Active Variant</h2>
            <button onClick={saveProfile} disabled={saving} className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />} Save
            </button>
          </div>
          <div className="p-5">
            <p className="text-xs text-gray-400 mb-3">Choose which variant visitors see at your site root.</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProfile({ ...profile, selected_variant: "cloud" })}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  profile.selected_variant === "cloud"
                    ? "border-indigo-600 bg-indigo-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {profile.selected_variant === "cloud" && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                <div className="font-semibold text-sm text-gray-800">Cloud Outline</div>
                <div className="text-[11px] text-gray-400 mt-1">Clean white with indigo accents</div>
              </button>

              <button
                onClick={() => setProfile({ ...profile, selected_variant: "athletic" })}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  profile.selected_variant === "athletic"
                    ? "border-indigo-600 bg-indigo-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {profile.selected_variant === "athletic" && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                <div className="font-semibold text-sm text-gray-800">Athletic Dark</div>
                <div className="text-[11px] text-gray-400 mt-1">Full-screen background with bold typography</div>
              </button>
            </div>
          </div>
        </section>

        {/* ===== LINKS SECTION ===== */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Links</h2>
            <div className="flex items-center gap-2">
              <button onClick={addLink} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"><Plus className="w-3 h-3" /> Add</button>
              <button onClick={saveLinks} disabled={saving} className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />} Save
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {profile.links.map((link) => (
              <div key={link.id} className="p-4 hover:bg-gray-50/50 transition-colors space-y-3">
                {/* Top row: drag, preview, label, url, delete */}
                <div className="flex gap-3">
                  <GripVertical className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0 cursor-grab" />

                  {/* Preview: shows uploaded image OR default logo */}
                  <div className="flex-shrink-0">
                    {link.thumbnail_url ? (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                        <img src={link.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : link.icon ? (
                      <DefaultLogoIcon icon={link.icon} size="sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">?</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 min-w-0">
                    <input type="text" value={link.label} onChange={(e) => updateLink(link.id, "label", e.target.value)} placeholder="Button text" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    <input type="url" value={link.url} onChange={(e) => updateLink(link.id, "url", e.target.value)} placeholder="https://..." className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>

                  <button onClick={() => removeLink(link.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom row: image source choice */}
                <div className="flex items-center gap-3 pl-7">
                  {/* Custom image upload */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium w-12">Image</span>
                    <ImageUploader
                      url={link.thumbnail_url || ""}
                      onUrlChange={(url) => updateLink(link.id, "thumbnail_url", url || null)}
                      label={`${link.label} image`}
                      session={session}
                      size="sm"
                    />
                  </div>

                  <div className="w-px h-6 bg-gray-200" />

                  {/* Default logo picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium w-12">Logo</span>
                    <select
                      value={link.icon || ""}
                      onChange={(e) => {
                        const val = e.target.value || null;
                        updateLink(link.id, "icon", val);
                        // If picking a logo, clear uploaded image (optional — user can keep both)
                      }}
                      className="border border-gray-200 rounded-md px-2 py-1 text-[11px] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto">
                    <input type="checkbox" checked={link.is_active} onChange={(e) => updateLink(link.id, "is_active", e.target.checked)} className="rounded border-gray-300" />
                    Active
                  </label>
                </div>
              </div>
            ))}
          </div>

          {profile.links.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-xs">No links yet. Click + Add to create one.</p>
            </div>
          )}
        </section>

        {/* ===== SOCIALS SECTION ===== */}
        <section className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">Socials</h2>
            <div className="flex items-center gap-2">
              <button onClick={addSocial} className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 transition-colors"><Plus className="w-3 h-3" /> Add</button>
              <button onClick={saveSocials} disabled={saving} className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {saving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-3 h-3" />} Save
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {profile.socials.map((social) => (
              <div key={social.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <select value={social.platform} onChange={(e) => updateSocial(social.id, "platform", e.target.value)} className="border border-gray-200 rounded-md px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="instagram">Instagram</option>
                  </select>
                  <input type="url" value={social.url} onChange={(e) => updateSocial(social.id, "url", e.target.value)} placeholder="https://..." className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <button onClick={() => removeSocial(social.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {profile.socials.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-400 text-xs">No socials yet. Click + Add to create one.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
