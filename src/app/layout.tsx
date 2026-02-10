import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "מערכת ניהול ומעקב",
  description: "ניהול מטופלים ומפגשים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="flex h-screen bg-[#f8fafc] overflow-hidden">
        <Sidebar />
        <main className="flex-1 h-screen overflow-hidden relative">
          {children}
        </main>
      </body>
    </html>
  );
}