import React from "react";

const LOGOS: Record<string, { svg: React.ReactNode; bg: string; label: string }> = {
  youtube: {
    bg: "bg-red-600",
    label: "YouTube",
    svg: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  laptop: {
    bg: "bg-blue-600",
    label: "Website",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M2 17h20" />
        <path d="M6 21h12" />
        <path d="M10 21v-2" />
        <path d="M14 21v-2" />
      </svg>
    ),
  },
  mic: {
    bg: "bg-purple-600",
    label: "Podcast",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full p-1.5">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
  },
  play: {
    bg: "bg-green-600",
    label: "Video",
    svg: (
      <svg viewBox="0 0 24 24" fill="white" className="w-full h-full p-2">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    ),
  },
};

export function getDefaultLogo(icon: string | null | undefined) {
  return icon ? LOGOS[icon] || null : null;
}

export function DefaultLogoIcon({
  icon,
  size = "md",
}: {
  icon: string | null | undefined;
  size?: "sm" | "md" | "lg";
}) {
  const logo = icon ? LOGOS[icon] : null;
  if (!logo) return null;

  const dims = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };

  return (
    <div className={`${dims[size]} ${logo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
      {logo.svg}
    </div>
  );
}

export const ICON_OPTIONS = [
  { value: "", label: "None" },
  { value: "youtube", label: "YouTube" },
  { value: "laptop", label: "Website" },
  { value: "mic", label: "Podcast" },
  { value: "play", label: "Play" },
];
