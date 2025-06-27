"use client"

import { useState } from "react"
import { Calendar, Star, Gift, Coins, Eye, EyeOff } from "lucide-react"
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

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Mock user data
  const user = {
    id: "user1",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    phone: "+62 812-3456-7890",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Tech enthusiast and event lover. Always looking for new learning opportunities.",
    joinDate: "2023-01-15",
    referralCode: "AHMAD2024",
    points: 25000,
    pointsExpiry: "2024-06-15",
    role: "customer",
  }

  const coupons = [
    {
      id: "coupon1",
      title: "Welcome Discount",
      description: "10% off for your first event",
      discountPercent: 10,
      code: "WELCOME10",
      expiryDate: "2024-06-15",
      isUsed: false,
    },
    {
      id: "coupon2",
      title: "Referral Bonus",
      description: "15% off from referral program",
      discountPercent: 15,
      code: "REF15BONUS",
      expiryDate: "2024-05-20",
      isUsed: true,
    },
  ]

  const pointsHistory = [
    {
      id: "p1",
      description: "Referral bonus from Sarah Putri",
      points: 10000,
      date: "2024-02-15",
      type: "earned",
      expiryDate: "2024-05-15",
    },
    {
      id: "p2",
      description: "Used for Tech Conference 2024",
      points: -5000,
      date: "2024-02-10",
      type: "used",
    },
    {
      id: "p3",
      description: "Referral bonus from Budi Santoso",
      points: 10000,
      date: "2024-01-20",
      type: "earned",
      expiryDate: "2024-04-20",
    },
  ]

  const attendedEvents = [
    {
      id: "event1",
      title: "Tech Conference 2024",
      date: "2024-01-15",
      rating: 5,
      review: "Amazing event! Great speakers and excellent organization.",
      organizer: "TechEvents ID",
    },
    {
      id: "event2",
      title: "Startup Pitch Night",
      date: "2024-01-10",
      rating: 4,
      review: "Very informative and well organized event.",
      organizer: "Startup Indonesia",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode)
    // Show toast notification
    alert("Referral code copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
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

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Form */}
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.name} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself..." defaultValue={user.bio} rows={3} />
                    </div>

                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Referral Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2" />
                    Referral Program
                  </CardTitle>
                  <CardDescription>Invite friends and earn 10,000 points for each successful referral</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Your Referral Code</p>
                        <code className="text-lg font-mono bg-background px-2 py-1 rounded">{user.referralCode}</code>
                      </div>
                      <Button variant="outline" onClick={copyReferralCode}>
                        Copy Code
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Share this code with friends. When they sign up using your code, they get a discount coupon and
                      you earn 10,000 points!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Points Tab */}
            <TabsContent value="points" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    Points Balance
                  </CardTitle>
                  <CardDescription>Use points to get discounts on event tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold text-primary mb-2">{formatPrice(user.points)}</div>
                    <p className="text-muted-foreground">Points expire on {formatDate(user.pointsExpiry)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Points History</CardTitle>
                  <CardDescription>Track your points earnings and usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Expires</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pointsHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>
                            <span className={item.type === "earned" ? "text-green-600" : "text-red-600"}>
                              {item.type === "earned" ? "+" : ""}
                              {formatPrice(item.points)}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(item.date)}</TableCell>
                          <TableCell>{item.expiryDate ? formatDate(item.expiryDate) : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Coupons Tab */}
            <TabsContent value="coupons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Coupons</CardTitle>
                  <CardDescription>Available discount coupons for events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`border rounded-lg p-4 ${
                          coupon.isUsed ? "opacity-50 bg-muted/30" : "bg-gradient-to-r from-primary/5 to-primary/10"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{coupon.title}</h4>
                            <p className="text-sm text-muted-foreground">{coupon.description}</p>
                          </div>
                          <Badge variant={coupon.isUsed ? "secondary" : "default"}>{coupon.discountPercent}% OFF</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <code className="bg-background px-2 py-1 rounded text-sm font-mono">{coupon.code}</code>
                            {coupon.isUsed && <Badge variant="secondary">Used</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">Expires: {formatDate(coupon.expiryDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {coupons.length === 0 && (
                    <div className="text-center py-8">
                      <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No coupons available</h3>
                      <p className="text-muted-foreground">
                        Use referral codes or participate in promotions to get discount coupons
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attended Events</CardTitle>
                  <CardDescription>Events you have attended and reviewed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendedEvents.map((event) => (
                      <div key={event.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              by {event.organizer} • {formatDate(event.date)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < event.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.review}</p>
                      </div>
                    ))}
                  </div>

                  {attendedEvents.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No events attended yet</h3>
                      <p className="text-muted-foreground">Start exploring and attending events to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
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

                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Basic information about your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground">Customer Account</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">{formatDate(user.joinDate)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-muted-foreground">Your email is verified</p>
                    </div>
                    <Badge variant="default">Verified</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
