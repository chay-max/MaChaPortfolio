import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "MaCha — Maxwell Christopher Chay",
    template: "%s · MaCha",
  },
  description:
    "The portfolio of Maxwell Christopher Chay. Student, developer, and technology explorer from Indonesia.",
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
