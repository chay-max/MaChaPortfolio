import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "MaCha — Maxwell Christopher Chay",
    template: "%s · MaCha",
  },
  description:
    "Portfolio Maxwell Christopher Chay. Pelajar, pengembang, dan penjelajah teknologi dari Indonesia.",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
