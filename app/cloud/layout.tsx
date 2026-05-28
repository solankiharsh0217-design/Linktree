import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marjan van Aubel — Cloud Outline",
  description: "Portfolio reviews, interview tips, and career advice",
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
