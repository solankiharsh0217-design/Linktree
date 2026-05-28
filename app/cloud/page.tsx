import { getProfile } from "@/lib/data";
import CloudVariant from "@/components/cloud/CloudVariant";
import type { ProfileData } from "@/lib/types";

const FALLBACK: ProfileData = {
  id: "1",
  name: "Marjan van Aubel",
  subtitle: "Portfolio reviews, interview tips, and career advice",
  image_url: "https://picsum.photos/id/1027/240/240",
  selected_variant: "cloud",
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
  return <CloudVariant profile={profile} />;
}
