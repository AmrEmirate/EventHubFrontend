"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, MapPin, Users, Star, Filter, CalendarDays } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"
import { MobileNav } from "@/components/mobile-nav"

interface Event {
  id: string
  title: string
  description: string
  image: string
  price: number
  isFree: boolean
  startDate: string
  endDate: string
  location: string
  category: string
  availableSeats: number
  totalSeats: number
  organizer: {
    name: string
    rating: number
  }
  hasPromotion: boolean
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2024",
    description: "Join the biggest tech conference in Indonesia with industry leaders and innovators.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    price: 500000,
    isFree: false,
    startDate: "2024-03-15T09:00:00",
    endDate: "2024-03-15T17:00:00",
    location: "Jakarta Convention Center",
    category: "Technology",
    availableSeats: 150,
    totalSeats: 500,
    organizer: {
      name: "TechEvents ID",
      rating: 4.8,
    },
    hasPromotion: true,
  },
  {
    id: "2",
    title: "Music Festival Bandung",
    description: "Experience the best local and international artists in this amazing music festival.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    price: 0,
    isFree: true,
    startDate: "2024-04-20T18:00:00",
    endDate: "2024-04-21T23:00:00",
    location: "Bandung Creative Hub",
    category: "Music",
    availableSeats: 2000,
    totalSeats: 2000,
    organizer: {
      name: "Bandung Music Collective",
      rating: 4.5,
    },
    hasPromotion: false,
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to top investors and win amazing prizes.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop",
    price: 150000,
    isFree: false,
    startDate: "2024-03-25T13:00:00",
    endDate: "2024-03-25T18:00:00",
    location: "Surabaya Business Center",
    category: "Business",
    availableSeats: 75,
    totalSeats: 200,
    organizer: {
      name: "Startup Indonesia",
      rating: 4.7,
    },
    hasPromotion: true,
  },
  {
    id: "4",
    title: "Digital Marketing Workshop",
    description: "Learn the latest digital marketing strategies from industry experts.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    price: 250000,
    isFree: false,
    startDate: "2024-04-05T10:00:00",
    endDate: "2024-04-05T16:00:00",
    location: "Jakarta Business Center",
    category: "Business",
    availableSeats: 80,
    totalSeats: 100,
    organizer: {
      name: "Digital Marketing Pro",
      rating: 4.6,
    },
    hasPromotion: false,
  },
  {
    id: "5",
    title: "Art Exhibition 2024",
    description: "Discover amazing artworks from local and international artists.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    price: 75000,
    isFree: false,
    startDate: "2024-04-12T09:00:00",
    endDate: "2024-04-14T18:00:00",
    location: "National Gallery Jakarta",
    category: "Arts",
    availableSeats: 300,
    totalSeats: 500,
    organizer: {
      name: "Art Gallery Indonesia",
      rating: 4.9,
    },
    hasPromotion: true,
  },
  {
    id: "6",
    title: "Yoga & Wellness Retreat",
    description: "Rejuvenate your mind and body with our comprehensive wellness program.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=400&fit=crop",
    price: 350000,
    isFree: false,
    startDate: "2024-04-18T07:00:00",
    endDate: "2024-04-20T17:00:00",
    location: "Bali Wellness Center",
    category: "Health",
    availableSeats: 40,
    totalSeats: 50,
    organizer: {
      name: "Wellness Bali",
      rating: 4.8,
    },
    hasPromotion: false,
  },
]

const categories = ["All", "Technology", "Music", "Business", "Sports", "Education", "Arts"]
const locations = ["All", "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Bali"]

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          event.organizer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    // Filter by location
    if (selectedLocation !== "All") {
      filtered = filtered.filter((event) => event.location.includes(selectedLocation))
    }

    setFilteredEvents(filtered)
  }, [debouncedSearchTerm, selectedCategory, selectedLocation, events])

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
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
              <MobileNav currentPath="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6">Discover Amazing Events</h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90">
            Find and join the best events in Indonesia
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search events, organizers, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-4 md:py-6 text-base md:text-lg bg-white text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 md:py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Filter Events:</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl md:text-6xl mb-4">🔍</div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search criteria or browse all events</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setSelectedLocation("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={300}
                      height={200}
                      className="w-full h-40 md:h-48 object-cover"
                    />
                    {event.hasPromotion && <Badge className="absolute top-2 right-2 bg-red-500 text-xs">Promo!</Badge>}
                    <Badge variant={event.isFree ? "secondary" : "default"} className="absolute top-2 left-2 text-xs">
                      {event.isFree ? "FREE" : formatPrice(event.price)}
                    </Badge>
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base md:text-lg line-clamp-2">{event.title}</CardTitle>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {event.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-0">
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      <span className="truncate">{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-muted-foreground">
                      <Users className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      <span>
                        {event.availableSeats} / {event.totalSeats} seats available
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-xs md:text-sm">
                        <span className="mr-2 truncate">by {event.organizer.name}</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{event.organizer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/events/${event.id}`} className="w-full">
                      <Button className="w-full" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EventHub</h3>
              <p className="text-muted-foreground text-sm">
                Your premier destination for discovering and managing amazing events in Indonesia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Attendees</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/">Browse Events</Link>
                </li>
                <li>
                  <Link href="/my-tickets">My Tickets</Link>
                </li>
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizers</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/organizer/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/organizer/create-event">Create Event</Link>
                </li>
                <li>
                  <Link href="/organizer/analytics">Analytics</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-6 md:mt-8 pt-6 md:pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
