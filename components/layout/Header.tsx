"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, LayoutDashboard, LogOut, User } from "lucide-react";

// Komponen Header
export default function Header() {
  const { user, logout, loading } = useAuth();

  // Fungsi untuk mendapatkan inisial nama
  const getInitials = (name: string = '') => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="calendar emoji">📅</span>
          <span>EventHub</span>
        </Link>
        <nav>
          {/* Tampilkan placeholder saat loading status otentikasi */}
          {loading ? (
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            // Jika user sudah login, tampilkan menu dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                   <Avatar>
                      <AvatarImage src={user.profile?.avatarUrl || ''} alt={user.name || ''} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'ORGANIZER' && (
                   <DropdownMenuItem asChild>
                     <Link href="/organizer/dashboard" className="cursor-pointer flex items-center">
                       <LayoutDashboard className="mr-2 h-4 w-4" />
                       <span>Dasbor Organizer</span>
                     </Link>
                   </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Jika user belum login, tampilkan tombol Sign In / Sign Up
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                    <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                    <Link href="/auth/register">Sign Up</Link>
                </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}