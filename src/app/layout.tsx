import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ScheduleMaster — Возьми под контроль своё время",
    template: "%s · ScheduleMaster",
  },
  description:
    "Умное расписание для людей, которые серьёзно относятся к дисциплине.",
  metadataBase: new URL("https://schedulemaster.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="bg-brand-black text-brand-text antialiased">
        {children}
      </body>
    </html>
  );
}
