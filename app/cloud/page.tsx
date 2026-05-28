import Image from "next/image";
import { Music, Youtube, Twitter, Instagram } from "lucide-react";
import { getProfile } from "@/lib/data";
import CloudSvg from "@/components/cloud/CloudSvg";
import CloudButton from "@/components/cloud/CloudButton";
import type { ProfileData } from "@/lib/types";

const SOCIAL_ICONS: Record<string, React.ComponentType<Record<string, unknown>>> = {
  tiktok: Music,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
};

const FALLBACK: ProfileData = {
  id: "1",
  name: "Marjan van Aubel",
  subtitle: "Portfolio reviews, interview tips, and career advice",
  image_url: "https://picsum.photos/id/1027/240/240",
  updated_at: "",
  links: [
    { id: "l1", profile_id: "1", label: "Check out my latest video", url: "#", icon: null, thumbnail_url: "https://picsum.photos/id/119/88/88", sort_order: 1, is_active: true },
    { id: "l2", profile_id: "1", label: "Website", url: "#", icon: null, thumbnail_url: "https://picsum.photos/id/180/88/88", sort_order: 2, is_active: true },
    { id: "l3", profile_id: "1", label: "Tome interview", url: "#", icon: null, thumbnail_url: null, sort_order: 3, is_active: true },
    { id: "l4", profile_id: "1", label: "Its Nice that interview", url: "#", icon: null, thumbnail_url: null, sort_order: 4, is_active: true },
  ],
  socials: [
    { id: "s1", profile_id: "1", platform: "tiktok", url: "#", sort_order: 1 },
    { id: "s2", profile_id: "1", platform: "youtube", url: "#", sort_order: 2 },
    { id: "s3", profile_id: "1", platform: "twitter", url: "#", sort_order: 3 },
    { id: "s4", profile_id: "1", platform: "instagram", url: "#", sort_order: 4 },
  ],
};

export default async function CloudPage() {
  const profile = (await getProfile()) || FALLBACK;

  const mainLinks = profile.links.slice(0, 2);
  const mediaLinks = profile.links.slice(2);

  return (
    <div className="relative min-h-dvh bg-white overflow-hidden selection:bg-indigo-600/15 selection:text-indigo-600">
      <CloudSvg />

      <main className="relative z-10 flex flex-col items-center min-h-dvh px-5 sm:px-8 pt-12 sm:pt-16 pb-6">
        {/* Profile */}
        <div className="relative animate-scale-in opacity-0 stagger-1">
          <div className="absolute -inset-3 rounded-full border border-indigo-600/10 animate-pulse-ring" />
          <div className="absolute -inset-2.5 rounded-full bg-indigo-600/[0.07] blur-md" />
          <div className="absolute -inset-1 rounded-full border border-indigo-600/15" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-[2.5px] border-indigo-600 shadow-soft-md">
            <Image
              src={profile.image_url}
              alt={profile.name}
              width={112}
              height={112}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-display-md sm:text-display-lg text-indigo-600 mt-5 sm:mt-6 text-balance text-center animate-fade-in-up opacity-0 stagger-2">
          {profile.name}
        </h1>

        {/* Subtitle */}
        <p className="text-display-sm text-indigo-500/65 max-w-[260px] sm:max-w-[280px] mt-2.5 sm:mt-3 text-center text-balance animate-fade-in-up opacity-0 stagger-3">
          {profile.subtitle}
        </p>

        {/* Links */}
        <div className="flex flex-col items-center w-full max-w-sm mt-10 sm:mt-12 gap-2.5 sm:gap-3">
          {mainLinks.map((link) => (
            <CloudButton key={link.id} link={link} />
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 w-full py-1.5 sm:py-2 mt-0.5 animate-fade-in opacity-0 stagger-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-600/15 to-transparent" />
            <span className="text-caption text-indigo-600/50 uppercase tracking-[0.14em]">
              Media
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-600/15 to-transparent" />
          </div>

          {mediaLinks.map((link) => (
            <CloudButton key={link.id} link={link} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 sm:pt-14 flex flex-col items-center gap-4 sm:gap-5 animate-fade-in-up opacity-0 stagger-8">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform] || Instagram;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-indigo-600/15 bg-white/80 backdrop-blur-sm flex items-center justify-center text-indigo-600/60 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-glow-sm hover:scale-110 active:scale-95 transition-all duration-300 ease-out"
                >
                  <Icon className="w-[1rem] h-[1rem] sm:w-[1.125rem] sm:h-[1.125rem]" strokeWidth={1.8} />
                </a>
              );
            })}
          </div>
          <p className="text-[0.6rem] sm:text-[0.65rem] text-indigo-600/25 tracking-[0.18em] uppercase">
            &copy; 2025
          </p>
        </div>
      </main>
    </div>
  );
}
