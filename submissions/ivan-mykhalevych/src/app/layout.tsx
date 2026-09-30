import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import Background from "@/components/Background";
import ProfileSwitcher from "@/components/ProfileSwitcher";
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
          <nav className="flex items-center gap-4 font-mono text-sm">
            <Link href="/" className="text-muted hover:text-accent">
              Java Trainer
            </Link>
            <Link href="/dashboard" className="text-muted hover:text-accent">
              Dashboard
            </Link>
            <Link href="/logs" className="text-muted hover:text-accent">
              Logs
            </Link>
          </nav>
          <ProfileSwitcher />
        </header>
        {children}
      </body>
    </html>
  );
}
