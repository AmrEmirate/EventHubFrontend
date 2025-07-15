"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { register as apiRegister } from '@/lib/apihelper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle, Eye, EyeOff, User, Building } from 'lucide-react';

// [PERBAIKAN] Skema disederhanakan untuk mengatasi error TypeScript
const registerFormSchema = z.object({
  name: z.string().min(3, { message: 'Nama lengkap minimal 3 karakter.' }),
  email: z.string().email({ message: 'Format email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter.' }),
  confirmPassword: z.string().min(6, { message: 'Konfirmasi password minimal 6 karakter.' }),
  // Menghapus objek pesan error kustom untuk sementara
  role: z.enum(['CUSTOMER', 'ORGANIZER']), 
  referralCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 'CUSTOMER',
      referralCode: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const { confirmPassword, ...dataToSend } = data;
      await apiRegister(dataToSend);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md text-center p-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl mb-2">Registrasi Berhasil!</CardTitle>
          <CardDescription className="mb-6">
            Kami telah mengirimkan link verifikasi ke email Anda. Silakan periksa kotak masuk untuk mengaktifkan akun.
          </CardDescription>
          <Button asChild>
            <Link href="/auth/login">Kembali ke Halaman Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join EventHub and start discovering amazing events</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><RadioGroupItem value="CUSTOMER" /></FormControl>
                          <FormLabel className="font-normal flex items-center gap-2"><User size={16}/> Customer</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><RadioGroupItem value="ORGANIZER" /></FormControl>
                          <FormLabel className="font-normal flex items-center gap-2"><Building size={16}/> Event Organizer</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="email" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField name="password" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} placeholder="Create password" {...field} />
                           <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField name="confirmPassword" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" {...field} />
                             <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField name="referralCode" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referral Code (Optional)</FormLabel>
                    <FormControl><Input placeholder="Enter referral code" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && <p className="text-sm text-red-500 text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="p-6 pt-0 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline font-semibold">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}