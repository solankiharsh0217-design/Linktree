import { getProfile } from "@/lib/data";
import AthleticVariant from "@/components/athletic/AthleticVariant";
import type { ProfileData } from "@/lib/types";

const FALLBACK: ProfileData = {
  id: "1",
  name: "DENA PRESLEY",
  subtitle: "Long Distance Runner",
  image_url: "https://picsum.photos/id/1005/240/240",
  selected_variant: "athletic",
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

export default async function AthleticPage() {
  const profile = (await getProfile()) || FALLBACK;
  return <AthleticVariant profile={profile} />;
}
