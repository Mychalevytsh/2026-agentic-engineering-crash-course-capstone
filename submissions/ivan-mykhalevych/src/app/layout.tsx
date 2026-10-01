import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import Background from "@/components/Background";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ProfileSwitcher from "@/components/ProfileSwitcher";
import SiteNav from "@/components/SiteNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Java Interview Prep",
  description: "Train typical Java interview questions by level",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">
        <Background />
        <header className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <SiteNav />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <LanguageSwitcher />
            <ProfileSwitcher />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
