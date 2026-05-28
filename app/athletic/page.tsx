import Image from "next/image";
import { Music, Youtube, Twitter, Instagram, Laptop, Mic2, Play } from "lucide-react";
import { getProfile } from "@/lib/data";
import ScallopedButton from "@/components/athletic/ScallopedButton";
import ScallopedDivider from "@/components/athletic/ScallopedDivider";
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
  name: "DENA PRESLEY",
  subtitle: "Long Distance Runner",
  image_url: "https://picsum.photos/id/1005/240/240",
  updated_at: "",
  links: [
    { id: "l1", profile_id: "1", label: "Latest Video", url: "#", icon: "youtube", thumbnail_url: null, sort_order: 1, is_active: true },
    { id: "l2", profile_id: "1", label: "My Website", url: "#", icon: "laptop", thumbnail_url: null, sort_order: 2, is_active: true },
    { id: "l3", profile_id: "1", label: "Tome Interview", url: "#", icon: "mic", thumbnail_url: null, sort_order: 3, is_active: true },
    { id: "l4", profile_id: "1", label: "Nice That", url: "#", icon: "play", thumbnail_url: null, sort_order: 4, is_active: true },
  ],
  socials: [
    { id: "s1", profile_id: "1", platform: "tiktok", url: "#", sort_order: 1 },
    { id: "s2", profile_id: "1", platform: "youtube", url: "#", sort_order: 2 },
    { id: "s3", profile_id: "1", platform: "twitter", url: "#", sort_order: 3 },
    { id: "s4", profile_id: "1", platform: "instagram", url: "#", sort_order: 4 },
  ],
};

const LINK_ICONS: Record<string, React.ReactNode> = {
  youtube: <Youtube className="w-6 h-6 text-red-600" />,
  laptop: <Laptop className="w-6 h-6 text-blue-600" />,
  mic: <Mic2 className="w-6 h-6 text-indigo-600" />,
  play: <Play className="w-6 h-6 text-green-600" />,
};

export default async function AthleticPage() {
  const profile = (await getProfile()) || FALLBACK;

  const mainLinks = profile.links.slice(0, 2);
  const mediaLinks = profile.links.slice(2);

  return (
    <div className="relative h-dvh w-full overflow-hidden flex flex-col items-center font-sans">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/id/1015/1200/1800"
          alt="Athletic Nature Path"
          fill
          className="object-cover scale-110"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <main className="relative z-10 w-full max-w-[26rem] h-full flex flex-col items-center justify-between px-6 py-8 md:py-10">
        {/* Header */}
        <section className="flex flex-col items-center text-center space-y-3 shrink-0">
          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] border-white shadow-2xl">
              <Image
                src={profile.image_url}
                alt={profile.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>

          <div className="animate-fade-in-up text-white space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight drop-shadow-lg">
              {profile.name}
            </h1>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <p className="text-[10px] font-black opacity-80 tracking-[0.2em] uppercase">
                {profile.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="w-full flex-1 flex flex-col justify-center gap-2.5 my-2 overflow-y-auto no-scrollbar">
          {mainLinks.map((link, i) => (
            <ScallopedButton
              key={link.id}
              link={link}
              delay={`${0.1 + i * 0.1}s`}
              icon={link.icon ? LINK_ICONS[link.icon] : undefined}
            />
          ))}

          <ScallopedDivider label="Media" delay="0.3s" />

          {mediaLinks.map((link, i) => (
            <ScallopedButton
              key={link.id}
              link={link}
              delay={`${0.4 + i * 0.1}s`}
              icon={link.icon ? LINK_ICONS[link.icon] : undefined}
            />
          ))}
        </section>

        {/* Footer */}
        <footer className="w-full flex flex-col items-center gap-5 shrink-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center justify-between w-full px-4 text-white">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform] || Instagram;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="hover:scale-125 hover:text-blue-400 transition-all duration-300 drop-shadow-2xl"
                >
                  <Icon className="w-8 h-8" strokeWidth={1.5} />
                </a>
              );
            })}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-white/30 tracking-[0.5em] uppercase font-black">
              &copy; 2026
            </p>
            <div className="w-10 h-0.5 bg-blue-500/50 rounded-full" />
          </div>
        </footer>
      </main>
    </div>
  );
}
