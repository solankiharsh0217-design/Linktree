"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, GripVertical, Save, Eye, LogOut, LogIn, Lock } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { ProfileData, Link as LinkType, Social } from "@/lib/types";
import type { Session } from "@supabase/supabase-js";

function getAuthHeaders(session: Session | null): Record<string, string> {
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

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

  // Check for existing session on mount
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

  // Fetch profile when session is available
  useEffect(() => {
    if (!session) return;

    setLoading(true);
    setMessage("");
    fetch("/api/profile", {
      headers: getAuthHeaders(session),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setProfile(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage("Failed to load profile.");
      });
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setLoginError(data.error);
        setLoginLoading(false);
      }
      // Session will be set by onAuthStateChange listener, which triggers profile fetch
      if (!data.error) setLoginLoading(false);
    } catch {
      setLoginError("Network error. Try again.");
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
    } catch {
      // Ignore logout errors
    }
    setSession(null);
    setProfile(null);
    setEmail("");
    setPassword("");
  };

  const saveProfile = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders(session) },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          subtitle: profile.subtitle,
          image_url: profile.image_url,
        }),
      });
      const data = await res.json();
      if (data.error) setMessage(data.error);
      else setMessage("Profile saved!");
    } catch {
      setMessage("Failed to save profile.");
    }
    setSaving(false);
  }, [profile, session]);

  const saveLinks = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true);
    setMessage("");
    try {
      let hasError = false;
      for (const link of profile.links) {
        const res = await fetch("/api/links", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders(session) },
          body: JSON.stringify(link),
        });
        const data = await res.json();
        if (data.error) {
          setMessage(data.error);
          hasError = true;
          break;
        }
      }
      if (!hasError) setMessage("Links saved!");
    } catch {
      setMessage("Failed to save links.");
    }
    setSaving(false);
  }, [profile, session]);

  const saveSocials = useCallback(async () => {
    if (!profile || !session) return;
    setSaving(true);
    setMessage("");
    try {
      let hasError = false;
      for (const social of profile.socials) {
        const res = await fetch("/api/socials", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders(session) },
          body: JSON.stringify(social),
        });
        const data = await res.json();
        if (data.error) {
          setMessage(data.error);
          hasError = true;
          break;
        }
      }
      if (!hasError) setMessage("Socials saved!");
    } catch {
      setMessage("Failed to save socials.");
    }
    setSaving(false);
  }, [profile, session]);

  const addLink = () => {
    if (!profile) return;
    const newLink: LinkType = {
      id: `new-${Date.now()}`,
      profile_id: profile.id,
      label: "New Link",
      url: "https://",
      icon: null,
      thumbnail_url: null,
      sort_order: profile.links.length + 1,
      is_active: true,
    };
    setProfile({ ...profile, links: [...profile.links, newLink] });
  };

  const removeLink = (id: string) => {
    if (!profile) return;
    setProfile({ ...profile, links: profile.links.filter((l) => l.id !== id) });
  };

  const updateLink = (id: string, field: keyof LinkType, value: string | number | boolean | null) => {
    if (!profile) return;
    setProfile({
      ...profile,
      links: profile.links.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    });
  };

  const addSocial = () => {
    if (!profile) return;
    const newSocial: Social = {
      id: `new-${Date.now()}`,
      profile_id: profile.id,
      platform: "instagram",
      url: "https://",
      sort_order: profile.socials.length + 1,
    };
    setProfile({ ...profile, socials: [...profile.socials, newSocial] });
  };

  const removeSocial = (id: string) => {
    if (!profile) return;
    setProfile({ ...profile, socials: profile.socials.filter((s) => s.id !== id) });
  };

  const updateSocial = (id: string, field: keyof Social, value: string | number) => {
    if (!profile) return;
    setProfile({
      ...profile,
      socials: profile.socials.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    });
  };

  // ========== CHECKING AUTH ==========
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Checking auth...</p>
      </div>
    );
  }

  // ========== LOGIN SCREEN ==========
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
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />

              {loginError && (
                <p className="text-xs text-red-500 text-center">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? "Signing in..." : <><LogIn className="w-4 h-4" /> Sign In</>}
              </button>
            </form>
          </div>
          <Link href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600 mt-4">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // ========== LOADING ==========
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  // ========== NO DATA ==========
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-gray-600 text-sm">
            Could not load profile. Make sure you ran the SQL to create tables in Supabase.
          </p>
          <div className="bg-white rounded-xl p-4 text-xs text-left text-gray-500 font-mono leading-relaxed border border-gray-200">
            <p className="text-gray-800 font-semibold mb-2">Required tables:</p>
            <p>profiles, links, socials</p>
            <p className="text-gray-400 mt-2">Run the SQL from the README in Supabase SQL Editor.</p>
          </div>
          {message && <p className="text-xs text-red-500">{message}</p>}
          <button onClick={handleLogout} className="text-indigo-600 text-sm hover:underline">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // ========== ADMIN FORM ==========
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-gray-800">Admin</h1>
        <div className="flex items-center gap-3">
          {message && <span className="text-xs text-gray-500">{message}</span>}
          <Link href="/cloud" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <Eye className="w-3 h-3" /> Cloud
          </Link>
          <Link href="/athletic" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <Eye className="w-3 h-3" /> Athletic
          </Link>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 pt-8 space-y-8">
        {/* Profile */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Profile</h2>
            <button
              onClick={saveProfile}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <input
              type="text"
              value={profile.subtitle}
              onChange={(e) => setProfile({ ...profile, subtitle: e.target.value })}
              placeholder="Subtitle"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <input
              type="url"
              value={profile.image_url}
              onChange={(e) => setProfile({ ...profile, image_url: e.target.value })}
              placeholder="Profile image URL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </section>

        {/* Links */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Links</h2>
            <div className="flex items-center gap-2">
              <button onClick={addLink} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <Plus className="w-3 h-3" /> Add
              </button>
              <button
                onClick={saveLinks}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {profile.links.map((link) => (
              <div key={link.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
                <GripVertical className="w-4 h-4 text-gray-300 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => updateLink(link.id, "label", e.target.value)}
                    placeholder="Label"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, "url", e.target.value)}
                    placeholder="URL"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-2">
                    <select
                      value={link.icon || ""}
                      onChange={(e) => updateLink(link.id, "icon", e.target.value || null)}
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="">No icon</option>
                      <option value="youtube">YouTube</option>
                      <option value="laptop">Laptop</option>
                      <option value="mic">Mic</option>
                      <option value="play">Play</option>
                    </select>
                    <label className="flex items-center gap-1 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        checked={link.is_active}
                        onChange={(e) => updateLink(link.id, "is_active", e.target.checked)}
                        className="rounded"
                      />
                      Active
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors mt-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Socials */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Socials</h2>
            <div className="flex items-center gap-2">
              <button onClick={addSocial} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
                <Plus className="w-3 h-3" /> Add
              </button>
              <button
                onClick={saveSocials}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {profile.socials.map((social) => (
              <div key={social.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <select
                  value={social.platform}
                  onChange={(e) => updateSocial(social.id, "platform", e.target.value)}
                  className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="instagram">Instagram</option>
                </select>
                <input
                  type="url"
                  value={social.url}
                  onChange={(e) => updateSocial(social.id, "url", e.target.value)}
                  placeholder="URL"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  onClick={() => removeSocial(social.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
