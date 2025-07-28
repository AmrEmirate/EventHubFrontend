"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Building, LayoutDashboard, LogOut, User, CheckCheck, Info } from "lucide-react";
import { markNotificationsAsRead } from "@/lib/apihelper";
import { toast } from "sonner";

// Komponen untuk satu item notifikasi
function NotificationItem({ message, isRead, createdAt }: { message: string, isRead: boolean, createdAt: string }) {
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return Math.floor(seconds) + " detik lalu";
    };

    return (
        <div className={`p-3 border-b ${isRead ? 'opacity-60' : 'bg-primary/5'}`}>
            <p className="text-sm">{message}</p>
            <p className="text-xs text-muted-foreground mt-1">{timeAgo(createdAt)}</p>
        </div>
    );
}

// Komponen Header Utama
export default function Header() {
  const { user, logout, loading, notifications, fetchNotifications } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async () => {
      if (unreadCount === 0) return;
      try {
          await markNotificationsAsRead();
          await fetchNotifications(); // Refresh list notifikasi
          toast.info("Semua notifikasi ditandai telah dibaca.");
      } catch (error) {
          toast.error("Gagal menandai notifikasi.");
      }
  };

  const getInitials = (name: string = '') => name ? name.charAt(0).toUpperCase() : '?';
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <span role="img" aria-label="calendar emoji">📅</span>
          <span>EventHub</span>
        </Link>
        <nav className="flex items-center gap-2">
          {loading ? (
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          ) : user ? (
            <>
              {/* [BARU] Tombol dan Panel Notifikasi */}
              <Sheet open={isNotifOpen} onOpenChange={setIsNotifOpen}>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                          <Bell className="h-5 w-5" />
                          {unreadCount > 0 && (
                              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                  {unreadCount}
                              </span>
                          )}
                      </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
                      <SheetHeader className="p-4 border-b">
                          <SheetTitle className="flex justify-between items-center">
                              Notifikasi
                              <Button variant="ghost" size="sm" onClick={handleMarkAsRead} disabled={unreadCount === 0}>
                                  <CheckCheck className="mr-2 h-4 w-4"/> Tandai semua dibaca
                              </Button>
                          </SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto">
                          {notifications.length > 0 ? (
                              notifications.map(notif => <NotificationItem key={notif.id} {...notif} />)
                          ) : (
                              <div className="text-center p-8 text-muted-foreground">
                                  <Info className="mx-auto h-10 w-10 mb-4" />
                                  <p>Belum ada notifikasi baru.</p>
                              </div>
                          )}
                      </div>
                  </SheetContent>
              </Sheet>

              {/* Menu Dropdown Profil (tidak berubah) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     <Avatar>
                        <AvatarImage src={user.profile?.avatarUrl ? `${API_BASE_URL}${user.profile.avatarUrl}` : ""} alt={user.name || ''} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
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
                  <DropdownMenuItem asChild><Link href="/profile" className="cursor-pointer flex items-center"><User className="mr-2 h-4 w-4" /><span>Profil Saya</span></Link></DropdownMenuItem>
                  {user.role === 'ORGANIZER' && (<DropdownMenuItem asChild><Link href="/organizer/dashboard" className="cursor-pointer flex items-center"><LayoutDashboard className="mr-2 h-4 w-4" /><span>Dasbor Organizer</span></Link></DropdownMenuItem>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer flex items-center"><LogOut className="mr-2 h-4 w-4" /><span>Logout</span></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
                <Button variant="ghost" asChild><Link href="/auth/login">Sign In</Link></Button>
                <Button asChild><Link href="/auth/register">Sign Up</Link></Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}