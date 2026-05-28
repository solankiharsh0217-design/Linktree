import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linktree — Choose a Style",
  description: "Portfolio landing pages by Marjan van Aubel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
