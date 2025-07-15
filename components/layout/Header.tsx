// frontend/components/layout/Header.tsx

"use client";

import Link from "next/link";
// 1. Tambahkan "Building" dari lucide-react
import { CalendarDays, LogOut, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext"; 
import { 
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
            <CalendarDays className="h-8 w-8" />
            <span>EventHub</span>
          </Link>
          <nav>
            {loading ? (
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                        <AvatarImage src={user.profile?.avatarUrl || ''} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile"><DropdownMenuItem className="cursor-pointer"><User className="mr-2 h-4 w-4" />Profil</DropdownMenuItem></Link>
                  
                  {/* 2. Tambahkan baris ini untuk tautan ke dashboard organizer */}
                  <Link href="/organizer/dashboard"><DropdownMenuItem className="cursor-pointer"><Building className="mr-2 h-4 w-4" />Organizer Dashboard</DropdownMenuItem></Link>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login"><Button variant="ghost">Login</Button></Link>
                <Link href="/auth/register"><Button>Sign Up</Button></Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}