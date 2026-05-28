import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getProfile();

  // If no profile or no variant selected, show the cloud variant by default
  const variant = profile?.selected_variant || "cloud";

  // Redirect to the selected variant
  if (variant === "athletic") {
    redirect("/athletic");
  }

  // Default: cloud variant (rendered inline, no redirect needed)
  redirect("/cloud");
}
