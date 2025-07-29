"use client";

import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Impor semua komponen tab yang sudah dibuat
import ProfileInfoTab from './components/ProfileInfoTab';
import PointsTab from './components/PointsTab';
import CouponsTab from './components/CouponsTab';
import MyEventsTab from './components/MyEventsTab';
import SecurityTab from './components/SecurityTab';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Memuat data pengguna...</p>
        </div>
      );
  }
  
  if (!user) {
      return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-4">
            <p className="text-lg">Anda harus login untuk mengakses halaman ini.</p>
            <Button asChild>
                <Link href="/auth/login">Ke Halaman Login</Link>
            </Button>
        </div>
      );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Profil Saya</h1>
            <p className="text-muted-foreground">Kelola pengaturan dan preferensi akun Anda.</p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/"><ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Home</Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="points">Poin</TabsTrigger>
          <TabsTrigger value="coupons">Kupon</TabsTrigger>
          <TabsTrigger value="my-events">Tiket Saya</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileInfoTab user={user} />
        </TabsContent>
        <TabsContent value="points" className="mt-6">
          <PointsTab user={user} />
        </TabsContent>
        <TabsContent value="coupons" className="mt-6">
          <CouponsTab />
        </TabsContent>
        <TabsContent value="my-events" className="mt-6">
          <MyEventsTab />
        </TabsContent>
        <TabsContent value="security" className="mt-6">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
