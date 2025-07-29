"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserProfile, updateMyProfile, updateMyAvatar } from '@/lib/apihelper'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Gift } from 'lucide-react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';

const profileSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter.'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit.').optional().or(z.literal('')),
  bio: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileInfoTab({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { fetchUser } = useAuth(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      bio: user.profile?.bio || "",
    },
  });

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Kode Disalin!", {
      description: "Kode referral Anda telah berhasil disalin.",
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateMyProfile(data);
      await fetchUser();
      toast.success("Sukses!", { description: 'Informasi profil Anda telah berhasil diperbarui.' });
    } catch (error) {
      toast.error("Gagal", { description: 'Tidak dapat memperbarui profil.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setAvatarLoading(true);
    try {
      await updateMyAvatar(formData);
      await fetchUser(); 
      toast.success("Foto profil berhasil diunggah!");
    } catch (err: any) {
      toast.error("Gagal Mengunggah", {
        description: err.response?.data?.message || "Ukuran file mungkin terlalu besar (maks 5MB).",
      });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  const avatarSrc = user.profile?.avatarUrl ? `${API_BASE_URL}${user.profile.avatarUrl}` : "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Perbarui informasi personal dan kontak Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/png, image/jpeg"
            aria-label="Upload foto profil" 
          />
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20" key={avatarSrc}>
                <AvatarImage src={avatarSrc} alt={user.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" onClick={handleAvatarButtonClick} disabled={avatarLoading}>
                  {avatarLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ubah Foto
                </Button>
                <p className="text-xs text-muted-foreground mt-2">JPG atau PNG. Ukuran maksimal 5MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" {...form.register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" {...form.register('phone')} placeholder="0812..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" value={user.email} disabled className="cursor-not-allowed bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...form.register('bio')} placeholder="Ceritakan sedikit tentang diri Anda..." />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift size={20} />
            Program Referral
          </CardTitle>
          {/* [PERBAIKAN] Ubah teks dari 15.000 menjadi 10.000 */}
          <CardDescription>
            Bagikan kode di bawah ini. Teman Anda akan mendapat kupon diskon saat mendaftar, dan Anda akan mendapat 10,000 poin!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Kode Referral Anda</Label>
          <div 
            className="w-full bg-muted p-3 rounded-md flex items-center justify-between cursor-pointer mt-2"
            onClick={() => copyToClipboard(user.referralCode || '')}
          >
            <span className="font-mono text-lg tracking-widest">{user.referralCode || 'N/A'}</span>
            <Button variant="ghost" size="sm">Salin Kode</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
