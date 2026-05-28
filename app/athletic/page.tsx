import Image from "next/image";
import { Music, Youtube, Twitter, Instagram, ArrowUpRight } from "lucide-react";
import { getProfile } from "@/lib/data";
import { DefaultLogoIcon } from "@/components/shared/Logos";
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
    { id: "l1", profile_id: "1", label: "Latest Video", subtitle: "Training Secrets Revealed", url: "#", icon: "youtube", thumbnail_url: "https://picsum.photos/id/119/88/88", sort_order: 1, is_active: true },
    { id: "l2", profile_id: "1", label: "My Website", subtitle: "Personal Coaching & Blog", url: "#", icon: "laptop", thumbnail_url: "https://picsum.photos/id/180/88/88", sort_order: 2, is_active: true },
    { id: "l3", profile_id: "1", label: "Tome Interview", subtitle: "Deep Dive on Resilience", url: "#", icon: "mic", thumbnail_url: null, sort_order: 3, is_active: true },
    { id: "l4", profile_id: "1", label: "Nice That", subtitle: "Design in Athletics", url: "#", icon: "play", thumbnail_url: null, sort_order: 4, is_active: true },
  ],
  socials: [
    { id: "s1", profile_id: "1", platform: "tiktok", url: "#", sort_order: 1 },
    { id: "s2", profile_id: "1", platform: "youtube", url: "#", sort_order: 2 },
    { id: "s3", profile_id: "1", platform: "twitter", url: "#", sort_order: 3 },
    { id: "s4", profile_id: "1", platform: "instagram", url: "#", sort_order: 4 },
  ],
};

const SCALLOP_MASK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cpath d='M0 15 Q 2.5 0 5 15 T 10 15 T 15 15 T 20 15 T 25 15 T 30 15 T 35 15 T 40 15 T 45 15 T 50 15 T 55 15 T 60 15 T 65 15 T 70 15 T 75 15 T 80 15 T 85 15 T 90 15 T 95 15 T 100 15 V 85 Q 97.5 100 95 85 T 90 85 T 85 85 T 80 85 T 75 85 T 70 85 T 65 85 T 60 85 T 55 85 T 50 85 T 45 85 T 40 85 T 35 85 T 30 85 T 25 85 T 20 85 T 15 85 T 10 85 T 5 85 T 0 85 Z' fill='black'/%3E%3C/svg%3E";

function LinkButton({
  link,
  delay,
}: {
  link: { id: string; label: string; url: string; icon?: string | null; thumbnail_url?: string | null; subtitle?: string };
  delay: string;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative w-full animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: "both" }}
    >
      <div
        className="relative w-full bg-white/95 backdrop-blur-sm text-black shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center h-[5.5rem] px-6 gap-5 overflow-hidden"
        style={{
          maskImage: `url("${SCALLOP_MASK}")`,
          maskSize: "100% 100%",
          WebkitMaskImage: `url("${SCALLOP_MASK}")`,
          WebkitMaskSize: "100% 100%",
        }}
      >
        {/* Logo / Icon */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
          {link.thumbnail_url ? (
            <Image
              src={link.thumbnail_url}
              alt={`${link.label} logo`}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : link.icon ? (
            <DefaultLogoIcon icon={link.icon} size="lg" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white text-xl font-bold">{link.label.charAt(0)}</span>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 text-left flex flex-col min-w-0">
          <span className="font-extrabold text-[0.95rem] leading-tight tracking-tight uppercase truncate">
            {link.label}
          </span>
          {link.subtitle && (
            <span className="text-[0.65rem] font-medium text-black/40 tracking-wider uppercase mt-0.5 truncate">
              {link.subtitle}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
          <ArrowUpRight className="w-4 h-4 opacity-30 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
      </div>
    </a>
  );
}

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-purple-900/20" />
      </div>

      <main className="relative z-10 w-full max-w-[26rem] h-full flex flex-col items-center justify-between px-5 py-8 md:py-10">
        {/* Header */}
        <section className="flex flex-col items-center text-center space-y-3 shrink-0">
          <div className="relative animate-scale-in">
            <div className="absolute -inset-5 bg-white/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-white/20" />
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-white shadow-2xl">
              <Image
                src={profile.image_url}
                alt={profile.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          <div className="animate-fade-in-up text-white space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-lg uppercase">
              {profile.name}
            </h1>
            <div className="flex items-center gap-2 justify-center">
              <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-blue-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <p className="text-[0.6rem] font-bold opacity-70 tracking-[0.25em] uppercase">
                {profile.subtitle}
              </p>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-blue-400" />
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="w-full flex-1 flex flex-col justify-center gap-3 my-3 overflow-y-auto no-scrollbar py-2">
          {mainLinks.map((link, i) => (
            <LinkButton key={link.id} link={link} delay={`${0.15 + i * 0.1}s`} />
          ))}

          {/* Divider */}
          <div className="relative w-full py-3 flex items-center justify-center animate-fade-in" style={{ animationDelay: "0.35s" }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-white/10" />
            </div>
            <div className="relative flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.5em] text-white/40">Media</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          </div>

          {mediaLinks.map((link, i) => (
            <LinkButton key={link.id} link={link} delay={`${0.4 + i * 0.1}s`} />
          ))}
        </section>

        {/* Footer */}
        <footer className="w-full flex flex-col items-center gap-5 shrink-0 animate-fade-in" style={{ animationDelay: "0.65s" }}>
          <div className="flex items-center justify-center gap-6 text-white/70">
            {profile.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.platform] || Instagram;
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/25 hover:scale-110 hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" strokeWidth={1.8} />
                </a>
              );
            })}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            <p className="text-[0.55rem] text-white/25 tracking-[0.5em] uppercase font-bold">&copy; 2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
