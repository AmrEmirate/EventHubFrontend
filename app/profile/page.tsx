"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Star, Gift, Coins, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// 1. Impor fungsi spesifik dan tipe data
import { getMyProfile, updateMyProfile, UserProfile } from "../../lib/apihelper"

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    phone: ""
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 2. Gunakan fungsi getMyProfile yang sudah memiliki tipe
        const response = await getMyProfile();
        
        // TypeScript sekarang tahu tipe dari response.data
        setUser(response.data);
        
        setFormData({
          name: response.data.name || "",
          // Gunakan optional chaining (?) untuk keamanan
          bio: response.data.profile?.bio || "",
          phone: response.data.profile?.phone || ""
        });
      } catch (err) {
        setError("Gagal memuat profil. Silakan coba lagi.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 3. Gunakan fungsi updateMyProfile yang sudah memiliki tipe
      const response = await updateMyProfile(formData);
      
      // TypeScript sekarang tahu bahwa response.data memiliki properti 'data'
      setUser(response.data.data);
      alert("Profil berhasil diperbarui!");

    } catch (err) {
      alert("Gagal memperbarui profil.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (error || !user) {
    return <div className="min-h-screen flex items-center justify-center">{error || "Profil tidak ditemukan."}</div>;
  }
  
  return (
    // ... Sisa kode JSX Anda tidak perlu diubah ...
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="points">Points</TabsTrigger>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="events">My Events</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.profile?.avatarUrl || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>
                  <Separator />

                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={formData.name} onChange={handleFormChange} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={formData.phone} onChange={handleFormChange} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user.email} disabled />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleFormChange} rows={3} />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Gift className="h-5 w-5 mr-2" />Referral Program</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-medium">Your Referral Code</p>
                    <code className="text-lg font-mono bg-background px-2 py-1 rounded">{user.referralCode || 'N/A'}</code>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* ... Sisa Tab Lainnya ... */}

          </Tabs>
        </div>
      </div>
    </div>
  )
}