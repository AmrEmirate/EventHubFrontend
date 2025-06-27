"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Users, Star, Clock, Tag, Share2, Heart, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EventDetailPage() {
  const params = useParams()
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Mock event data - in real app, fetch based on params.id
  const event = {
    id: params.id,
    title: "Tech Conference 2024",
    description:
      "Join the biggest tech conference in Indonesia with industry leaders and innovators. This comprehensive event will cover the latest trends in technology, artificial intelligence, blockchain, and digital transformation.",
    longDescription: `
    <p>The Tech Conference 2024 is Indonesia's premier technology event, bringing together industry leaders, innovators, and tech enthusiasts for a day of learning, networking, and inspiration.</p>
    
    <h3>What to Expect:</h3>
    <ul>
      <li>Keynote speeches from tech industry leaders</li>
      <li>Panel discussions on emerging technologies</li>
      <li>Hands-on workshops and technical sessions</li>
      <li>Networking opportunities with peers and experts</li>
      <li>Exhibition showcasing latest tech products</li>
    </ul>
    
    <h3>Schedule:</h3>
    <ul>
      <li>09:00 - 10:00: Registration & Welcome Coffee</li>
      <li>10:00 - 11:30: Opening Keynote</li>
      <li>11:45 - 12:45: Technical Sessions</li>
      <li>13:00 - 14:00: Lunch & Networking</li>
      <li>14:00 - 15:30: Panel Discussions</li>
      <li>15:45 - 17:00: Workshops & Closing</li>
    </ul>
  `,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    price: 500000,
    isFree: false,
    startDate: "2024-03-15T09:00:00",
    endDate: "2024-03-15T17:00:00",
    location: "Jakarta Convention Center",
    fullAddress: "Jl. Gatot Subroto, Jakarta Pusat, DKI Jakarta 10270",
    category: "Technology",
    availableSeats: 150,
    totalSeats: 500,
    organizer: {
      id: "org1",
      name: "TechEvents ID",
      rating: 4.8,
      totalReviews: 124,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Leading technology event organizer in Indonesia, specializing in conferences, workshops, and tech meetups.",
      totalEvents: 45,
      joinedDate: "2020-01-15",
    },
    hasPromotion: true,
    promotions: [
      {
        id: "promo1",
        title: "Early Bird Discount",
        description: "Get 20% off for early registration",
        discountPercent: 20,
        validUntil: "2024-03-01T23:59:59",
        code: "EARLYBIRD20",
      },
    ],
    ticketTypes: [
      {
        id: "regular",
        name: "Regular Ticket",
        price: 500000,
        description: "Access to all sessions and networking lunch",
        available: 150,
      },
      {
        id: "vip",
        name: "VIP Ticket",
        price: 750000,
        description: "All regular benefits plus VIP seating and exclusive networking session",
        available: 25,
      },
    ],
    reviews: [
      {
        id: "review1",
        user: {
          name: "Ahmad Rizki",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
        },
        rating: 5,
        comment:
          "Amazing event! Great speakers and excellent organization. Learned a lot about the latest tech trends.",
        date: "2024-01-15",
        helpful: 12,
      },
      {
        id: "review2",
        user: {
          name: "Sarah Putri",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
        },
        rating: 4,
        comment: "Very informative sessions. The networking opportunities were valuable. Venue was perfect.",
        date: "2024-01-10",
        helpful: 8,
      },
    ],
  }

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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDiscountedPrice = (originalPrice: number, discountPercent: number) => {
    return originalPrice - (originalPrice * discountPercent) / 100
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
              <CalendarDays className="h-8 w-8" />
              <span>EventHub</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-primary">
                Browse Events
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            <div className="relative">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
              {event.hasPromotion && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white">Special Promo!</Badge>
              )}
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{event.category}</Badge>
                <Badge variant={event.isFree ? "secondary" : "default"}>
                  {event.isFree ? "FREE" : formatPrice(event.price)}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{event.description}</p>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm">{formatDate(event.startDate)}</p>
                    <p className="text-sm">to {formatDate(event.endDate)}</p>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{event.location}</p>
                    <p className="text-xs">{event.fullAddress}</p>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-sm">
                      {event.availableSeats} of {event.totalSeats} seats available
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm">8 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="organizer">Organizer</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({event.reviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.longDescription }} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="organizer" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{event.organizer.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span>
                              {event.organizer.rating} ({event.organizer.totalReviews} reviews)
                            </span>
                          </div>
                          <span>{event.organizer.totalEvents} events organized</span>
                        </div>
                        <p className="text-muted-foreground mb-4">{event.organizer.bio}</p>
                        <Link href={`/organizers/${event.organizer.id}`}>
                          <Button variant="outline">View Profile</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {event.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.user.name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-2">{review.comment}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{new Date(review.date).toLocaleDateString("id-ID")}</span>
                              <span>{review.helpful} people found this helpful</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Get Your Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Promotions */}
                {event.hasPromotion &&
                  event.promotions.map((promo) => (
                    <div key={promo.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <Tag className="h-4 w-4 text-red-600 mr-2" />
                        <span className="font-semibold text-red-600">{promo.title}</span>
                      </div>
                      <p className="text-sm text-red-700 mb-2">{promo.description}</p>
                      <div className="flex items-center justify-between">
                        <code className="bg-red-100 px-2 py-1 rounded text-sm font-mono">{promo.code}</code>
                        <span className="text-xs text-red-600">
                          Valid until {new Date(promo.validUntil).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}

                {/* Ticket Types */}
                <div className="space-y-3">
                  {event.ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{ticket.name}</h4>
                        <div className="text-right">
                          {event.hasPromotion && (
                            <p className="text-sm text-muted-foreground line-through">{formatPrice(ticket.price)}</p>
                          )}
                          <p className="font-bold text-lg">
                            {formatPrice(
                              event.hasPromotion
                                ? calculateDiscountedPrice(ticket.price, event.promotions[0].discountPercent)
                                : ticket.price,
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                      <p className="text-xs text-muted-foreground">{ticket.available} tickets available</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Link href={`/checkout/${event.id}`}>
                    <Button className="w-full" size="lg">
                      Buy Tickets
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Organizer
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Secure payment powered by EventHub</p>
                  <p>Free cancellation up to 24 hours before event</p>
                </div>
              </CardContent>
            </Card>

            {/* Similar Events */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "AI & Machine Learning Summit 2024",
                    date: "March 20, 2024",
                    price: "Rp 750,000",
                    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&h=80&fit=crop",
                  },
                  {
                    id: 2,
                    title: "Blockchain Developer Conference",
                    date: "March 25, 2024",
                    price: "Rp 650,000",
                    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=80&fit=crop",
                  },
                  {
                    id: 3,
                    title: "Cybersecurity Workshop",
                    date: "April 2, 2024",
                    price: "Rp 450,000",
                    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=120&h=80&fit=crop",
                  },
                ].map((similarEvent) => (
                  <div key={similarEvent.id} className="flex space-x-3">
                    <Image
                      src={similarEvent.image || "/placeholder.svg"}
                      alt="Similar event"
                      width={80}
                      height={60}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{similarEvent.title}</h4>
                      <p className="text-xs text-muted-foreground">{similarEvent.date}</p>
                      <p className="text-xs font-semibold">{similarEvent.price}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
