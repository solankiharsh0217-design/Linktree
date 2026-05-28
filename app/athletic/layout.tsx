import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marjan van Aubel — Athletic",
  description: "Portfolio reviews, interview tips, and career advice",
};

export default function AthleticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
