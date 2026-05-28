import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — Linktree",
  description: "Manage your profile, links, and socials",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
