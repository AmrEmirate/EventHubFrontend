"use client";
import { useState } from "react";
import { changePassword } from "@/lib/apihelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "sonner"; // [PERBAIKAN] Impor dari sonner

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Password lama tidak boleh kosong.'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter.'),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecurityTab() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormData) => {
    setLoading(true);
    try {
      await changePassword(data);
      // [PERBAIKAN] Menggunakan toast dari sonner
      toast.success("Berhasil!", { description: "Password Anda telah berhasil diperbarui." });
      reset(); 
    } catch (err: any) {
      toast.error("Gagal", { description: err.response?.data?.message || "Terjadi kesalahan." });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keamanan Akun</CardTitle>
        <CardDescription>Ubah password akun Anda secara berkala untuk menjaga keamanan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-sm">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Password Saat Ini</Label>
            <Input id="oldPassword" type="password" {...register('oldPassword')} />
            {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input id="newPassword" type="password" {...register('newPassword')} />
             {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ubah Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}