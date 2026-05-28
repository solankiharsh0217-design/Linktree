"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Save, Eye } from "lucide-react";
import Link from "next/link";
import type { ProfileData, Link as LinkType, Social } from "@/lib/types";

export default function AdminForm() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setMessage("Failed to load profile. Make sure Supabase is configured.");
      });
  }, []);

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          subtitle: profile.subtitle,
          image_url: profile.image_url,
        }),
      });
      setMessage("Profile saved!");
    } catch {
      setMessage("Failed to save profile.");
    }
    setSaving(false);
  };

  const saveLinks = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    try {
      for (const link of profile.links) {
        await fetch("/api/links", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(link),
        });
      }
      setMessage("Links saved!");
    } catch {
      setMessage("Failed to save links.");
    }
    setSaving(false);
  };

  const saveSocials = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    try {
      for (const social of profile.socials) {
        await fetch("/api/socials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(social),
        });
      }
      setMessage("Socials saved!");
    } catch {
      setMessage("Failed to save socials.");
    }
    setSaving(false);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-gray-600 text-sm">
            Could not load profile. Set up Supabase and create the required tables.
          </p>
          <div className="bg-white rounded-xl p-4 text-xs text-left text-gray-500 font-mono leading-relaxed border border-gray-200">
            <p className="text-gray-800 font-semibold mb-2">Required tables:</p>
            <p>profiles (id, name, subtitle, image_url)</p>
            <p>links (id, profile_id, label, url, icon, thumbnail_url, sort_order, is_active)</p>
            <p>socials (id, profile_id, platform, url, sort_order)</p>
          </div>
          <Link href="/" className="text-indigo-600 text-sm hover:underline">
            Back to home
          </Link>
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
          {message && (
            <span className="text-xs text-gray-500">{message}</span>
          )}
          <Link href="/cloud" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <Eye className="w-3 h-3" /> Cloud
          </Link>
          <Link href="/athletic" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <Eye className="w-3 h-3" /> Athletic
          </Link>
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
              <button
                onClick={addLink}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
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
              <button
                onClick={addSocial}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
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
