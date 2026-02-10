import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מערכת ניהול קליניקה",
  description: "ניהול תלמידים ומפגשים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}