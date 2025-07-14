"use client"

import type React from "react"
import axios from 'axios';
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Define the state type
interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false); // Untuk toggle password visibility
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mengirim data login ke backend menggunakan Axios
      interface LoginResponse {
        token: string;
      }

      const response = await axios.post<LoginResponse>('http://localhost:8000/api/v1/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      // Menangani respon sukses (misalnya, menyimpan token di localStorage)
      console.log("Login berhasil:", response.data);
      // Misalnya menyimpan token:
      localStorage.setItem('authToken', response.data.token);

      // Redirect atau tampilan lanjutan
      window.location.href = '/dashboard'; // Arahkan ke halaman dashboard setelah login sukses
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Login gagal! Cek kembali email dan password.");
    }
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-sm text-center text-muted-foreground">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:underline">Sign up</Link>
          </p>
          <p className="text-xs text-center text-muted-foreground">
            <Link href="/" className="hover:underline">Back to Home</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
