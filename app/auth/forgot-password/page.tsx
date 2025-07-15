"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { forgotPassword } from '@/lib/apihelper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid.'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      const res = await forgotPassword(data.email);
      setSuccessMessage(res.data.message);
    } catch (err: any) {
      // Untuk keamanan, kita tidak menampilkan error spesifik, tapi tetap memberikan feedback positif.
      setSuccessMessage("Jika email Anda terdaftar dan terverifikasi, Anda akan menerima link untuk mereset password.");
    } finally {
      setLoading(false);
    }
  };

  // Tampilan setelah form dikirim
  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center p-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl mb-2">Permintaan Terkirim</CardTitle>
          <CardDescription className="mb-6">{successMessage}</CardDescription>
          <Button asChild>
            <Link href="/auth/login">Kembali ke Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // Tampilan form utama
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Lupa Password</CardTitle>
          <CardDescription>Masukkan email Anda. Kami akan mengirimkan link untuk mereset password Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@anda.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Link Reset
              </Button>
               <Button variant="link" className="w-full" asChild>
                    <Link href="/auth/login"><ArrowLeft className="h-4 w-4 mr-2"/>Batal</Link>
                </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}