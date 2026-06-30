import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Donut IT",
  description: "ระบบช่วยคำนวณและจัดการงานร้าน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
