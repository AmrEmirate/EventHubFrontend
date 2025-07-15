import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 1. Impor AuthProvider dan Header
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventHub - Discover Amazing Events",
  description: "Your premier destination for discovering and managing amazing events in Indonesia",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Bungkus semua konten dengan AuthProvider */}
        <AuthProvider>
          {/* 3. Gunakan Header dinamis di sini */}
          <Header />
          {/* 4. Semua halaman lain akan dirender di dalam {children} */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}