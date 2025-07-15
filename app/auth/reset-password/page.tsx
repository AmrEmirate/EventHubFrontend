"use client";

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPassword } from '@/lib/apihelper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter.'),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordComponent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { newPassword: "" },
    });
    
    useEffect(() => {
        if (!token) {
            setError("Token tidak ditemukan atau tidak valid. Silakan coba minta link baru.");
        }
    }, [token]);


    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            await resetPassword({ token, newPassword: data.newPassword });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mereset password.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Card className="w-full max-w-md text-center p-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl mb-2">Password Berhasil Direset!</CardTitle>
                <CardDescription className="mb-6">Anda sekarang dapat login dengan password baru Anda.</CardDescription>
                <Button asChild>
                    <Link href="/auth/login">Ke Halaman Login</Link>
                </Button>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Atur Password Baru</CardTitle>
                <CardDescription>Masukkan password baru Anda di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent>
                {token ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password Baru</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan Password Baru
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <p className="text-red-500 text-center">{error}</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin"/>}>
                <ResetPasswordComponent />
            </Suspense>
        </div>
    );
}