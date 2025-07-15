import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
// 1. Impor Toaster
import { Toaster } from 'react-hot-toast';

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
        <AuthProvider>
          {/* 2. Tambahkan komponen Toaster di sini */}
          <Toaster position="top-center" reverseOrder={false} />
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
