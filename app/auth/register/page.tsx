// frontend/app/auth/register/page.tsx

"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation" // 1. Gunakan useRouter dari Next.js
import Link from "next/link"
import { Eye, EyeOff, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// Hapus Textarea jika tidak ada di backend, atau pastikan backend bisa menerimanya.
// import { Textarea } from "@/components/ui/textarea"
import { register } from "../../../lib/apihelper" // 2. Impor fungsi `register` dari apihelper

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // 3. State yang lebih sederhana, fokus pada apa yang dikirim ke API
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER", // 4. Sesuaikan dengan nilai enum di backend ('CUSTOMER'/'ORGANIZER')
    referralCode: "",
  })
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State untuk pesan error
  const router = useRouter(); // Inisialisasi router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi Sederhana di Frontend
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 5. Kirim data yang bersih ke backend, tanpa `confirmPassword`
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        referralCode: formData.referralCode || undefined, // Kirim undefined jika kosong
      };
      
      const response = await register(dataToSend); // Gunakan fungsi dari apihelper
      
      console.log("Registration successful:", response.data)
      
      // 6. Redirect menggunakan Next.js Router
      router.push("/auth/login");

    } catch (err: any) {
      console.error("Registration failed:", err)
      // 7. Penanganan error yang lebih baik
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Tampilkan pesan dari backend (cth: "Email sudah terdaftar")
      } else {
        setError("Registrasi gagal! Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  // Komponen referral code yang tidak fungsional telah dihapus sementara
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join EventHub and start discovering amazing events</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Account Type</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={handleRoleChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CUSTOMER" id="customer" />
                  <Label htmlFor="customer" className="flex items-center cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Customer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ORGANIZER" id="organizer" />
                  <Label htmlFor="organizer" className="flex items-center cursor-pointer">
                    <Building className="h-4 w-4 mr-2" />
                    Event Organizer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code (Optional)</Label>
              <Input
                id="referralCode"
                placeholder="Enter referral code"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </div>
            
            {/* Tampilkan pesan error jika ada */}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}