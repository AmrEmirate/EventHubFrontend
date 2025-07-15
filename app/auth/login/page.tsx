// frontend/app/auth/login/page.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext"; // 1. Impor hook useAuth
import { login as loginApi } from "../../../lib/apihelper"; // 2. Ganti nama fungsi API agar tidak konflik

export default function LoginPage() {
  const { login } = useAuth(); // 3. Ambil fungsi login dari context
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Panggil API secara langsung
      const response = await loginApi(formData);
      
      // 4. Panggil fungsi login dari context dengan token yang didapat
      login(response.data.token);

      // Navigasi akan ditangani oleh AuthContext setelah profil berhasil diambil

    } catch (err: any) {
      console.error("Login gagal:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login gagal! Cek kembali email dan password.");
      }
      setLoading(false); // Pastikan loading berhenti jika ada error
    }
    // `finally` dihapus karena loading dan navigasi dikelola oleh context
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your EventHub account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}